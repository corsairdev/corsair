import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import { makeRedditRequest } from '../client';
import { PostDataSchema } from './types';
import { extractComments, extractPosts, saveCommentsToDb, savePostsToDb } from './utils';
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

	const comments = extractComments(raw[1]);

	await savePostsToDb(ctx, post ? [post] : []);
	await saveCommentsToDb(ctx, comments);

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

	const posts = extractPosts(raw);
	await savePostsToDb(ctx, posts);

	await logEventFromContext(
		ctx,
		'reddit.posts.getById',
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
