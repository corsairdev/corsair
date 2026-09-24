import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from '../client';
import type { RemoetEndpoints } from '../index';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './types';

/**
 * Searches Remoet's public job catalogue (GET /user/job-postings). List
 * filters go out as repeated keys, which Remoet reads for every list,
 * including place names that contain commas.
 */
export const search: RemoetEndpoints['jobsSearch'] = async (ctx, input) => {
	const parsed = RemoetEndpointInputSchemas.jobsSearch.parse(input);
	const response = await makeRemoetRequest('/user/job-postings', ctx.key, {
		method: 'GET',
		query: {
			searchQuery: parsed.searchQuery,
			techStack: parsed.techStack,
			techStackMatch: parsed.techStackMatch,
			companySlug: parsed.companySlug,
			remotePolicy: parsed.remotePolicy,
			experienceLevel: parsed.experienceLevel,
			salaryMin: parsed.salaryMin,
			location: parsed.location,
			sortBy: parsed.sortBy,
			sortOrder: parsed.sortOrder,
			page: parsed.page,
			pageSize: parsed.pageSize,
		},
	});
	const validated = RemoetEndpointOutputSchemas.jobsSearch.parse(response);

	await logEventFromContext(
		ctx,
		'remoet.jobs.search',
		{
			page: validated.page,
			resultCount: validated.jobs.length,
			totalCount: validated.totalCount,
		},
		'completed',
	);
	return validated;
};
