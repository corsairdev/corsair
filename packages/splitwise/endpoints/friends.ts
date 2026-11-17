import type { SplitwiseEndpoints } from '..';
import { segment } from '../client';
import { call, requireSuccess } from './call';
import {
	SplitwiseEndpointInputSchemas,
	SplitwiseEndpointOutputSchemas,
} from './types';

/** Flattens the friend list into `users__{index}__{property}` keys. */
export function flattenFriends(
	users: readonly {
		email: string;
		first_name?: string;
		last_name?: string;
	}[],
): Record<string, string> {
	const flattened: Record<string, string> = {};
	users.forEach((user, index) => {
		flattened[`users__${index}__email`] = user.email;
		if (user.first_name !== undefined) {
			flattened[`users__${index}__first_name`] = user.first_name;
		}
		if (user.last_name !== undefined) {
			flattened[`users__${index}__last_name`] = user.last_name;
		}
	});
	return flattened;
}

export const list: SplitwiseEndpoints['friendsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'friends.list',
			input: SplitwiseEndpointInputSchemas.listFriends,
			output: SplitwiseEndpointOutputSchemas.listFriends,
		},
		input,
		() => ({ method: 'GET', path: 'get_friends' }),
		{ log: (_parsed, result) => ({ friends: result.friends.length }) },
	);

export const get: SplitwiseEndpoints['friendsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'friends.get',
			input: SplitwiseEndpointInputSchemas.getFriend,
			output: SplitwiseEndpointOutputSchemas.getFriend,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `get_friend/${segment(parsed.friend_id)}`,
		}),
		{ log: (parsed) => ({ friend_id: parsed.friend_id }) },
	);

export const add: SplitwiseEndpoints['friendsAdd'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'friends.add',
			input: SplitwiseEndpointInputSchemas.addFriend,
			output: SplitwiseEndpointOutputSchemas.addFriend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'create_friend',
			body: {
				user_email: parsed.user_email,
				...(parsed.user_first_name === undefined
					? {}
					: { user_first_name: parsed.user_first_name }),
				...(parsed.user_last_name === undefined
					? {}
					: { user_last_name: parsed.user_last_name }),
			},
		}),
		{ log: () => ({ scope: 'friend' }) },
	);

export const addMany: SplitwiseEndpoints['friendsAddMany'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'friends.addMany',
			input: SplitwiseEndpointInputSchemas.addFriends,
			output: SplitwiseEndpointOutputSchemas.addFriends,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'create_friends',
			body: flattenFriends(parsed.users),
		}),
		{ log: (parsed) => ({ requested: parsed.users.length }) },
	);

export const remove: SplitwiseEndpoints['friendsDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'friends.delete',
			input: SplitwiseEndpointInputSchemas.deleteFriend,
			output: SplitwiseEndpointOutputSchemas.deleteFriend,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `delete_friend/${segment(parsed.friend_id)}`,
		}),
		{
			log: (parsed) => ({ friend_id: parsed.friend_id }),
			assert: (result) => requireSuccess(result, 'delete the friendship'),
		},
	);
