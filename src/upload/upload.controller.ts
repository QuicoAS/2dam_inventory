import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../multer.config';
import { UploadService } from './upload.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';

@Controller('upload')
@ApiTags('inventory')
export class UploadController {
  private uploadService: UploadService;
  constructor(uploadService: UploadService) {
    this.uploadService = uploadService;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Carrega un fitxer al servidor.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fitxer a carregar i informació associada.',
    type: 'multipart/form-data',
  })
  @ApiResponse({ status: 201, description: 'Fitxer carregat correctament.' })
  async uploadFile(
    @UploadedFile() file,
    @Body('issueConversation') issueConversationId: number,
  ) {
    if (!file) {
      throw new Error('File upload failed');
    }
    const savedFile = await this.uploadService.saveFile(
      file,
      issueConversationId,
    );
    return {
      message: 'Archivo añadido con exito!',
      url: `http://localhost:8080/upload/${file.filename}`,
      name: savedFile.name,
      path: savedFile.path,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obté tots els fitxers carregats.' })
  @ApiResponse({
    status: 200,
    description: 'Llista de fitxers retornada correctament.',
  })
  getAlluploads() {
    return this.uploadService.getAlluploads();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obté un fitxer per ID.' })
  @ApiParam({ name: 'id', description: 'ID del fitxer.', type: 'integer' })
  @ApiResponse({ status: 200, description: 'Fitxer obtingut correctament.' })
  getUpload(@Param('id') id: string) {
    return this.uploadService.getUpload(parseInt(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualitza un fitxer.' })
  @ApiParam({
    name: 'id',
    description: 'ID del fitxer a actualitzar.',
    type: 'integer',
  })
  @UseInterceptors(FileInterceptor('uploadedFile', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Fitxer a actualitzar.',
    type: 'multipart/form-data',
  })
  @ApiResponse({ status: 200, description: 'Fitxer actualitzat correctament.' })
  async updateUpload(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (!file) {
      throw new HttpException(
        'No se ha enviado un archivo',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.uploadService.updateUpload(id, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un fitxer pel seu ID.' })
  @ApiParam({
    name: 'id',
    description: 'ID del fitxer a eliminar.',
    type: 'integer',
  })
  @ApiResponse({ status: 200, description: 'Fitxer eliminat correctament.' })
  deleteInventari(@Param('id') id: string) {
    return this.uploadService.deleteUpload(parseInt(id));
  }
}
