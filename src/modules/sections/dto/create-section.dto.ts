import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 'reports' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Reports management section' })
  @IsString()
  @MinLength(5)
  description: string;

  @ApiProperty({ example: '/reports' })
  @IsString()
  path: string;
}
