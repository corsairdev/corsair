import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import type { MixmaxEndpointOutputs } from './types';

export const unsubscribesList: MixmaxEndpoints['unsubscribesList'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['unsubscribesList']
	>(ctx, '/v1/unsubscribes', {
		method: 'GET',
		query: {
			email: input.email,
			sort: input.sort,
			sortAscending: input.sortAscending,
			limit: input.limit,
			next: input.next,
			previous: input.previous,
			expand: input.expand,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.unsubscribes.list',
		{
			// The address being looked up is private; log that a filter was
			// used and the paging, not the address.
			filteredByEmail: input.email !== undefined,
			sort: input.sort,
			sortAscending: input.sortAscending,
			limit: input.limit,
		},
		'completed',
	);
	return result;
};

export const unsubscribesCreate: MixmaxEndpoints['unsubscribesCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['unsubscribesCreate']
	>(ctx, '/v1/unsubscribes', {
		method: 'POST',
		body: {
			email: input.email,
			name: input.name,
			emails: input.emails,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.unsubscribes.create',
		{
			// The addresses and the contact's name are private; log the
			// number of addresses only.
			addresses:
				(input.email !== undefined ? 1 : 0) + (input.emails?.length ?? 0),
		},
		'completed',
	);
	return result;
};

export const unsubscribesRemove: MixmaxEndpoints['unsubscribesRemove'] = async (
	ctx,
	input,
) => {
	// The documented contract for DELETE /v1/unsubscribes carries the address
	// in a JSON body rather than the query string, so the validated input is
	// forwarded as the DELETE body (the shared transport forwards bodies for
	// every non-GET method).
	const result = await makeMixmaxRequest<
		MixmaxEndpointOutputs['unsubscribesRemove']
	>(ctx, '/v1/unsubscribes', {
		method: 'DELETE',
		body: {
			email: input.email,
		},
	});

	await logEventFromContext(
		ctx,
		'mixmax.unsubscribes.remove',
		// The address is private; log the number of addresses only.
		{ addresses: 1 },
		'completed',
	);
	return result;
};
