import { logtoGoogleOneTapCookieKey } from '@riven/connector-kit';
import { adminConsoleApplicationId, logtoCookieKey, logtoUiCookieGuard } from '@riven/schemas';
import { trySafe } from '@silverhand/essentials';
import { getCookie } from 'tiny-cookie';

export const logtoCookies =
  trySafe(() => logtoUiCookieGuard.parse(getCookie(logtoCookieKey, JSON.parse))) ?? {};

export const shouldTrack = logtoCookies.appId === adminConsoleApplicationId;

export const logtoGoogleOneTapCookie =
  trySafe(() => {
    const cookieValue = getCookie(logtoGoogleOneTapCookieKey);
    return cookieValue ?? null;
  }) ?? null;
