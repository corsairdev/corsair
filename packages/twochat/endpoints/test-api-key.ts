import { logEventFromContext } from 'corsair/core';
import { makeTwoChatRequest } from '../client';
import type { TwoChatContext } from '../index';
import { cacheAccount } from './persist';
import type { TwoChatEndpointOutputs } from './types';

export const testApiKey = async (
	ctx: TwoChatContext & { key: string },
	_input: Record<string, never>,
): Promise<TwoChatEndpointOutputs['testApiKey']> => {
	const response = await makeTwoChatRequest<
		TwoChatEndpointOutputs['testApiKey']
	>('open/info', ctx.key, { method: 'GET' });

	await cacheAccount(
		ctx,
		response.account,
		response.limits?.requests_per_minute,
	);
	await logEventFromContext(ctx, 'twochat.account.testApiKey', {}, 'completed');

	return response;
};
