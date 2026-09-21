import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	JobCreateResponse,
	JobInfoResponse,
	JobListResponse,
	JobSearchResponse,
	JobUpdateResponse,
} from './types';

export const info: AshbyEndpoints['job.info'] = async (ctx, input) => {
	return await ashbyCall<JobInfoResponse>(ctx, 'job.info', {
		jobId: input.jobId,
	});
};

export const list: AshbyEndpoints['job.list'] = async (ctx, input) => {
	return await ashbyCall<JobListResponse>(ctx, 'job.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		status: input.status,
		departmentId: input.departmentId,
		locationId: input.locationId,
	});
};

export const create: AshbyEndpoints['job.create'] = async (ctx, input) => {
	return await ashbyCall<JobCreateResponse>(ctx, 'job.create', {
		title: input.title,
		departmentId: input.departmentId,
		locationId: input.locationId,
		status: input.status,
		customFields: input.customFields,
	});
};

export const update: AshbyEndpoints['job.update'] = async (ctx, input) => {
	return await ashbyCall<JobUpdateResponse>(ctx, 'job.update', {
		jobId: input.jobId,
		title: input.title,
		departmentId: input.departmentId,
		locationId: input.locationId,
		status: input.status,
		customFields: input.customFields,
	});
};

export const search: AshbyEndpoints['job.search'] = async (ctx, input) => {
	return await ashbyCall<JobSearchResponse>(ctx, 'job.search', {
		title: input.title,
		status: input.status,
	});
};
