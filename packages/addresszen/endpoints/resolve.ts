import { logEventFromContext } from 'corsair/core';
import { makeAddresszenRequest } from '../client';
import type { AddresszenEndpoints } from '../index';
import type { AddresszenEndpointOutputs } from './types';

/**
 * Resolve an address autocompletion by ID and return the full US-format address.
 *
 * API: GET /autocomplete/addresses/:address/usa
 * Docs: https://docs.addresszen.com/docs/api/retrieve-address
 */
export const addressUsa: AddresszenEndpoints['resolveAddressUsa'] = async (
	ctx,
	input,
) => {
	const response = await makeAddresszenRequest<
		AddresszenEndpointOutputs['resolveAddressUsa']
	>(
		`autocomplete/addresses/${encodeURIComponent(input.addressId)}/usa`,
		ctx.key,
		{ method: 'GET' },
	);

	if (ctx.db.resolvedAddresses) {
		try {
			const { result, ...rest } = response;
			await ctx.db.resolvedAddresses.upsertByEntityId(input.addressId, {
				...rest,
				addressId: input.addressId,
				address: result,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'[addresszen] Failed to save resolved address to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'addresszen.resolve.addressUsa',
		{ addressId: input.addressId },
		'completed',
	);

	return response;
};
