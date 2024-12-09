import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClassroomDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Descripció actualitzada de l\'aula, com ara el pis o la ubicació.',
    example: 'piso 2',
  })
  description?: string;
}
