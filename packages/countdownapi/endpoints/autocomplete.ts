import { logEventFromContext } from 'corsair/core';
import type { CountdownApiEndpoints } from '..';
import { makeCountdownApiRequest } from '../client';
import type { AutocompleteResponse } from './types';
import { CountdownApiEndpointOutputSchemas } from './types';

export const get: CountdownApiEndpoints['autocomplete'] = async (
	ctx,
	input,
) => {
	const response = await makeCountdownApiRequest<AutocompleteResponse>(
		'/request',
		ctx.key,
		{
			type: 'autocomplete',
			search_term: input.query,
			ebay_domain: input.ebay_domain,
		},
	);

	const validatedResponse =
		CountdownApiEndpointOutputSchemas.autocomplete.parse(response);

	await logEventFromContext(
		ctx,
		'countdownapi.autocomplete.get',
		{ ...input },
		'completed',
	);

	return validatedResponse;
};
