import type { LobEndpoints } from '..';
import { call } from './call';
import {
	LobEndpointInputSchemas as Inputs,
	LobEndpointOutputSchemas as Outputs,
} from './types';

// GET /accounts per the spec. Lob's spec code sample uses the alias
// /accounts/credits_balance; both were live (401 unauthenticated) when
// probed, and the spec path is the one the cross-check knows.
export const getBalance: LobEndpoints['accountGetBalance'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.getBalance',
			input: Inputs.accountGetBalance,
			output: Outputs.accountGetBalance,
		},
		input,
		() => ({
			method: 'GET',
			path: '/accounts',
		}),
		{
			log: (_, result) => ({ balance: result.balance }),
		},
	);
