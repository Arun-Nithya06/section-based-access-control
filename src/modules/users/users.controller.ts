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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { User } from 'src/db/entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions('users:create', 'users:manage')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions('users:read', 'users:manage')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('users:read', 'users:manage')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, type: User })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Permissions('users:update', 'users:manage')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, type: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Permissions('users:delete', 'users:manage')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Put(':id/deactivate')
  @Permissions('users:update', 'users:manage')
  @ApiOperation({ summary: 'Deactivate user' })
  @ApiResponse({ status: 200, type: User })
  deactivate(@Param('id') id: string) {
    return this.usersService.deactivate(id);
  }

  @Put(':id/activate')
  @Permissions('users:update', 'users:manage')
  @ApiOperation({ summary: 'Activate user' })
  @ApiResponse({ status: 200, type: User })
  activate(@Param('id') id: string) {
    return this.usersService.activate(id);
  }
}
