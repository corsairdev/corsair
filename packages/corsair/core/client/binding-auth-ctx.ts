import type { AccountKeyManagerFor } from '../auth/types';
import type { AuthTypes } from '../constants';

/**
 * Decides what auth fields the plugin binding context carries.
 *
 * When a key manager exists we pass both the manager and the auth type, so a
 * plugin's keyBuilder can narrow. When it does not (no `database`/`kek`), we
 * still carry a `managed` auth type so `resolveBindingKey` enters the managed
 * branch and throws a clean `AuthMissingError` instead of running the plugin
 * keyBuilder without a key store. Non-managed types are omitted in that case so
 * those plugins keep their own narrowing errors (their keyBuilder assumes
 * `ctx.keys` once it sees `authType === 'oauth_2'`).
 */
export function bindingAuthCtx(
	authType: AuthTypes | undefined,
	keys: AccountKeyManagerFor<AuthTypes> | undefined,
): { keys?: AccountKeyManagerFor<AuthTypes>; authType?: AuthTypes } {
	if (keys) return { keys, authType };
	if (authType === 'managed') return { authType };
	return {};
}
