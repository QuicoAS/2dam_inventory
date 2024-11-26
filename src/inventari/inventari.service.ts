import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventari } from './inventari.entity';
import { UtilsService } from '../utils/utils.service';
import { CreateInventariDto, UpdateInventariDto } from './inventari.dto';
import { Issue } from '../issues/issues.entity';

@Injectable()
export class InventariService {
  constructor(
    private readonly utilsService: UtilsService,
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
    await this.inventariRepository.save(newInventari);
    return { message: 'Inventario creado' };
  }

  async updateInventari(id: number, inventari: UpdateInventariDto) {
    const updatedData = {
      ...inventari,
      fk_inventary_type: { id_type: inventari.id_type },
      fk_classroom: { id_classroom: inventari.id_classroom },
    };

    await this.inventariRepository.update(id, updatedData);
    const updatedInventari = await this.inventariRepository.findOneBy({
      id_inventory: id,
    });
    if (!updatedInventari) {
      throw new HttpException('Inventario no encontrado', HttpStatus.NOT_FOUND);
    }
    return updatedInventari;
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
}
