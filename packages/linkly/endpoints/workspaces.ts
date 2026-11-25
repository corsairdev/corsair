import type { LinklyEndpoints } from '..';
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
