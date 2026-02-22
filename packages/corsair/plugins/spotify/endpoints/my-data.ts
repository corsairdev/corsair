import type { SpotifyEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const getFollowedArtists: SpotifyEndpoints['myDataGetFollowedArtists'] =
	async (ctx, input) => {
		const query: Record<string, string | number | undefined> = {
			type: input.type || 'artist',
		};
		if (input.limit) {
			query.limit = input.limit;
		}
		if (input.after) {
			query.after = input.after;
		}

		const result = await makeSpotifyRequest<
			SpotifyEndpointOutputs['myDataGetFollowedArtists']
		>('me/following', ctx.key, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'spotify.myData.getFollowedArtists',
			{ ...input },
			'completed',
		);
		return result;
	};