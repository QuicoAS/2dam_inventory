import { Module } from '@nestjs/common';
import { InventariController } from './inventari.controller';
import { InventariService } from './inventari.service';
import { Inventari } from './inventari.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LabelsModule } from 'src/utils/labels.module';
import { Issue } from '../issues/issues.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventari, Issue]), UtilsModule, LabelsModule],
  exports: [TypeOrmModule],
  controllers: [InventariController],
  providers: [InventariService],
})
export class InventariModule {}
