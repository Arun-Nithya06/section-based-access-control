import { ApiProperty } from '@nestjs/swagger';

class UserRoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ type: [UserRoleDto] })
  roles: UserRoleDto[];

  @ApiProperty({ type: [String] })
  permissions: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token for API authentication',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token for getting new access tokens',
  })
  refreshToken: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
