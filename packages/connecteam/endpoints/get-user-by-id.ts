import { logEventFromContext } from 'corsair/core';
import type { ConnecteamEndpoints } from '..';
import { makeConnecteamRequest } from '../client';
import type { GetUserByIdResponse } from './types';

export const getUserById: ConnecteamEndpoints['getUserById'] = async (
	ctx,
	input,
) => {
	const response = await makeConnecteamRequest<GetUserByIdResponse>(
		`users/v1/users/${input.userId}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'connecteam.users.getById',
		{ ...input },
		'completed',
	);

	return response;
};
