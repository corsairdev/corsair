import type { PerigonEndpoints } from '..';
import { call } from './call';
import {
	PerigonEndpointInputSchemas as Inputs,
	PerigonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PerigonEndpoints['storiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stories.list',
			input: Inputs.storiesList,
			output: Outputs.storiesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/v1/stories/all', query }),
		{ log: (_, page) => ({ count: page.stories.length }) },
	);
