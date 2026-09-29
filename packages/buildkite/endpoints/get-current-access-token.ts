import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest, requireBuildkiteKey } from '../client';
import { BuildkiteEndpointOutputSchemas } from './types';

export const getCurrentAccessToken: BuildkiteEndpoints['getCurrentAccessToken'] =
	async (ctx, input) => {
		const response = await makeBuildkiteRequest<unknown>(
			'/v2/access-token',
			requireBuildkiteKey(ctx.key),
			{ method: 'GET' },
		);
		const parsed =
			BuildkiteEndpointOutputSchemas.getCurrentAccessToken.parse(response);

		await logEventFromContext(
			ctx,
			'buildkite.get_current_access_token',
			{ ...input },
			'completed',
		);
		return parsed;
	};
