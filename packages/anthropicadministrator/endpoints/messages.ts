import type {
	AnthropicAdministratorContext,
	AnthropicAdministratorEndpoints,
} from '../index';
import { callStandardApi } from './shared';
import type { CacheControl, CreateMessageInput, Message } from './types/index';
import { AnthropicAdministratorEndpointOutputSchemas as OutputSchemas } from './types/index';

/**
 * POST /v1/messages
 *
 * Always non-streaming: the input schema rejects `stream: true` and the body
 * pins `stream: false`, so the response is a single `Message`.
 */
function postMessage(
	ctx: AnthropicAdministratorContext,
	operation: string,
	input: Omit<CreateMessageInput, 'cache_control'>,
	cacheControl: CacheControl | null | undefined,
): Promise<Message> {
	return callStandardApi(
		ctx,
		operation,
		OutputSchemas.createMessage,
		'/v1/messages',
		{
			method: 'POST',
			body: {
				model: input.model,
				max_tokens: input.max_tokens,
				messages: input.messages,
				system: input.system,
				cache_control: cacheControl,
				metadata: input.metadata,
				stop_sequences: input.stop_sequences,
				stream: false,
				temperature: input.temperature,
				top_k: input.top_k,
				top_p: input.top_p,
			},
		},
		{ model: input.model, max_tokens: input.max_tokens },
	);
}

export const createMessage: AnthropicAdministratorEndpoints['createMessage'] =
	async (ctx, input) =>
		postMessage(ctx, 'messages.createMessage', input, input.cache_control);

/**
 * POST /v1/messages with top-level `cache_control`, which places a cache
 * breakpoint on the last cacheable block so the prompt prefix is reused by
 * later calls. `usage.cache_creation_input_tokens` and
 * `usage.cache_read_input_tokens` report the cache write and hit.
 */
export const createCachedMessage: AnthropicAdministratorEndpoints['createCachedMessage'] =
	async (ctx, input) =>
		postMessage(ctx, 'messages.createCachedMessage', input, {
			type: 'ephemeral',
			ttl: input.ttl,
		});
