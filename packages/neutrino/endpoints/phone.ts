import type { NeutrinoEndpoints } from '..';
import { call } from './call';
import {
	NeutrinoEndpointInputSchemas as Inputs,
	NeutrinoEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Parses a number into its international and local forms and reports the
 * location, carrier prefix and whether it is a mobile. It makes no network call
 * to the carrier.
 */
export const validate: NeutrinoEndpoints['phoneValidate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'phone.validate',
			input: Inputs.phoneValidate,
			output: Outputs.phoneValidate,
		},
		input,
		({ number, countryCode }) => ({
			method: 'GET',
			path: '/phone-validate',
			query: { number, 'country-code': countryCode },
		}),
		{
			log: (_, result) => ({
				countryCode: result['country-code'] ?? undefined,
				type: result.type ?? undefined,
				mobile: result['is-mobile'] ?? undefined,
			}),
		},
	);

/**
 * The home location register lookup: whether the number is live on its network,
 * which network it is on now, and whether it has been ported. This one does
 * query the carrier, so it costs more and can fail for a number the carrier will
 * not answer for.
 */
export const hlrLookup: NeutrinoEndpoints['phoneHlrLookup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'phone.hlrLookup',
			input: Inputs.phoneHlrLookup,
			output: Outputs.phoneHlrLookup,
		},
		input,
		({ number, countryCode }) => ({
			method: 'GET',
			path: '/hlr-lookup',
			query: { number, 'country-code': countryCode },
		}),
		{
			log: (_, result) => ({
				status: result['hlr-status'] ?? undefined,
				network: result['ported-network'] ?? undefined,
				ported: result['is-ported'] ?? undefined,
			}),
		},
	);
