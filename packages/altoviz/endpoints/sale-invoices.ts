import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildLine, buildPagingQuery, compactBody } from './shared';
import type { AltovizEndpointOutputs } from './types';

export const create: AltovizEndpoints['saleInvoices']['create'] = async (
	ctx,
	input,
) => {
	const lists = new Map();
	const lines = await Promise.all(
		input.lines.map((line) =>
			buildLine(
				line,
				{ units: ctx.db.units, vats: ctx.db.vats },
				ctx.key,
				lists,
			),
		),
	);

	const body = compactBody({
		customerId: input.customerId,
		date: input.date,
		subject: input.subject,
		headerNotes: input.headerNotes,
		footerNotes: input.footerNotes,
		lines,
		globalDiscount: input.globalDiscount,
		shippingAmount: input.shippingAmount,
		vatMode: input.vatMode,
		region: input.region,
		liableToVat: input.liableToVat,
		vatReverseCharge: input.vatReverseCharge,
		useTaxIncludedPrices: input.useTaxIncludedPrices,
		isDraft: input.isDraft,
		internalId: input.internalId,
		metadata: input.metadata,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleInvoicesCreate']
	>('v1/saleinvoices', ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'altoviz.saleInvoices.create',
		auditPayload(input, { linesCount: input.lines.length }),
		'completed',
	);
	return result;
};

export const get: AltovizEndpoints['saleInvoices']['get'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleInvoicesGet']
	>(`v1/saleinvoices/{id}`, ctx.key, { path: { id: input.invoiceId } });

	await logEventFromContext(
		ctx,
		'altoviz.saleInvoices.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const find: AltovizEndpoints['saleInvoices']['find'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleInvoicesFind']
	>('v1/saleinvoices/find', ctx.key, {
		query: { internalId: input.internalId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleInvoices.find',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const list: AltovizEndpoints['saleInvoices']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleInvoicesList']
	>('v1/saleinvoices', ctx.key, {
		query: {
			...buildPagingQuery(input),
			From: input.from,
			To: input.to,
			CustomerId: input.customerId,
			Status: input.status,
			IncludeCancelled: input.includeCancelled,
		},
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleInvoices.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** Drafts only - a finalized invoice is expected to refuse the delete; this plugin never finalizes anything, so that path was not exercised live. */
export const remove: AltovizEndpoints['saleInvoices']['delete'] = async (
	ctx,
	input,
) => {
	await makeAltovizRequest<unknown>('v1/saleinvoices/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.invoiceId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleInvoices.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.invoiceId };
};

/**
 * Real `application/pdf`, confirmed live (82 KB, `content-disposition` naming
 * the document number). The shared transport decodes non-JSON bodies with
 * `response.text()`, which is lossless for the JSON/text paths every other
 * operation in this plugin uses and lossy for this one - see the note on
 * `makeAltovizRequest` in client.ts. Flagged as a core limitation in the PR
 * rather than fixed here.
 */
export const download: AltovizEndpoints['saleInvoices']['download'] = async (
	ctx,
	input,
) => {
	const body = await makeAltovizRequest<string>(
		'v1/saleinvoices/download/{id}',
		ctx.key,
		{ path: { id: input.invoiceId } },
	);

	await logEventFromContext(
		ctx,
		'altoviz.saleInvoices.download',
		auditPayload(input),
		'completed',
	);
	return { contentType: 'application/pdf', body };
};
