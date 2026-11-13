import type { YnabEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	YnabEndpointInputSchemas as Inputs,
	YnabEndpointOutputSchemas as Outputs,
} from './types';

export const list: YnabEndpoints['categoriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'categories.list',
			input: Inputs.categoriesList,
			output: Outputs.categoriesList,
		},
		input,
		({ budgetId, last_knowledge_of_server }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/categories`,
			query: { last_knowledge_of_server },
		}),
		{
			log: (_, result) => ({
				groups: result.data.category_groups?.length ?? 0,
				categories: result.data.categories?.length ?? 0,
			}),
		},
	);

export const get: YnabEndpoints['categoriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'categories.get',
			input: Inputs.categoriesGet,
			output: Outputs.categoriesGet,
		},
		input,
		({ budgetId, categoryId }) => ({
			method: 'GET',
			path: `/budgets/${segment(budgetId)}/categories/${segment(categoryId)}`,
		}),
		{
			log: (_, result) => ({
				id: result.data.category?.id ?? undefined,
				budgeted: result.data.category?.budgeted ?? undefined,
				balance: result.data.category?.balance ?? undefined,
			}),
		},
	);

/**
 * Sets the amount assigned to a category for a month.
 *
 * `budgeted` is the **new total** for that month, in milliunits — it replaces
 * whatever was there rather than adding to it. Sending 50,000 sets the month to
 * $50, and sending 0 clears it.
 */
export const update: YnabEndpoints['categoriesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'categories.update',
			input: Inputs.categoriesUpdate,
			output: Outputs.categoriesUpdate,
		},
		input,
		({ budgetId, month, categoryId, budgeted }) => ({
			method: 'PATCH',
			path: `/budgets/${segment(budgetId)}/months/${segment(month)}/categories/${segment(categoryId)}`,
			body: { category: { budgeted } },
		}),
		{
			log: (parsed, result) => ({
				id: result.data.category?.id ?? parsed.categoryId,
				budgeted: parsed.budgeted,
				month: parsed.month,
			}),
		},
	);
