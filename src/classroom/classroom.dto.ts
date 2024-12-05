import { IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClassroomDto {
  @IsString()
  @ApiProperty({
    description: "Descripció de l'aula, com ara el pis o la ubicació.",
    example: 'piso 1',
  })
  description: string;
}

export class UpdateClassroomDto {
  @IsString()
  @ApiProperty({
    description: "Descripció de l'aula, com ara el pis o la ubicació.",
    example: 'piso 1',
  })
  description: string;
}
