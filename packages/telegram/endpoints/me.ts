import { logEventFromContext } from 'corsair/core';
import { makeTelegramRequest } from '../client';
import type { TelegramEndpoints } from '../index';
import type { TelegramEndpointOutputs } from './types';

export const getMe: TelegramEndpoints['getMe'] = async (ctx) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['getMe']>(
		'getMe',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'telegram.me.getMe', {}, 'completed');
	return result;
};
