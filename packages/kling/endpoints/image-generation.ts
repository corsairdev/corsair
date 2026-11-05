import type { KlingEndpoints } from '..';
import { createTask, getV1TaskById, listTasksByPage } from './tasks';
import { ImageGenerationCreateInputSchema } from './types';

// Text to image / image to image (legacy /v1 API; one endpoint serves both, so
// omitting `image` is text-to-image and supplying it is image-to-image):
// POST /v1/images/generations
// GET  /v1/images/generations/{id}
// GET  /v1/images/generations?pageNum&pageSize
// https://kling.ai/document-api/api/image/2-1/image-generation
// https://kling.ai/document-api/api/image/3-0-omni/image-generation

const PATH = '/v1/images/generations';

export const imageGenerationCreate: KlingEndpoints['imageGeneration']['create'] =
	async (ctx, input) => {
		const parsed = ImageGenerationCreateInputSchema.parse(input);

		return createTask(ctx, 'kling.imageGeneration.create', PATH, parsed, {
			modelName: parsed.model_name,
		});
	};

export const imageGenerationGet: KlingEndpoints['imageGeneration']['get'] = (
	ctx,
	input,
) => getV1TaskById(ctx, 'kling.imageGeneration.get', PATH, input);

export const imageGenerationList: KlingEndpoints['imageGeneration']['list'] = (
	ctx,
	input,
) => listTasksByPage(ctx, 'kling.imageGeneration.list', PATH, input);
