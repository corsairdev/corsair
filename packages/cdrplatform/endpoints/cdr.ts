import { logEventFromContext } from 'corsair/core';
import type { CdrPlatformEndpoints } from '..';
import { makeCdrPlatformRequest } from '../client';
import {
	CdrPlatformEndpointInputSchemas,
	CdrPlatformEndpointOutputSchemas,
} from './types';

function priceQuoteId(input: {
	currency: string;
	weight_unit: string;
	items: Array<{ method_type: string; cdr_amount: number }>;
}): string {
	return `${input.currency}:${input.weight_unit}:${[...input.items]
		.sort((a, b) => a.method_type.localeCompare(b.method_type))
		.map((item) => `${item.method_type}:${item.cdr_amount}`)
		.join(',')}`;
}

export const price: CdrPlatformEndpoints['price'] = async (ctx, input) => {
	const parsedInput = CdrPlatformEndpointInputSchemas.price.parse(input);
	const rawResponse = await makeCdrPlatformRequest('v1/cdr/price/', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});
	const response = CdrPlatformEndpointOutputSchemas.price.parse(rawResponse);

	if (ctx.db?.priceQuotes) {
		try {
			await ctx.db.priceQuotes.upsertByEntityId(
				priceQuoteId(parsedInput),
				response,
			);
		} catch {
			// Local cache is best-effort.
		}
	}
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

	if (ctx.db?.removalRequests) {
		try {
			await ctx.db.removalRequests.upsertByEntityId(response.transaction_uuid, {
				transaction_uuid: response.transaction_uuid,
				weight_unit: parsedInput.weight_unit,
				currency: parsedInput.currency,
				client_reference_id: parsedInput.client_reference_id,
				certificate_display_name: parsedInput.certificate_display_name,
			});
		} catch {
			// Local cache is best-effort.
		}
	}
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
