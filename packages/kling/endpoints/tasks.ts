import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import type { KlingContext } from '..';
import { makeKlingRequest } from '../client';
import type {
	KlingCreateTaskOutput,
	KlingCursorTaskListOutput,
	KlingSolutionListInput,
	KlingTaskDetailOutput,
	KlingTaskGetInput,
	KlingTaskListInput,
	KlingTaskListOutput,
	KlingTaskPageListInput,
} from './types';
import {
	KlingCreateTaskResponseSchema,
	KlingCursorTaskListResponseSchema,
	KlingTaskDetailResponseSchema,
	KlingTaskGetInputSchema,
	KlingTaskListResponseSchema,
	KlingTaskPageListInputSchema,
} from './types';

// Versioned (model-in-path) video jobs and the solution APIs are all queried
// through the platform-wide task endpoints, so the query implementation lives
// here once and every group's get/list operation delegates to it. Only the
// request path and the emitted event name differ per group.

// Resolves the new task id from either documented envelope spelling (`id` for
// the versioned API, `task_id` for the /v1 and solution APIs).
export function createdTaskId(response: {
	data: { id?: string; task_id?: string };
}): string | undefined {
	return response.data.id ?? response.data.task_id;
}

// Create: POST <path> with the validated body and a per-group event payload
// (never the prompt or any other user content). `body` and `extra` are JSON
// records whose values are `unknown` because each group sends a different
// shape; the per-operation zod schema validates them before this call.
export async function createTask(
	ctx: KlingContext,
	event: string,
	path: string,
	body: Record<string, unknown>,
	extra: Record<string, unknown>,
): Promise<KlingCreateTaskOutput> {
	const response = await makeKlingRequest<KlingCreateTaskOutput>(
		path,
		ctx.key,
		{ method: 'POST', body },
	);

	const parsedResponse = KlingCreateTaskResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		event,
		{ ...extra, taskId: createdTaskId(parsedResponse) },
		'completed',
	);

	return parsedResponse;
}

// Get a task by id from `/tasks` (versioned jobs) or `/solutions`. Both return
// the queried tasks as a `data` array.
export async function getTaskById(
	ctx: KlingContext,
	event: string,
	path: string,
	input: KlingTaskGetInput,
): Promise<KlingTaskListOutput> {
	const parsed = KlingTaskGetInputSchema.parse(input);

	const response = await makeKlingRequest<KlingTaskListOutput>(path, ctx.key, {
		method: 'GET',
		query: { task_ids: parsed.task_id },
	});

	const parsedResponse = KlingTaskListResponseSchema.parse(response);

	// Task ids are identifiers, not content: log only how many were returned.
	await logEventFromContext(
		ctx,
		event,
		{ count: parsedResponse.data.length },
		'completed',
	);

	return parsedResponse;
}

// Get a task by id from a legacy /v1 endpoint (`GET <path>/{task_id}`), which
// returns the task as a single `data` object.
export async function getV1TaskById(
	ctx: KlingContext,
	event: string,
	path: string,
	input: KlingTaskGetInput,
): Promise<KlingTaskDetailOutput> {
	const parsed = KlingTaskGetInputSchema.parse(input);

	const response = await makeKlingRequest<KlingTaskDetailOutput>(
		`${path}/${parsed.task_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsedResponse = KlingTaskDetailResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		event,
		{ taskId: parsedResponse.data.id ?? parsedResponse.data.task_id },
		'completed',
	);

	return parsedResponse;
}

// Cursor list (`POST <path>`) used by `/tasks` and `/solutions`. The caller
// passes the schema for its own path: the `/tasks` schema also allows
// `product_type` filtering, while `/solutions` documents only `status`, so
// sharing one parser would let an invalid `/solutions` filter reach the
// provider and fail with a 400 instead of being rejected locally.
export async function listTasksByCursor<
	T extends KlingTaskListInput | KlingSolutionListInput,
>(
	ctx: KlingContext,
	event: string,
	path: string,
	input: T,
	schema: ZodType<T>,
): Promise<KlingCursorTaskListOutput> {
	const parsed = schema.parse(input);

	const response = await makeKlingRequest<KlingCursorTaskListOutput>(
		path,
		ctx.key,
		{ method: 'POST', body: parsed },
	);

	const parsedResponse = KlingCursorTaskListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		event,
		{ count: parsedResponse.data.result.length },
		'completed',
	);

	return parsedResponse;
}

// Page-number list (`GET <path>?pageNum&pageSize`) used by the /v1 endpoints.
export async function listTasksByPage(
	ctx: KlingContext,
	event: string,
	path: string,
	input: KlingTaskPageListInput,
): Promise<KlingTaskListOutput> {
	const parsed = KlingTaskPageListInputSchema.parse(input);

	const response = await makeKlingRequest<KlingTaskListOutput>(path, ctx.key, {
		method: 'GET',
		query: { pageNum: parsed.pageNum, pageSize: parsed.pageSize },
	});

	const parsedResponse = KlingTaskListResponseSchema.parse(response);

	await logEventFromContext(
		ctx,
		event,
		{ count: parsedResponse.data.length },
		'completed',
	);

	return parsedResponse;
}
