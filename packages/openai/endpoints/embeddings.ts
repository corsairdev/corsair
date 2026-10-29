import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type { EmbeddingsCreateResponse } from '../schema/embeddings';

export const create: OpenaiEndpoints['embeddingsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<EmbeddingsCreateResponse>(
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
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.embeddings.create',
		{ model: input.model },
		'completed',
	);
	return result;
};
