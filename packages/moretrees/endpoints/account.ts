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

/**
 * Looks up accounts by account code or email address
 * (`GET /external/accounts`, OpenAPI `getAccountsInformation`).
 */
export const lookup: MoreTreesEndpoints['accountLookup'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'account.lookup',
			input: Inputs.accountLookup,
			output: Outputs.accountLookup,
		},
		input,
		({ accountCodes, emails, includeInactive }) => ({
			service: 'user_management',
			replayable: true,
			method: 'GET',
			path: '/accounts',
			// Repeated keys (accountCodes=A&accountCodes=B), which Spring binds
			// to a list.
			query: { accountCodes, emails, includeInactive },
		}),
		{
			// Counts only: the lookup carries email addresses.
			log: ({ accountCodes, emails }, result) => ({
				accountCodes: accountCodes?.length ?? 0,
				emails: emails?.length ?? 0,
				found: result.length,
			}),
		},
	);
