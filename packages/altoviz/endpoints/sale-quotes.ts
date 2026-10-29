import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPagingQuery } from './shared';
import type { AltovizEndpointOutputs } from './types';

/** Returns an array, empty when nothing matches - confirmed live against a real quote (created, found, listed, deleted end to end once quote numbering was initialised on the tenant). */
export const find: AltovizEndpoints['saleQuotes']['find'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleQuotesFind']
	>('v1/salequotes/find', ctx.key, { query: { internalId: input.internalId } });

	await logEventFromContext(
		ctx,
		'altoviz.saleQuotes.find',
		auditPayload(input),
		'completed',
	);
	return result;
};

/**
 * No Status filter is exposed here. The spec emits `Status.From`,
 * `Status.Status.From` and further nested variants - a generator artefact -
 * and live, `Status` is silently ignored while `Status.Status` is a 500. A
 * filter that does nothing is worse than no filter.
 */
export const list: AltovizEndpoints['saleQuotes']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['saleQuotesList']
	>('v1/salequotes', ctx.key, {
		query: {
			...buildPagingQuery(input),
			From: input.from,
			To: input.to,
			CustomerId: input.customerId,
		},
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleQuotes.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** Deleting a quote that does not exist ALSO returns 200 - confirmed live - so this operation cannot report a miss to a caller. */
export const remove: AltovizEndpoints['saleQuotes']['delete'] = async (
	ctx,
	input,
) => {
	await makeAltovizRequest<unknown>('v1/salequotes/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.quoteId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.saleQuotes.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.quoteId };
};
