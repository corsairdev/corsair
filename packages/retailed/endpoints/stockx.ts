import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';

import type { RetailedContext } from '..';
import { makeRetailedRequest } from '../client';
import type {
	RetailedEndpointInputs,
	RetailedEndpointOutputs,
	StockXProductInput,
	StockXProductResponse,
	StockXSearchInput,
	StockXSearchResponse,
} from './types';
import { RetailedEndpointOutputSchemas } from './types';

export const stockxTrends: CorsairEndpoint<
	RetailedContext,
	RetailedEndpointInputs['stockxTrends'],
	RetailedEndpointOutputs['stockxTrends']
> = async (ctx, input) => {
	const query: Record<string, string> = {};

	if (input.query) {
		query.query = input.query;
	}

	if (input.sort_by) {
		query.sort_by = input.sort_by;
	}

	if (input.country) {
		query.country = input.country;
	}

	const response = await makeRetailedRequest<
		RetailedEndpointOutputs['stockxTrends']
	>('scraper/stockx/trends', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = RetailedEndpointOutputSchemas.stockxTrends.parse(response);

	await logEventFromContext(ctx, 'retailed.stockx.trends', {}, 'completed');

	return parsed;
};

export const stockxSearch: CorsairEndpoint<
	RetailedContext,
	StockXSearchInput,
	StockXSearchResponse
> = async (ctx, input) => {
	const query: Record<string, string> = {
		query: input.query,
	};

	const response = await makeRetailedRequest<
		RetailedEndpointOutputs['stockxSearch']
	>('scraper/stockx/search', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = RetailedEndpointOutputSchemas.stockxSearch.parse(response);

	await logEventFromContext(ctx, 'retailed.stockx.search', {}, 'completed');

	return parsed;
};

export const stockxProduct: CorsairEndpoint<
	RetailedContext,
	StockXProductInput,
	StockXProductResponse
> = async (ctx, input) => {
	const query: Record<string, string> = {
		query: input.query,
	};

	if (input.country) {
		query.country = input.country;
	}

	if (input.language) {
		query.language = input.language;
	}

	if (input.currency) {
		query.currency = input.currency;
	}

	const response = await makeRetailedRequest<
		RetailedEndpointOutputs['stockxProduct']
	>('scraper/stockx/product', ctx.key, {
		method: 'GET',
		query,
	});

	const parsed = RetailedEndpointOutputSchemas.stockxProduct.parse(response);

	await logEventFromContext(ctx, 'retailed.stockx.product', {}, 'completed');

	return parsed;
};
