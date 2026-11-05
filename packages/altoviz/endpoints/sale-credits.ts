import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildLine, buildPagingQuery, compactBody } from './shared';
import type { AltovizEndpointOutputs, SaleCreditOutput } from './types';

export const create: AltovizEndpoints['saleCredits']['create'] = async (
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
		// The provider's own spelling, typo included - do not "fix" it.
		cancelledInvoicetId: input.cancelledInvoicetId,
		cancelledInvoicetNumber: input.cancelledInvoicetNumber,
		date: input.date,
		subject: input.subject,
		headerNotes: input.headerNotes,
		footerNotes: input.footerNotes,
		lines,
		globalDiscount: input.globalDiscount,
		vatMode: input.vatMode,
		region: input.region,
		isDraft: input.isDraft,
		internalId: input.internalId,
		metadata: input.metadata,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleCreditsCreate']
	>('v1/salecredits', ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'altoviz.saleCredits.create',
		auditPayload(input, { linesCount: input.lines.length }),
		'completed',
	);
	return result;
};

/** Drafts only. Lines must be resent in full - confirmed live, omitting them empties the credit, the same clearing-write behaviour PUT has everywhere else in this API. */
export const update: AltovizEndpoints['saleCredits']['update'] = async (
	ctx,
	input,
) => {
	const current = await makeAltovizRequest<SaleCreditOutput>(
		'v1/salecredits/{id}',
		ctx.key,
		{ path: { id: input.creditId } },
	);

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
		id: input.creditId,
		customerId: input.customerId ?? current.customerId,
		cancelledInvoicetId: current.cancelledInvoicetId,
		cancelledInvoicetNumber: current.cancelledInvoicetNumber,
		date: input.date ?? current.date,
		subject: input.subject ?? current.subject,
		headerNotes: input.headerNotes ?? current.headerNotes,
		footerNotes: input.footerNotes ?? current.footerNotes,
		lines,
		globalDiscount: current.globalDiscount,
		vatMode: current.vatMode,
		region: current.region,
		isDraft: input.isDraft ?? current.isDraft,
		internalId: current.internalId,
		metadata: current.metadata,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleCreditsUpdate']
	>('v1/salecredits/{id}', ctx.key, {
		method: 'PUT',
		body,
		path: { id: input.creditId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleCredits.update',
		auditPayload(input, { linesCount: input.lines.length }),
		'completed',
	);
	return result;
};

export const get: AltovizEndpoints['saleCredits']['get'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleCreditsGet']
	>(`v1/salecredits/{id}`, ctx.key, { path: { id: input.creditId } });

	await logEventFromContext(
		ctx,
		'altoviz.saleCredits.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const find: AltovizEndpoints['saleCredits']['find'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleCreditsFind']
	>('v1/salecredits/find', ctx.key, {
		query: { internalId: input.internalId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleCredits.find',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** No Status filter here, unlike invoices. */
export const list: AltovizEndpoints['saleCredits']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleCreditsList']
	>('v1/salecredits', ctx.key, {
		query: {
			...buildPagingQuery(input),
			From: input.from,
			To: input.to,
			CustomerId: input.customerId,
		},
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleCredits.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const remove: AltovizEndpoints['saleCredits']['delete'] = async (
	ctx,
	input,
) => {
	await makeAltovizRequest<unknown>('v1/salecredits/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.creditId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleCredits.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.creditId };
};

/** Real application/pdf, confirmed live (81 KB) - same core text-decoding limitation as the invoice download. */
export const download: AltovizEndpoints['saleCredits']['download'] = async (
	ctx,
	input,
) => {
	const body = await makeAltovizRequest<string>(
		'v1/salecredits/download/{id}',
		ctx.key,
		{ path: { id: input.creditId } },
	);

	await logEventFromContext(
		ctx,
		'altoviz.saleCredits.download',
		auditPayload(input),
		'completed',
	);
	return { contentType: 'application/pdf', body };
};
