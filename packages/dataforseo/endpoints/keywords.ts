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

// One row per keyword, location and language. A row missing either code can't
// be told apart from other markets, so it isn't saved.
async function saveKeywords(ctx: DataForSeoContext, rows: KeywordRow[]) {
	if (!ctx.db.keywords) return;
	for (const row of rows) {
		if (row.location_code == null || row.language_code == null) continue;
		try {
			const id = [row.keyword, row.location_code, row.language_code].join(':');
			await ctx.db.keywords.upsertByEntityId(id, {
				id,
				keyword: row.keyword,
				locationCode: row.location_code,
				languageCode: row.language_code,
				searchVolume: row.search_volume ?? undefined,
				cpc: row.cpc ?? undefined,
				competition:
					row.competition === null || row.competition === undefined
						? undefined
						: String(row.competition),
				updatedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save DataForSEO keyword to database:', error);
		}
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

type LabsItem = {
	keyword: string;
	location_code?: number | null;
	language_code?: string | null;
	keyword_info?: {
		search_volume?: number | null;
		cpc?: number | null;
		competition_level?: string | null;
	} | null;
};

// Items normally carry their codes; the page-level codes cover any that don't.
function labsRows(
	pages: {
		location_code?: number | null;
		language_code?: string | null;
		items?: LabsItem[] | null;
	}[],
): KeywordRow[] {
	return pages.flatMap((page) =>
		(page.items ?? []).map((item) => ({
			keyword: item.keyword,
			location_code: item.location_code ?? page.location_code,
			language_code: item.language_code ?? page.language_code,
			search_volume: item.keyword_info?.search_volume,
			cpc: item.keyword_info?.cpc,
			competition: item.keyword_info?.competition_level,
		})),
	);
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
	await saveKeywords(ctx, labsRows(results(response)));
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
	await saveKeywords(ctx, labsRows(results(response)));
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
