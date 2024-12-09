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
import { InventariService } from './inventari.service';
import { CreateInventariDto } from './inventari.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@Controller('inventari')
@ApiTags('inventory')
export class InventariController {
  private inventariService: InventariService;

  constructor(inventariService: InventariService) {
    this.inventariService = inventariService;
  }

  @Get()
  @ApiOperation({ summary: "Llista tots els elements de l'inventari." })
  @ApiResponse({
    status: 200,
    description: "Llista d'elements obtinguda correctament.",
  })
  getAllInventaris(@Query('xml') xml: string) {
    return this.inventariService.getInventariAll(xml);
  }

  @Get(':id')
  @ApiOperation({ summary: "Obté un element de l'inventari per ID." })
  @ApiParam({
    name: 'id',
    description: "ID de l'element de l'inventari.",
    type: 'integer',
  })
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  @ApiResponse({
    status: 200,
    description: "Element de l'inventari obtingut correctament.",
  })
  getInventari(@Param('id') id: string, @Query('xml') xml: string) {
    return this.inventariService.getInventari(parseInt(id), xml);
  }

  @Post()
  @ApiOperation({ summary: "Crea un nou element a l'inventari." })
  @ApiBody({
    description: "Les dades per crear un nou element a l'inventari.",
    type: CreateInventariDto,
  })
  @ApiResponse({ status: 201, description: 'Element creat correctament.' })
  createInventari(@Body() createInventariDto: CreateInventariDto) {
    return this.inventariService.createInventari(createInventariDto);
  }

  @Put(':id')
  @ApiOperation({ summary: "Actualitza un element de l'inventari." })
  @ApiParam({
    name: 'id',
    description: "ID de l'element a actualitzar.",
    type: 'integer',
  })
  @ApiBody({
    description: "Les dades per actualitzar l'element.",
    type: CreateInventariDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Element actualitzat correctament.',
  })
  updateInventari(
    @Param('id') id: string,
    @Body() createInventariDto: CreateInventariDto,
  ) {
    return this.inventariService.updateInventari(
      parseInt(id),
      createInventariDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: "Elimina un element de l'inventari." })
  @ApiParam({
    name: 'id',
    description: "ID de l'element a eliminar.",
    type: 'integer',
  })
  @ApiResponse({ status: 200, description: 'Element eliminat correctament.' })
  deleteInventari(@Param('id') id: string) {
    return this.inventariService.deleteInventari(parseInt(id));
  }

  @Post('pdf')
  @ApiOperation({ summary: 'Genera un codi QR.' })
  @ApiBody({
    description: "Llista d'IDs d'inventari.",
    type: 'number',
    isArray: true,
  })
  @ApiResponse({ status: 201, description: 'Codi QR generat correctament.' })
  generate_qr(@Body() inventory_items: number[], @Res() res: any) {
    const inventoryIdItems = inventory_items;
    return this.inventariService.generate_qr(inventoryIdItems, res);
  }

  @Get(':id/issues/count')
  @ApiOperation({ summary: "Obté el recompte d'incidències d'un element." })
  @ApiParam({ name: 'id', description: "ID de l'element.", type: 'integer' })
  @ApiResponse({
    status: 200,
    description: "Recompte d'incidències obtingut correctament.",
  })
  async getIssueCount(@Param('id') id: number): Promise<number> {
    return this.inventariService.countIssuesByInventari(id);
  }

  @Get(':id/issues/user-stats')
  @ApiOperation({ summary: "Obté les estadístiques d'usuari d'un element." })
  @ApiParam({ name: 'id', description: "ID de l'element.", type: 'integer' })
  @ApiResponse({
    status: 200,
    description: "Estadístiques d'usuari obtingudes correctament.",
  })
  async getuserStats(@Param('id') id: number): Promise<any> {
    return this.inventariService.userStatsByInventari(id);
  }

  @Get('issues/all')
  @ApiOperation({ summary: 'Obté tots els dispositius amb incidències.' })
  @ApiResponse({
    status: 200,
    description: 'Dispositius amb incidències obtinguts correctament.',
  })
  async getAllDevicesWithIssues(): Promise<any> {
    return this.inventariService.getAllDevicesWithIssues();
  }
}
