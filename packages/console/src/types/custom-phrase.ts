import type { LanguageTag } from '@riven/language-kit';
import type { Translation } from '@riven/schemas';

export type CustomPhraseResponse = {
  languageTag: LanguageTag;
  translation: Translation;
};
