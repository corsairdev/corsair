import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/** Reads how much quota is used and available for a billing period. Free. */
export const lookup: MozEndpoints['quotaLookup'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'quota.lookup',
			input: Inputs.quotaLookup,
			output: Outputs.quotaLookup,
		},
		input,
		(parsed) => ({
			method: 'quota.lookup',
			data: parsed,
			// Free and read-only.
			replayable: true,
		}),
		{
			log: (parsed) => ({ path: parsed.path }),
		},
	);
