import { logEventFromContext } from 'corsair/core';
import type { ConnecteamEndpoints } from '..';
import { makeConnecteamRequest } from '../client';
import type { UpdateUsersResponse } from './types';

export const updateUsers: ConnecteamEndpoints['updateUsers'] = async (
	ctx,
	input,
) => {
	const response = await makeConnecteamRequest<UpdateUsersResponse>(
		'users/v1/users',
		ctx.key,
		{
			method: 'PUT',
			body: input.users,
			query: {
				editUsersByPhone: input.editUsersByPhone ?? false,
				includeSmartGroupIds: input.includeSmartGroupIds ?? true,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'connecteam.users.update',
		{ ...input },
		'completed',
	);

	return response;
};
