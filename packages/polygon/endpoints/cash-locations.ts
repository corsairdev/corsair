import type { PolygonEndpoints } from '..';
import { call } from './call';
import {
	PolygonEndpointInputSchemas as Inputs,
	PolygonEndpointOutputSchemas as Outputs,
} from './types';

export const list: PolygonEndpoints['cashLocationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cashLocations.list',
			input: Inputs.cashLocationsList,
			output: Outputs.cashLocationsList,
		},
		input,
		({ limit, startingAfter, endingBefore }) => ({
			method: 'GET',
			path: '/cash-locations',
			query: { limit, startingAfter, endingBefore },
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);
