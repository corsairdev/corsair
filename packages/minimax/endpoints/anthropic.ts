import { logEventFromContext } from 'corsair/core';
import { makeMiniMaxRequest } from '../client';
import { resolveMiniMaxBaseUrls } from '../config';
import type { MiniMaxEndpoints } from '../index';
import type { AnthropicCreateMessageResponse } from '../schema/anthropic';

export const createMessage: MiniMaxEndpoints['anthropicCreateMessage'] =
	async (ctx, input) => {
		const { anthropicBaseUrl } = resolveMiniMaxBaseUrls(ctx.options);
		const result = await makeMiniMaxRequest<AnthropicCreateMessageResponse>(
			anthropicBaseUrl,
			'v1/messages',
			ctx.key,
			{
				method: 'POST',
				body: {
					model: input.model,
					max_tokens: input.maxTokens,
					messages: input.messages,
					system: input.system,
					stop_sequences: input.stopSequences,
					temperature: input.temperature,
					top_p: input.topP,
					top_k: input.topK,
					tools: input.tools,
					tool_choice: input.toolChoice,
					thinking: input.thinking,
					metadata: input.metadata,
					stream: false,
				},
			},
		);

		await logEventFromContext(ctx, 'minimax.anthropic.createMessage', { model: input.model }, 'completed');
		return result;
	};