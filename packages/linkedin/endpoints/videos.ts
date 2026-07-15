import { logEventFromContext } from 'corsair/core';
import { LinkedInAPIError, makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

type Query = Record<
	string,
	string | number | boolean | ReadonlyArray<string> | undefined
>;

export const getVideos: LinkedInEndpoints['GetVideos'] = async (ctx, input) => {
	const query: Query = {};

	if (input.video_urn) {
		query.q = 'urns';
		query.urns = input.video_urn;
	} else if (input.urns && input.urns.length > 0) {
		query.q = 'urns';
		// Pass the array through so the HTTP layer emits repeated urns= keys;
		// a comma-joined value is not a valid Restli multi-value for this finder.
		query.urns = input.urns;
	} else if (input.owner) {
		query.q = 'owner';
		query.owner = input.owner;
	} else {
		// LinkedIn's Videos finder requires q=urns|owner; calling without it
		// returns a 400. Schema refine should catch this first.
		throw new LinkedInAPIError(
			'getVideos requires video_urn, owner, or a non-empty urns list',
		);
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
