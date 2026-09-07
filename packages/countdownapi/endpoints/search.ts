import { logEventFromContext } from 'corsair/core';
import type { CountdownApiEndpoints } from '..';
import { compactQuery, makeCountdownApiRequest } from '../client';
import type { SearchResponse } from './types';
import {
	CountdownApiEndpointInputSchemas,
	CountdownApiEndpointOutputSchemas,
} from './types';

export const get: CountdownApiEndpoints['search'] = async (ctx, input) => {
	const parsed = CountdownApiEndpointInputSchemas.search.parse(input);
	const response = await makeCountdownApiRequest<SearchResponse>(
		'/request',
		ctx.key,
		compactQuery({
			type: 'search',
			search_term: parsed.query,
			ebay_domain: parsed.ebay_domain,
			page: parsed.page,
			category_id: parsed.category_id,
			listing_type: parsed.listing_type,
			sort_by: parsed.sort_by,
			condition: parsed.condition,
			max_page: parsed.max_page,
			num: parsed.num,
			url: parsed.url,
			authorized_sellers: parsed.authorized_sellers,
			returns_accepted: parsed.returns_accepted,
			free_returns: parsed.free_returns,
			authenticity_verified: parsed.authenticity_verified,
			deals_and_savings: parsed.deals_and_savings,
			sale_items: parsed.sale_items,
			facets: parsed.facets,
			allow_rewritten_results: parsed.allow_rewritten_results,
		}),
	);

	const validatedResponse =
		CountdownApiEndpointOutputSchemas.search.parse(response);

	await logEventFromContext(
		ctx,
		'countdownapi.search.get',
		{ ...parsed },
		'completed',
	);

	return validatedResponse;
};
