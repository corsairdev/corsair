import type { MeloEndpoints } from '..';
import { call } from './call';
import {
	MeloEndpointInputSchemas as Inputs,
	MeloEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Asks Melo to send a test `match` or `event` payload to a URL. This is an
 * outbound API call that acts: it is a GET, but it is not replay safe, because
 * a retried call delivers the payload twice. Melo delivering to your own
 * server is not handled by this plugin.
 */
export const simulate: MeloEndpoints['webhooksSimulate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.simulate',
			input: Inputs.webhooksSimulate,
			output: Outputs.webhooksSimulate,
		},
		input,
		({ endpoint, eventType }) => ({
			method: 'GET',
			path: '/webhook-tester',
			query: { endpoint, eventType },
			replaySafe: false,
			bodyless: true,
		}),
		{
			// The spec documents a bare 200 with no body.
			shape: (_, { endpoint, eventType }) => ({
				sent: true,
				endpoint,
				simulated: eventType ?? 'match',
			}),
			log: (_, { simulated }) => ({ simulated }),
		},
	);
