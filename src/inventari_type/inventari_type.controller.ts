import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { InventariTypeService } from './inventari_type.service';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@Controller('inventari_type')
@ApiTags('inventari_type')
export class InventariTypeController {
  constructor(private readonly inventariTypeService: InventariTypeService) {}

  @Get()
  @ApiOperation({ summary: "Llista tots els tipus d'inventari." })
  @ApiQuery({
    name: 'format',
    required: false,
    description: 'Format de la resposta, "xml" per retornar XML.',
  })
  async getAllInventariType(
    @Query('format') format?: string,
    @Res() res?: Response,
  ) {
    const data = await this.inventariTypeService.getAllInventariType(format);

    if (format === 'xml' && res) {
      res.set('Content-Type', 'application/xml');
      return res.send(data);
    }

    return res ? res.json(data) : data;
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: "ID del tipus d'inventari.",
    type: 'integer',
  })
  async getInventariType(
    @Param('id') id: string,
    @Query('format') format?: string,
    @Res() res?: Response,
  ) {
    const data = await this.inventariTypeService.getInventariType(
      parseInt(id),
      format,
    );

    if (format === 'xml' && res) {
      res.set('Content-Type', 'application/xml');
      return res.send(data);
    }

    return res ? res.json(data) : data;
  }

  @Post()
  @ApiBody({
    description: "Dades per crear un nou tipus d'inventari.",
    type: Object,
  })
  @ApiResponse({
    status: 201,
    description: "Tipus d'inventari creat correctament.",
  })
  createInventariType(@Body() inventari_type) {
    return this.inventariTypeService.createInventariType(inventari_type);
  }

  @Put(':id')
  updateInventariType(@Param('id') id: string, @Body() inventari_type) {
    return this.inventariTypeService.updateInventariType(
      parseInt(id),
      inventari_type,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: "Elimina un tipus d'inventari." })
  deleteInventariType(@Param('id') id: string) {
    return this.inventariTypeService.deleteInventariType(parseInt(id));
  }
}
