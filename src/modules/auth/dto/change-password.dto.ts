import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'currentpassword123',
    description: 'Current user password',
  })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({
    example: 'NewStrongPass123!',
    description:
      'New password (min 8 chars, uppercase, lowercase, number, special char)',
  })
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password too weak. Must contain uppercase, lowercase, number and special character',
  })
  newPassword: string;

  @ApiProperty({
    example: 'NewStrongPass123!',
    description: 'Confirm new password',
  })
  @IsString()
  @MinLength(8)
  confirmNewPassword: string;
}
