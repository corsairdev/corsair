import { logEventFromContext } from 'corsair/core';
import { makeFinerWorksRequest } from '../client';
import type { FinerWorksEndpoint } from './shared';
import { resolveCredentials } from './shared';
import {
	ShippingGetOptionIdsInputSchema,
	ShippingGetOptionIdsOutputSchema,
	ShippingListOptionsMultipleInputSchema,
	ShippingListOptionsMultipleOutputSchema,
} from './types';

/**
 * Shipping method ids for cross-reference. This returns identifiers only, not
 * rates — use `shipping.listOptionsMultiple` for priced options.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-get_shipping_options_ids_type
 */
export const getOptionIds: FinerWorksEndpoint<'shipping.getOptionIds'> = async (
	ctx,
	input = {},
) => {
	const validated = ShippingGetOptionIdsInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/get_shipping_options_ids',
		credentials,
		{
			method: 'GET',
			query:
				validated.type !== undefined ? { type: validated.type } : undefined,
		},
	);

	await logEventFromContext(
		ctx,
		'finerworks.shipping.getOptionIds',
		{ type: validated.type ?? null },
		'completed',
	);
	return ShippingGetOptionIdsOutputSchema.parse(res);
};

/**
 * Shipping options and rates for a batch of orders.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_shipping_options_multiple
 */
export const listOptionsMultiple: FinerWorksEndpoint<
	'shipping.listOptionsMultiple'
> = async (ctx, input) => {
	const validated = ShippingListOptionsMultipleInputSchema.parse(input);
	const credentials = await resolveCredentials(ctx);

	const res = await makeFinerWorksRequest<unknown>(
		'v3/list_shipping_options_multiple',
		credentials,
		{ method: 'POST', body: validated },
	);

	await logEventFromContext(
		ctx,
		'finerworks.shipping.listOptionsMultiple',
		{ count: validated.orders.length },
		'completed',
	);
	return ShippingListOptionsMultipleOutputSchema.parse(res);
};

export const ShippingEndpoints = {
	getOptionIds,
	listOptionsMultiple,
} as const;
