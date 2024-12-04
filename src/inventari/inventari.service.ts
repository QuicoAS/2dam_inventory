import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventari } from './inventari.entity';
import { UtilsService } from '../utils/utils.service';
import { CreateInventariDto, UpdateInventariDto } from './inventari.dto';
import { LabelsService } from 'src/utils/labels.service';
import { Issue } from '../issues/issues.entity';

@Injectable()
export class InventariService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly labelsService: LabelsService,
    @InjectRepository(Inventari)
    private readonly inventariRepository: Repository<Inventari>,
    @InjectRepository(Issue) private issueRepository: Repository<Issue>,
  ) {}

  async getInventari(id?: number, xml?: string): Promise<any> {
    const result = await this.inventariRepository.findOneBy({
      id_inventory: id,
    });

    if (xml === 'true') {
      const jsonFormatted = JSON.stringify({
        Inventari: this.inventariRepository.find(),
      });
      const xmlResult = this.utilsService.convertJSONtoXML(jsonFormatted);
      return xmlResult;
    }

    return result;
  }

  async getInventariAll(xml?: string): Promise<any> {
    const result = await this.inventariRepository.find({
      relations: ['fk_inventary_type', 'fk_issue', 'fk_classroom'],
    });
    if (xml === 'true') {
      const jsonFormatted = JSON.stringify({
        Inventari: result,
      });
      const xmlResult = this.utilsService.convertJSONtoXML(jsonFormatted);
      return xmlResult;
    }

    return result;
  }

  async createInventari(
    createInventariDto: CreateInventariDto,
  ): Promise<{ message: string }> {
    const newInventari = this.inventariRepository.create({
      ...createInventariDto,
      fk_inventary_type: { id_type: createInventariDto.id_type },
      fk_classroom: { id_classroom: createInventariDto.id_classroom },
    });
    const text_etiqueta =
      newInventari.fk_inventary_type.description +
      ' ' +
      newInventari.model +
      '(' +
      newInventari.brand +
      ')';

    newInventari.text_etiqueta = text_etiqueta;
    await this.inventariRepository.save(newInventari);
    return { message: 'Inventario creado' };
  }

  async updateInventari(id: number, inventariDto: UpdateInventariDto) {
    const updatedData = {
      ...inventariDto,
      fk_inventary_type: { id_type: inventariDto.id_type },
      fk_classroom: { id_classroom: inventariDto.id_classroom },
    };

    const inventari = await this.inventariRepository.findOneBy({
      id_inventory: id,
    });
    const text_etiqueta =
      inventari.fk_inventary_type.description +
      ' ' +
      inventari.model +
      '(' +
      inventari.brand +
      ')';

    inventari.text_etiqueta = text_etiqueta;
    if (!inventari) {
      throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    }
    this.inventariRepository.merge(inventari, updatedData);
    return this.inventariRepository.save(inventari);
  }

  async deleteInventari(id: number): Promise<{ message: string }> {
    const result = await this.inventariRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Inventario eliminado' };
  }

  async generate_qr(inventoryIdItems: number[], res: any) {
    const qr = require('qr-image');
    const fs = require('fs');
    const path = require('path');
    const qr_folder = path.join(__dirname, '../../public/qr/');
    if (!fs.existsSync(qr_folder)) {
      fs.mkdirSync(qr_folder);
    }

    res.send('QR code generated');
  }

  async countIssuesByInventari(id: number): Promise<number> {
    const inventari = await this.inventariRepository.findOneBy({
      id_inventory: id,
    });
    if (!inventari) {
      throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    }
    return await this.issueRepository.count({
      where: { fk_inventari: { id_inventory: id } },
    });
  }
  async userStatsByInventari(id: number): Promise<any> {
    const inventari = await this.inventariRepository.findOneBy({
      id_inventory: id,
    });
    if (!inventari) {
      throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    }
    const query = this.issueRepository
      .createQueryBuilder('issue')
      .select('fk_user')
      .addSelect('COUNT(*)', 'count')
      .where('fk_inventari = :id', { id })
      .groupBy('fk_user');
    return await query.getRawMany();
  }
  async getAllDevicesWithIssues(): Promise<any> {
    return await this.issueRepository
      .createQueryBuilder('issue')
      .select('fk_inventari')
      .addSelect('COUNT(*)', 'count')
      .groupBy('fk_inventari')
      .getRawMany();
  }
}
