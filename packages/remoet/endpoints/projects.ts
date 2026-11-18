import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/** Lists the projects on the user's profile (GET /user/projects). */
export const list: RemoetEndpoints['projectsList'] = async (ctx, input) => {
	RemoetEndpointInputSchemas.projectsList.parse(input);
	const response = await makeRemoetRequest('/user/projects', ctx.key, {
		method: 'GET',
	});
	const validated = RemoetEndpointOutputSchemas.projectsList.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.projects.list',
		{ resultCount: validated.length },
		'completed',
	);
	return validated;
};

/** Adds a project entry (POST /user/projects). */
export const create: RemoetEndpoints['projectsCreate'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.projectsCreate.parse(input);
	const response = await makeRemoetRequest('/user/projects', ctx.key, {
		method: 'POST',
		body: parsed,
	});
	const validated = RemoetEndpointOutputSchemas.projectsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.projects.create',
		{ id: validated.id },
		'completed',
	);
	return validated;
};

/**
 * Updates a project entry (PATCH /user/projects/:id). Fields left out are
 * unchanged; see the endpoint description for what clears a field.
 */
export const update: RemoetEndpoints['projectsUpdate'] = async (ctx, input) => {
	const { id, ...fields } =
		RemoetEndpointInputSchemas.projectsUpdate.parse(input);
	const response = await makeRemoetRequest(
		`/user/projects/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'PATCH', body: fields },
	);
	const validated = RemoetEndpointOutputSchemas.projectsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.projects.update',
		{ id: validated.id },
		'completed',
	);
	return validated;
};

/** Removes a project entry (DELETE /user/projects/:id). */
export const remove: RemoetEndpoints['projectsDelete'] = async (ctx, input) => {
	const { id } = RemoetEndpointInputSchemas.projectsDelete.parse(input);
	const response = await makeRemoetRequest(
		`/user/projects/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const validated = RemoetEndpointOutputSchemas.projectsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.projects.delete',
		{ id: validated.id },
		'completed',
	);
	return validated;
};
