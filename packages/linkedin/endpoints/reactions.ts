import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

export const listReactions: LinkedInEndpoints['ListReactions'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['ListReactions']
	>(
		`/v2/socialActions/${encodeURIComponent(input.entity_urn)}/reactions`,
		ctx,
		{
			method: 'GET',
			query: { start: input.start, count: input.count },
		},
	);

	await logEventFromContext(
		ctx,
		'linkedin.reactions.list',
		{ ...input },
		'completed',
	);
	return result;
};
