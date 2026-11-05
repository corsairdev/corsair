import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheContact } from './persist';
import { buildPagingQuery, compactBody } from './shared';
import type { AltovizEndpointOutputs } from './types';

/** No customerId field on this route, and none is accepted - confirmed live. There is no way to attach a standalone contact to a customer through this operation. */
export const create: AltovizEndpoints['contacts']['create'] = async (
	ctx,
	input,
) => {
	const body = compactBody({
		firstName: input.firstName,
		lastName: input.lastName,
		email: input.email,
		phone: input.phone,
		cellPhone: input.cellPhone,
		companyName: input.companyName,
		function: input.function,
		service: input.service,
		title: input.title,
		displayName: input.displayName,
		invertedDisplayName: input.invertedDisplayName,
		internalId: input.internalId,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['contactsCreate']
	>('v1/contacts', ctx.key, { method: 'POST', body });

	await cacheContact(ctx.db.contacts, result);

	await logEventFromContext(
		ctx,
		'altoviz.contacts.create',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const get: AltovizEndpoints['contacts']['get'] = async (ctx, input) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['contactsGet']
	>(`v1/contacts/{id}`, ctx.key, { path: { id: input.contactId } });

	await cacheContact(ctx.db.contacts, result);

	await logEventFromContext(
		ctx,
		'altoviz.contacts.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** Returns an array, same as FIND_CUSTOMER - not a single object, and not null when nothing matches. */
export const find: AltovizEndpoints['contacts']['find'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['contactsFind']
	>('v1/contacts/find', ctx.key, {
		query: { email: input.email, internalId: input.internalId },
	});

	for (const contact of result) await cacheContact(ctx.db.contacts, contact);

	await logEventFromContext(
		ctx,
		'altoviz.contacts.find',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** Also returns the shadow contacts auto-created by customer, supplier and colleague writes - confirmed live. */
export const list: AltovizEndpoints['contacts']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['contactsList']
	>('v1/contacts', ctx.key, { query: buildPagingQuery(input) });

	for (const contact of result) await cacheContact(ctx.db.contacts, contact);

	await logEventFromContext(
		ctx,
		'altoviz.contacts.list',
		auditPayload(input),
		'completed',
	);
	return result;
};
