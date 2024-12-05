import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassroomDto {
  @IsString()
  @ApiProperty({
    description: "Descripció de l'aula, com ara el pis o la ubicació.",
    example: 'piso 1',
  })
  description: string;
}
