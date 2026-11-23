import type { MixpanelEndpoints } from '..';
import { resolveProjectId } from '../client';
import { call } from './call';
import {
	MixpanelEndpointInputSchemas as Inputs,
	MixpanelEndpointOutputSchemas as Outputs,
} from './types';

export const list: MixpanelEndpoints['cohortsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'cohorts.list',
			input: Inputs.cohortsList,
			output: Outputs.cohortsList,
		},
		input,
		async (parsed) => ({
			service: 'query',
			replayable: true,
			method: 'POST',
			path: '/cohorts/list',
			query: {
				project_id: await resolveProjectId(ctx),
				workspace_id: parsed.workspace_id,
			},
		}),
		{
			// The body is a bare array; wrap it so callers read `cohorts`.
			shape: (raw) => ({ cohorts: raw }),
			log: (_, result) => ({ cohorts: result.cohorts.length }),
		},
	);
