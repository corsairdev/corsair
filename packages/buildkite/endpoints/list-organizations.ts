import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import type { BuildkiteEndpointOutputs } from './types';

export const listOrganizations: BuildkiteEndpoints['listOrganizations'] =
	async (ctx, input) => {
		const response = await makeBuildkiteRequest<
			BuildkiteEndpointOutputs['listOrganizations']
		>('/v2/organizations', ctx.key, {
			method: 'GET',
			query: {
				page: input.page,
				per_page: input.per_page,
			},
		});

		await logEventFromContext(
			ctx,
			'buildkite.list_organizations',
			{ ...input },
			'completed',
		);
		return response;
	};
