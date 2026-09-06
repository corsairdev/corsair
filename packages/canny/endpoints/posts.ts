import { logEventFromContext } from 'corsair/core';
import { makeCannyRequest } from '../client';
import type { CannyEndpoints } from '../index';
import type { CannyEndpointOutputs } from './types';

export const list: CannyEndpoints['postsList'] = async (ctx, input) => {
	const response = await makeCannyRequest<CannyEndpointOutputs['postsList']>(
		'posts/list',
		ctx.key,
		{
			method: 'POST',
			body: input ? { ...input } : {},
		},
	);

	if (ctx.db.posts && response.posts) {
		for (const post of response.posts) {
			try {
				await ctx.db.posts.upsertByEntityId(post.id, {
					id: post.id,
					title: post.title,
					details: post.details,
					score: post.score,
					status: post.status,
					created: new Date(post.created),
					url: post.url,
					commentCount: post.commentCount,
					eta: post.eta,
					imageURLs: post.imageURLs,
					boardID: post.board?.id,
					authorID: post.author?.id,
				});
			} catch (error) {
				console.warn('Failed to persist post to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'canny.posts.list', { ...input }, 'completed');
	return response;
};

export const retrieve: CannyEndpoints['postsRetrieve'] = async (ctx, input) => {
	const response = await makeCannyRequest<
		CannyEndpointOutputs['postsRetrieve']
	>('posts/retrieve', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	if (ctx.db.posts && response.id) {
		try {
			await ctx.db.posts.upsertByEntityId(response.id, {
				id: response.id,
				title: response.title,
				details: response.details,
				score: response.score,
				status: response.status,
				created: new Date(response.created),
				url: response.url,
				commentCount: response.commentCount,
				eta: response.eta,
				imageURLs: response.imageURLs,
				boardID: response.board?.id,
				authorID: response.author?.id,
			});
		} catch (error) {
			console.warn('Failed to persist post to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.posts.retrieve',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: CannyEndpoints['postsCreate'] = async (ctx, input) => {
	const response = await makeCannyRequest<CannyEndpointOutputs['postsCreate']>(
		'posts/create',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);

	await logEventFromContext(
		ctx,
		'canny.posts.create',
		{ ...input, id: response.id },
		'completed',
	);
	return response;
};

export const changeStatus: CannyEndpoints['postsChangeStatus'] = async (
	ctx,
	input,
) => {
	const response = await makeCannyRequest<
		CannyEndpointOutputs['postsChangeStatus']
	>('posts/changeStatus', ctx.key, {
		method: 'POST',
		body: { ...input },
	});

	if (ctx.db.posts && response.id) {
		try {
			await ctx.db.posts.upsertByEntityId(response.id, {
				id: response.id,
				title: response.title,
				details: response.details,
				score: response.score,
				status: response.status,
				created: new Date(response.created),
				url: response.url,
				commentCount: response.commentCount,
				eta: response.eta,
				imageURLs: response.imageURLs,
				boardID: response.board?.id,
				authorID: response.author?.id,
			});
		} catch (error) {
			console.warn('Failed to persist post to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.posts.changeStatus',
		{ ...input },
		'completed',
	);
	return response;
};

export const deletePost: CannyEndpoints['postsDelete'] = async (ctx, input) => {
	const response = await makeCannyRequest<CannyEndpointOutputs['postsDelete']>(
		'posts/delete',
		ctx.key,
		{
			method: 'POST',
			body: { postID: input.postID },
		},
	);

	if (ctx.db.posts) {
		try {
			await ctx.db.posts.deleteByEntityId(input.postID);
		} catch (error) {
			console.warn('Failed to delete post from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.posts.delete',
		{ ...input },
		'completed',
	);
	return response;
};

export const Posts = {
	list,
	retrieve,
	create,
	changeStatus,
	delete: deletePost,
};
