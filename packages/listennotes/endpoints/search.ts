import { logEventFromContext } from 'corsair/core';
import { makeListennotesRequest } from '../client';
import type { ListennotesEndpoints } from '../index';
import type {
	SearchEpisodeTitlesResponse,
	SearchResponse,
	SearchTermsResponse,
	SpellcheckResponse,
	TypeaheadResponse,
} from './types';
import {
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
} from './types';

export const search: ListennotesEndpoints['search.search'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['search.search'].parse(input);

	const response = await makeListennotesRequest<SearchResponse>(
		'/search',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['search.search'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.search.search',
		{ count: parsed.count },
		'completed',
	);

	return parsed;
};

export const typeahead: ListennotesEndpoints['search.typeahead'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['search.typeahead'].parse(input);

	const response = await makeListennotesRequest<TypeaheadResponse>(
		'/typeahead',
		ctx.key,
		{
			method: 'GET',
			query: parsedInput,
		},
	);

	const parsed =
		ListennotesEndpointOutputSchemas['search.typeahead'].parse(response);

	await logEventFromContext(
		ctx,
		'listennotes.search.typeahead',
		{ count: parsed.terms.length },
		'completed',
	);

	return parsed;
};

export const searchEpisodeTitles: ListennotesEndpoints['search.searchEpisodeTitles'] =
	async (ctx, input) => {
		const parsedInput =
			ListennotesEndpointInputSchemas['search.searchEpisodeTitles'].parse(
				input,
			);
		const response = await makeListennotesRequest<SearchEpisodeTitlesResponse>(
			'/search_episode_titles',
			ctx.key,
			{ method: 'GET', query: parsedInput },
		);
		const parsed =
			ListennotesEndpointOutputSchemas['search.searchEpisodeTitles'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'listennotes.search.searchEpisodeTitles',
			{ count: parsed.count ?? 0 },
			'completed',
		);
		return parsed;
	};

export const trendingSearches: ListennotesEndpoints['search.trendingSearches'] =
	async (ctx, input) => {
		const parsedInput =
			ListennotesEndpointInputSchemas['search.trendingSearches'].parse(input);
		const response = await makeListennotesRequest<SearchTermsResponse>(
			'/trending_searches',
			ctx.key,
			{ method: 'GET', query: parsedInput },
		);
		const parsed =
			ListennotesEndpointOutputSchemas['search.trendingSearches'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'listennotes.search.trendingSearches',
			{ count: parsed.terms.length },
			'completed',
		);
		return parsed;
	};

export const relatedSearches: ListennotesEndpoints['search.relatedSearches'] =
	async (ctx, input) => {
		const parsedInput =
			ListennotesEndpointInputSchemas['search.relatedSearches'].parse(input);
		const response = await makeListennotesRequest<SearchTermsResponse>(
			'/related_searches',
			ctx.key,
			{ method: 'GET', query: parsedInput },
		);
		const parsed =
			ListennotesEndpointOutputSchemas['search.relatedSearches'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'listennotes.search.relatedSearches',
			{ count: parsed.terms.length },
			'completed',
		);
		return parsed;
	};

export const spellcheck: ListennotesEndpoints['search.spellcheck'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ListennotesEndpointInputSchemas['search.spellcheck'].parse(input);
	const response = await makeListennotesRequest<SpellcheckResponse>(
		'/spellcheck',
		ctx.key,
		{ method: 'GET', query: parsedInput },
	);
	const parsed =
		ListennotesEndpointOutputSchemas['search.spellcheck'].parse(response);
	await logEventFromContext(
		ctx,
		'listennotes.search.spellcheck',
		{ count: parsed.tokens.length },
		'completed',
	);
	return parsed;
};
