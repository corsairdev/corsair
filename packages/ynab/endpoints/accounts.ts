import type { YnabEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	YnabEndpointInputSchemas as Inputs,
	YnabEndpointOutputSchemas as Outputs,
} from './types';

export const list: YnabEndpoints['accountsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.list',
			input: Inputs.accountsList,
			output: Outputs.accountsList,
		},
		input,
		({ budgetId, last_knowledge_of_server }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/accounts`,
			query: { last_knowledge_of_server },
		}),
		{
			log: (_, result) => ({
				count: result.data.accounts?.length ?? 0,
				serverKnowledge: result.data.server_knowledge ?? undefined,
			}),
		},
	);

export const get: YnabEndpoints['accountsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.get',
			input: Inputs.accountsGet,
			output: Outputs.accountsGet,
		},
		input,
		({ budgetId, accountId }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/accounts/${segment(accountId)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data.account?.id ?? undefined,
				// The balance is a milliunit amount, not a currency value.
				balance: result.data.account?.balance ?? undefined,
				onBudget: result.data.account?.on_budget ?? false,
			}),
		},
	);

/** Creates an account. `balance` is milliunits, so $12.34 is 12,340. */
export const create: YnabEndpoints['accountsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'accounts.create',
			input: Inputs.accountsCreate,
			output: Outputs.accountsCreate,
		},
		input,
		({ budgetId, ...body }) => ({
			method: 'POST',
			path: `/budgets/${segment(budgetId)}/accounts`,
			body: { account: body },
		}),
		{
			log: (parsed, result) => ({
				id: result.data.account?.id ?? undefined,
				type: parsed.type,
			}),
		},
	);
