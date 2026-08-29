import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import type { BuildkiteEndpointOutputs } from './types';

export const getMeta: BuildkiteEndpoints['getMeta'] = async (ctx, input) => {
	const response = await makeBuildkiteRequest<
		BuildkiteEndpointOutputs['getMeta']
	>(
		'/v2/meta',
		undefined, // Unauthenticated endpoint
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'buildkite.get_meta',
		{ ...input },
		'completed',
	);
	return response;
};
