import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/**
 * Lists the user's work experience, i.e. their employment history
 * (GET /user/jobs). These are not job postings.
 */
export const list: RemoetEndpoints['workExperienceList'] = async (
	ctx,
	input,
) => {
	RemoetEndpointInputSchemas.workExperienceList.parse(input);
	const response = await makeRemoetRequest('/user/jobs', ctx.key, {
		method: 'GET',
	});
	const validated =
		RemoetEndpointOutputSchemas.workExperienceList.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.workExperience.list',
		{ resultCount: validated.length },
		'completed',
	);
	return validated;
};

/** Adds a work experience entry (POST /user/jobs). */
export const create: RemoetEndpoints['workExperienceCreate'] = async (
	ctx,
	input,
) => {
	const parsed = RemoetEndpointInputSchemas.workExperienceCreate.parse(input);
	const response = await makeRemoetRequest('/user/jobs', ctx.key, {
		method: 'POST',
		body: parsed,
	});
	const validated =
		RemoetEndpointOutputSchemas.workExperienceCreate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.workExperience.create',
		{ id: validated.id },
		'completed',
	);
	return validated;
};

/**
 * Updates a work experience entry (PATCH /user/jobs/:id). Fields left out
 * are unchanged; see the endpoint description for what clears a field.
 */
export const update: RemoetEndpoints['workExperienceUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } =
		RemoetEndpointInputSchemas.workExperienceUpdate.parse(input);
	const response = await makeRemoetRequest(
		`/user/jobs/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'PATCH', body: fields },
	);
	const validated =
		RemoetEndpointOutputSchemas.workExperienceUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.workExperience.update',
		{ id: validated.id },
		'completed',
	);
	return validated;
};

/** Removes a work experience entry (DELETE /user/jobs/:id). */
export const remove: RemoetEndpoints['workExperienceDelete'] = async (
	ctx,
	input,
) => {
	const { id } = RemoetEndpointInputSchemas.workExperienceDelete.parse(input);
	const response = await makeRemoetRequest(
		`/user/jobs/${encodeURIComponent(id)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const validated =
		RemoetEndpointOutputSchemas.workExperienceDelete.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.workExperience.delete',
		{ id: validated.id },
		'completed',
	);
	return validated;
};
