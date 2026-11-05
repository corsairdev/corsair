import { logEventFromContext } from 'corsair/core';
import type { MinimaxEndpoints } from '..';
import { makeMinimaxRequest } from '../client';
import type { ImageGenerateOutput } from './types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './types';

export const generate: MinimaxEndpoints['imageGenerate'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.imageGenerate.parse(input);

	const response = await makeMinimaxRequest<ImageGenerateOutput>(
		'/v1/image_generation',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.imageGenerate.parse(response);

	const count =
		parsed.data?.image_urls?.length ??
		parsed.data?.image_base64?.length ??
		parsed.metadata?.success_count ??
		0;

	// The prompt is user content; only the model and the number of images are
	// logged (never the image data itself).
	await logEventFromContext(
		ctx,
		'minimax.image.generate',
		{ model: parsedInput.model, count },
		'completed',
	);

	return parsed;
};
