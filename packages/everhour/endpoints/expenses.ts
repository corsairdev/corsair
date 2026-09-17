import { makeEverhourRequest } from '../client';
import type {
	EverhourExpense,
	EverhourExpenseCategory,
} from '../schema/database';

export const listExpenses = async (
	ctx: any,
	options: { query?: Record<string, any> } = {},
) => {
	return makeEverhourRequest<EverhourExpense[]>('/expenses', ctx.key, {
		method: 'GET',
		query: options.query,
	});
};

export const listExpenseCategories = async (ctx: any) => {
	return makeEverhourRequest<EverhourExpenseCategory[]>(
		'/expenses/categories',
		ctx.key,
	);
};
