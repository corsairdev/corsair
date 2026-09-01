import { logEventFromContext } from 'corsair/core';
import type { ConnecteamEndpoints } from '..';
import { makeConnecteamRequest } from '../client';
import type { ArchiveUsersResponse } from './types';

export const archiveUsers: ConnecteamEndpoints['archiveUsers'] = async (
	ctx,
	input,
) => {
	const response = await makeConnecteamRequest<ArchiveUsersResponse>(
		'users/v1/users',
		ctx.key,
		{
			method: 'DELETE',
			query: {
				deletionType: input.deletionType ?? 'archive',
			},
			body: {
				userIds: input.userIds,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'connecteam.users.archive',
		{ ...input },
		'completed',
	);

	return response;
};
