import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/**
 * Not mirrored, never logged. `create`'s response carries `key` - the full,
 * usable service token, in plaintext, the one and only time the API ever
 * sends it. `auditPayload` below never receives it. See
 * `schema/database.ts`.
 */

/** Lists service tokens issued for a config - names and metadata, not keys. */
export const list: DopplerEndpoints['serviceTokensList'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		tokens: DopplerEndpointOutputs['serviceTokensList'];
	}>(ctx, 'configs/config/tokens', {
		query: { project: input.project, config: input.config },
	});

	await logEventFromContext(
		ctx,
		'doppler.serviceTokens.list',
		{
			...auditPayload(input, ['project', 'config']),
			returned: result.tokens.length,
		},
		'completed',
	);
	return result.tokens;
};

/** Creates a service token for a config. The response's `key` is shown once, here. */
export const create: DopplerEndpoints['serviceTokensCreate'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		token: DopplerEndpointOutputs['serviceTokensCreate'];
	}>(ctx, 'configs/config/tokens', {
		method: 'POST',
		body: compact({
			project: input.project,
			config: input.config,
			name: input.name,
			access: input.access,
			expire_at: input.expireAt,
		}),
	});

	await logEventFromContext(
		ctx,
		'doppler.serviceTokens.create',
		auditPayload(input, ['project', 'config', 'name']),
		'completed',
	);
	return result.token;
};

/** Revokes a service token. */
export const remove: DopplerEndpoints['serviceTokensDelete'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<
		DopplerEndpointOutputs['serviceTokensDelete']
	>(ctx, 'configs/config/tokens/token', {
		method: 'DELETE',
		body: { project: input.project, config: input.config, slug: input.slug },
	});

	await logEventFromContext(
		ctx,
		'doppler.serviceTokens.delete',
		auditPayload(input, ['project', 'config', 'slug']),
		'completed',
	);
	return result;
};
