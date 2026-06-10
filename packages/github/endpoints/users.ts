import { logEventFromContext } from 'corsair/core';
import { makeGithubRequest } from '../client';
import type { GithubEndpoints } from '../index';
import type {
	UserGetResponse,
	UserHovercardGetResponse,
	UsersListResponse,
	UserUpdateResponse,
} from './types';

export const list: GithubEndpoints['usersList'] = async (ctx, input) => {
	const result = await makeGithubRequest<UsersListResponse>('/users', ctx.key, {
		query: input,
	});

	if (result && ctx.db.users) {
		try {
			for (const user of result) {
				await ctx.db.users.upsertByEntityId(user.id.toString(), user);
			}
		} catch (error) {
			console.warn('Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.users.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GithubEndpoints['usersGet'] = async (ctx, input) => {
	const { username } = input;
	const endpoint = `/users/${username}`;
	const result = await makeGithubRequest<UserGetResponse>(endpoint, ctx.key);

	if (result && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.users.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getById: GithubEndpoints['usersGetById'] = async (ctx, input) => {
	const { accountId } = input;
	const endpoint = `/user/${accountId}`;
	const result = await makeGithubRequest<UserGetResponse>(endpoint, ctx.key);

	if (result && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to save user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.users.getById',
		{ ...input },
		'completed',
	);
	return result;
};

export const getAuthenticated: GithubEndpoints['usersGetAuthenticated'] = async (
	ctx,
	input,
) => {
	const result = await makeGithubRequest<UserGetResponse>('/user', ctx.key);

	if (result && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to save authenticated user to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.users.getAuthenticated',
		{ ...input },
		'completed',
	);
	return result;
};

export const update: GithubEndpoints['usersUpdate'] = async (ctx, input) => {
	const { ...body } = input;
	const result = await makeGithubRequest<UserUpdateResponse>('/user', ctx.key, {
		method: 'PATCH',
		body,
	});

	if (result && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(result.id.toString(), result);
		} catch (error) {
			console.warn('Failed to update user in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'github.users.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const getHovercard: GithubEndpoints['usersGetHovercard'] = async (
	ctx,
	input,
) => {
	const { username, ...queryParams } = input;
	const endpoint = `/users/${username}/hovercard`;
	const result = await makeGithubRequest<UserHovercardGetResponse>(
		endpoint,
		ctx.key,
		{ query: queryParams },
	);

	await logEventFromContext(
		ctx,
		'github.users.getHovercard',
		{ ...input },
		'completed',
	);
	return result;
};
