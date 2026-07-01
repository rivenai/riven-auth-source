import { type OrganizationRole } from '@riven/schemas';

export type OrganizationRoleDetailsOutletContext = {
  organizationRole: OrganizationRole;
  isDeleting: boolean;
  onOrganizationRoleUpdated: (organizationRole: OrganizationRole) => void;
};
