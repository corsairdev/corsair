import { logEventFromContext } from 'corsair/core';
import { makeScrapegraphAiRequest } from '../client';
import type { ScrapegraphAiEndpoints } from '../index';
import type { ScheduledJobsListResponse } from './types';

export const list: ScrapegraphAiEndpoints['scheduledJobsList'] = async (
	ctx,
	input,
) => {
	const response = await makeScrapegraphAiRequest<ScheduledJobsListResponse>(
		'v1/scheduled-jobs',
		ctx.key,
		{ method: 'GET', query: { ...input } },
	);

	await logEventFromContext(
		ctx,
		'scrapegraphai.scheduledJobs.list',
		{ ...input },
		'completed',
	);
	return response;
};
