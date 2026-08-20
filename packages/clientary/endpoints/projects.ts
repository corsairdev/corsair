import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { getClientaryCredentials, makeClientaryRequest } from '../client';
import type { ClientaryEndpoints } from '../index';
import { cacheRecord, cacheRecords, evictEntity } from './persist';
import type { ClientaryProject } from './types';
import {
	ClientaryDeleteResponseSchema,
	ClientaryEndpointOutputSchemas,
	ClientaryProjectSchema,
} from './types';

/**
 * List projects. Active/billable projects by default; pass
 * `filter: 'all'` to include closed projects.
 *
 * API: GET /api/v2/projects
 * Docs: https://www.clientary.com/api/projects
 */
export const list: ClientaryEndpoints['projectsList'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<
		z.infer<typeof ClientaryEndpointOutputSchemas.projectsList>
	>('projects', apiKey, domain, {
		query: {
			page: input.page,
			page_size: input.page_size,
			filter: input.filter,
		},
	});

	const parsed = ClientaryEndpointOutputSchemas.projectsList.parse(response);

	await cacheRecords(ctx.db.projects, parsed.projects, 'project');

	await logEventFromContext(
		ctx,
		'clientary.projects.list',
		{ ...input },
		'completed',
	);
	return parsed;
};

/**
 * List projects belonging to a single client.
 *
 * API: GET /api/v2/clients/:client_id/projects
 * Docs: https://www.clientary.com/api/projects
 */
export const listForClient: ClientaryEndpoints['projectsListForClient'] =
	async (ctx, input) => {
		const { apiKey, domain } = await getClientaryCredentials(ctx);

		const response = await makeClientaryRequest<
			z.infer<typeof ClientaryEndpointOutputSchemas.projectsListForClient>
		>(`clients/${input.client_id}/projects`, apiKey, domain, {
			query: {
				page: input.page,
				page_size: input.page_size,
			},
		});

		const parsed =
			ClientaryEndpointOutputSchemas.projectsListForClient.parse(response);

		await cacheRecords(ctx.db.projects, parsed.projects, 'project');

		await logEventFromContext(
			ctx,
			'clientary.projects.listForClient',
			{ client_id: input.client_id },
			'completed',
		);
		return parsed;
	};

/**
 * Get a single project by ID.
 *
 * API: GET /api/v2/projects/:id
 * Docs: https://www.clientary.com/api/projects
 */
export const get: ClientaryEndpoints['projectsGet'] = async (ctx, input) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryProject>(
		`projects/${input.id}`,
		apiKey,
		domain,
	);

	const parsed = ClientaryProjectSchema.parse(response);

	await cacheRecord(ctx.db.projects, parsed, 'project');

	await logEventFromContext(
		ctx,
		'clientary.projects.get',
		{ id: input.id },
		'completed',
	);
	return parsed;
};

/**
 * Create a new project. `name` and `rate` are required.
 *
 * API: POST /api/v2/projects
 * Docs: https://www.clientary.com/api/projects
 */
export const create: ClientaryEndpoints['projectsCreate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	const response = await makeClientaryRequest<ClientaryProject>(
		'projects',
		apiKey,
		domain,
		{ method: 'POST', body: { project: { ...input } } },
	);

	const parsed = ClientaryProjectSchema.parse(response);

	await cacheRecord(ctx.db.projects, parsed, 'project');

	await logEventFromContext(
		ctx,
		'clientary.projects.create',
		{ id: parsed.id },
		'completed',
	);
	return parsed;
};

/**
 * Update an existing project.
 *
 * API: PUT /api/v2/projects/:id
 * Docs: https://www.clientary.com/api/projects
 */
export const update: ClientaryEndpoints['projectsUpdate'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);
	const { id, ...fields } = input;

	const response = await makeClientaryRequest<ClientaryProject>(
		`projects/${id}`,
		apiKey,
		domain,
		{ method: 'PUT', body: { project: { ...fields } } },
	);

	const parsed = ClientaryProjectSchema.parse(response);

	await cacheRecord(ctx.db.projects, parsed, 'project');

	await logEventFromContext(
		ctx,
		'clientary.projects.update',
		{ id },
		'completed',
	);
	return parsed;
};

/**
 * Delete a project.
 *
 * API: DELETE /api/v2/projects/:id
 * Docs: https://www.clientary.com/api/projects
 */
export const remove: ClientaryEndpoints['projectsDelete'] = async (
	ctx,
	input,
) => {
	const { apiKey, domain } = await getClientaryCredentials(ctx);

	await makeClientaryRequest<unknown>(`projects/${input.id}`, apiKey, domain, {
		method: 'DELETE',
	});

	await evictEntity(ctx.db.projects, input.id, 'project');

	const result = ClientaryDeleteResponseSchema.parse({
		success: true,
		id: input.id,
	});

	await logEventFromContext(
		ctx,
		'clientary.projects.delete',
		{ id: input.id },
		'completed',
	);
	return result;
};
