import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import * as Grid from 'gridfs-stream';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class FilesService {
  private gfs: Grid.Grid;

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    const gridfs = Grid(this.connection.db, mongoose.mongo);
    gridfs.collection('uploads');
    this.gfs = gridfs;
  }

  async uploadFile(fileBuffer: Buffer, filename: string, contentType: string) {
    const writeStream = this.gfs.createWriteStream({
      filename,
      content_type: contentType,
    });
    // const writeStream = this.gfs.createWriteStream({
    //   filename,
    //   content_type: contentType,
    //   root: 'documents', // O 'images', segons el tipus de fitxer
    // });

    writeStream.write(fileBuffer);
    writeStream.end();

    return new Promise((resolve, reject) => {
      writeStream.on('close', (file) => resolve(file));
      writeStream.on('error', (err) => reject(err));
    });
  }

  async getFile(id: string, res: any) {
    try {
      const readStream = this.gfs.createReadStream({ _id: id });
      readStream.on('error', (err) => {
        res.status(404).send({ message: 'Fitxer no trobat.' });
      });
      readStream.pipe(res);
    } catch (err) {
      throw new Error('Error al recuperar el fitxer: ' + (err as Error).message);
    }
  }

  async deleteFile(id: string) {
    try {
      return new Promise((resolve, reject) => {
        this.gfs.remove({ _id: id, root: 'uploads' }, (err) => {
          if (err) {
            reject(new Error('Error al eliminar el fitxer.'));
          } else {
            resolve(true);
          }
        });
      });
    } catch (err) {
      throw new Error('Error al eliminar el fitxer: ' + (err as Error).message);
    }
  }
}
