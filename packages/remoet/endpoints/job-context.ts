import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/**
 * Looks up what Remoet knows about a job page URL (GET /user/job-context).
 * Returns `{ match: null }` when Remoet does not track the page.
 */
export const get: RemoetEndpoints['jobContextGet'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.jobContextGet.parse(input);
	const response = await makeRemoetRequest('/user/job-context', ctx.key, {
		method: 'GET',
		query: { url: parsed.url },
	});
	const validated = RemoetEndpointOutputSchemas.jobContextGet.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.jobContext.get',
		{
			matched: validated.match !== null,
			companySlug: validated.match?.companySlug ?? null,
		},
		'completed',
	);
	return validated;
};
