export const PERMISSIONS = {
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    MANAGE: 'users:manage',
  },
  ROLES: {
    CREATE: 'roles:create',
    READ: 'roles:read',
    UPDATE: 'roles:update',
    DELETE: 'roles:delete',
    MANAGE: 'roles:manage',
  },
  SECTIONS: {
    CREATE: 'sections:create',
    READ: 'sections:read',
    UPDATE: 'sections:update',
    DELETE: 'sections:delete',
    MANAGE: 'sections:manage',
  },
  PERMISSIONS: {
    CREATE: 'permissions:create',
    READ: 'permissions:read',
    UPDATE: 'permissions:update',
    DELETE: 'permissions:delete',
    MANAGE: 'permissions:manage',
  },
  AUTH: {
    READ: 'auth:read',
    MANAGE: 'auth:manage',
  },
  HEALTH: {
    READ: 'health:read',
  },
};

export const ALL_PERMISSIONS = Object.values(PERMISSIONS).flatMap((section) =>
  Object.values(section),
);
