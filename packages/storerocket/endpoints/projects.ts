import type { StorerocketEndpoints } from '..';
import { call } from './call';
import {
	StorerocketEndpointInputSchemas as Inputs,
	StorerocketEndpointOutputSchemas as Outputs,
} from './types';

export const list: StorerocketEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		() => ({
			method: 'GET',
			path: '/projects',
		}),
		{
			log: (_, result) => ({ count: result.data.length }),
		},
	);
