import { ApiProperty} from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Descripció del nou estat.',
    example: 'Reparació en curs',
  })
  description: string;
}

export class UpdateStatusDto {
  @IsString()
  @ApiProperty({
    description: 'Descripció de l\'estat.',
    example: 'Reparació en curs',
  })
  description: string;
}
