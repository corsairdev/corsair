import type { SplitwiseEndpoints } from '..';
import { segment } from '../client';
import { call, requireSuccess, requireSuccessWithMessages } from './call';
import {
	SplitwiseEndpointInputSchemas,
	SplitwiseEndpointOutputSchemas,
} from './types';

/**
 * Flattens the member list into Splitwise's `users__{index}__{property}` keys.
 * A nested array would be sent as `users[0][email]` and silently ignored.
 */
export function flattenGroupUsers(
	users: readonly {
		user_id?: number;
		first_name?: string;
		last_name?: string;
		email?: string;
	}[],
): Record<string, string | number> {
	const flattened: Record<string, string | number> = {};
	users.forEach((user, index) => {
		for (const [key, value] of Object.entries(user)) {
			if (value !== undefined) {
				flattened[`users__${index}__${key}`] = value;
			}
		}
	});
	return flattened;
}

export const list: SplitwiseEndpoints['groupsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.list',
			input: SplitwiseEndpointInputSchemas.listGroups,
			output: SplitwiseEndpointOutputSchemas.listGroups,
		},
		input,
		() => ({ method: 'GET', path: 'get_groups' }),
		{ log: (_parsed, result) => ({ groups: result.groups.length }) },
	);

export const get: SplitwiseEndpoints['groupsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.get',
			input: SplitwiseEndpointInputSchemas.getGroup,
			output: SplitwiseEndpointOutputSchemas.getGroup,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `get_group/${segment(parsed.group_id)}`,
		}),
		{ log: (parsed) => ({ group_id: parsed.group_id }) },
	);

export const create: SplitwiseEndpoints['groupsCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.create',
			input: SplitwiseEndpointInputSchemas.createGroup,
			output: SplitwiseEndpointOutputSchemas.createGroup,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'create_group',
			body: {
				name: parsed.name,
				...(parsed.group_type === undefined
					? {}
					: { group_type: parsed.group_type }),
				...(parsed.simplify_by_default === undefined
					? {}
					: { simplify_by_default: parsed.simplify_by_default }),
				...flattenGroupUsers(parsed.users ?? []),
			},
		}),
		{
			// The group name is free text, so only the member count is logged.
			log: (parsed) => ({ members: parsed.users?.length ?? 0 }),
		},
	);

export const remove: SplitwiseEndpoints['groupsDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.delete',
			input: SplitwiseEndpointInputSchemas.deleteGroup,
			output: SplitwiseEndpointOutputSchemas.deleteGroup,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `delete_group/${segment(parsed.group_id)}`,
		}),
		{
			log: (parsed) => ({ group_id: parsed.group_id }),
			assert: (result) => requireSuccess(result, 'delete the group'),
		},
	);

export const undelete: SplitwiseEndpoints['groupsUndelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'groups.undelete',
			input: SplitwiseEndpointInputSchemas.undeleteGroup,
			output: SplitwiseEndpointOutputSchemas.undeleteGroup,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `undelete_group/${segment(parsed.group_id)}`,
		}),
		{
			log: (parsed) => ({ group_id: parsed.group_id }),
			assert: (result) =>
				requireSuccessWithMessages(result, 'restore the group'),
		},
	);

export const addUser: SplitwiseEndpoints['groupsAddUser'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'groups.addUser',
			input: SplitwiseEndpointInputSchemas.addUserToGroup,
			output: SplitwiseEndpointOutputSchemas.addUserToGroup,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'add_user_to_group',
			body: {
				group_id: parsed.group_id,
				...(parsed.user_id === undefined ? {} : { user_id: parsed.user_id }),
				...(parsed.first_name === undefined
					? {}
					: { first_name: parsed.first_name }),
				...(parsed.last_name === undefined
					? {}
					: { last_name: parsed.last_name }),
				...(parsed.email === undefined ? {} : { email: parsed.email }),
			},
		}),
		{
			log: (parsed) => ({
				group_id: parsed.group_id,
				user_id: parsed.user_id,
			}),
			assert: (result) => requireSuccess(result, 'add the user to the group'),
		},
	);

export const removeUser: SplitwiseEndpoints['groupsRemoveUser'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'groups.removeUser',
			input: SplitwiseEndpointInputSchemas.removeUserFromGroup,
			output: SplitwiseEndpointOutputSchemas.removeUserFromGroup,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'remove_user_from_group',
			body: { group_id: parsed.group_id, user_id: parsed.user_id },
		}),
		{
			log: (parsed) => ({
				group_id: parsed.group_id,
				user_id: parsed.user_id,
			}),
			assert: (result) =>
				requireSuccess(result, 'remove the user from the group'),
		},
	);
