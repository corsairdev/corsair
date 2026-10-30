import { logEventFromContext } from 'corsair/core';
import { makeAsyncInterviewRequest } from '../client';
import type { AsyncInterviewContext } from '../index';
import { AsyncInterviewJobEntity } from '../schema';
import { evictEntity, upsertEntity } from './persist';
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
	EmptyUpdateResponseSchema,
	ListJobsOutputSchema,
	ListResponsesOutputSchema,
	UpdateJobOutputSchema,
} from './types';

function jobIdString(job_id: string | number): string {
	return String(job_id);
}

function jobIdNumber(job_id: string | number): number {
	return typeof job_id === 'number' ? job_id : Number(job_id);
}

export async function deleteJob(
	ctx: AsyncInterviewContext,
	input: DeleteJobInput,
): Promise<DeleteJobOutput> {
	await makeAsyncInterviewRequest<unknown>('/jobs/{job_id}', ctx.key, {
		method: 'DELETE',
		path: { job_id: jobIdString(input.job_id) },
	});
	await evictEntity(ctx.db?.jobs, input.job_id);
	await logEventFromContext(
		ctx,
		'asyncinterview.jobs.delete',
		{ job_id: jobIdString(input.job_id) },
		'completed',
	);
	return { job_id: jobIdNumber(input.job_id) };
}

export async function listResponses(
	ctx: AsyncInterviewContext,
	input: ListResponsesInput,
): Promise<ListResponsesOutput> {
	const raw = await makeAsyncInterviewRequest<unknown>('/interviews', ctx.key, {
		method: 'GET',
		query:
			input.job_id === undefined
				? undefined
				: { job_id: jobIdString(input.job_id) },
	});
	const result = ListResponsesOutputSchema.parse(raw);
	for (const row of result) {
		await upsertEntity(ctx.db?.interviews, row.id, row);
	}
	await logEventFromContext(
		ctx,
		'asyncinterview.jobs.listResponses',
		{
			job_id:
				input.job_id === undefined ? undefined : jobIdString(input.job_id),
			count: result.length,
		},
		'completed',
	);
	return result;
}

export async function listJobs(
	ctx: AsyncInterviewContext,
	_input: ListJobsInput,
): Promise<ListJobsOutput> {
	const raw = await makeAsyncInterviewRequest<unknown>('/jobs', ctx.key, {
		method: 'GET',
	});
	const result = ListJobsOutputSchema.parse(raw);
	for (const row of result) {
		await upsertEntity(ctx.db?.jobs, row.id, row);
	}
	await logEventFromContext(ctx, 'asyncinterview.jobs.list', {}, 'completed');
	return result;
}

export async function updateJob(
	ctx: AsyncInterviewContext,
	input: UpdateJobInput,
): Promise<UpdateJobOutput> {
	const { job_id, ...fields } = input;
	const body: Record<string, unknown> = {};
	if (fields.title !== undefined) body.title = fields.title;
	if (fields.is_public !== undefined) body.is_public = fields.is_public;
	if (fields.sub_title !== undefined) body.sub_title = fields.sub_title;
	if (fields.description !== undefined) body.description = fields.description;

	const raw = await makeAsyncInterviewRequest<unknown>(
		'/jobs/{job_id}',
		ctx.key,
		{
			method: 'PUT',
			path: { job_id: jobIdString(job_id) },
			body,
		},
	);

	const result = EmptyUpdateResponseSchema.safeParse(raw).success
		? AsyncInterviewJobEntity.parse({
				id: jobIdNumber(job_id),
				...fields,
			})
		: UpdateJobOutputSchema.parse(raw);

	await upsertEntity(ctx.db?.jobs, result.id, result);
	await logEventFromContext(
		ctx,
		'asyncinterview.jobs.update',
		{ job_id: jobIdString(job_id), fields: Object.keys(body) },
		'completed',
	);
	return result;
}
