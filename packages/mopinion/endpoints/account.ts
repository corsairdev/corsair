import type { MopinionEndpoints } from '..';
import { call } from './call';
import {
	MopinionEndpointInputSchemas as Inputs,
	MopinionEndpointOutputSchemas as Outputs,
} from './types';

/** Reads the account data for the signed credentials. */
export const get: MopinionEndpoints['accountGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		() => ({
			method: 'GET',
			path: '/account',
		}),
	);
