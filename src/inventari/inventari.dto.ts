import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateInventariDto {
  @IsString()
  @ApiProperty({
    description: "Número de sèrie de l'inventari.",
    example: 'kg273965',
  })
  num_serie: string;

  @IsString()
  @ApiProperty({
    description: 'Marca del dispositiu.',
    example: 'HP',
  })
  brand: string;

  @IsString()
  @ApiProperty({
    description: 'Model del dispositiu.',
    example: 'Pavilion',
  })
  model: string;

  @IsInt()
  @ApiProperty({
    description: "Codi d'article de GVA.",
    example: 1,
  })
  GVA_cod_article: number;

  @IsString()
  @ApiProperty({
    description: "Descripció de l'article segons GVA.",
    example: 'portatil para clase',
  })
  GVA_description_cod_articulo: string;

  @IsString()
  @ApiProperty({
    description: 'Estat actual del dispositiu.',
    example: 'usando',
  })
  status: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: "ID del tipus d'inventari.",
    example: 2,
  })
  id_type: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: "ID de l'aula associada.",
    example: 1,
  })
  id_classroom: number;
}

export class UpdateInventariDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Número de sèrie actualitzat.',
    example: 'pl834759',
  })
  num_serie?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Marca actualitzada del dispositiu.',
    example: 'Dell',
  })
  brand?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Model actualitzat del dispositiu.',
    example: 'OptiPlex 3070',
  })
  model?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: "Codi d'article de GVA actualitzat.",
    example: 2,
  })
  GVA_cod_article?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: "Descripció actualitzada de l'article segons GVA.",
    example: 'PC para oficina',
  })
  GVA_description_cod_articulo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Estat actualitzat del dispositiu.',
    example: 'disponible',
  })
  status?: string;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: "ID actualitzat del tipus d'inventari.",
    example: 1,
  })
  id_type?: number;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: "ID actualitzat de l'aula associada.",
    example: 2,
  })
  id_classroom?: number;
}
