import type { SplitwiseEndpoints } from '..';
import { segment } from '../client';
import { call, requireNoErrors, requireSuccess, toMoneyString } from './call';
import {
	SplitwiseEndpointInputSchemas,
	SplitwiseEndpointOutputSchemas,
} from './types';

/** Builds the query for `get_expenses`, dropping unset filters. */
export function expensesQuery(parsed: {
	group_id?: number;
	friend_id?: number;
	dated_after?: string;
	dated_before?: string;
	updated_after?: string;
	updated_before?: string;
	limit?: number;
	offset?: number;
}): Record<string, string | number | boolean | undefined> {
	return {
		group_id: parsed.group_id,
		friend_id: parsed.friend_id,
		dated_after: parsed.dated_after,
		dated_before: parsed.dated_before,
		updated_after: parsed.updated_after,
		updated_before: parsed.updated_before,
		limit: parsed.limit,
		offset: parsed.offset,
	};
}

/**
 * Flattens shares into Splitwise's `users__{index}__{property}` keys and
 * renders the money fields as the two-decimal strings it documents.
 */
export function flattenShares(
	users: readonly {
		user_id?: number;
		first_name?: string;
		last_name?: string;
		email?: string;
		paid_share: number;
		owed_share: number;
	}[],
): Record<string, string | number> {
	const flattened: Record<string, string | number> = {};
	users.forEach((share, index) => {
		const prefix = `users__${index}__`;
		if (share.user_id !== undefined)
			flattened[`${prefix}user_id`] = share.user_id;
		if (share.first_name !== undefined) {
			flattened[`${prefix}first_name`] = share.first_name;
		}
		if (share.last_name !== undefined) {
			flattened[`${prefix}last_name`] = share.last_name;
		}
		if (share.email !== undefined) flattened[`${prefix}email`] = share.email;
		flattened[`${prefix}paid_share`] = toMoneyString(share.paid_share);
		flattened[`${prefix}owed_share`] = toMoneyString(share.owed_share);
	});
	return flattened;
}

/** Builds the body both expense writes share, omitting unset optional fields. */
function expenseBody(parsed: {
	description?: string;
	cost?: number;
	details?: string;
	date?: string;
	currency_code?: string;
	category_id?: number;
	repeat_interval?: string;
	group_id?: number;
	users?: readonly {
		user_id?: number;
		first_name?: string;
		last_name?: string;
		email?: string;
		paid_share: number;
		owed_share: number;
	}[];
}): Record<string, string | number | boolean> {
	const body: Record<string, string | number | boolean> = {};
	// Splitwise documents `cost` as a decimal string, not a number.
	if (parsed.description !== undefined) body.description = parsed.description;
	if (parsed.cost !== undefined) body.cost = toMoneyString(parsed.cost);
	if (parsed.details !== undefined) body.details = parsed.details;
	if (parsed.date !== undefined) body.date = parsed.date;
	if (parsed.currency_code !== undefined) {
		body.currency_code = parsed.currency_code;
	}
	if (parsed.category_id !== undefined) body.category_id = parsed.category_id;
	if (parsed.repeat_interval !== undefined) {
		body.repeat_interval = parsed.repeat_interval;
	}
	if (parsed.group_id !== undefined) body.group_id = parsed.group_id;
	if (parsed.users !== undefined) {
		Object.assign(body, flattenShares(parsed.users));
	}
	return body;
}

export const list: SplitwiseEndpoints['expensesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'expenses.list',
			input: SplitwiseEndpointInputSchemas.listExpenses,
			output: SplitwiseEndpointOutputSchemas.listExpenses,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'get_expenses',
			query: expensesQuery(parsed),
		}),
		{
			log: (parsed, result) => ({
				group_id: parsed.group_id,
				friend_id: parsed.friend_id,
				expenses: result.expenses.length,
			}),
		},
	);

export const get: SplitwiseEndpoints['expensesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'expenses.get',
			input: SplitwiseEndpointInputSchemas.getExpense,
			output: SplitwiseEndpointOutputSchemas.getExpense,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `get_expense/${segment(parsed.expense_id)}`,
		}),
		{ log: (parsed) => ({ expense_id: parsed.expense_id }) },
	);

export const create: SplitwiseEndpoints['expensesCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'expenses.create',
			input: SplitwiseEndpointInputSchemas.createExpense,
			output: SplitwiseEndpointOutputSchemas.createExpense,
		},
		input,
		(parsed) => {
			const body = expenseBody(parsed);
			if (parsed.split_equally) body.split_equally = true;
			return { method: 'POST', path: 'create_expense', body };
		},
		{
			// The amount is the customer's own data, so only the group is logged.
			log: (parsed) => ({ group_id: parsed.group_id }),
			// Splitwise answers 200 with a populated `errors` map when it refused
			// the expense; the status code alone says nothing.
			assert: (result) => requireNoErrors(result, 'create the expense'),
		},
	);

export const update: SplitwiseEndpoints['expensesUpdate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'expenses.update',
			input: SplitwiseEndpointInputSchemas.updateExpense,
			output: SplitwiseEndpointOutputSchemas.updateExpense,
		},
		input,
		(parsed) => {
			const { expense_id, ...fields } = parsed;
			return {
				method: 'POST',
				path: `update_expense/${segment(expense_id)}`,
				body: expenseBody(fields),
			};
		},
		{
			log: (parsed) => ({ expense_id: parsed.expense_id }),
			assert: (result) => requireNoErrors(result, 'update the expense'),
		},
	);

export const remove: SplitwiseEndpoints['expensesDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'expenses.delete',
			input: SplitwiseEndpointInputSchemas.deleteExpense,
			output: SplitwiseEndpointOutputSchemas.deleteExpense,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `delete_expense/${segment(parsed.expense_id)}`,
		}),
		{
			log: (parsed) => ({ expense_id: parsed.expense_id }),
			assert: (result) => requireSuccess(result, 'delete the expense'),
		},
	);

export const undelete: SplitwiseEndpoints['expensesUndelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'expenses.undelete',
			input: SplitwiseEndpointInputSchemas.undeleteExpense,
			output: SplitwiseEndpointOutputSchemas.undeleteExpense,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `undelete_expense/${segment(parsed.expense_id)}`,
		}),
		{
			log: (parsed) => ({ expense_id: parsed.expense_id }),
			assert: (result) => requireSuccess(result, 'restore the expense'),
		},
	);
