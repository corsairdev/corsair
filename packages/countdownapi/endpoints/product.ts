import { logEventFromContext } from 'corsair/core';
import type { CountdownApiEndpoints } from '..';
import { makeCountdownApiRequest } from '../client';
import type { ProductResponse } from './types';
import { CountdownApiEndpointOutputSchemas } from './types';

export const get: CountdownApiEndpoints['product'] = async (ctx, input) => {
	const response = await makeCountdownApiRequest<ProductResponse>(
		'/request',
		ctx.key,
		{
			type: 'product',
			url: input.url,
			epid: input.epid,
			gtin: input.gtin,
			ebay_domain: input.ebay_domain,
			include_html: input.include_html,
			skip_gtin_cache: input.skip_gtin_cache,
			include_parts_compatibility: input.include_parts_compatibility,
		},
	);

	const validatedResponse =
		CountdownApiEndpointOutputSchemas.product.parse(response);

	await logEventFromContext(
		ctx,
		'countdownapi.product.get',
		{ ...input },
		'completed',
	);

	return validatedResponse;
};
