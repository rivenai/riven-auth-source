import { type FullSignInExperience } from '@riven/schemas';

export type SignInExperienceResponse = Omit<FullSignInExperience, 'socialSignInConnectorTargets'>;

export type Platform = 'web' | 'mobile';
