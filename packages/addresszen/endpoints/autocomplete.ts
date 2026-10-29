import { logEventFromContext } from 'corsair/core';
import { makeAddresszenRequest } from '../client';
import type { AddresszenEndpoints } from '../index';
import type { AddresszenEndpointOutputs } from './types';

/**
 * Get address autocomplete suggestions for a partial query.
 *
 * API: GET /autocomplete/addresses
 * Docs: https://docs.addresszen.com/docs/api/find-address
 */
export const addresses: AddresszenEndpoints['autocompleteAddresses'] = async (
	ctx,
	input,
) => {
	const response = await makeAddresszenRequest<
		AddresszenEndpointOutputs['autocompleteAddresses']
	>('autocomplete/addresses', ctx.key, {
		method: 'GET',
		query: {
			q: input.query,
			limit: input.limit,
			page: input.page,
		},
	});

	if (ctx.db.autocompleteResults) {
		try {
			const { result, ...rest } = response;
			await ctx.db.autocompleteResults.upsertByEntityId(input.query, {
				...rest,
				query: input.query,
				hits: result.hits,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'[addresszen] Failed to save autocomplete results to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'addresszen.autocomplete.addresses',
		{ query: input.query, hitCount: response.result.hits.length },
		'completed',
	);

	return response;
};
