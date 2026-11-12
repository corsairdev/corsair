import type { KadoaEndpoints } from '..';
import { call } from './call';
import {
	KadoaEndpointInputSchemas as Inputs,
	KadoaEndpointOutputSchemas as Outputs,
} from './types';

export const list: KadoaEndpoints['locationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'locations.list',
			input: Inputs.locationsList,
			output: Outputs.locationsList,
		},
		input,
		() => ({ method: 'GET', path: '/v4/locations' }),
		{ log: (_, result) => ({ count: result.locations.length }) },
	);
