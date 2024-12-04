import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventari } from './inventari.entity';
import { UtilsService } from '../utils/utils.service';
import { CreateInventariDto, UpdateInventariDto } from './inventari.dto';
import { Issue } from '../issues/issues.entity';
import { LabelsService } from 'src/utils/labels.service';

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

  async countIssuesByInventari(inventariId: number): Promise<number> {
    const inventari = await this.inventariRepository.findOne({
      where: { id_inventory: inventariId },
      relations: ['fk_issue'],
    });

    if (!inventari) {
      throw new HttpException('Dispositiu no trobat', HttpStatus.NOT_FOUND);
    }
    return inventari.fk_issue.length;
  }

  async userStatsByInventari(inventariId: number): Promise<any> {
    const issues = await this.issueRepository.find({
      where: { fk_inventari: { id_inventory: inventariId } },
      relations: ['user'],
    });

    if (!issues || issues.length === 0) {
      throw new HttpException(
        'No hi ha incidències associades a aquest dispositiu',
        HttpStatus.NOT_FOUND,
      );
    }
    const userStats = issues.reduce((stats, issue) => {
      const userId = issue.user?.id_user;
      if (userId) {
        stats[userId] = (stats[userId] || 0) + 1;
      }
      return stats;
    }, {});

    return userStats;
  }
  async getAllDevicesWithIssues(): Promise<any[]> {
    const devices = await this.inventariRepository.find({
      relations: ['fk_issue'],
    });

    if (!devices || devices.length === 0) {
      throw new HttpException('No hi ha dispositius', HttpStatus.NOT_FOUND);
    }

    const result = devices.map((device) => ({
      id_inventory: device.id_inventory,
      num_serie: device.num_serie,
      brand: device.brand,
      model: device.model,
      issue_count: device.fk_issue?.length || 0,
    }));

    return result;
  }

  async generate_qr(inventoryIdItems: any, res: any) {
    try {
      const inventoryItems = await this.inventariRepository.find({
        relations: ['fk_inventary_type', 'fk_issue', 'fk_classroom'],
        where: inventoryIdItems,
      });

      const filterInventoryItems = inventoryItems.filter((item) =>
        inventoryIdItems.includes(item.id_inventory),
      );
      this.labelsService.generateLabels(filterInventoryItems, res);
    } catch (error) {
      throw new HttpException(
        'Inventario no encontrado' + error,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
