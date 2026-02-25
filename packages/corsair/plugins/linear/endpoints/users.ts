import { logEventFromContext } from '../../utils/events';
import type { LinearEndpoints } from '..';
import { makeLinearRequest } from '../client';
import type { UserGetResponse, UsersListResponse } from './types';

const USERS_LIST_QUERY = `
  query Users($first: Int!, $after: String) {
    users(first: $first, after: $after) {
      nodes {
        id
        name
        email
        displayName
        avatarUrl
        active
        admin
        createdAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const USER_GET_QUERY = `
  query User($id: String!) {
    user(id: $id) {
      id
      name
      email
      displayName
      avatarUrl
      active
      admin
      createdAt
      updatedAt
    }
  }
`;

export const list: LinearEndpoints['usersList'] = async (ctx, input) => {
	const response = await makeLinearRequest<UsersListResponse>(
		USERS_LIST_QUERY,
		ctx.key,
		{
			first: input.first || 50,
			after: input.after,
		},
	);

	const result = response.users;

	if (result.nodes && ctx.db.users) {
		try {
			for (const user of result.nodes) {
				await ctx.db.users.upsertByEntityId(user.id, {
					...user,
					createdAt: new Date(user.createdAt ?? ''),
					updatedAt: new Date(user.updatedAt ?? ''),
				});
			}
		} catch (error) {
			console.warn('Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'linear.users.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: LinearEndpoints['usersGet'] = async (ctx, input) => {
	const response = await makeLinearRequest<UserGetResponse>(
		USER_GET_QUERY,
		ctx.key,
		{ id: input.id },
	);

	const result = response.user;

	if (result && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.id, {
				...result,
				createdAt: new Date(result.createdAt ?? ''),
				updatedAt: new Date(result.updatedAt ?? ''),
			});
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(ctx, 'linear.users.get', { ...input }, 'completed');
	return result;
};
