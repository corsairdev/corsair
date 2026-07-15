import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

export const createPost: LinkedInEndpoints['CreatePost'] = async (
	ctx,
	input,
) => {
	const body: Record<string, unknown> = {
		author: input.author,
		commentary: input.commentary,
		visibility: input.visibility ?? 'PUBLIC',
		lifecycleState: input.lifecycleState ?? 'PUBLISHED',
	};

	if (input.isReshareDisabledByAuthor !== undefined) {
		body.isReshareDisabledByAuthor = input.isReshareDisabledByAuthor;
	}

	const content: Record<string, unknown> = {};
	if (input.article_url) {
		const article: Record<string, unknown> = { source: input.article_url };
		if (input.article_title) article.title = input.article_title;
		if (input.article_description)
			article.description = input.article_description;
		content.article = article;
	}
	if (input.image_urn) {
		content.media = { id: input.image_urn };
	}
	if (Object.keys(content).length > 0) {
		body.content = content;
	}

	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['CreatePost']
	>('/rest/posts', ctx, { method: 'POST', body });

	await logEventFromContext(
		ctx,
		'linkedin.posts.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const createArticleShare: LinkedInEndpoints['CreateArticleShare'] =
	async (ctx, input) => {
		const media: Record<string, unknown> = { originalUrl: input.article_url };
		if (input.article_title) media.title = { text: input.article_title };
		if (input.article_description)
			media.description = { text: input.article_description };
		if (input.article_thumbnail) media.thumbnail = input.article_thumbnail;

		const body = {
			author: input.authorUrn,
			lifecycleState: input.lifecycleState ?? 'PUBLISHED',
			specificContent: {
				'com.linkedin.ugc.ShareContent': {
					shareCommentary: { text: input.text ?? '' },
					shareMediaCategory: 'ARTICLE',
					media: [media],
				},
			},
			visibility: {
				'com.linkedin.ugc.MemberNetworkVisibility':
					input.visibility ?? 'PUBLIC',
			},
		};

		const result = await makeAuthenticatedLinkedInRequest<
			LinkedInEndpointOutputs['CreateArticleShare']
		>('/v2/ugcPosts', ctx, { method: 'POST', body });

		await logEventFromContext(
			ctx,
			'linkedin.posts.createArticleShare',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getPostContent: LinkedInEndpoints['GetPostContent'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetPostContent']
	>(`/rest/posts/${encodeURIComponent(input.post_urn)}`, ctx, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'linkedin.posts.getContent',
		{ ...input },
		'completed',
	);
	return result;
};

export const deletePost: LinkedInEndpoints['DeletePost'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedLinkedInRequest<void>(
		`/rest/posts/${encodeURIComponent(input.post_id)}`,
		ctx,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'linkedin.posts.delete',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const deleteSharePost: LinkedInEndpoints['DeleteSharePost'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedLinkedInRequest<void>(
		`/v2/shares/${encodeURIComponent(input.share_id)}`,
		ctx,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'linkedin.posts.deleteShare',
		{ ...input },
		'completed',
	);
	return { success: true };
};

export const deleteUgcPost: LinkedInEndpoints['DeleteUgcPost'] = async (
	ctx,
	input,
) => {
	await makeAuthenticatedLinkedInRequest<void>(
		`/v2/ugcPosts/${encodeURIComponent(input.ugc_post_urn)}`,
		ctx,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'linkedin.posts.deleteUgc',
		{ ...input },
		'completed',
	);
	return { success: true };
};
