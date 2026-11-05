import { logEventFromContext } from 'corsair/core';
import type { ImgBBEndpoints } from '..';

/**
 * Confirms that an ImgBB API key is configured for this plugin instance.
 *
 * ImgBB does not expose a dedicated endpoint to validate an API key in
 * isolation — the key is only ever verified implicitly, as a side effect of
 * a real upload call. So rather than inventing an API request, this
 * operation relies on Corsair's own auth resolution: `ctx.key` is populated
 * by the plugin's `keyBuilder` before any endpoint runs, and `keyBuilder`
 * already throws `AuthMissingError` if no key is configured. Reaching this
 * function body is therefore itself proof that a key is present.
 *
 * The raw key is never returned or logged — only a short suffix, so a user
 * can sanity-check which credential is active.
 */
export const getApiKey: ImgBBEndpoints['getApiKey'] = async (ctx, _input) => {
	const keyPreview =
		ctx.key.length > 4 ? ctx.key.slice(-4) : '*'.repeat(ctx.key.length);

	await logEventFromContext(ctx, 'imgbb.auth.getApiKey', {}, 'completed');

	return {
		configured: true,
		keyPreview,
	};
};
