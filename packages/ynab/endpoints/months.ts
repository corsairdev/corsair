import type { YnabEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	YnabEndpointInputSchemas as Inputs,
	YnabEndpointOutputSchemas as Outputs,
} from './types';

export const list: YnabEndpoints['monthsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'months.list',
			input: Inputs.monthsList,
			output: Outputs.monthsList,
		},
		input,
		({ budgetId, last_knowledge_of_server }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/months`,
			query: { last_knowledge_of_server },
		}),
		{
			log: (_, result) => ({ count: result.data.months?.length ?? 0 }),
		},
	);

/**
 * One month. `to_be_budgeted` is what is still unassigned, and `age_of_money`
 * is how many days old the money being spent is — both in the month's own
 * terms.
 */
export const get: YnabEndpoints['monthsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'months.get',
			input: Inputs.monthsGet,
			output: Outputs.monthsGet,
		},
		input,
		({ budgetId, month }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/months/${segment(month)}`,
		}),
		{
			log: (_, result) => ({
				month: result.data.month?.month ?? undefined,
				income: result.data.month?.income ?? undefined,
				toBeBudgeted: result.data.month?.to_be_budgeted ?? undefined,
			}),
		},
	);
