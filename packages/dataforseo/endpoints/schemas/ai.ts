import { z } from 'zod';
import {
	Bool,
	Filters,
	Location,
	MonthlySearches,
	Num,
	OrderBy,
	Strings,
	Tag,
	Text,
} from './shared';

const LlmResponseItem = z.object({
	type: z.enum(['message', 'reasoning']),
	sections: z
		.array(
			z.object({
				type: Text,
				text: Text,
				annotations: z
					.array(
						z.object({
							title: Text,
							url: Text,
							direct_url: Text,
							start_index: Num,
							end_index: Num,
							text: Text,
						}),
					)
					.nullish(),
			}),
		)
		.nullish(),
});

export const LlmResponseResult = z.object({
	model_name: Text,
	input_tokens: Num,
	output_tokens: Num,
	reasoning_tokens: Num,
	web_search: Bool,
	money_spent: Num,
	datetime: Text,
	items: z.array(LlmResponseItem).nullish(),
	// An array of queries for ChatGPT and Gemini; Perplexity documents an object.
	fan_out_queries: z
		.union([z.array(z.string()), z.record(z.string(), z.array(z.string()))])
		.nullish(),
});

const MentionSource = {
	rank: Num,
	title: Text,
	domain: Text,
	url: Text,
	publication_date: Text,
};

export const MentionsSearchResult = z.object({
	total_count: Num,
	offset: Num,
	search_after_token: Text,
	items_count: Num,
	items: z
		.array(
			z.object({
				platform: Text,
				model_name: Text,
				location_code: Num,
				language_code: Text,
				question: Text,
				answer: Text,
				sources: z
					.array(
						z.object({
							...MentionSource,
							snippet: Text,
							source_name: Text,
							thumbnail: Text,
							markdown: Text,
						}),
					)
					.nullish(),
				search_results: z
					.array(
						z.object({ ...MentionSource, description: Text, breadcrumb: Text }),
					)
					.nullish(),
				ai_search_volume: Num,
				monthly_searches: MonthlySearches,
				first_response_at: Text,
				last_response_at: Text,
				brand_entities: z
					.array(z.object({ rank: Num, title: Text, category: Text }))
					.nullish(),
				fan_out_queries: Strings,
				is_web_search_based: Bool,
			}),
		)
		.nullish(),
});

const MetricRows = z
	.array(z.object({ key: Text, mentions: Num, ai_search_volume: Num }))
	.nullish();

const AggregatedMetrics = {
	location: MetricRows,
	language: MetricRows,
	platform: MetricRows,
	sources_domain: MetricRows,
	search_results_domain: MetricRows,
	brand_entities_title: MetricRows,
	brand_entities_category: MetricRows,
	total: z.object({ mentions: Num, ai_search_volume: Num }).nullish(),
};

export const MentionsTopDomainsResult = z.object({
	total_count: Num,
	offset: Num,
	items_count: Num,
	aggregated_metrics: z.object(AggregatedMetrics).nullish(),
	items: z.array(z.object({ domain: Text, ...AggregatedMetrics })).nullish(),
});

// Inputs

const Prompt = z.string().min(1).max(500);

const LlmRequest = {
	user_prompt: Prompt,
	model_name: z
		.string()
		.min(1)
		.describe('Model name, e.g. gpt-4.1; see the provider models endpoint'),
	max_output_tokens: z.number().int().min(1).max(4096).optional(),
	top_p: z.number().min(0).max(1).optional(),
	system_message: Prompt.optional(),
	message_chain: z
		.array(z.object({ role: z.enum(['user', 'ai']), message: Prompt }))
		.max(10)
		.optional(),
	...Tag,
};

export const ChatGptResponseInput = z.object({
	...LlmRequest,
	temperature: z.number().min(0).max(2).optional(),
	web_search: z.boolean().optional(),
	force_web_search: z.boolean().optional(),
	web_search_country_iso_code: z.string().length(2).optional(),
	web_search_city: z.string().optional(),
});

export const PerplexityResponseInput = z.object({
	...LlmRequest,
	temperature: z.number().min(0).max(1).optional(),
	web_search_country_iso_code: z.string().length(2).optional(),
});

export const GeminiResponseInput = z
	.object({
		...LlmRequest,
		temperature: z.number().min(0).max(2).optional(),
		web_search: z.boolean().optional(),
		use_reasoning: z.boolean().optional(),
	})
	.refine(
		(input) =>
			!input.use_reasoning ||
			input.max_output_tokens === undefined ||
			input.max_output_tokens >= 1024,
		{ message: 'use_reasoning needs max_output_tokens of at least 1024' },
	);

const MentionsTarget = z
	.array(
		z.union([
			z.object({
				domain: z.string().min(1),
				include_subdomains: z.boolean().optional(),
			}),
			z.object({
				keyword: z.string().min(1),
				match_type: z.enum(['word_match', 'partial_match']).optional(),
			}),
		]),
	)
	.min(1)
	.max(10);

const MentionsRequest = {
	target: MentionsTarget,
	...Location,
	platform: z.enum(['chat_gpt', 'google']).optional(),
	filters: Filters.optional(),
	order_by: OrderBy.optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	...Tag,
};

export const MentionsSearchInput = z.object({
	...MentionsRequest,
	offset: z.number().int().min(0).max(1000000).optional(),
	search_after_token: z.string().optional(),
});

export const MentionsTopDomainsInput = z.object({
	...MentionsRequest,
	offset: z.number().int().min(0).max(1000000).optional(),
	links_scope: z.enum(['sources', 'search_results']).optional(),
	initial_dataset_filters: Filters.optional(),
	internal_list_limit: z.number().int().min(1).max(10).optional(),
	include_domains: z.array(z.string().min(1)).optional(),
	exclude_domains: z.array(z.string().min(1)).optional(),
});
