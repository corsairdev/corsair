import type { TwitterApiIOEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeTwitterApiIORequest } from '../client';
import { persistTweetWithAuthor } from '../utils';
import type { TwitterApiIOEndpointOutputs } from './types';

export const getById: TwitterApiIOEndpoints['communitiesGetById'] = async (ctx, input) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesGetById']
	>('/twitter/community/info', ctx.key, {
		method: 'GET',
		query: { communityId: input.communityId },
	});

	if (response.data && ctx.db.communities) {
		try {
			await ctx.db.communities.upsertByEntityId(response.data.id, response.data);
		} catch (error) {
			console.warn('[twitterapiio] Failed to save community to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.getById',
		{ ...input },
		'completed',
	);
	return response;
};

export const getMembers: TwitterApiIOEndpoints['communitiesGetMembers'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesGetMembers']
	>('/twitter/community/members', ctx.key, {
		method: 'GET',
		query: { communityId: input.communityId, cursor: input.cursor },
	});

	if (response.members && ctx.db.users) {
		try {
			for (const user of response.members) {
				await ctx.db.users.upsertByEntityId(user.id, user);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save users to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.getMembers',
		{ ...input },
		'completed',
	);
	return response;
};

export const getModerators: TwitterApiIOEndpoints['communitiesGetModerators'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesGetModerators']
	>('/twitter/community/moderators', ctx.key, {
		method: 'GET',
		query: { communityId: input.communityId, cursor: input.cursor },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.getModerators',
		{ ...input },
		'completed',
	);
	return response;
};

export const getTweets: TwitterApiIOEndpoints['communitiesGetTweets'] = async (ctx, input) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesGetTweets']
	>('/twitter/community/tweets', ctx.key, {
		method: 'GET',
		query: { communityId: input.communityId, cursor: input.cursor },
	});

	if (response.tweets) {
		try {
			for (const tweet of response.tweets) {
				await persistTweetWithAuthor(tweet, ctx.db);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save tweets to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.getTweets',
		{ ...input },
		'completed',
	);
	return response;
};

export const searchTweets: TwitterApiIOEndpoints['communitiesSearchTweets'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesSearchTweets']
	>('/twitter/tweet/advanced_search', ctx.key, {
		method: 'GET',
		query: { query: input.query, queryType: 'community', cursor: input.cursor },
	});

	if (response.tweets) {
		try {
			for (const tweet of response.tweets) {
				await persistTweetWithAuthor(tweet, ctx.db);
			}
		} catch (error) {
			console.warn('[twitterapiio] Failed to save tweets to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.searchTweets',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: TwitterApiIOEndpoints['communitiesCreate'] = async (ctx, input) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesCreate']
	>('/twitter/community/create', ctx.key, {
		method: 'POST',
		body: {
			name: input.name,
			description: input.description,
			login_cookie: input.loginCookie,
		},
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.create',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const deleteCommunity: TwitterApiIOEndpoints['communitiesDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesDelete']
	>('/twitter/community/delete', ctx.key, {
		method: 'POST',
		body: { communityId: input.communityId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.delete',
		{ communityId: input.communityId },
		'completed',
	);
	return response;
};

export const join: TwitterApiIOEndpoints['communitiesJoin'] = async (ctx, input) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesJoin']
	>('/twitter/community/join', ctx.key, {
		method: 'POST',
		body: { communityId: input.communityId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.join',
		{ communityId: input.communityId },
		'completed',
	);
	return response;
};

export const leave: TwitterApiIOEndpoints['communitiesLeave'] = async (ctx, input) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['communitiesLeave']
	>('/twitter/community/leave', ctx.key, {
		method: 'POST',
		body: { communityId: input.communityId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.communities.leave',
		{ communityId: input.communityId },
		'completed',
	);
	return response;
};
