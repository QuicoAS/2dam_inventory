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
  @ApiOperation({ summary: 'Obté totes les incidències.' })
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  @ApiResponse({
    status: 200,
    description: "Llista d'incidències obtinguda correctament.",
  })
  getAllStatus(@Query('xml') xml?: string) {
    try {
      return this.IssuesService.getAllIssues(xml);
    } catch (err) {
      throw new HttpException('Error message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nova incidència.' })
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
  @ApiOperation({ summary: 'Obté una incidència per ID.' })
  @ApiParam({
    name: 'id',
    description: 'ID de la incidència.',
    type: 'integer',
  })
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidència obtinguda correctament.',
  })
  getIssue(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.IssuesService.getIssue(parseInt(id), xml);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualitza una incidència.' })
  @ApiParam({
    name: 'id',
    description: 'ID de la incidència a actualitzar.',
    type: 'integer',
  })
  @ApiBody({
    description: 'Les dades per actualitzar la incidència.',
    type: Object,
  })
  @ApiResponse({
    status: 200,
    description: 'Incidència actualitzada correctament.',
  })
  updateIssue(@Param('id') id: string, @Body() Issue) {
    return this.IssuesService.updateIssue(parseInt(id), Issue);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una incidència pel seu ID.' })
  @ApiParam({
    name: 'id',
    description: 'ID de la incidència a eliminar.',
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Incidència eliminada correctament.',
  })
  deleteIssue(@Param('id') id: string) {
    return this.IssuesService.deleteIssue(parseInt(id));
  }
}
