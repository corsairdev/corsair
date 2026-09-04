import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { InstagramEndpointOutputs, media } from './types';
import { MEDIA_TYPE_METRICS } from './types';

export const list: InstagramEndpoints['GetInstagramMediaList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetInstagramMediaList']
	>(`${input.ig_id}/media`, ctx, {
		method: 'GET',
		query: {
			fields: input.q,
			after: input.after,
			before: input.before,
		},
	});

	if (result.data && ctx.db.media) {
		for (const media of result.data) {
			try {
				await ctx.db.media.upsertByEntityId(media.id, {
					id: media.id,
					username: media.username,
					media_url: media.media_url,
					caption: media.caption,
					createdAt: media.createdAt || new Date(),
				});
			} catch (err) {
				console.warn('failed to save media into database', err);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.media.list',
		{ ...input },
		'completed',
	);

	return result;
};

export const get: InstagramEndpoints['GetInstagramMedia'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetInstagramMedia']
	>(`/${input.media_id}`, ctx, {
		method: 'GET',
		query: {
			fields: input.q,
		},
	});

	if (result && ctx.db.media) {
		try {
			await ctx.db.media.upsertByEntityId(result.id, {
				id: result.id,
				username: result.username,
				media_url: result.media_url,
				caption: result.caption,
				createdAt: result.createdAt || new Date(),
			});
		} catch (err) {
			console.warn('failed to save media into database', err);
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.media.get',
		{ ...input },
		'completed',
	);

	return result;
};

export const status: InstagramEndpoints['GetMediaContainerStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetMediaContainerStatus']
	>(`/${input.container_id}`, ctx, {
		method: 'GET',
		query: {
			fields: 'status_code',
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.media.status',
		{ ...input },
		'completed',
	);

	return result;
};

export const insights: InstagramEndpoints['GetMediaInsights'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetMediaInsights']
	>(`/${input.media_id}/insights`, ctx, {
		method: 'GET',
		query: {
			metric: input.metric?.length
				? input.metric
				: MEDIA_TYPE_METRICS[input.type as media].join(','),
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.media.insights',
		{ ...input },
		'completed',
	);

	return result;
};

export const createMediaContainer: InstagramEndpoints['CreateMediaContainer'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedInstagramRequest<
			InstagramEndpointOutputs['CreateMediaContainer']
		>(`/${input.ig_id}/media`, ctx, {
			method: 'POST',
			body: {
				image_url: input.image_url,
				video_url: input.video_url,
				media_type: input.media_type,
				caption: input.caption,
				is_carousel_item: input.is_carousel_item,
				user_tags: input.user_tags
					? JSON.stringify(input.user_tags)
					: undefined,
			},
		});

		await logEventFromContext(
			ctx,
			'instagram.media.createMediaContainer',
			{ ...input },
			'completed',
		);

		return result;
	};

export const children: InstagramEndpoints['GetIgMediaChildren'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetIgMediaChildren']
	>(`/${input.media_id}/children`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
			after: input.after,
			before: input.before,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.media.children',
		{ ...input },
		'completed',
	);

	return result;
};

export const comments: InstagramEndpoints['GetIgMediaComments'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetIgMediaComments']
	>(`/${input.media_id}/comments`, ctx, {
		method: 'GET',
		query: {
			fields: input.fields,
			after: input.after,
			before: input.before,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.media.comments',
		{ ...input },
		'completed',
	);

	return result;
};

export const getMediaInsights: InstagramEndpoints['GetIgMediaInsights'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedInstagramRequest<
			InstagramEndpointOutputs['GetIgMediaInsights']
		>(`/${input.media_id}/insights`, ctx, {
			method: 'GET',
			query: {
				metric: input.metrics.join(','),
			},
		});

		await logEventFromContext(
			ctx,
			'instagram.media.getMediaInsights',
			{ ...input },
			'completed',
		);

		return result;
	};

export const postIgUserMedia: InstagramEndpoints['PostIgUserMedia'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['PostIgUserMedia']
	>(`/${input.ig_id}/media`, ctx, {
		method: 'POST',
		body: {
			image_url: input.image_url,
			video_url: input.video_url,
			media_type: input.media_type,
			caption: input.caption,
			is_carousel_item: input.is_carousel_item,
			user_tags: input.user_tags ? JSON.stringify(input.user_tags) : undefined,
		},
	});

	await logEventFromContext(
		ctx,
		'instagram.media.postIgUserMedia',
		{ ...input },
		'completed',
	);

	return result;
};
