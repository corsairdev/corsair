import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import type { ClientaryLead } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryLeadSchema,
} from './types';

/**
 * List all leads. Supports pagination and sorting by name or oldest.
 *
 * API: GET /api/v2/leads
 * Docs: https://www.clientary.com/api/leads
 */
export const list: ClientaryEndpoints['leadsList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.leadsList>
	>('leads', apiKey, domain, {
		query: {
			page: input.page,
			page_size: input.page_size,
			sort: input.sort,
		},
	});

	const parsed = ClientaryEndpointOutputSchemas.leadsList.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.leads.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * Get a single lead by ID.
 *
 * API: GET /api/v2/leads/:id
 * Docs: https://www.clientary.com/api/leads
 */
export const get: ClientaryEndpoints['leadsGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryLead>(
		`leads/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryLeadSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.leads.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Create a new lead. `name` is required.
 *
 * API: POST /api/v2/leads
 * Docs: https://www.clientary.com/api/leads
 */
export const create: ClientaryEndpoints['leadsCreate'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryLead>(
		'leads',
		apiKey,
		domain,
		{ method: 'POST', body: { lead: { ...input } } },
	);

	const parsed = ClientaryLeadSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.leads.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing lead.
 *
 * API: PUT /api/v2/leads/:id
 * Docs: https://www.clientary.com/api/leads
 */
export const update: ClientaryEndpoints['leadsUpdate'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryLead>(
		`leads/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { lead: { ...fields } } },
	);

	const parsed = ClientaryLeadSchema.parse(response);

	await logEventFromContext(ctx, 'clientary.leads.update', { id }, 'completed');
	return parsed;
};

/**
 * Delete a lead.
 *
 * API: DELETE /api/v2/leads/:id
 * Docs: https://www.clientary.com/api/leads
 */
export const remove: ClientaryEndpoints['leadsDelete'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	await makeClientaryRequest<unknown>(`leads/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.leads.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
