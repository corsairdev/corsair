import { logEventFromContext } from '../../utils/events';
import type { SpotifyEndpoints } from '..';
import { makeAuthenticatedSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const getLikedTracks: SpotifyEndpoints['libraryGetLikedTracks'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = { ...input };

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['libraryGetLikedTracks']
	>('me/tracks', ctx, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.library.getLikedTracks',
		{ ...input },
		'completed',
	);
	return result;
};
