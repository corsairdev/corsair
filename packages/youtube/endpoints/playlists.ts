import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const list: YoutubeEndpoints['playlistsList'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['playlistsList']
	>('/playlists', ctx.key, {
		method: 'GET',
		query: {
			mine: 'true',
			part: input.part ?? 'snippet,status,contentDetails',
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
		},
	});

	if (response.items && ctx.db.playlists) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.playlists.upsertByEntityId(item.id, {
					...item.snippet,
					...item.status,
					...item.contentDetails,
					id: item.id,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save playlist to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'youtube.playlists.list', {}, 'completed');
	return response;
};

export const create: YoutubeEndpoints['playlistsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['playlistsCreate']
	>('/playlists', ctx.key, {
		method: 'POST',
		query: { part: 'snippet,status' },
		body: {
			snippet: { title: input.title, description: input.description },
			status: { privacyStatus: input.privacyStatus ?? 'private' },
		},
	});

	if (response.id && ctx.db.playlists) {
		try {
			await ctx.db.playlists.upsertByEntityId(response.id, {
				...response.snippet,
				...response.status,
				id: response.id,
			});
		} catch (error) {
			console.warn('[youtube] Failed to save playlist to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.playlists.create',
		{ title: input.title },
		'completed',
	);
	return response;
};

export const update: YoutubeEndpoints['playlistsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['playlistsUpdate']
	>('/playlists', ctx.key, {
		method: 'PUT',
		query: { part: input.part ?? 'snippet,status' },
		body: {
			id: input.id,
			snippet: input.snippet,
			...(input.status && { status: input.status }),
		},
	});

	if (response.id && ctx.db.playlists) {
		try {
			await ctx.db.playlists.upsertByEntityId(response.id, {
				...response.snippet,
				...response.status,
				id: response.id,
			});
		} catch (error) {
			console.warn('[youtube] Failed to update playlist in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.playlists.update',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const del: YoutubeEndpoints['playlistsDelete'] = async (ctx, input) => {
	await makeYoutubeRequest<void>('/playlists', ctx.key, {
		method: 'DELETE',
		query: { id: input.id },
	});

	await logEventFromContext(
		ctx,
		'youtube.playlists.delete',
		{ id: input.id },
		'completed',
	);
	return { deleted: true, playlist_id: input.id, http_status: 204 };
};
