import { logEventFromContext } from 'corsair/core';
import { makeOpenaiRequest } from '../client';
import type { OpenaiEndpoints } from '../index';
import type { ChatCreateCompletionResponse } from '../schema/chat';

export const createCompletion: OpenaiEndpoints['chatCreateCompletion'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<ChatCreateCompletionResponse>(
		'chat/completions',
		ctx.key,
		{
			method: 'POST',
			body: {
				model: input.model,
				messages: input.messages,
				frequency_penalty: input.frequencyPenalty,
				logit_bias: input.logitBias,
				logprobs: input.logprobs,
				top_logprobs: input.topLogprobs,
				max_completion_tokens: input.maxCompletionTokens,
				n: input.n,
				presence_penalty: input.presencePenalty,
				response_format: input.responseFormat,
				seed: input.seed,
				service_tier: input.serviceTier,
				stop: input.stop,
				store: input.store,
				metadata: input.metadata,
				temperature: input.temperature,
				top_p: input.topP,
				tools: input.tools,
				tool_choice: input.toolChoice,
				parallel_tool_calls: input.parallelToolCalls,
				reasoning_effort: input.reasoningEffort,
				user: input.user,
				stream: false,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.chat.createCompletion',
		{ model: input.model },
		'completed',
	);
	return result;
};
