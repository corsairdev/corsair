import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditSubredditRequest } from '../client';

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

	const posts = raw.data.children
		.filter((child) => child.kind === 't3')
		.map((child) => child.data);

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
