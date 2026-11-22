import type { StannpEndpoints } from '..';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const balance: StannpEndpoints['accountBalance'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.balance',
			input: Inputs.accountBalance,
			output: Outputs.accountBalance,
		},
		input,
		(_parsed, base) => ({
			method: 'GET',
			base,
			path: '/v1/accounts/balance',
		}),
		{
			log: (_, result) => ({ balance: result.balance ?? undefined }),
		},
	);

// The docs also document a POST /v2/balance with an integer net and a
// different response envelope (a separate API style); this follows the v1
// surface the rest of the plugin uses.
export const topup: StannpEndpoints['accountTopup'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.topup',
			input: Inputs.accountTopup,
			output: Outputs.accountTopup,
		},
		input,
		({ net, idempotencyKey }, base) => ({
			method: 'POST',
			base,
			path: '/v1/accounts/topup',
			form: { net },
			idempotencyKey,
		}),
		{
			log: () => ({ toppedUp: true }),
		},
	);
