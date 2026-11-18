import type { KanbanizeEndpoints } from '..';
import { call } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

export const list: KanbanizeEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.list',
			input: Inputs.tagsList,
			output: Outputs.tagsList,
		},
		input,
		() => ({ method: 'GET', path: '/tags' }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);
