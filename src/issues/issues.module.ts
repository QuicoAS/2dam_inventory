import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issues.entity';
import { StatisticsModule } from './statistics/statistics.module'; // Importamos el StatisticsModule

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([Issue]), StatisticsModule],
  exports: [TypeOrmModule],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
