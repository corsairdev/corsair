import { logEventFromContext } from 'corsair/core';
import type { RedditEndpoints } from '..';
import {
	makeRedditGlobalRequest,
	makeRedditPostRequest,
} from '../client';
import { CommentDataSchema, PostDataSchema } from './types';

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

export const getComments: RedditEndpoints['postsGetComments'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditPostRequest<
		[RedditListingResponse, RedditListingResponse]
	>(input.post_id, {
		query: {
			limit: input.limit,
			depth: input.depth,
			context: input.context,
			sort: input.sort,
		},
	});

	const postRaw = raw[0].data.children.find((c) => c.kind === 't3');
	const post = PostDataSchema.parse(postRaw?.data ?? {});

	const comments = raw[1].data.children
		.filter((child) => child.kind === 't1')
		.map((child) => CommentDataSchema.parse(child.data));

	if (ctx.db.comments) {
		try {
			for (const comment of comments) {
				await ctx.db.comments.upsertByEntityId(String(comment.id), {
					id: comment.id,
					name: comment.name,
					body: comment.body,
					author: comment.author,
					score: comment.score,
					depth: comment.depth,
					parent_id: comment.parent_id,
					link_id: comment.link_id,
					created_utc: comment.created_utc,
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

export const getById: RedditEndpoints['postsGetById'] = async (
	ctx,
	input,
) => {
	const raw = await makeRedditGlobalRequest<RedditListingResponse>(
		`/by_id/${input.names}.json`,
	);

	const posts = raw.data.children
		.filter((child) => child.kind === 't3')
		.map((child) => PostDataSchema.parse(child.data));

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
