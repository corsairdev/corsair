import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';

export const create: DovetailEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		name: input.name,
		email: input.email,
	};
	if (input.fields !== undefined) body.fields = input.fields;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['contactsCreate']
	>('/v1/contacts', ctx.key, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.contacts.create',
		{ id: result.data.id, name: result.data.name },
		'completed',
	);
	return result;
};

export const get: DovetailEndpoints['contactsGet'] = async (ctx, input) => {
	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['contactsGet']
	>(`/v1/contacts/${encodeURIComponent(input.contact_id)}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'dovetail.contacts.get',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const list: DovetailEndpoints['contactsList'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.page?.limit !== undefined) query['page[limit]'] = input.page.limit;
	if (input.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = input.page.start_cursor;
	if (input.filter?.name !== undefined)
		query['filter[name]'] = input.filter.name;
	if (input.sort !== undefined) query.sort = input.sort;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['contactsList']
	>('/v1/contacts', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'dovetail.contacts.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};

export const update: DovetailEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (input.name !== undefined) body.name = input.name;
	if (input.email !== undefined) body.email = input.email;
	if (input.fields !== undefined) body.fields = input.fields;

	const result = await makeDovetailRequest<
		DovetailEndpointOutputs['contactsUpdate']
	>(`/v1/contacts/${encodeURIComponent(input.contact_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	await logEventFromContext(
		ctx,
		'dovetail.contacts.update',
		{ id: result.data.id },
		'completed',
	);
	return result;
};

export const Contacts = {
	create,
	get,
	list,
	update,
};
