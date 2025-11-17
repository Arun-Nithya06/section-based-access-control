import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PermissionAction } from '../common/enums/permission-action.enum';
import { BcryptUtils } from '../common/utils/bcrypt.util';
import { User } from 'src/db/entities/user.entity';
import { Role } from 'src/db/entities/role.entity';
import { Section } from 'src/db/entities/section.entity';
import { Permission } from 'src/db/entities/permission.entity';

@Injectable()
export class DatabaseService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedDatabase();
  }

  async seedDatabase() {
    this.logger.log('Starting database seeding...');

    try {
      await this.seedSections();
      await this.seedRoles();
      await this.seedPermissions();
      await this.seedUsers();

      this.logger.log('Database seeded successfully');
      // await this.clearDatabase();
    } catch (error) {
      this.logger.error('Database seeding failed:', error);
    }
  }

  private async seedSections() {
    const sections = [
      { name: 'users', description: 'Users management', path: '/users' },
      { name: 'roles', description: 'Roles management', path: '/roles' },
      {
        name: 'sections',
        description: 'Sections management',
        path: '/sections',
      },
      {
        name: 'permissions',
        description: 'Permissions management',
        path: '/permissions',
      },
      { name: 'auth', description: 'Authentication', path: '/auth' },
      { name: 'health', description: 'Health checks', path: '/health' },
    ];

    for (const sectionData of sections) {
      const existing = await this.sectionsRepository.findOne({
        where: { name: sectionData.name },
      });
      if (!existing) {
        await this.sectionsRepository.save(
          this.sectionsRepository.create(sectionData),
        );
        this.logger.log(`Section created: ${sectionData.name}`);
      }
    }
  }

  private async seedRoles() {
    const roles = [
      {
        name: 'super_admin',
        description: 'Super Administrator with full access',
      },
      { name: 'admin', description: 'Administrator with management access' },
      { name: 'user', description: 'Regular user with limited access' },
      { name: 'viewer', description: 'Viewer with read-only access' },
    ];

    for (const roleData of roles) {
      const existing = await this.rolesRepository.findOne({
        where: { name: roleData.name },
      });
      if (!existing) {
        await this.rolesRepository.save(this.rolesRepository.create(roleData));
        this.logger.log(`Role created: ${roleData.name}`);
      }
    }
  }

  private async seedPermissions() {
    // Find all roles with proper null checks
    const superAdminRole = await this.rolesRepository.findOne({
      where: { name: 'super_admin' },
    });
    const adminRole = await this.rolesRepository.findOne({
      where: { name: 'admin' },
    });
    const userRole = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });
    const viewerRole = await this.rolesRepository.findOne({
      where: { name: 'viewer' },
    });

    // Check if roles exist
    if (!superAdminRole || !adminRole || !userRole || !viewerRole) {
      this.logger.error('Required roles not found for permission seeding');
      return;
    }

    const sections = await this.sectionsRepository.find();

    if (sections.length === 0) {
      this.logger.error('No sections found for permission seeding');
      return;
    }

    // Super Admin - Full access to everything
    for (const section of sections) {
      const existing = await this.permissionsRepository.findOne({
        where: {
          role: { id: superAdminRole.id },
          section: { id: section.id },
        },
      });

      if (!existing) {
        await this.permissionsRepository.save(
          this.permissionsRepository.create({
            role: superAdminRole,
            section: section,
            actions: Object.values(PermissionAction),
          }),
        );
        this.logger.log(`Super Admin permission created for: ${section.name}`);
      }
    }

    // Admin - Manage access to most sections
    const adminSections = sections.filter(
      (s) => !['auth', 'health'].includes(s.name),
    );
    for (const section of adminSections) {
      const existing = await this.permissionsRepository.findOne({
        where: { role: { id: adminRole.id }, section: { id: section.id } },
      });

      if (!existing) {
        await this.permissionsRepository.save(
          this.permissionsRepository.create({
            role: adminRole,
            section: section,
            actions: [
              PermissionAction.CREATE,
              PermissionAction.READ,
              PermissionAction.UPDATE,
              PermissionAction.DELETE,
            ],
          }),
        );
        this.logger.log(`Admin permission created for: ${section.name}`);
      }
    }

    // User - Basic access
    const userSections = sections.filter((s) =>
      ['users', 'auth', 'health'].includes(s.name),
    );
    for (const section of userSections) {
      const existing = await this.permissionsRepository.findOne({
        where: { role: { id: userRole.id }, section: { id: section.id } },
      });

      if (!existing) {
        await this.permissionsRepository.save(
          this.permissionsRepository.create({
            role: userRole,
            section: section,
            actions: [PermissionAction.READ],
          }),
        );
        this.logger.log(`User permission created for: ${section.name}`);
      }
    }

    // Viewer - Read-only access
    for (const section of sections) {
      const existing = await this.permissionsRepository.findOne({
        where: { role: { id: viewerRole.id }, section: { id: section.id } },
      });

      if (!existing) {
        await this.permissionsRepository.save(
          this.permissionsRepository.create({
            role: viewerRole,
            section: section,
            actions: [PermissionAction.READ],
          }),
        );
        this.logger.log(`Viewer permission created for: ${section.name}`);
      }
    }
  }

  private async seedUsers() {
    // Find all roles with proper null checks
    const superAdminRole = await this.rolesRepository.findOne({
      where: { name: 'super_admin' },
    });
    const adminRole = await this.rolesRepository.findOne({
      where: { name: 'admin' },
    });
    const userRole = await this.rolesRepository.findOne({
      where: { name: 'user' },
    });
    const viewerRole = await this.rolesRepository.findOne({
      where: { name: 'viewer' },
    });

    // Check if roles exist
    if (!superAdminRole || !adminRole || !userRole || !viewerRole) {
      this.logger.error('Required roles not found for user seeding');
      return;
    }

    const users = [
      {
        email: 'superadmin1@example.com',
        password: 'superadmin1234',
        firstName: 'Super',
        lastName: 'Admin',
        roles: [superAdminRole],
      },
      {
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'System',
        lastName: 'Admin',
        roles: [adminRole],
      },
      {
        email: 'user@example.com',
        password: 'user123',
        firstName: 'Regular',
        lastName: 'User',
        roles: [userRole],
      },
      {
        email: 'viewer@example.com',
        password: 'viewer123',
        firstName: 'Read',
        lastName: 'Only',
        roles: [viewerRole],
      },
    ];

    for (const userData of users) {
      const existing = await this.usersRepository.findOne({
        where: { email: userData.email },
      });
      if (!existing) {
        const hashedPassword = await BcryptUtils.hashPassword(
          userData.password,
        );
        await this.usersRepository.save(
          this.usersRepository.create({
            ...userData,
            password: hashedPassword,
          }),
        );
        this.logger.log(`User created: ${userData.email}`);
      }
    }
  }

  // // Optional: Method to clear database (for testing)
  // async clearDatabase() {
  //   this.logger.log('Clearing database...');
  //   await this.permissionsRepository.delete({});
  //   await this.usersRepository.delete({});
  //   await this.rolesRepository.delete({});
  //   await this.sectionsRepository.delete({});
  //   this.logger.log('Database cleared successfully');
  // }

  // // Optional: Method to reset and reseed database
  // async resetDatabase() {
  //   this.logger.log('Resetting database...');
  //   await this.clearDatabase();
  //   await this.seedDatabase();
  //   this.logger.log('Database reset successfully');
  // }
}
