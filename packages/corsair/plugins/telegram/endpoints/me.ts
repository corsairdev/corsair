import { logEventFromContext } from '../../utils/events';
import type { TelegramEndpoints } from '..';
import { makeTelegramRequest } from '../client';
import type { TelegramEndpointOutputs } from './types';

export const getMe: TelegramEndpoints['getMe'] = async (ctx) => {
	const result = await makeTelegramRequest<TelegramEndpointOutputs['getMe']>(
		'getMe',
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'telegram.me.getMe',
		{},
		'completed',
	);
	return result;
};
