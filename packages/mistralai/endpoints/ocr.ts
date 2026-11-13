import type { MistralAiEndpoints } from '../index';
import { callMistralAi } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const processDocument: MistralAiEndpoints['ocrProcess'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.ocrProcess.parse(rawInput);
	return callMistralAi(ctx, '/v1/ocr', {
		method: 'POST',
		body: input,
		output: MistralAiEndpointOutputSchemas.ocrProcess,
		event: 'ocr.process',
		logged: { model: input.model, document: input.document.type },
	});
};
