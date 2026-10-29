import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.

export const listGlossaries: HeygenEndpoints['brandListGlossaries'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['brandListGlossaries']
	>('/v3/brand-glossaries', ctx.key, {
		method: 'GET',
		query: { limit: input.limit, token: input.token },
	});

	await logEventFromContext(
		ctx,
		'heygen.brand.listGlossaries',
		{},
		'completed',
	);
	return result;
};

export const listKits: HeygenEndpoints['brandListKits'] = async (
	ctx,
	input,
) => {
	const result = await makeHeygenRequest<
		HeygenEndpointOutputs['brandListKits']
	>('/v3/brand-kits', ctx.key, {
		method: 'GET',
		query: { limit: input.limit, token: input.token },
	});

	await logEventFromContext(ctx, 'heygen.brand.listKits', {}, 'completed');
	return result;
};
