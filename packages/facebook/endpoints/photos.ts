import { makePageFacebookRequest } from '../client';
import type { FacebookEndpoints } from '../index';
import {
	buildPaginationQuery,
	logFacebookEvent,
	omitUndefined,
} from './shared';
import type { FacebookEndpointOutputs } from './types';

export const upload: FacebookEndpoints['uploadPhoto'] = async (ctx, input) => {
	const { page_id, ...body } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['uploadPhoto']
	>(`/${page_id}/photos`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined(body),
	});

	await logFacebookEvent(ctx, 'facebook.photos.upload', { ...input });
	return result;
};

export const uploadBatch: FacebookEndpoints['uploadPhotosBatch'] = async (
	ctx,
	input,
) => {
	const batch = input.photos.map((photo, index) => ({
		method: 'POST',
		relative_url: `${input.page_id}/photos`,
		body: new URLSearchParams(
			omitUndefined({
				url: photo.url,
				caption: photo.caption,
				published:
					photo.published === undefined ? undefined : String(photo.published),
			}) as Record<string, string>,
		).toString(),
		name: `photo_${index}`,
	}));

	// Batch Page photo uploads must authenticate with a Page access token.
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['uploadPhotosBatch']
	>('/', ctx, input.page_id, {
		method: 'POST',
		formData: {
			batch: JSON.stringify(batch),
		},
	});

	await logFacebookEvent(ctx, 'facebook.photos.uploadBatch', { ...input });
	return result;
};

export const createPost: FacebookEndpoints['createPhotoPost'] = async (
	ctx,
	input,
) => {
	const { page_id, url, message, published, scheduled_publish_time } = input;
	const shouldSchedule = scheduled_publish_time !== undefined;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['createPhotoPost']
	>(`/${page_id}/photos`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined({
			url,
			message,
			published: published ?? (shouldSchedule ? false : true),
			scheduled_publish_time,
		}),
	});

	await logFacebookEvent(ctx, 'facebook.photos.createPost', { ...input });
	return result;
};

export const addToAlbum: FacebookEndpoints['addPhotosToAlbum'] = async (
	ctx,
	input,
) => {
	const { album_id, page_id, url, message } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['addPhotosToAlbum']
	>(`/${album_id}/photos`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined({ url, message }),
	});

	await logFacebookEvent(ctx, 'facebook.photos.addToAlbum', { ...input });
	return result;
};

export const createAlbum: FacebookEndpoints['createPhotoAlbum'] = async (
	ctx,
	input,
) => {
	const { page_id, name, message, location } = input;
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['createPhotoAlbum']
	>(`/${page_id}/albums`, ctx, page_id, {
		method: 'POST',
		body: omitUndefined({ name, message, location }),
	});

	if (result.id) {
		try {
			await ctx.db.albums.upsertByEntityId(result.id, {
				albumId: result.id,
				pageId: page_id,
				name,
				description: message,
			});
		} catch {
			// Non-fatal cache write
		}
	}

	await logFacebookEvent(ctx, 'facebook.photos.createAlbum', { ...input });
	return result;
};

export const list: FacebookEndpoints['getPagePhotos'] = async (ctx, input) => {
	const result = await makePageFacebookRequest<
		FacebookEndpointOutputs['getPagePhotos']
	>(`/${input.page_id}/photos`, ctx, input.page_id, {
		query: buildPaginationQuery({
			fields: input.fields ?? 'id,name,created_time,source,link,images',
			limit: input.limit,
			after: input.after,
			before: input.before,
		}),
	});

	if (result.data) {
		for (const photo of result.data) {
			if (!photo.id) continue;
			try {
				await ctx.db.photos.upsertByEntityId(photo.id, {
					photoId: photo.id,
					pageId: input.page_id,
					name: photo.name,
					source: photo.source,
					link: photo.link,
					createdTime: photo.created_time,
				});
			} catch {
				// Non-fatal cache write
			}
		}
	}

	await logFacebookEvent(ctx, 'facebook.photos.list', { ...input });
	return result;
};
