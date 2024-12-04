import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (
      !file ||
      !['image/png', 'image/jpeg', 'application/pdf'].includes(file.mimetype)
    ) {
      throw new Error('Tipus de fitxer no vàlid.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('El fitxer supera la mida màxima de 5MB.');
    }

    const result = await this.filesService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
    return result;
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: any) {
    try {
      return this.filesService.getFile(id, res);
    } catch (err) {
      res.status(500).send({ message: 'No s’ha pogut obtenir el fitxer.' });
    }
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string, @Res() res: any) {
    try {
      const result = await this.filesService.deleteFile(id);
      res.status(200).send({ success: result });
    } catch (err) {
      res.status(500).send({ message: 'No s’ha pogut eliminar el fitxer.' });
    }
  }
}
