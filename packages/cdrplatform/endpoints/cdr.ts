import { logEventFromContext } from 'corsair/core';
import type { CdrPlatformEndpoints } from '..';
import { makeCdrPlatformRequest } from '../client';
import {
	CdrPlatformEndpointInputSchemas,
	CdrPlatformEndpointOutputSchemas,
} from './types';

export const price: CdrPlatformEndpoints['price'] = async (ctx, input) => {
	const parsedInput = CdrPlatformEndpointInputSchemas.price.parse(input);
	const rawResponse = await makeCdrPlatformRequest('v1/cdr/price/', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const response = CdrPlatformEndpointOutputSchemas.price.parse(rawResponse);

	await logEventFromContext(ctx, 'cdrplatform.price', parsedInput, 'completed');

	return response;
};

export const purchase: CdrPlatformEndpoints['purchase'] = async (
	ctx,
	input,
) => {
	const parsedInput = CdrPlatformEndpointInputSchemas.purchase.parse(input);
	const rawResponse = await makeCdrPlatformRequest('v1/cdr/', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const response = CdrPlatformEndpointOutputSchemas.purchase.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'cdrplatform.purchase',
		{
			client_reference_id: parsedInput.client_reference_id,
			currency: parsedInput.currency,
			items: parsedInput.items,
			transaction_uuid: response.transaction_uuid,
			weight_unit: parsedInput.weight_unit,
		},
		'completed',
	);

	return response;
};
