import { logEventFromContext } from 'corsair/core';
import { makeAddresszenRequest } from '../client';
import type { AddresszenEndpoints } from '../index';
import type { AddresszenEndpointOutputs } from './types';

/**
 * Get public information on an API key, including whether it is usable.
 *
 * API: GET /keys/:key
 * Docs: https://docs.addresszen.com/docs/api/key-availability
 *
 * Addresszen requires the key as the path resource id for this public endpoint;
 * there is no header-only variant. Auth header is omitted so the credential is
 * not also sent in Authorization.
 */
export const availability: AddresszenEndpoints['keyAvailability'] = async (
	ctx,
	_input,
) => {
	const response = await makeAddresszenRequest<
		AddresszenEndpointOutputs['keyAvailability']
	>(`keys/${encodeURIComponent(ctx.key)}`, ctx.key, {
		method: 'GET',
		auth: false,
	});

	if (ctx.db.keyAvailability) {
		try {
			const accountId = await ctx.$getAccountId();
			await ctx.db.keyAvailability.upsertByEntityId(accountId, {
				available: response.result.available,
				context: response.result.context ?? null,
				code: response.code,
				message: response.message,
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				'[addresszen] Failed to save key availability to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'addresszen.key.availability',
		{ available: response.result.available },
		'completed',
	);

	return response;
};
