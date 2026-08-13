import { logEventFromContext } from 'corsair/core';
import { makeTwoChatRequest } from '../client';
import type { TwoChatContext } from '../index';
import type { TwoChatEndpointOutputs } from './types';

export const getApiUsageInfo = async (
	ctx: TwoChatContext & { key: string },
	_input: Record<string, never>,
): Promise<TwoChatEndpointOutputs['getApiUsageInfo']> => {
	const response = await makeTwoChatRequest<
		TwoChatEndpointOutputs['getApiUsageInfo']
	>('open/info', ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'twochat.account.getApiUsageInfo',
		{},
		'completed',
	);

	return response;
};
