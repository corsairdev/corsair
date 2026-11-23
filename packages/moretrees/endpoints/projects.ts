import type { MoreTreesEndpoints } from '..';
import { call } from './call';
import {
	MoreTreesEndpointInputSchemas as Inputs,
	MoreTreesEndpointOutputSchemas as Outputs,
} from './types';

/** Lists every active planting project with its plantable trees. */
export const list: MoreTreesEndpoints['projectsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		() => ({
			service: 'project_management',
			replayable: true,
			method: 'GET',
			path: '/projects',
		}),
	);
