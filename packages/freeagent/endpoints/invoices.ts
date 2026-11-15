import { logEventFromContext } from 'corsair/core';
import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentPaginatedRequest, makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const list: FreeAgentEndpoints['invoicesList'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesList.parse(input);
	const response = await makeFreeAgentPaginatedRequest(
		'/v2/invoices',
		ctx.key,
		parsed.query ?? {},
		FreeAgentEndpointOutputSchemas.invoicesList.omit({ pagination: true }),
	);
	const output = FreeAgentEndpointOutputSchemas.invoicesList.parse({
		...response.data,
		pagination: response.pagination,
	});
	await logEventFromContext(
		ctx,
		'freeagent.invoices.list',
		{ count: output.invoices.length },
		'completed',
	);
	return output;
};

export const get: FreeAgentEndpoints['invoicesGet'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesGet.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}`,
		ctx.key,
	);
	return FreeAgentEndpointOutputSchemas.invoicesGet.parse(response);
};

export const create: FreeAgentEndpoints['invoicesCreate'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesCreate.parse(input);
	const response = await makeFreeAgentRequest('/v2/invoices', ctx.key, {
		method: 'POST',
		body: { invoice: parsed.invoice },
	});
	return FreeAgentEndpointOutputSchemas.invoicesCreate.parse(response);
};

export const update: FreeAgentEndpoints['invoicesUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesUpdate.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{ method: 'PUT', body: { invoice: parsed.invoice } },
	);
	return FreeAgentEndpointOutputSchemas.invoicesUpdate.parse(response);
};

export const remove: FreeAgentEndpoints['invoicesDelete'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesDelete.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	return FreeAgentEndpointOutputSchemas.invoicesDelete.parse(response);
};

export const markSent: FreeAgentEndpoints['invoicesMarkSent'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesMarkSent.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}/transitions/mark_as_sent`,
		ctx.key,
		{ method: 'PUT' },
	);
	return FreeAgentEndpointOutputSchemas.invoicesMarkSent.parse(response);
};

export const sendEmail: FreeAgentEndpoints['invoicesSendEmail'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesSendEmail.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}/send_email`,
		ctx.key,
		{ method: 'POST', body: { invoice: { email: parsed.email } } },
	);
	return FreeAgentEndpointOutputSchemas.invoicesSendEmail.parse(response);
};

export const duplicate: FreeAgentEndpoints['invoicesDuplicate'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesDuplicate.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}/duplicate`,
		ctx.key,
		{ method: 'POST' },
	);
	return FreeAgentEndpointOutputSchemas.invoicesDuplicate.parse(response);
};

export const markScheduled: FreeAgentEndpoints['invoicesMarkScheduled'] =
	async (ctx, input) => {
		const parsed =
			FreeAgentEndpointInputSchemas.invoicesMarkScheduled.parse(input);
		const response = await makeFreeAgentRequest(
			`/v2/invoices/${encodeURIComponent(parsed.id)}/transitions/mark_as_scheduled`,
			ctx.key,
			{ method: 'PUT' },
		);
		return FreeAgentEndpointOutputSchemas.invoicesMarkScheduled.parse(response);
	};

export const markDraft: FreeAgentEndpoints['invoicesMarkDraft'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesMarkDraft.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}/transitions/mark_as_draft`,
		ctx.key,
		{ method: 'PUT' },
	);
	return FreeAgentEndpointOutputSchemas.invoicesMarkDraft.parse(response);
};

export const markCancelled: FreeAgentEndpoints['invoicesMarkCancelled'] =
	async (ctx, input) => {
		const parsed =
			FreeAgentEndpointInputSchemas.invoicesMarkCancelled.parse(input);
		const response = await makeFreeAgentRequest(
			`/v2/invoices/${encodeURIComponent(parsed.id)}/transitions/mark_as_cancelled`,
			ctx.key,
			{ method: 'PUT' },
		);
		return FreeAgentEndpointOutputSchemas.invoicesMarkCancelled.parse(response);
	};

export const directDebit: FreeAgentEndpoints['invoicesDirectDebit'] = async (
	ctx,
	input,
) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesDirectDebit.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}/direct_debit`,
		ctx.key,
		{ method: 'POST' },
	);
	return FreeAgentEndpointOutputSchemas.invoicesDirectDebit.parse(response);
};

export const timeline: FreeAgentEndpoints['invoicesTimeline'] = async (
	ctx,
	input,
) => {
	FreeAgentEndpointInputSchemas.invoicesTimeline.parse(input);
	const response = await makeFreeAgentRequest('/v2/invoices/timeline', ctx.key);
	return FreeAgentEndpointOutputSchemas.invoicesTimeline.parse(response);
};

export const getDefaultAdditionalText: FreeAgentEndpoints['invoicesDefaultAdditionalTextGet'] =
	async (ctx, input) => {
		FreeAgentEndpointInputSchemas.invoicesDefaultAdditionalTextGet.parse(input);
		const response = await makeFreeAgentRequest(
			'/v2/invoices/default_additional_text',
			ctx.key,
		);
		return FreeAgentEndpointOutputSchemas.invoicesDefaultAdditionalTextGet.parse(
			response,
		);
	};

export const updateDefaultAdditionalText: FreeAgentEndpoints['invoicesDefaultAdditionalTextUpdate'] =
	async (ctx, input) => {
		const parsed =
			FreeAgentEndpointInputSchemas.invoicesDefaultAdditionalTextUpdate.parse(
				input,
			);
		const response = await makeFreeAgentRequest(
			'/v2/invoices/default_additional_text',
			ctx.key,
			{
				method: 'PUT',
				body: { default_additional_text: parsed.default_additional_text },
			},
		);
		return FreeAgentEndpointOutputSchemas.invoicesDefaultAdditionalTextUpdate.parse(
			response,
		);
	};

export const deleteDefaultAdditionalText: FreeAgentEndpoints['invoicesDefaultAdditionalTextDelete'] =
	async (ctx, input) => {
		FreeAgentEndpointInputSchemas.invoicesDefaultAdditionalTextDelete.parse(
			input,
		);
		const response = await makeFreeAgentRequest(
			'/v2/invoices/default_additional_text',
			ctx.key,
			{ method: 'DELETE' },
		);
		return FreeAgentEndpointOutputSchemas.invoicesDefaultAdditionalTextDelete.parse(
			response,
		);
	};

export const pdf: FreeAgentEndpoints['invoicesPdf'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesPdf.parse(input);
	const response = await makeFreeAgentRequest(
		`/v2/invoices/${encodeURIComponent(parsed.id)}/pdf`,
		ctx.key,
	);
	return FreeAgentEndpointOutputSchemas.invoicesPdf.parse(response);
};

export const convertToCreditNote: FreeAgentEndpoints['invoicesConvertToCreditNote'] =
	async (ctx, input) => {
		const parsed =
			FreeAgentEndpointInputSchemas.invoicesConvertToCreditNote.parse(input);
		const response = await makeFreeAgentRequest(
			`/v2/invoices/${encodeURIComponent(parsed.id)}/transitions/convert_to_credit_note`,
			ctx.key,
			{ method: 'PUT' },
		);
		return FreeAgentEndpointOutputSchemas.invoicesConvertToCreditNote.parse(
			response,
		);
	};
