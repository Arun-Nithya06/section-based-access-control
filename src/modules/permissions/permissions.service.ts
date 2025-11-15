import {
  Injectable,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionAction } from '../../common/enums/permission-action.enum';
import { Permission } from 'src/db/entities/permission.entity';
import { Role } from 'src/db/entities/role.entity';
import { Section } from 'src/db/entities/section.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { roleId, sectionId, actions } = createPermissionDto;

    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const section = await this.sectionsRepository.findOne({
      where: { id: sectionId },
    });
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    // Check if permission already exists for this role and section
    const existingPermission = await this.permissionsRepository.findOne({
      where: { role: { id: roleId }, section: { id: sectionId } },
    });

    if (existingPermission) {
      throw new ConflictException(
        'Permission already exists for this role and section',
      );
    }

    // Create new permission
    const permission = this.permissionsRepository.create({
      role,
      section,
      actions: actions as PermissionAction[],
    });

    const savedPermission = await this.permissionsRepository.save(permission);
    this.logger.log(
      `Permission created for role: ${role.name} on section: ${section.name}`,
    );
    return savedPermission;
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionsRepository.find({
      relations: ['role', 'section'],
    });
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.permissionsRepository.findOne({
      where: { id },
      relations: ['role', 'section'],
    });

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    if (updatePermissionDto.actions) {
      permission.actions = updatePermissionDto.actions as PermissionAction[];
    }

    const updatedPermission = await this.permissionsRepository.save(permission);
    this.logger.log(`Permission updated: ${updatedPermission.id}`);
    return updatedPermission;
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);
    await this.permissionsRepository.softRemove(permission);
    this.logger.log(`Permission deleted: ${permission.id}`);
  }

  async getPermissionsByRole(roleId: string): Promise<Permission[]> {
    return this.permissionsRepository.find({
      where: { role: { id: roleId } },
      relations: ['section'],
    });
  }

  async getPermissionsBySection(sectionId: string): Promise<Permission[]> {
    return this.permissionsRepository.find({
      where: { section: { id: sectionId } },
      relations: ['role'],
    });
  }

  async updateRolePermissions(
    roleId: string,
    permissions: { sectionId: string; actions: PermissionAction[] }[],
  ): Promise<Permission[]> {
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Remove existing permissions for this role
    await this.permissionsRepository.delete({ role: { id: roleId } });

    // Create new permissions
    const newPermissions: Permission[] = [];

    for (const perm of permissions) {
      const section = await this.sectionsRepository.findOne({
        where: { id: perm.sectionId },
      });
      if (section) {
        const permission = this.permissionsRepository.create({
          role,
          section,
          actions: perm.actions,
        });
        newPermissions.push(permission);
      }
    }

    const savedPermissions = await this.permissionsRepository.save(
      newPermissions,
    );
    this.logger.log(`Updated permissions for role: ${role.name}`);
    return savedPermissions;
  }
}
