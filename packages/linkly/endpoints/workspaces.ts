import type { LinklyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	LinklyEndpointInputSchemas as Inputs,
	LinklyEndpointOutputSchemas as Outputs,
} from './types';

export const listWorkspaces: LinklyEndpoints['workspacesListWorkspaces'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'workspaces.listWorkspaces',
			input: Inputs.workspacesListWorkspaces,
			output: Outputs.workspacesListWorkspaces,
		},
		input,
		() => ({
			method: 'GET',
			path: '/api/v1/workspaces',
			replaySafe: true,
		}),
		{
			log: (_, result) => ({ count: result.length }),
		},
	);

export const update: LinklyEndpoints['workspacesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workspaces.update',
			input: Inputs.workspacesUpdate,
			output: Outputs.workspacesUpdate,
		},
		input,
		({ workspace_id, name, webhooks }) => ({
			method: 'PATCH',
			path: `/api/v1/workspace/${segment(workspace_id)}`,
			body: { name, webhooks },
			// The same fields again leave the same state.
			replaySafe: true,
		}),
		{
			log: ({ workspace_id, webhooks }) => ({
				workspaceId: workspace_id,
				webhooks: webhooks?.length,
			}),
		},
	);
