import { logEventFromContext } from 'corsair/core';
import { makeApipieRequest } from '../client';
import type { ApipieEndpoints } from '../index';
import type { ApipieEndpointOutputs } from './types';
import { ApipieEndpointOutputSchemas } from './types';

export const createCompletion: ApipieEndpoints['chatCreateCompletion'] = async (
	ctx,
	input,
) => {
	const response = await makeApipieRequest<
		ApipieEndpointOutputs['chatCreateCompletion']
	>(`/v1/chat/completions`, ctx.key, {
		schema: ApipieEndpointOutputSchemas.chatCreateCompletion,
		method: 'POST',
		body: {
			model: input.model,
			messages: input.messages,
			provider: input.provider,
			routing: input.routing,
			max_tokens: input.maxTokens,
			temperature: input.temperature,
			top_p: input.topP,
			top_k: input.topK,
			frequency_penalty: input.frequencyPenalty,
			presence_penalty: input.presencePenalty,
			stop: input.stop,
			stream: input.stream,
			n: input.n,
			memory: input.memory,
			mem_session: input.memSession,
			mem_expire: input.memExpire,
			mem_clear: input.memClear,
			integrity: input.integrity,
			integrity_model: input.integrityModel,
		},
	});

	await logEventFromContext(
		ctx,
		'apipie.api.chat.createCompletion',
		{ model: input.model, messageCount: input.messages.length },
		'completed',
	);

	return response;
};
