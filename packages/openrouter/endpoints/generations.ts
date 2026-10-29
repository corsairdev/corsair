import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import { cacheGeneration } from './persist';
import type { GetGenerationInput, GetGenerationResponse } from './types';

// GET /generation returns request & usage metadata for a previous generation.
export const getGeneration: OpenRouterEndpoints['generationsGet'] = async (
	ctx,
	input: GetGenerationInput,
) => {
	const result = await makeOpenRouterRequest<GetGenerationResponse>(
		'generation',
		ctx.key,
		{
			query: { id: input.id },
		},
	);

	await cacheGeneration(ctx, result.data);
	return result;
};
