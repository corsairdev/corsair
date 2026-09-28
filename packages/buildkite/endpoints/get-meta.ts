import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import { BuildkiteEndpointOutputSchemas } from './types';

export const getMeta: BuildkiteEndpoints['getMeta'] = async (ctx, input) => {
	const response = await makeBuildkiteRequest<unknown>('/v2/meta', undefined, {
		method: 'GET',
	});
	const parsed = BuildkiteEndpointOutputSchemas.getMeta.parse(response);

	await logEventFromContext(
		ctx,
		'buildkite.get_meta',
		{ ...input },
		'completed',
	);
	return parsed;
};
