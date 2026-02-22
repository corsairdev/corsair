import type { SpotifyEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const get: SpotifyEndpoints['albumsGet'] = async (ctx, input) => {
	const query: Record<string, string | undefined> = {};
	if (input.market) {
		query.market = input.market;
	}

	const result = await makeSpotifyRequest<SpotifyEndpointOutputs['albumsGet']>(
		`albums/${input.id}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (result && ctx.db.albums) {
		try {
			await ctx.db.albums.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save album to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'spotify.albums.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getNewReleases: SpotifyEndpoints['albumsGetNewReleases'] = async (
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
	if (input.country) {
		query.country = input.country;
	}

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['albumsGetNewReleases']
	>('browse/new-releases', ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.albums.getNewReleases',
		{ ...input },
		'completed',
	);
	return result;
};

export const getTracks: SpotifyEndpoints['albumsGetTracks'] = async (
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
		SpotifyEndpointOutputs['albumsGetTracks']
	>(`albums/${input.id}/tracks`, ctx.key, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.albums.getTracks',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: SpotifyEndpoints['albumsSearch'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {
		q: input.q,
		type: input.type || 'album',
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

	const result = await makeSpotifyRequest<SpotifyEndpointOutputs['albumsSearch']>(
		'search',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	await logEventFromContext(
		ctx,
		'spotify.albums.search',
		{ ...input },
		'completed',
	);
	return result;
};