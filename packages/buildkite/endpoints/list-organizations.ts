import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest, requireBuildkiteKey } from '../client';
import { BuildkiteEndpointOutputSchemas } from './types';

export const listOrganizations: BuildkiteEndpoints['listOrganizations'] =
	async (ctx, input) => {
		const response = await makeBuildkiteRequest<unknown>(
			'/v2/organizations',
			requireBuildkiteKey(ctx.key),
			{
				method: 'GET',
				query: {
					page: input.page,
					per_page: input.per_page,
				},
			},
		);
		const parsed =
			BuildkiteEndpointOutputSchemas.listOrganizations.parse(response);

		await logEventFromContext(
			ctx,
			'buildkite.list_organizations',
			{ ...input },
			'completed',
		);
		return parsed;
	};
