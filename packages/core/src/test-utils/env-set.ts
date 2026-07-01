import { defaultTenantId } from '@riven/schemas';

import { EnvSet } from '#src/env-set/index.js';

export const mockEnvSet = new EnvSet(defaultTenantId, EnvSet.values.dbUrl);

await mockEnvSet.load();
