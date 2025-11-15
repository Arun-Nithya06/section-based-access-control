import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from 'src/db/entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions('roles:create', 'roles:manage')
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({ status: 201, type: Role })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions('roles:read', 'roles:manage')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, type: [Role] })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions('roles:read', 'roles:manage')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({ status: 200, type: Role })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Get('name/:name')
  @Permissions('roles:read', 'roles:manage')
  @ApiOperation({ summary: 'Get role by name' })
  @ApiResponse({ status: 200, type: Role })
  findByName(@Param('name') name: string) {
    return this.rolesService.findByName(name);
  }

  @Patch(':id')
  @Permissions('roles:update', 'roles:manage')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, type: Role })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions('roles:delete', 'roles:manage')
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }
}
