import { z } from 'zod';
import {
	Bool,
	Coordinate,
	CountMap,
	Filters,
	Location,
	MonthlySearches,
	Num,
	OrderBy,
	Strings,
	Tag,
	Text,
} from './shared';

export const SearchVolumeResult = z.object({
	keyword: z.string(),
	spell: Text,
	location_code: Num,
	language_code: Text,
	search_partners: Bool,
	competition: Text,
	competition_index: Num,
	search_volume: Num,
	low_top_of_page_bid: Num,
	high_top_of_page_bid: Num,
	cpc: Num,
	monthly_searches: MonthlySearches,
});

const KeywordInfo = z
	.object({
		se_type: Text,
		last_updated_time: Text,
		competition: Num,
		competition_level: Text,
		cpc: Num,
		search_volume: Num,
		low_top_of_page_bid: Num,
		high_top_of_page_bid: Num,
		categories: z.array(z.number()).nullish(),
		monthly_searches: MonthlySearches,
		search_volume_trend: z
			.object({ monthly: Num, quarterly: Num, yearly: Num })
			.nullish(),
	})
	.nullish();

const NormalizedInfo = z
	.object({
		last_updated_time: Text,
		search_volume: Num,
		is_normalized: Bool,
		monthly_searches: MonthlySearches,
	})
	.nullish();

export const KeywordData = z.object({
	se_type: Text,
	keyword: z.string(),
	location_code: Num,
	language_code: Text,
	keyword_info: KeywordInfo,
	keyword_info_normalized_with_bing: NormalizedInfo,
	keyword_info_normalized_with_clickstream: NormalizedInfo,
	clickstream_keyword_info: z
		.object({
			search_volume: Num,
			last_updated_time: Text,
			gender_distribution: CountMap,
			age_distribution: CountMap,
			monthly_searches: MonthlySearches,
		})
		.nullish(),
	keyword_properties: z
		.object({
			se_type: Text,
			core_keyword: Text,
			synonym_clustering_algorithm: Text,
			keyword_difficulty: Num,
			detected_language: Text,
			is_another_language: Bool,
			words_count: Num,
		})
		.nullish(),
	serp_info: z
		.object({
			se_type: Text,
			check_url: Text,
			serp_item_types: Strings,
			se_results_count: Num,
			last_updated_time: Text,
			previous_updated_time: Text,
		})
		.nullish(),
	avg_backlinks_info: z
		.object({
			se_type: Text,
			backlinks: Num,
			dofollow: Num,
			referring_pages: Num,
			referring_domains: Num,
			referring_main_domains: Num,
			rank: Num,
			main_domain_rank: Num,
			last_updated_time: Text,
		})
		.nullish(),
	search_intent_info: z
		.object({
			se_type: Text,
			main_intent: Text,
			foreign_intent: Strings,
			last_updated_time: Text,
		})
		.nullish(),
});

export type KeywordData = z.infer<typeof KeywordData>;

const LabsPage = {
	se_type: Text,
	location_code: Num,
	language_code: Text,
	total_count: Num,
	items_count: Num,
	offset: Num,
	offset_token: Text,
	items: z.array(KeywordData).nullish(),
};

export const KeywordSuggestionsResult = z.object({
	seed_keyword: Text,
	seed_keyword_data: KeywordData.nullish(),
	...LabsPage,
});

export const KeywordIdeasResult = z.object({
	seed_keywords: Strings,
	...LabsPage,
});

// Inputs

const LabsKeyword = z
	.string()
	.min(1)
	.max(80)
	.refine((keyword) => keyword.trim().split(/\s+/).length <= 10, {
		message: 'At most 10 words per keyword',
	});

export const SearchVolumeInput = z.object({
	keywords: z.array(LabsKeyword).min(1).max(1000),
	...Location,
	...Coordinate,
	search_partners: z.boolean().optional(),
	date_from: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	date_to: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	include_adult_keywords: z.boolean().optional(),
	sort_by: z
		.enum([
			'relevance',
			'search_volume',
			'competition_index',
			'low_top_of_page_bid',
			'high_top_of_page_bid',
		])
		.optional(),
	...Tag,
});

const LabsPaging = {
	limit: z.number().int().min(1).max(1000).optional(),
	offset: z.number().int().min(0).optional(),
	offset_token: z.string().optional(),
	filters: Filters.optional(),
	order_by: OrderBy.optional(),
	include_serp_info: z.boolean().optional(),
	include_clickstream_data: z.boolean().optional(),
	ignore_synonyms: z.boolean().optional(),
};

const labsLocation = (input: {
	location_name?: string;
	location_code?: number;
}) => input.location_name !== undefined || input.location_code !== undefined;

const labsLocationMessage = {
	message: 'Provide location_name or location_code',
};

export const KeywordSuggestionsInput = z
	.object({
		keyword: z.string().min(1),
		...Location,
		include_seed_keyword: z.boolean().optional(),
		exact_match: z.boolean().optional(),
		...LabsPaging,
		...Tag,
	})
	.refine(labsLocation, labsLocationMessage);

export const KeywordIdeasInput = z
	.object({
		keywords: z.array(z.string().min(1)).min(1).max(200),
		...Location,
		closely_variants: z.boolean().optional(),
		...LabsPaging,
		...Tag,
	})
	.refine(labsLocation, labsLocationMessage);
