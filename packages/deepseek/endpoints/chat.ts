import { logEventFromContext } from 'corsair/core';
import { makeDeepseekRequest } from '../client';
import type { DeepseekEndpoints } from '../index';
import type { ChatCreateCompletionResponse } from '../schema/chat';

// Streaming is not exposed here: this endpoint always returns a single typed
// JSON response, and corsair/http's request() helper does not parse
// text/event-stream bodies, so the API is always called with stream: false.
export const createCompletion: DeepseekEndpoints['chatCreateCompletion'] =
	async (ctx, input) => {
		const result = await makeDeepseekRequest<ChatCreateCompletionResponse>(
			'chat/completions',
			ctx.key,
			{
				method: 'POST',
				body: {
					model: input.model,
					messages: input.messages,
					frequency_penalty: input.frequencyPenalty,
					max_tokens: input.maxTokens,
					presence_penalty: input.presencePenalty,
					response_format: input.responseFormat,
					stop: input.stop,
					temperature: input.temperature,
					top_p: input.topP,
					tools: input.tools,
					tool_choice: input.toolChoice,
					logprobs: input.logprobs,
					top_logprobs: input.topLogprobs,
					stream: false,
				},
			},
		);

		await logEventFromContext(
			ctx,
			'deepseek.chat.createCompletion',
			{ model: input.model },
			'completed',
		);
		return result;
	};
