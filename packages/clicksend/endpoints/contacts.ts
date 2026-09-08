import { logEventFromContext } from 'corsair/core';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendEndpoints } from '../index';
import type { ClickSendEndpointOutputs } from './types';

export const getAllLists: ClickSendEndpoints['contactListsGetAll'] = async (
	ctx,
	input,
) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['contactListsGetAll']
	>('lists', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
		},
	});

	await logEventFromContext(
		ctx,
		'clicksend.contactLists.getAll',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const createList: ClickSendEndpoints['contactListsCreate'] = async (
	ctx,
	input,
) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['contactListsCreate']
	>('lists', username, apiKey, {
		method: 'POST',
		body: { list_name: input.list_name },
	});

	await logEventFromContext(
		ctx,
		'clicksend.contactLists.create',
		{ list_name: input.list_name },
		'completed',
	);

	return response;
};

export const createContact: ClickSendEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['contactsCreate']
	>(`lists/${input.list_id}/contacts`, username, apiKey, {
		method: 'POST',
		body: {
			first_name: input.first_name,
			last_name: input.last_name,
			phone_number: input.phone_number,
			email: input.email,
		},
	});

	if (response.contact_id && ctx.db.contacts) {
		try {
			await ctx.db.contacts.upsertByEntityId(String(response.contact_id), {
				id: String(response.contact_id),
				contact_id: String(response.contact_id),
				list_id: String(input.list_id),
				first_name: response.first_name,
				last_name: response.last_name,
				phone_number: response.phone_number,
				email: response.email,
			});
		} catch (error) {
			console.warn('Failed to save contact to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'clicksend.contacts.create',
		{ list_id: input.list_id },
		'completed',
	);

	return response;
};

export const listContacts: ClickSendEndpoints['contactsList'] = async (
	ctx,
	input,
) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest<
		ClickSendEndpointOutputs['contactsList']
	>(`lists/${input.list_id}/contacts`, username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
		},
	});

	if (response.data && ctx.db.contacts) {
		try {
			for (const contact of response.data) {
				await ctx.db.contacts.upsertByEntityId(String(contact.contact_id), {
					id: String(contact.contact_id),
					contact_id: String(contact.contact_id),
					list_id: String(contact.list_id),
					first_name: contact.first_name,
					last_name: contact.last_name,
					phone_number: contact.phone_number,
					email: contact.email,
				});
			}
		} catch (error) {
			console.warn('Failed to cache contacts to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'clicksend.contacts.list',
		{ list_id: input.list_id, page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};
