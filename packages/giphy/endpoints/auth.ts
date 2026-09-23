import { AuthMissingError } from 'corsair/core';
import type { GiphyContext } from '../index';

/**
 * Resolves the API key for an endpoint call: explicit `options.key` first,
 * then the account key manager, then the pre-resolved context key.
 */
export async function resolveApiKey(ctx: GiphyContext): Promise<string> {
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}
	return apiKey;
}
