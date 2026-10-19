import type { KlingEndpoints } from '..';
import { createTask, getTaskById, listTasksByCursor } from './tasks';
import {
	ImageToVideoCreateInputSchema,
	KlingTaskListInputSchema,
} from './types';

// Image to video. One endpoint per model version:
// POST /image-to-video/{model}
// https://kling.ai/document-api/api/video/2-5-turbo/image-to-video
// https://kling.ai/document-api/api/video/2-6/image-to-video
// https://kling.ai/document-api/api/video/3-0-omni/image-to-video
// https://kling.ai/document-api/api/video/3-0-turbo/image-to-video
// Querying is shared via `/tasks`.

export const imageToVideoCreate: KlingEndpoints['imageToVideo']['create'] =
	async (ctx, input) => {
		const parsed = ImageToVideoCreateInputSchema.parse(input);

		const { model, ...body } = parsed;

		return createTask(
			ctx,
			'kling.imageToVideo.create',
			`/image-to-video/${model}`,
			body,
			{ model },
		);
	};

export const imageToVideoGet: KlingEndpoints['imageToVideo']['get'] = (
	ctx,
	input,
) => getTaskById(ctx, 'kling.imageToVideo.get', '/tasks', input);

export const imageToVideoList: KlingEndpoints['imageToVideo']['list'] = (
	ctx,
	input,
) =>
	listTasksByCursor(
		ctx,
		'kling.imageToVideo.list',
		'/tasks',
		input,
		KlingTaskListInputSchema,
	);
