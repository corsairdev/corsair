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
