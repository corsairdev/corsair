import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import {
	POST_BY_SLUG_QUERY,
	POST_QUERY,
	POSTS_QUERY,
	PUBLISH_POST_MUTATION,
	SEARCH_POSTS_OF_PUBLICATION_QUERY,
	UPDATE_POST_MUTATION,
} from './types';

export const get: HashnodeEndpoints['getPost'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['getPost']
	>(POST_QUERY, ctx.key, { id: input.id });

	await logEventFromContext(
		ctx,
		'hashnode.getPost',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const getBySlug: HashnodeEndpoints['getPostBySlug'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['getPostBySlug']
	>(POST_BY_SLUG_QUERY, ctx.key, { host: input.host, slug: input.slug });

	await logEventFromContext(
		ctx,
		'hashnode.getPostBySlug',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const list: HashnodeEndpoints['listPosts'] = async (ctx, input) => {
	const variables: Record<string, unknown> = {
		host: input.host,
		first: input.first ?? 10,
	};
	if (input.after) {
		variables.after = input.after;
	}
	if (input.filter) {
		variables.filter = input.filter;
	}

	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['listPosts']
	>(POSTS_QUERY, ctx.key, variables);

	await logEventFromContext(
		ctx,
		'hashnode.listPosts',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const publish: HashnodeEndpoints['publishPost'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['publishPost']
	>(PUBLISH_POST_MUTATION, ctx.key, { input });

	await logEventFromContext(
		ctx,
		'hashnode.publishPost',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const update: HashnodeEndpoints['updatePost'] = async (ctx, input) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['updatePost']
	>(UPDATE_POST_MUTATION, ctx.key, { input });

	await logEventFromContext(
		ctx,
		'hashnode.updatePost',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const search: HashnodeEndpoints['searchPostsOfPublication'] = async (
	ctx,
	input,
) => {
	const response = await makeHashnodeRequest<
		HashnodeEndpointOutputs['searchPostsOfPublication']
	>(SEARCH_POSTS_OF_PUBLICATION_QUERY, ctx.key, {
		first: input.first ?? 10,
		after: input.after,
		sortBy: input.sortBy,
		filter: input.filter,
	});

	await logEventFromContext(
		ctx,
		'hashnode.searchPostsOfPublication',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
