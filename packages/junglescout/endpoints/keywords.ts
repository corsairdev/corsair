import { logEventFromContext } from 'corsair/core';
import type { JungleScoutEndpoints } from '..';
import { makeJungleScoutRequest } from '../client';
import type {
	HistoricalSearchVolumeResponse,
	KeywordsByAsinResponse,
	KeywordsByKeywordResponse,
} from './types';
import {
	JungleScoutEndpointInputSchemas,
	JungleScoutEndpointOutputSchemas,
} from './types';

export const byAsin: JungleScoutEndpoints['keywords.byAsin'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JungleScoutEndpointInputSchemas['keywords.byAsin'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {
		marketplace: parsedInput.marketplace,
		sort: parsedInput.sort,
		'page[size]': parsedInput.page_size,
		'page[cursor]': parsedInput.page_cursor,
	};

	// `unknown` because JSON:API attributes object holds heterogeneous primitive and array filter values.
	const attributes: Record<string, unknown> = {
		asins: parsedInput.asins,
		include_variants: parsedInput.include_variants,
		min_monthly_search_volume_exact:
			parsedInput.min_monthly_search_volume_exact,
		max_monthly_search_volume_exact:
			parsedInput.max_monthly_search_volume_exact,
		min_monthly_search_volume_broad:
			parsedInput.min_monthly_search_volume_broad,
		max_monthly_search_volume_broad:
			parsedInput.max_monthly_search_volume_broad,
		min_word_count: parsedInput.min_word_count,
		max_word_count: parsedInput.max_word_count,
		min_organic_product_count: parsedInput.min_organic_product_count,
		max_organic_product_count: parsedInput.max_organic_product_count,
	};

	const cleanAttributes = Object.fromEntries(
		Object.entries(attributes).filter(([, v]) => v !== undefined),
	);

	const response = await makeJungleScoutRequest<KeywordsByAsinResponse>(
		'/api/keywords/keywords_by_asin_query',
		ctx.key,
		{
			method: 'POST',
			query,
			body: {
				data: {
					type: 'keywords_by_asin_query',
					attributes: cleanAttributes,
				},
			},
			apiType: ctx.options?.apiType,
		},
	);

	const parsed =
		JungleScoutEndpointOutputSchemas['keywords.byAsin'].parse(response);

	await logEventFromContext(
		ctx,
		'junglescout.keywords.byAsin',
		{
			asinCount: parsedInput.asins.length,
			marketplace: parsedInput.marketplace,
		},
		'completed',
	);

	return parsed;
};

export const byKeyword: JungleScoutEndpoints['keywords.byKeyword'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		JungleScoutEndpointInputSchemas['keywords.byKeyword'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {
		marketplace: parsedInput.marketplace,
		sort: parsedInput.sort,
		'page[size]': parsedInput.page_size,
		'page[cursor]': parsedInput.page_cursor,
	};

	// `unknown` because JSON:API attributes object holds heterogeneous primitive and array filter values.
	const attributes: Record<string, unknown> = {
		search_terms: parsedInput.search_terms,
		categories: parsedInput.categories,
		min_monthly_search_volume_exact:
			parsedInput.min_monthly_search_volume_exact,
		max_monthly_search_volume_exact:
			parsedInput.max_monthly_search_volume_exact,
		min_monthly_search_volume_broad:
			parsedInput.min_monthly_search_volume_broad,
		max_monthly_search_volume_broad:
			parsedInput.max_monthly_search_volume_broad,
		min_word_count: parsedInput.min_word_count,
		max_word_count: parsedInput.max_word_count,
		min_organic_product_count: parsedInput.min_organic_product_count,
		max_organic_product_count: parsedInput.max_organic_product_count,
	};

	const cleanAttributes = Object.fromEntries(
		Object.entries(attributes).filter(([, v]) => v !== undefined),
	);

	const response = await makeJungleScoutRequest<KeywordsByKeywordResponse>(
		'/api/keywords/keywords_by_keyword_query',
		ctx.key,
		{
			method: 'POST',
			query,
			body: {
				data: {
					type: 'keywords_by_keyword_query',
					attributes: cleanAttributes,
				},
			},
			apiType: ctx.options?.apiType,
		},
	);

	const parsed =
		JungleScoutEndpointOutputSchemas['keywords.byKeyword'].parse(response);

	await logEventFromContext(
		ctx,
		'junglescout.keywords.byKeyword',
		{
			marketplace: parsedInput.marketplace,
		},
		'completed',
	);

	return parsed;
};

export const historicalSearchVolume: JungleScoutEndpoints['keywords.historicalSearchVolume'] =
	async (ctx, input) => {
		const parsedInput =
			JungleScoutEndpointInputSchemas['keywords.historicalSearchVolume'].parse(
				input,
			);

		const query: Record<string, string | number | boolean | undefined> = {
			marketplace: parsedInput.marketplace,
			keyword: parsedInput.keyword,
			start_date: parsedInput.start_date,
			end_date: parsedInput.end_date,
		};

		const response =
			await makeJungleScoutRequest<HistoricalSearchVolumeResponse>(
				'/api/keywords/historical_search_volume',
				ctx.key,
				{
					method: 'GET',
					query,
					apiType: ctx.options?.apiType,
				},
			);

		const parsed =
			JungleScoutEndpointOutputSchemas['keywords.historicalSearchVolume'].parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'junglescout.keywords.historicalSearchVolume',
			{
				marketplace: parsedInput.marketplace,
				startDate: parsedInput.start_date,
				endDate: parsedInput.end_date,
			},
			'completed',
		);

		return parsed;
	};

export const Keywords = {
	byAsin,
	byKeyword,
	historicalSearchVolume,
};
