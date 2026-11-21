import type { PerigonEndpoints } from '..';
import { call } from './call';
import {
	PerigonEndpointInputSchemas as Inputs,
	PerigonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PerigonEndpoints['peopleList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.list',
			input: Inputs.peopleList,
			output: Outputs.peopleList,
		},
		input,
		(query) => ({ method: 'GET', path: '/v1/people/all', query }),
		{ log: (_, page) => ({ count: page.results.length }) },
	);
