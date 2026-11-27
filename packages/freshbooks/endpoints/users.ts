import { asRecord } from 'corsair/core';
import type { FreshBooksEndpoints } from '..';
import { FreshBooksAPIError } from '../client';
import { FreshBooksEndpointInputSchemas as Inputs, FreshBooksEndpointOutputSchemas as Outputs } from './types';
import { call } from './call';

/**
 * The auth family answers `{ response: { ...identity } }` with no result key.
 * accountId and businessId are read out of business_memberships, because every
 * other group needs one of the two, and exported for tests.
 */
export function shapeUsersMe(raw: unknown): unknown {
	const identity = asRecord(asRecord(raw)?.response);
	if (!identity) {
		throw new FreshBooksAPIError(
			'Unexpected users/me response: missing the response object',
		);
	}
	const memberships = Array.isArray(identity.business_memberships)
		? identity.business_memberships
		: [];
	let accountId: string | undefined;
	let businessId: number | undefined;
	for (const membership of memberships) {
		const business = asRecord(asRecord(membership)?.business);
		if (!business) continue;
		const account = business.account_id;
		if (accountId === undefined && typeof account === 'string' && account.length > 0) {
			accountId = account;
		}
		const id = business.id;
		if (businessId === undefined && typeof id === 'number') {
			businessId = id;
		}
	}
	return { ...identity, accountId, businessId };
}

export const me: FreshBooksEndpoints['usersMe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.me',
			input: Inputs.usersMe,
			output: Outputs.usersMe,
			envelope: 'bare',
		},
		input,
		() => ({
			method: 'GET',
			path: '/auth/api/v1/users/me',
		}),
		{
			shape: shapeUsersMe,
			log: (_, result) => ({
				email: result.email ?? undefined,
				accountId: result.accountId,
				businessId: result.businessId,
			}),
		},
	);
