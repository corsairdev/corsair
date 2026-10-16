import { logEventFromContext } from 'corsair/core';
import { makeTwittrApiRequest } from '../client';
import type { TwittrApiEndpoints } from '../index';
import { asArray, persistTweetWithAuthor, persistUsers } from '../utils';
import type { TwittrApiEndpointOutputs } from './types';

export const search: TwittrApiEndpoints['communitiesSearch'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['communitiesSearch']
	>(`/communities/search/${encodeURIComponent(input.searchTerm)}`, ctx.key, {
		method: 'GET',
		query: { count: input.count, cursor: input.cursor, format: 'simple' },
	});

	if (response.data && ctx.db.communities) {
		for (const community of response.data) {
			try {
				await ctx.db.communities.upsertByEntityId(community.id, community);
			} catch {
				// best-effort
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.communities.search',
		{ ...input },
		'completed',
	);
	return response;
};

export const getById: TwittrApiEndpoints['communitiesGetById'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['communitiesGetById']
	>(`/communities/${encodeURIComponent(input.communityId)}`, ctx.key, {
		method: 'GET',
		query: { format: 'simple' },
	});

	if (response.data && ctx.db.communities) {
		try {
			await ctx.db.communities.upsertByEntityId(
				response.data.id,
				response.data,
			);
		} catch {
			// best-effort
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.communities.getById',
		{ ...input },
		'completed',
	);
	return response;
};

export const getTweets: TwittrApiEndpoints['communitiesGetTweets'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['communitiesGetTweets']
	>(`/communities/${encodeURIComponent(input.communityId)}/tweets`, ctx.key, {
		method: 'GET',
		query: { count: input.count, cursor: input.cursor, format: 'simple' },
	});

	for (const tweet of asArray(response.data)) {
		if (!('unavailable' in tweet)) {
			try {
				await persistTweetWithAuthor(tweet, ctx.db);
			} catch {
				// best-effort
			}
		}
	}

	await logEventFromContext(
		ctx,
		'twittrapi.communities.getTweets',
		{ ...input },
		'completed',
	);
	return response;
};

export const getMembers: TwittrApiEndpoints['communitiesGetMembers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwittrApiRequest<
		TwittrApiEndpointOutputs['communitiesGetMembers']
	>(`/communities/${encodeURIComponent(input.communityId)}/members`, ctx.key, {
		method: 'GET',
		query: { count: input.count, cursor: input.cursor, format: 'simple' },
	});

	try {
		await persistUsers(response.data ?? [], ctx.db);
	} catch {
		// best-effort
	}

	await logEventFromContext(
		ctx,
		'twittrapi.communities.getMembers',
		{ ...input },
		'completed',
	);
	return response;
};

export const getModerators: TwittrApiEndpoints['communitiesGetModerators'] =
	async (ctx, input) => {
		const response = await makeTwittrApiRequest<
			TwittrApiEndpointOutputs['communitiesGetModerators']
		>(
			`/communities/${encodeURIComponent(input.communityId)}/moderators`,
			ctx.key,
			{
				method: 'GET',
				query: {
					count: input.count,
					cursor: input.cursor,
					format: 'simple',
				},
			},
		);

		try {
			await persistUsers(response.data ?? [], ctx.db);
		} catch {
			// best-effort
		}

		await logEventFromContext(
			ctx,
			'twittrapi.communities.getModerators',
			{ ...input },
			'completed',
		);
		return response;
	};
