import { z } from 'zod';

// Inputs use Adyntel's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Adyntel adds or omits cannot fail a call
// that has already happened and been charged.
// Reference: https://docs.adyntel.com/openapi-docs/existing-endpoints

/**
 * Adyntel matches country codes case-insensitively and documents `ALL` as a
 * valid value on Meta, so this stays a plain string rather than an enum. The
 * API rejects a bad code with a 400 or a 422, which is a better error than one
 * this schema would invent.
 */
const CountryCodeSchema = z
	.string()
	.trim()
	.min(2)
	.describe('ISO 3166-1 alpha-2 code, e.g. `US`. Meta also accepts `ALL`.');

/** Pagination token from a previous page; the last page carries `null`. */
const ContinuationTokenSchema = z
	.string()
	.min(1)
	.describe('`continuation_token` from the previous response.');

/**
 * Adyntel posts results to this URL when it finishes a scrape, instead of
 * returning them in the response. The plugin does not receive that POST.
 */
const WebhookUrlSchema = z
	.url()
	.describe(
		'Adyntel POSTs the results here when the scrape finishes, instead of returning them. You host and receive that POST; this plugin does not.',
	);

// ── shared output pieces ──────────────────────────────────────────────────

/**
 * With `webhook_url` set, every scrape endpoint answers with a job reference
 * instead of ads, and the ads arrive at that URL later. These fields are merged
 * into each endpoint that accepts `webhook_url` so the parse still succeeds and
 * a caller can see that it got a job reference rather than an empty result.
 */
const AsyncJobFields = {
	status: z.string().nullish().describe('`job started` when a job was queued.'),
	jobId: z.string().nullish().describe('Track via `GET /track/jobs`.'),
	jobIds: z
		.array(z.string())
		.nullish()
		.describe('One ID per country, for the multi-country Meta form.'),
	failedCountries: z
		.array(z.string())
		.nullish()
		.describe('Countries that were never queued and were not charged.'),
	message: z.string().nullish(),
	chunk_count: z
		.number()
		.nullish()
		.describe('Number of POSTs Adyntel made to `webhook_url`.'),
};

/**
 * A creative as it appears inside `snapshot`. Meta's payload is wide and grows
 * without notice; the fields below are the ones a caller can act on, and
 * `.loose()` keeps everything else (translations, certificates, dynamic
 * versions) without this schema having to track it.
 */
const MetaSnapshotSchema = z
	.object({
		page_id: z.union([z.string(), z.number()]).nullish(),
		page_name: z.string().nullish(),
		page_profile_uri: z.string().nullish(),
		page_profile_picture_url: z.string().nullish(),
		page_is_profile_page: z.boolean().nullish(),
		page_like_count: z.number().nullish(),
		page_entity_type: z.string().nullish(),
		page_categories: z
			.union([
				// One endpoint sends a name list, the other a {id: name} map.
				z.array(z.string()),
				z.record(z.string(), z.string()),
			])
			.nullish(),
		current_page_name: z.string().nullish(),
		body: z
			.object({
				text: z.string().nullish(),
				// unknown: the ad-library markup object is nested and optional.
				markup: z.record(z.string(), z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
		caption: z.string().nullish(),
		title: z.string().nullish(),
		link_url: z.string().nullish(),
		link_description: z.string().nullish(),
		cta_text: z.string().nullish(),
		cta_type: z.string().nullish(),
		display_format: z.string().nullish(),
		// unknown: each card is a wide creative object; `MetaCardSchema` reads
		// the fields this plugin exposes and passes the rest through.
		cards: z.array(z.record(z.string(), z.unknown())).nullish(),
		// unknown: same as `cards`, for image and video creatives.
		images: z.array(z.record(z.string(), z.unknown())).nullish(),
		// unknown: same as `cards`, for video creatives.
		videos: z.array(z.record(z.string(), z.unknown())).nullish(),
		instagram_handle: z.string().nullish(),
		instagram_url: z.string().nullish(),
		instagram_actor_name: z.string().nullish(),
		is_reshared: z.boolean().nullish(),
		// unknown: a reshared post repeats the whole snapshot shape.
		root_reshared_post: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const MetaCountrySplitSchema = z
	.object({
		impressions: z.string().nullish(),
		country: z.string().nullish(),
	})
	.loose();

/**
 * The EU transparency block LinkedIn adds when `impression_data` is true. An ad
 * outside the EU still gets the object, with every field empty.
 */
const LinkedInEuTransparencySchema = z
	.object({
		startDate: z.string().nullish(),
		endDate: z.string().nullish(),
		adDuration: z.string().nullish(),
		totalImpressions: z.string().nullish(),
		impressionsByCountry: z
			.array(MetaCountrySplitSchema)
			.nullish()
			.describe('Per-country impression split, e.g. `34%`.'),
		targeting: z.record(z.string(), z.string()).nullish(),
	})
	.loose();

const LinkedInAdSchema = z
	.object({
		creative_type: z.string().nullish(),
		ad_id: z.string().nullish(),
		/** `image`, `carousel`, `video` or `text`. */
		type: z.string().nullish(),
		advertiser: z
			.object({
				name: z.string().nullish(),
				logo_url: z.string().nullish(),
				promoted: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		commentary: z
			.object({
				text: z.string().nullish(),
				link: z.string().nullish(),
			})
			.loose()
			.nullish(),
		image: z
			.object({
				alt_text: z.string().nullish(),
				url: z.string().nullish(),
			})
			.loose()
			.nullish(),
		// unknown: carousel cards are a repeated creative object.
		carousel: z.array(z.record(z.string(), z.unknown())).nullish(),
		headline: z
			.object({
				title: z.string().nullish(),
				description: z.string().nullish(),
			})
			.loose()
			.nullish(),
		view_details_link: z.string().nullish(),
		/** Present only with `extract_text`; null when the read failed. */
		extracted_text: z.string().nullish(),
		eu_transparency: LinkedInEuTransparencySchema.nullish(),
	})
	.loose();

/**
 * Both LinkedIn endpoints answer with the same four fields plus `ads`.
 * `extract: 'number_of_ads'` on the company endpoint replaces the payload with a
 * bare count, so every field but `ads` is nullish.
 */
const LinkedInPageSchema = z
	.object({
		page_id: z.string().nullish(),
		continuation_token: z.string().nullish(),
		is_last_page: z.boolean().nullish(),
		total_ads: z.number().nullish(),
		ads: z.array(LinkedInAdSchema).nullish(),
	})
	.loose();

// ── meta.ads ──────────────────────────────────────────────────────────────

export const META_MEDIA_TYPES = [
	'image',
	'meme',
	'image_and_meme',
	'video',
] as const;
export const META_ACTIVE_STATUSES = ['inactive', 'all'] as const;
export const META_AD_TYPES = [
	'political',
	'properties',
	'employment',
	'financial',
] as const;

const MetaAdsInputSchema = z
	.object({
		facebook_url: z
			.url()
			.describe(
				'The page to look up, starting with `https://`, e.g. `https://facebook.com/zoom`.',
			)
			.optional(),
		company_domain: z
			.string()
			.min(1)
			.describe(
				'The bare domain, without `https://` or `www.`, e.g. `zoom.com`.',
			)
			.optional(),
		country_code: z
			.union([CountryCodeSchema, z.array(CountryCodeSchema).min(1).max(20)])
			.describe(
				'One code, or up to 20 for one job per country. The array form needs `webhook_url` and costs one credit per country.',
			)
			.optional(),
		media_type: z.enum(META_MEDIA_TYPES).optional(),
		active_status: z
			.enum(META_ACTIVE_STATUSES)
			.describe('Left out, the call returns active ads only.')
			.optional(),
		language: z
			.union([z.string().min(2), z.array(z.string().min(2)).min(1)])
			.describe(
				'A language name (`Polish`), an ISO 639-1 code (`pl`), or a mixed array matching any of them. An unknown language is a 422.',
			)
			.optional(),
		ad_type: z
			.enum(META_AD_TYPES)
			.describe(
				'A single special ad category, as Meta labels it. `political` works only with `US`.',
			)
			.optional(),
		check_ugc: z
			.boolean()
			.describe(
				'Adds `is_ugc_video` to each ad. Works only with `media_type: "video"`.',
			)
			.optional(),
		all_ads: z
			.boolean()
			.describe(
				'Follows `continuation_token` to the end. Needs `webhook_url`, costs one credit per page and cannot be stopped.',
			)
			.optional(),
		continuation_token: ContinuationTokenSchema.optional(),
		webhook_url: WebhookUrlSchema.optional(),
	})
	.refine(
		(value) => Boolean(value.facebook_url) !== Boolean(value.company_domain),
		{
			message:
				'Send exactly one of `facebook_url` or `company_domain`, not both and not neither.',
			path: ['company_domain'],
		},
	);

export type MetaAdsInput = z.input<typeof MetaAdsInputSchema>;

/**
 * The `/facebook` payload uses snake_case (`ad_archive_id`), where
 * `/facebook_ad_search` uses camelCase (`adArchiveID`). They are separate
 * schemas on purpose; one loose schema covering both would hide which endpoint
 * a caller is reading.
 */
const MetaAdSchema = z
	.object({
		ad_archive_id: z.string().nullish(),
		page_id: z.string().nullish(),
		page_name: z.string().nullish(),
		is_active: z.boolean().nullish(),
		categories: z.array(z.string()).nullish(),
		collation_id: z.string().nullish(),
		entity_type: z.string().nullish(),
		publisher_platform: z.array(z.string()).nullish(),
		/** Unix seconds. */
		start_date: z.number().nullish(),
		/** Unix seconds. `null` while the ad still runs. */
		end_date: z.number().nullish(),
		total_active_time: z.number().nullish(),
		/** Present only when the call sent `check_ugc: true`. */
		is_ugc_video: z.boolean().nullish(),
		snapshot: MetaSnapshotSchema.nullish(),
	})
	.loose();

const MetaAdsResponseSchema = z
	.object({
		...AsyncJobFields,
		page_id: z.string().nullish(),
		country_code: z.string().nullish(),
		continuation_token: z.string().nullish().describe('Null on the last page.'),
		platform: z.array(z.string()).nullish(),
		media_types: z.string().nullish(),
		sort_data: z.string().nullish(),
		active_status: z.string().nullish(),
		is_result_complete: z.boolean().nullish(),
		number_of_ads: z.number().nullish(),
		count_landing_pages: z.number().nullish(),
		unique_landing_pages: z.array(z.string()).nullish(),
		/** ISO 8601, e.g. `2026-08-20T07:00:00Z`. */
		start_min_date: z.string().nullish(),
		start_max_date: z.string().nullish(),
		/**
		 * A flat list of ads. `/facebook` itself is inconsistent: the same
		 * domain came back as flat records on one call and as one array per
		 * page on the next, so the endpoint flattens both forms before this
		 * schema sees them.
		 */
		results: z.array(MetaAdSchema).nullish(),
	})
	.loose();

export type MetaAdsResponse = z.output<typeof MetaAdsResponseSchema>;

// ── meta.adSearch ─────────────────────────────────────────────────────────

const MetaAdSearchInputSchema = z.object({
	keyword: z
		.string()
		.min(1)
		.describe('The phrase to search the ad library for.'),
	country_code: CountryCodeSchema.optional(),
	continuation_token: ContinuationTokenSchema.optional(),
	all_ads: z
		.boolean()
		.describe('Auto-paginate to the last page. One credit per page.')
		.optional(),
});

export type MetaAdSearchInput = z.input<typeof MetaAdSearchInputSchema>;

/**
 * The keyword search returns the same snake_case record as `/facebook`:
 * `ad_archive_id`, `page_id`, `is_active`. The OpenAPI spec's camelCase
 * (`adArchiveID`, `pageID`) is stale; the deployed API sends neither. Both
 * spellings are accepted so an account on an older build keeps working.
 */
const MetaAdSearchAdSchema = z
	.object({
		ad_archive_id: z.string().nullish(),
		adArchiveID: z.string().nullish(),
		adid: z.string().nullish(),
		ad_id: z.string().nullish(),
		page_id: z.union([z.string(), z.number()]).nullish(),
		pageID: z.string().nullish(),
		page_name: z.string().nullish(),
		pageName: z.string().nullish(),
		is_active: z.boolean().nullish(),
		isActive: z.boolean().nullish(),
		is_profile_page: z.boolean().nullish(),
		isProfilePage: z.boolean().nullish(),
		categories: z.array(z.union([z.string(), z.number()])).nullish(),
		publisher_platform: z.array(z.string()).nullish(),
		publisherPlatform: z.array(z.string()).nullish(),
		currency: z.string().nullish(),
		/** Unix seconds. */
		start_date: z.number().nullish(),
		startDate: z.number().nullish(),
		end_date: z.number().nullish(),
		endDate: z.number().nullish(),
		total_active_time: z.number().nullish(),
		totalActiveTime: z.number().nullish(),
		entity_type: z.string().nullish(),
		entityType: z.string().nullish(),
		snapshot: MetaSnapshotSchema.nullish(),
	})
	.loose();

const MetaAdSearchResponseSchema = z
	.object({
		query: z.string().nullish(),
		country_code: z.string().nullish(),
		continuation_token: z.string().nullish(),
		platform: z.array(z.string()).nullish(),
		media_types: z.string().nullish(),
		active_status: z.string().nullish(),
		ad_type: z.string().nullish(),
		search_type: z.string().nullish(),
		is_result_complete: z.boolean().nullish(),
		number_of_ads: z.number().nullish(),
		/** ISO 8601, e.g. `2023-08-07T07:00:00Z`. */
		start_min_date: z.string().nullish(),
		start_max_date: z.string().nullish(),
		results: z
			.array(z.array(MetaAdSearchAdSchema))
			.nullish()
			.describe('One inner array per result page.'),
	})
	.loose();

export type MetaAdSearchResponse = z.output<typeof MetaAdSearchResponseSchema>;

// ── google.ads ────────────────────────────────────────────────────────────

export const GOOGLE_MEDIA_TYPES = ['text', 'image', 'video', 'all'] as const;
export const GOOGLE_DATA_PROVIDERS = ['rapidapi', 'apify'] as const;

const GoogleAdsInputSchema = z.object({
	company_domain: z
		.string()
		.min(1)
		.describe('The bare domain, without `https://` or `www.`.'),
	media_type: z
		.enum(GOOGLE_MEDIA_TYPES)
		.describe(
			'Defaults to `all`. Anything unrecognised is also treated as `all` rather than rejected, so a typo silently widens the result.',
		)
		.optional(),
	country_code: z
		.string()
		.trim()
		.min(2)
		.describe(
			'One country per call; a list is rejected. Leave it out, or send `anywhere`, for worldwide results. Send the same code again with every `continuation_token`.',
		)
		.optional(),
	continuation_token: ContinuationTokenSchema.optional(),
	extract_text: z
		.boolean()
		.describe(
			'Extracts the text inside each creative for one extra credit. The docs table spells it `extract-text`; the OpenAPI spec and this plugin use `extract_text`.',
		)
		.optional(),
	all_ads: z
		.boolean()
		.describe('Needs `webhook_url`. One credit per page and cannot be stopped.')
		.optional(),
	webhook_url: WebhookUrlSchema.optional(),
	data_provider: z.enum(GOOGLE_DATA_PROVIDERS).optional(),
});

export type GoogleAdsInput = z.input<typeof GoogleAdsInputSchema>;

const GoogleAdVariantSchema = z
	.object({
		content: z.string().nullish(),
		height: z.number().nullish(),
		width: z.number().nullish(),
	})
	.loose();

const GoogleAdSchema = z
	.object({
		advertiser_id: z.string().nullish(),
		advertiser_name: z.string().nullish(),
		creative_id: z.string().nullish(),
		original_url: z.string().nullish(),
		format: z.string().nullish(),
		/** `YYYY-MM-DD`. */
		start: z.string().nullish(),
		/** `YYYY-MM-DD`. */
		last_seen: z.string().nullish(),
		variants: z.array(GoogleAdVariantSchema).nullish(),
		/**
		 * The text inside the creative. Present only when the call sent
		 * `extract_text: true`, which costs an extra credit. The docs name the
		 * parameter `extract-text` but do not name this field, so it is read
		 * defensively.
		 */
		extracted_text: z.string().nullish(),
	})
	.loose();

const GoogleAdsResponseSchema = z
	.object({
		...AsyncJobFields,
		continuation_token: z.string().nullish(),
		country_code: z
			.string()
			.nullish()
			.describe('`anywhere` when no filter was applied.'),
		total_ad_count: z.number().nullish(),
		ads: z.array(GoogleAdSchema).nullish(),
	})
	.loose();

export type GoogleAdsResponse = z.output<typeof GoogleAdsResponseSchema>;

/**
 * `/google_shopping` and `/google_shopping_status` return a different object
 * from `/google`. The shopping payload is DataForSEO's: `first_shown` and
 * `last_shown` are timestamps rather than dates, and a preview carries a rank
 * and a verification flag. Sharing the `/google` schema would parse without
 * throwing (both are `.loose()`) while typing every one of these fields as
 * absent, so they get their own schema.
 */
const GoogleShoppingAdSchema = z
	.object({
		advertiser_id: z.string().nullish(),
		creative_id: z.string().nullish(),
		title: z.string().nullish(),
		/** `text`, `image`, `video`. */
		format: z.string().nullish(),
		/** A timestamp string, e.g. `2024-02-27 01:02:34 +00:00`. */
		first_shown: z.string().nullish(),
		last_shown: z.string().nullish(),
		url: z.string().nullish(),
		preview_url: z
			.string()
			.nullish()
			.describe(
				'JavaScript preview for a display creative. Null for text ads.',
			),
		preview_image: z
			.object({
				height: z.number().nullish(),
				width: z.number().nullish(),
				url: z.string().nullish(),
			})
			.loose()
			.nullish(),
		rank_group: z.number().nullish(),
		rank_absolute: z.number().nullish(),
		/** `ads_search`. */
		type: z.string().nullish(),
		verified: z.boolean().nullish(),
	})
	.loose();

// ── google.shopping ───────────────────────────────────────────────────────

const GoogleShoppingInputSchema = z.object({
	company_domain: z
		.string()
		.min(1)
		.describe('The bare domain, without `https://` or `www.`.'),
	shopping: z
		.boolean()
		.describe(
			'`true` runs the synchronous parser and returns the ads in this response. `false` (the default) queues a DataForSEO scrape and answers with an `id` to poll via `google.shoppingStatus`.',
		)
		.optional(),
});

export type GoogleShoppingInput = z.input<typeof GoogleShoppingInputSchema>;

/**
 * Three answer shapes share this schema: ads inline, `{ id }` for a queued
 * scrape (202), and `{ status, message }` on a 204. Every field is optional
 * because which one arrives depends on `shopping` and on the domain.
 */
const GoogleShoppingResponseSchema = z
	.object({
		id: z
			.string()
			.nullish()
			.describe('Queued task ID. Poll it with `google.shoppingStatus`.'),
		status: z.string().nullish(),
		message: z.string().nullish(),
		ads: z.array(GoogleShoppingAdSchema).nullish(),
	})
	.loose();

export type GoogleShoppingResponse = z.output<
	typeof GoogleShoppingResponseSchema
>;

// ── google.shoppingStatus ─────────────────────────────────────────────────

const GoogleShoppingStatusInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe('The `id` returned by `google.shopping`. Polling is free.'),
});

export type GoogleShoppingStatusInput = z.input<
	typeof GoogleShoppingStatusInputSchema
>;

const GoogleShoppingStatusResponseSchema = z
	.object({
		status: z
			.string()
			.nullish()
			.describe('Set when the scrape is still running.'),
		message: z.string().nullish(),
		ads: z
			.array(GoogleShoppingAdSchema)
			.nullish()
			.describe('Present once the scrape finished and found ads.'),
	})
	.loose();

export type GoogleShoppingStatusResponse = z.output<
	typeof GoogleShoppingStatusResponseSchema
>;

// ── linkedin.ads ──────────────────────────────────────────────────────────

export const LINKEDIN_DATE_PRESETS = [
	'last30d',
	'month',
	'year',
	'lastyear',
] as const;
export const LINKEDIN_DATA_PROVIDERS = ['rapidapi', 'apify'] as const;

/**
 * Adyntel takes either a preset or an explicit range. Two fields rather than a
 * union, because the docs give each a different format and a caller should not
 * have to build an object to ask for "last 30 days".
 */
const LinkedInDateFilterSchema = z
	.object({
		preset: z.enum(LINKEDIN_DATE_PRESETS).optional(),
		startdate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.describe('`YYYY-MM-DD`. Send with `enddate`.')
			.optional(),
		enddate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.describe(
				"`YYYY-MM-DD`. LinkedIn returns 0 ads for today's date, so use yesterday. The range cannot exceed 364 days.",
			)
			.optional(),
	})
	.refine(
		(value) =>
			Boolean(value.preset) || Boolean(value.startdate && value.enddate),
		{ message: 'Send `preset`, or both `startdate` and `enddate`.' },
	);

const LinkedInAdsInputSchema = z
	.object({
		company_domain: z
			.string()
			.min(1)
			.describe('The bare domain, without `https://` or `www.`.')
			.optional(),
		linkedin_page_id: z
			.union([z.string().min(1), z.number().int().positive()])
			.describe('The numeric page ID, as a string or number.')
			.optional(),
		linkedin_page_ids: z
			.array(z.string().min(1))
			.min(1)
			.describe('Batch mode: several pages in one call.')
			.optional(),
		company_domains: z
			.array(z.string().min(1))
			.min(1)
			.describe('Batch mode: several domains in one call.')
			.optional(),
		date_filter: LinkedInDateFilterSchema.describe(
			'Cannot be combined with `impression_data`; together they are a 422.',
		).optional(),
		extract: z
			.literal('number_of_ads')
			.describe('Returns only the ad count instead of the ads.')
			.optional(),
		impression_data: z
			.boolean()
			.describe(
				'Adds `eu_transparency` to each ad for one extra credit. Only EU-served ads carry data; the rest get an empty block.',
			)
			.optional(),
		extract_text: z
			.boolean()
			.describe(
				'Adds `extracted_text` to each ad for one extra credit when the extraction ran. Stacks with `impression_data`.',
			)
			.optional(),
		live_ads: z.boolean().describe('Only currently active ads.').optional(),
		all_ads: z
			.boolean()
			.describe(
				'Needs `webhook_url`. One credit per page and cannot be stopped.',
			)
			.optional(),
		continuation_token: ContinuationTokenSchema.optional(),
		webhook_url: WebhookUrlSchema.optional(),
		data_provider: z.enum(LINKEDIN_DATA_PROVIDERS).optional(),
	})
	.refine(
		(value) =>
			Boolean(
				value.company_domain ??
					value.linkedin_page_id ??
					value.linkedin_page_ids ??
					value.company_domains,
			),
		{
			message:
				'Send one of `company_domain`, `linkedin_page_id`, `company_domains` or `linkedin_page_ids`.',
			path: ['company_domain'],
		},
	);

export type LinkedInAdsInput = z.input<typeof LinkedInAdsInputSchema>;

const LinkedInAdsResponseSchema = z
	.object({
		...AsyncJobFields,
		page_id: z.string().nullish(),
		continuation_token: z.string().nullish().describe('Null on the last page.'),
		is_last_page: z.boolean().nullish(),
		total_ads: z.number().nullish(),
		ads: z.array(LinkedInAdSchema).nullish(),
	})
	.loose();

export type LinkedInAdsResponse = z.output<typeof LinkedInAdsResponseSchema>;

// ── linkedin.keywordSearch ────────────────────────────────────────────────

export const LINKEDIN_KEYWORD_DATE_OPTIONS = [
	'current-month',
	'current-year',
	'last-30-days',
	'last-year',
	'custom-date-range',
] as const;

const LinkedInKeywordSearchInputSchema = z
	.object({
		keyword: z.string().min(1).describe('The phrase to search ads for.'),
		country: z
			.string()
			.trim()
			.min(2)
			.describe('ISO 3166-1 alpha-2 code, e.g. `US`.')
			.optional(),
		dateOption: z
			.enum(LINKEDIN_KEYWORD_DATE_OPTIONS)
			.describe('`custom-date-range` needs `startDate` and `endDate`.')
			.optional(),
		startDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.describe('`YYYY-MM-DD`.')
			.optional(),
		endDate: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/)
			.describe('`YYYY-MM-DD`.')
			.optional(),
		continuation_token: ContinuationTokenSchema.optional(),
	})
	.refine(
		(value) =>
			value.dateOption !== 'custom-date-range' ||
			Boolean(value.startDate && value.endDate),
		{
			message: '`custom-date-range` needs both `startDate` and `endDate`.',
			path: ['startDate'],
		},
	);

export type LinkedInKeywordSearchInput = z.input<
	typeof LinkedInKeywordSearchInputSchema
>;

export type LinkedInKeywordSearchResponse = z.output<typeof LinkedInPageSchema>;

// ── tiktok.ads ────────────────────────────────────────────────────────────

const TikTokContinuationTokensSchema = z
	.object({
		brand_ads: z.string().nullish(),
		influencers: z
			.record(z.string(), z.string())
			.nullish()
			.describe('One token per influencer handle.'),
	})
	.loose();

const TikTokAdsInputSchema = z.object({
	company_domain: z
		.string()
		.min(1)
		.describe("The brand's own domain. `tiktok.com` is rejected."),
	influencer_ads: z
		.boolean()
		.describe(
			'Also returns influencers posting sponsored content, each with a sample ad. One extra credit.',
		)
		.optional(),
	continuation_tokens: TikTokContinuationTokensSchema.optional(),
	webhook_url: WebhookUrlSchema.optional(),
});

export type TikTokAdsInput = z.input<typeof TikTokAdsInputSchema>;

const TikTokStatsSchema = z
	.object({
		play_count: z.number().nullish(),
		digg_count: z.number().nullish(),
		comment_count: z.number().nullish(),
		share_count: z.number().nullish(),
		collect_count: z.number().nullish(),
		download_count: z.number().nullish(),
	})
	.loose();

const TikTokVideoSchema = z
	.object({
		aweme_id: z.string().nullish(),
		url: z.string().nullish(),
		/** Unix seconds. */
		posted_at: z.number().nullish(),
		desc: z.string().nullish(),
		is_ad: z.boolean().nullish(),
		ad_source: z.number().nullish(),
		bc_type: z.number().nullish(),
		region: z.string().nullish(),
		duration: z.number().nullish(),
		shop_product_url: z.string().nullish(),
		stats: TikTokStatsSchema.nullish(),
		music: z
			.object({
				title: z.string().nullish(),
				is_commerce_music: z.boolean().nullish(),
				is_original_sound: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		// unknown: TikTok's anchor list is a mixed union; passed through.
		anchors: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

const TikTokInfluencerSchema = z
	.object({
		handle: z.string().nullish(),
		uid: z.string().nullish(),
		nickname: z.string().nullish(),
		bio: z.string().nullish(),
		follower_count: z.number().nullish(),
		aweme_count: z.number().nullish(),
		total_favorited: z.number().nullish(),
		/** `paid_disclosed` or a lower trust tier. */
		trust_tier: z.string().nullish(),
		bc_type: z.number().nullish(),
		discovered_via: z.string().nullish(),
		sample_ad: TikTokVideoSchema.nullish(),
	})
	.loose();

const TikTokAdsResponseSchema = z
	.object({
		...AsyncJobFields,
		handle: z.string().nullish(),
		brand_ads: z.array(TikTokVideoSchema).nullish(),
		influencers: z
			.array(TikTokInfluencerSchema)
			.nullish()
			.describe('Present only when the call sent `influencer_ads: true`.'),
		continuation_tokens: TikTokContinuationTokensSchema.nullish(),
		cache: z
			.object({
				hit: z.boolean().nullish(),
				age_s: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type TikTokAdsResponse = z.output<typeof TikTokAdsResponseSchema>;

// ── tiktok.keywordSearch ──────────────────────────────────────────────────

const TikTokKeywordSearchInputSchema = z.object({
	keyword: z.string().min(1).describe('The phrase to search ads for.'),
	country_code: CountryCodeSchema.describe(
		'European country codes only on this endpoint; `US` is not accepted. Leave it out for global results.',
	)
		.refine((code) => code.toUpperCase() !== 'US', {
			message:
				'TikTok keyword search does not accept `US`; it covers European countries only.',
		})
		.optional(),
});

export type TikTokKeywordSearchInput = z.input<
	typeof TikTokKeywordSearchInputSchema
>;

const TikTokSearchAdSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		audit_status: z.string().nullish(),
		sor_audit_status: z.string().nullish(),
		estimated_audience: z.string().nullish(),
		/** Unix milliseconds. */
		first_shown_date: z.number().nullish(),
		/** Unix milliseconds. */
		last_shown_date: z.number().nullish(),
		image_urls: z.array(z.string()).nullish(),
		impression: z.number().nullish(),
		spent: z.string().nullish(),
		type: z.string().nullish(),
		show_mode: z.number().nullish(),
		rejection_info: z.string().nullish(),
		// unknown: cover and video URLs per creative; passed through.
		videos: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

/**
 * TikTok wraps its answers in `{ code, data }` where `code: 0` means success.
 * A non-zero code arrives with a 200, so the endpoint checks it and throws: a
 * zero result would otherwise look like a company running no ads.
 */
const TikTokKeywordSearchResponseSchema = z
	.object({
		code: z.number().nullish(),
		data: z.array(TikTokSearchAdSchema).nullish(),
		has_more: z.boolean().nullish(),
		search_id: z.string().nullish(),
		total: z.number().nullish(),
	})
	.loose();

export type TikTokKeywordSearchResponse = z.output<
	typeof TikTokKeywordSearchResponseSchema
>;

// ── tiktok.adDetails ──────────────────────────────────────────────────────

const TikTokAdDetailsInputSchema = z.object({
	id: z.string().min(1).describe('The ad `id` from `tiktok.keywordSearch`.'),
});

export type TikTokAdDetailsInput = z.input<typeof TikTokAdDetailsInputSchema>;

const TikTokAdDetailsResponseSchema = z
	.object({
		code: z.number().nullish(),
		data: z
			.object({
				ad: TikTokSearchAdSchema.nullish(),
				advertiser: z
					.object({
						adv_biz_ids: z.string().nullish(),
						name: z.string().nullish(),
						registry_location: z.string().nullish(),
						sponsor: z.string().nullish(),
						tt_user: z.string().nullish(),
					})
					.loose()
					.nullish(),
				/** Target audience and where the impressions landed. */
				targeting: z.record(z.string(), z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type TikTokAdDetailsResponse = z.output<
	typeof TikTokAdDetailsResponseSchema
>;

// ── keywords.paidVsOrganic ────────────────────────────────────────────────

const KeywordCountsSchema = z
	.object({
		count: z.number().nullish(),
		estimated_traffic: z.number().nullish(),
		pos_1: z.number().nullish(),
		pos_2_3: z.number().nullish(),
		pos_4_10: z.number().nullish(),
		pos_11_20: z.number().nullish(),
		pos_21_30: z.number().nullish(),
		pos_31_40: z.number().nullish(),
		pos_41_50: z.number().nullish(),
		pos_51_60: z.number().nullish(),
		pos_61_70: z.number().nullish(),
		pos_71_80: z.number().nullish(),
		pos_81_90: z.number().nullish(),
		pos_91_100: z.number().nullish(),
		is_new: z.number().nullish(),
		is_up: z.number().nullish(),
		is_down: z.number().nullish(),
		is_lost: z.number().nullish(),
		estimated_ad_budget: z.number().nullish(),
		estimated_avg_cpc: z.number().nullish(),
	})
	.loose();

const PaidVsOrganicInputSchema = z.object({
	company_domain: z
		.string()
		.min(1)
		.describe(
			'The bare domain, without `https://` or `www.`, e.g. `lokalise.com`.',
		),
	language: z
		.string()
		.min(2)
		.describe(
			'Language for the keyword results. Adyntel defaults to `English`.',
		)
		.optional(),
	limit: z
		.number()
		.int()
		.positive()
		.describe('Number of results to return. Adyntel defaults to 1.')
		.optional(),
});

export type PaidVsOrganicInput = z.input<typeof PaidVsOrganicInputSchema>;

const PaidVsOrganicResponseSchema = z
	.object({
		organic: KeywordCountsSchema.nullish(),
		organic_percentages: z
			.record(z.string(), z.number())
			.nullish()
			.describe(
				'Each `organic` count divided by `organic.count`, as a percentage.',
			),
		paid: KeywordCountsSchema.nullish(),
		paid_percentages: z
			.record(z.string(), z.number())
			.nullish()
			.describe('Each `paid` count divided by `paid.count`, as a percentage.'),
	})
	.loose();

export type PaidVsOrganicResponse = z.output<
	typeof PaidVsOrganicResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type AdyntelEndpointInputs = {
	metaAds: MetaAdsInput;
	metaAdSearch: MetaAdSearchInput;
	googleAds: GoogleAdsInput;
	googleShopping: GoogleShoppingInput;
	googleShoppingStatus: GoogleShoppingStatusInput;
	linkedinAds: LinkedInAdsInput;
	linkedinKeywordSearch: LinkedInKeywordSearchInput;
	tiktokAds: TikTokAdsInput;
	tiktokKeywordSearch: TikTokKeywordSearchInput;
	tiktokAdDetails: TikTokAdDetailsInput;
	paidVsOrganic: PaidVsOrganicInput;
};

export type AdyntelEndpointOutputs = {
	metaAds: MetaAdsResponse;
	metaAdSearch: MetaAdSearchResponse;
	googleAds: GoogleAdsResponse;
	googleShopping: GoogleShoppingResponse;
	googleShoppingStatus: GoogleShoppingStatusResponse;
	linkedinAds: LinkedInAdsResponse;
	linkedinKeywordSearch: LinkedInKeywordSearchResponse;
	tiktokAds: TikTokAdsResponse;
	tiktokKeywordSearch: TikTokKeywordSearchResponse;
	tiktokAdDetails: TikTokAdDetailsResponse;
	paidVsOrganic: PaidVsOrganicResponse;
};

export const AdyntelEndpointInputSchemas = {
	metaAds: MetaAdsInputSchema,
	metaAdSearch: MetaAdSearchInputSchema,
	googleAds: GoogleAdsInputSchema,
	googleShopping: GoogleShoppingInputSchema,
	googleShoppingStatus: GoogleShoppingStatusInputSchema,
	linkedinAds: LinkedInAdsInputSchema,
	linkedinKeywordSearch: LinkedInKeywordSearchInputSchema,
	tiktokAds: TikTokAdsInputSchema,
	tiktokKeywordSearch: TikTokKeywordSearchInputSchema,
	tiktokAdDetails: TikTokAdDetailsInputSchema,
	paidVsOrganic: PaidVsOrganicInputSchema,
} as const;

export const AdyntelEndpointOutputSchemas = {
	metaAds: MetaAdsResponseSchema,
	metaAdSearch: MetaAdSearchResponseSchema,
	googleAds: GoogleAdsResponseSchema,
	googleShopping: GoogleShoppingResponseSchema,
	googleShoppingStatus: GoogleShoppingStatusResponseSchema,
	linkedinAds: LinkedInAdsResponseSchema,
	linkedinKeywordSearch: LinkedInPageSchema,
	tiktokAds: TikTokAdsResponseSchema,
	tiktokKeywordSearch: TikTokKeywordSearchResponseSchema,
	tiktokAdDetails: TikTokAdDetailsResponseSchema,
	paidVsOrganic: PaidVsOrganicResponseSchema,
} as const;
