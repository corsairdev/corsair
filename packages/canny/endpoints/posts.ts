import { logEventFromContext } from 'corsair/core';
import { makeCannyRequest } from '../client';
import type { CannyEndpoints } from '../index';
import { CannyEndpointInputSchemas, CannyEndpointOutputSchemas } from './types';

export const list: CannyEndpoints['postsList'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.postsList.parse(input);
	const raw = await makeCannyRequest<unknown>('posts/list', ctx.key, {
		method: 'POST',
		body: parsedInput ? { ...parsedInput } : {},
	});
	const response = CannyEndpointOutputSchemas.postsList.parse(raw);

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

	await logEventFromContext(
		ctx,
		'canny.posts.list',
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const retrieve: CannyEndpoints['postsRetrieve'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.postsRetrieve.parse(input);
	const raw = await makeCannyRequest<unknown>('posts/retrieve', ctx.key, {
		method: 'POST',
		body: { ...parsedInput },
	});
	const response = CannyEndpointOutputSchemas.postsRetrieve.parse(raw);

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
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const create: CannyEndpoints['postsCreate'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.postsCreate.parse(input);
	const raw = await makeCannyRequest<unknown>('posts/create', ctx.key, {
		method: 'POST',
		body: { ...parsedInput },
	});
	const response = CannyEndpointOutputSchemas.postsCreate.parse(raw);

	await logEventFromContext(
		ctx,
		'canny.posts.create',
		{ ...parsedInput, id: response.id },
		'completed',
	);
	return response;
};

export const changeStatus: CannyEndpoints['postsChangeStatus'] = async (
	ctx,
	input,
) => {
	const parsedInput = CannyEndpointInputSchemas.postsChangeStatus.parse(input);
	const raw = await makeCannyRequest<unknown>('posts/changeStatus', ctx.key, {
		method: 'POST',
		body: { ...parsedInput },
	});
	const response = CannyEndpointOutputSchemas.postsChangeStatus.parse(raw);

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
		{ ...parsedInput },
		'completed',
	);
	return response;
};

export const deletePost: CannyEndpoints['postsDelete'] = async (ctx, input) => {
	const parsedInput = CannyEndpointInputSchemas.postsDelete.parse(input);
	const raw = await makeCannyRequest<unknown>('posts/delete', ctx.key, {
		method: 'POST',
		body: { postID: parsedInput.postID },
	});
	const response = CannyEndpointOutputSchemas.postsDelete.parse(raw);

	if (ctx.db.posts) {
		try {
			await ctx.db.posts.deleteByEntityId(parsedInput.postID);
		} catch (error) {
			console.warn('Failed to delete post from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'canny.posts.delete',
		{ ...parsedInput },
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
