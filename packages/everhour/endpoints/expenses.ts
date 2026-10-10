import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type {
	EverhourExpense,
	EverhourExpenseCategory,
} from '../schema/database';

export const listExpenses: EverhourEndpoints['listExpenses'] = async (
	ctx,
	options = {},
) => {
	return makeEverhourRequest<EverhourExpense[]>('/expenses', ctx.key, {
		method: 'GET',
		query: options.query,
	});
};

export const listExpenseCategories: EverhourEndpoints['listExpenseCategories'] =
	async (ctx) => {
		return makeEverhourRequest<EverhourExpenseCategory[]>(
			'/expenses/categories',
			ctx.key,
		);
	};
