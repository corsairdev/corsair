import { logEventFromContext } from 'corsair/core';
import type { CurrentsApiEndpoints } from '..';
import { makeCurrentsApiRequest } from '../client';
import type { SearchResponse } from './types';
import {
	CurrentsApiEndpointInputSchemas,
	CurrentsApiEndpointOutputSchemas,
} from './types';

export const get: CurrentsApiEndpoints['search'] = async (ctx, input) => {
	const parsed = CurrentsApiEndpointInputSchemas.search.parse(input);
	const response = await makeCurrentsApiRequest<SearchResponse>(
		'/search',
		ctx.key,
		{
			keywords: parsed.keywords,
			query: parsed.query,
			language: parsed.language,
			category: parsed.category,
			country: parsed.country,
			start_date: parsed.start_date,
			end_date: parsed.end_date,
			page_number: parsed.page_number,
			page_size: parsed.page_size,
			limit: parsed.limit,
			type: parsed.type,
			domain: parsed.domain,
			domain_not: parsed.domain_not,
			author: parsed.author,
			has_image: parsed.has_image,
			has_description: parsed.has_description,
		},
	);

	const validated = CurrentsApiEndpointOutputSchemas.search.parse(response);

	await logEventFromContext(
		ctx,
		'currentsapi.search.get',
		{ ...parsed },
		'completed',
	);

	return validated;
};
