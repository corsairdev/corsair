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
	FinmeiCreateExpenseInputSchema,
	FinmeiDeleteExpenseInputSchema,
	FinmeiDeleteResponseSchema,
	FinmeiDownloadExpenseInputSchema,
	FinmeiExpenseOutputSchema,
	FinmeiGetExpenseInputSchema,
	FinmeiListExpensesInputSchema,
	FinmeiListExpensesOutputSchema,
	FinmeiUpdateExpenseFileInputSchema,
	FinmeiUpdateExpenseInputSchema,
} from './types';

// Finmei checks the uploaded file's extension (jpeg, jpg, bmp, gif, pdf, png,
// tiff, xlsx, xls, doc, docx, odf), so the upload needs a file name, not a bare Blob.
const EXTENSION_BY_TYPE: Record<string, string> = {
	'application/pdf': 'pdf',
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/gif': 'gif',
	'image/bmp': 'bmp',
	'image/tiff': 'tiff',
	'application/msword': 'doc',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		'docx',
	'application/vnd.ms-excel': 'xls',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
};

function toUploadFile(base64: string, fileType?: string, fileName?: string) {
	const type = fileType ?? 'application/pdf';
	const name = fileName ?? `expense.${EXTENSION_BY_TYPE[type] ?? 'pdf'}`;
	return new File([Buffer.from(base64, 'base64')], name, { type });
}

export const list: FinmeiEndpoints['expensesList'] = async (ctx, input) => {
	const parsedInput = FinmeiListExpensesInputSchema.parse(input);
	const query = compactQuery({
		page: parsedInput.page,
		per_page: parsedInput.per_page,
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
		page: parsedInput.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['expensesCreate'] = async (ctx, input) => {
	const parsedInput = FinmeiCreateExpenseInputSchema.parse(input);

	// Finmei requires the bill file, so create always sends multipart/form-data.
	const requestOptions = {
		method: 'POST' as const,
		formData: {
			file: toUploadFile(
				parsedInput.file,
				parsedInput.fileType,
				parsedInput.fileName,
			),
			seller: parsedInput.seller,
			total: String(parsedInput.total),
			currency: parsedInput.currency,
			date: parsedInput.date,
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
	const parsedInput = FinmeiGetExpenseInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiExpense;
	}>(`/expenses/${seg(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiExpenseOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.get', {
		id: parsedInput.id,
	});
	return parsed;
};

export const update: FinmeiEndpoints['expensesUpdate'] = async (ctx, input) => {
	const parsedInput = FinmeiUpdateExpenseInputSchema.parse(input);
	const { id, ...bodyFields } = parsedInput;

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
	const parsedInput = FinmeiDeleteExpenseInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/expenses/${seg(parsedInput.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	// Finmei answers a delete with 200 and an empty body.
	const parsed = FinmeiDeleteResponseSchema.parse(
		rawResponse === '' ? null : rawResponse,
	);
	await safeLog(ctx, 'expenses.delete', {
		id: parsedInput.id,
	});
	return parsed;
};

export const updateFile: FinmeiEndpoints['expensesUpdateFile'] = async (
	ctx,
	input,
) => {
	const parsedInput = FinmeiUpdateExpenseFileInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiExpense;
	}>(`/expenses/${seg(parsedInput.id)}/file`, ctx.key, {
		method: 'POST',
		formData: {
			file: toUploadFile(
				parsedInput.file,
				parsedInput.fileType,
				parsedInput.fileName,
			),
		},
	});

	const parsed = FinmeiExpenseOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.updateFile', {
		id: parsedInput.id,
	});
	return parsed;
};

export const download: FinmeiEndpoints['expensesDownload'] = async (
	ctx,
	input,
) => {
	const parsedInput = FinmeiDownloadExpenseInputSchema.parse(input);

	// `unknown` because response from provider binary download is checked with Zod schema.
	const rawResponse: unknown = await makeFinmeiBinaryRequest(
		`/expenses/${seg(parsedInput.id)}/download`,
		ctx.key,
	);

	const parsed = FinmeiBinaryResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'expenses.download', {
		id: parsedInput.id,
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
