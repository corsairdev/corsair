import { logEventFromContext } from 'corsair/core';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpoints } from '../index';
import { callAhrefs, checkAhrefsOutput } from './request';
import { AhrefsEndpointInputSchemas } from './types';

export const overview: AhrefsEndpoints['keywordsOverview'] = async (
	ctx,
	input,
) => {
	const keywords = Array.isArray(input.keywords)
		? input.keywords.join(',')
		: input.keywords;

	const { target_mode, ...parsed } =
		AhrefsEndpointInputSchemas.keywordsOverview.parse(input);

	const response = checkAhrefsOutput(
		'keywordsOverview',
		'ahrefs.keywordsExplorer.overview',
		await makeAhrefsRequest<unknown>('/keywords-explorer/overview', ctx.key, {
			query: {
				...parsed,
				mode: parsed.mode ?? target_mode,
				keywords,
			},
		}),
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

export const matchingTerms: AhrefsEndpoints['matchingTerms'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'matchingTerms',
			method: 'GET',
			path: '/keywords-explorer/matching-terms',
			event: 'ahrefs.keywordsExplorer.matchingTerms',
			logKeys: ['keywords', 'country', 'keyword_list_id'],
		},
		input,
	);

export const relatedTerms: AhrefsEndpoints['relatedTerms'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'relatedTerms',
			method: 'GET',
			path: '/keywords-explorer/related-terms',
			event: 'ahrefs.keywordsExplorer.relatedTerms',
			logKeys: ['keywords', 'country', 'keyword_list_id'],
		},
		input,
	);

export const searchSuggestions: AhrefsEndpoints['searchSuggestions'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'searchSuggestions',
			method: 'GET',
			path: '/keywords-explorer/search-suggestions',
			event: 'ahrefs.keywordsExplorer.searchSuggestions',
			logKeys: ['keywords', 'country', 'keyword_list_id'],
		},
		input,
	);

export const volumeHistory: AhrefsEndpoints['volumeHistory'] = (ctx, input) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'volumeHistory',
			method: 'GET',
			path: '/keywords-explorer/volume-history',
			event: 'ahrefs.keywordsExplorer.volumeHistory',
			logKeys: ['keyword', 'country', 'date_from', 'date_to'],
		},
		input,
	);

export const volumeByCountry: AhrefsEndpoints['volumeByCountry'] = (
	ctx,
	input,
) =>
	callAhrefs(
		ctx,
		{
			endpoint: 'volumeByCountry',
			method: 'GET',
			path: '/keywords-explorer/volume-by-country',
			event: 'ahrefs.keywordsExplorer.volumeByCountry',
			logKeys: ['keyword', 'keyword_list_id'],
		},
		input,
	);
