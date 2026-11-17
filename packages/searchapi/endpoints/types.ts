import { z } from 'zod';
import {
	SearchApiAccountEntity,
	SearchApiLocationEntity,
	SearchApiSearchEntity,
} from '../schema/database';

export const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

export const LocationInputSchema = z.object({
	q: z.string().min(1),
	limit: z.number().int().min(1).max(100).optional(),
});
export type LocationInput = z.infer<typeof LocationInputSchema>;

const RESERVED_PARAMS = new Set(['api_key', 'engine']);

export const SearchInputSchema = z
	.object({
		/** google, google_news, google_maps, bing, youtube, amazon_search, ... (see searchapi.io/docs). */
		engine: z.string().regex(/^[a-z0-9_]+$/),
		q: z.string().min(1).optional(),
		/** A canonical name from locations.list, e.g. "Austin,Texas,United States". */
		location: z.string().min(1).optional(),
		/** Country code, e.g. us. */
		gl: z.string().min(2).max(5).optional(),
		/** Interface language, e.g. en. */
		hl: z.string().min(2).max(7).optional(),
		device: z.enum(['desktop', 'mobile', 'tablet']).optional(),
		page: z.number().int().min(1).optional(),
		safe: z.enum(['active', 'blur', 'off']).optional(),
		time_period: z
			.enum([
				'last_1_minute',
				'last_5_minutes',
				'last_15_minutes',
				'last_30_minutes',
				'last_hour',
				'last_day',
				'last_week',
				'last_month',
				'last_year',
			])
			.optional(),
		/** Other parameters the chosen engine documents, e.g. { video_id: '...' } or { tbm: 'nws' }. */
		params: z
			.record(
				z.string().regex(/^[a-z0-9_]+$/),
				z.union([z.string(), z.number(), z.boolean()]),
			)
			.refine(
				(value) => Object.keys(value).every((key) => !RESERVED_PARAMS.has(key)),
				{
					message: 'params cannot set api_key or engine',
				},
			)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			value.q || (value.params && Object.keys(value.params).length > 0),
		{
			message: "Pass q, or the engine's own parameters in params",
		},
	);
export type SearchInput = z.infer<typeof SearchInputSchema>;

export const IdInputSchema = z.object({
	id: z.string().regex(/^[A-Za-z0-9_-]+$/),
});
export type IdInput = z.infer<typeof IdInputSchema>;

export const AccountResponseSchema = z.object({
	account: SearchApiAccountEntity,
});
export type AccountResponse = z.infer<typeof AccountResponseSchema>;

export const LocationListResponseSchema = z.object({
	locations: z.array(SearchApiLocationEntity),
});
export type LocationListResponse = z.infer<typeof LocationListResponseSchema>;

export const ResultSchema = z.object({
	position: z.number().optional(),
	title: z.string().optional(),
	link: z.string().optional(),
	displayed_link: z.string().optional(),
	snippet: z.string().optional(),
	date: z.string().optional(),
	source: z.string().optional(),
	domain: z.string().optional(),
});

export const SearchResponseSchema = z.object({
	search: SearchApiSearchEntity,
	/** organic_results, trimmed to the fields above. */
	results: z.array(ResultSchema),
	/**
	 * Every other part of the engine's answer, keyed as SearchAPI names it (answer_box, ai_overview,
	 * knowledge_graph, related_questions, top_stories, local_results, news_results, images, pagination, ...).
	 * unknown: each engine and section has its own shape.
	 */
	sections: z.record(z.string(), z.unknown()),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const HtmlResponseSchema = z.object({
	html: z.string(),
});
export type HtmlResponse = z.infer<typeof HtmlResponseSchema>;

export const EndpointInputSchemas = {
	'account.get': EmptyInputSchema,
	'locations.list': LocationInputSchema,
	'searches.run': SearchInputSchema,
	'searches.get': IdInputSchema,
	'searches.html': IdInputSchema,
} as const;

export const EndpointOutputSchemas = {
	'account.get': AccountResponseSchema,
	'locations.list': LocationListResponseSchema,
	'searches.run': SearchResponseSchema,
	'searches.get': SearchResponseSchema,
	'searches.html': HtmlResponseSchema,
} as const;
