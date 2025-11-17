/**
 * Enum representing various permissions in the system.
 */
export enum Permission {}

/**
 * Type representing user roles in the system.
 */
export type UserRole = 'admin' | 'agent';

/**
 * Mapping of user roles to their associated permissions.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  agent: [],
  admin: [],
};
