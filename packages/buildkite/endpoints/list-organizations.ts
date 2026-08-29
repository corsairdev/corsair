import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import type { BuildkiteEndpointOutputs } from './types';

export const listOrganizations: BuildkiteEndpoints['listOrganizations'] =
	async (ctx, input) => {
		const query: Record<string, string | number> = {};
		if (input.page !== undefined) query.page = input.page;
		if (input.perPage !== undefined) query.per_page = input.perPage;

		const response = await makeBuildkiteRequest<
			BuildkiteEndpointOutputs['listOrganizations']
		>('/v2/organizations', ctx.key, { method: 'GET', query });

		await logEventFromContext(
			ctx,
			'buildkite.list_organizations',
			{ ...input },
			'completed',
		);
		return response;
	};
