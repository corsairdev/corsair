import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import type { BuildkiteEndpointOutputs } from './types';

export const getCurrentAccessToken: BuildkiteEndpoints['getCurrentAccessToken'] =
	async (ctx, input) => {
		const response = await makeBuildkiteRequest<
			BuildkiteEndpointOutputs['getCurrentAccessToken']
		>('/v2/access-token', ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'buildkite.get_current_access_token',
			{ ...input },
			'completed',
		);
		return response;
	};
