import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './issue.statistics.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('statistics')
@ApiTags('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('issues-statitics-status')
  @ApiOperation({ summary: 'Obté estadístiques de les incidències per estat.' })
  @ApiResponse({
    status: 200,
    description: 'Estadístiques retornades correctament.',
  })
  async getIssuesByStatus() {
    return this.statisticsService.getIssuesStatisticsStatus();
  }
}
