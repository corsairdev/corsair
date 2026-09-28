import { logEventFromContext } from 'corsair/core';
import type { CountdownApiEndpoints } from '..';
import { compactQuery, makeCountdownApiRequest } from '../client';
import type { ProductResponse } from './types';
import {
	CountdownApiEndpointInputSchemas,
	CountdownApiEndpointOutputSchemas,
} from './types';

export const get: CountdownApiEndpoints['product'] = async (ctx, input) => {
	const parsed = CountdownApiEndpointInputSchemas.product.parse(input);
	const response = await makeCountdownApiRequest<ProductResponse>(
		'/request',
		ctx.key,
		compactQuery({
			type: 'product',
			url: parsed.url,
			epid: parsed.epid,
			gtin: parsed.gtin,
			ebay_domain: parsed.ebay_domain,
			include_html: parsed.include_html,
			skip_gtin_cache: parsed.skip_gtin_cache,
			include_parts_compatibility: parsed.include_parts_compatibility,
		}),
	);

	const validatedResponse =
		CountdownApiEndpointOutputSchemas.product.parse(response);

	await logEventFromContext(
		ctx,
		'countdownapi.product.get',
		{ ...parsed },
		'completed',
	);

	return validatedResponse;
};
