import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import type { CreateChatCompletionResponse } from './types';

// Streaming is not exposed here: this endpoint always returns a single typed
// JSON response, and corsair/http's request() helper does not parse
// text/event-stream bodies, so the API is always called with stream: false.
export const createChatCompletion: OpenRouterEndpoints['chatCompletionsCreate'] =
	async (ctx, input) => {
		const result = await makeOpenRouterRequest<CreateChatCompletionResponse>(
			'chat/completions',
			ctx.key,
			{
				method: 'POST',
				body: {
					model: input.model,
					messages: input.messages,
					stream: false,
					temperature: input.temperature,
					top_p: input.topP,
					max_tokens: input.maxTokens,
					max_completion_tokens: input.maxCompletionTokens,
					n: input.n,
					stop: input.stop,
					presence_penalty: input.presencePenalty,
					frequency_penalty: input.frequencyPenalty,
					logit_bias: input.logitBias,
					user: input.user,
					response_format: input.responseFormat,
					tools: input.tools,
					tool_choice: input.toolChoice,
					reasoning: input.reasoning,
					transforms: input.transforms,
					models: input.models,
					route: input.route,
					provider: input.provider,
					plugins: input.plugins,
				},
			},
		);

		return result;
	};
