import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { InstagramEndpointOutputs } from './types';

export const getComments: InstagramEndpoints['GetPostComments'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetPostComments']
	>(`/${input.post_id}/comments`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.post.comments',
		{ ...input },
		'completed',
	);

	return result;
};

export const getInsights: InstagramEndpoints['GetPostInsights'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetPostInsights']
	>(`/${input.post_id}/insights`, ctx, {
		method: 'GET',
		query: {
			metric: input.metrics.join(','),
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.post.insights',
		{ ...input },
		'completed',
	);

	return result;
};

export const getStatus: InstagramEndpoints['GetPostStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetPostStatus']
	>(`/${input.container_id}`, ctx, {
		method: 'GET',
		query: {
			fields: 'status_code',
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.post.status',
		{ ...input },
		'completed',
	);

	return result;
};
