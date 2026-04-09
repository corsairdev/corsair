import { logEventFromContext } from 'corsair/core';
import type { FirefliesEndpoints } from '..';
import { makeFirefliesRequest } from '../client';
import type { FirefliesEndpointOutputs } from './types';

const USER_QUERY = `
  query User {
    user {
      user_id email name num_transcripts minutes_consumed is_admin integrations
    }
  }
`;

const USERS_LIST_QUERY = `
  query Users {
    users {
      user_id email name num_transcripts minutes_consumed is_admin integrations
    }
  }
`;

export const getCurrent: FirefliesEndpoints['usersGetCurrent'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['usersGetCurrent']
	>(USER_QUERY, ctx.key);

	if (ctx.db.users && response.user) {
		try {
			await ctx.db.users.upsertByEntityId(response.user.user_id, {
				...response.user,
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'fireflies.users.getCurrent',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: FirefliesEndpoints['usersList'] = async (ctx, input) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['usersList']
	>(USERS_LIST_QUERY, ctx.key);

	if (ctx.db.users) {
		for (const user of response.users) {
			try {
				await ctx.db.users.upsertByEntityId(user.user_id, { ...user });
			} catch (error) {
				console.warn('Failed to save user to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'fireflies.users.list',
		{ ...input },
		'completed',
	);
	return response;
};
