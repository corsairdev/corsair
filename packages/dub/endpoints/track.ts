import type { DubEndpoints } from '..';
import { call } from './call';
import {
	DubEndpointInputSchemas as Inputs,
	DubEndpointOutputSchemas as Outputs,
} from './types';

// Both calls append conversion data with no way to undo them, so they are
// irreversible writes and must never be replayed on a 5xx.
export const lead: DubEndpoints['trackLead'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'track.lead',
			input: Inputs.trackLead,
			output: Outputs.trackLead,
		},
		input,
		(body) => ({ method: 'POST', path: '/track/lead', body }),
	);

export const sale: DubEndpoints['trackSale'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'track.sale',
			input: Inputs.trackSale,
			output: Outputs.trackSale,
		},
		input,
		(body) => ({ method: 'POST', path: '/track/sale', body }),
	);
