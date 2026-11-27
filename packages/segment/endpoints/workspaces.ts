import type { SegmentContext, SegmentEndpoints } from '..';
import { call } from './call';
import {
	SegmentEndpointInputSchemas as Inputs,
	SegmentEndpointOutputSchemas as Outputs,
} from './types';

export const get: SegmentEndpoints['workspacesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workspaces.get',
			input: Inputs.workspacesGet,
			output: Outputs.workspacesGet,
		},
		input,
		() => ({ method: 'GET', path: '/' }),
		{
			log: (_, result) => ({ workspaceId: result.data.workspace.id ?? '' }),
		},
	);
