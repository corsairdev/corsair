import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import {
	cacheRecord,
	cacheRecords,
	evictEntity,
	evictRelatedByClientId,
} from './persist';
import type { ClientaryClient } from './types';
import {
	ClientaryClientSchema,
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
} from './types';

/**
 * List clients. Supports pagination, `updated_since` filtering, and sorting
 * by creation date.
 *
 * API: GET /api/v2/clients
 * Docs: https://www.clientary.com/api/clients
 */
export const list: ClientaryEndpoints['clientsList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.clientsList>
	>('clients', apiKey, domain, {
		query: {
			page: input.page,
			page_size: input.page_size,
			updated_since: input.updated_since,
			sort: input.sort,
		},
	});

	const parsed = ClientaryEndpointOutputSchemas.clientsList.parse(response);

	await cacheRecords(ctx.db.clients, parsed.clients, 'client');

	await logEventFromContext(
		ctx,
		'clientary.clients.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * Get a single client by ID.
 *
 * API: GET /api/v2/clients/:id
 * Docs: https://www.clientary.com/api/clients
 */
export const get: ClientaryEndpoints['clientsGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryClient>(
		`clients/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryClientSchema.parse(response);

	await cacheRecord(ctx.db.clients, parsed, 'client');

	await logEventFromContext(
		ctx,
		'clientary.clients.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Create a new client. `name` is required.
 *
 * API: POST /api/v2/clients
 * Docs: https://www.clientary.com/api/clients
 */
export const create: ClientaryEndpoints['clientsCreate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryClient>(
		'clients',
		apiKey,
		domain,
		{ method: 'POST', body: { client: { ...input } } },
	);

	const parsed = ClientaryClientSchema.parse(response);

	await cacheRecord(ctx.db.clients, parsed, 'client');

	await logEventFromContext(
		ctx,
		'clientary.clients.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing client. Provide a partial list of fields.
 *
 * API: PUT /api/v2/clients/:id
 * Docs: https://www.clientary.com/api/clients
 */
export const update: ClientaryEndpoints['clientsUpdate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryClient>(
		`clients/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { client: { ...fields } } },
	);

	const parsed = ClientaryClientSchema.parse(response);

	await cacheRecord(ctx.db.clients, parsed, 'client');

	await logEventFromContext(
		ctx,
		'clientary.clients.update',
		{ id },
		'completed',
	);
	return parsed;
};

/**
 * Delete a client and all associated projects, invoices, estimates, and
 * contacts. Permanent and irreversible.
 *
 * API: DELETE /api/v2/clients/:id
 * Docs: https://www.clientary.com/api/clients
 */
export const remove: ClientaryEndpoints['clientsDelete'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	// any/unknown: DELETE response body is untyped and discarded; the plugin
	// synthesizes the DeleteSuccess response from the requested id.
	await makeClientaryRequest<unknown>(`clients/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.clients, input.id, 'client');
	await evictRelatedByClientId(ctx.db.contacts, input.id, 'contact');
	await evictRelatedByClientId(ctx.db.projects, input.id, 'project');
	await evictRelatedByClientId(ctx.db.invoices, input.id, 'invoice');
	await evictRelatedByClientId(ctx.db.estimates, input.id, 'estimate');
	await evictRelatedByClientId(ctx.db.tasks, input.id, 'task');

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.clients.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
