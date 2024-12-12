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
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@Controller('Classroom')
@ApiTags('Classrooms')
export class ClassroomController {
  private classroomService: ClassroomService;

  constructor(classroomService: ClassroomService) {
    this.classroomService = classroomService;
  }

  @Get()
  @ApiOperation({ summary: 'Llista totes les aules.' })
  @ApiResponse({
    status: 200,
    description: "Llista d'aules obtinguda correctament.",
  })
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  getAllClassrooms(@Query('xml') xml?: string) {
    try {
      return this.classroomService.getAllClassroom(xml);
    } catch (err) {
      throw new HttpException('Error message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obté una aula per ID.' })
  @ApiParam({
    name: 'id',
    description: "ID de l'aula.",
    type: 'integer',
  })
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  @ApiResponse({ status: 200, description: 'Aula obtinguda correctament.' })
  getClassroom(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.classroomService.getClassroom(parseInt(id), xml);
  }

  @Post()
  @ApiOperation({ summary: 'Crea una nova aula.' })
  @ApiBody({
    description: 'Dades per crear una nova aula.',
    type: CreateClassroomDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Aula creada correctament.',
  })
  createClassroom(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.createClassroom(createClassroomDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualitza una aula.' })
  @ApiParam({
    name: 'id',
    description: "ID de l'aula a actualitzar.",
    type: 'integer',
  })
  @ApiBody({
    description: "Dades per actualitzar l'aula.",
    type: UpdateClassroomDto,
  })
  @ApiResponse({ status: 200, description: 'Aula actualitzada correctament.' })
  updateClassroom(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.updateClassroom(
      parseInt(id),
      updateClassroomDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una aula.' })
  @ApiParam({
    name: 'id',
    description: "ID de l'aula a eliminar.",
    type: 'integer',
  })
  @ApiResponse({ status: 200, description: 'Aula eliminada correctament.' })
  deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(parseInt(id));
  }

  @Get('/:id/devices')
  @ApiOperation({ summary: "Obtén els dispositius d'una aula específica." })
  @ApiParam({
    name: 'id',
    description: "ID de l'aula.",
    type: 'integer',
  })
  @ApiResponse({
    status: 200,
    description: 'Dispositius obtinguts correctament.',
  })
  async obtenerDispositivosPorClase(@Param('id') id: number) {
    return await this.classroomService.obtenerDispositivosPorClase(id);
  }
}
