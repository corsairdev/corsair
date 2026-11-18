import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest } from '../client';
import type {
	InvoiceDetails,
	InvoicesListResponse,
	InvoicesRenderResponse,
	ResourceMutationResponse,
} from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const list: LexofficeEndpoints['invoicesList'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.invoicesList.parse(input);
	const response = await makeLexofficeRequest<InvoicesListResponse>(
		'/invoices',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.invoicesList.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.invoices.list',
		{ count: parsed.content.length },
		'completed',
	);
	return parsed;
};

export const get: LexofficeEndpoints['invoicesGet'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.invoicesGet.parse(input);
	const response = await makeLexofficeRequest<InvoiceDetails>(
		`/invoices/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LexofficeEndpointOutputSchemas.invoicesGet.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.invoices.get',
		{ invoiceId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const create: LexofficeEndpoints['invoicesCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = LexofficeEndpointInputSchemas.invoicesCreate.parse(input);
	const { finalize, ...body } = parsedInput;
	const query =
		finalize !== undefined
			? { finalize: finalize ? 'true' : 'false' }
			: undefined;
	const response = await makeLexofficeRequest<ResourceMutationResponse>(
		'/invoices',
		ctx.key,
		{
			method: 'POST',
			body,
			query,
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.invoicesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.invoices.create',
		{ invoiceId: parsed.id },
		'completed',
	);
	return parsed;
};

export const render: LexofficeEndpoints['invoicesRender'] = async (
	ctx,
	input,
) => {
	const parsedInput = LexofficeEndpointInputSchemas.invoicesRender.parse(input);
	const response = await makeLexofficeRequest<InvoicesRenderResponse>(
		`/invoices/${encodeURIComponent(parsedInput.id)}/document`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LexofficeEndpointOutputSchemas.invoicesRender.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.invoices.render',
		{ invoiceId: parsedInput.id, documentFileId: parsed.documentFileId },
		'completed',
	);
	return parsed;
};
