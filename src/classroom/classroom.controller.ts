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
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  getAllClassrooms(@Query('xml') xml?: string) {
    try {
      return this.classroomService.getAllClassroom(xml);
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

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: "ID de l'aula.",
    type: 'integer',
  })
  getClassroom(@Param('id') id: string, @Query('xml') xml?: string) {
    return this.classroomService.getClassroom(parseInt(id), xml);
  }

  @Post()
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
  deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(parseInt(id));
  }

  @Get('/:id/devices')
  @ApiOperation({ summary: "Obtén els dispositius d'una aula específica." })
  async obtenerDispositivosPorClase(@Param('id') id: number) {
    return await this.classroomService.obtenerDispositivosPorClase(id);
  }
}
