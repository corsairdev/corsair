import type { LinklyContext, LinklyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LinklyEndpointInputSchemas as Inputs,
	LinklyEndpointOutputSchemas as Outputs,
} from './types';

export const list: LinklyEndpoints['domainsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: Inputs.domainsList,
			output: Outputs.domainsList,
		},
		input,
		({ workspace_id }) => ({
			method: 'GET',
			path: `/api/v1/workspace/${segment(workspace_id)}/domains`,
			replaySafe: true,
		}),
		{
			log: ({ workspace_id }, result) => ({
				workspaceId: workspace_id,
				count: result.domains.length,
			}),
		},
	);
