import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import type { BuildkiteEndpointOutputs } from './types';

export const getUser: BuildkiteEndpoints['getUser'] = async (ctx, input) => {
	const response = await makeBuildkiteRequest<
		BuildkiteEndpointOutputs['getUser']
	>('/v2/user', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'buildkite.get_user',
		{ ...input },
		'completed',
	);
	return response;
};
