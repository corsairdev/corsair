import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const get: HunterioEndpoints['domainsSuggestionGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.domainsSuggestionGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['domainsSuggestionGet']
	>('/domains-suggestion', ctx.key, {
		method: 'GET',
		query: { query: parsed.query, limit: parsed.limit },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.domainsSuggestionGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.domainsSuggestion.get',
		{},
		'completed',
	);

	return parsedResponse;
};
