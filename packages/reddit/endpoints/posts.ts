import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditRequest } from '../client';
import { CommentDataSchema, PostDataSchema } from './types';
import type { RedditListingRaw } from './types';

export const getComments: RedditEndpoints['postsGetComments'] = async (
	ctx,
	input,
) => {
	const { post_id, ...query } = input;
	const raw = await makeRedditRequest<[RedditListingRaw, RedditListingRaw]>(
		`/comments/${post_id}.json`,
		{ query },
	);

	const postRaw = raw[0].data.children.find((c) => c.kind === 't3'); // t3 = link/post
	const post = PostDataSchema.parse(postRaw?.data ?? {});

	const comments = raw[1].data.children
		.filter((child) => child.kind === 't1') // t1 = comment
		try {
			for (const comment of comments) {
				await ctx.db.comments.upsertByEntityId(String(comment.id), {
					...comment,
				});
			}
		} catch (error) {
			console.warn('Failed to save comments to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'reddit.posts.getComments',
		{ ...input },
		'completed',
	);

	return {
		post,
		comments,
		after: raw[1].data.after,
		before: raw[1].data.before,
	};
};

export const getById: RedditEndpoints['postsGetById'] = async (ctx, input) => {
	const raw = await makeRedditRequest<RedditListingRaw>(
		`/by_id/${input.names}.json`,
	);

	const posts = raw.data.children
		.filter((child) => child.kind === 't3') // t3 = link/post
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
