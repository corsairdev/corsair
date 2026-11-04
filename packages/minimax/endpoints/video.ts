import { logEventFromContext } from 'corsair/core';
import type { MinimaxEndpoints } from '..';
import { makeMinimaxRequest } from '../client';
import type {
	VideoCancelOrDeleteV2Output,
	VideoGenerateOutput,
	VideoGenerateV2Output,
	VideoListV2Output,
	VideoQueryOutput,
	VideoQueryV2Output,
	VideoTemplateGenerateOutput,
	VideoTemplateQueryOutput,
} from './types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './types';

export const generate: MinimaxEndpoints['videoGenerate'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.videoGenerate.parse(input);

	const response = await makeMinimaxRequest<VideoGenerateOutput>(
		'/v1/video_generation',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.videoGenerate.parse(response);

	// The prompt is user content; only the model and the returned task id are
	// logged.
	await logEventFromContext(
		ctx,
		'minimax.video.generate',
		{ model: parsedInput.model, taskId: parsed.task_id },
		'completed',
	);

	return parsed;
};

export const query: MinimaxEndpoints['videoQuery'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.videoQuery.parse(input);

	const response = await makeMinimaxRequest<VideoQueryOutput>(
		'/v1/query/video_generation',
		ctx.key,
		{ method: 'GET', query: { task_id: parsedInput.task_id } },
	);

	const parsed = MinimaxEndpointOutputSchemas.videoQuery.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.video.query',
		{ taskId: parsedInput.task_id, status: parsed.status ?? 'unknown' },
		'completed',
	);

	return parsed;
};

export const generateV2: MinimaxEndpoints['videoGenerateV2'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.videoGenerateV2.parse(input);

	const response = await makeMinimaxRequest<VideoGenerateV2Output>(
		'/v2/video_generation',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.videoGenerateV2.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.video.generateV2',
		{
			model: parsedInput.model,
			resolution: parsedInput.resolution,
			taskId: parsed.task_id,
		},
		'completed',
	);

	return parsed;
};

export const queryV2: MinimaxEndpoints['videoQueryV2'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.videoQueryV2.parse(input);

	const response = await makeMinimaxRequest<VideoQueryV2Output>(
		`/v2/query/video_generation/${encodeURIComponent(parsedInput.task_id)}`,
		ctx.key,
		{ method: 'GET' },
	);

	const parsed = MinimaxEndpointOutputSchemas.videoQueryV2.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.video.queryV2',
		{ taskId: parsedInput.task_id, status: parsed.task.status ?? 'unknown' },
		'completed',
	);

	return parsed;
};

export const listV2: MinimaxEndpoints['videoListV2'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.videoListV2.parse(input);

	// The V2 task list filters are `filter[...]` query keys, expanded by the
	// shared transport from this nested object; undefined entries are dropped.
	const response = await makeMinimaxRequest<VideoListV2Output>(
		'/v2/query/video_generation',
		ctx.key,
		{
			method: 'GET',
			query: {
				page_num: parsedInput.pageNum,
				page_size: parsedInput.pageSize,
				filter: {
					status: parsedInput.status,
					task_ids: parsedInput.taskIds,
					model: parsedInput.model,
					task_type: parsedInput.taskType,
				},
			},
		},
	);

	const parsed = MinimaxEndpointOutputSchemas.videoListV2.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.video.listV2',
		{ count: parsed.items.length, total: parsed.total ?? parsed.items.length },
		'completed',
	);

	return parsed;
};

export const cancelOrDeleteV2: MinimaxEndpoints['videoCancelOrDeleteV2'] =
	async (ctx, input) => {
		const parsedInput =
			MinimaxEndpointInputSchemas.videoCancelOrDeleteV2.parse(input);

		const response = await makeMinimaxRequest<VideoCancelOrDeleteV2Output>(
			`/v2/video_generation/${encodeURIComponent(parsedInput.task_id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		const parsed =
			MinimaxEndpointOutputSchemas.videoCancelOrDeleteV2.parse(response);

		await logEventFromContext(
			ctx,
			'minimax.video.cancelOrDeleteV2',
			{ taskId: parsedInput.task_id, action: parsed.action ?? 'unknown' },
			'completed',
		);

		return parsed;
	};

export const contextIr: MinimaxEndpoints['videoContextIr'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.videoContextIr.parse(input);

	const response = await makeMinimaxRequest<VideoGenerateV2Output>(
		'/v2/h3_context_ir',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.videoContextIr.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.video.contextIr',
		{ model: parsedInput.model, taskId: parsed.task_id },
		'completed',
	);

	return parsed;
};

export const regenerate: MinimaxEndpoints['videoRegenerate'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.videoRegenerate.parse(input);

	const response = await makeMinimaxRequest<VideoGenerateV2Output>(
		'/v2/video_regeneration',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.videoRegenerate.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.video.regenerate',
		{ model: parsedInput.model, taskId: parsed.task_id },
		'completed',
	);

	return parsed;
};

export const templateGenerate: MinimaxEndpoints['videoTemplateGenerate'] =
	async (ctx, input) => {
		const parsedInput =
			MinimaxEndpointInputSchemas.videoTemplateGenerate.parse(input);

		const response = await makeMinimaxRequest<VideoTemplateGenerateOutput>(
			'/v1/video_template_generation',
			ctx.key,
			{ method: 'POST', body: parsedInput },
		);

		const parsed =
			MinimaxEndpointOutputSchemas.videoTemplateGenerate.parse(response);

		await logEventFromContext(
			ctx,
			'minimax.video.templateGenerate',
			{ templateId: parsedInput.template_id, taskId: parsed.task_id },
			'completed',
		);

		return parsed;
	};

export const templateQuery: MinimaxEndpoints['videoTemplateQuery'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MinimaxEndpointInputSchemas.videoTemplateQuery.parse(input);

	const response = await makeMinimaxRequest<VideoTemplateQueryOutput>(
		'/v1/query/video_template_generation',
		ctx.key,
		{ method: 'GET', query: { task_id: parsedInput.task_id } },
	);

	const parsed =
		MinimaxEndpointOutputSchemas.videoTemplateQuery.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.video.templateQuery',
		{ taskId: parsedInput.task_id, status: parsed.status ?? 'unknown' },
		'completed',
	);

	return parsed;
};
