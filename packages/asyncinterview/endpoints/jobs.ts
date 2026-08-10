import { makeAsyncInterviewRequest } from '../client';
import type { AsyncInterviewContext } from '../index';
import type {
	DeleteJobInput,
	DeleteJobOutput,
	ListJobsInput,
	ListJobsOutput,
	ListResponsesInput,
	ListResponsesOutput,
	UpdateJobInput,
	UpdateJobOutput,
} from './types';

export async function deleteJob(
	ctx: AsyncInterviewContext,
	input: DeleteJobInput,
): Promise<DeleteJobOutput> {
	const apiKey = ctx.key;
	return await makeAsyncInterviewRequest<DeleteJobOutput>(
		`/jobs/${input.id}`,
		apiKey,
		{ method: 'DELETE' },
	);
}

export async function listResponses(
	ctx: AsyncInterviewContext,
	input: ListResponsesInput,
): Promise<ListResponsesOutput> {
	const apiKey = ctx.key;
	return await makeAsyncInterviewRequest<ListResponsesOutput>(
		`/jobs/${input.jobId}/responses`,
		apiKey,
		{ method: 'GET' },
	);
}

export async function listJobs(
	ctx: AsyncInterviewContext,
	_input: ListJobsInput,
): Promise<ListJobsOutput> {
	const apiKey = ctx.key;
	return await makeAsyncInterviewRequest<ListJobsOutput>(`/jobs`, apiKey, {
		method: 'GET',
	});
}

export async function updateJob(
	ctx: AsyncInterviewContext,
	input: UpdateJobInput,
): Promise<UpdateJobOutput> {
	const apiKey = ctx.key;
	const { id, ...body } = input;
	return await makeAsyncInterviewRequest<UpdateJobOutput>(
		`/jobs/${id}`,
		apiKey,
		{
			method: 'PATCH',
			body,
		},
	);
}
