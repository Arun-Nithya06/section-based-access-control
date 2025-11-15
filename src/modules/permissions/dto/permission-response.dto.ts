import { ApiProperty } from '@nestjs/swagger';
import { PermissionAction } from '../../../common/enums/permission-action.enum';

export class PermissionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: PermissionAction, isArray: true })
  actions: PermissionAction[];

  @ApiProperty()
  role: {
    id: string;
    name: string;
    description: string;
  };

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
