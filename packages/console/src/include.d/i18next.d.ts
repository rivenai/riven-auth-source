// https://react.i18next.com/latest/typescript#create-a-declaration-file

import type { LocalePhrase } from '@riven/phrases';
import type { LocalePhrase as ExperiencePhrase } from '@riven/phrases-experience';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: LocalePhrase & {
      experience: ExperiencePhrase['translation'];
    };
  }
}
