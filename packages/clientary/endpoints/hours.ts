import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import type { ClientaryHour } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryHourSchema,
} from './types';

/**
 * List hours logged against a project.
 *
 * API: GET /api/v2/projects/:project_id/hours
 * Docs: https://www.clientary.com/api/hours
 */
export const listForProject: ClientaryEndpoints['hoursListForProject'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.hoursListForProject>
	>(`projects/${input.project_id}/hours`, apiKey, domain, {
		query: {
			page: input.page,
			page_size: input.page_size,
			filter: input.filter,
		},
	});

	const parsed =
		ClientaryEndpointOutputSchemas.hoursListForProject.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.hours.listForProject',
		{ project_id: input.project_id },
		'completed',
	);
	return parsed;
};

/**
 * Get a single hours entry by ID.
 *
 * API: GET /api/v2/hours/:id
 * Docs: https://www.clientary.com/api/hours
 */
export const get: ClientaryEndpoints['hoursGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryHour>(
		`hours/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryHourSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.hours.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Log hours against a project.
 *
 * API: POST /api/v2/projects/:project_id/hours
 * Docs: https://www.clientary.com/api/hours
 */
export const create: ClientaryEndpoints['hoursCreate'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { project_id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryHour>(
		`projects/${project_id}/hours`,
		apiKey,
		domain,
		{ method: 'POST', body: { hour: { ...fields } } },
	);

	const parsed = ClientaryHourSchema.parse(response);

	await logEventFromContext(
		ctx,
		'clientary.hours.create',
		{ project_id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing hours entry.
 *
 * API: PUT /api/v2/hours/:id
 * Docs: https://www.clientary.com/api/hours
 */
export const update: ClientaryEndpoints['hoursUpdate'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryHour>(
		`hours/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { hour: { ...fields } } },
	);

	const parsed = ClientaryHourSchema.parse(response);

	await logEventFromContext(ctx, 'clientary.hours.update', { id }, 'completed');
	return parsed;
};

/**
 * Delete a hours entry.
 *
 * API: DELETE /api/v2/hours/:id
 * Docs: https://www.clientary.com/api/hours
 */
export const remove: ClientaryEndpoints['hoursDelete'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	// any/unknown: DELETE response body is untyped and discarded; the plugin
	// synthesizes the DeleteSuccess response from the requested id.
	await makeClientaryRequest<unknown>(`hours/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.hours.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
