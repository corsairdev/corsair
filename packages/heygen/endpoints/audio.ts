import { logEventFromContext } from 'corsair/core';
import { makeHeygenRequest } from '../client';
import type { HeygenEndpoints } from '../index';
import type { HeygenEndpointOutputs } from './types';

// Migrated to HeyGen v3 API per developers.heygen.com. v3-only, no v1/v2 equivalent.

export const search: HeygenEndpoints['audioSearch'] = async (ctx, input) => {
	const result = await makeHeygenRequest<HeygenEndpointOutputs['audioSearch']>(
		'/v3/audio/sounds',
		ctx.key,
		{
			method: 'GET',
			query: {
				query: input.query,
				type: input.type,
				limit: input.limit,
				min_score: input.min_score,
				token: input.token,
			},
		},
	);

	await logEventFromContext(ctx, 'heygen.audio.search', {}, 'completed');
	return result;
};
