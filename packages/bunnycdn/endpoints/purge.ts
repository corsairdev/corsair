import type { BunnycdnContext } from '../index';
import { api } from './helpers';
import type { BunnycdnEndpointOutputs, PurgeUrlInput } from './types';

// Docs: https://bunny.net/docs/api-reference/core/purge/purge-url
export async function url(
	ctx: BunnycdnContext,
	input: PurgeUrlInput,
): Promise<BunnycdnEndpointOutputs['purgeUrl']> {
	return api(ctx, 'core', 'POST', '/purge', {
		query: {
			url: input.url,
			async: input.async,
			exactPath: input.exactPath,
		},
	});
}
