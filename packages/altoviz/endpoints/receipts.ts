import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPagingQuery, compactBody } from './shared';
import type { AltovizEndpointOutputs, ReceiptOutput } from './types';

/**
 * `links` attaches this receipt to a Commitment | Invoice | Credit, but
 * linking to a DRAFT document is refused live ("Impossible d'encaisser un
 * document en brouillon ... vous devez le finaliser au prealable"). Finalize
 * is out of scope for this plugin, so `links` is largely unreachable through
 * catalog operations alone - the receipt still creates fine standalone, which
 * is the shape this handler is built and tested against.
 */
export const create: AltovizEndpoints['receipts']['create'] = async (
	ctx,
	input,
) => {
	const body = compactBody({
		amount: input.amount,
		date: input.date,
		paymentMethod: input.paymentMethod,
		status: input.status,
		reference: input.reference,
		notes: input.notes,
		customerId: input.customerId,
		customerName: input.customerName,
		customerNumber: input.customerNumber,
		customerInternalId: input.customerInternalId,
		links: input.links,
		internalId: input.internalId,
		metadata: input.metadata,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['receiptsCreate']
	>('v1/receipts', ctx.key, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'altoviz.receipts.create',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** customerId (or number / internalId) is required even on update - confirmed live: omitting all three is "Customer ID, number or internal ID must be defined". Read-modify-write, same as every other update in this plugin. */
export const update: AltovizEndpoints['receipts']['update'] = async (
	ctx,
	input,
) => {
	const current = await makeAltovizRequest<ReceiptOutput>(
		'v1/receipts/{id}',
		ctx.key,
		{ path: { id: input.receiptId } },
	);

	const body = compactBody({
		id: input.receiptId,
		amount: input.amount ?? current.amount,
		date: input.date ?? current.date,
		paymentMethod: input.paymentMethod ?? current.paymentMethod,
		status: input.status ?? current.status,
		reference: input.reference ?? current.reference,
		notes: input.notes ?? current.notes,
		customerId: input.customerId ?? current.customerId,
		customerName: current.customerName,
		customerNumber: current.customerNumber,
		customerInternalId: current.customerInternalId,
		links: input.links ?? current.links,
		internalId: current.internalId,
		metadata: current.metadata,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['receiptsUpdate']
	>('v1/receipts/{id}', ctx.key, {
		method: 'PUT',
		body,
		path: { id: input.receiptId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.receipts.update',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const get: AltovizEndpoints['receipts']['get'] = async (ctx, input) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['receiptsGet']
	>(`v1/receipts/{id}`, ctx.key, { path: { id: input.receiptId } });

	await logEventFromContext(
		ctx,
		'altoviz.receipts.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** The catalog calls this "by customer internal ID"; the live parameter is the receipt's own internalId. */
export const find: AltovizEndpoints['receipts']['find'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['receiptsFind']
	>('v1/receipts/find', ctx.key, { query: { internalId: input.internalId } });

	await logEventFromContext(
		ctx,
		'altoviz.receipts.find',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const list: AltovizEndpoints['receipts']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['receiptsList']
	>('v1/receipts', ctx.key, { query: buildPagingQuery(input) });

	await logEventFromContext(
		ctx,
		'altoviz.receipts.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const remove: AltovizEndpoints['receipts']['delete'] = async (
	ctx,
	input,
) => {
	await makeAltovizRequest<unknown>('v1/receipts/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.receiptId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.receipts.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.receiptId };
};
