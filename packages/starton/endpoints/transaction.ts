import { logEventFromContext } from 'corsair/core';
import type { StartonEndpoints } from '..';
import { encodeStartonPathSegment, makeStartonRequest } from '../client';
import {
	StartonEndpointInputSchemas,
	StartonEndpointOutputSchemas,
} from './types';

/**
 * Fetch a relayer transaction by its Starton id, including its lifecycle
 * `status`, coarse `state` (PENDING / SUCCESS / ERROR / MANUAL_ACTION_REQUIRED)
 * and the `logs` trail. Use this to follow a `call` or `deployFromTemplate`
 * through to confirmation.
 *
 * API: GET /v3/transaction/{id} -> Transaction
 */
export const get: StartonEndpoints['transactionGet'] = async (ctx, input) => {
	// Validate before the request so a malformed id fails locally rather than
	// being interpolated into the URL.
	const { id } = StartonEndpointInputSchemas.transactionGet.parse(input);
	const response = await makeStartonRequest<unknown>(
		`v3/transaction/${encodeStartonPathSegment(id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	// Validate the provider payload before returning it as typed data.
	const transaction =
		StartonEndpointOutputSchemas.transactionGet.parse(response);
	await logEventFromContext(
		ctx,
		'starton.transaction.get',
		{ id, status: transaction.status },
		'completed',
	);
	return transaction;
};
