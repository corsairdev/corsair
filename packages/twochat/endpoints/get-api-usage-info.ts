import { logEventFromContext } from 'corsair/core';
import { makeTwoChatRequest } from '../client';
import type { TwoChatContext } from '../index';
import { cacheAccount } from './persist';
import type { TwoChatEndpointOutputs } from './types';

export const getApiUsageInfo = async (
	ctx: TwoChatContext & { key: string },
	_input: Record<string, never>,
): Promise<TwoChatEndpointOutputs['getApiUsageInfo']> => {
	const response = await makeTwoChatRequest<
		TwoChatEndpointOutputs['getApiUsageInfo']
	>('open/info', ctx.key, { method: 'GET' });

	await cacheAccount(
		ctx,
		response.account,
		response.limits?.requests_per_minute,
	);
	await logEventFromContext(
		ctx,
		'twochat.account.getApiUsageInfo',
		{},
		'completed',
	);

	return response;
};
