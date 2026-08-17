import { logEventFromContext } from 'corsair/core';
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
import {
	DeleteJobOutputSchema,
	ListJobsOutputSchema,
	ListResponsesOutputSchema,
	UpdateJobOutputSchema,
} from './types';

export async function deleteJob(
	ctx: AsyncInterviewContext,
	input: DeleteJobInput,
): Promise<DeleteJobOutput> {
	const raw = await makeAsyncInterviewRequest<unknown>(
		`/jobs/${input.id}`,
		ctx.key,
		{ method: 'DELETE' },
	);
	const result = DeleteJobOutputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'asyncinterview.jobs.delete',
		{ id: input.id },
		'completed',
	);
	return result;
}

export async function listResponses(
	ctx: AsyncInterviewContext,
	input: ListResponsesInput,
): Promise<ListResponsesOutput> {
	const raw = await makeAsyncInterviewRequest<unknown>(
		`/jobs/${input.jobId}/responses`,
		ctx.key,
		{ method: 'GET' },
	);
	const result = ListResponsesOutputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'asyncinterview.jobs.listResponses',
		{ jobId: input.jobId },
		'completed',
	);
	return result;
}

export async function listJobs(
	ctx: AsyncInterviewContext,
	_input: ListJobsInput,
): Promise<ListJobsOutput> {
	const raw = await makeAsyncInterviewRequest<unknown>(`/jobs`, ctx.key, {
		method: 'GET',
	});
	const result = ListJobsOutputSchema.parse(raw);
	await logEventFromContext(ctx, 'asyncinterview.jobs.list', {}, 'completed');
	return result;
}

export async function updateJob(
	ctx: AsyncInterviewContext,
	input: UpdateJobInput,
): Promise<UpdateJobOutput> {
	const { id, ...body } = input;
	const raw = await makeAsyncInterviewRequest<unknown>(`/jobs/${id}`, ctx.key, {
		method: 'PATCH',
		body,
	});
	const result = UpdateJobOutputSchema.parse(raw);
	await logEventFromContext(
		ctx,
		'asyncinterview.jobs.update',
		// Log which fields changed, never their values.
		{ id, fields: Object.keys(body) },
		'completed',
	);
	return result;
}
