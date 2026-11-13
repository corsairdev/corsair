import { makeFinmeiBinaryRequest, makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { compactQuery, safeLog, seg } from './shared';
import type {
	FinmeiDeleteResponse,
	FinmeiExpense,
	FinmeiPaginationMeta,
} from './types';
import {
	FinmeiBinaryResponseSchema,
	FinmeiDeleteResponseSchema,
	FinmeiExpenseOutputSchema,
	FinmeiListExpensesOutputSchema,
} from './types';

export const list: FinmeiEndpoints['expensesList'] = async (ctx, input) => {
	const query = compactQuery({
		page: input.page,
		per_page: input.per_page,
	});

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiExpense[];
		meta?: FinmeiPaginationMeta;
	}>('/expenses', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = FinmeiListExpensesOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.list', {
		count: parsed.data.length,
		page: input.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['expensesCreate'] = async (ctx, input) => {
	// If a base64 file is provided, submit as multipart/form-data.
	const fileBase64 = input.file;
	const requestOptions =
		typeof fileBase64 === 'string' && fileBase64.length > 0
			? {
					method: 'POST' as const,
					formData: {
						file: new Blob([Buffer.from(fileBase64, 'base64')], {
							type: input.fileType ?? 'application/pdf',
						}),
						seller: input.seller,
						total: String(input.total),
						currency: input.currency,
						date: input.date,
					},
				}
			: {
					method: 'POST' as const,
					body: {
						seller: input.seller,
						total: input.total,
						currency: input.currency,
						date: input.date,
					},
				};

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiExpense;
	}>('/expenses', ctx.key, requestOptions);

	const parsed = FinmeiExpenseOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.create', {
		id: parsed.data.id,
		currency: parsed.data.currency,
	});
	return parsed;
};

export const get: FinmeiEndpoints['expensesGet'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiExpense;
	}>(`/expenses/${seg(input.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiExpenseOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.get', {
		id: input.id,
	});
	return parsed;
};

export const update: FinmeiEndpoints['expensesUpdate'] = async (ctx, input) => {
	const { id, ...bodyFields } = input;

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiExpense;
	}>(`/expenses/${seg(id)}`, ctx.key, {
		method: 'PUT',
		body: bodyFields,
	});

	const parsed = FinmeiExpenseOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.update', {
		id,
	});
	return parsed;
};

export const del: FinmeiEndpoints['expensesDelete'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/expenses/${seg(input.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = FinmeiDeleteResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.delete', {
		id: input.id,
	});
	return parsed;
};

export const updateFile: FinmeiEndpoints['expensesUpdateFile'] = async (
	ctx,
	input,
) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiExpense;
	}>(`/expenses/${seg(input.id)}/file`, ctx.key, {
		method: 'POST',
		formData: {
			file: new Blob([Buffer.from(input.file, 'base64')], {
				type: input.fileType ?? 'application/pdf',
			}),
		},
	});

	const parsed = FinmeiExpenseOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.updateFile', {
		id: input.id,
	});
	return parsed;
};

export const download: FinmeiEndpoints['expensesDownload'] = async (
	ctx,
	input,
) => {
	// `unknown` because response from provider binary download is checked with Zod schema.
	const rawResponse: unknown = await makeFinmeiBinaryRequest(
		`/expenses/${seg(input.id)}/download`,
		ctx.key,
	);

	const parsed = FinmeiBinaryResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.download', {
		id: input.id,
		contentType: parsed.contentType,
	});
	return parsed;
};

export const Expenses = {
	list,
	create,
	get,
	update,
	delete: del,
	updateFile,
	download,
};
