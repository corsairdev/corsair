import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest } from '../client';
import type { BuildkiteEndpointOutputs } from './types';

export const listPipelineAgents: BuildkiteEndpoints['listPipelineAgents'] =
	async (ctx, input) => {
		const orgSlug = encodeURIComponent(input.orgSlug);
		const response = await makeBuildkiteRequest<
			BuildkiteEndpointOutputs['listPipelineAgents']
		>(`/v2/organizations/${orgSlug}/agents`, ctx.key, {
			method: 'GET',
			query: {
				name: input.name,
				hostname: input.hostname,
				version: input.version,
				cluster_queue_id: input.cluster_queue_id,
				page: input.page,
				per_page: input.per_page,
			},
		});

		await logEventFromContext(
			ctx,
			'buildkite.list_pipeline_agents',
			{ ...input },
			'completed',
		);
		return response;
	};
