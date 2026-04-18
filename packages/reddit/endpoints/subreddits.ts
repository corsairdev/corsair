import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditRequest } from '../client';
import { SubredditDataSchema } from './types';
import type { RedditEntityEnvelopeRaw, RedditListingRaw } from './types';
import { extractPosts, savePostsToDb, saveSubredditsToDb } from './utils';

export const getHot: RedditEndpoints['subredditsGetHot'] = async (
	ctx,
	input,
) => {
	const { subreddit, ...query } = input;
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/r/${subreddit}/hot.json`,
		{ query },
	);

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.subreddits.getHot',
		{ ...input },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const getNew: RedditEndpoints['subredditsGetNew'] = async (
	ctx,
	input,
) => {
	const { subreddit, ...query } = input;
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/r/${subreddit}/new.json`,
		{ query },
	);

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.subreddits.getNew',
		{ ...input },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const getTop: RedditEndpoints['subredditsGetTop'] = async (
	ctx,
	input,
) => {
	const { subreddit, ...query } = input;
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/r/${subreddit}/top.json`,
		{ query },
	);

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.subreddits.getTop',
		{ ...input },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const getRising: RedditEndpoints['subredditsGetRising'] = async (
	ctx,
	input,
) => {
	const { subreddit, ...query } = input;
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/r/${subreddit}/rising.json`,
		{ query },
	);

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.subreddits.getRising',
		{ ...input },
		'completed',
	);

	return {
		posts,
		after: raw.data.after,
		before: raw.data.before,
		dist: raw.data.dist ?? posts.length,
	};
};

export const getControversial: RedditEndpoints['subredditsGetControversial'] =
	async (ctx, input) => {
		const { subreddit, ...query } = input;
		const raw = await makeRedditRequest<RedditListingRaw>(
			`/r/${subreddit}/controversial.json`,
		{
			query,
		},
		);

		const posts = extractPosts(raw);
		await savePostsToDb(ctx, posts);

		await logEventFromContext(
			ctx,
			'reddit.subreddits.getControversial',
			{ ...input },
			'completed',
		);

		return {
			posts,
			after: raw.data.after,
			before: raw.data.before,
			dist: raw.data.dist ?? posts.length,
		};
	};

export const getAbout: RedditEndpoints['subredditsGetAbout'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditRequest<RedditEntityEnvelopeRaw>(
		`/r/${input.subreddit}/about.json`,
	);

	const subreddit = SubredditDataSchema.parse(raw.data);
	await saveSubredditsToDb(ctx, [subreddit]);

	await logEventFromContext(
		ctx,
		'reddit.subreddits.getAbout',
		{ ...input },
		'completed',
	);

	return subreddit;
};
