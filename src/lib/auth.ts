import { Role, TenantUser } from "@prisma/client";

// Action and resource types
type Action = 'view' | 'create' | 'update' | 'delete';
type Resource =
  | 'employee'
  | 'invite-user'
  | 'designation'
  | 'department'
  | 'work-location'
  | 'leave-pending-request'
  | 'leave-my-data';

// Generate permissions based on access level
const generatePolicy = (
  accessLevel: 'full' | 'view' | 'view-create' | 'view-update',
  resource: Resource
): string[] => {
  switch (accessLevel) {
    case 'full':
      return [`view:${resource}`, `create:${resource}`, `update:${resource}`, `delete:${resource}`];
    case 'view':
      return [`view:${resource}`];
    case 'view-create':
      return [`view:${resource}`, `create:${resource}`];
    case 'view-update':
      return [`view:${resource}`, `update:${resource}`];
    default:
      return [];
  }
};

// Centralized resources
const COMMON_RESOURCES: Resource[] = [
  'employee',
  'designation',
  'department',
  'work-location',
];

const FULL_ACCESS = COMMON_RESOURCES.flatMap((res) => generatePolicy('full', res)).concat(
  generatePolicy('full', 'leave-pending-request'),
  generatePolicy('full', 'leave-my-data'),
  generatePolicy('full', 'invite-user'),
);

const VIEW_ONLY = COMMON_RESOURCES.flatMap((res) => generatePolicy('view', res));
const VIEW_CREATE = COMMON_RESOURCES.flatMap((res) => generatePolicy('view-create', res).concat(
  generatePolicy('view-update', 'leave-pending-request'),
));

// Role-based permissions
const PERMISSIONS: Record<Role, string[]> = {
  [Role.VIEWER]: VIEW_ONLY,
  [Role.AUDITOR]: VIEW_ONLY,
  [Role.STAKEHOLDER]: VIEW_ONLY,
  [Role.MANAGER]: VIEW_CREATE,
  [Role.ADMIN]: FULL_ACCESS,
  [Role.OWNER]: FULL_ACCESS,
  [Role.HR]: FULL_ACCESS,
  [Role.EMPLOYEE]: VIEW_ONLY.concat(generatePolicy('view-create', 'leave-my-data')),
};

// Check permission utility
export const checkPermission = (user: TenantUser, action: Action, resource: Resource) => {
  const permissions = PERMISSIONS[user.role];
  return permissions?.includes(`${action}:${resource}`) ?? false;
};
