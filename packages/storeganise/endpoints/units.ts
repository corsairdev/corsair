import type { StoreganiseEndpoints } from '..';
import { call } from './call';
import {
	StoreganiseEndpointInputSchemas as Inputs,
	StoreganiseEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoreganiseEndpoints['unitsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'units.list',
			input: Inputs.unitsList,
			output: Outputs.unitsList,
		},
		input,
		(_parsed, base) => ({
			method: 'GET',
			base,
			path: '/admin/units',
		}),
		{
			log: (_, units) => ({ count: units.length }),
		},
	);
