import { logEventFromContext } from 'corsair/core';
import type { BlackbaudEndpoints } from '..';
import { makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

export const addGiftsToBatch: BlackbaudEndpoints['addGiftsToBatch'] = async (
	ctx,
	input,
) => {
	let statusCode = 200;
	let responseDetails: any = null;

	try {
		responseDetails = await makeBlackbaudRequest<any>(
			`gift/v1/giftbatches/${input.batch_id}/gifts`,
			ctx.key,
			{
				method: 'POST',
				body: { gifts: input.gifts },
				subscriptionKey: ctx.options.subscriptionKey,
			},
		);
	} catch (error: any) {
		statusCode = error.statusCode || 500;
		responseDetails = { error: error.message };
	}

	await logEventFromContext(
		ctx,
		'blackbaud.gifts.add_to_batch',
		{ batch_id: input.batch_id, count: input.gifts.length },
		'completed',
	);

	return {
		status_code: statusCode,
		response_details: responseDetails,
	};
};
