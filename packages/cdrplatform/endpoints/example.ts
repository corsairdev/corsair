import { logEventFromContext } from 'corsair/core';
import type { CdrPlatformEndpoints } from '..';
import { makeCdrPlatformRequest } from '../client';
import type {
	CdrPlatformEndpointOutputs,
	PriceInput,
	PurchaseInput,
} from './types';

export const price: CdrPlatformEndpoints['price'] = async (
	ctx,
	input: PriceInput,
) => {
	const response = await makeCdrPlatformRequest<
		CdrPlatformEndpointOutputs['price']
	>('v1/cdr/price/', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'cdrplatform.price',
		{ ...input },
		'completed',
	);

	return response;
};

export const purchase: CdrPlatformEndpoints['purchase'] = async (
	ctx,
	input: PurchaseInput,
) => {
	const response = await makeCdrPlatformRequest<
		CdrPlatformEndpointOutputs['purchase']
	>('v1/cdr/', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'cdrplatform.purchase',
		{
			...input,
			// Avoid logging sensitive or unnecessary credentials.
		},
		'completed',
	);

	return response;
};
