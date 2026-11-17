import type { NeedleEndpoints } from '..';
import { call } from './call';
import {
	NeedleEndpointInputSchemas as Inputs,
	NeedleEndpointOutputSchemas as Outputs,
} from './types';

export const search: NeedleEndpoints['placesSearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'places.search',
			input: Inputs.placesSearch,
			output: Outputs.placesSearch,
		},
		input,
		(body) => ({ method: 'POST', path: '/places/search', body }),
		{ log: (_, result) => ({ hits: result.hits.length }) },
	);
