import type { Role } from '@riven/schemas';

export type RoleDetailsOutletContext = {
  role: Role;
  isDeleting: boolean;
  onRoleUpdated: (role: Role) => void;
};
