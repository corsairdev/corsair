import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import { BuildkiteEndpointOutputSchemas } from './types';

export const getUser: BuildkiteEndpoints['getUser'] = async (ctx, input) => {
	const response = await makeBuildkiteRequest<unknown>('/v2/user', ctx.key, {
		method: 'GET',
	});
	const parsed = BuildkiteEndpointOutputSchemas.getUser.parse(response);

	await logEventFromContext(
		ctx,
		'buildkite.get_user',
		{ ...input },
		'completed',
	);
	return parsed;
};
