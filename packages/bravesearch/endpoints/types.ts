import { z } from 'zod';

// Response schemas keep the fields Brave documents typed and optional, and
// let everything else through (`z.looseObject`): a response's sections and
// fields vary by query, plan and API version.

// ── Shared inputs ───────────────────────────────────────────────────────────

const Query = (max: number) =>
	z
		.string()
		.min(1)
		.max(max)
		.describe(
			`The search query. Up to ${max} characters; Brave search operators (site:, "quotes", -term) work unless operators is false.`,
		);

const Country = z
	.string()
	.regex(/^([A-Za-z]{2}|ALL)$/)
	.describe(
		'Two-letter country code the results come from (US, GB, DE, ...), or ALL for worldwide. Default US.',
	);
const SearchLang = z
	.string()
	.min(2)
	.max(8)
	.describe(
		'Language of the results: en, de, fr, pt-br, zh-hans, ... Default en.',
	);
const UiLang = z
	.string()
	.regex(/^[a-z]{2}-[A-Z]{2}$/)
	.describe(
		'Language of the response display strings, <lang>-<COUNTRY> such as en-US. Default en-US.',
	);
const Freshness = z
	.string()
	.regex(/^(pd|pw|pm|py|\d{4}-\d{2}-\d{2}to\d{4}-\d{2}-\d{2})$/)
	.describe(
		'Page age filter: pd (24 hours), pw (7 days), pm (31 days), py (365 days), or a range YYYY-MM-DDtoYYYY-MM-DD.',
	);
const Units = z
	.enum(['metric', 'imperial'])
	.describe('Measurement units in results.');
const Goggles = z
	.union([z.string().min(1), z.array(z.string().min(1)).min(1).max(3)])
	.describe(
		'Goggles re-rank results: the URL of a hosted Goggle or a Goggle definition, or a list of up to 3.',
	);
const Offset = z
	.number()
	.int()
	.min(0)
	.max(9)
	.describe('Zero-based page index (pages of `count` results), at most 9.');

/** Sent as `X-Loc-*` headers. Exact coordinates never appear in errors. */
const ClientLocation = z
	.object({
		lat: z
			.number()
			.min(-90)
			.max(90)
			.optional()
			.describe('Latitude (X-Loc-Lat).'),
		long: z
			.number()
			.min(-180)
			.max(180)
			.optional()
			.describe('Longitude (X-Loc-Long).'),
		timezone: z
			.string()
			.optional()
			.describe('IANA time zone such as America/New_York (X-Loc-Timezone).'),
		city: z.string().optional().describe('City name (X-Loc-City).'),
		state: z
			.string()
			.max(3)
			.optional()
			.describe('State or region code, up to 3 characters (X-Loc-State).'),
		state_name: z
			.string()
			.optional()
			.describe('State or region name (X-Loc-State-Name).'),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('Two-letter country code (X-Loc-Country).'),
		postal_code: z
			.string()
			.optional()
			.describe('Postal code (X-Loc-Postal-Code).'),
	})
	.describe('Where the user is, for local results. Sent as X-Loc-* headers.');

/** Request headers every search endpoint takes. */
const RequestOptions = {
	api_version: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional()
		.describe(
			'Pin the response format to an API version (Api-Version header, YYYY-MM-DD). Default latest.',
		),
	no_cache: z
		.boolean()
		.optional()
		.describe(
			'Ask Brave not to serve cached results (Cache-Control: no-cache, best effort).',
		),
	user_agent: z
		.string()
		.optional()
		.describe(
			"The end user's browser User-Agent, for device-specific results.",
		),
};

// ── Shared outputs ──────────────────────────────────────────────────────────

const Thumbnail = z.looseObject({
	src: z.string().optional(),
	original: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	logo: z.boolean().optional(),
});

const MetaUrl = z.looseObject({
	scheme: z.string().optional(),
	netloc: z.string().optional(),
	hostname: z.string().optional(),
	favicon: z.string().optional(),
	path: z.string().optional(),
});

const Profile = z.looseObject({
	name: z.string().optional(),
	long_name: z.string().optional(),
	url: z.string().optional(),
	img: z.string().optional(),
});

const QueryInfo = z.looseObject({
	original: z.string().optional(),
	altered: z.string().optional(),
	cleaned: z.string().optional(),
	spellcheck_off: z.boolean().optional(),
	show_strict_warning: z.boolean().optional(),
	more_results_available: z.boolean().optional(),
	summary_key: z.string().optional(),
});

/** A web-style result (web, news, discussions, POIs). */
const SearchResult = z.looseObject({
	type: z.string().optional(),
	title: z.string().optional(),
	url: z.string().optional(),
	description: z.string().optional(),
	age: z.string().optional(),
	page_age: z.string().optional(),
	page_fetched: z.string().optional(),
	language: z.string().optional(),
	family_friendly: z.boolean().optional(),
	profile: Profile.optional(),
	meta_url: MetaUrl.optional(),
	thumbnail: Thumbnail.optional(),
	extra_snippets: z.array(z.string()).optional(),
});

/** A section of results: `{ type, results: [...] }`. */
const Section = <T extends z.ZodType>(item: T) =>
	z.looseObject({
		type: z.string().optional(),
		results: z.array(item).optional(),
		mutated_by_goggles: z.boolean().optional(),
		family_friendly: z.boolean().optional(),
	});

const Location = z.looseObject({
	id: z.string().optional(),
	type: z.string().optional(),
	title: z.string().optional(),
	url: z.string().optional(),
	provider_url: z.string().optional(),
	description: z.string().optional(),
	coordinates: z.array(z.number()).optional(),
	zoom_level: z.number().optional(),
	thumbnail: Thumbnail.optional(),
	postal_address: z.looseObject({}).optional(),
	opening_hours: z.looseObject({}).optional(),
	contact: z.looseObject({}).optional(),
	price_range: z.string().optional(),
	rating: z.looseObject({}).optional(),
	distance: z.looseObject({}).optional(),
	profiles: z.array(Profile).optional(),
	categories: z.array(z.string()).optional(),
	serves_cuisine: z.array(z.string()).optional(),
	timezone: z.string().optional(),
});

// ── web.search ──────────────────────────────────────────────────────────────

const ResultFilter = z.enum([
	'discussions',
	'faq',
	'infobox',
	'news',
	'query',
	'summarizer',
	'videos',
	'web',
	'locations',
]);

export const WebSearchInput = z.object({
	q: Query(600),
	country: Country.optional(),
	search_lang: SearchLang.optional(),
	ui_lang: UiLang.optional(),
	count: z
		.number()
		.int()
		.min(1)
		.max(20)
		.optional()
		.describe(
			'Web results per page, 1-20 (default 20). Applies to web results only.',
		),
	offset: Offset.optional(),
	safesearch: z
		.enum(['off', 'moderate', 'strict'])
		.optional()
		.describe('Adult content filter. Default moderate.'),
	spellcheck: z
		.boolean()
		.optional()
		.describe(
			'Spell-correct the query (default true); the corrected query is in query.altered.',
		),
	freshness: Freshness.optional(),
	text_decorations: z
		.boolean()
		.optional()
		.describe('Keep highlight markers in snippets (default true).'),
	result_filter: z
		.array(ResultFilter)
		.min(1)
		.optional()
		.describe(
			'Only these result sections. Default: every section the plan includes.',
		),
	units: Units.optional(),
	goggles: Goggles.optional(),
	extra_snippets: z
		.boolean()
		.optional()
		.describe('Up to 5 extra excerpts per result.'),
	enable_rich_callback: z
		.boolean()
		.optional()
		.describe(
			'Return a rich.hint.callback_key for live data (weather, stocks, sports ...); fetch it with web.rich.',
		),
	include_fetch_metadata: z
		.boolean()
		.optional()
		.describe('Add when each page was fetched.'),
	operators: z
		.boolean()
		.optional()
		.describe('Apply search operators (default true).'),
	operators_fallback: z
		.boolean()
		.optional()
		.describe(
			'Try relaxed operator matching first, falling back to the original results (default false).',
		),
	location: ClientLocation.optional(),
	...RequestOptions,
});

export const WebSearchOutput = z.looseObject({
	type: z.string().optional(),
	query: QueryInfo.optional(),
	mixed: z
		.looseObject({
			type: z.string().optional(),
			main: z.array(z.looseObject({})).optional(),
			top: z.array(z.looseObject({})).optional(),
			side: z.array(z.looseObject({})).optional(),
		})
		.optional(),
	web: Section(SearchResult).optional(),
	news: Section(SearchResult).optional(),
	videos: Section(z.looseObject({})).optional(),
	discussions: Section(z.looseObject({})).optional(),
	faq: Section(z.looseObject({})).optional(),
	infobox: Section(z.unknown()).optional(),
	locations: Section(Location).optional(),
	rich: z
		.looseObject({
			type: z.string().optional(),
			hint: z
				.looseObject({
					vertical: z.string().optional(),
					callback_key: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	summarizer: z
		.looseObject({ type: z.string().optional(), key: z.string().optional() })
		.optional(),
});

// ── web.rich ────────────────────────────────────────────────────────────────

export const WebRichInput = z.object({
	callback_key: z
		.string()
		.min(1)
		.describe(
			'rich.hint.callback_key from a web.search with enable_rich_callback.',
		),
	...RequestOptions,
});

export const WebRichOutput = z.looseObject({
	type: z.string().optional(),
	results: z
		.array(
			z.looseObject({
				type: z.string().optional(),
				subtype: z.string().optional(),
				provider: z.looseObject({}).optional(),
			}),
		)
		.optional(),
	response_callback_info: z
		.looseObject({
			vertical: z.string().optional(),
			callback_key: z.string().optional(),
			callback_status: z.string().optional(),
		})
		.optional(),
});

// ── llm.context ─────────────────────────────────────────────────────────────

export const LlmContextInput = z.object({
	q: Query(600),
	country: Country.optional(),
	search_lang: SearchLang.optional(),
	count: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe(
			'Search results considered when picking context, 1-50 (default 20).',
		),
	safesearch: z
		.enum(['off', 'moderate', 'strict'])
		.optional()
		.describe('Adult content filter. Default: none.'),
	spellcheck: z
		.boolean()
		.optional()
		.describe('Spell-correct the query (default true).'),
	operators: z
		.boolean()
		.optional()
		.describe('Apply search operators (default true).'),
	operators_fallback: z
		.boolean()
		.optional()
		.describe(
			'Relaxed operator matching first, then the original results (default true).',
		),
	maximum_number_of_urls: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Most distinct URLs in the context.'),
	maximum_number_of_tokens: z
		.number()
		.int()
		.min(1024)
		.max(32768)
		.optional()
		.describe(
			'Approximate token budget for the whole context, 1024-32768 (default 8192).',
		),
	maximum_number_of_tokens_per_url: z
		.number()
		.int()
		.min(512)
		.max(8192)
		.optional()
		.describe('Token budget per URL, 512-8192 (default 4096).'),
	context_threshold_mode: z
		.enum(['disabled', 'strict', 'lenient', 'balanced'])
		.optional()
		.describe('How strictly content must match the query to be included.'),
	goggles: Goggles.optional(),
	freshness: Freshness.optional(),
	enable_local: z
		.boolean()
		.optional()
		.describe(
			'Local (POI and map) context. Default: on when a location is given.',
		),
	enable_source_metadata: z
		.boolean()
		.optional()
		.describe(
			'Add site_name, favicon, thumbnail and description to each source.',
		),
	location: ClientLocation.omit({ timezone: true }).optional(),
	...RequestOptions,
});

const GroundingItem = z.looseObject({
	url: z.string().optional(),
	title: z.string().optional(),
	name: z.string().optional(),
	snippets: z.array(z.string()).optional(),
});

export const LlmContextOutput = z.looseObject({
	grounding: z
		.looseObject({
			generic: z.array(GroundingItem).optional(),
			poi: GroundingItem.nullish(),
			map: z.array(GroundingItem).optional(),
		})
		.optional(),
	sources: z
		.record(
			z.string(),
			z.looseObject({
				title: z.string().optional(),
				hostname: z.string().optional(),
				age: z.array(z.string()).nullish(),
			}),
		)
		.optional(),
});

// ── news / videos / images ──────────────────────────────────────────────────

const VerticalBase = {
	country: Country.optional(),
	search_lang: SearchLang.optional(),
	spellcheck: z
		.boolean()
		.optional()
		.describe('Spell-correct the query (default true).'),
	...RequestOptions,
};

export const NewsSearchInput = z.object({
	q: Query(400),
	...VerticalBase,
	ui_lang: UiLang.optional(),
	safesearch: z
		.enum(['off', 'moderate', 'strict'])
		.optional()
		.describe('Adult content filter. Default strict.'),
	count: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Results per page, 1-50 (default 20).'),
	offset: Offset.optional(),
	freshness: Freshness.optional(),
	extra_snippets: z
		.boolean()
		.optional()
		.describe('Up to 5 extra excerpts per article.'),
	goggles: Goggles.optional(),
	include_fetch_metadata: z
		.boolean()
		.optional()
		.describe('Add when each page was fetched.'),
	operators: z
		.boolean()
		.optional()
		.describe('Apply search operators (default true).'),
	operators_fallback: z
		.boolean()
		.optional()
		.describe('Relaxed operator matching first (default false).'),
});

export const NewsSearchOutput = z.looseObject({
	type: z.string().optional(),
	query: QueryInfo.optional(),
	results: z
		.array(SearchResult.extend({ breaking: z.boolean().optional() }))
		.optional(),
});

export const VideoSearchInput = z.object({
	q: Query(400),
	...VerticalBase,
	ui_lang: UiLang.optional(),
	safesearch: z
		.enum(['off', 'moderate', 'strict'])
		.optional()
		.describe('Adult content filter. Default moderate.'),
	count: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Results per page, 1-50 (default 20).'),
	offset: Offset.optional(),
	freshness: Freshness.optional(),
	include_fetch_metadata: z
		.boolean()
		.optional()
		.describe('Add when each page was fetched.'),
	operators: z
		.boolean()
		.optional()
		.describe('Apply search operators (default true).'),
	operators_fallback: z
		.boolean()
		.optional()
		.describe('Relaxed operator matching first (default false).'),
});

export const VideoSearchOutput = z.looseObject({
	type: z.string().optional(),
	query: QueryInfo.optional(),
	results: z
		.array(
			z.looseObject({
				type: z.string().optional(),
				url: z.string().optional(),
				title: z.string().optional(),
				description: z.string().optional(),
				age: z.string().optional(),
				page_age: z.string().optional(),
				video: z
					.looseObject({
						duration: z.string().optional(),
						views: z.number().optional(),
						creator: z.string().optional(),
						publisher: z.string().optional(),
					})
					.optional(),
				meta_url: MetaUrl.optional(),
				thumbnail: Thumbnail.optional(),
			}),
		)
		.optional(),
	extra: z
		.looseObject({ might_be_offensive: z.boolean().optional() })
		.optional(),
});

export const ImageSearchInput = z.object({
	q: Query(400),
	...VerticalBase,
	safesearch: z
		.enum(['off', 'strict'])
		.optional()
		.describe('Adult content filter. Default strict.'),
	count: z
		.number()
		.int()
		.min(1)
		.max(200)
		.optional()
		.describe(
			'Results, 1-200 (default 50). Image search has no pages: raise count for more.',
		),
});

export const ImageSearchOutput = z.looseObject({
	type: z.string().optional(),
	query: QueryInfo.optional(),
	results: z
		.array(
			z.looseObject({
				type: z.string().optional(),
				title: z.string().optional(),
				url: z.string().optional(),
				source: z.string().optional(),
				page_fetched: z.string().optional(),
				thumbnail: Thumbnail.optional(),
				properties: z
					.looseObject({
						url: z.string().optional(),
						placeholder: z.string().optional(),
						width: z.number().optional(),
						height: z.number().optional(),
					})
					.optional(),
				meta_url: MetaUrl.optional(),
				confidence: z.string().optional(),
			}),
		)
		.optional(),
	extra: z
		.looseObject({ might_be_offensive: z.boolean().optional() })
		.optional(),
});

// ── local ───────────────────────────────────────────────────────────────────

export const PlaceSearchInput = z.object({
	q: z
		.string()
		.max(400)
		.optional()
		.describe(
			'What to look for (coffee, museums ...). Without it, general points of interest in the area.',
		),
	location: z
		.string()
		.optional()
		.describe(
			'Area as text instead of coordinates: "san francisco ca united states", "tokyo japan".',
		),
	latitude: z
		.number()
		.min(-90)
		.max(90)
		.optional()
		.describe('Latitude of the area centre.'),
	longitude: z
		.number()
		.min(-180)
		.max(180)
		.optional()
		.describe('Longitude of the area centre.'),
	radius: z
		.number()
		.min(0)
		.optional()
		.describe(
			'Bias toward results within this many metres of the coordinates (not a hard limit).',
		),
	count: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results, 1-100 (default 20).'),
	country: Country.optional(),
	search_lang: SearchLang.optional(),
	ui_lang: UiLang.optional(),
	units: Units.optional(),
	safesearch: z
		.enum(['off', 'moderate', 'strict'])
		.optional()
		.describe('Adult content filter. Default strict.'),
	spellcheck: z
		.boolean()
		.optional()
		.describe('Spell-correct the query (default true).'),
	geoloc: z
		.string()
		.regex(/^-?\d+(\.\d+)?x-?\d+(\.\d+)?$/)
		.optional()
		.describe(
			"The user's position as <latitude>x<longitude>, used for distances.",
		),
	...RequestOptions,
});

const PlaceList = z.array(
	z.looseObject({
		name: z.string().optional(),
		country: z.string().optional(),
	}),
);

export const PlaceSearchOutput = z.looseObject({
	type: z.string().optional(),
	query: QueryInfo.optional(),
	results: z.array(Location).optional(),
	cities: PlaceList.optional(),
	countries: PlaceList.optional(),
	regions: PlaceList.optional(),
	neighborhoods: PlaceList.optional(),
	addresses: z.array(z.looseObject({})).optional(),
	streets: z.array(z.looseObject({})).optional(),
	location: z.looseObject({}).optional(),
});

const PoiIds = z
	.array(z.string().min(1))
	.min(1)
	.max(20)
	.describe(
		'Location ids (loc...) from web.search locations or local.placeSearch results. Ids expire after 8 hours.',
	);

export const LocalPoisInput = z.object({
	ids: PoiIds,
	search_lang: SearchLang.optional(),
	ui_lang: UiLang.optional(),
	units: Units.optional(),
	location: ClientLocation.pick({ lat: true, long: true }).optional(),
	...RequestOptions,
});

export const LocalPoisOutput = z.looseObject({
	type: z.string().optional(),
	results: z.array(Location).optional(),
});

export const LocalDescriptionsInput = z.object({
	ids: PoiIds,
	...RequestOptions,
});

export const LocalDescriptionsOutput = z.looseObject({
	type: z.string().optional(),
	results: z
		.array(
			z.looseObject({
				type: z.string().optional(),
				id: z.string().optional(),
				description: z.string().nullish(),
			}),
		)
		.optional(),
});

// ── suggest / spellcheck ────────────────────────────────────────────────────

export const SuggestInput = z.object({
	q: Query(400),
	lang: SearchLang.optional(),
	country: Country.optional(),
	count: z
		.number()
		.int()
		.min(1)
		.max(20)
		.optional()
		.describe('Suggestions, 1-20 (default 5).'),
	rich: z
		.boolean()
		.optional()
		.describe(
			'Add entity data (title, description, image) to suggestions. Needs the paid Autosuggest plan.',
		),
	...RequestOptions,
});

export const SuggestOutput = z.looseObject({
	type: z.string().optional(),
	query: QueryInfo.optional(),
	results: z
		.array(
			z.looseObject({
				query: z.string().optional(),
				is_entity: z.boolean().optional(),
				title: z.string().optional(),
				description: z.string().optional(),
				img: z.string().optional(),
			}),
		)
		.optional(),
});

export const SpellcheckInput = z.object({
	q: Query(400),
	lang: SearchLang.optional(),
	country: Country.optional(),
	...RequestOptions,
});

export const SpellcheckOutput = z.looseObject({
	type: z.string().optional(),
	query: QueryInfo.optional(),
	results: z.array(z.looseObject({ query: z.string().optional() })).optional(),
});

// ── answers ─────────────────────────────────────────────────────────────────

const AnswersBase = {
	messages: z
		.array(
			z.object({
				role: z.literal('user').optional(),
				content: z.string().min(1),
			}),
		)
		.length(1)
		.describe(
			'Exactly one user message: [{ "role": "user", "content": "your question" }].',
		),
	model: z
		.enum(['brave-pro', 'brave'])
		.optional()
		.describe('brave-pro (default) or brave.'),
	max_completion_tokens: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Cap on answer tokens.'),
	country: z
		.string()
		.optional()
		.describe('Country for the searches behind the answer (default us).'),
	language: z
		.string()
		.optional()
		.describe("Answer language (default: the question's language)."),
	safesearch: z
		.enum(['off', 'moderate', 'strict'])
		.optional()
		.describe('Adult content filter (default moderate).'),
	web_search_options: z
		.object({
			search_context_size: z.enum(['low', 'medium', 'high']).optional(),
			user_location: z
				.object({
					type: z.literal('approximate').optional(),
					approximate: z.object({
						city: z.string().optional(),
						country: z.string().optional(),
						region: z.string().optional(),
						timezone: z.string().optional(),
					}),
				})
				.optional(),
		})
		.optional()
		.describe(
			'OpenAI-style search options: context size and approximate user location.',
		),
};

export const AnswersCreateInput = z.object({
	...AnswersBase,
	enable_citations: z
		.boolean()
		.optional()
		.describe(
			'Collect inline citations into `citations` (start/end offsets into the answer, url, snippet).',
		),
	enable_entities: z
		.boolean()
		.optional()
		.describe('Collect inline entity tags into `tags`.'),
});

export const AnswersResearchInput = z.object({
	...AnswersBase,
	research_maximum_number_of_queries: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Most searches in total (default 20).'),
	research_maximum_number_of_iterations: z
		.number()
		.int()
		.min(1)
		.max(5)
		.optional()
		.describe('Most research rounds (default 4).'),
	research_maximum_number_of_seconds: z
		.number()
		.int()
		.min(1)
		.max(300)
		.optional()
		.describe('Time budget in seconds (default 180).'),
	research_maximum_number_of_results_per_query: z
		.number()
		.int()
		.min(1)
		.max(60)
		.optional()
		.describe('Results read per search (default 30).'),
	research_maximum_number_of_tokens_per_query: z
		.number()
		.int()
		.min(1024)
		.max(16384)
		.optional()
		.describe('Tokens gathered per search (default 8192).'),
});

export const AnswersOutput = z.looseObject({
	id: z.string().optional(),
	object: z.string().optional(),
	created: z.number().optional(),
	model: z.string().optional(),
	choices: z.array(
		z.looseObject({
			index: z.number().optional(),
			message: z.looseObject({
				role: z.string().optional(),
				content: z.string(),
			}),
			finish_reason: z.string().nullish(),
		}),
	),
	usage: z.looseObject({}).optional(),
	citations: z
		.array(z.unknown())
		.describe(
			'Citation objects: { start_index, end_index, number, url, favicon, snippet }.',
		),
	cost: z
		.unknown()
		.optional()
		.describe(
			"Brave's usage line: X-Request-Queries, X-Request-Tokens-In/Out and their costs in USD.",
		),
	tags: z
		.array(z.object({ tag: z.string(), value: z.unknown() }))
		.describe(
			'Other tagged stream items (entities and anything new), in order.',
		),
});

// ── admin ───────────────────────────────────────────────────────────────────

// The admin key never travels in call input: it comes from the plugin's
// `adminKey` option or the account's stored `admin_key`.

const AdminList = {
	include_deleted: z
		.boolean()
		.optional()
		.describe('Include deleted keys (default false).'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Keys per page, 1-1000 (default 100).'),
	page: z.string().optional().describe('next_page from the previous response.'),
};

const AdminPlan = z.looseObject({
	id: z.string().optional(),
	name: z.string().optional(),
	billing_model: z.string().optional(),
	billed_on: z.array(z.string()).optional(),
});

export const AdminMeInput = z.object({});

export const AdminMeOutput = z.looseObject({
	object: z.string().optional(),
	id: z.string().optional(),
	name: z.string().nullish(),
	scopes: z.array(z.string()).optional(),
	status: z.string().optional(),
	expires_at: z.string().nullish(),
	organization: z.looseObject({ name: z.string().optional() }).optional(),
});

export const AdminUsageInput = z.object({
	starting_at: z
		.string()
		.min(1)
		.describe(
			'ISO 8601 start with an offset, e.g. 2026-11-01T00:00:00Z. Up to 12 months back.',
		),
	ending_at: z
		.string()
		.optional()
		.describe('ISO 8601 end with an offset (default now).'),
	bucket_width: z
		.enum(['1h', '1d', '1mo'])
		.optional()
		.describe('Bucket size (default 1d). 1mo buckets are the billed totals.'),
	group_by: z
		.array(z.enum(['api_key_id', 'endpoint', 'plan_id']))
		.optional()
		.describe('Split each bucket by these.'),
	api_key_ids: z
		.array(z.string())
		.max(100)
		.optional()
		.describe('Only these search keys (key_...).'),
	endpoints: z
		.array(z.string())
		.max(100)
		.optional()
		.describe(
			'Only these endpoints: web, news, images, videos, llm_context, answers, ...',
		),
	plan_ids: z
		.array(z.string())
		.max(100)
		.optional()
		.describe('Only these plans (plan_...).'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(168)
		.optional()
		.describe('Buckets per page (1h: 168, 1d: 31, 1mo: 12 at most).'),
	page: z.string().optional().describe('next_page from the previous response.'),
});

export const AdminUsageOutput = z.looseObject({
	object: z.string().optional(),
	data: z.array(
		z.looseObject({
			object: z.string().optional(),
			starting_at: z.string().optional(),
			ending_at: z.string().optional(),
			results: z.array(
				z.looseObject({
					api_key_id: z.string().nullish(),
					endpoint: z.string().nullish(),
					plan_id: z.string().nullish(),
					requests: z.number().nullish(),
					queries: z.number().nullish(),
					input_tokens: z.number().nullish(),
					output_tokens: z.number().nullish(),
				}),
			),
		}),
	),
	api_keys: z.record(z.string(), z.looseObject({})).optional(),
	plans: z.record(z.string(), AdminPlan).optional(),
	has_more: z.boolean().optional(),
	next_page: z.string().nullish(),
	data_refreshed_at: z.string().nullish(),
});

export const AdminListApiKeysInput = z.object(AdminList);

export const AdminListApiKeysOutput = z.looseObject({
	object: z.string().optional(),
	data: z.array(
		z.looseObject({
			object: z.string().optional(),
			id: z.string().optional(),
			name: z.string().nullish(),
			hint: z.string().optional(),
			status: z.string().optional(),
			plan: AdminPlan.optional(),
			created_by_name: z.string().nullish(),
			created_at: z.string().optional(),
		}),
	),
	has_more: z.boolean().optional(),
	next_page: z.string().nullish(),
});

export const AdminListAdminKeysInput = z.object(AdminList);

export const AdminListAdminKeysOutput = z.looseObject({
	object: z.string().optional(),
	data: z.array(
		z.looseObject({
			object: z.string().optional(),
			id: z.string().optional(),
			name: z.string().nullish(),
			hint: z.string().optional(),
			status: z.string().optional(),
			scopes: z.array(z.string()).optional(),
			expires_at: z.string().nullish(),
			last_used_at: z.string().nullish(),
			created_by_name: z.string().nullish(),
			created_at: z.string().optional(),
		}),
	),
	has_more: z.boolean().optional(),
	next_page: z.string().nullish(),
});

// ── registry ────────────────────────────────────────────────────────────────

export const BraveSearchEndpointInputSchemas = {
	'web.search': WebSearchInput,
	'web.rich': WebRichInput,
	'llm.context': LlmContextInput,
	'news.search': NewsSearchInput,
	'videos.search': VideoSearchInput,
	'images.search': ImageSearchInput,
	'local.placeSearch': PlaceSearchInput,
	'local.pois': LocalPoisInput,
	'local.descriptions': LocalDescriptionsInput,
	'suggest.search': SuggestInput,
	'spellcheck.search': SpellcheckInput,
	'answers.create': AnswersCreateInput,
	'answers.research': AnswersResearchInput,
	'admin.me': AdminMeInput,
	'admin.usage': AdminUsageInput,
	'admin.listApiKeys': AdminListApiKeysInput,
	'admin.listAdminKeys': AdminListAdminKeysInput,
} as const;

export const BraveSearchEndpointOutputSchemas = {
	'web.search': WebSearchOutput,
	'web.rich': WebRichOutput,
	'llm.context': LlmContextOutput,
	'news.search': NewsSearchOutput,
	'videos.search': VideoSearchOutput,
	'images.search': ImageSearchOutput,
	'local.placeSearch': PlaceSearchOutput,
	'local.pois': LocalPoisOutput,
	'local.descriptions': LocalDescriptionsOutput,
	'suggest.search': SuggestOutput,
	'spellcheck.search': SpellcheckOutput,
	'answers.create': AnswersOutput,
	'answers.research': AnswersOutput,
	'admin.me': AdminMeOutput,
	'admin.usage': AdminUsageOutput,
	'admin.listApiKeys': AdminListApiKeysOutput,
	'admin.listAdminKeys': AdminListAdminKeysOutput,
} as const;

type Inputs = typeof BraveSearchEndpointInputSchemas;
type Outputs = typeof BraveSearchEndpointOutputSchemas;

export type BraveSearchEndpointInputs = {
	[K in keyof Inputs]: z.input<Inputs[K]>;
};
export type BraveSearchEndpointOutputs = {
	[K in keyof Outputs]: z.output<Outputs[K]>;
};

export type WebSearchInputType = z.input<typeof WebSearchInput>;
export type WebSearchOutputType = z.output<typeof WebSearchOutput>;
export type LlmContextOutputType = z.output<typeof LlmContextOutput>;
export type AnswersOutputType = z.output<typeof AnswersOutput>;
