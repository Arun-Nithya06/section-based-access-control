import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ArrayNotEmpty,
  ValidateNested,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PermissionAction } from '../../../common/enums/permission-action.enum';

class PermissionUpdateDto {
  @ApiProperty()
  @IsString()
  sectionId: string;

  @ApiProperty({
    type: [String],
    enum: PermissionAction,
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionAction, { each: true })
  actions: PermissionAction[];
}

export class UpdateRolePermissionsDto {
  @ApiProperty({ type: [PermissionUpdateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionUpdateDto)
  permissions: PermissionUpdateDto[];
}
