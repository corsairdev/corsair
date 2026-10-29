import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ScaleAiContext, ScaleAiEndpoints } from '..';
import { encodeScalePathSegment, makeScaleAiRequest } from '../client';
import type {
	ListTasksResponse,
	ScaleTask,
	SendTaskCallbackResponse,
} from './types';

type QueryValue =
	| string
	| number
	| boolean
	| Array<string | number>
	| undefined;

function toQuery(input: Record<string, unknown>): Record<string, QueryValue> {
	const query: Record<string, QueryValue> = {};
	for (const [key, value] of Object.entries(input)) {
		if (value === undefined || value === null) continue;
		if (Array.isArray(value)) {
			query[key] = value as Array<string | number>;
		} else if (typeof value === 'object') {
			query[key] = JSON.stringify(value);
		} else {
			query[key] = value as QueryValue;
		}
	}
	return query;
}

// ── Task creation (POST /task/{taskType}) ────────────────────────────────────

type TaskCreateEndpoint = CorsairEndpoint<
	ScaleAiContext,
	Record<string, unknown>,
	ScaleTask
>;

function createTaskEndpoint(taskType: string): TaskCreateEndpoint {
	return async (ctx, input) => {
		const response = await makeScaleAiRequest<ScaleTask>(
			`task/${taskType}`,
			ctx.key,
			{ method: 'POST', body: input },
		);
		await logEventFromContext(
			ctx,
			`scaleai.tasks.create.${taskType}`,
			{ project: input.project, batch: input.batch, task_id: response.task_id },
			'completed',
		);
		return response;
	};
}

export const createImageAnnotationTask = createTaskEndpoint(
	'imageannotation',
) as ScaleAiEndpoints['createImageAnnotationTask'];

export const createSegmentationAnnotationTask = createTaskEndpoint(
	'segmentannotation',
) as ScaleAiEndpoints['createSegmentationAnnotationTask'];

export const createVideoAnnotationTask = createTaskEndpoint(
	'videoannotation',
) as ScaleAiEndpoints['createVideoAnnotationTask'];

export const createVideoPlaybackAnnotationTask = createTaskEndpoint(
	'videoplaybackannotation',
) as ScaleAiEndpoints['createVideoPlaybackAnnotationTask'];

export const createLidarAnnotationTask = createTaskEndpoint(
	'lidarannotation',
) as ScaleAiEndpoints['createLidarAnnotationTask'];

export const createLidarSegmentationTask = createTaskEndpoint(
	'lidarsegmentation',
) as ScaleAiEndpoints['createLidarSegmentationTask'];

export const createNamedEntityRecognitionTask = createTaskEndpoint(
	'namedentityrecognition',
) as ScaleAiEndpoints['createNamedEntityRecognitionTask'];

export const createTextCollectionTask = createTaskEndpoint(
	'textcollection',
) as ScaleAiEndpoints['createTextCollectionTask'];

export const createDocumentTranscriptionTask = createTaskEndpoint(
	'documenttranscription',
) as ScaleAiEndpoints['createDocumentTranscriptionTask'];

// ── Task retrieval ──────────────────────────────────────────────────────────

export const getTask: ScaleAiEndpoints['getTask'] = async (ctx, input) => {
	const response = await makeScaleAiRequest<ScaleTask>(
		`task/${encodeScalePathSegment(input.taskId)}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'scaleai.tasks.get',
		{ taskId: input.taskId },
		'completed',
	);
	return response;
};

export const listTasks: ScaleAiEndpoints['listTasks'] = async (ctx, input) => {
	const response = await makeScaleAiRequest<ListTasksResponse>(
		'tasks',
		ctx.key,
		{
			method: 'GET',
			query: toQuery(input),
		},
	);
	await logEventFromContext(
		ctx,
		'scaleai.tasks.list',
		{ count: response.docs.length, has_more: response.has_more ?? false },
		'completed',
	);
	return response;
};

export const getTaskResponseUrl: ScaleAiEndpoints['getTaskResponseUrl'] =
	async (ctx, input) => {
		const response = await makeScaleAiRequest<unknown>(
			`task/${encodeScalePathSegment(input.taskId)}/response_url/${encodeScalePathSegment(input.uuid)}`,
			ctx.key,
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'scaleai.tasks.getResponseUrl',
			{ taskId: input.taskId },
			'completed',
		);
		return response;
	};

export const sendTaskCallback: ScaleAiEndpoints['sendTaskCallback'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<SendTaskCallbackResponse>(
		`task/${encodeScalePathSegment(input.taskId)}/send_callback`,
		ctx.key,
		{ method: 'POST' },
	);
	await logEventFromContext(
		ctx,
		'scaleai.tasks.sendCallback',
		{ taskId: input.taskId },
		'completed',
	);
	return response;
};

// ── Tags ────────────────────────────────────────────────────────────────────

export const addTaskTags: ScaleAiEndpoints['addTaskTags'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ScaleTask>(
		`task/${encodeScalePathSegment(input.taskId)}/tags`,
		ctx.key,
		{ method: 'PUT', body: input.tags },
	);
	await logEventFromContext(
		ctx,
		'scaleai.tasks.addTags',
		{ taskId: input.taskId, tags: input.tags },
		'completed',
	);
	return response;
};

export const deleteTaskTags: ScaleAiEndpoints['deleteTaskTags'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ScaleTask>(
		`task/${encodeScalePathSegment(input.taskId)}/tags`,
		ctx.key,
		{ method: 'DELETE', body: input.tags },
	);
	await logEventFromContext(
		ctx,
		'scaleai.tasks.deleteTags',
		{ taskId: input.taskId, tags: input.tags },
		'completed',
	);
	return response;
};

// ── Unique id ───────────────────────────────────────────────────────────────

export const updateTaskUniqueId: ScaleAiEndpoints['updateTaskUniqueId'] =
	async (ctx, input) => {
		const response = await makeScaleAiRequest<ScaleTask>(
			`task/${encodeScalePathSegment(input.taskId)}/unique_id`,
			ctx.key,
			{ method: 'POST', body: { unique_id: input.unique_id } },
		);
		await logEventFromContext(
			ctx,
			'scaleai.tasks.updateUniqueId',
			{ taskId: input.taskId },
			'completed',
		);
		return response;
	};

export const deleteTaskUniqueId: ScaleAiEndpoints['deleteTaskUniqueId'] =
	async (ctx, input) => {
		const response = await makeScaleAiRequest<ScaleTask>(
			`task/${encodeScalePathSegment(input.taskId)}/unique_id`,
			ctx.key,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'scaleai.tasks.deleteUniqueId',
			{ taskId: input.taskId },
			'completed',
		);
		return response;
	};

// ── Metadata ────────────────────────────────────────────────────────────────

export const setTaskMetadata: ScaleAiEndpoints['setTaskMetadata'] = async (
	ctx,
	input,
) => {
	const response = await makeScaleAiRequest<ScaleTask>(
		`task/${encodeScalePathSegment(input.taskId)}/setMetadata`,
		ctx.key,
		{ method: 'POST', body: input.metadata },
	);
	await logEventFromContext(
		ctx,
		'scaleai.tasks.setMetadata',
		{ taskId: input.taskId },
		'completed',
	);
	return response;
};
