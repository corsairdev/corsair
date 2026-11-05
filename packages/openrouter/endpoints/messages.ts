import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import type { CreateAnthropicMessageResponse } from './types';

// Streaming is not exposed here: this endpoint always returns a single typed
// JSON response, and corsair/http's request() helper does not parse
// text/event-stream bodies, so the API is always called with stream: false.
export const createAnthropicMessage: OpenRouterEndpoints['messagesCreate'] =
	async (ctx, input) => {
		const result = await makeOpenRouterRequest<CreateAnthropicMessageResponse>(
			'messages',
			ctx.key,
			{
				method: 'POST',
				body: {
					model: input.model,
					max_tokens: input.maxTokens,
					messages: input.messages,
					system: input.system,
					temperature: input.temperature,
					top_p: input.topP,
					stop_sequences: input.stopSequences,
					stream: false,
					tools: input.tools,
					tool_choice: input.toolChoice,
					thinking: input.thinking,
				},
			},
		);

		return result;
	};
