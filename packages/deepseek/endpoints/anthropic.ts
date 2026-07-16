import { logEventFromContext } from 'corsair/core';
import { makeDeepseekRequest } from '../client';
import type { DeepseekEndpoints } from '../index';
import type { AnthropicCreateMessageResponse } from '../schema/anthropic';

// Streaming is not exposed here for the same reason as chat.createCompletion:
// corsair/http's request() helper only parses JSON responses, so this always
// requests the non-streaming response shape.
export const createMessage: DeepseekEndpoints['anthropicCreateMessage'] =
	async (ctx, input) => {
		const result = await makeDeepseekRequest<AnthropicCreateMessageResponse>(
			'anthropic/v1/messages',
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

		await logEventFromContext(
			ctx,
			'deepseek.anthropic.createMessage',
			{ model: input.model },
			'completed',
		);
		return result;
	};
