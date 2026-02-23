import type { SpotifyEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const get: SpotifyEndpoints['artistsGet'] = async (ctx, input) => {
	const result = await makeSpotifyRequest<SpotifyEndpointOutputs['artistsGet']>(
		`artists/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (result && ctx.db.artists) {
		try {
			await ctx.db.artists.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save artist to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'spotify.artists.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getAlbums: SpotifyEndpoints['artistsGetAlbums'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {...input};

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['artistsGetAlbums']
	>(`artists/${input.id}/albums`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.artists.getAlbums',
		{ ...input },
		'completed',
	);
	return result;
};

export const getRelatedArtists: SpotifyEndpoints['artistsGetRelatedArtists'] =
	async (ctx, input) => {
		const result = await makeSpotifyRequest<
			SpotifyEndpointOutputs['artistsGetRelatedArtists']
		>(`artists/${input.id}/related-artists`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'spotify.artists.getRelatedArtists',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getTopTracks: SpotifyEndpoints['artistsGetTopTracks'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | undefined> = {...input};

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['artistsGetTopTracks']
	>(`artists/${input.id}/top-tracks`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.artists.getTopTracks',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: SpotifyEndpoints['artistsSearch'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {...input};

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['artistsSearch']
	>('search', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.artists.search',
		{ ...input },
		'completed',
	);
	return result;
};