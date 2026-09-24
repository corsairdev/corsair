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
