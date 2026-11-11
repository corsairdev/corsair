import type { MistralAiEndpoints } from '../index';
import { callMistralAi } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const create: MistralAiEndpoints['embeddingsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.embeddingsCreate.parse(rawInput);
	return callMistralAi(ctx, '/v1/embeddings', {
		method: 'POST',
		body: input,
		output: MistralAiEndpointOutputSchemas.embeddingsCreate,
		event: 'embeddings.create',
		logged: {
			model: input.model,
			inputs: Array.isArray(input.input) ? input.input.length : 1,
		},
	});
};
