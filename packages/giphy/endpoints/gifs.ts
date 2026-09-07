import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeGiphyRequest } from '../client';
import type { GiphyEndpoints } from '../index';
import type { GiphyEndpointOutputs } from './types';
import { GiphyListResponseSchema, GiphySingleResponseSchema } from './types';

export const search: GiphyEndpoints['gifsSearch'] = async (ctx, input) => {
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const query: Record<string, string | number | boolean | undefined> = {
		q: input.q,
		limit: input.limit,
		offset: input.offset,
		rating: input.rating,
		lang: input.lang,
		random_id: input.random_id,
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
			} catch (err) {
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
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const query: Record<string, string | number | boolean | undefined> = {
		limit: input?.limit,
		offset: input?.offset,
		rating: input?.rating,
		random_id: input?.random_id,
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
			} catch (err) {
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
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const query: Record<string, string | number | boolean | undefined> = {
		s: input.s,
		weirdness: input.weirdness,
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
		} catch (err) {
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
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const query: Record<string, string | number | boolean | undefined> = {
		tag: input?.tag,
		rating: input?.rating,
		random_id: input?.random_id,
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
		} catch (err) {
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
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsGetById']
	>(`/gifs/${input.gif_id}`, apiKey);

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
		} catch (err) {
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
	const apiKey = ctx.options.key ?? (await ctx.keys?.get_api_key()) ?? ctx.key;
	if (!apiKey) {
		throw new AuthMissingError('giphy', 'api_key');
	}

	const idsString = Array.isArray(input.ids) ? input.ids.join(',') : input.ids;

	const rawResponse = await makeGiphyRequest<
		GiphyEndpointOutputs['gifsGetByIds']
	>('/gifs', apiKey, { query: { ids: idsString } });

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
			} catch (err) {
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

export const Gifs = {
	search,
	trending,
	translate,
	random,
	getById,
	getByIds,
};
