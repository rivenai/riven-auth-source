import type { CustomClientMetadata } from '@riven/schemas';

declare module 'oidc-provider' {
  export interface AllClientMetadata extends CustomClientMetadata {}

  export interface Configuration {
    allowWildcardRedirectUris?: boolean;
  }
}
