import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import {
	HashnodeEndpointOutputSchemas,
	POST_BY_SLUG_QUERY,
	POST_QUERY,
	POSTS_QUERY,
	PUBLISH_POST_MUTATION,
	SEARCH_POSTS_OF_PUBLICATION_QUERY,
	UPDATE_POST_MUTATION,
} from './types';

export const get: HashnodeEndpoints['getPost'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		POST_QUERY,
		ctx.key,
		{ id: input.id },
		HashnodeEndpointOutputSchemas.getPost,
	);

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
	const response = await makeHashnodeRequest(
		POST_BY_SLUG_QUERY,
		ctx.key,
		{ host: input.host, slug: input.slug },
		HashnodeEndpointOutputSchemas.getPostBySlug,
	);

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

	const response = await makeHashnodeRequest(
		POSTS_QUERY,
		ctx.key,
		variables,
		HashnodeEndpointOutputSchemas.listPosts,
	);

	await logEventFromContext(
		ctx,
		'hashnode.listPosts',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const publish: HashnodeEndpoints['publishPost'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		PUBLISH_POST_MUTATION,
		ctx.key,
		{ input },
		HashnodeEndpointOutputSchemas.publishPost,
	);

	await logEventFromContext(
		ctx,
		'hashnode.publishPost',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};

export const update: HashnodeEndpoints['updatePost'] = async (ctx, input) => {
	const response = await makeHashnodeRequest(
		UPDATE_POST_MUTATION,
		ctx.key,
		{ input },
		HashnodeEndpointOutputSchemas.updatePost,
	);

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
	const response = await makeHashnodeRequest(
		SEARCH_POSTS_OF_PUBLICATION_QUERY,
		ctx.key,
		{
			first: input.first ?? 10,
			after: input.after,
			sortBy: input.sortBy,
			filter: input.filter,
		},
		HashnodeEndpointOutputSchemas.searchPostsOfPublication,
	);

	await logEventFromContext(
		ctx,
		'hashnode.searchPostsOfPublication',
		redactEventPayload(input as Record<string, unknown>),
		'completed',
	);
	return response;
};
