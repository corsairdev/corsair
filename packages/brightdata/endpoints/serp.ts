import { logEventFromContext } from 'corsair/core';
import { makeBrightDataRequest } from '../client';
import type { BrightDataEndpoints } from '../index';
import type { SerpQueryOutput, SerpSearchOutput } from './types';

export const search: BrightDataEndpoints['serpSearch'] = async (ctx, input) => {
	const body = {
		zone: input.zone,
		url: input.url,
		format: input.format ?? 'json',
		country: input.country,
		search_engine: input.search_engine,
		brd_json: input.brd_json ?? '1',
	};

	const result = await makeBrightDataRequest<SerpSearchOutput>(
		'request',
		ctx.key,
		{
			method: 'POST',
			body,
			headers: input.headers,
		},
	);

	await logEventFromContext(
		ctx,
		'brightdata.serp.search',
		{ zone: input.zone, url: input.url },
		'completed',
	);

	return result;
};

export const query: BrightDataEndpoints['serpQuery'] = async (ctx, input) => {
	const engine = input.engine ?? 'google';
	const encodedQuery = encodeURIComponent(input.query);
	let targetUrl = '';

	switch (engine) {
		case 'google': {
			const params = new URLSearchParams({ q: input.query });
			if (input.country) params.set('gl', input.country);
			if (input.language) params.set('hl', input.language);
			if (input.num_results) params.set('num', String(input.num_results));
			if (input.page && input.page > 1) {
				const start = (input.page - 1) * (input.num_results ?? 10);
				params.set('start', String(start));
			}
			targetUrl = `https://www.google.com/search?${params.toString()}`;
			break;
		}
		case 'bing': {
			const params = new URLSearchParams({ q: input.query });
			if (input.country) params.set('cc', input.country);
			if (input.language) params.set('setlang', input.language);
			if (input.page && input.page > 1) {
				const first = (input.page - 1) * (input.num_results ?? 10) + 1;
				params.set('first', String(first));
			}
			targetUrl = `https://www.bing.com/search?${params.toString()}`;
			break;
		}
		case 'yandex': {
			const params = new URLSearchParams({ text: input.query });
			if (input.language) params.set('lr', input.language);
			if (input.page && input.page > 1) {
				params.set('p', String(input.page - 1));
			}
			targetUrl = `https://yandex.com/search/?${params.toString()}`;
			break;
		}
		case 'duckduckgo': {
			const params = new URLSearchParams({ q: input.query });
			if (input.country) params.set('kl', input.country);
			targetUrl = `https://duckduckgo.com/html/?${params.toString()}`;
			break;
		}
		default: {
			targetUrl = `https://www.google.com/search?q=${encodedQuery}`;
			break;
		}
	}

	const body = {
		zone: input.zone,
		url: targetUrl,
		format: input.format ?? 'json',
		country: input.country,
		search_engine: engine,
		brd_json: '1',
	};

	const result = await makeBrightDataRequest<SerpQueryOutput>(
		'request',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'brightdata.serp.query',
		{ zone: input.zone, query: input.query, engine },
		'completed',
	);

	return result;
};
