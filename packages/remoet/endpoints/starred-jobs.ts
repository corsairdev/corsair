import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/** Lists jobs at the companies the user has starred (GET /user/starred-jobs). */
export const list: RemoetEndpoints['starredJobsList'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.starredJobsList.parse(input);
	const response = await makeRemoetRequest('/user/starred-jobs', ctx.key, {
		method: 'GET',
		query: {
			searchQuery: parsed.searchQuery,
			locationQuery: parsed.locationQuery,
			techStack: parsed.techStack,
			techStackMatch: parsed.techStackMatch,
			remotePolicy: parsed.remotePolicy,
			experienceLevel: parsed.experienceLevel,
			salaryMin: parsed.salaryMin,
			sortBy: parsed.sortBy,
			sortOrder: parsed.sortOrder,
			page: parsed.page,
			pageSize: parsed.pageSize,
		},
	});
	const validated = RemoetEndpointOutputSchemas.starredJobsList.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.starredJobs.list',
		{
			page: validated.page,
			resultCount: validated.jobs.length,
			totalCount: validated.totalCount,
		},
		'completed',
	);
	return validated;
};
