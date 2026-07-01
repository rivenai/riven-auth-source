import type { Resource } from '@riven/schemas';

export type ApiResourceDetailsOutletContext = {
  resource: Resource;
  isDeleting: boolean;
  isLogtoManagementApiResource: boolean;
  onResourceUpdated: (resource: Resource) => void;
};
