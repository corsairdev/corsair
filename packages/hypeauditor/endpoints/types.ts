import { z } from 'zod';

// Inputs use the API's own parameter names. Outputs are `.loose()`: a report is
// a very large documented object whose fields the provider adds to between
// releases, so only the envelope and the identifiers a caller needs are pinned.
//
// Sources: https://hypeauditor.readme.io/reference/basic for the envelope,
// auth, codes and the `v` parameter, and each endpoint's own page for its
// parameters and response. Paths, params and required fields were confirmed
// against the live API, which answers `405 code 3 Unknown method passed` for an
// action that does not exist and `403 code 4 Invalid token` for a real one.

/**
 * The `v` parameter is added by the client to every call, so it is not part of
 * any input schema. HypeAuditor's own default moves; the plugin pins v2.
 */

/** A report is one of two sizes, and the larger one costs a full credit. */
export const REPORT_TYPES = ['report', 'advanced_report'] as const;

const ReportTypeSchema = z
	.enum(REPORT_TYPES)
	.describe(
		'`report` is the mini report and costs one mini-report credit; `advanced_report` is the full report and costs one report credit. Omitted, the provider unlocks the advanced report.',
	);

/** The network codes the lists and discovery APIs use. */
export const CHANNEL_TYPES = ['IG', 'YT', 'TT', 'TW', 'TR'] as const;
const ChannelTypeSchema = z
	.enum(CHANNEL_TYPES)
	.describe('`IG`, `YT`, `TT`, `TW` or `TR`.');

/** Discovery takes a lowercase network name, not the channel code. */
export const SOCIAL_NETWORKS = [
	'instagram',
	'youtube',
	'tiktok',
	'twitter',
	'twitch',
] as const;
const SocialNetworkSchema = z.enum(SOCIAL_NETWORKS);

/**
 * A feature flag list. The docs take a comma separated string; the plugin
 * accepts an array and joins it.
 */
const FeaturesSchema = z
	.array(z.string().min(1))
	.optional()
	.describe(
		'Additional report features, such as `ranking` or `mentions`. Omitted returns the default set, and not every feature is in the mini report.',
	);

export function featuresQuery(
	features: string[] | undefined,
): string | undefined {
	return features && features.length > 0 ? features.join(',') : undefined;
}

// ── shared response pieces ─────────────────────────────────────────────────

/**
 * Every response carries `restTokens`, the credits left, and a `validUntil`
 * unix timestamp. They appear at the top level of `result`, so the report
 * schemas below keep them.
 */
const CreditsSchema = z.number().nullish();

/** A report's state. `READY` is the one that means the data is complete. */
export const REPORT_STATES = ['READY', 'NOT_READY', 'NO_DATA'] as const;

/** The report as returned. Only the envelope is pinned, not every metric. */
export const ReportResultSchema = z
	.object({
		report_state: z.string().nullish(),
		user: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				username: z.string().nullish(),
				full_name: z.string().nullish(),
				is_private: z.boolean().nullish(),
				is_verified: z.boolean().nullish(),
				is_deleted: z.boolean().nullish(),
				about: z.string().nullish(),
				photo_url: z.string().nullish(),
			})
			.loose()
			.nullish(),
		validUntil: z.number().nullish(),
		restTokens: CreditsSchema,
		// The report's metrics depend on the network and the type, and the docs
		// add to them between releases, so they are passed through rather than
		// pinned field by field.
		_report_quality: z.string().nullish(),
	})
	.loose();
export type HypeAuditorReport = z.infer<typeof ReportResultSchema>;

const ReportResponseSchema = z.object({ result: ReportResultSchema }).loose();
export type HypeAuditorReportResponse = z.infer<typeof ReportResponseSchema>;

/**
 * A report not yet built answers `202` with `result.retryTtl`, the seconds to
 * wait before asking again. That is the only field the docs promise for it.
 */
const ReportPendingSchema = z
	.object({ retryTtl: z.number(), restTokens: CreditsSchema })
	.loose();
export type HypeAuditorReportPending = z.infer<typeof ReportPendingSchema>;

/**
 * A report read answers either the report or the pending notice. Both are
 * success, so the output accepts both and the caller branches on
 * `report_state` or on `retryTtl` being present.
 */
// The pending branch goes first: the report branch's result is loose with every
// field optional, so it would also match a pending body and skip the retryTtl check.
export const ReportOrPendingSchema = z.union([
	z.object({ result: ReportPendingSchema }).loose(),
	// A body carrying retryTtl is a pending notice; if its retryTtl is not a
	// number it must fail rather than pass as a loose report.
	ReportResponseSchema.refine(
		(body) =>
			(body.result as Record<string, unknown> | null | undefined)?.retryTtl ===
			undefined,
		{ message: 'retryTtl must be a number of seconds' },
	),
]);
export type HypeAuditorReportOrPending = z.infer<typeof ReportOrPendingSchema>;

// ── reports ────────────────────────────────────────────────────────────────

export const ReportsInstagramInputSchema = z
	.object({
		username: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Instagram username without `@`. Send this or `user_id`, not both.',
			),
		user_id: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Instagram user ID, which the report returns as `user.id`. Send this or `username`, not both.',
			),
		type: ReportTypeSchema.optional(),
		features: FeaturesSchema,
	})
	.strict()
	.superRefine((value, ctx) => {
		const given = [value.username, value.user_id].filter(
			(field) => field !== undefined,
		);
		// The two identifiers are separate endpoints, so a request carrying both
		// would silently use one of them.
		if (given.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['username'],
				message: 'Send exactly one of `username` or `user_id`.',
			});
		}
	});
export type ReportsInstagramInput = z.input<typeof ReportsInstagramInputSchema>;

/** Every network except Instagram identifies an account by a channel handle. */
const ChannelInputShape = {
	channel: z
		.string()
		.min(1)
		.describe(
			'The account identifier from its URL: a username for TikTok, Twitch, Twitter and Snapchat, and a channel ID or username for YouTube.',
		),
} as const;

/** Twitch, Twitter and Snapchat reports take only the channel; the docs list no report type for them. */
export const ReportsByChannelInputSchema = z
	.object({ ...ChannelInputShape })
	.strict();
export type ReportsByChannelInput = z.input<typeof ReportsByChannelInputSchema>;

export const ReportsYoutubeInputSchema = z
	.object({
		...ChannelInputShape,
		type: ReportTypeSchema.optional(),
		features: FeaturesSchema,
	})
	.strict();
export type ReportsYoutubeInput = z.input<typeof ReportsYoutubeInputSchema>;

/** TikTok can be read by channel or by user ID, like Instagram. */
export const ReportsTiktokInputSchema = z
	.object({
		channel: z
			.string()
			.min(1)
			.optional()
			.describe('TikTok username without `@`. Send this or `user_id`.'),
		user_id: z
			.string()
			.min(1)
			.optional()
			.describe('TikTok user ID. Send this or `channel`.'),
		type: ReportTypeSchema.optional(),
	})
	.strict()
	.superRefine((value, ctx) => {
		const given = [value.channel, value.user_id].filter(
			(field) => field !== undefined,
		);
		if (given.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['channel'],
				message: 'Send exactly one of `channel` or `user_id`.',
			});
		}
	});
export type ReportsTiktokInput = z.input<typeof ReportsTiktokInputSchema>;

// ── media and history ──────────────────────────────────────────────────────

const MediaResponseSchema = z
	.object({ result: z.record(z.string(), z.json()).nullish() })
	.loose();
export type HypeAuditorMediaResponse = z.infer<typeof MediaResponseSchema>;

const HistoryResponseSchema = z
	.object({ result: z.record(z.string(), z.json()).nullish() })
	.loose();
export type HypeAuditorHistoryResponse = z.infer<typeof HistoryResponseSchema>;

export const YoutubeMediaInputSchema = z
	.object({
		...ChannelInputShape,
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number, 1-indexed. Omitted reads the first page.'),
	})
	.strict();
export type YoutubeMediaInput = z.input<typeof YoutubeMediaInputSchema>;

// ── brand mentions ─────────────────────────────────────────────────────────

const MentionsResponseSchema = z
	.object({ result: z.record(z.string(), z.json()).nullish() })
	.loose();
export type HypeAuditorMentionsResponse = z.infer<
	typeof MentionsResponseSchema
>;

// ── discovery ──────────────────────────────────────────────────────────────

/**
 * Discovery takes 46 documented filters, each available on a different subset
 * of networks and plans, and the docs describe them as a changing table rather
 * than a schema. They are passed through in `filters` instead of being modelled
 * field by field: a hand-written schema would refuse a filter the provider
 * accepts, and re-checking it against the docs on every release is not
 * something a plugin can promise.
 *
 * `social_network` and `page` are the two the docs mark required and bounded, so
 * they are promoted to their own fields and validated here.
 */
export const DISCOVERY_MAX_PAGE = 500;
export const DISCOVERY_PAGE_SIZE = 20;

const DiscoveryBodySchema = z.record(z.string(), z.json()).nullish();

export const DiscoverySearchInputSchema = z
	.object({
		social_network: SocialNetworkSchema.describe(
			'Which network to search. Required.',
		),
		filters: DiscoveryBodySchema.describe(
			'The documented discovery filters, sent as the request body alongside `social_network`: `search`, `search_content`, `search_description`, `niche_search`, `category`, `account_geo`, `subscribers_count`, `er`, `growth`, `sort`, `username_exclude` and the rest. See https://hypeauditor.readme.io/reference/general_discovery.',
		),
		page: z
			.number()
			.int()
			.min(1)
			.max(DISCOVERY_MAX_PAGE)
			.optional()
			.describe(
				'Page number, 1-indexed, 20 items per page. The result is capped at 10,000 rows, so the highest page is 500. Each page costs one discovery call.',
			),
		sandbox: z
			.boolean()
			.optional()
			.describe(
				'Use the sandbox action, which validates the request and returns a sample without spending a call. Defaults to false.',
			),
	})
	.strict();
export type DiscoverySearchInput = z.input<typeof DiscoverySearchInputSchema>;

const DiscoveryResponseSchema = z
	.object({
		// The result carries the rows, the paging and `queries_left`, whose shape
		// the docs describe in prose rather than a schema.
		result: z.record(z.string(), z.json()).nullish(),
	})
	.loose();
export type HypeAuditorDiscoveryResponse = z.infer<
	typeof DiscoveryResponseSchema
>;

export const DiscoveryKeywordsInputSchema = z
	.object({
		socialNetwork: SocialNetworkSchema,
		contentIds: z
			.string()
			.min(1)
			.describe('Comma separated content IDs to look up.'),
	})
	.strict();
export type DiscoveryKeywordsInput = z.input<
	typeof DiscoveryKeywordsInputSchema
>;

// ── lists ──────────────────────────────────────────────────────────────────

export const ListSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		count: z.number().nullish(),
		created: z.number().nullish(),
		updated: z.number().nullish(),
	})
	.loose();
export type HypeAuditorList = z.infer<typeof ListSchema>;

const ListsResponseSchema = z.object({ result: z.array(ListSchema) }).loose();
export type HypeAuditorListsResponse = z.infer<typeof ListsResponseSchema>;

export const ListsInputSchema = z.object({}).strict();
export type ListsInput = z.input<typeof ListsInputSchema>;

export const ListItemsInputSchema = z
	.object({
		id: z
			.number()
			.int()
			.describe('The list ID. `id: 0` is the default "Recent searches" list.'),
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe("Items per page, at most 100. Defaults to the provider's 100."),
		offset: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Zero-based index of the first item. Defaults to 0.'),
	})
	.strict();
export type ListItemsInput = z.input<typeof ListItemsInputSchema>;

/** A list item names the report and the account it belongs to. */
export const ListItemSchema = z
	.object({
		report_id: z.number().nullish(),
		name: z.string().nullish(),
		username: z.string().nullish(),
		type: z.string().nullish().describe('`IG`, `YT`, `TT`, `TW` or `TR`.'),
		followers: z.number().nullish(),
		comment: z.string().nullish(),
		lists: z.string().nullish(),
		created: z.number().nullish(),
	})
	.loose();
export type HypeAuditorListItem = z.infer<typeof ListItemSchema>;

const ListItemsResponseSchema = z
	.object({
		result: z.union([z.array(ListItemSchema), z.record(z.string(), z.json())]),
	})
	.loose();
export type HypeAuditorListItemsResponse = z.infer<
	typeof ListItemsResponseSchema
>;

export const ListAddInputSchema = z
	.object({
		list_id: z.number().int().describe('The list to add the report to.'),
		channel_id: z
			.string()
			.min(1)
			.describe(
				'The channel: a username for `IG`, `TT`, `TW` and `TR`, and a channel ID for `YT`.',
			),
		type: ChannelTypeSchema,
	})
	.strict();
export type ListAddInput = z.input<typeof ListAddInputSchema>;

export const ListRemoveInputSchema = z
	.object({
		report_id: z.number().int().describe('The report to remove.'),
		list_id: z
			.number()
			.int()
			.describe(
				'The list to remove it from. The default "Recent searches" list, `id: 0`, cannot be changed.',
			),
	})
	.strict();
export type ListRemoveInput = z.input<typeof ListRemoveInputSchema>;

/** Both list writes answer `{ result: true }`. */
const BooleanResultSchema = z.object({ result: z.boolean() }).loose();
export type HypeAuditorBooleanResult = z.infer<typeof BooleanResultSchema>;

// ── account activity ───────────────────────────────────────────────────────

export const PlanInfoInputSchema = z.object({}).strict();
export type PlanInfoInput = z.input<typeof PlanInfoInputSchema>;

const PlanInfoResponseSchema = z
	.object({ result: z.record(z.string(), z.json()) })
	.loose();
export type HypeAuditorPlanInfoResponse = z.infer<
	typeof PlanInfoResponseSchema
>;

export const UnlockedReportsInputSchema = z
	.object({
		limit: z.number().int().min(1).optional().describe('Items per page.'),
		offset: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Zero-based index of the first item.'),
		date_from: z
			.string()
			.optional()
			.describe(
				'Only reports unlocked on or after this date. A date without a time is read as `00:00:00`.',
			),
		date_to: z
			.string()
			.optional()
			.describe(
				'Only reports unlocked on or before this date. Omitted, the window runs from account creation to now.',
			),
	})
	.strict();
export type UnlockedReportsInput = z.input<typeof UnlockedReportsInputSchema>;

export const UnlockedReportSchema = z
	.object({
		report_id: z.number().nullish(),
		username: z.string().nullish(),
		type: z.string().nullish(),
		unlocked_at: z.union([z.number(), z.string()]).nullish(),
		refunded: z
			.boolean()
			.nullish()
			.describe(
				'True when the credit was returned because the report could not be built. Reports unlocked before 2026-03-19 carry false.',
			),
	})
	.loose();
export type HypeAuditorUnlockedReport = z.infer<typeof UnlockedReportSchema>;

const UnlockedReportsResponseSchema = z
	.object({
		result: z.union([
			z.array(UnlockedReportSchema),
			z.record(z.string(), z.json()),
		]),
	})
	.loose();
export type HypeAuditorUnlockedReportsResponse = z.infer<
	typeof UnlockedReportsResponseSchema
>;

// ── suggester and taxonomy ─────────────────────────────────────────────────

export const SuggesterInputSchema = z
	.object({
		search: z.string().min(1).describe('The name to look for.'),
		st: z
			.string()
			.optional()
			.describe(
				'A network title to restrict the suggestion to: instagram, youtube, twitter, tiktok, twitch or snapchat.',
			),
		exclSt: z
			.string()
			.optional()
			.describe(
				'Comma-separated network titles to leave out, e.g. `instagram,twitter`.',
			),
	})
	.strict();
export type SuggesterInput = z.input<typeof SuggesterInputSchema>;

const SuggesterResponseSchema = z
	.object({ result: z.json().nullish() })
	.loose();
export type HypeAuditorSuggesterResponse = z.infer<
	typeof SuggesterResponseSchema
>;

export const TaxonomyInputSchema = z.object({}).strict();
export type TaxonomyInput = z.input<typeof TaxonomyInputSchema>;

const TaxonomyResponseSchema = z
	.object({ result: z.record(z.string(), z.json()).nullish() })
	.loose();
export type HypeAuditorTaxonomyResponse = z.infer<
	typeof TaxonomyResponseSchema
>;

// ── registry ───────────────────────────────────────────────────────────────

export const HypeAuditorEndpointInputSchemas = {
	'reports.instagram': ReportsInstagramInputSchema,
	'reports.youtube': ReportsYoutubeInputSchema,
	'reports.tiktok': ReportsTiktokInputSchema,
	'reports.twitch': ReportsByChannelInputSchema,
	'reports.twitter': ReportsByChannelInputSchema,
	'reports.snapchat': ReportsByChannelInputSchema,
	'media.instagram': z.object({ ...ChannelInputShape }).strict(),
	'media.youtube': YoutubeMediaInputSchema,
	'media.tiktok': z
		.object({
			channel: z
				.string()
				.min(1)
				.describe(
					'The numeric TikTok user ID (`result.report.basic.id` in the TikTok report), sent as `channelId`. Not the username.',
				),
		})
		.strict(),
	'history.instagram': z.object({ ...ChannelInputShape }).strict(),
	'history.youtube': z.object({ ...ChannelInputShape }).strict(),
	'history.tiktok': z.object({ ...ChannelInputShape }).strict(),
	'history.twitch': z.object({ ...ChannelInputShape }).strict(),
	'history.twitter': z.object({ ...ChannelInputShape }).strict(),
	'mentions.youtube': z.object({ ...ChannelInputShape }).strict(),
	'mentions.tiktok': z.object({ ...ChannelInputShape }).strict(),
	'discovery.search': DiscoverySearchInputSchema,
	'discovery.keywords': DiscoveryKeywordsInputSchema,
	'lists.list': ListsInputSchema,
	'lists.items': ListItemsInputSchema,
	'lists.add': ListAddInputSchema,
	'lists.remove': ListRemoveInputSchema,
	'account.planInfo': PlanInfoInputSchema,
	'account.unlockedReports': UnlockedReportsInputSchema,
	'suggester.get': SuggesterInputSchema,
	'taxonomy.get': TaxonomyInputSchema,
} as const;

export const HypeAuditorEndpointOutputSchemas = {
	'reports.instagram': ReportOrPendingSchema,
	'reports.youtube': ReportOrPendingSchema,
	'reports.tiktok': ReportOrPendingSchema,
	'reports.twitch': ReportOrPendingSchema,
	'reports.twitter': ReportOrPendingSchema,
	'reports.snapchat': ReportOrPendingSchema,
	'media.instagram': MediaResponseSchema,
	'media.youtube': MediaResponseSchema,
	'media.tiktok': MediaResponseSchema,
	'history.instagram': HistoryResponseSchema,
	'history.youtube': HistoryResponseSchema,
	'history.tiktok': HistoryResponseSchema,
	'history.twitch': HistoryResponseSchema,
	'history.twitter': HistoryResponseSchema,
	'mentions.youtube': MentionsResponseSchema,
	'mentions.tiktok': MentionsResponseSchema,
	'discovery.search': DiscoveryResponseSchema,
	'discovery.keywords': DiscoveryResponseSchema,
	'lists.list': ListsResponseSchema,
	'lists.items': ListItemsResponseSchema,
	'lists.add': BooleanResultSchema,
	'lists.remove': BooleanResultSchema,
	'account.planInfo': PlanInfoResponseSchema,
	'account.unlockedReports': UnlockedReportsResponseSchema,
	'suggester.get': SuggesterResponseSchema,
	'taxonomy.get': TaxonomyResponseSchema,
} as const;

export type HypeAuditorEndpointInputs = {
	[K in keyof typeof HypeAuditorEndpointInputSchemas]: z.input<
		(typeof HypeAuditorEndpointInputSchemas)[K]
	>;
};

export type HypeAuditorEndpointOutputs = {
	[K in keyof typeof HypeAuditorEndpointOutputSchemas]: z.output<
		(typeof HypeAuditorEndpointOutputSchemas)[K]
	>;
};
