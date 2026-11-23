import type { MoceanEndpoints } from '..';
import { moceanForm } from '../client';
import { call } from './call';
import {
	MoceanEndpointInputSchemas as Inputs,
	MoceanEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Looks a number's carrier and porting status up. A metered read: it costs
 * prepaid credit, not a message. Without mocean_nl_url the full result comes
 * back synchronously; with it, Mocean posts the result to that URL and this
 * call only returns the msgid.
 */
export const request: MoceanEndpoints['lookupRequest'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'lookup.request',
			input: Inputs.lookupRequest,
			output: Outputs.lookupRequest,
		},
		input,
		({ mocean_to, mocean_nl_url }) => ({
			family: 'sms',
			replayable: true,
			method: 'POST',
			path: '/nl',
			body: moceanForm({
				'mocean-to': mocean_to,
				'mocean-nl-url': mocean_nl_url,
			}),
			mediaType: 'application/x-www-form-urlencoded',
		}),
		{
			log: (_, result) => ({ msgid: result.msgid ?? undefined }),
		},
	);
