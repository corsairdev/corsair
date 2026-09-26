import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

export const getGiftById: BlackbaudEndpoints['getGiftById'] = async (
	ctx,
	input,
) => {
	const response = await makeBlackbaudRequest<
		BlackbaudEndpointOutputs['getGiftById']
	>(`gift/v1/gifts/${encodeURIComponent(input.gift_id)}`, ctx.key, {
		method: 'GET',
		subscriptionKey: ctx.options.subscriptionKey,
	});

	await logEventFromContext(
		ctx,
		'blackbaud.gifts.get',
		{ gift_id: input.gift_id },
		'completed',
	);
	return response;
};
