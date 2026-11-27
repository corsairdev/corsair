import type { FreshBooksEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	FreshBooksEndpointInputSchemas as Inputs,
	FreshBooksEndpointOutputSchemas as Outputs,
} from './types';

const base = (accountId: string) =>
	`/accounting/account/${segment(accountId)}/expenses/expenses`;

export const list: FreshBooksEndpoints['expensesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'expenses.list',
			input: Inputs.expensesList,
			output: Outputs.expensesList,
			envelope: 'accounting',
		},
		input,
		({ accountId, page, per_page }) => ({
			method: 'GET',
			path: base(accountId),
			query: { page, per_page },
		}),
		{ log: ({ accountId }) => ({ accountId }) },
	);

export const get: FreshBooksEndpoints['expensesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'expenses.get',
			input: Inputs.expensesGet,
			output: Outputs.expensesGet,
			envelope: 'accounting',
		},
		input,
		({ accountId, expenseId }) => ({
			method: 'GET',
			path: `${base(accountId)}/${segment(expenseId)}`,
		}),
		{ log: ({ accountId, expenseId }) => ({ accountId, expenseId }) },
	);

export const create: FreshBooksEndpoints['expensesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'expenses.create',
			input: Inputs.expensesCreate,
			output: Outputs.expensesCreate,
			envelope: 'accounting',
		},
		input,
		({ accountId, expense }) => ({
			method: 'POST',
			path: base(accountId),
			body: { expense },
		}),
		{
			log: ({ accountId, expense }) => ({
				accountId,
				categoryId: expense.categoryid,
			}),
		},
	);

export const update: FreshBooksEndpoints['expensesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'expenses.update',
			input: Inputs.expensesUpdate,
			output: Outputs.expensesUpdate,
			envelope: 'accounting',
		},
		input,
		({ accountId, expenseId, expense }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(expenseId)}`,
			body: { expense },
		}),
		{ log: ({ accountId, expenseId }) => ({ accountId, expenseId }) },
	);

// Soft delete, same vis_state semantics as the other accounting resources.
export const remove: FreshBooksEndpoints['expensesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'expenses.delete',
			input: Inputs.expensesDelete,
			output: Outputs.expensesDelete,
			envelope: 'accounting',
		},
		input,
		({ accountId, expenseId }) => ({
			method: 'PUT',
			path: `${base(accountId)}/${segment(expenseId)}`,
			body: { expense: { vis_state: 1 } },
		}),
		{ log: ({ accountId, expenseId }) => ({ accountId, expenseId }) },
	);
