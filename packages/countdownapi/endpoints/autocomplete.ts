import { logEventFromContext } from 'corsair/core';
import type { CountdownApiEndpoints } from '..';
import { makeCountdownApiRequest } from '../client';

export const get: CountdownApiEndpoints['autocomplete'] = async (
	ctx,
	input,
) => {
	const response = await makeCountdownApiRequest('/request', ctx.key, {
		type: 'autocomplete',
		query: input.query,
		ebay_domain: input.ebay_domain,
	});

	await logEventFromContext(
		ctx,
		'countdownapi.autocomplete.get',
		{ ...input },
		'completed',
	);

	return response;
};
