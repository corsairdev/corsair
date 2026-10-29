import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/**
 * Lists the user's saved jobs (GET /user/saved-jobs). An entry for a job the
 * user can no longer see comes back locked, with `job: null`.
 */
export const list: RemoetEndpoints['savedJobsList'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.savedJobsList.parse(input);
	const response = await makeRemoetRequest('/user/saved-jobs', ctx.key, {
		method: 'GET',
		query: { page: parsed.page, pageSize: parsed.pageSize },
	});
	const validated = RemoetEndpointOutputSchemas.savedJobsList.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.savedJobs.list',
		{
			page: validated.page,
			resultCount: validated.items.length,
			totalCount: validated.totalCount,
		},
		'completed',
	);
	return validated;
};

/**
 * Saves a job for the user (POST /user/saved-jobs). Remoet answers 404 when the
 * job is unknown or not viewable, and 409 when it is already saved.
 */
export const create: RemoetEndpoints['savedJobsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = RemoetEndpointInputSchemas.savedJobsCreate.parse(input);
	const response = await makeRemoetRequest('/user/saved-jobs', ctx.key, {
		method: 'POST',
		body: parsed,
	});
	const validated = RemoetEndpointOutputSchemas.savedJobsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.savedJobs.create',
		{ id: validated.id, jobId: validated.jobId },
		'completed',
	);
	return validated;
};

/** Replaces the note on a saved-job entry (PATCH /user/saved-jobs/:savedJobId). */
export const update: RemoetEndpoints['savedJobsUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = RemoetEndpointInputSchemas.savedJobsUpdate.parse(input);
	const response = await makeRemoetRequest(
		`/user/saved-jobs/${encodeURIComponent(parsed.savedJobId)}`,
		ctx.key,
		{ method: 'PATCH', body: { note: parsed.note } },
	);
	const validated = RemoetEndpointOutputSchemas.savedJobsUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.savedJobs.update',
		{ id: validated.id },
		'completed',
	);
	return validated;
};

/** Removes a saved-job entry (DELETE /user/saved-jobs/:savedJobId). */
export const remove: RemoetEndpoints['savedJobsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = RemoetEndpointInputSchemas.savedJobsDelete.parse(input);
	const response = await makeRemoetRequest(
		`/user/saved-jobs/${encodeURIComponent(parsed.savedJobId)}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const validated = RemoetEndpointOutputSchemas.savedJobsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.savedJobs.delete',
		{ id: validated.id },
		'completed',
	);
	return validated;
};
