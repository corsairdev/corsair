import { logEventFromContext } from 'corsair/core';
import type { TwitterApiIOEndpoints } from '..';
import { makeTwitterApiIORequest } from '../client';
import type { TwitterApiIOEndpointOutputs } from './types';

export const getByUsername: TwitterApiIOEndpoints['usersGetByUsername'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['usersGetByUsername']
		>('/twitter/user/info', ctx.key, {
			method: 'GET',
			query: { userName: input.userName },
		});

		if (response.data && ctx.db.users) {
			try {
				await ctx.db.users.upsertByEntityId(response.data.id, response.data);
			} catch (error) {
				console.warn('[twitterapiio] Failed to save user to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.users.getByUsername',
			{ ...input },
			'completed',
		);
		return response;
	};

export const batchGetByIds: TwitterApiIOEndpoints['usersBatchGetByIds'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['usersBatchGetByIds']
		>('/twitter/user/batch_info_by_ids', ctx.key, {
			method: 'GET',
			query: { userIds: input.userIds },
		});

		if (response.data && ctx.db.users) {
			try {
				for (const user of response.data) {
					await ctx.db.users.upsertByEntityId(user.id, user);
				}
			} catch (error) {
				console.warn('[twitterapiio] Failed to save users to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.users.batchGetByIds',
			{ ...input },
			'completed',
		);
		return response;
	};

export const search: TwitterApiIOEndpoints['usersSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['usersSearch']
	>('/twitter/user/search', ctx.key, {
		method: 'GET',
		query: { keyword: input.keyword, cursor: input.cursor },
	});

	if (response.users && ctx.db.users) {
		try {
			for (const user of response.users) {
				await ctx.db.users.upsertByEntityId(user.id, user);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.users.search',
		{ ...input },
		'completed',
	);
	return response;
};

export const getFollowers: TwitterApiIOEndpoints['usersGetFollowers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['usersGetFollowers']
	>('/twitter/user/followers', ctx.key, {
		method: 'GET',
		query: { userName: input.userName, cursor: input.cursor },
	});

	if (response.users && ctx.db.users) {
		try {
			for (const user of response.users) {
				await ctx.db.users.upsertByEntityId(user.id, user);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.users.getFollowers',
		{ ...input },
		'completed',
	);
	return response;
};

export const getVerifiedFollowers: TwitterApiIOEndpoints['usersGetVerifiedFollowers'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['usersGetVerifiedFollowers']
		>('/twitter/user/verified_followers', ctx.key, {
			method: 'GET',
			query: { userName: input.userName, cursor: input.cursor },
		});

		if (response.users && ctx.db.users) {
			try {
				for (const user of response.users) {
					await ctx.db.users.upsertByEntityId(user.id, user);
				}
			} catch (error) {
				console.warn('[twitterapiio] Failed to save users to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.users.getVerifiedFollowers',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFollowings: TwitterApiIOEndpoints['usersGetFollowings'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['usersGetFollowings']
		>('/twitter/user/followings', ctx.key, {
			method: 'GET',
			query: { userName: input.userName, cursor: input.cursor },
		});

		if (response.users && ctx.db.users) {
			try {
				for (const user of response.users) {
					await ctx.db.users.upsertByEntityId(user.id, user);
				}
			} catch (error) {
				console.warn('[twitterapiio] Failed to save users to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.users.getFollowings',
			{ ...input },
			'completed',
		);
		return response;
	};

export const checkFollowRelationship: TwitterApiIOEndpoints['usersCheckFollowRelationship'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['usersCheckFollowRelationship']
		>('/twitter/user/follow_relation', ctx.key, {
			method: 'GET',
			query: {
				sourceUserName: input.sourceUserName,
				targetUserName: input.targetUserName,
			},
		});

		await logEventFromContext(
			ctx,
			'twitterapiio.users.checkFollowRelationship',
			{ ...input },
			'completed',
		);
		return response;
	};

export const follow: TwitterApiIOEndpoints['usersFollow'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['usersFollow']
	>('/twitter/user/follow', ctx.key, {
		method: 'POST',
		body: { followId: input.followId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.users.follow',
		{ followId: input.followId },
		'completed',
	);
	return response;
};

export const unfollow: TwitterApiIOEndpoints['usersUnfollow'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['usersUnfollow']
	>('/twitter/user/unfollow', ctx.key, {
		method: 'POST',
		body: { followId: input.followId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.users.unfollow',
		{ followId: input.followId },
		'completed',
	);
	return response;
};

export const login: TwitterApiIOEndpoints['usersLogin'] = async (
	ctx,
	input,
) => {
	const { userName, email, password, totpSecret, proxy } = input;
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['usersLogin']
	>('/twitter/user_login_v2', ctx.key, {
		method: 'POST',
		body: {
			user_name: userName,
			email,
			password,
			proxy,
			...(totpSecret ? { totp_secret: totpSecret } : {}),
		},
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.users.login',
		{ userName },
		'completed',
	);
	return response;
};

export const getMe: TwitterApiIOEndpoints['usersGetMe'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['usersGetMe']
	>('/twitter/user/me', ctx.key, {
		method: 'GET',
		query: { login_cookie: input.loginCookie },
	});

	if (response.data && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(response.data.id, response.data);
		} catch (error) {
			console.warn('[twitterapiio] Failed to save user to database:', error);
		}
	}

	await logEventFromContext(ctx, 'twitterapiio.users.getMe', {}, 'completed');
	return response;
};
