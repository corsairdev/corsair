import type { KlingEndpoints } from '..';
import { createTask, getTaskById, listTasksByCursor } from './tasks';
import { OmniVideoCreateInputSchema } from './types';

// Omni video generation. One endpoint per model:
// POST /omni-video/kling-3.0-omni
// POST /omni-video/kling-o1
// https://kling.ai/document-api/api/video/3-0-omni/video-omni
// https://kling.ai/document-api/api/video/o1/video-omni
// Querying is shared via `/tasks`.

export const omniVideoCreate: KlingEndpoints['omniVideo']['create'] = async (
	ctx,
	input,
) => {
	const parsed = OmniVideoCreateInputSchema.parse(input);

	const { model, ...body } = parsed;

	return createTask(
		ctx,
		'kling.omniVideo.create',
		`/omni-video/${model}`,
		body,
		{
			model,
		},
	);
};

export const omniVideoGet: KlingEndpoints['omniVideo']['get'] = (ctx, input) =>
	getTaskById(ctx, 'kling.omniVideo.get', '/tasks', input);

export const omniVideoList: KlingEndpoints['omniVideo']['list'] = (
	ctx,
	input,
) => listTasksByCursor(ctx, 'kling.omniVideo.list', '/tasks', input);
