import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { buildPagingQuery, compactBody } from './shared';
import type { AltovizEndpointOutputs, ColleagueOutput } from './types';

/** No CREATE_COLLEAGUE in the 67-op catalog - get/update/delete reference an id this plugin cannot itself produce. */
export const get: AltovizEndpoints['colleagues']['get'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['colleaguesGet']
	>(`v1/colleagues/{id}`, ctx.key, { path: { id: input.colleagueId } });

	await logEventFromContext(
		ctx,
		'altoviz.colleagues.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const list: AltovizEndpoints['colleagues']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['colleaguesList']
	>('v1/colleagues', ctx.key, { query: buildPagingQuery(input) });

	await logEventFromContext(
		ctx,
		'altoviz.colleagues.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

/**
 * A PARTIAL body here is a 500, not a 400 - confirmed live, distinct from the
 * clearing-PUT behaviour elsewhere. Read-modify-write happens to fix both
 * problems at once, since the full merged record is always sent.
 */
export const update: AltovizEndpoints['colleagues']['update'] = async (
	ctx,
	input,
) => {
	const current = await makeAltovizRequest<ColleagueOutput>(
		'v1/colleagues/{id}',
		ctx.key,
		{ path: { id: input.colleagueId } },
	);

	const body = compactBody({
		id: input.colleagueId,
		firstName: input.firstName ?? current.firstName,
		lastName: input.lastName ?? current.lastName,
		name: input.name ?? current.name,
		email: input.email ?? current.email,
		phone: input.phone ?? current.phone,
		cellPhone: input.cellPhone ?? current.cellPhone,
		title: input.title ?? current.title,
		number: input.number ?? current.number,
		internalId: input.internalId ?? current.internalId,
		isPartner: input.isPartner ?? current.isPartner,
		initialPartnerBalance:
			input.initialPartnerBalance ?? current.initialPartnerBalance,
		homecareServiceNumber:
			input.homecareServiceNumber ?? current.homecareServiceNumber,
		userId: input.userId ?? current.userId,
		// metadatas, not metadata - the plural is the provider spelling.
		metadatas: input.metadatas ?? current.metadatas,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['colleaguesUpdate']
	>('v1/colleagues/{id}', ctx.key, {
		method: 'PUT',
		body,
		path: { id: input.colleagueId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.colleagues.update',
		auditPayload(input),
		'completed',
	);
	return result;
};

/**
 * Colleague creation also auto-creates a contact (same behaviour as customers
 * and suppliers), but there is no `colleagues.getContacts` route in the
 * catalog to find it with, so - unlike `customers.delete` and
 * `suppliers.delete` - this cannot evict it from the mirror. The orphan is a
 * known, documented gap rather than a silent one.
 */
export const remove: AltovizEndpoints['colleagues']['delete'] = async (
	ctx,
	input,
) => {
	await makeAltovizRequest<unknown>('v1/colleagues/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.colleagueId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.colleagues.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.colleagueId };
};
