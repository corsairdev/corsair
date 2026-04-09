import { logEventFromContext } from 'corsair/core';
import type { MondayEndpoints } from '..';
import { makeMondayRequest } from '../client';
import type { MondayEndpointOutputs } from './types';

export const list: MondayEndpoints['usersList'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['usersList']>(
		`query($limit: Int, $page: Int, $kind: UserKind) {
			users(limit: $limit, page: $page, kind: $kind) {
				id
				name
				email
				photo_thumb
				title
				is_admin
				is_guest
			}
		}`,
		ctx.key,
		{
			limit: input.limit,
			page: input.page,
			kind: input.kind,
		},
	);

	await logEventFromContext(
		ctx,
		'monday.users.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: MondayEndpoints['usersGet'] = async (ctx, input) => {
	const result = await makeMondayRequest<MondayEndpointOutputs['usersGet']>(
		`query($userId: ID!) {
			users(ids: [$userId]) {
				id
				name
				email
				photo_thumb
				title
				is_admin
				is_guest
			}
		}`,
		ctx.key,
		{ userId: input.user_id },
	);

	await logEventFromContext(ctx, 'monday.users.get', { ...input }, 'completed');
	return result;
};
