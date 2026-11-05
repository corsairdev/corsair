import { logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import { resolveApiKey } from './auth';
import type { GiphyEndpointOutputs } from './types';
import { GiphyListResponseSchema, GiphySingleResponseSchema } from './types';

export const search: GiphyEndpoints['stickersSearch'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		q: input.q,
		limit: input.limit,
		offset: input.offset,
		rating: input.rating,
		lang: input.lang,
		customer_id: input.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['stickersSearch']
	>('/stickers/search', apiKey, { query });

	const response = GiphyListResponseSchema.parse(rawResponse);

	if (ctx.db?.gifs && response.data) {
		for (const sticker of response.data) {
			try {
				await ctx.db.gifs.upsertByEntityId(sticker.id, {
					id: sticker.id,
					url: sticker.url,
					slug: sticker.slug,
					embedUrl: sticker.embed_url,
					title: sticker.title,
					rating: sticker.rating,
					username: sticker.username,
					source: sticker.source,
					importedAt: sticker.import_datetime,
					createdAt: new Date(),
				});
			} catch {
				// Ignore individual db write failures
			}
		}
	}

	await logEventFromContext(
		ctx,
		'giphy.stickers.search',
		{ q: input.q },
		'completed',
	);

	return response;
};

export const trending: GiphyEndpoints['stickersTrending'] = async (
	ctx,
	input,
) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		limit: input?.limit,
		offset: input?.offset,
		rating: input?.rating,
		customer_id: input?.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['stickersTrending']
	>('/stickers/trending', apiKey, { query });

	const response = GiphyListResponseSchema.parse(rawResponse);

	if (ctx.db?.gifs && response.data) {
		for (const sticker of response.data) {
			try {
				await ctx.db.gifs.upsertByEntityId(sticker.id, {
					id: sticker.id,
					url: sticker.url,
					slug: sticker.slug,
					embedUrl: sticker.embed_url,
					title: sticker.title,
					rating: sticker.rating,
					username: sticker.username,
					source: sticker.source,
					importedAt: sticker.import_datetime,
					createdAt: new Date(),
				});
			} catch {
				// Ignore individual db write failures
			}
		}
	}

	await logEventFromContext(
		ctx,
		'giphy.stickers.trending',
		{ limit: input?.limit },
		'completed',
	);

	return response;
};

export const translate: GiphyEndpoints['stickersTranslate'] = async (
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
		GiphyEndpointOutputs['stickersTranslate']
	>('/stickers/translate', apiKey, { query });

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
		'giphy.stickers.translate',
		{ s: input.s },
		'completed',
	);

	return response;
};

export const random: GiphyEndpoints['stickersRandom'] = async (ctx, input) => {
	const apiKey = await resolveApiKey(ctx);

	const query: Record<string, string | number | boolean | undefined> = {
		tag: input?.tag,
		rating: input?.rating,
		customer_id: input?.customer_id,
	};

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['stickersRandom']
	>('/stickers/random', apiKey, { query });

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
		'giphy.stickers.random',
		{ tag: input?.tag },
		'completed',
	);

	return response;
};

export const Stickers = {
	search,
	trending,
	translate,
	random,
};
