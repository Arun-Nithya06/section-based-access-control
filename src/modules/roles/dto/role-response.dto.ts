import { ApiProperty } from '@nestjs/swagger';

class RolePermissionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  actions: string[];

  @ApiProperty()
  section: {
    id: string;
    name: string;
    description: string;
    path: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class RoleUserResponseDto {
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
}

export class RoleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [RolePermissionResponseDto] })
  permissions: RolePermissionResponseDto[];

  @ApiProperty({ type: [RoleUserResponseDto] })
  users: RoleUserResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
