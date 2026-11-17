import type { SplitwiseEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	SplitwiseEndpointInputSchemas,
	SplitwiseEndpointOutputSchemas,
} from './types';

export const getCurrentUser: SplitwiseEndpoints['usersGetCurrentUser'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.getCurrentUser',
			input: SplitwiseEndpointInputSchemas.getCurrentUser,
			output: SplitwiseEndpointOutputSchemas.getCurrentUser,
		},
		input,
		() => ({ method: 'GET', path: 'get_current_user' }),
		{ log: () => ({ scope: 'self' }) },
	);

export const getUser: SplitwiseEndpoints['usersGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: SplitwiseEndpointInputSchemas.getUser,
			output: SplitwiseEndpointOutputSchemas.getUser,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `get_user/${segment(parsed.user_id)}`,
		}),
		{ log: (parsed) => ({ user_id: parsed.user_id }) },
	);

export const update: SplitwiseEndpoints['usersUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: SplitwiseEndpointInputSchemas.updateUser,
			output: SplitwiseEndpointOutputSchemas.updateUser,
		},
		input,
		(parsed) => {
			const { user_id, ...fields } = parsed;
			return {
				method: 'POST',
				path: `update_user/${segment(user_id)}`,
				// Only the fields the caller set: Splitwise leaves an absent field
				// alone, so sending an explicit undefined would be a no-op either way.
				body: fields,
			};
		},
		{ log: (parsed) => ({ user_id: parsed.user_id }) },
	);
