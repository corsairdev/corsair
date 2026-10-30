import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type { JobPostingInfoResponse, JobPostingListResponse } from './types';

export const info: AshbyEndpoints['jobPosting.info'] = async (ctx, input) => {
	return await ashbyCall<JobPostingInfoResponse>(ctx, 'jobPosting.info', {
		jobPostingId: input.jobPostingId,
	});
};

export const list: AshbyEndpoints['jobPosting.list'] = async (ctx, input) => {
	return await ashbyCall<JobPostingListResponse>(ctx, 'jobPosting.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		jobId: input.jobId,
		departmentId: input.departmentId,
		locationId: input.locationId,
		listedOnly: input.listedOnly,
	});
};
