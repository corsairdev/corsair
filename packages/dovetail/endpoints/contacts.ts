import { logEventFromContext } from 'corsair/core';
import { makeDovetailRequest } from '../client';
import type { DovetailEndpoints } from '../index';
import type { DovetailEndpointOutputs } from './types';
import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
} from './types';

export const create: DovetailEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.contactsCreate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {
		name: parsed.name,
		email: parsed.email,
	};
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['contactsCreate']
	>('/v1/contacts', ctx.key, {
		method: 'POST',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.contactsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.contacts.create',
		{ id: validated.data.id, name: validated.data.name },
		'completed',
	);
	return validated;
};

export const get: DovetailEndpoints['contactsGet'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.contactsGet.parse(input);
	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['contactsGet']
	>(`/v1/contacts/${encodeURIComponent(parsed.contact_id)}`, ctx.key, {
		method: 'GET',
	});
	const validated = DovetailEndpointOutputSchemas.contactsGet.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.contacts.get',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const list: DovetailEndpoints['contactsList'] = async (ctx, input) => {
	const parsed = DovetailEndpointInputSchemas.contactsList.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed.page?.limit !== undefined)
		query['page[limit]'] = parsed.page.limit;
	if (parsed.page?.start_cursor !== undefined)
		query['page[start_cursor]'] = parsed.page.start_cursor;
	if (parsed.filter?.name !== undefined)
		query['filter[name]'] = parsed.filter.name;
	if (parsed.sort !== undefined) query.sort = parsed.sort;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['contactsList']
	>('/v1/contacts', ctx.key, {
		method: 'GET',
		query,
	});
	const validated = DovetailEndpointOutputSchemas.contactsList.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.contacts.list',
		{ count: validated.data.length },
		'completed',
	);
	return validated;
};

export const update: DovetailEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = DovetailEndpointInputSchemas.contactsUpdate.parse(input);
	// Justification: unknown is used in client body typing, and body payload here is typed strictly as Record<string, unknown>
	const body: Record<string, unknown> = {};
	if (parsed.name !== undefined) body.name = parsed.name;
	if (parsed.email !== undefined) body.email = parsed.email;
	if (parsed.fields !== undefined) body.fields = parsed.fields;

	const response = await makeDovetailRequest<
		DovetailEndpointOutputs['contactsUpdate']
	>(`/v1/contacts/${encodeURIComponent(parsed.contact_id)}`, ctx.key, {
		method: 'PATCH',
		body,
	});
	const validated =
		DovetailEndpointOutputSchemas.contactsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'dovetail.contacts.update',
		{ id: validated.data.id },
		'completed',
	);
	return validated;
};

export const Contacts = {
	create,
	get,
	list,
	update,
};
