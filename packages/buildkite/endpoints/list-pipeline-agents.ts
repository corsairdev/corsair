import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import type { BuildkiteEndpointOutputs } from './types';

export const listPipelineAgents: BuildkiteEndpoints['listPipelineAgents'] =
	async (ctx, input) => {
		const query: Record<string, string | number> = {};
		if (input.page !== undefined) query.page = input.page;
		if (input.perPage !== undefined) query.per_page = input.perPage;

		const response = await makeBuildkiteRequest<
			BuildkiteEndpointOutputs['listPipelineAgents']
		>(`/v2/organizations/${input.orgSlug}/agents`, ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'buildkite.list_pipeline_agents',
			{ ...input },
			'completed',
		);
		return response;
	};
