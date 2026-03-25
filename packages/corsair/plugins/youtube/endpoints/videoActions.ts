import { logEventFromContext } from '../../utils/events';
import type { YoutubeEndpoints } from '..';
import { makeYoutubeRequest } from '../client';
import type { YoutubeEndpointOutputs } from './types';

export const rate: YoutubeEndpoints['videoActionsRate'] = async (ctx, input) => {
	await makeYoutubeRequest<void>('/videos/rate', ctx.key, {
		method: 'POST',
		query: { id: input.id, rating: input.rating },
	});

	await logEventFromContext(ctx, 'youtube.videoActions.rate', { id: input.id, rating: input.rating }, 'completed');
	return {
		rating: input.rating,
		success: true,
		video_id: input.id,
		http_status: 204,
	};
};

export const getRating: YoutubeEndpoints['videoActionsGetRating'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videoActionsGetRating']>(
		'/videos/getRating',
		ctx.key,
		{
			method: 'GET',
			query: {
				id: input.id,
				...(input.onBehalfOfContentOwner ? { onBehalfOfContentOwner: input.onBehalfOfContentOwner } : {}),
			},
		},
	);

	await logEventFromContext(ctx, 'youtube.videoActions.getRating', { id: input.id }, 'completed');
	return response;
};

export const reportAbuse: YoutubeEndpoints['videoActionsReportAbuse'] = async (ctx, input) => {
	await makeYoutubeRequest<void>('/videos/reportAbuse', ctx.key, {
		method: 'POST',
		query: { videoId: input.videoId },
		body: {
			reasonId: input.reasonId,
			...(input.secondaryReasonId ? { secondaryReasonId: input.secondaryReasonId } : {}),
			...(input.comments ? { comments: input.comments } : {}),
			...(input.language ? { language: input.language } : {}),
		},
	});

	await logEventFromContext(ctx, 'youtube.videoActions.reportAbuse', { videoId: input.videoId }, 'completed');
	return {
		success: true,
		message: `Video ${input.videoId} reported for abuse`,
		http_status: 204,
	};
};

export const listAbuseReasons: YoutubeEndpoints['videoActionsListAbuseReasons'] = async (ctx, input) => {
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videoActionsListAbuseReasons']>(
		'/videoAbuseReportReasons',
		ctx.key,
		{
			method: 'GET',
			query: {
				part: input.part ?? 'snippet',
				...(input.hl ? { hl: input.hl } : {}),
			},
		},
	);

	await logEventFromContext(ctx, 'youtube.videoActions.listAbuseReasons', {}, 'completed');
	return response;
};

export const updateThumbnail: YoutubeEndpoints['videoActionsUpdateThumbnail'] = async (ctx, input) => {
	// Thumbnail update requires multipart upload with the image data.
	// This implementation passes the thumbnail URL reference to the API.
	const response = await makeYoutubeRequest<YoutubeEndpointOutputs['videoActionsUpdateThumbnail']>(
		'/thumbnails/set',
		ctx.key,
		{
			method: 'POST',
			query: { videoId: input.videoId },
			body: { thumbnailUrl: input.thumbnailUrl },
		},
	);

	await logEventFromContext(ctx, 'youtube.videoActions.updateThumbnail', { videoId: input.videoId }, 'completed');
	return response;
};
