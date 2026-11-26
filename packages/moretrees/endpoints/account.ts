import type { MoreTreesEndpoints } from '..';
import { resolveAccountCode, segment } from '../client';
import { call } from './call';
import {
	MoreTreesEndpointInputSchemas as Inputs,
	MoreTreesEndpointOutputSchemas as Outputs,
} from './types';

/** Reads one account: name, credit balance, forest name and slug. */
export const getAccount: MoreTreesEndpoints['accountGet'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'account.get',
			input: Inputs.accountGet,
			output: Outputs.accountGet,
		},
		input,
		async ({ accountCode }, context) => ({
			service: 'user_management',
			replayable: true,
			method: 'GET',
			path: `/accounts/${segment(accountCode ?? (await resolveAccountCode(context)))}`,
		}),
	);
