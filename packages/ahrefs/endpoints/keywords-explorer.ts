import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import type {
	KeywordsOverviewResponse,
	MatchingTermsResponse,
	RelatedTermsResponse,
	SearchSuggestionsResponse,
	VolumeByCountryResponse,
	VolumeHistoryResponse,
} from './types';

export const overview: AhrefsEndpoints['keywordsOverview'] = async (
	ctx,
	input,
) => {
	const keywords = Array.isArray(input.keywords)
		? input.keywords.join(',')
		: input.keywords;

	const response = await makeAhrefsRequest<KeywordsOverviewResponse>(
		'/keywords-explorer/overview',
		ctx.key,
		{
			query: {
				...input,
				keywords,
			},
		},
	);

	// Sync keywords to database
	for (const keyword of response.keywords) {
		if (!keyword.keyword) continue;

		try {
			const entityId = [
				input.target || 'global',
				input.country,
				keyword.keyword,
			].join(':');

			await ctx.db.keywords.upsertByEntityId(entityId, {
				...keyword,
				target: input.target,
				country: input.country,
				date: new Date().toISOString().split('T')[0], // current date
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn(
				`[ahrefs] Failed to save keyword ${keyword.keyword}:`,
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'ahrefs.keywordsExplorer.overview',
		{
			country: input.country,
			keywords,
			keyword_list_id: input.keyword_list_id,
			target: input.target,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};

export const matchingTerms: AhrefsEndpoints['matchingTerms'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<MatchingTermsResponse>(
		'/keywords-explorer/matching-terms',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.keywordsExplorer.matchingTerms',
		{
			keywords: input.keywords,
			country: input.country,
			keyword_list_id: input.keyword_list_id,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};

export const relatedTerms: AhrefsEndpoints['relatedTerms'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<RelatedTermsResponse>(
		'/keywords-explorer/related-terms',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.keywordsExplorer.relatedTerms',
		{
			keywords: input.keywords,
			country: input.country,
			keyword_list_id: input.keyword_list_id,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};

export const searchSuggestions: AhrefsEndpoints['searchSuggestions'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<SearchSuggestionsResponse>(
		'/keywords-explorer/search-suggestions',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.keywordsExplorer.searchSuggestions',
		{
			keywords: input.keywords,
			country: input.country,
			keyword_list_id: input.keyword_list_id,
			resultCount: response.keywords.length,
		},
		'completed',
	);

	return response;
};

export const volumeHistory: AhrefsEndpoints['volumeHistory'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<VolumeHistoryResponse>(
		'/keywords-explorer/volume-history',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.keywordsExplorer.volumeHistory',
		{
			keyword: input.keyword,
			country: input.country,
			date_from: input.date_from,
			date_to: input.date_to,
			resultCount: response.metrics.length,
		},
		'completed',
	);

	return response;
};

export const volumeByCountry: AhrefsEndpoints['volumeByCountry'] = async (
	ctx,
	input,
) => {
	const response = await makeAhrefsRequest<VolumeByCountryResponse>(
		'/keywords-explorer/volume-by-country',
		ctx.key,
		{
			query: input,
		},
	);

	await logEventFromContext(
		ctx,
		'ahrefs.keywordsExplorer.volumeByCountry',
		{
			keyword: input.keyword,
			keyword_list_id: input.keyword_list_id,
			resultCount: response.countries.length,
		},
		'completed',
	);

	return response;
};
