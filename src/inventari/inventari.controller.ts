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
@ApiTags('inventari')
export class InventariController {
  private inventariService: InventariService;

  constructor(inventariService: InventariService) {
    this.inventariService = inventariService;
  }

  @Get()
  @ApiOperation({ summary: "Llista tots els elements de l'inventari." })
  getAllInventaris(@Query('xml') xml: string) {
    return this.inventariService.getInventariAll(xml);
  }

  @Get(':id')
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
  getInventari(@Param('id') id: string, @Query('xml') xml: string) {
    return this.inventariService.getInventari(parseInt(id), xml);
  }

  @Post()
  @ApiBody({
    description: "Les dades per crear un nou element a l'inventari.",
    type: CreateInventariDto,
  })
  createInventari(@Body() createInventariDto: CreateInventariDto) {
    return this.inventariService.createInventari(createInventariDto);
  }

  @Put(':id')
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
  deleteInventari(@Param('id') id: string) {
    return this.inventariService.deleteInventari(parseInt(id));
  }
  @Post('pdf')
  generate_qr(@Body() inventory_items: number[], @Res() res: any) {
    const inventoryIdItems = inventory_items;
    return this.inventariService.generate_qr(inventoryIdItems, res);
  }

  @Get(':id/issues/count')
  async getIssueCount(@Param('id') id: number): Promise<number> {
    return this.inventariService.countIssuesByInventari(id);
  }

  @Get(':id/issues/user-stats')
  async getuserStats(@Param('id') id: number): Promise<any> {
    return this.inventariService.userStatsByInventari(id);
  }
  @Get('issues/all')
  async getAllDevicesWithIssues(): Promise<any> {
    return this.inventariService.getAllDevicesWithIssues();
  }
}
