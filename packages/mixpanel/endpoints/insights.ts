import type { MixpanelEndpoints } from '..';
import { resolveProjectId } from '../client';
import { call } from './call';
import {
	MixpanelEndpointInputSchemas as Inputs,
	MixpanelEndpointOutputSchemas as Outputs,
} from './types';

export const query: MixpanelEndpoints['insightsQuery'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'insights.query',
			input: Inputs.insightsQuery,
			output: Outputs.insightsQuery,
		},
		input,
		async (parsed) => ({
			service: 'query',
			replayable: true,
			method: 'GET',
			path: '/insights',
			query: {
				bookmark_id: parsed.bookmark_id,
				project_id: await resolveProjectId(ctx),
				workspace_id: parsed.workspace_id,
			},
		}),
		{
			log: ({ bookmark_id }) => ({ bookmarkId: bookmark_id }),
		},
	);
