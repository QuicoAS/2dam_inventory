import {
  Post,
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileResponseVm } from './view-models/file-response-vm.model';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { InventariService } from 'src/inventari/inventari.service';
import { ObjectId } from 'mongodb';

@Controller('/files')
@ApiTags('files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private readonly inventariService: InventariService,
  ) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('file'))
  @ApiOperation({ summary: 'Carrega un fitxer al servidor.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'Fitxers carregats', type: 'string', isArray: true })
  @ApiResponse({ status: 201, description: 'Fitxer carregat correctament.' })
  upload(@UploadedFiles() files) {
    console.log(files);
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get('info/:id')
  @ApiOperation({ summary: "Obté la informació d'un fitxer." })
  @ApiParam({ name: 'id', description: 'ID del fitxer', type: 'string' })
  @ApiResponse({ status: 200, description: 'Informació del fitxer retornada.' })
  async getFileInfo(@Param('id') id: string): Promise<FileResponseVm> {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file info',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been detected',
      file: file,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obté un fitxer pel seu ID.' })
  @ApiParam({ name: 'id', description: 'ID del fitxer', type: 'string' })
  @ApiResponse({ status: 200, description: 'Fitxer retornat correctament.' })
  async getFile(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }

  @Get('download/:id')
  @ApiOperation({ summary: 'Descarrega un fitxer pel seu ID.' })
  @ApiParam({ name: 'id', description: 'ID del fitxer', type: 'string' })
  @ApiResponse({ status: 200, description: 'Fitxer descarregat correctament.' })
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }

  @Get('delete/:id')
  @ApiOperation({ summary: 'Elimina un fitxer pel seu ID.' })
  @ApiParam({ name: 'id', description: 'ID del fitxer', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Fitxer eliminat correctament.',
  })
  async deleteFile(@Param('id') id: string): Promise<FileResponseVm> {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.deleteFile(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: file,
    };
  }

  @Post('device_info')
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/json') {
          return callback(new Error('Solo se permiten archivos JSON'), false);
        }
        callback(null, true);
      },
    }),
  )
  uploadDeviceInfo(@UploadedFiles() files) {
    const response = [];
    files.forEach(async (file) => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      response.push(fileReponse);
      const fileId = file.id as ObjectId;
      if (!fileId) {
        throw new Error('No se proporcionó un ID de archivo válido.');
      }
      const numSerie = await this.filesService.processJsonStream(fileId);
      this.inventariService.vincularArchivo(numSerie, file.id);
    });
    return response;
  }
}
