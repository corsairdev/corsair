import { logEventFromContext } from 'corsair/core';
import type { TwitterApiIOEndpoints } from '..';
import { makeTwitterApiIORequest } from '../client';
import { persistTweetWithAuthor } from '../utils';
import type { TwitterApiIOEndpointOutputs } from './types';
import { buildAdvancedSearchQuery } from './types';

export const getByIds: TwitterApiIOEndpoints['tweetsGetByIds'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['tweetsGetByIds']
	>('/twitter/tweets', ctx.key, {
		method: 'GET',
		query: { tweet_ids: input.tweetIds },
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
		'twitterapiio.tweets.getByIds',
		{ ...input },
		'completed',
	);
	return response;
};

export const search: TwitterApiIOEndpoints['tweetsSearch'] = async (
	ctx,
	input,
) => {
	const { query, queryType, cursor } = input;
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['tweetsSearch']
	>('/twitter/tweet/advanced_search', ctx.key, {
		method: 'GET',
		query: { query, queryType, cursor },
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
		'twitterapiio.tweets.search',
		{ ...input },
		'completed',
	);
	return response;
};

export const advancedSearch: TwitterApiIOEndpoints['tweetsAdvancedSearch'] =
	async (ctx, input) => {
		const { cursor, queryType, ...queryBuilderInput } = input;
		const query = buildAdvancedSearchQuery(queryBuilderInput);

		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['tweetsAdvancedSearch']
		>('/twitter/tweet/advanced_search', ctx.key, {
			method: 'GET',
			query: { query, queryType: queryType ?? 'Latest', cursor },
		});

		if (response.tweets) {
			try {
				for (const tweet of response.tweets) {
					await persistTweetWithAuthor(tweet, ctx.db);
				}
			} catch (error) {
				console.warn(
					'[twitterapiio] Failed to save tweets to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.tweets.advancedSearch',
			{ query, queryType, cursor },
			'completed',
		);
		return response;
	};

export const getUserTimeline: TwitterApiIOEndpoints['tweetsGetUserTimeline'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['tweetsGetUserTimeline']
		>('/twitter/user/timeline', ctx.key, {
			method: 'GET',
			query: { userId: input.userId, cursor: input.cursor },
		});

		if (response.tweets) {
			try {
				for (const tweet of response.tweets) {
					await persistTweetWithAuthor(tweet, ctx.db);
				}
			} catch (error) {
				console.warn(
					'[twitterapiio] Failed to save tweets to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.tweets.getUserTimeline',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserLastTweets: TwitterApiIOEndpoints['tweetsGetUserLastTweets'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['tweetsGetUserLastTweets']
		>('/twitter/user/last_tweets', ctx.key, {
			method: 'GET',
			query: { userName: input.userName, cursor: input.cursor },
		});

		if (response.tweets) {
			try {
				for (const tweet of response.tweets) {
					await persistTweetWithAuthor(tweet, ctx.db);
				}
			} catch (error) {
				console.warn(
					'[twitterapiio] Failed to save tweets to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.tweets.getUserLastTweets',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUserMentions: TwitterApiIOEndpoints['tweetsGetUserMentions'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['tweetsGetUserMentions']
		>('/twitter/user/mentions', ctx.key, {
			method: 'GET',
			query: { userName: input.userName, cursor: input.cursor },
		});

		if (response.tweets) {
			try {
				for (const tweet of response.tweets) {
					await persistTweetWithAuthor(tweet, ctx.db);
				}
			} catch (error) {
				console.warn(
					'[twitterapiio] Failed to save tweets to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.tweets.getUserMentions',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getQuotations: TwitterApiIOEndpoints['tweetsGetQuotations'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['tweetsGetQuotations']
		>('/twitter/tweet/quotes', ctx.key, {
			method: 'GET',
			query: { tweetId: input.tweetId, cursor: input.cursor },
		});

		if (response.tweets) {
			try {
				for (const tweet of response.tweets) {
					await persistTweetWithAuthor(tweet, ctx.db);
				}
			} catch (error) {
				console.warn(
					'[twitterapiio] Failed to save tweets to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.tweets.getQuotations',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getRetweeters: TwitterApiIOEndpoints['tweetsGetRetweeters'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['tweetsGetRetweeters']
		>('/twitter/tweet/retweeters', ctx.key, {
			method: 'GET',
			query: { tweetId: input.tweetId, cursor: input.cursor },
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
			'twitterapiio.tweets.getRetweeters',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getThreadContext: TwitterApiIOEndpoints['tweetsGetThreadContext'] =
	async (ctx, input) => {
		const response = await makeTwitterApiIORequest<
			TwitterApiIOEndpointOutputs['tweetsGetThreadContext']
		>('/twitter/tweet/thread_context', ctx.key, {
			method: 'GET',
			query: { tweetId: input.tweetId, cursor: input.cursor },
		});

		if (response.tweets) {
			try {
				for (const tweet of response.tweets) {
					await persistTweetWithAuthor(tweet, ctx.db);
				}
			} catch (error) {
				console.warn(
					'[twitterapiio] Failed to save tweets to database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'twitterapiio.tweets.getThreadContext',
			{ ...input },
			'completed',
		);
		return response;
	};

export const create: TwitterApiIOEndpoints['tweetsCreate'] = async (
	ctx,
	input,
) => {
	const { tweet, loginCookie, replyToTweetId, mediaIds } = input;
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['tweetsCreate']
	>('/twitter/create_tweet', ctx.key, {
		method: 'POST',
		body: {
			tweet,
			login_cookie: loginCookie,
			...(replyToTweetId ? { reply_to_tweet_id: replyToTweetId } : {}),
			...(mediaIds ? { media_ids: mediaIds } : {}),
		},
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.tweets.create',
		{ tweet, replyToTweetId },
		'completed',
	);
	return response;
};

export const deleteTweet: TwitterApiIOEndpoints['tweetsDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['tweetsDelete']
	>('/twitter/tweet/delete', ctx.key, {
		method: 'POST',
		body: { tweetId: input.tweetId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.tweets.delete',
		{ tweetId: input.tweetId },
		'completed',
	);
	return response;
};

export const like: TwitterApiIOEndpoints['tweetsLike'] = async (ctx, input) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['tweetsLike']
	>('/twitter/tweet/like', ctx.key, {
		method: 'POST',
		body: { tweetId: input.tweetId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.tweets.like',
		{ tweetId: input.tweetId },
		'completed',
	);
	return response;
};

export const unlike: TwitterApiIOEndpoints['tweetsUnlike'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['tweetsUnlike']
	>('/twitter/tweet/unlike', ctx.key, {
		method: 'POST',
		body: { tweetId: input.tweetId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.tweets.unlike',
		{ tweetId: input.tweetId },
		'completed',
	);
	return response;
};

export const retweet: TwitterApiIOEndpoints['tweetsRetweet'] = async (
	ctx,
	input,
) => {
	const response = await makeTwitterApiIORequest<
		TwitterApiIOEndpointOutputs['tweetsRetweet']
	>('/twitter/tweet/retweet', ctx.key, {
		method: 'POST',
		body: { tweetId: input.tweetId, login_cookie: input.loginCookie },
	});

	await logEventFromContext(
		ctx,
		'twitterapiio.tweets.retweet',
		{ tweetId: input.tweetId },
		'completed',
	);
	return response;
};
