import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import type { CreateEmbeddingOutput } from './types';

export const createEmbedding: OpenRouterEndpoints['embeddingsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenRouterRequest<CreateEmbeddingOutput>(
		'embeddings',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				input: input.input,
				encoding_format: input.encodingFormat,
				dimensions: input.dimensions,
				user: input.user,
				input_type: input.inputType,
				provider: input.provider,
			},
		},
	);

	return result;
};
