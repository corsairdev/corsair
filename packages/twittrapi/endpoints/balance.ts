import { logEventFromContext } from 'corsair/core';
import { makeTwittrApiRequest } from '../client';
import type { TwittrApiEndpoints } from '../index';
import type { TwittrApiEndpointOutputs } from './types';

export const get: TwittrApiEndpoints['balanceGet'] = async (ctx, _input) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['balanceGet']
	>('/balance', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'twittrapi.balance.get', {}, 'completed');
	return response;
};
