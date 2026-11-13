import type { MistralAiEndpoints } from '../index';
import { callMistralAi } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const complete: MistralAiEndpoints['fimComplete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.fimComplete.parse(rawInput);
	// Corsair returns one JSON result, so streaming stays off.
	return callMistralAi(ctx, '/v1/fim/completions', {
		method: 'POST',
		body: { ...input, stream: false },
		output: MistralAiEndpointOutputSchemas.fimComplete,
		event: 'fim.complete',
		logged: { model: input.model },
	});
};
