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
import { AuthService } from 'src/Autentication/auth.service';
import { MailService } from 'src/mail/mail.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UsersService } from './users.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@Controller('Users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtindre tots els usuaris' })
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  @ApiResponse({
    status: 200,
    description: "Llista d'usuaris obtinguda correctament.",
  })
  getAllUser(@Query('xml') xml?: string) {
    try {
      return this.usersService.getAllUser(xml);
    } catch (err) {
      throw new HttpException('Missatge d’error', HttpStatus.NOT_FOUND);
    }
  }

  @Get('statistics/:id')
  @ApiOperation({ summary: "Obté les estadístiques d'un usuari." })
  @ApiParam({ name: 'id', description: "ID de l'usuari.", type: 'integer' })
  @ApiResponse({
    status: 200,
    description: "Estadístiques de l'usuari obtingudes correctament.",
  })
  getStatisticsUser(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.getStatisticsUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obté un usuari per ID.' })
  @ApiParam({ name: 'id', description: "ID de l'usuari", type: 'integer' })
  @ApiQuery({
    name: 'xml',
    required: false,
    description: 'Si és "true", retorna el resultat en format XML.',
  })
  @ApiResponse({ status: 200, description: 'Usuari obtingut correctament.' })
  getUser(@Param('id') id: string, @Query('xml') xml?: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.getUser(userId, xml);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un nou usuari.' })
  @ApiBody({ description: 'Dades per crear un usuari', type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuari creat correctament.' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualitza un usuari.' })
  @ApiParam({
    name: 'id',
    description: "ID de l'usuari a actualitzar.",
    type: 'integer',
  })
  @ApiBody({
    description: 'Dades per actualitzar un usuari.',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 200, description: 'Usuari actualitzat correctament.' })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.updateUser({
      ...updateUserDto,
      id_user: userId,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un usuari.' })
  @ApiParam({
    name: 'id',
    description: "ID de l'usuari a eliminar.",
    type: 'integer',
  })
  @ApiResponse({ status: 200, description: 'Usuari eliminat correctament' })
  deleteUser(@Param('id') id: string) {
    const userId = parseInt(id);
    if (isNaN(userId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }
    return this.usersService.deleteUser(userId);
  }

  @Post('login')
  @ApiOperation({ summary: "Inicia sessió d'un usuari." })
  @ApiBody({ description: "Credencials de l'usuari.", type: Object })
  @ApiResponse({ status: 200, description: 'Sessió iniciada correctament.' })
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    if (!email || !password) {
      throw new HttpException(
        'El nombre de usuario y la contraseña son obligatorios',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = await this.authService.generateToken(user.id_user);

    return { token };
  }

  @Get('technician-stats/:id')
  @ApiOperation({ summary: "Obté les estadístiques d'un tècnic." })
  @ApiParam({ name: 'id', description: 'ID del tècnic.', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Estadístiques del tècnic obtingudes correctament.',
  })
  async getTechnicianStats(@Param('id') id: string) {
    const stat = await this.usersService.getStaticTechnician(id);
    return stat;
  }
}
