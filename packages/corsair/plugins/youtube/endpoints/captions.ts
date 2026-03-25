import { logEventFromContext } from '../../utils/events';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const list: YoutubeEndpoints['captionsList'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['captionsList']>(
		'/captions',
		ctx.key,
		{
			method: 'GET',
			query: {
				videoId: input.video_id,
				part: input.part ?? 'snippet',
			},
		},
	);

	if (response.items && ctx.db.captions) {
		for (const item of response.items) {
			if (!item.id) continue;
			try {
				await ctx.db.captions.upsertByEntityId(item.id, {
					id: item.id,
					videoId: item.snippet?.videoId ?? input.video_id,
					language: item.snippet?.language,
					name: item.snippet?.name,
					isDraft: item.snippet?.isDraft,
					trackKind: item.snippet?.trackKind,
				});
			} catch (error) {
				console.warn('[youtube] Failed to save caption to database:', error);
			}
		}
	}

	await logEventFromContext(ctx, 'youtube.captions.list', { video_id: input.video_id }, 'completed');
	return response;
};

export const update: YoutubeEndpoints['captionsUpdate'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['captionsUpdate']>(
		'/captions',
		ctx.key,
		{
			method: 'PUT',
			query: { part: 'snippet' },
			body: {
				id: input.id,
				snippet: input.snippet,
			},
		},
	);

	if (response.id && ctx.db.captions) {
		try {
			await ctx.db.captions.upsertByEntityId(response.id, {
				id: response.id,
				videoId: response.snippet?.videoId,
				language: response.snippet?.language,
				name: response.snippet?.name,
				isDraft: response.snippet?.isDraft,
				trackKind: response.snippet?.trackKind,
			});
		} catch (error) {
			console.warn('[youtube] Failed to update caption in database:', error);
		}
	}

	await logEventFromContext(ctx, 'youtube.captions.update', { id: input.id }, 'completed');
	return response;
};

export const load: YoutubeEndpoints['captionsLoad'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['captionsLoad']>(
		`/captions/${input.id}`,
		ctx.key,
		{
			method: 'GET',
			query: {
				...(input.tfmt ? { tfmt: input.tfmt } : {}),
			},
		},
	);

	await logEventFromContext(ctx, 'youtube.captions.load', { id: input.id }, 'completed');
	return response;
};
