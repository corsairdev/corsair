import { logEventFromContext } from 'corsair/core';
import type { BigmailerEndpoints } from '../index';
import { auditPayload } from './logging';
import { bigmailerCall, compact, seg } from './shared';
import type { BigmailerEndpointOutputs } from './types';

/**
 * Account users are not mirrored to the local database - see
 * `schema/database.ts`'s closing comment for why (identity/access records,
 * not configuration data, the same split Doppler's workplace users use).
 */

/** Lists account users. */
export const list: BigmailerEndpoints['usersList'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['usersList']>(
		ctx,
		'users',
		{ query: compact({ limit: input.limit, cursor: input.cursor }) },
	);

	await logEventFromContext(
		ctx,
		'bigmailer.users.list',
		{ returned: result.data.length },
		'completed',
	);
	return result;
};

/**
 * Invites a new user to the account. `POST /users` - see
 * `endpoints/types.ts`'s `BigmailerUserRoleSchema` doc comment for why this
 * path is used over a summarizer-suggested `/accounts/{account_id}/users`.
 */
export const create: BigmailerEndpoints['usersCreate'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['usersCreate']>(
		ctx,
		'users',
		{
			method: 'POST',
			body: compact({
				email: input.email,
				role: input.role,
				allowed_brands: input.allowedBrands,
				invitation_message: input.invitationMessage,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'bigmailer.users.create',
		auditPayload(input, ['email', 'role', 'allowedBrands']),
		'completed',
	);
	return result;
};

/** Retrieves a single account user. */
export const get: BigmailerEndpoints['usersGet'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['usersGet']>(
		ctx,
		`users/${seg(input.userId)}`,
	);

	await logEventFromContext(
		ctx,
		'bigmailer.users.get',
		auditPayload(input, ['userId']),
		'completed',
	);
	return result;
};

/**
 * Updates a user's email, role, or allowed brands. Not directly live-tested
 * (would send a real invitation-style change to a real account user), but
 * every other update operation in this API was confirmed live to use `POST`
 * rather than `PUT`/`PATCH` - the same convention applies here.
 */
export const update: BigmailerEndpoints['usersUpdate'] = async (ctx, input) => {
	const result = await bigmailerCall<BigmailerEndpointOutputs['usersUpdate']>(
		ctx,
		`users/${seg(input.userId)}`,
		{
			method: 'POST',
			body: compact({
				email: input.email,
				role: input.role,
				allowed_brands: input.allowedBrands,
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'bigmailer.users.update',
		auditPayload(input, ['userId', 'role', 'allowedBrands']),
		'completed',
	);
	return result;
};

/** Removes a user from the account. */
export const remove: BigmailerEndpoints['usersDelete'] = async (ctx, input) => {
	await bigmailerCall<BigmailerEndpointOutputs['usersDelete']>(
		ctx,
		`users/${seg(input.userId)}`,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'bigmailer.users.delete',
		auditPayload(input, ['userId']),
		'completed',
	);
};
