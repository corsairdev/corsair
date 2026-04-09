import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const add: YoutubeEndpoints['playlistItemsAdd'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['playlistItemsAdd']
	>('/playlistItems', ctx.key, {
		method: 'POST',
		query: { part: 'snippet,contentDetails,status' },
		body: {
			snippet: {
				playlistId: input.playlistId,
				resourceId: { kind: 'youtube#video', videoId: input.videoId },
				...(input.position !== undefined && { position: input.position }),
			},
		},
	});

	if (response.id && ctx.db.playlistItems) {
		try {
			await ctx.db.playlistItems.upsertByEntityId(response.id, {
				...response.snippet,
				videoId: response.snippet?.resourceId?.videoId ?? input.videoId,
				id: response.id,
			});
		} catch (error) {
			console.warn(
				'[youtube] Failed to save playlist item to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.playlistItems.add',
		{ videoId: input.videoId, playlistId: input.playlistId },
		'completed',
	);
	return response;
};

export const list: YoutubeEndpoints['playlistItemsList'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['playlistItemsList']
	>('/playlistItems', ctx.key, {
		method: 'GET',
		query: {
			playlistId: input.playlistId,
			part: input.part ?? 'snippet,contentDetails,status',
			...(input.fields && { fields: input.fields }),
			...(input.videoId && { videoId: input.videoId }),
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
			...(input.onBehalfOfContentOwner && {
				onBehalfOfContentOwner: input.onBehalfOfContentOwner,
			}),
		},
	});

	if (response.items && ctx.db.playlistItems) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.playlistItems.upsertByEntityId(item.id, {
					...item.snippet,
					videoId:
						item.snippet?.resourceId?.videoId ?? item.contentDetails?.videoId,
					id: item.id,
				});
			} catch (error) {
				console.warn(
					'[youtube] Failed to save playlist item to database:',
					error,
				);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.playlistItems.list',
		{ playlistId: input.playlistId },
		'completed',
	);
	return response;
};

export const update: YoutubeEndpoints['playlistItemsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['playlistItemsUpdate']
	>('/playlistItems', ctx.key, {
		method: 'PUT',
		query: { part: input.part ?? 'snippet,contentDetails' },
		body: {
			id: input.id,
			snippet: input.snippet,
			...(input.contentDetails && { contentDetails: input.contentDetails }),
		},
	});

	if (response.id && ctx.db.playlistItems) {
		try {
			await ctx.db.playlistItems.upsertByEntityId(response.id, {
				...response.snippet,
				videoId: response.snippet?.resourceId?.videoId,
				id: response.id,
			});
		} catch (error) {
			console.warn(
				'[youtube] Failed to update playlist item in database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.playlistItems.update',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const del: YoutubeEndpoints['playlistItemsDelete'] = async (
	ctx,
	input,
) => {
	await makeYoutubeRequest<void>('/playlistItems', ctx.key, {
		method: 'DELETE',
		query: { id: input.id },
	});

	await logEventFromContext(
		ctx,
		'youtube.playlistItems.delete',
		{ id: input.id },
		'completed',
	);
	return { deleted: true, playlist_item_id: input.id, http_status: 204 };
};
