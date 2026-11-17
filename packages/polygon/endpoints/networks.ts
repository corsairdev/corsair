import type { PolygonEndpoints } from '..';
import { call } from './call';
import {
	PolygonEndpointInputSchemas as Inputs,
	PolygonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PolygonEndpoints['networksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'networks.list',
			input: Inputs.networksList,
			output: Outputs.networksList,
		},
		input,
		({ limit, startingAfter, endingBefore }) => ({
			method: 'GET',
			path: '/networks',
			query: { limit, startingAfter, endingBefore },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);
