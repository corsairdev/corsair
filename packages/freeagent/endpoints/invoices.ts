import { logEventFromContext } from 'corsair/core';
import type { FreeAgentEndpoints } from '..';
import { makeFreeAgentRequest } from '../client';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './types';

export const list: FreeAgentEndpoints['invoicesList'] = async (ctx, input) => {
	const parsed = FreeAgentEndpointInputSchemas.invoicesList.parse(input);
	const response = await makeFreeAgentRequest('/v2/invoices', ctx.key, {
		query: parsed.query,
	});
	const output = FreeAgentEndpointOutputSchemas.invoicesList.parse(response);
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
