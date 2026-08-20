import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheContact, evictContacts, fetchContactsForParent } from './persist';
import { addressOutputToInput, buildPagingQuery, compactBody } from './shared';
import type {
	AltovizEndpointOutputs,
	ContactOutput,
	SupplierOutput,
} from './types';

/** No CREATE_SUPPLIER in the 67-op catalog, so get/update/delete reference an id this plugin cannot itself produce - see the PR notes on the missing counterpart. */
export const get: AltovizEndpoints['suppliers']['get'] = async (ctx, input) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['suppliersGet']
	>(`v1/suppliers/{id}`, ctx.key, { path: { id: input.supplierId } });

	await logEventFromContext(
		ctx,
		'altoviz.suppliers.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const list: AltovizEndpoints['suppliers']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['suppliersList']
	>('v1/suppliers', ctx.key, { query: buildPagingQuery(input) });

	await logEventFromContext(
		ctx,
		'altoviz.suppliers.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** Same clearing PUT semantics as customers - read the current record and merge before sending. */
export const update: AltovizEndpoints['suppliers']['update'] = async (
	ctx,
	input,
) => {
	const current = await makeAltovizRequest<SupplierOutput>(
		'v1/suppliers/{id}',
		ctx.key,
		{ path: { id: input.supplierId } },
	);

	const body = compactBody({
		id: input.supplierId,
		name: input.name ?? current.name,
		firstName: input.firstName ?? current.firstName,
		lastName: input.lastName ?? current.lastName,
		email: input.email ?? current.email,
		phone: input.phone ?? current.phone,
		cellPhone: input.cellPhone ?? current.cellPhone,
		title: input.title ?? current.title,
		number: input.number ?? current.number,
		internalId: input.internalId ?? current.internalId,
		internalNotes: input.internalNotes ?? current.internalNotes,
		address: input.address ?? addressOutputToInput(current.address),
		defaultPaymentMethod:
			input.defaultPaymentMethod ?? current.defaultPaymentMethod,
		companyInformations: current.companyInformations,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['suppliersUpdate']
	>('v1/suppliers/{id}', ctx.key, {
		method: 'PUT',
		body,
		path: { id: input.supplierId },
	});

	await logEventFromContext(
		ctx,
		'altoviz.suppliers.update',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const remove: AltovizEndpoints['suppliers']['delete'] = async (
	ctx,
	input,
) => {
	const contacts = await fetchContactsForParent(
		() =>
			makeAltovizRequest<ContactOutput[]>(
				'v1/suppliers/{id}/contacts',
				ctx.key,
				{ path: { id: input.supplierId } },
			),
		`supplier ${input.supplierId}`,
	);

	await makeAltovizRequest<unknown>('v1/suppliers/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.supplierId },
	});

	await evictContacts(
		ctx.db.contacts,
		contacts,
		`supplier ${input.supplierId}`,
	);

	await logEventFromContext(
		ctx,
		'altoviz.suppliers.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.supplierId };
};

export const getContacts: AltovizEndpoints['suppliers']['getContacts'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['suppliersGetContacts']
	>(`v1/suppliers/{id}/contacts`, ctx.key, {
		path: { id: input.supplierId },
	});

	for (const contact of result) await cacheContact(ctx.db.contacts, contact);

	await logEventFromContext(
		ctx,
		'altoviz.suppliers.getContacts',
		auditPayload(input),
		'completed',
	);
	return result;
};
