import type { StormboardEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StormboardEndpointInputSchemas as Inputs,
	StormboardEndpointOutputSchemas as Outputs,
} from './types';

export const list: StormboardEndpoints['foldersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'folders.list',
			input: Inputs.foldersList,
			output: Outputs.foldersList,
		},
		input,
		({ teamId }) => ({
			method: 'GET',
			path: `/folders/${segment(teamId)}/list`,
		}),
	);
