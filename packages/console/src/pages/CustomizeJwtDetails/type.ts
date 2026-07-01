import type { AccessTokenJwtCustomizer, ClientCredentialsJwtCustomizer } from '@riven/schemas';
import { LogtoJwtTokenKeyType } from '@riven/schemas';
import { z } from 'zod';

import { Action } from '../CustomizeJwt/utils/type';

export type JwtCustomizerForm = {
  tokenType: LogtoJwtTokenKeyType;
  script: string;
  blockIssuanceOnError: boolean;
  environmentVariables?: Array<{ key: string; value: string }>;
  testSample: {
    contextSample?: string;
    tokenSample?: string;
  };
};

export type JwtCustomizer<T extends LogtoJwtTokenKeyType> =
  T extends LogtoJwtTokenKeyType.AccessToken
    ? AccessTokenJwtCustomizer
    : ClientCredentialsJwtCustomizer;

export const pageParamsGuard = z.object({
  tokenType: z.nativeEnum(LogtoJwtTokenKeyType),
  action: z.nativeEnum(Action),
});
