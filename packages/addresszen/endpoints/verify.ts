import { logEventFromContext } from 'corsair/core';
import { makeAddresszenRequest } from '../client';
import type { AddresszenEndpoints } from '../index';
import type { AddresszenEndpointOutputs } from './types';

/**
 * Verify and standardize a US address using USPS CASS.
 *
 * API: POST /verify/addresses
 * Docs: https://docs.addresszen.com/docs/api/address-verify
 */
export const address: AddresszenEndpoints['verifyAddress'] = async (
	ctx,
	input,
) => {
	const { context, ...body } = input;

	const response = await makeAddresszenRequest<
		AddresszenEndpointOutputs['verifyAddress']
	>('verify/addresses', ctx.key, {
		method: 'POST',
		query: context ? { context } : undefined,
		body,
	});

	if (ctx.db.verifiedAddresses) {
		try {
			const entityId = [input.query, input.city, input.state, input.zip_code]
				.filter(Boolean)
				.join('|');

			await ctx.db.verifiedAddresses.upsertByEntityId(entityId, {
				...response,
				query: input.query,
				city: input.city ?? null,
				state: input.state ?? null,
				zipCode: input.zip_code ?? null,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'[addresszen] Failed to save verified address to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'addresszen.verify.address',
		{ query: input.query },
		'completed',
	);

	return response;
};
