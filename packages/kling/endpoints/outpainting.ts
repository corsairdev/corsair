import type { KlingEndpoints } from '..';
import { createTask, getV1TaskById, listTasksByPage } from './tasks';
import { OutpaintingCreateInputSchema } from './types';

// Outpainting (expand an image in any direction):
// POST /v1/images/editing/expand
// GET  /v1/images/editing/expand/{id}
// GET  /v1/images/editing/expand?pageNum&pageSize
// https://kling.ai/document-api/api/image/common/outpainting

const PATH = '/v1/images/editing/expand';

export const outpaintingCreate: KlingEndpoints['outpainting']['create'] =
	async (ctx, input) => {
		const parsed = OutpaintingCreateInputSchema.parse(input);

		return createTask(ctx, 'kling.outpainting.create', PATH, parsed, {});
	};

export const outpaintingGet: KlingEndpoints['outpainting']['get'] = (
	ctx,
	input,
) => getV1TaskById(ctx, 'kling.outpainting.get', PATH, input);

export const outpaintingList: KlingEndpoints['outpainting']['list'] = (
	ctx,
	input,
) => listTasksByPage(ctx, 'kling.outpainting.list', PATH, input);
