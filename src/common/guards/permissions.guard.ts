import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionAction } from '../enums/permission-action.enum';
import { User } from 'src/db/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user }: { user: User } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const hasPermission = this.checkPermissions(user, requiredPermissions);

    if (!hasPermission) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }

  private checkPermissions(user: User, requiredPermissions: string[]): boolean {
    const userPermissions = this.getUserPermissions(user);

    // Check if user has any of the required permissions
    return requiredPermissions.some(
      (permission) =>
        userPermissions.includes(permission) ||
        userPermissions.includes('*') ||
        this.checkWildcardPermission(userPermissions, permission),
    );
  }

  private checkWildcardPermission(
    userPermissions: string[],
    requiredPermission: string,
  ): boolean {
    const [requiredSection, requiredAction] = requiredPermission.split(':');

    // Check for section-wide permissions (e.g., "users:*")
    return userPermissions.some((userPermission) => {
      const [userSection, userAction] = userPermission.split(':');

      if (userSection === requiredSection) {
        if (userAction === '*' || userAction === PermissionAction.MANAGE) {
          return true;
        }
        if (userAction === requiredAction) {
          return true;
        }
      }

      return false;
    });
  }

  private getUserPermissions(user: User): string[] {
    const permissions: string[] = [];

    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permission.actions.forEach((action) => {
          const permissionString = `${permission.section.name}:${action}`;
          permissions.push(permissionString);
        });

        // Add wildcard permission for MANAGE action - FIXED
        if (permission.actions.includes(PermissionAction.MANAGE)) {
          permissions.push(`${permission.section.name}:*`);
        }
      });
    });

    return [...new Set(permissions)]; // Remove duplicates
  }
}
