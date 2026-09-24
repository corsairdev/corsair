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
