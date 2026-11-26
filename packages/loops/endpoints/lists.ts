import type { LoopsEndpoints } from '..';
import { call } from './call';
import {
	LoopsEndpointInputSchemas as Inputs,
	LoopsEndpointOutputSchemas as Outputs,
} from './types';

export const list: LoopsEndpoints['listsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.list',
			input: Inputs.listsList,
			output: Outputs.listsList,
		},
		input,
		() => ({ method: 'GET', path: '/v1/lists' }),
	);
