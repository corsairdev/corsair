import { logEventFromContext } from 'corsair/core';
import type { BotpressEndpoints } from '..';
import { makeBotpressRequest } from '../client';
import type { BotpressEndpointOutputs } from './types';

export const get: BotpressEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeBotpressRequest<
		BotpressEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'botpress.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
