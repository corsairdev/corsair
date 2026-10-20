import type { KlingEndpoints } from '..';
import { createTask, getTaskById, listTasksByCursor } from './tasks';
import {
	KlingTaskListInputSchema,
	TextToVideoCreateInputSchema,
} from './types';

// Text to video. One endpoint per model version, so the model is a path
// segment and is exposed as an enum on a single create operation:
// POST /text-to-video/{model}
// https://kling.ai/document-api/api/video/2-5-turbo/text-to-video
// https://kling.ai/document-api/api/video/2-6/text-to-video
// https://kling.ai/document-api/api/video/3-0-omni/text-to-video
// https://kling.ai/document-api/api/video/3-0-turbo/text-to-video
// Querying is shared across all models via the platform-wide `/tasks` endpoint.

export const textToVideoCreate: KlingEndpoints['textToVideo']['create'] =
	async (ctx, input) => {
		const parsed = TextToVideoCreateInputSchema.parse(input);

		// `model` selects the path; the rest is the documented request body.
		const { model, ...body } = parsed;

		return createTask(
			ctx,
			'kling.textToVideo.create',
			`/text-to-video/${model}`,
			body,
			{ model },
		);
	};

export const textToVideoGet: KlingEndpoints['textToVideo']['get'] = (
	ctx,
	input,
) => getTaskById(ctx, 'kling.textToVideo.get', '/tasks', input);

export const textToVideoList: KlingEndpoints['textToVideo']['list'] = (
	ctx,
	input,
) =>
	listTasksByCursor(
		ctx,
		'kling.textToVideo.list',
		'/tasks',
		input,
		KlingTaskListInputSchema,
	);
