import type { SpotifyEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const get: SpotifyEndpoints['tracksGet'] = async (ctx, input) => {
	const query: Record<string, string | undefined> = {};
	if (input.market) {
		query.market = input.market;
	}

	const result = await makeSpotifyRequest<SpotifyEndpointOutputs['tracksGet']>(
		`tracks/${input.id}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (result && ctx.db.tracks) {
		try {
			await ctx.db.tracks.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save track to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'spotify.tracks.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getAudioFeatures: SpotifyEndpoints['tracksGetAudioFeatures'] =
	async (ctx, input) => {
		const result = await makeSpotifyRequest<
			SpotifyEndpointOutputs['tracksGetAudioFeatures']
		>(`audio-features/${input.id}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'spotify.tracks.getAudioFeatures',
			{ ...input },
			'completed',
		);
		return result;
	};

export const search: SpotifyEndpoints['tracksSearch'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {
		q: input.q,
		type: input.type || 'track',
	};
	if (input.market) {
		query.market = input.market;
	}
	if (input.limit) {
		query.limit = input.limit;
	}
	if (input.offset) {
		query.offset = input.offset;
	}

	const result = await makeSpotifyRequest<SpotifyEndpointOutputs['tracksSearch']>(
		'search',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'spotify.tracks.search',
		{ ...input },
		'completed',
	);
	return result;
};