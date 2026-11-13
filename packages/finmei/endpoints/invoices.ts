import { makeFinmeiBinaryRequest, makeFinmeiRequest } from '../client';
import type { FinmeiEndpoints } from '../index';
import { compactQuery, safeLog, seg } from './shared';
import type {
	FinmeiDeleteResponse,
	FinmeiInvoice,
	FinmeiPaginationMeta,
} from './types';
import {
	FinmeiBinaryResponseSchema,
	FinmeiDeleteResponseSchema,
	FinmeiInvoiceOutputSchema,
	FinmeiListInvoicesOutputSchema,
} from './types';

export const list: FinmeiEndpoints['invoicesList'] = async (ctx, input) => {
	const query = compactQuery({
		page: input.page,
		per_page: input.per_page,
	});

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiInvoice[];
		meta?: FinmeiPaginationMeta;
	}>('/invoices', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = FinmeiListInvoicesOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.list', {
		count: parsed.data.length,
		page: input.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['invoicesCreate'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiInvoice;
	}>('/invoices', ctx.key, {
		method: 'POST',
		body: input,
	});

	const parsed = FinmeiInvoiceOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.create', {
		id: parsed.data.id,
		currency: parsed.data.currency,
	});
	return parsed;
};

export const get: FinmeiEndpoints['invoicesGet'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiInvoice;
	}>(`/invoices/${seg(input.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiInvoiceOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.get', {
		id: input.id,
	});
	return parsed;
};

export const update: FinmeiEndpoints['invoicesUpdate'] = async (ctx, input) => {
	const { id, ...bodyFields } = input;

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiInvoice;
	}>(`/invoices/${seg(id)}`, ctx.key, {
		method: 'PUT',
		body: bodyFields,
	});

	const parsed = FinmeiInvoiceOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.update', {
		id,
	});
	return parsed;
};

export const del: FinmeiEndpoints['invoicesDelete'] = async (ctx, input) => {
	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/invoices/${seg(input.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = FinmeiDeleteResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.delete', {
		id: input.id,
	});
	return parsed;
};

export const download: FinmeiEndpoints['invoicesDownload'] = async (
	ctx,
	input,
) => {
	// `unknown` because response from provider binary download is checked with Zod schema.
	const rawResponse: unknown = await makeFinmeiBinaryRequest(
		`/invoices/${seg(input.id)}/download`,
		ctx.key,
	);

	const parsed = FinmeiBinaryResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.download', {
		id: input.id,
		contentType: parsed.contentType,
	});
	return parsed;
};

export const Invoices = {
	list,
	create,
	get,
	update,
	delete: del,
	download,
};
