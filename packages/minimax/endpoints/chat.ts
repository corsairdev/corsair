import { logEventFromContext } from 'corsair/core';
import { makeMiniMaxRequest } from '../client';
import { resolveMiniMaxBaseUrls } from '../config';
import type { MiniMaxEndpoints } from '../index';
import type { ChatCreateCompletionResponse } from '../schema/chat';

export const createCompletion: MiniMaxEndpoints['chatCreateCompletion'] =
	async (ctx, input) => {
		const { openaiBaseUrl } = resolveMiniMaxBaseUrls(ctx.options);
		const result = await makeMiniMaxRequest<ChatCreateCompletionResponse>(
			openaiBaseUrl,
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

		await logEventFromContext(ctx, 'minimax.chat.createCompletion', { model: input.model }, 'completed');
		return result;
	};