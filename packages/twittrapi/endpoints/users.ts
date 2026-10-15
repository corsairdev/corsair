import { logEventFromContext } from 'corsair/core';
import { makeTwittrApiRequest } from '../client';
import type { TwittrApiEndpoints } from '../index';
import { persistTweetWithAuthor, persistUsers } from '../utils';
import type { TwittrApiEndpointOutputs } from './types';

async function persistTweetPage(
	tweets: TwittrApiEndpointOutputs['usersGetTweets']['data'],
	db: Parameters<typeof persistTweetWithAuthor>[1],
) {
	for (const tweet of tweets ?? []) {
		if (!('unavailable' in tweet)) {
			try {
				await persistTweetWithAuthor(tweet, db);
			} catch {
				// best-effort
			}
		}
	}
}

export const getByUsername: TwittrApiEndpoints['usersGetByUsername'] = async (
	ctx,
	input,
) => {
	const username = input.username.replace(/^@/, '');
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersGetByUsername']
	>(`/user/by/username/${encodeURIComponent(username)}`, ctx.key, {
		method: 'GET',
		query: { format: 'simple' },
	});

	if (response.data) {
		try {
			await persistUsers([response.data], ctx.db);
		} catch {
			// best-effort
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.users.getByUsername',
		{ ...input },
		'completed',
	);
	return response;
};

export const getById: TwittrApiEndpoints['usersGetById'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersGetById']
	>(`/user/${encodeURIComponent(input.userId)}`, ctx.key, {
		method: 'GET',
		query: { username: input.username, format: 'simple' },
	});

	if (response.data) {
		try {
			await persistUsers([response.data], ctx.db);
		} catch {
			// best-effort
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.users.getById',
		{ ...input },
		'completed',
	);
	return response;
};

export const batchGetByIds: TwittrApiEndpoints['usersBatchGetByIds'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersBatchGetByIds']
	>('/user/users/by/ids', ctx.key, {
		method: 'GET',
		query: { ids: input.ids, format: 'simple' },
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.users.batchGetByIds',
		{ ...input },
		'completed',
	);
	return response;
};

export const getTweets: TwittrApiEndpoints['usersGetTweets'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersGetTweets']
	>(`/user/${encodeURIComponent(input.userId)}/tweets`, ctx.key, {
		method: 'GET',
		query: {
			username: input.username,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	await persistTweetPage(response.data, ctx.db);
	await logEventFromContext(
		ctx,
		'twittrapi.users.getTweets',
		{ ...input },
		'completed',
	);
	return response;
};

export const getTweetsAndReplies: TwittrApiEndpoints['usersGetTweetsAndReplies'] =
	async (ctx, input) => {
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['usersGetTweetsAndReplies']
		>(`/user/${encodeURIComponent(input.userId)}/tweetsAndReplies`, ctx.key, {
			method: 'GET',
			query: {
				username: input.username,
				count: input.count,
				cursor: input.cursor,
				format: 'simple',
			},
		});

		await persistTweetPage(response.data, ctx.db);
		await logEventFromContext(
			ctx,
			'twittrapi.users.getTweetsAndReplies',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getMedia: TwittrApiEndpoints['usersGetMedia'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersGetMedia']
	>(`/user/${encodeURIComponent(input.userId)}/media`, ctx.key, {
		method: 'GET',
		query: {
			username: input.username,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	await persistTweetPage(response.data, ctx.db);
	await logEventFromContext(
		ctx,
		'twittrapi.users.getMedia',
		{ ...input },
		'completed',
	);
	return response;
};

export const getLikes: TwittrApiEndpoints['usersGetLikes'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersGetLikes']
	>(`/user/${encodeURIComponent(input.userId)}/likes`, ctx.key, {
		method: 'GET',
		query: {
			username: input.username,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	await persistTweetPage(response.data, ctx.db);
	await logEventFromContext(
		ctx,
		'twittrapi.users.getLikes',
		{ ...input },
		'completed',
	);
	return response;
};

export const getFollowers: TwittrApiEndpoints['usersGetFollowers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersGetFollowers']
	>(`/user/${encodeURIComponent(input.userId)}/followers`, ctx.key, {
		method: 'GET',
		query: {
			username: input.username,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.users.getFollowers',
		{ ...input },
		'completed',
	);
	return response;
};

export const getFollowings: TwittrApiEndpoints['usersGetFollowings'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersGetFollowings']
	>(`/user/${encodeURIComponent(input.userId)}/followings`, ctx.key, {
		method: 'GET',
		query: {
			username: input.username,
			count: input.count,
			cursor: input.cursor,
			format: 'simple',
		},
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.users.getFollowings',
		{ ...input },
		'completed',
	);
	return response;
};

export const getVerifiedFollowers: TwittrApiEndpoints['usersGetVerifiedFollowers'] =
	async (ctx, input) => {
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['usersGetVerifiedFollowers']
		>(`/user/${encodeURIComponent(input.userId)}/verifiedFollowers`, ctx.key, {
			method: 'GET',
			query: {
				username: input.username,
				count: input.count,
				cursor: input.cursor,
				format: 'simple',
			},
		});

		try {
			await persistUsers(response.data ?? [], ctx.db);
		} catch {
			// best-effort
		}

		await logEventFromContext(
			ctx,
			'twittrapi.users.getVerifiedFollowers',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFriendship: TwittrApiEndpoints['usersGetFriendship'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersGetFriendship']
	>('/user/friendships/show', ctx.key, {
		method: 'GET',
		query: {
			source_screen_name: input.sourceScreenName,
			target_screen_name: input.targetScreenName,
			format: 'simple',
		},
	});

	await logEventFromContext(
		ctx,
		'twittrapi.users.getFriendship',
		{ ...input },
		'completed',
	);
	return response;
};

export const resolveIds: TwittrApiEndpoints['usersResolveIds'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['usersResolveIds']
	>('/user/usernames/to/ids', ctx.key, {
		method: 'GET',
		query: { usernames: input.usernames, format: 'simple' },
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.users.resolveIds',
		{ ...input },
		'completed',
	);
	return response;
};
