import { logEventFromContext } from 'corsair/core';
import type { GiftUpEndpoints } from '..';
import type { GiftUpEndpointOutputs } from './types';
import { makeGiftUpRequest } from '../client';

export const get: GiftUpEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeGiftUpRequest<GiftUpEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'giftup.example.get', { ...input }, 'completed');
	return response;
};
