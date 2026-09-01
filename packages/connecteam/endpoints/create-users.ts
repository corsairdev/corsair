import { logEventFromContext } from 'corsair/core';
import type { ConnecteamEndpoints } from '..';
import { makeConnecteamRequest } from '../client';
import type { CreateUsersResponse } from './types';

export const createUsers: ConnecteamEndpoints['createUsers'] = async (
	ctx,
	input,
) => {
	const response = await makeConnecteamRequest<CreateUsersResponse>(
		'users/v1/users',
		ctx.key,
		{
			method: 'POST',
			query: {
				sendActivation: false,
			},
			body: input.users,
		},
	);

	await logEventFromContext(
		ctx,
		'connecteam.users.create',
		{ ...input },
		'completed',
	);

	return response;
};
