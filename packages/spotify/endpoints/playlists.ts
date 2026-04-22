import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedSpotifyRequest } from '../client';
import type { SpotifyEndpoints } from '../index';
import type { SpotifyEndpointOutputs } from './types';

export const addItem: SpotifyEndpoints['playlistsAddItem'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input.position !== undefined) {
		query.position = input.position;
	}

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playlistsAddItem']
	>(`playlists/${input.playlist_id}/tracks`, ctx, {
		method: 'POST',
		query,
		body: {
			uris: input.uris,
		},
	});

	await logEventFromContext(
		ctx,
		'spotify.playlists.addItem',
		{ ...input },
		'completed',
	);
	return result;
};

export const create: SpotifyEndpoints['playlistsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playlistsCreate']
	>(`users/${input.user_id}/playlists`, ctx, {
		method: 'POST',
		body: input,
	});

	if (result && ctx.db.playlists) {
		try {
			await ctx.db.playlists.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save playlist to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'spotify.playlists.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: SpotifyEndpoints['playlistsGet'] = async (ctx, input) => {
	const query: Record<string, string | undefined> = { ...input };

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playlistsGet']
	>(`playlists/${input.playlist_id}`, ctx, {
		method: 'GET',
		query,
	});

	if (result && ctx.db.playlists) {
		try {
			await ctx.db.playlists.upsertByEntityId(result.id, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save playlist to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'spotify.playlists.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getUserPlaylists: SpotifyEndpoints['playlistsGetUserPlaylists'] =
	async (ctx, input) => {
		const userId = input.user_id || 'me';
		const query: Record<string, string | number | undefined> = { ...input };

		const result = await makeAuthenticatedSpotifyRequest<
			SpotifyEndpointOutputs['playlistsGetUserPlaylists']
		>(`users/${userId}/playlists`, ctx, {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'spotify.playlists.getUserPlaylists',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getTracks: SpotifyEndpoints['playlistsGetTracks'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = { ...input };

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playlistsGetTracks']
	>(`playlists/${input.playlist_id}/tracks`, ctx, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.playlists.getTracks',
		{ ...input },
		'completed',
	);
	return result;
};

export const removeItem: SpotifyEndpoints['playlistsRemoveItem'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playlistsRemoveItem']
	>(`playlists/${input.playlist_id}/tracks`, ctx, {
		method: 'DELETE',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'spotify.playlists.removeItem',
		{ ...input },
		'completed',
	);
	return result;
};

export const search: SpotifyEndpoints['playlistsSearch'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = { ...input };

	const result = await makeAuthenticatedSpotifyRequest<
		SpotifyEndpointOutputs['playlistsSearch']
	>('search', ctx, {
		method: 'GET',
		query,
	});

	await logEventFromContext(
		ctx,
		'spotify.playlists.search',
		{ ...input },
		'completed',
	);
	return result;
};
