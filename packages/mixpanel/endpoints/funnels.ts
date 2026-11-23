import type { MixpanelEndpoints } from '..';
import { resolveProjectId } from '../client';
import { call } from './call';
import {
	MixpanelEndpointInputSchemas as Inputs,
	MixpanelEndpointOutputSchemas as Outputs,
} from './types';

export const list: MixpanelEndpoints['funnelsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'funnels.list',
			input: Inputs.funnelsList,
			output: Outputs.funnelsList,
		},
		input,
		async (parsed) => ({
			service: 'query',
			replayable: true,
			method: 'GET',
			path: '/funnels/list',
			query: {
				project_id: await resolveProjectId(ctx),
				workspace_id: parsed.workspace_id,
			},
		}),
		{
			// The body is a bare array; wrap it so callers read `funnels`.
			shape: (raw) => ({ funnels: raw }),
			log: (_, result) => ({ funnels: result.funnels.length }),
		},
	);
