import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { BlackbaudEndpoints } from '..';
import { BlackbaudAPIError, makeBlackbaudRequest } from '../client';
import type { BlackbaudEndpointOutputs } from './types';

export const addGiftsToBatch: BlackbaudEndpoints['addGiftsToBatch'] = async (
	ctx,
	input,
) => {
	let statusCode = 200;
	let responseDetails: BlackbaudEndpointOutputs['addGiftsToBatch']['response_details'] =
		null;
	let succeeded = true;

	try {
		responseDetails = await makeBlackbaudRequest<
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
	} catch (error) {
		succeeded = false;
		if (error instanceof ApiError) {
			statusCode = error.status;
		} else if (error instanceof BlackbaudAPIError && error.statusCode) {
			statusCode = error.statusCode;
		} else {
			statusCode = 500;
		}
		responseDetails = {
			error: error instanceof Error ? error.message : 'Unknown error',
		};
	}

	await logEventFromContext(
		ctx,
		'blackbaud.gifts.add_to_batch',
		{ batch_id: input.batch_id, count: input.gifts.length },
		succeeded ? 'completed' : 'failed',
	);

	return {
		status_code: statusCode,
		response_details: responseDetails,
	};
};
