import { logEventFromContext } from 'corsair/core';
import { makeAddresszenRequest } from '../client';
import type { AddresszenEndpoints } from '../index';
import type { AddresszenEndpointOutputs } from './types';

/**
 * Get public information on an API key, including whether it is usable.
 *
 * API: GET /keys/:key
 * Docs: https://docs.addresszen.com/docs/api/key-availability
 */
export const availability: AddresszenEndpoints['keyAvailability'] = async (
	ctx,
	_input,
) => {
	const response = await makeAddresszenRequest<
		AddresszenEndpointOutputs['keyAvailability']
	>(`keys/${encodeURIComponent(ctx.key)}`, ctx.key, {
		method: 'GET',
	});

	if (ctx.db.keyAvailability) {
		try {
			await ctx.db.keyAvailability.upsertByEntityId(ctx.key, {
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
