import { logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import { resolveApiKey } from './auth';
import type { GiphyEndpointOutputs } from './types';
import {
	GiphyListResponseSchema,
	GiphySingleResponseSchema,
	GiphyUploadResponseSchema,
} from './types';

export const search: GiphyEndpoints['gifsSearch'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		q: input.q,
		limit: input.limit,
		offset: input.offset,
		rating: input.rating,
		lang: input.lang,
		random_id: input.random_id,
		customer_id: input.customer_id,
		channel_ids: input.channel_ids,
		bundle: input.bundle,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsSearch']
	>('/gifs/search', apiKey, { query });

	const response = GiphyListResponseSchema.parse(rawResponse);

	if (ctx.db?.gifs && response.data) {
		for (const gif of response.data) {
			try {
				await ctx.db.gifs.upsertByEntityId(gif.id, {
					id: gif.id,
					url: gif.url,
					slug: gif.slug,
					embedUrl: gif.embed_url,
					title: gif.title,
					rating: gif.rating,
					username: gif.username,
					source: gif.source,
					importedAt: gif.import_datetime,
					createdAt: new Date(),
				});
			} catch {
				// Ignore individual db write failures
			}
		}
	}

	await logEventFromContext(
		ctx,
		'giphy.gifs.search',
		{ q: input.q },
		'completed',
	);

	return response;
};

export const trending: GiphyEndpoints['gifsTrending'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		limit: input?.limit,
		offset: input?.offset,
		rating: input?.rating,
		random_id: input?.random_id,
		customer_id: input?.customer_id,
		bundle: input?.bundle,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsTrending']
	>('/gifs/trending', apiKey, { query });

	const response = GiphyListResponseSchema.parse(rawResponse);

	if (ctx.db?.gifs && response.data) {
		for (const gif of response.data) {
			try {
				await ctx.db.gifs.upsertByEntityId(gif.id, {
					id: gif.id,
					url: gif.url,
					slug: gif.slug,
					embedUrl: gif.embed_url,
					title: gif.title,
					rating: gif.rating,
					username: gif.username,
					source: gif.source,
					importedAt: gif.import_datetime,
					createdAt: new Date(),
				});
			} catch {
				// Ignore individual db write failures
			}
		}
	}

	await logEventFromContext(
		ctx,
		'giphy.gifs.trending',
		{ limit: input?.limit },
		'completed',
	);

	return response;
};

export const translate: GiphyEndpoints['gifsTranslate'] = async (
	ctx,
	input,
) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		s: input.s,
		weirdness: input.weirdness,
		rating: input.rating,
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsTranslate']
	>('/gifs/translate', apiKey, { query });

	const response = GiphySingleResponseSchema.parse(rawResponse);

	if (ctx.db?.gifs && response.data?.id) {
		try {
			await ctx.db.gifs.upsertByEntityId(response.data.id, {
				id: response.data.id,
				url: response.data.url,
				slug: response.data.slug,
				embedUrl: response.data.embed_url,
				title: response.data.title,
				rating: response.data.rating,
				username: response.data.username,
				source: response.data.source,
				importedAt: response.data.import_datetime,
				createdAt: new Date(),
			});
		} catch {
			// Ignore db write failure
		}
	}

	await logEventFromContext(
		ctx,
		'giphy.gifs.translate',
		{ s: input.s },
		'completed',
	);

	return response;
};

export const random: GiphyEndpoints['gifsRandom'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		tag: input?.tag,
		rating: input?.rating,
		random_id: input?.random_id,
		customer_id: input?.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsRandom']
	>('/gifs/random', apiKey, { query });

	const response = GiphySingleResponseSchema.parse(rawResponse);

	if (ctx.db?.gifs && response.data?.id) {
		try {
			await ctx.db.gifs.upsertByEntityId(response.data.id, {
				id: response.data.id,
				url: response.data.url,
				slug: response.data.slug,
				embedUrl: response.data.embed_url,
				title: response.data.title,
				rating: response.data.rating,
				username: response.data.username,
				source: response.data.source,
				importedAt: response.data.import_datetime,
				createdAt: new Date(),
			});
		} catch {
			// Ignore db write failure
		}
	}

	await logEventFromContext(
		ctx,
		'giphy.gifs.random',
		{ tag: input?.tag },
		'completed',
	);

	return response;
};

export const getById: GiphyEndpoints['gifsGetById'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		rating: input.rating,
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsGetById']
	>(`/gifs/${encodeURIComponent(input.gif_id)}`, apiKey, { query });

	const response = GiphySingleResponseSchema.parse(rawResponse);

	if (ctx.db?.gifs && response.data?.id) {
		try {
			await ctx.db.gifs.upsertByEntityId(response.data.id, {
				id: response.data.id,
				url: response.data.url,
				slug: response.data.slug,
				embedUrl: response.data.embed_url,
				title: response.data.title,
				rating: response.data.rating,
				username: response.data.username,
				source: response.data.source,
				importedAt: response.data.import_datetime,
				createdAt: new Date(),
			});
		} catch {
			// Ignore db write failure
		}
	}

	await logEventFromContext(
		ctx,
		'giphy.gifs.getById',
		{ gif_id: input.gif_id },
		'completed',
	);

	return response;
};

export const getByIds: GiphyEndpoints['gifsGetByIds'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const idsString = Array.isArray(input.ids) ? input.ids.join(',') : input.ids;

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsGetByIds']
	>('/gifs', apiKey, {
		query: {
			ids: idsString,
			rating: input.rating,
			customer_id: input.customer_id,
		},
	});

	const response = GiphyListResponseSchema.parse(rawResponse);

	if (ctx.db?.gifs && response.data) {
		for (const gif of response.data) {
			try {
				await ctx.db.gifs.upsertByEntityId(gif.id, {
					id: gif.id,
					url: gif.url,
					slug: gif.slug,
					embedUrl: gif.embed_url,
					title: gif.title,
					rating: gif.rating,
					username: gif.username,
					source: gif.source,
					importedAt: gif.import_datetime,
					createdAt: new Date(),
				});
			} catch {
				// Ignore individual db write failures
			}
		}
	}

	await logEventFromContext(
		ctx,
		'giphy.gifs.getByIds',
		{ ids: idsString },
		'completed',
	);

	return response;
};

// Upload endpoint — https://developers.giphy.com/docs/api/endpoint/#upload
// POSTs to the dedicated upload host (not api.giphy.com). Exactly one of
// `file_base64` (multipart `file` part) or `source_image_url` is accepted;
// the input schema's refine enforces this before any network call.
export const upload: GiphyEndpoints['gifsUpload'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		source_image_url: input.source_image_url,
		tags: input.tags,
		source_post_url: input.source_post_url,
		username: input.username,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsUpload']
	>('/gifs', apiKey, {
		method: 'POST',
		base: 'upload',
		query,
		formData: input.file_base64
			? {
					file: new File(
						[Buffer.from(input.file_base64, 'base64')],
						input.file_name ?? 'upload.gif',
					),
				}
			: undefined,
	});

	const response = GiphyUploadResponseSchema.parse(rawResponse);

	await logEventFromContext(
		ctx,
		'giphy.gifs.upload',
		{ id: response.data.id },
		'completed',
	);

	return response;
};

export const Gifs = {
	search,
	trending,
	translate,
	random,
	getById,
	getByIds,
	upload,
};
