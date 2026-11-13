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
	FinmeiCreateInvoiceInputSchema,
	FinmeiDeleteInvoiceInputSchema,
	FinmeiDeleteResponseSchema,
	FinmeiDownloadInvoiceInputSchema,
	FinmeiGetInvoiceInputSchema,
	FinmeiInvoiceOutputSchema,
	FinmeiListInvoicesInputSchema,
	FinmeiListInvoicesOutputSchema,
	FinmeiUpdateInvoiceInputSchema,
} from './types';

export const list: FinmeiEndpoints['invoicesList'] = async (ctx, input) => {
	const parsedInput = FinmeiListInvoicesInputSchema.parse(input);
	const query = compactQuery({
		page: parsedInput.page,
		per_page: parsedInput.per_page,
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
		page: parsedInput.page ?? 1,
	});
	return parsed;
};

export const create: FinmeiEndpoints['invoicesCreate'] = async (ctx, input) => {
	const parsedInput = FinmeiCreateInvoiceInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiInvoice;
	}>('/invoices', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = FinmeiInvoiceOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.create', {
		id: parsed.data.id,
		currency: parsed.data.currency,
	});
	return parsed;
};

export const get: FinmeiEndpoints['invoicesGet'] = async (ctx, input) => {
	const parsedInput = FinmeiGetInvoiceInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<{
		data: FinmeiInvoice;
	}>(`/invoices/${seg(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});

	const parsed = FinmeiInvoiceOutputSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.get', {
		id: parsedInput.id,
	});
	return parsed;
};

export const update: FinmeiEndpoints['invoicesUpdate'] = async (ctx, input) => {
	const parsedInput = FinmeiUpdateInvoiceInputSchema.parse(input);
	const { id, ...bodyFields } = parsedInput;

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
	const parsedInput = FinmeiDeleteInvoiceInputSchema.parse(input);

	// `unknown` because response from provider is untrusted JSON before Zod schema validation.
	const rawResponse: unknown = await makeFinmeiRequest<FinmeiDeleteResponse>(
		`/invoices/${seg(parsedInput.id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = FinmeiDeleteResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.delete', {
		id: parsedInput.id,
	});
	return parsed;
};

export const download: FinmeiEndpoints['invoicesDownload'] = async (
	ctx,
	input,
) => {
	const parsedInput = FinmeiDownloadInvoiceInputSchema.parse(input);

	// `unknown` because response from provider binary download is checked with Zod schema.
	const rawResponse: unknown = await makeFinmeiBinaryRequest(
		`/invoices/${seg(parsedInput.id)}/download`,
		ctx.key,
	);

	const parsed = FinmeiBinaryResponseSchema.parse(rawResponse);
	await safeLog(ctx, 'invoices.download', {
		id: parsedInput.id,
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
