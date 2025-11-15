import { ApiProperty } from '@nestjs/swagger';

class SectionPermissionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  actions: string[];

  @ApiProperty()
  role: {
    id: string;
    name: string;
    description: string;
  };

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SectionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  path: string;

  @ApiProperty({ type: [SectionPermissionResponseDto] })
  permissions: SectionPermissionResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
