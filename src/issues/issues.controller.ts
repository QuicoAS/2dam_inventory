import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  HttpStatus,
  HttpException,
  Body,
  Query,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@Controller('issues')
@ApiTags('issues')
export class IssuesController {
  private IssuesService: IssuesService;
  constructor(IssuesService: IssuesService) {
    this.IssuesService = IssuesService;
  }

  @Get()
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  getAllStatus(@Query('xml') xml?: string) {
    try {
      return this.IssuesService.getAllIssues(xml);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  @Post()
  @ApiBody({
    description: 'Les dades per crear una nova incidència.',
    type: Object,
  })
  @ApiResponse({
    status: 201,
    description: 'Incidència creada correctament.',
  })
  createIssue(@Body() Issue) {
    return this.IssuesService.createIssue(Issue);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'ID de la incidència.',
    type: 'integer',
  })
  getIssue(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.IssuesService.getIssue(parseInt(id), xml);
  }

  @Put(':id')
  updateIssue(@Param('id') id: string, @Body() Issue) {
    return this.IssuesService.updateIssue(parseInt(id), Issue);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una incidència pel seu ID.' })
  deleteIssue(@Param('id') id: string) {
    return this.IssuesService.deleteIssue(parseInt(id));
  }
}
