/**
 * Enum representing various permissions in the system.
 */
export enum Permission {
  // User management permissions
  MANAGE_USERS = 'MANAGE_USERS',
  // Car management permissions
  MANAGE_CARS = 'MANAGE_CARS',
  CREATE_CAR = 'CREATE_CAR',
  UPDATE_CAR = 'UPDATE_CAR',
  DELETE_CAR = 'DELETE_CAR',
  // Comment management permissions
  MANAGE_COMMENTS = 'MANAGE_COMMENTS',
  DELETE_ANY_COMMENT = 'DELETE_ANY_COMMENT',
  // Reservation management permissions
  MANAGE_RESERVATIONS = 'MANAGE_RESERVATIONS',
  UPDATE_RESERVATION_STATUS = 'UPDATE_RESERVATION_STATUS',
  USERS_UPDATE = 'USERS_UPDATE',
  USERS_DELETE = 'USERS_DELETE',
  USERS_VIEW = 'USERS_VIEW',
  ADMIN_USER_CREATE = 'ADMIN_USER_CREATE',
  ADMIN_USER_ACTIVATE = 'ADMIN_USER_ACTIVATE',
  ADMIN_USER_DEACTIVATE = 'ADMIN_USER_DEACTIVATE',
  UPDATE_USER_ROLE = 'UPDATE_USER_ROLE',
}

/**
 * Type representing user roles in the system.
 */
export type UserRole = 'admin' | 'agent';

/**
 * Mapping of user roles to their associated permissions.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  agent: [
    // Agents can manage cars
    Permission.CREATE_CAR,
    Permission.UPDATE_CAR,
    Permission.DELETE_CAR,
    // Agents can view reservations
    Permission.MANAGE_RESERVATIONS,
    Permission.UPDATE_RESERVATION_STATUS,
  ],
  admin: [
    // Admins have all permissions
    Permission.MANAGE_USERS,
    Permission.MANAGE_COMMENTS,
    Permission.DELETE_ANY_COMMENT,
    Permission.MANAGE_RESERVATIONS,
    Permission.UPDATE_RESERVATION_STATUS,
    Permission.USERS_DELETE,
    Permission.USERS_VIEW,
    Permission.ADMIN_USER_CREATE,
    Permission.ADMIN_USER_ACTIVATE,
    Permission.ADMIN_USER_DEACTIVATE,
    Permission.UPDATE_USER_ROLE,
  ],
};
