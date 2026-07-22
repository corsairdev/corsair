import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

export const createComment: LinkedInEndpoints['CreateComment'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['CreateComment']
	>(
		`/v2/socialActions/${encodeURIComponent(input.commented_on_urn)}/comments`,
		ctx,
		{
			method: 'POST',
			body: {
				actor: input.actor,
				object: input.commented_on_urn,
				message: { text: input.message },
			},
		},
	);

	await logEventFromContext(
		ctx,
		'linkedin.comments.create',
		{ ...input },
		'completed',
	);
	return result;
};
