import { logEventFromContext } from 'corsair/core';
import type { BuildkiteEndpoints } from '..';
import { makeBuildkiteRequest, requireBuildkiteKey } from '../client';
import { BuildkiteEndpointOutputSchemas } from './types';

export const listPipelineAgents: BuildkiteEndpoints['listPipelineAgents'] =
	async (ctx, input) => {
		const response = await makeBuildkiteRequest<unknown>(
			'/v2/organizations/{orgSlug}/agents',
			requireBuildkiteKey(ctx.key),
			{
				method: 'GET',
				path: { orgSlug: input.orgSlug },
				query: {
					name: input.name,
					hostname: input.hostname,
					version: input.version,
					cluster_queue_id: input.cluster_queue_id,
					page: input.page,
					per_page: input.per_page,
				},
			},
		);
		const parsed =
			BuildkiteEndpointOutputSchemas.listPipelineAgents.parse(response);

		await logEventFromContext(
			ctx,
			'buildkite.list_pipeline_agents',
			{ ...input },
			'completed',
		);
		return parsed;
	};
