import { type TenantModel } from '@riven/schemas/models';

export type TenantSettingsForm = {
  profile: Pick<TenantModel, 'name' | 'tag'> & {
    regionName: string;
  };
  isMfaRequired: boolean;
};
