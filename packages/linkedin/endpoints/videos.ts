import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

export const getVideos: LinkedInEndpoints['GetVideos'] = async (ctx, input) => {
	const query: Record<string, string | number | boolean | undefined> = {};

	if (input.video_urn) {
		query.q = 'urns';
		query.urns = input.video_urn;
	} else if (input.urns && input.urns.length > 0) {
		query.q = 'urns';
		query.urns = input.urns.join(',');
	} else if (input.owner) {
		query.q = 'owner';
		query.owners = input.owner;
	}

	if (input.start !== undefined) query.start = input.start;
	if (input.count !== undefined) query.count = input.count;

	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetVideos']
	>('/v2/videos', ctx, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'linkedin.videos.list',
		{ ...input },
		'completed',
	);
	return result;
};
