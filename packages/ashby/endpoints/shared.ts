import { AuthMissingError } from 'corsair/core';
import { makeAshbyRequest } from '../client';
import type { AshbyContext } from '../index';

/**
 * Resolves the API key from plugin options or context keys.
 */
export async function getAshbyApiKey(ctx: AshbyContext): Promise<string> {
	if (ctx.options.key) {
		return ctx.options.key;
	}

	const key = await ctx.keys.get_api_key();
	if (!key) {
		throw new AuthMissingError('ashby', 'api_key');
	}
	return key;
}

/**
 * Dispatches an Ashby RPC request with key resolution.
 */
export async function ashbyCall<T>(
	ctx: AshbyContext,
	endpoint: string,
	body: Record<string, unknown> = {},
): Promise<T> {
	const apiKey = await getAshbyApiKey(ctx);
	return await makeAshbyRequest<T>(endpoint, apiKey, { body });
}
