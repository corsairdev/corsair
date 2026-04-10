import { logEventFromContext } from 'corsair/core';
import type { SpotifyEndpoints } from '..';
import { makeAuthenticatedSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const get: SpotifyEndpoints['albumsGet'] = async (ctx, input) => {
	const query: Record<string, string | undefined> = {};
	if (input.market) {
		query.market = input.market;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['albumsGet']
	>(`albums/${input.id}`, ctx, {
		method: 'GET',
		query,
	});

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
	const query: Record<string, string | number | undefined> = { ...input };

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['albumsGetNewReleases']
	>('browse/new-releases', ctx, {
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
	const query: Record<string, string | number | undefined> = { ...input };

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['albumsGetTracks']
	>(`albums/${input.id}/tracks`, ctx, {
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

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['albumsSearch']
	>('search', ctx, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.albums.search',
		{ ...input },
		'completed',
	);
	return result;
};
