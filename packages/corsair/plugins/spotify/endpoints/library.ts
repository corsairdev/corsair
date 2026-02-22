import type { SpotifyEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const getLikedTracks: SpotifyEndpoints['libraryGetLikedTracks'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input.limit) {
		query.limit = input.limit;
	}
	if (input.offset) {
		query.offset = input.offset;
	}
	if (input.market) {
		query.market = input.market;
	}

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['libraryGetLikedTracks']
	>('me/tracks', ctx.key, {
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