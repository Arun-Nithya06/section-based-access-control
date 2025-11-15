import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsArray,
  IsOptional,
  IsBoolean,
  Matches,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'User email address (must be unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description:
      'User password (min 8 chars, uppercase, lowercase, number, special char)',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password too weak. Must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the user is active',
    default: true,
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
