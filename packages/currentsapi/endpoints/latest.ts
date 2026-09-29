import { logEventFromContext } from 'corsair/core';
import type { CurrentsApiEndpoints } from '..';
import { makeCurrentsApiRequest } from '../client';
import type { LatestResponse } from './types';
import {
	CurrentsApiEndpointInputSchemas,
	CurrentsApiEndpointOutputSchemas,
} from './types';

export const get: CurrentsApiEndpoints['latest'] = async (ctx, input) => {
	const parsed = CurrentsApiEndpointInputSchemas.latest.parse(input);
	const response = await makeCurrentsApiRequest<LatestResponse>(
		'/latest-news',
		ctx.key,
		{
			language: parsed.language,
			category: parsed.category,
			country: parsed.country,
			page_number: parsed.page_number,
			page_size: parsed.page_size,
			type: parsed.type,
			domain: parsed.domain,
			domain_not: parsed.domain_not,
			author: parsed.author,
		},
	);

	const validated = CurrentsApiEndpointOutputSchemas.latest.parse(response);

	await logEventFromContext(
		ctx,
		'currentsapi.latest.get',
		{ ...parsed },
		'completed',
	);

	return validated;
};
