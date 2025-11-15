import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/db/entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const role = this.rolesRepository.create(createRoleDto);
    const savedRole = await this.rolesRepository.save(role);

    this.logger.log(`Role created: ${savedRole.name}`);
    return savedRole;
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({
      relations: ['permissions', 'permissions.section', 'users'],
    });
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['permissions', 'permissions.section', 'users'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async findByName(name: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { name },
      relations: ['permissions', 'permissions.section'],
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    const updatedRole = await this.rolesRepository.save({
      ...role,
      ...updateRoleDto,
    });

    this.logger.log(`Role updated: ${updatedRole.name}`);
    return updatedRole;
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    // Check if role has users assigned
    if (role.users && role.users.length > 0) {
      throw new BadRequestException(
        'Cannot delete role that has users assigned',
      );
    }

    await this.rolesRepository.softRemove(role);
    this.logger.log(`Role deleted: ${role.name}`);
  }
}
