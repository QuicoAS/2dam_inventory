import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './status.dto';
import { UpdateStatusDto } from './status.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@Controller('Status')
@ApiTags('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  getAllStatus(@Query('xml') xml?: string) {
    try {
      return this.statusService.getAllStatus(xml);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: "ID de l'estat.", type: 'integer' })
  getStatus(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.statusService.getStatus(parseInt(id), xml);
  }

  @Post()
  @ApiBody({
    description: 'Dades per crear un nou estat.',
    type: CreateStatusDto,
  })
  createStatus(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.createStatus(createStatusDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualitza un estat pel seu ID.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.updateStatus(parseInt(id), updateStatusDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: "ID de l'estat a eliminar.",
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Estat eliminat correctament.',
  })
  deleteStatus(@Param('id') id: string) {
    return this.statusService.deleteStatus(parseInt(id));
  }
}
