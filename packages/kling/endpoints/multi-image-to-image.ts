import type { KlingEndpoints } from '..';
import { createTask, getV1TaskById, listTasksByPage } from './tasks';
import { MultiImageToImageCreateInputSchema } from './types';

// Multi-image to image (subject + scene + style composite):
// POST /v1/images/multi-image2image
// GET  /v1/images/multi-image2image/{id}
// GET  /v1/images/multi-image2image?pageNum&pageSize
// https://kling.ai/document-api/api/image/2-1/multi-image-to-image

const PATH = '/v1/images/multi-image2image';

export const multiImageToImageCreate: KlingEndpoints['multiImageToImage']['create'] =
	async (ctx, input) => {
		const parsed = MultiImageToImageCreateInputSchema.parse(input);

		return createTask(ctx, 'kling.multiImageToImage.create', PATH, parsed, {
			modelName: parsed.model_name,
		});
	};

export const multiImageToImageGet: KlingEndpoints['multiImageToImage']['get'] =
	(ctx, input) =>
		getV1TaskById(ctx, 'kling.multiImageToImage.get', PATH, input);

export const multiImageToImageList: KlingEndpoints['multiImageToImage']['list'] =
	(ctx, input) =>
		listTasksByPage(ctx, 'kling.multiImageToImage.list', PATH, input);
