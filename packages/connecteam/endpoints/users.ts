import { logEventFromContext } from 'corsair/core';
import type { ConnecteamEndpoints } from '..';
import { makeConnecteamRequest } from '../client';
import type { GetUsersResponse } from './types';

export const getUsers: ConnecteamEndpoints['getUsers'] = async (ctx, input) => {
	const response = await makeConnecteamRequest<GetUsersResponse>(
		'users/v1/users',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'connecteam.users.get',
		{ ...input },
		'completed',
	);

	return response;
};
