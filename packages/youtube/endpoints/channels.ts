import { logEventFromContext } from 'corsair/core';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const getStatistics: YoutubeEndpoints['channelsGetStatistics'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['channelsGetStatistics']
	>('/channels', ctx.key, {
		method: 'GET',
		query: {
			part: input.part ?? 'snippet,statistics,contentDetails',
			...(input.id && { id: input.id }),
			...(input.mine && { mine: 'true' }),
			...(input.forHandle && { forHandle: input.forHandle }),
			...(input.forUsername && { forUsername: input.forUsername }),
		},
	});

	if (response.items && ctx.db.channels) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.channels.upsertByEntityId(item.id, {
					...item.snippet,
					...item.statistics,
					id: item.id,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save channel to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.channels.getStatistics',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const getIdByHandle: YoutubeEndpoints['channelsGetIdByHandle'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['channelsGetIdByHandle']
	>('/channels', ctx.key, {
		method: 'GET',
		query: {
			part: 'snippet,statistics',
			forHandle: input.channel_handle,
		},
	});

	if (response.items && ctx.db.channels) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.channels.upsertByEntityId(item.id, {
					...item.snippet,
					...item.statistics,
					id: item.id,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save channel to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.channels.getIdByHandle',
		{ channel_handle: input.channel_handle },
		'completed',
	);
	return response;
};

export const getActivities: YoutubeEndpoints['channelsGetActivities'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['channelsGetActivities']
	>('/activities', ctx.key, {
		method: 'GET',
		query: {
			channelId: input.channelId,
			part: input.part ?? 'snippet,contentDetails',
			...(input.pageToken && { pageToken: input.pageToken }),
			...(input.maxResults && { maxResults: input.maxResults }),
			...(input.publishedAfter && { publishedAfter: input.publishedAfter }),
			...(input.publishedBefore && { publishedBefore: input.publishedBefore }),
		},
	});

	if (response.items && ctx.db.activities) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.activities.upsertByEntityId(item.id, {
					...item.snippet,
					id: item.id,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save activity to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.channels.getActivities',
		{ channelId: input.channelId },
		'completed',
	);
	return response;
};

export const channelUpdate: YoutubeEndpoints['channelsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['channelsUpdate']
	>('/channels', ctx.key, {
		method: 'PUT',
		query: { part: input.part ?? 'brandingSettings' },
		body: {
			id: input.id,
			...(input.brandingSettings && {
				brandingSettings: input.brandingSettings,
			}),
			...(input.localizations && { localizations: input.localizations }),
		},
	});

	if (response.id && ctx.db.channels) {
		try {
			await ctx.db.channels.upsertByEntityId(response.id, {
				...response.snippet,
				...response.statistics,
				id: response.id,
			});
		} catch (error) {
			console.warn('[youtube] Failed to update channel in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'youtube.channels.update',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const sectionsList: YoutubeEndpoints['channelSectionsList'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['channelSectionsList']
	>('/channelSections', ctx.key, {
		method: 'GET',
		query: {
			part: input.part,
			...(input.hl && { hl: input.hl }),
			...(input.id && { id: input.id }),
			...(input.mine && { mine: 'true' }),
			...(input.channelId && { channelId: input.channelId }),
			...(input.onBehalfOfContentOwner && {
				onBehalfOfContentOwner: input.onBehalfOfContentOwner,
			}),
		},
	});

	await logEventFromContext(
		ctx,
		'youtube.channelSections.list',
		{},
		'completed',
	);
	return response;
};

export const sectionsCreate: YoutubeEndpoints['channelSectionsCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['channelSectionsCreate']
	>('/channelSections', ctx.key, {
		method: 'POST',
		query: { part: 'snippet,contentDetails' },
		body: {
			snippet: input.snippet,
			...(input.contentDetails && { contentDetails: input.contentDetails }),
		},
	});

	await logEventFromContext(
		ctx,
		'youtube.channelSections.create',
		{ type: input.snippet.type },
		'completed',
	);
	return response;
};

export const sectionsUpdate: YoutubeEndpoints['channelSectionsUpdate'] = async (
	ctx,
	input,
) => {
	const response = await makeYoutubeRequest<
		YoutubeEndpointOutputs['channelSectionsUpdate']
	>('/channelSections', ctx.key, {
		method: 'PUT',
		query: { part: 'snippet,contentDetails' },
		body: {
			id: input.id,
			...(input.snippet && { snippet: input.snippet }),
			...(input.contentDetails && { contentDetails: input.contentDetails }),
		},
	});

	await logEventFromContext(
		ctx,
		'youtube.channelSections.update',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const sectionsDelete: YoutubeEndpoints['channelSectionsDelete'] = async (
	ctx,
	input,
) => {
	await makeYoutubeRequest<void>('/channelSections', ctx.key, {
		method: 'DELETE',
		query: {
			id: input.id,
			...(input.onBehalfOfContentOwner && {
				onBehalfOfContentOwner: input.onBehalfOfContentOwner,
			}),
		},
	});

	await logEventFromContext(
		ctx,
		'youtube.channelSections.delete',
		{ id: input.id },
		'completed',
	);
	return { deleted: true, channel_section_id: input.id, http_status: 204 };
};
