import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { FinerWorksCredentials } from '../client';
import type { FinerWorksContext } from '../index';
import type {
	FinerWorksEndpointInputs,
	FinerWorksEndpointOutputs,
} from './types';

/**
 * Endpoint signature shared by every FinerWorks operation, keyed by the
 * `group.operation` name used in the schema and meta registries.
 */
export type FinerWorksEndpoint<K extends keyof FinerWorksEndpointInputs> =
	CorsairEndpoint<
		FinerWorksContext,
		FinerWorksEndpointInputs[K],
		FinerWorksEndpointOutputs[K]
	>;

/**
 * FinerWorks needs two credentials on every call. `ctx.key` carries the
 * `web_api_key` resolved by the plugin's keyBuilder; the `app_key` arrives
 * either as a plugin option or through the connected account's stored keys.
 */
export async function resolveCredentials(
	ctx: FinerWorksContext,
): Promise<FinerWorksCredentials> {
	const webApiKey = ctx.key;
	if (!webApiKey) {
		throw new AuthMissingError('finerworks', 'api_key');
	}

	const appKey = ctx.options?.appKey ?? (await ctx.keys?.get_app_key?.()) ?? '';
	if (!appKey) {
		throw new AuthMissingError(
			'finerworks',
			'app_key',
			'[auth-missing:finerworks:app_key]: a FinerWorks app key is required in addition to the web API key - create one under Account > API in FinerWorks, then pass it as the `appKey` plugin option.',
		);
	}

	return { webApiKey, appKey };
}
