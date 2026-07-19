import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const createJobChange: WorkdayEndpoints['createJobChange'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['createJobChange']
	>('v1/job/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.job.createJobChange',
		input ?? {},
		'completed',
	);
	return response;
};

export const getJobById: WorkdayEndpoints['getJobById'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getJobById']
	>('v1/job/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.job.getJobById',
		input ?? {},
		'completed',
	);
	return response;
};

export const getJobChangeFrequencies: WorkdayEndpoints['getJobChangeFrequencies'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangeFrequencies']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangeFrequencies',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobChangeLocationInfo: WorkdayEndpoints['getJobChangeLocationInfo'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangeLocationInfo']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangeLocationInfo',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobChangePosition: WorkdayEndpoints['getJobChangePosition'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangePosition']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangePosition',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobChangeReasonInstance: WorkdayEndpoints['getJobChangeReasonInstance'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangeReasonInstance']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangeReasonInstance',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobChangeReasonValues: WorkdayEndpoints['getJobChangeReasonValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangeReasonValues']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangeReasonValues',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobChangeReasons: WorkdayEndpoints['getJobChangeReasons'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangeReasons']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangeReasons',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobChangesGroupTemplates: WorkdayEndpoints['getJobChangesGroupTemplates'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangesGroupTemplates']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangesGroupTemplates',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobChangesJobValues: WorkdayEndpoints['getJobChangesJobValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangesJobValues']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangesJobValues',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobChangesWorkerValues: WorkdayEndpoints['getJobChangesWorkerValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobChangesWorkerValues']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobChangesWorkerValues',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobClassifications: WorkdayEndpoints['getJobClassifications'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobClassifications']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobClassifications',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobPosting: WorkdayEndpoints['getJobPosting'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getJobPosting']
	>('v1/job/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.job.getJobPosting',
		input ?? {},
		'completed',
	);
	return response;
};

export const getJobPostingQuestionnaire: WorkdayEndpoints['getJobPostingQuestionnaire'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobPostingQuestionnaire']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobPostingQuestionnaire',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobProfilesValues: WorkdayEndpoints['getJobProfilesValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobProfilesValues']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobProfilesValues',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobRequisitionValues: WorkdayEndpoints['getJobRequisitionValues'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getJobRequisitionValues']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.getJobRequisitionValues',
			input ?? {},
			'completed',
		);
		return response;
	};

export const getJobWorkspace: WorkdayEndpoints['getJobWorkspace'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getJobWorkspace']
	>('v1/job/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.job.getJobWorkspace',
		input ?? {},
		'completed',
	);
	return response;
};

export const getJobWorkspaces: WorkdayEndpoints['getJobWorkspaces'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['getJobWorkspaces']
	>('v1/job/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.job.getJobWorkspaces',
		input ?? {},
		'completed',
	);
	return response;
};

export const listJobPostings: WorkdayEndpoints['listJobPostings'] = async (
	ctx,
	input,
) => {
	const response = await makeWorkdayRequest<
		WorkdayEndpointOutputs['listJobPostings']
	>('v1/job/api', ctx.key, {
		method: 'POST',
		body: input as { [key: string]: unknown },
	});
	await logEventFromContext(
		ctx,
		'workday.job.listJobPostings',
		input ?? {},
		'completed',
	);
	return response;
};

export const updateJobChangeBusinessTitle: WorkdayEndpoints['updateJobChangeBusinessTitle'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['updateJobChangeBusinessTitle']
		>('v1/job/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.job.updateJobChangeBusinessTitle',
			input ?? {},
			'completed',
		);
		return response;
	};
