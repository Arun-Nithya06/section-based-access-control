import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { Permission } from 'src/db/entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@ApiTags('permissions')
@Controller('permissions')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Permissions('permissions:create', 'permissions:manage')
  @ApiOperation({ summary: 'Create permission' })
  @ApiResponse({ status: 201, type: Permission })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Permissions('permissions:read', 'permissions:manage')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({ status: 200, type: [Permission] })
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get('role/:roleId')
  @Permissions('permissions:read', 'permissions:manage')
  @ApiOperation({ summary: 'Get permissions by role' })
  @ApiResponse({ status: 200, type: [Permission] })
  findByRole(@Param('roleId') roleId: string) {
    return this.permissionsService.getPermissionsByRole(roleId);
  }

  @Get('section/:sectionId')
  @Permissions('permissions:read', 'permissions:manage')
  @ApiOperation({ summary: 'Get permissions by section' })
  @ApiResponse({ status: 200, type: [Permission] })
  findBySection(@Param('sectionId') sectionId: string) {
    return this.permissionsService.getPermissionsBySection(sectionId);
  }

  @Get(':id')
  @Permissions('permissions:read', 'permissions:manage')
  @ApiOperation({ summary: 'Get permission by id' })
  @ApiResponse({ status: 200, type: Permission })
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('permissions:update', 'permissions:manage')
  @ApiOperation({ summary: 'Update permission' })
  @ApiResponse({ status: 200, type: Permission })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Permissions('permissions:delete', 'permissions:manage')
  @ApiOperation({ summary: 'Delete permission' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }

  @Put('role/:roleId')
  @Permissions('permissions:update', 'permissions:manage')
  @ApiOperation({ summary: 'Update all permissions for a role' })
  @ApiResponse({ status: 200, type: [Permission] })
  updateRolePermissions(
    @Param('roleId') roleId: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    return this.permissionsService.updateRolePermissions(
      roleId,
      updateRolePermissionsDto.permissions,
    );
  }
}
