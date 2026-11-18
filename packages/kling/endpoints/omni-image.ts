import type { KlingEndpoints } from '..';
import { createTask, getV1TaskById, listTasksByPage } from './tasks';
import { OmniImageCreateInputSchema } from './types';

// Omni image generation (prompt with @image / element references):
// POST /v1/images/omni-image
// GET  /v1/images/omni-image/{id}
// GET  /v1/images/omni-image?pageNum&pageSize
// https://kling.ai/document-api/api/image/o1/image-generation
// https://kling.ai/document-api/api/image/3-0-omni/image-omni

const PATH = '/v1/images/omni-image';

export const omniImageCreate: KlingEndpoints['omniImage']['create'] = async (
	ctx,
	input,
) => {
	const parsed = OmniImageCreateInputSchema.parse(input);

	return createTask(ctx, 'kling.omniImage.create', PATH, parsed, {
		modelName: parsed.model_name,
	});
};

export const omniImageGet: KlingEndpoints['omniImage']['get'] = (ctx, input) =>
	getV1TaskById(ctx, 'kling.omniImage.get', PATH, input);

export const omniImageList: KlingEndpoints['omniImage']['list'] = (
	ctx,
	input,
) => listTasksByPage(ctx, 'kling.omniImage.list', PATH, input);
