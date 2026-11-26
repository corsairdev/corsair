import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { BraveSearchContext } from '..';
import type { BraveQuery } from '../client';
import {
	assembleAnswerStream,
	braveAdminRequest,
	braveSearchRequest,
} from '../client';
import {
	AdminListAdminKeysInput,
	AdminListAdminKeysOutput,
	AdminListApiKeysInput,
	AdminListApiKeysOutput,
	AdminMeInput,
	AdminMeOutput,
	AdminUsageInput,
	AdminUsageOutput,
	AnswersCreateInput,
	AnswersOutput,
	AnswersResearchInput,
	ImageSearchInput,
	ImageSearchOutput,
	LlmContextInput,
	LlmContextOutput,
	LocalDescriptionsInput,
	LocalDescriptionsOutput,
	LocalPoisInput,
	LocalPoisOutput,
	NewsSearchInput,
	NewsSearchOutput,
	PlaceSearchInput,
	PlaceSearchOutput,
	SpellcheckInput,
	SpellcheckOutput,
	SuggestInput,
	SuggestOutput,
	VideoSearchInput,
	VideoSearchOutput,
	WebRichInput,
	WebRichOutput,
	WebSearchInput,
	WebSearchOutput,
} from './types';

type Endpoint<I extends z.ZodType, O extends z.ZodType> = CorsairEndpoint<
	BraveSearchContext,
	z.input<I>,
	z.output<O>
>;

// Input fields that become request headers, not query parameters. `location`
// is a header object everywhere except local.placeSearch, where it is a text
// query parameter ("tokyo japan"); searchQuery checks its type.
const HEADER_FIELDS = new Set(['api_version', 'no_cache', 'user_agent']);

const LOCATION_HEADERS: Record<string, string> = {
	lat: 'X-Loc-Lat',
	long: 'X-Loc-Long',
	timezone: 'X-Loc-Timezone',
	city: 'X-Loc-City',
	state: 'X-Loc-State',
	state_name: 'X-Loc-State-Name',
	country: 'X-Loc-Country',
	postal_code: 'X-Loc-Postal-Code',
};

type HeaderInput = {
	location?: Record<string, string | number | undefined> | string;
	api_version?: string;
	no_cache?: boolean;
	user_agent?: string;
};

export function requestHeaders(input: HeaderInput): Record<string, string> {
	const headers: Record<string, string> = {};
	const location = typeof input.location === 'object' ? input.location : {};
	for (const [field, value] of Object.entries(location)) {
		const name = LOCATION_HEADERS[field];
		if (name && value !== undefined) headers[name] = String(value);
	}
	if (input.api_version) headers['Api-Version'] = input.api_version;
	if (input.no_cache) headers['Cache-Control'] = 'no-cache';
	if (input.user_agent) headers['User-Agent'] = input.user_agent;
	return headers;
}

/**
 * The query string for a search: every input field except the header ones.
 * Lists join with commas where Brave takes a comma list (`result_filter`) and
 * repeat the key where it takes repeated values (`ids`, `goggles`).
 */
export function searchQuery(input: Record<string, unknown>): BraveQuery {
	const query: BraveQuery = {};
	for (const [field, value] of Object.entries(input)) {
		if (HEADER_FIELDS.has(field) || value === undefined) continue;
		if (field === 'location' && typeof value === 'object') continue;
		query[field] =
			field === 'result_filter' && Array.isArray(value)
				? value.join(',')
				: value;
	}
	return query;
}

function search<I extends z.ZodType<object>, O extends z.ZodType>(
	path: string,
	input: I,
	output: O,
): Endpoint<I, O> {
	return async (ctx, raw) => {
		const parsed = input.parse(raw) as Record<string, unknown> & HeaderInput;
		const result = await braveSearchRequest<unknown>(path, ctx.key, {
			query: searchQuery(parsed),
			headers: requestHeaders(parsed),
		});
		return output.parse(result);
	};
}

export const Web = {
	search: search('/web/search', WebSearchInput, WebSearchOutput),
	rich: search('/web/rich', WebRichInput, WebRichOutput),
};

export const Llm = {
	context: search('/llm/context', LlmContextInput, LlmContextOutput),
};

export const News = {
	search: search('/news/search', NewsSearchInput, NewsSearchOutput),
};

export const Videos = {
	search: search('/videos/search', VideoSearchInput, VideoSearchOutput),
};

export const Images = {
	search: search('/images/search', ImageSearchInput, ImageSearchOutput),
};

export const Local = {
	placeSearch: search(
		'/local/place_search',
		PlaceSearchInput,
		PlaceSearchOutput,
	),
	pois: search('/local/pois', LocalPoisInput, LocalPoisOutput),
	descriptions: search(
		'/local/descriptions',
		LocalDescriptionsInput,
		LocalDescriptionsOutput,
	),
};

export const Suggest = {
	search: search('/suggest/search', SuggestInput, SuggestOutput),
};

export const Spellcheck = {
	search: search('/spellcheck/search', SpellcheckInput, SpellcheckOutput),
};

// ── Answers ─────────────────────────────────────────────────────────────────

const ANSWER_TIMEOUT_MS = 120_000;
const RESEARCH_DEFAULT_SECONDS = 180;
const RESEARCH_MARGIN_MS = 60_000;

/**
 * Answers is always requested as a stream: citations, entities and research
 * only work with `stream: true`, and the stream's last item carries the cost
 * line. Core's transport buffers the whole `text/event-stream` body, which is
 * then put together into one completion.
 */
async function answer(
	ctx: { key: string },
	body: Record<string, unknown>,
	timeoutMs: number,
): Promise<z.output<typeof AnswersOutput>> {
	const result = await braveSearchRequest<unknown>(
		'/chat/completions',
		ctx.key,
		{
			method: 'POST',
			body: { ...body, stream: true },
			timeoutMs,
		},
	);
	if (typeof result === 'string') {
		return AnswersOutput.parse(assembleAnswerStream(result));
	}
	// A JSON completion (no stream): same shape, nothing to lift out.
	return AnswersOutput.parse({
		citations: [],
		tags: [],
		...(result as object),
	});
}

export const Answers = {
	create: (async (ctx, raw) =>
		answer(ctx, AnswersCreateInput.parse(raw), ANSWER_TIMEOUT_MS)) as Endpoint<
		typeof AnswersCreateInput,
		typeof AnswersOutput
	>,
	research: (async (ctx, raw) => {
		const input = AnswersResearchInput.parse(raw);
		const seconds =
			input.research_maximum_number_of_seconds ?? RESEARCH_DEFAULT_SECONDS;
		return answer(
			ctx,
			{ ...input, enable_research: true },
			seconds * 1000 + RESEARCH_MARGIN_MS,
		);
	}) as Endpoint<typeof AnswersResearchInput, typeof AnswersOutput>,
};

// ── Admin API ───────────────────────────────────────────────────────────────

function admin<I extends z.ZodType<object>, O extends z.ZodType>(
	path: string,
	input: I,
	output: O,
): Endpoint<I, O> {
	return async (ctx, raw) => {
		const parsed = input.parse(raw) as BraveQuery;
		const result = await braveAdminRequest<unknown>(
			path,
			// For admin.* the keyBuilder resolves the admin key (index.ts).
			ctx.key,
			{ query: parsed },
		);
		return output.parse(result);
	};
}

export const Admin = {
	me: admin('/me', AdminMeInput, AdminMeOutput),
	usage: admin('/usage', AdminUsageInput, AdminUsageOutput),
	listApiKeys: admin(
		'/api_keys',
		AdminListApiKeysInput,
		AdminListApiKeysOutput,
	),
	listAdminKeys: admin(
		'/admin_keys',
		AdminListAdminKeysInput,
		AdminListAdminKeysOutput,
	),
};
