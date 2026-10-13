import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

// Gift API: POST /gift/v1/giftbatches/{batch_id}/gifts
export const addGiftsToBatch: BlackbaudEndpoints['addGiftsToBatch'] = async (
	ctx,
	input,
) => {
	const response = await makeBlackbaudRequest<
		BlackbaudEndpointOutputs['addGiftsToBatch']
	>(
		`gift/v1/giftbatches/${encodeURIComponent(input.batch_id)}/gifts`,
		ctx.key,
		{
			method: 'POST',
			body: { gifts: input.gifts },
			subscriptionKey: ctx.options.subscriptionKey,
		},
	);

	if (ctx.db.batchGifts) {
		for (const gift of response.gifts ?? []) {
			if (!gift.id) continue;
			try {
				await ctx.db.batchGifts.upsertByEntityId(gift.id, {
					...gift,
					id: gift.id,
					batch_id: gift.batch_id ?? input.batch_id,
				});
			} catch (error) {
				console.warn('Failed to save batch gift to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'blackbaud.gifts.add_to_batch',
		{ batch_id: input.batch_id, count: input.gifts.length },
		'completed',
	);
	return response;
};
