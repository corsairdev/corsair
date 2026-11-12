import { logEventFromContext } from 'corsair/core';
import type { ScrapeDoEndpoints } from '..';
import { makeScrapeDoRequest, parseJsonObject } from '../client';
import {
	ScrapeDoEndpointInputSchemas as Inputs,
	ScrapeDoEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The async API on `q.scrape.do`, authenticated with `X-Token`, and it answers
 * JSON in PascalCase. Every field is renamed once here rather than through a
 * `.transform()`, so the generated reference shows the names callers receive.
 *
 * Job statuses, from https://scrape.do/documentation/async-api/get-job/:
 * `queuing`, `queued`, `pending` and `rotating` while the job runs, then
 * `success`, `error` or `canceled`. A task is `pending`, then `rotating`, then
 * `success` or `error`.
 */

// unknown: the async answers are PascalCase objects whose fields are renamed
// one at a time below; each read names the field it takes.
function readAsync(body: unknown): Record<string, unknown> {
	if (typeof body !== 'object' || body === null || Array.isArray(body)) {
		throw new Error(
			'Scrape.do async API answered with a body that is not an object',
		);
	}
	return body as Record<string, unknown>;
}

// unknown: the async API sends a flat PascalCase object per task and each field
// is renamed individually here; this is the map those reads come from.
function mapTask(task: Record<string, unknown>) {
	return {
		task_id: task.TaskID,
		url: task.URL,
		status: task.Status,
	};
}

// unknown: same flat PascalCase job object; the map it returns is what the
// output schema then validates.
function mapJob(job: Record<string, unknown>) {
	const tasks = Array.isArray(job.Tasks) ? job.Tasks : [];
	return {
		job_id: job.JobID,
		status: job.Status,
		start_time: job.StartTime,
		end_time: job.EndTime,
		canceled: job.Canceled,
		tasks: tasks.map((task) => mapTask(task as Record<string, unknown>)),
	};
}

export const start: ScrapeDoEndpoints['jobsStart'] = async (ctx, rawInput) => {
	const input = Inputs.jobsStart.parse(rawInput ?? {});
	const answer = await makeScrapeDoRequest(ctx.key, {
		kind: 'async',
		method: 'POST',
		path: '/jobs',
		body: {
			Targets: input.targets,
			Super: input.super,
			GeoCode: input.geoCode,
			Render: input.render,
			WebhookURL: input.webhookUrl,
		},
	});
	const body = readAsync(parseJsonObject(answer.body));
	const result = Outputs.jobsStart.parse({
		job_id: body.JobID,
		task_ids: body.TaskIDs,
		message: body.Message,
	});
	await logEventFromContext(
		ctx,
		'scrapedo.jobs.start',
		{ jobId: result.job_id, targets: result.task_ids.length },
		'completed',
	);
	return result;
};

export const get: ScrapeDoEndpoints['jobsGet'] = async (ctx, rawInput) => {
	const input = Inputs.jobsGet.parse(rawInput ?? {});
	const answer = await makeScrapeDoRequest(ctx.key, {
		kind: 'async',
		method: 'GET',
		path: `/jobs/${encodeURIComponent(input.jobId)}`,
	});
	const body = readAsync(parseJsonObject(answer.body));
	const job = mapJob(body);
	const result = Outputs.jobsGet.parse({
		job_id: job.job_id,
		status: job.status,
		tasks: job.tasks,
		job,
	});
	await logEventFromContext(
		ctx,
		'scrapedo.jobs.get',
		{ jobId: result.job_id, status: result.status },
		'completed',
	);
	return result;
};

export const result: ScrapeDoEndpoints['jobsResult'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.jobsResult.parse(rawInput ?? {});
	const answer = await makeScrapeDoRequest(ctx.key, {
		kind: 'async',
		method: 'GET',
		path: `/jobs/${encodeURIComponent(input.jobId)}/${encodeURIComponent(input.taskId)}`,
	});
	const body = readAsync(parseJsonObject(answer.body));
	const parsed = Outputs.jobsResult.parse({
		task_id: body.TaskID,
		job_id: body.JobID,
		url: body.URL,
		status: body.Status,
		status_code: body.StatusCode,
		content: body.Content,
		base64_encoded: body.Base64EncodedContent,
		error_message: body.ErrorMessage,
		expires_at: body.ExpiresAt,
	});
	await logEventFromContext(
		ctx,
		'scrapedo.jobs.result',
		{
			jobId: parsed.job_id,
			status: parsed.status,
			statusCode: parsed.status_code ?? undefined,
		},
		'completed',
	);
	return parsed;
};

export const cancel: ScrapeDoEndpoints['jobsCancel'] = async (
	ctx,
	rawInput,
) => {
	const input = Inputs.jobsCancel.parse(rawInput ?? {});
	const answer = await makeScrapeDoRequest(ctx.key, {
		kind: 'async',
		method: 'DELETE',
		path: `/jobs/${encodeURIComponent(input.jobId)}`,
	});
	const body = readAsync(parseJsonObject(answer.body));
	const result = Outputs.jobsCancel.parse({
		job_id: body.JobID,
		status: body.Status,
	});
	await logEventFromContext(
		ctx,
		'scrapedo.jobs.cancel',
		{ jobId: result.job_id },
		'completed',
	);
	return result;
};

export const list: ScrapeDoEndpoints['jobsList'] = async (ctx, rawInput) => {
	const input = Inputs.jobsList.parse(rawInput ?? {});
	const answer = await makeScrapeDoRequest(ctx.key, {
		kind: 'async',
		method: 'GET',
		path: '/jobs',
		query: { pageNumber: input.pageNumber, pageSize: input.pageSize },
	});
	const body = readAsync(parseJsonObject(answer.body));
	const jobs = Array.isArray(body.Jobs) ? body.Jobs : [];
	const result = Outputs.jobsList.parse({
		// unknown: `Jobs` came off the wire and was only checked for being an
		// array; each entry is a PascalCase object the map above renames.
		jobs: jobs.map((job) => mapJob(job as Record<string, unknown>)),
		total_count: body.TotalCount,
		page_size: body.PageSize,
		page_number: body.PageNumber,
		total_pages: body.TotalPages,
	});
	await logEventFromContext(
		ctx,
		'scrapedo.jobs.list',
		{ count: result.jobs.length, total: result.total_count },
		'completed',
	);
	return result;
};
