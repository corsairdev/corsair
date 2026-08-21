import { logEventFromContext } from 'corsair/core';
import { makeAltovizRequest } from '../client';
import type { AltovizEndpoints } from '../index';
import { auditPayload } from './logging';
import {
	cacheContact,
	cacheCustomer,
	evictContacts,
	evictEntity,
	fetchContactsForParent,
} from './persist';
import {
	addressOutputToInput,
	buildPagingQuery,
	compactBody,
	resolveCustomerFamilyRef,
} from './shared';
import type {
	AltovizEndpointOutputs,
	ContactOutput,
	CustomerOutput,
} from './types';

export const create: AltovizEndpoints['customers']['create'] = async (
	ctx,
	input,
) => {
	const body = compactBody({
		type: input.type,
		companyName: input.companyName,
		firstName: input.firstName,
		lastName: input.lastName,
		email: input.email,
		phone: input.phone,
		cellPhone: input.cellPhone,
		title: input.title,
		number: input.number,
		internalId: input.internalId,
		active: input.active,
		billingAddress: input.billingAddress,
		shippingAddress: input.shippingAddress,
		billingOptions: input.billingOptions,
		companyInformations: input.companyInformations,
		// { id } is silently dropped by the API - resolve to {label, number} first.
		family: await resolveCustomerFamilyRef(
			ctx.db.customerFamilies,
			ctx.key,
			input.familyId,
		),
		internalNotes: input.internalNotes,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customersCreate']
	>('v1/customers', ctx.key, { method: 'POST', body });

	await cacheCustomer(ctx.db.customers, result);

	await logEventFromContext(
		ctx,
		'altoviz.customers.create',
		auditPayload(input, { hasFamily: input.familyId !== undefined }),
		'completed',
	);
	return result;
};

/**
 * PUT clears every field the body omits - confirmed live. This reads the
 * current record first and merges the caller's fields over the FULL set of
 * writable fields before sending the PUT, so a caller supplying one field
 * never loses the rest.
 */
export const update: AltovizEndpoints['customers']['update'] = async (
	ctx,
	input,
) => {
	const current = await makeAltovizRequest<CustomerOutput>(
		'v1/customers/{id}',
		ctx.key,
		{ path: { id: input.customerId } },
	);

	const family =
		input.familyId !== undefined
			? await resolveCustomerFamilyRef(
					ctx.db.customerFamilies,
					ctx.key,
					input.familyId,
				)
			: current.family && current.family.label && current.family.number
				? { label: current.family.label, number: current.family.number }
				: undefined;

	const body = compactBody({
		id: input.customerId,
		type: input.type ?? current.type,
		companyName: input.companyName ?? current.companyName,
		firstName: input.firstName ?? current.firstName,
		lastName: input.lastName ?? current.lastName,
		email: input.email ?? current.email,
		phone: input.phone ?? current.phone,
		cellPhone: input.cellPhone ?? current.cellPhone,
		title: input.title ?? current.title,
		number: input.number ?? current.number,
		internalId: input.internalId ?? current.internalId,
		active: input.active ?? current.active,
		internalNotes: input.internalNotes ?? current.internalNotes,
		billingAddress:
			input.billingAddress ?? addressOutputToInput(current.billingAddress),
		shippingAddress:
			input.shippingAddress ?? addressOutputToInput(current.shippingAddress),
		billingOptions: input.billingOptions ?? current.billingOptions,
		companyInformations:
			input.companyInformations ?? current.companyInformations,
		family,
	});

	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customersUpdate']
	>('v1/customers/{id}', ctx.key, {
		method: 'PUT',
		body,
		path: { id: input.customerId },
	});

	await cacheCustomer(ctx.db.customers, result);

	await logEventFromContext(
		ctx,
		'altoviz.customers.update',
		auditPayload(input),
		'completed',
	);
	return result;
};

/**
 * Deleting a customer does not delete the contact its own creation
 * auto-generated - confirmed live. The contacts are fetched before the parent
 * delete so the eviction has something to evict; this is best-effort and must
 * not block or fail the delete itself.
 */
export const remove: AltovizEndpoints['customers']['delete'] = async (
	ctx,
	input,
) => {
	const contacts = await fetchContactsForParent(
		() =>
			makeAltovizRequest<ContactOutput[]>(
				'v1/customers/{id}/contacts',
				ctx.key,
				{ path: { id: input.customerId } },
			),
		`customer ${input.customerId}`,
	);

	await makeAltovizRequest<unknown>('v1/customers/{id}', ctx.key, {
		method: 'DELETE',
		path: { id: input.customerId },
	});

	await evictContacts(
		ctx.db.contacts,
		contacts,
		`customer ${input.customerId}`,
	);

	await evictEntity(ctx.db.customers, input.customerId, 'customer');

	await logEventFromContext(
		ctx,
		'altoviz.customers.delete',
		auditPayload(input),
		'completed',
	);
	return { deleted: true, id: input.customerId };
};

export const get: AltovizEndpoints['customers']['get'] = async (ctx, input) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customersGet']
	>(`v1/customers/{id}`, ctx.key, { path: { id: input.customerId } });

	await cacheCustomer(ctx.db.customers, result);

	await logEventFromContext(
		ctx,
		'altoviz.customers.get',
		auditPayload(input),
		'completed',
	);
	return result;
};

/** internalId is a caller-supplied string; encoding is ENCODE_PATH in the client, not interpolation. */
export const getByInternalId: AltovizEndpoints['customers']['getByInternalId'] =
	async (ctx, input) => {
		const result = await makeAltovizRequest<
			AltovizEndpointOutputs['customersGetByInternalId']
		>('v1/customers/getbyinternalid/{internalId}', ctx.key, {
			path: { internalId: input.internalId },
		});

		await cacheCustomer(ctx.db.customers, result);

		await logEventFromContext(
			ctx,
			'altoviz.customers.getByInternalId',
			auditPayload(input),
			'completed',
		);
		return result;
	};

/** Returns an array, not a single object or null - confirmed live, even with no parameters at all (200 []). */
export const find: AltovizEndpoints['customers']['find'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customersFind']
	>('v1/customers/find', ctx.key, {
		query: {
			email: input.email,
			internalId: input.internalId,
			number: input.number,
		},
	});

	for (const customer of result)
		await cacheCustomer(ctx.db.customers, customer);

	await logEventFromContext(
		ctx,
		'altoviz.customers.find',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const list: AltovizEndpoints['customers']['list'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customersList']
	>('v1/customers', ctx.key, { query: buildPagingQuery(input) });

	for (const customer of result)
		await cacheCustomer(ctx.db.customers, customer);

	await logEventFromContext(
		ctx,
		'altoviz.customers.list',
		auditPayload(input),
		'completed',
	);
	return result;
};

export const getContacts: AltovizEndpoints['customers']['getContacts'] = async (
	ctx,
	input,
) => {
	const result = await makeAltovizRequest<
		AltovizEndpointOutputs['customersGetContacts']
	>(`v1/customers/{id}/contacts`, ctx.key, {
		path: { id: input.customerId },
	});

	for (const contact of result) await cacheContact(ctx.db.contacts, contact);

	await logEventFromContext(
		ctx,
		'altoviz.customers.getContacts',
		auditPayload(input),
		'completed',
	);
	return result;
};
