import { logEventFromContext } from 'corsair/core';
import type { SerpapiEndpoints } from '../index';
import { auditPayload } from './logging';
import { serpapiSearch } from './shared';

export const bingSearch: SerpapiEndpoints['enginesBingSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'bing', input);
	await logEventFromContext(
		ctx,
		'serpapi.engines.bingSearch',
		auditPayload(input, ['location', 'mkt', 'cc', 'device']),
		'completed',
	);
	return result;
};

export const bingMaps: SerpapiEndpoints['enginesBingMaps'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'bing_maps', input);
	await logEventFromContext(
		ctx,
		'serpapi.engines.bingMaps',
		auditPayload(input, ['id', 'location']),
		'completed',
	);
	return result;
};

export const duckDuckGoSearch: SerpapiEndpoints['enginesDuckDuckGoSearch'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'duckduckgo', input);
		await logEventFromContext(
			ctx,
			'serpapi.engines.duckDuckGoSearch',
			auditPayload(input, ['kl']),
			'completed',
		);
		return result;
	};

export const duckDuckGoMaps: SerpapiEndpoints['enginesDuckDuckGoMaps'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'duckduckgo_maps', input);
	await logEventFromContext(
		ctx,
		'serpapi.engines.duckDuckGoMaps',
		auditPayload(input, ['kl']),
		'completed',
	);
	return result;
};

/** Confirmed from the catalog description: faster, less-rich results than the full DuckDuckGo search. */
export const duckDuckGoLightSearch: SerpapiEndpoints['enginesDuckDuckGoLightSearch'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'duckduckgo_light', input);
		await logEventFromContext(
			ctx,
			'serpapi.engines.duckDuckGoLightSearch',
			auditPayload(input, ['kl', 'df', 'start']),
			'completed',
		);
		return result;
	};

/** Confirmed live: Yahoo's query parameter is `p`, not `q`. */
export const yahooSearch: SerpapiEndpoints['enginesYahooSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'yahoo', input);
	await logEventFromContext(
		ctx,
		'serpapi.engines.yahooSearch',
		auditPayload(input, ['location', 'device']),
		'completed',
	);
	return result;
};

export const yahooVideos: SerpapiEndpoints['enginesYahooVideos'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'yahoo_videos', input);
	await logEventFromContext(
		ctx,
		'serpapi.engines.yahooVideos',
		{},
		'completed',
	);
	return result;
};

/** Confirmed live: Yandex's query parameter is `text`, not `q`. */
export const yandexSearch: SerpapiEndpoints['enginesYandexSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'yandex', input, {
		timeout: 60_000,
	});
	await logEventFromContext(
		ctx,
		'serpapi.engines.yandexSearch',
		auditPayload(input, ['location']),
		'completed',
	);
	return result;
};

export const yandexImagesSearch: SerpapiEndpoints['enginesYandexImagesSearch'] =
	async (ctx, input) => {
		const result = await serpapiSearch(ctx, 'yandex_images', input, {
			timeout: 60_000,
		});
		await logEventFromContext(
			ctx,
			'serpapi.engines.yandexImagesSearch',
			auditPayload(input, ['isize', 'icolor', 'itype']),
			'completed',
		);
		return result;
	};

/** Confirmed live: Naver's query parameter is `query`, not `q`. */
export const naverSearch: SerpapiEndpoints['enginesNaverSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'naver', input);
	await logEventFromContext(
		ctx,
		'serpapi.engines.naverSearch',
		auditPayload(input, ['where', 'period']),
		'completed',
	);
	return result;
};

export const baiduSearch: SerpapiEndpoints['enginesBaiduSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'baidu', input);
	await logEventFromContext(
		ctx,
		'serpapi.engines.baiduSearch',
		{},
		'completed',
	);
	return result;
};

/** Confirmed live: YouTube's query parameter is `search_query`, not `q`. */
export const youtubeSearch: SerpapiEndpoints['enginesYoutubeSearch'] = async (
	ctx,
	input,
) => {
	const result = await serpapiSearch(ctx, 'youtube', input);
	await logEventFromContext(
		ctx,
		'serpapi.engines.youtubeSearch',
		auditPayload(input, ['gl', 'hl']),
		'completed',
	);
	return result;
};
