import type { MistralAiEndpoints } from '../index';
import { callMistralAi } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

export const moderate: MistralAiEndpoints['classifiersModerate'] = async (
	ctx,
	rawInput,
) => {
	const input =
		MistralAiEndpointInputSchemas.classifiersModerate.parse(rawInput);
	return callMistralAi(ctx, '/v1/moderations', {
		method: 'POST',
		body: input,
		output: MistralAiEndpointOutputSchemas.classifiersModerate,
		event: 'classifiers.moderate',
		logged: { model: input.model },
	});
};

export const moderateChat: MistralAiEndpoints['classifiersModerateChat'] =
	async (ctx, rawInput) => {
		const input =
			MistralAiEndpointInputSchemas.classifiersModerateChat.parse(rawInput);
		return callMistralAi(ctx, '/v1/chat/moderations', {
			method: 'POST',
			body: input,
			output: MistralAiEndpointOutputSchemas.classifiersModerateChat,
			event: 'classifiers.moderateChat',
			logged: { model: input.model },
		});
	};

export const classify: MistralAiEndpoints['classifiersClassify'] = async (
	ctx,
	rawInput,
) => {
	const input =
		MistralAiEndpointInputSchemas.classifiersClassify.parse(rawInput);
	return callMistralAi(ctx, '/v1/classifications', {
		method: 'POST',
		body: input,
		output: MistralAiEndpointOutputSchemas.classifiersClassify,
		event: 'classifiers.classify',
		logged: { model: input.model },
	});
};

export const classifyChat: MistralAiEndpoints['classifiersClassifyChat'] =
	async (ctx, rawInput) => {
		const input =
			MistralAiEndpointInputSchemas.classifiersClassifyChat.parse(rawInput);
		return callMistralAi(ctx, '/v1/chat/classifications', {
			method: 'POST',
			body: input,
			output: MistralAiEndpointOutputSchemas.classifiersClassifyChat,
			event: 'classifiers.classifyChat',
			logged: { model: input.model },
		});
	};
