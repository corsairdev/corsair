import { logEventFromContext } from 'corsair/core';
import { makeAimlApiRequest } from '../client';
import type { AimlApiEndpoints } from '../index';
import type { AimlApiEndpointOutputs } from './types';
import { AimlApiEndpointOutputSchemas } from './types';

export const createCompletion: AimlApiEndpoints['chatCreateCompletion'] =
	async (ctx, input) => {
		const response = await makeAimlApiRequest<
			AimlApiEndpointOutputs['chatCreateCompletion']
		>(`/v1/chat/completions`, ctx.key, {
			schema: AimlApiEndpointOutputSchemas.chatCreateCompletion,
			method: 'POST',
			body: {
				model: input.model,
				messages: input.messages,
				max_tokens: input.maxTokens,
				temperature: input.temperature,
				top_p: input.topP,
				frequency_penalty: input.frequencyPenalty,
				presence_penalty: input.presencePenalty,
				stop: input.stop,
				tools: input.tools,
				tool_choice: input.toolChoice,
				response_format: input.responseFormat,
				seed: input.seed,
				n: input.n,
			},
		});

		await logEventFromContext(
			ctx,
			'aimlapi.api.chat.createCompletion',
			{ model: input.model, messageCount: input.messages.length },
			'completed',
		);

		return response;
	};
