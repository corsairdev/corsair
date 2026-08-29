import { makeBreatheHrRequest } from '../client';
import type { BreatheHrContext } from '../index';
import type {
	EmployeesCreateInput,
	EmployeesCreateResponse,
	EmployeesGetInput,
	EmployeesGetResponse,
	EmployeesListInput,
	EmployeesListResponse,
} from './types';

export const Employees = {
	list: async (
		ctx: BreatheHrContext,
		input: EmployeesListInput,
	): Promise<EmployeesListResponse> => {
		const apiKey = ctx.key;
		const query: Record<string, any> = {};
		if (input.page) query.page = input.page;
		if (input.per_page) query.per_page = input.per_page;
		if (input.status) query.status = input.status;

		return await makeBreatheHrRequest<EmployeesListResponse>(
			'/employees',
			apiKey,
			{ query },
		);
	},

	get: async (
		ctx: BreatheHrContext,
		input: EmployeesGetInput,
	): Promise<EmployeesGetResponse> => {
		const apiKey = ctx.key;
		return await makeBreatheHrRequest<EmployeesGetResponse>(
			`/employees/${input.id}`,
			apiKey,
		);
	},

	create: async (
		ctx: BreatheHrContext,
		input: EmployeesCreateInput,
	): Promise<EmployeesCreateResponse> => {
		const apiKey = ctx.key;
		return await makeBreatheHrRequest<EmployeesCreateResponse>(
			'/employees',
			apiKey,
			{
				method: 'POST',
				body: { employee: input },
			},
		);
	},
};
