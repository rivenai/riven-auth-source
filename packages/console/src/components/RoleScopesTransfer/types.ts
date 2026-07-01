import type { ResourceResponse, ScopeResponse } from '@riven/schemas';

export type DetailedResourceResponse = Omit<ResourceResponse, 'scopes'> & {
  scopes: ScopeResponse[];
};
