import { logEventFromContext } from 'corsair/core';
import { makeTwoChatRequest } from '../client';
import type { TwoChatContext } from '../index';
import { cacheWebhooks } from './persist';
import type { TwoChatEndpointOutputs } from './types';

export const listWebhooks = async (
	ctx: TwoChatContext & { key: string },
	_input: Record<string, never>,
): Promise<TwoChatEndpointOutputs['listWebhooks']> => {
	const response = await makeTwoChatRequest<
		TwoChatEndpointOutputs['listWebhooks']
	>('open/webhooks', ctx.key, { method: 'GET' });

	await cacheWebhooks(ctx, response.webhooks);
	await logEventFromContext(
		ctx,
		'twochat.webhooks.listWebhooks',
		{},
		'completed',
	);

	return response;
};
