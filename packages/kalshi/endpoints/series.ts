import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { KalshiEndpoints } from '..';
import { makeKalshiRequest } from '../client';
import {
	KalshiEndpointInputSchemas,
	KalshiEndpointOutputSchemas,
} from './types';

export const list: KalshiEndpoints['seriesList'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.seriesList.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest('/series', ctx.key, {
		method: 'GET',
		query: parsed,
	});

	await logEventFromContext(
		ctx,
		'kalshi.series.list',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.seriesList.parse(response);
};

export const get: KalshiEndpoints['seriesGet'] = async (ctx, input) => {
	const parsed = KalshiEndpointInputSchemas.seriesGet.parse(input);
	if (!ctx.key) {
		throw new AuthMissingError('kalshi', 'api_key');
	}
	const response = await makeKalshiRequest(
		`/series/${encodeURIComponent(parsed.series_ticker)}`,
		ctx.key,
		{ method: 'GET', query: { include_volume: parsed.include_volume } },
	);

	await logEventFromContext(
		ctx,
		'kalshi.series.get',
		{ ...parsed },
		'completed',
	);
	return KalshiEndpointOutputSchemas.seriesGet.parse(response);
};

export const Series = {
	list,
	get,
} as const;
