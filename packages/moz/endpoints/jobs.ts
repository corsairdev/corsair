import type { MozEndpoints } from '..';
import { call } from './call';
import {
	MozEndpointInputSchemas as Inputs,
	MozEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Reads an async_call back. A completed call carries exactly one of result
 * and error; both are null while the status is pending or processing. Free:
 * polling costs no rows.
 */
export const lookup: MozEndpoints['jobsLookup'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'jobs.lookup',
			input: Inputs.jobsLookup,
			output: Outputs.jobsLookup,
		},
		input,
		(parsed) => ({
			method: 'async.call.lookup',
			data: parsed,
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				callId: parsed.id,
				action: result.async_call.action,
				status: result.async_call.status,
			}),
		},
	);
