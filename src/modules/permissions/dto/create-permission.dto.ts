import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty, IsEnum } from 'class-validator';
import { PermissionAction } from '../../../common/enums/permission-action.enum';

export class CreatePermissionDto {
  @ApiProperty({ example: 'role-id-here' })
  @IsString()
  roleId: string;

  @ApiProperty({ example: 'section-id-here' })
  @IsString()
  sectionId: string;

  @ApiProperty({
    type: [String],
    enum: PermissionAction,
    example: [
      PermissionAction.CREATE,
      PermissionAction.READ,
      PermissionAction.UPDATE,
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionAction, { each: true })
  actions: PermissionAction[];
}
