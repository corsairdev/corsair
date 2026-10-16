import type { DataForSeoContext, DataForSeoEndpoints } from '..';
import { call, results } from './call';

type KeywordRow = {
	keyword: string;
	location_code?: number | null;
	language_code?: string | null;
	search_volume?: number | null;
	cpc?: number | null;
	competition?: number | string | null;
};

async function saveKeywords(ctx: DataForSeoContext, rows: KeywordRow[]) {
	if (!ctx.db.keywords) return;
	try {
		for (const row of rows) {
			const id = [
				row.keyword,
				row.location_code ?? 'any',
				row.language_code ?? 'any',
			].join(':');
			await ctx.db.keywords.upsertByEntityId(id, {
				id,
				keyword: row.keyword,
				locationCode: row.location_code ?? undefined,
				languageCode: row.language_code ?? undefined,
				searchVolume: row.search_volume ?? undefined,
				cpc: row.cpc ?? undefined,
				competition:
					row.competition === null || row.competition === undefined
						? undefined
						: String(row.competition),
				updatedAt: new Date(),
			});
		}
	} catch (error) {
		console.warn('Failed to save DataForSEO keywords to database:', error);
	}
}

export const searchVolume: DataForSeoEndpoints['keywordsSearchVolume'] = async (
	ctx,
	input,
) => {
	const response = await call(
		ctx,
		'keywordsSearchVolume',
		'keywords.searchVolume',
		{
			method: 'POST',
			path: '/v3/keywords_data/google_ads/search_volume/live',
		},
		input,
	);
	await saveKeywords(ctx, results(response));
	return response;
};

function labsRows(
	items: {
		keyword: string;
		location_code?: number | null;
		language_code?: string | null;
		keyword_info?: {
			search_volume?: number | null;
			cpc?: number | null;
			competition_level?: string | null;
		} | null;
	}[],
): KeywordRow[] {
	return items.map((item) => ({
		keyword: item.keyword,
		location_code: item.location_code,
		language_code: item.language_code,
		search_volume: item.keyword_info?.search_volume,
		cpc: item.keyword_info?.cpc,
		competition: item.keyword_info?.competition_level,
	}));
}

export const suggestions: DataForSeoEndpoints['keywordsSuggestions'] = async (
	ctx,
	input,
) => {
	const response = await call(
		ctx,
		'keywordsSuggestions',
		'keywords.suggestions',
		{
			method: 'POST',
			path: '/v3/dataforseo_labs/google/keyword_suggestions/live',
		},
		input,
	);
	await saveKeywords(
		ctx,
		labsRows(results(response).flatMap((r) => r.items ?? [])),
	);
	return response;
};

export const ideas: DataForSeoEndpoints['keywordsIdeas'] = async (
	ctx,
	input,
) => {
	const response = await call(
		ctx,
		'keywordsIdeas',
		'keywords.ideas',
		{
			method: 'POST',
			path: '/v3/dataforseo_labs/google/keyword_ideas/live',
		},
		input,
	);
	await saveKeywords(
		ctx,
		labsRows(results(response).flatMap((r) => r.items ?? [])),
	);
	return response;
};

export const locations: DataForSeoEndpoints['keywordsLocations'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'keywordsLocations',
		'keywords.locations',
		{
			method: 'GET',
			path: '/v3/dataforseo_labs/locations_and_languages',
		},
		input,
	);
