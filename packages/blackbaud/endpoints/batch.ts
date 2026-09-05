import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

export const addGiftsToBatch: BlackbaudEndpoints['addGiftsToBatch'] = async (
	ctx,
	input,
) => {
	try {
		const responseDetails = await makeBlackbaudRequest<
			BlackbaudEndpointOutputs['addGiftsToBatch']['response_details']
		>(
			`gift/v1/giftbatches/${encodeURIComponent(input.batch_id)}/gifts`,
			ctx.key,
			{
				method: 'POST',
				body: { gifts: input.gifts },
				subscriptionKey: ctx.options.subscriptionKey,
			},
		);

		await logEventFromContext(
			ctx,
			'blackbaud.gifts.add_to_batch',
			{ batch_id: input.batch_id, count: input.gifts.length },
			'completed',
		);

		return {
			status_code: 200,
			response_details: responseDetails,
		};
	} catch (error) {
		// Record the failure, then rethrow so the shared endpoint binder can
		// apply error-handlers.ts (429 retries, auth handling). Swallowing the
		// error here would bypass rate-limit retries.
		await logEventFromContext(
			ctx,
			'blackbaud.gifts.add_to_batch',
			{ batch_id: input.batch_id, count: input.gifts.length },
			'failed',
		);
		throw error;
	}
};
