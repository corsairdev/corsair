import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditSubredditRequest } from '../client';
import { PostDataSchema, SubredditDataSchema } from './types';

type RedditListingResponse = {
	kind: 'Listing';
	data: {
		modhash: string | null;
		dist: number | null;
		after: string | null;
		before: string | null;
		children: Array<{
			kind: string;
			data: Record<string, any>;
		}>;
	};
};

type SubredditAboutResponse = {
	kind: string;
	data: Record<string, any>;
};

function parsePosts(raw: RedditListingResponse) {
	return raw.data.children
		.filter((child) => child.kind === 't3')
		.map((child) => PostDataSchema.parse(child.data));
}

export const getHot: RedditEndpoints['subredditsGetHot'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditSubredditRequest<RedditListingResponse>(
		input.subreddit,
		'hot',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
			},
		},
	);

	const posts = parsePosts(raw);

	if (ctx.db.posts) {
		try {
			for (const post of posts) {
				await ctx.db.posts.upsertByEntityId(String(post.id), {
					id: post.id,
					name: post.name,
					title: post.title,
					author: post.author,
					subreddit: post.subreddit,
					score: post.score,
					url: post.url,
					selftext: post.selftext,
					num_comments: post.num_comments,
					permalink: post.permalink,
					over_18: post.over_18,
					created_utc: post.created_utc,
				});
			}
		} catch (error) {
			console.warn('Failed to save hot posts to database:', error);
		}
	}

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
	const raw = await makeRedditSubredditRequest<RedditListingResponse>(
		input.subreddit,
		'new',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
			},
		},
	);

	const posts = parsePosts(raw);

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
	const raw = await makeRedditSubredditRequest<RedditListingResponse>(
		input.subreddit,
		'top',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
				t: input.t,
			},
		},
	);

	const posts = parsePosts(raw);

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
	const raw = await makeRedditSubredditRequest<RedditListingResponse>(
		input.subreddit,
		'rising',
		{
			query: {
				limit: input.limit,
				after: input.after,
				before: input.before,
				count: input.count,
			},
		},
	);

	const posts = parsePosts(raw);

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
		const raw = await makeRedditSubredditRequest<RedditListingResponse>(
			input.subreddit,
			'controversial',
			{
				query: {
					limit: input.limit,
					after: input.after,
					before: input.before,
					count: input.count,
					t: input.t,
				},
			},
		);

		const posts = parsePosts(raw);

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
	const raw = await makeRedditSubredditRequest<SubredditAboutResponse>(
		input.subreddit,
		'about',
	);

	const subreddit = SubredditDataSchema.parse(raw.data);

	if (ctx.db.subreddits) {
		try {
			await ctx.db.subreddits.upsertByEntityId(String(subreddit.id), {
				id: subreddit.id,
				name: subreddit.name,
				display_name: subreddit.display_name,
				title: subreddit.title,
				public_description: subreddit.public_description,
				subscribers: subreddit.subscribers,
				active_user_count: subreddit.active_user_count ?? undefined,
				over18: subreddit.over18,
				created_utc: subreddit.created_utc,
			});
		} catch (error) {
			console.warn('Failed to save subreddit to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'reddit.subreddits.getAbout',
		{ ...input },
		'completed',
	);

	return subreddit;
};
