import type { MoceanEndpoints } from '..';
import { call } from './call';
import {
	MoceanEndpointInputSchemas as Inputs,
	MoceanEndpointOutputSchemas as Outputs,
} from './types';

/** Reads the account's remaining credit. */
export const balance: MoceanEndpoints['accountBalance'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.balance',
			input: Inputs.accountBalance,
			output: Outputs.accountBalance,
		},
		input,
		() => ({
			family: 'query',
			replayable: true,
			method: 'GET',
			path: '/account/balance',
			query: { 'mocean-resp-format': 'json' },
		}),
		{
			log: (_, result) => ({ value: result.value }),
		},
	);

/** Lists the account's per-destination pricing. */
export const pricing: MoceanEndpoints['accountPricing'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.pricing',
			input: Inputs.accountPricing,
			output: Outputs.accountPricing,
		},
		input,
		({ mocean_mcc, mocean_mnc, mocean_type }) => ({
			family: 'query',
			replayable: true,
			method: 'GET',
			path: '/account/pricing',
			query: {
				'mocean-mcc': mocean_mcc,
				'mocean-mnc': mocean_mnc,
				'mocean-type': mocean_type,
				'mocean-resp-format': 'json',
			},
		}),
		{
			log: (_, result) => ({ destinations: result.destinations.length }),
		},
	);
