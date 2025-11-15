import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'manager' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Manager role with elevated permissions' })
  @IsString()
  @MinLength(5)
  description: string;
}
