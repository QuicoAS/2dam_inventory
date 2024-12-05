// user.dto.ts
import {
  IsEmail,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Identificador únic de l\'usuari.',
    example: 1,
  })
  id_user?: number;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Nom de l\'usuari.',
    example: 'Admin',
  })
  name: string;

  @IsString()
  @Length(1, 500)
  @ApiProperty({
    description: 'Cognoms de l\'usuari.',
    example: 'Administrator',
  })
  surname: string;

  @IsString()
  @ApiProperty({
    description: 'Contrasenya de l\'usuari.',
    example: 'admin',
  })
  password: string;

  @IsEmail()
  @ApiProperty({
    description: 'Correu electrònic de l\'usuari.',
    example: 'admin@admin.com',
  })
  email: string;

  @IsInt()
  @Min(0)
  @Max(2)
  @ApiProperty({
    description: 'Rol de l\'usuari: 0 = Usuari genèric, 1 = Admin, 2 = Tècnic.',
    example: 1,
  })
  role: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: 'Identificador únic de l\'usuari.',
    example: 1,
  })
  id_user?: number;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  @ApiPropertyOptional({
    description: 'Nom actualitzat de l\'usuari.',
    example: 'Juan',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  @ApiPropertyOptional({
    description: 'Cognoms actualitzats de l\'usuari.',
    example: 'Pérez',
  })
  surname?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Contrasenya actualitzada de l\'usuari.',
    example: 'newPassword123',
  })
  password?: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Correu electrònic actualitzat de l\'usuari.',
    example: 'juan.perez@example.com',
  })
  email?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1)
  @ApiPropertyOptional({
    description: 'Rol actualitzat de l\'usuari.',
    example: 2,
  })
  role?: number;
}
