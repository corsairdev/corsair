import type { KlingEndpoints } from '..';
import { createTask, getV1TaskById, listTasksByPage } from './tasks';
import { VideoEffectsCreateInputSchema } from './types';

// Video effects (219 single- and dual-image scenes):
// POST /v1/videos/effects
// GET  /v1/videos/effects/{id}
// GET  /v1/videos/effects?pageNum&pageSize
// https://kling.ai/document-api/api/effects/video-effects

const PATH = '/v1/videos/effects';

export const videoEffectsCreate: KlingEndpoints['videoEffects']['create'] =
	async (ctx, input) => {
		const parsed = VideoEffectsCreateInputSchema.parse(input);

		return createTask(ctx, 'kling.videoEffects.create', PATH, parsed, {
			effectScene: parsed.effect_scene,
		});
	};

export const videoEffectsGet: KlingEndpoints['videoEffects']['get'] = (
	ctx,
	input,
) => getV1TaskById(ctx, 'kling.videoEffects.get', PATH, input);

export const videoEffectsList: KlingEndpoints['videoEffects']['list'] = (
	ctx,
	input,
) => listTasksByPage(ctx, 'kling.videoEffects.list', PATH, input);
