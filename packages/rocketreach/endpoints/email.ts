import type { RocketReachEndpoints } from '..';
import { call } from './call';
import {
	RocketReachEndpointInputSchemas as Inputs,
	RocketReachEndpointOutputSchemas as Outputs,
} from './types';

/**
 * `POST /email/verify/` charges one email-verification credit, and RocketReach
 * refunds it when the answer is `unknown` or the address is malformed
 * (`checks.format_valid` is false). A retry would charge a second credit for the
 * same address if the first request did reach the server, so it is not replayed.
 *
 * The address goes in a JSON body, not a path segment: the input schema allows
 * a JSON, form-encoded or multipart body, and JSON is the one the client sets.
 */
export const verify: RocketReachEndpoints['emailVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.verify',
			input: Inputs.emailVerify,
			output: Outputs.emailVerify,
		},
		input,
		({ email }) => ({
			method: 'POST',
			path: '/email/verify/',
			body: { email },
			replayable: false,
		}),
		{
			log: (_, result) => ({
				status: result.status ?? undefined,
				credits: result.credits_charged ?? undefined,
			}),
		},
	);
