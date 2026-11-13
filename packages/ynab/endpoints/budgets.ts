import type { YnabEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	YnabEndpointInputSchemas as Inputs,
	YnabEndpointOutputSchemas as Outputs,
} from './types';

export const list: YnabEndpoints['budgetsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'budgets.list',
			input: Inputs.budgetsList,
			output: Outputs.budgetsList,
		},
		input,
		({ include_accounts }) => ({
			method: 'GET',
			path: '/budgets',
			query: { include_accounts },
		}),
		{
			log: (_, result) => ({ count: result.data.budgets?.length ?? 0 }),
		},
	);

/**
 * A full budget, which is large: every account, category, payee, month and
 * transaction. `last-used` reaches the one most recently opened.
 */
export const get: YnabEndpoints['budgetsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'budgets.get',
			input: Inputs.budgetsGet,
			output: Outputs.budgetsGet,
		},
		input,
		({ budgetId }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data.budget?.id ?? undefined,
				accounts: result.data.budget?.accounts?.length ?? 0,
				categories: result.data.budget?.categories?.length ?? 0,
				// The counter a later delta request passes back.
				serverKnowledge: result.data.server_knowledge ?? undefined,
			}),
		},
	);
