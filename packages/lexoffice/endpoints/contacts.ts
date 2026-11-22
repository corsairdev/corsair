import { logEventFromContext } from 'corsair/core';
import type { LexofficeEndpoints } from '..';
import { makeLexofficeRequest } from '../client';
import type {
	Contact,
	ContactsListResponse,
	ResourceMutationResponse,
} from './types';
import {
	LexofficeEndpointInputSchemas,
	LexofficeEndpointOutputSchemas,
} from './types';

export const list: LexofficeEndpoints['contactsList'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.contactsList.parse(input);
	const response = await makeLexofficeRequest<ContactsListResponse>(
		'/contacts',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.contactsList.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.contacts.list',
		{ count: parsed.content.length },
		'completed',
	);
	return parsed;
};

export const get: LexofficeEndpoints['contactsGet'] = async (ctx, input) => {
	const parsedInput = LexofficeEndpointInputSchemas.contactsGet.parse(input);
	const response = await makeLexofficeRequest<Contact>(
		`/contacts/${encodeURIComponent(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = LexofficeEndpointOutputSchemas.contactsGet.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.contacts.get',
		{ contactId: parsedInput.id },
		'completed',
	);
	return parsed;
};

export const create: LexofficeEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const parsedInput = LexofficeEndpointInputSchemas.contactsCreate.parse(input);
	const response = await makeLexofficeRequest<ResourceMutationResponse>(
		'/contacts',
		ctx.key,
		{
			method: 'POST',
			body: parsedInput,
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.contactsCreate.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.contacts.create',
		{ contactId: parsed.id },
		'completed',
	);
	return parsed;
};

export const update: LexofficeEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const parsedInput = LexofficeEndpointInputSchemas.contactsUpdate.parse(input);
	const { id, ...body } = parsedInput;
	const response = await makeLexofficeRequest<ResourceMutationResponse>(
		`/contacts/${encodeURIComponent(id)}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);
	const parsed = LexofficeEndpointOutputSchemas.contactsUpdate.parse(response);
	await logEventFromContext(
		ctx,
		'lexoffice.contacts.update',
		{ contactId: id },
		'completed',
	);
	return parsed;
};
