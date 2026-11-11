import type { MistralAiEndpoints } from '../index';
import { callMistralAi } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const create: MistralAiEndpoints['responsesCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.responsesCreate.parse(rawInput);
	// One JSON result, nothing stored on Mistral's side: the only values the
	// spec accepts for `store` and `background` are false.
	return callMistralAi(ctx, '/v1/responses', {
		method: 'POST',
		body: { ...input, stream: false },
		output: MistralAiEndpointOutputSchemas.responsesCreate,
		event: 'responses.create',
		logged: { model: input.model },
	});
};

export const countInputTokens: MistralAiEndpoints['responsesCountInputTokens'] =
	async (ctx, rawInput) => {
		const input =
			MistralAiEndpointInputSchemas.responsesCountInputTokens.parse(rawInput);
		return callMistralAi(ctx, '/v1/responses/input_tokens', {
			method: 'POST',
			body: input,
			output: MistralAiEndpointOutputSchemas.responsesCountInputTokens,
			event: 'responses.countInputTokens',
			logged: { model: input.model },
		});
	};
