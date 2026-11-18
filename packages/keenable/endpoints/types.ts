import { z } from 'zod';

// Schemas mirror the canonical Keenable OpenAPI spec v1.0.0
// (https://docs.keenable.ai/api-reference/openapi.json) plus the published
// docs pages for POST /v1/search and GET /v1/fetch. Divergences between the
// canonical spec, the older search-api.json v0.1.18 spec and the docs prose
// are called out inline (research §Divergences).

// ── Shared filter schemas ───────────────────────────────────────────────────

// Documented date/time filter formats
// (docs /api-reference/search#date-and-time-filters): full-date YYYY-MM-DD,
// an ISO 8601 timestamp, or a relative delta such as `7d` / `30min`.
const DateFilterSchema = z
	.string()
	.regex(
		/^(?:\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})?)?|\d+(?:min|h|d|mo|y))$/,
		'Expected a date (YYYY-MM-DD), an ISO 8601 timestamp, or a relative delta (e.g. 7d, 30min)',
	);

// `query_time` divergence (research §Divergences #3, UNVERIFIED): the older
// search-api.json spec additionally accepts epoch seconds and the `w` relative
// unit, so the superset is accepted here and passed through verbatim.
const QueryTimeSchema = z
	.string()
	.regex(
		/^(?:\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})?)?|\d+(?:min|h|d|w|mo|y)?)$/,
		'Expected a date, an ISO 8601 timestamp, a relative delta (e.g. 7d) or epoch seconds',
	);

// ── Search Endpoint ─────────────────────────────────────────────────────────

export const SearchInputSchema = z.object({
	query: z.string().min(1, 'Search query cannot be empty'),
	// Docs default is `pro` (deeper retrieval) when omitted; `realtime` is the
	// fastest mode. The response echoes the mode actually served.
	mode: z.enum(['realtime', 'pro']).optional(),
	site: z.string().optional(),
	acquired_after: DateFilterSchema.optional(),
	acquired_before: DateFilterSchema.optional(),
	published_after: DateFilterSchema.optional(),
	published_before: DateFilterSchema.optional(),
	query_time: QueryTimeSchema.optional(),
	// Spec range: min 180, max 10000 characters of snippet per result. The
	// vendor default when omitted is undocumented.
	snippet_max_length: z.number().int().min(180).max(10000).optional(),
	// Spec range: min 1, max 50 results (docs: default up to 10). No
	// pagination/cursor exists anywhere in the API.
	max_results: z.number().int().min(1).max(50).optional(),
});

export type SearchInput = z.infer<typeof SearchInputSchema>;

export const SearchResultSchema = z
	.object({
		title: z.string(),
		url: z.string(),
		// The older search-api.json spec marks `description` deprecated
		// ("always empty; read snippet") while the canonical spec requires it
		// (research §Divergences #1, UNVERIFIED) — accept either.
		description: z.string().optional(),
		snippet: z.string().optional(),
		published_at: z.string().optional(),
		acquired_at: z.string().optional(),
	})
	.passthrough();

export type SearchResult = z.infer<typeof SearchResultSchema>;

export const SearchResponseSchema = z
	.object({
		query: z.string(),
		mode: z.string(),
		results: z.array(SearchResultSchema),
		// `warning` exists only in the older search-api.json v0.1.18 spec
		// (UNVERIFIED). `.passthrough()` keeps it when present.
	})
	.passthrough();

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// ── Fetch Endpoint ──────────────────────────────────────────────────────────

export const FetchInputSchema = z.object({
	url: z.string().url(),
	// Docs default is 50000; min 1. Content past the cut may run slightly over
	// the limit because a truncation notice is appended.
	max_chars: z.number().int().min(1).optional(),
	// Docs default is false: fetch the indexed copy; `true` fetches live from
	// the source and is required for pages that are not indexed.
	live: z.boolean().optional(),
	// Optional LLM extraction instruction; when set, `content` contains only
	// the output for this instruction. Added July 2026.
	prompt: z.string().max(2000).optional(),
});

export type FetchInput = z.infer<typeof FetchInputSchema>;

// fetch `published_at` divergence (research §Divergences #2, UNVERIFIED): the
// canonical OpenAPI spec types it as an ISO 8601 string, while the published
// /api-reference/fetch docs example returns Unix seconds — accept both.
export const FetchPublishedAtSchema = z.union([z.string(), z.number()]);

export const FetchResponseSchema = z
	.object({
		// May differ from the requested URL after redirects.
		url: z.string(),
		title: z.string().optional(),
		// Deprecated in the older search-api.json spec ("always empty; read
		// content") while canonical spec/docs treat it as normal (UNVERIFIED).
		description: z.string().optional(),
		author: z.string().optional(),
		published_at: FetchPublishedAtSchema.optional(),
		content: z.string(),
	})
	.passthrough();

export type FetchResponse = z.infer<typeof FetchResponseSchema>;

// ── Plugin Endpoint Input/Output Collections ────────────────────────────────

export type KeenableEndpointInputs = {
	search: SearchInput;
	fetch: FetchInput;
};

export type KeenableEndpointOutputs = {
	search: SearchResponse;
	fetch: FetchResponse;
};

export const KeenableEndpointInputSchemas = {
	search: SearchInputSchema,
	fetch: FetchInputSchema,
} as const;

export const KeenableEndpointOutputSchemas = {
	search: SearchResponseSchema,
	fetch: FetchResponseSchema,
} as const;
