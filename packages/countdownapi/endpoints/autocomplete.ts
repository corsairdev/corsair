import { logEventFromContext } from 'corsair/core';
import type { CountdownApiEndpoints } from '..';
import { makeCountdownApiRequest } from '../client';
import type { AutocompleteResponse } from './types';
import {
	CountdownApiEndpointInputSchemas,
	CountdownApiEndpointOutputSchemas,
} from './types';

export const get: CountdownApiEndpoints['autocomplete'] = async (
	ctx,
	input,
) => {
	const parsed = CountdownApiEndpointInputSchemas.autocomplete.parse(input);
	const response = await makeCountdownApiRequest<AutocompleteResponse>(
		'/request',
		ctx.key,
		{
			type: 'autocomplete',
			search_term: parsed.query,
			ebay_domain: parsed.ebay_domain,
		},
	);

	const validatedResponse =
		CountdownApiEndpointOutputSchemas.autocomplete.parse(response);

	await logEventFromContext(
		ctx,
		'countdownapi.autocomplete.get',
		{ ...parsed },
		'completed',
	);

	return validatedResponse;
};
