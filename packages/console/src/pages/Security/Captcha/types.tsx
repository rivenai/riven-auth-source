import { type RecaptchaEnterpriseMode } from '@riven/schemas';

export type CaptchaFormType = {
  siteKey: string;
  secretKey: string;
  projectId: string;
  domain?: string;
  mode?: RecaptchaEnterpriseMode;
};
