import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/** Reads the signed-in user's whole profile (GET /user/full). */
export const get: RemoetEndpoints['profileGet'] = async (ctx, input) => {
	RemoetEndpointInputSchemas.profileGet.parse(input);
	const response = await makeRemoetRequest('/user/full', ctx.key, {
		method: 'GET',
	});
	const validated = RemoetEndpointOutputSchemas.profileGet.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.profile.get',
		{
			jobs: validated.jobs.length,
			projects: validated.projects.length,
			education: validated.education.length,
			linkTrees: validated.linkTrees.length,
		},
		'completed',
	);
	return validated;
};

/** Reads the user's public profile links (GET /user/links). */
export const getLinks: RemoetEndpoints['profileGetLinks'] = async (
	ctx,
	input,
) => {
	RemoetEndpointInputSchemas.profileGetLinks.parse(input);
	const response = await makeRemoetRequest('/user/links', ctx.key, {
		method: 'GET',
	});
	const validated = RemoetEndpointOutputSchemas.profileGetLinks.parse(response);

	await logEventFromContext(ctx, 'remoet.profile.getLinks', {}, 'completed');
	return validated;
};

/**
 * Writes profile fields (PATCH /user/profile): contact fields, name,
 * avatarUrl, socials, summary and visibility. Every string field may be set
 * to null to clear it; visibility cannot, so leave it out to keep it as is.
 * Each field's public/private setting is left as the user set it, and
 * email and slug are not writable here.
 */
export const update: RemoetEndpoints['profileUpdate'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.profileUpdate.parse(input);

	const response = await makeRemoetRequest('/user/profile', ctx.key, {
		method: 'PATCH',
		body: parsed,
	});
	const validated = RemoetEndpointOutputSchemas.profileUpdate.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.profile.update',
		{ updated: validated.updated },
		'completed',
	);
	return validated;
};
