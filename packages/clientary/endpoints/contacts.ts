import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import { cacheRecord, cacheRecords, evictEntity } from './persist';
import type { ClientaryContact } from './types';
import {
	ClientaryContactSchema,
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
} from './types';

/**
 * List all contacts.
 *
 * API: GET /api/v2/contacts
 * Docs: https://www.clientary.com/api/contacts
 */
export const list: ClientaryEndpoints['contactsList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.contactsList>
	>('contacts', apiKey, domain, {
		query: {
			page: input.page,
			page_size: input.page_size,
		},
	});

	const parsed = ClientaryEndpointOutputSchemas.contactsList.parse(response);

	await cacheRecords(ctx.db.contacts, parsed.contacts, 'contact');

	await logEventFromContext(
		ctx,
		'clientary.contacts.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * List contacts belonging to a single client.
 *
 * API: GET /api/v2/clients/:client_id/contacts
 * Docs: https://www.clientary.com/api/contacts
 */
export const listForClient: ClientaryEndpoints['contactsListForClient'] =
	async (ctx, input) => {
		const { apiKey, domain } = await getClientaryCredentials(ctx);

		const response = await makeClientaryRequest<
			z.infer<typeof ClientaryEndpointOutputSchemas.contactsListForClient>
		>(`clients/${input.client_id}/contacts`, apiKey, domain, {
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		const parsed =
			ClientaryEndpointOutputSchemas.contactsListForClient.parse(response);

		await cacheRecords(ctx.db.contacts, parsed.contacts, 'contact');

		await logEventFromContext(
			ctx,
			'clientary.contacts.listForClient',
			{ client_id: input.client_id },
			'completed',
		);
		return parsed;
	};

/**
 * Get a single contact by ID.
 *
 * API: GET /api/v2/contacts/:id
 * Docs: https://www.clientary.com/api/contacts
 */
export const get: ClientaryEndpoints['contactsGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryContact>(
		`contacts/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryContactSchema.parse(response);

	await cacheRecord(ctx.db.contacts, parsed, 'contact');

	await logEventFromContext(
		ctx,
		'clientary.contacts.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Create a new contact. `client_id` and `name` are required.
 *
 * API: POST /api/v2/clients/:client_id/contacts
 * Docs: https://www.clientary.com/api/contacts
 */
export const create: ClientaryEndpoints['contactsCreate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { client_id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryContact>(
		`clients/${client_id}/contacts`,
		apiKey,
		domain,
		{ method: 'POST', body: { client_user: { ...fields } } },
	);

	const parsed = ClientaryContactSchema.parse(response);

	await cacheRecord(ctx.db.contacts, parsed, 'contact');

	await logEventFromContext(
		ctx,
		'clientary.contacts.create',
		{ id: parsed.id, client_id: parsed.client_id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing contact.
 *
 * API: PUT /api/v2/contacts/:id
 * Docs: https://www.clientary.com/api/contacts
 */
export const update: ClientaryEndpoints['contactsUpdate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryContact>(
		`contacts/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { contact: { ...fields } } },
	);

	const parsed = ClientaryContactSchema.parse(response);

	await cacheRecord(ctx.db.contacts, parsed, 'contact');

	await logEventFromContext(
		ctx,
		'clientary.contacts.update',
		{ id },
		'completed',
	);
	return parsed;
};

/**
 * Delete a contact.
 *
 * API: DELETE /api/v2/contacts/:id
 * Docs: https://www.clientary.com/api/contacts
 */
export const remove: ClientaryEndpoints['contactsDelete'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	// any/unknown: DELETE response body is untyped and discarded; the plugin
	// synthesizes the DeleteSuccess response from the requested id.
	await makeClientaryRequest<unknown>(`contacts/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.contacts, input.id, 'contact');

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.contacts.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
