import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    example: 'UpdatedStrongPass123!',
    description:
      'New password (min 8 chars, uppercase, lowercase, number, special char)',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password too weak. Must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    example: 'updateduser@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'Jane',
    description: 'User first name',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Smith',
    description: 'User last name',
  })
  @IsString()
  @MinLength(2)
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the user is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: [String],
    example: ['role-id-1', 'role-id-2'],
    description: 'Array of role IDs to assign to the user',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsOptional()
  roleIds?: string[];
}
