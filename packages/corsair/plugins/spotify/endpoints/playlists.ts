import type { SpotifyEndpoints } from '..';
import { logEventFromContext } from '../../utils/events';
import { makeSpotifyRequest } from '../client';
import type { SpotifyEndpointOutputs } from './types';

export const addItem: SpotifyEndpoints['playlistsAddItem'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | undefined> = {};
	if (input.position !== undefined) {
		query.position = input.position;
	}

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playlistsAddItem']
	>(`playlists/${input.playlist_id}/tracks`, ctx.key, {
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
	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playlistsCreate']
	>(`users/${input.user_id}/playlists`, ctx.key, {
		method: 'POST',
		body: input
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
	const query: Record<string, string | undefined> = {...input};
	

	const result = await makeSpotifyRequest<SpotifyEndpointOutputs['playlistsGet']>(
		`playlists/${input.playlist_id}`,
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

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
		const query: Record<string, string | number | undefined> = {...input};

		const result = await makeSpotifyRequest<
			SpotifyEndpointOutputs['playlistsGetUserPlaylists']
		>(`users/${userId}/playlists`, ctx.key, {
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
	const query: Record<string, string | number | undefined> = {...input};

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playlistsGetTracks']
	>(`playlists/${input.playlist_id}/tracks`, ctx.key, {
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

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playlistsRemoveItem']
	>(`playlists/${input.playlist_id}/tracks`, ctx.key, {
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

export const search: SpotifyEndpoints['playlistsSearch'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {...input};

	const result = await makeSpotifyRequest<
		SpotifyEndpointOutputs['playlistsSearch']
	>('search', ctx.key, {
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