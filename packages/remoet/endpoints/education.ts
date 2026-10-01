import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/** Lists the education entries on the user's profile (GET /user/education). */
export const list: RemoetEndpoints['educationList'] = async (ctx, input) => {
	RemoetEndpointInputSchemas.educationList.parse(input);
	const response = await makeRemoetRequest('/user/education', ctx.key, {
		method: 'GET',
	});
	const validated = RemoetEndpointOutputSchemas.educationList.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.education.list',
		{ resultCount: validated.length },
		'completed',
	);
	return validated;
};

/** Adds an education entry (POST /user/education). */
export const create: RemoetEndpoints['educationCreate'] = async (
	ctx,
	input,
) => {
	const parsed = RemoetEndpointInputSchemas.educationCreate.parse(input);
	const response = await makeRemoetRequest('/user/education', ctx.key, {
		method: 'POST',
		body: parsed,
	});
	const validated = RemoetEndpointOutputSchemas.educationCreate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.education.create',
		{ id: validated.id },
		'completed',
	);
	return validated;
};

/**
 * Updates an education entry (PATCH /user/education/:id). Fields left out
 * are unchanged; see the endpoint description for what clears a field.
 */
export const update: RemoetEndpoints['educationUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } =
		RemoetEndpointInputSchemas.educationUpdate.parse(input);
	const response = await makeRemoetRequest(
		`/user/education/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'PATCH', body: fields },
	);
	const validated = RemoetEndpointOutputSchemas.educationUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.education.update',
		{ id: validated.id },
		'completed',
	);
	return validated;
};

/** Removes an education entry (DELETE /user/education/:id). */
export const remove: RemoetEndpoints['educationDelete'] = async (
	ctx,
	input,
) => {
	const { id } = RemoetEndpointInputSchemas.educationDelete.parse(input);
	const response = await makeRemoetRequest(
		`/user/education/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const validated = RemoetEndpointOutputSchemas.educationDelete.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.education.delete',
		{ id: validated.id },
		'completed',
	);
	return validated;
};
