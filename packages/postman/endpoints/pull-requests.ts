import { logEventFromContext } from 'corsair/core';
import type { PostmanEndpoints } from '..';
import { makePostmanRequest } from '../client';
import type { PostmanEndpointOutputs } from './types';

export const review: PostmanEndpoints['pullRequestsReview'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['pullRequestsReview']
	>('/pull-requests/{pullRequestId}/tasks', ctx.key, {
		method: 'POST',
		path: {
			pullRequestId: input.pullRequestId,
		},
		body: {
			action: input.action,
			comment: input.comment,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.pullRequests.review',
		{ ...input },
		'completed',
	);
	return response;
};

export const update: PostmanEndpoints['pullRequestsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makePostmanRequest<
		PostmanEndpointOutputs['pullRequestsUpdate']
	>('/pull-requests/{pullRequestId}', ctx.key, {
		method: 'PUT',
		path: {
			pullRequestId: input.pullRequestId,
		},
		body: {
			title: input.title,
			description: input.description,
			reviewers: input.reviewers,
		},
	});

	await logEventFromContext(
		ctx,
		'postman.pullRequests.update',
		{ ...input },
		'completed',
	);
	return response;
};
