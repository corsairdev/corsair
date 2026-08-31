import type { AnthropicAdministratorEndpoints } from '../index';
import { callAdminApi, compact } from './shared';
import type { AnthropicAdministratorEndpointOutputs as Outputs } from './types/index';

export const MessagesEndpoints: Pick<
	AnthropicAdministratorEndpoints,
	'createMessage'
> = {
	createMessage: async (ctx, input) => {
		const payload = compact({
			model: input.model,
			messages: input.messages,
			max_tokens: input.max_tokens,
			system: input.system,
			metadata: input.metadata,
			stop_sequences: input.stop_sequences,
			stream: input.stream,
			temperature: input.temperature,
			top_k: input.top_k,
			top_p: input.top_p,
		});

		return callAdminApi<Outputs['createMessage']>(
			ctx,
			'messages.createMessage',
			'/v1/messages',
			{ method: 'POST', body: payload },
			{ model: input.model },
		);
	},
};
