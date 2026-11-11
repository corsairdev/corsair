import type { MistralAiEndpoints } from '../index';
import { callMistralAi } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const complete: MistralAiEndpoints['chatComplete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.chatComplete.parse(rawInput);
	// Corsair returns one JSON result, so streaming stays off.
	return callMistralAi(ctx, '/v1/chat/completions', {
		method: 'POST',
		body: { ...input, stream: false },
		output: MistralAiEndpointOutputSchemas.chatComplete,
		event: 'chat.complete',
		logged: { model: input.model },
	});
};
