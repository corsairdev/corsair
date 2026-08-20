import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/* shared response entity schemas                                             */
/* -------------------------------------------------------------------------- */
/*
 * Field lists below come from live responses captured 2026-08-17 against a
 * real NextDNS account, cross-checked against the independent open-source
 * Go client `amalucelli/nextdns-go` where the provider's own prose docs
 * (nextdns.github.io/api/) don't give an exact shape. `.loose()` throughout:
 * an unrecognized field the provider adds later should be kept, not dropped.
 */

export const NextDNSProfileSummarySchema = z
	.object({
		id: z.string(),
		fingerprint: z.string().nullable().optional(),
		role: z.string().nullable().optional(),
		name: z.string(),
	})
	.loose();
export type NextDNSProfileSummary = z.infer<typeof NextDNSProfileSummarySchema>;

export const NextDNSDenylistEntrySchema = z
	.object({
		id: z.string(),
		active: z.boolean().optional(),
	})
	.loose();
export type NextDNSDenylistEntry = z.infer<typeof NextDNSDenylistEntrySchema>;

export const NextDNSAllowlistEntrySchema = NextDNSDenylistEntrySchema;
export type NextDNSAllowlistEntry = z.infer<typeof NextDNSAllowlistEntrySchema>;

export const NextDNSRewriteSchema = z
	.object({
		id: z.string().optional(),
		name: z.string(),
		type: z.string().optional(),
		content: z.string(),
	})
	.loose();
export type NextDNSRewrite = z.infer<typeof NextDNSRewriteSchema>;

export const NextDNSSecurityTldSchema = z.object({ id: z.string() }).loose();
export type NextDNSSecurityTld = z.infer<typeof NextDNSSecurityTldSchema>;

export const NextDNSSecuritySchema = z
	.object({
		threatIntelligenceFeeds: z.boolean().optional(),
		aiThreatDetection: z.boolean().optional(),
		googleSafeBrowsing: z.boolean().optional(),
		cryptojacking: z.boolean().optional(),
		dnsRebinding: z.boolean().optional(),
		idnHomographs: z.boolean().optional(),
		typosquatting: z.boolean().optional(),
		dga: z.boolean().optional(),
		nrd: z.boolean().optional(),
		ddns: z.boolean().optional(),
		parking: z.boolean().optional(),
		csam: z.boolean().optional(),
		tlds: z.array(NextDNSSecurityTldSchema).optional(),
	})
	.loose();
export type NextDNSSecurity = z.infer<typeof NextDNSSecuritySchema>;

export const NextDNSPrivacyBlocklistSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		entries: z.number().nullable().optional(),
		updatedOn: z.string().nullable().optional(),
	})
	.loose();
export type NextDNSPrivacyBlocklist = z.infer<
	typeof NextDNSPrivacyBlocklistSchema
>;

export const NextDNSPrivacyNativeSchema = z.object({ id: z.string() }).loose();
export type NextDNSPrivacyNative = z.infer<typeof NextDNSPrivacyNativeSchema>;

export const NextDNSPrivacySchema = z
	.object({
		blocklists: z.array(NextDNSPrivacyBlocklistSchema).optional(),
		natives: z.array(NextDNSPrivacyNativeSchema).optional(),
		disguisedTrackers: z.boolean().optional(),
		allowAffiliate: z.boolean().optional(),
	})
	.loose();
export type NextDNSPrivacy = z.infer<typeof NextDNSPrivacySchema>;

/**
 * Confirmed live: exactly five valid parental-control category ids -
 * `porn`, `gambling`, `piracy`, `dating`, `social-networks`. Every other
 * guess (`pornography`, `socialNetworks`, `social_networks`) 400s with
 * `{"errors":[{"code":"invalid","source":{"pointer":"/id"}}]}`.
 */
export const NEXTDNS_PARENTAL_CONTROL_CATEGORY_IDS = [
	'porn',
	'gambling',
	'piracy',
	'dating',
	'social-networks',
] as const;
export const NextDNSParentalControlCategoryIdSchema = z.enum(
	NEXTDNS_PARENTAL_CONTROL_CATEGORY_IDS,
);

export const NextDNSParentalControlCategorySchema = z
	.object({
		id: z.string(),
		active: z.boolean().optional(),
		recreation: z.boolean().optional(),
	})
	.loose();
export type NextDNSParentalControlCategory = z.infer<
	typeof NextDNSParentalControlCategorySchema
>;

/**
 * Service ids (individual apps/sites like `tiktok`, `netflix`) are not a
 * small fixed vocabulary the way categories are - dozens exist and the
 * provider docs don't enumerate them, so this stays a free-form string
 * rather than an enum (the same call this repo's other plugins make for
 * open-ended provider vocabularies, e.g. College Football Data's team names).
 */
export const NextDNSParentalControlServiceSchema =
	NextDNSParentalControlCategorySchema;
export type NextDNSParentalControlService = z.infer<
	typeof NextDNSParentalControlServiceSchema
>;

export const NextDNSParentalControlRecreationIntervalSchema = z
	.object({
		start: z.string(),
		end: z.string(),
	})
	.loose();

export const NextDNSParentalControlSchema = z
	.object({
		services: z.array(NextDNSParentalControlServiceSchema).optional(),
		categories: z.array(NextDNSParentalControlCategorySchema).optional(),
		recreation: z
			.object({
				times: z
					.record(z.string(), NextDNSParentalControlRecreationIntervalSchema)
					.nullable()
					.optional(),
				timezone: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		safeSearch: z.boolean().optional(),
		youtubeRestrictedMode: z.boolean().optional(),
		blockBypass: z.boolean().optional(),
	})
	.loose();
export type NextDNSParentalControl = z.infer<
	typeof NextDNSParentalControlSchema
>;

export const NextDNSSettingsLogsSchema = z
	.object({
		enabled: z.boolean().optional(),
		drop: z
			.object({
				ip: z.boolean().optional(),
				domain: z.boolean().optional(),
			})
			.loose()
			.optional(),
		retention: z.number().nullable().optional(),
		location: z.string().nullable().optional(),
	})
	.loose();
export type NextDNSSettingsLogs = z.infer<typeof NextDNSSettingsLogsSchema>;

export const NextDNSSettingsBlockPageSchema = z
	.object({ enabled: z.boolean().optional() })
	.loose();
export type NextDNSSettingsBlockPage = z.infer<
	typeof NextDNSSettingsBlockPageSchema
>;

export const NextDNSSettingsPerformanceSchema = z
	.object({
		ecs: z.boolean().optional(),
		cacheBoost: z.boolean().optional(),
		cnameFlattening: z.boolean().optional(),
	})
	.loose();
export type NextDNSSettingsPerformance = z.infer<
	typeof NextDNSSettingsPerformanceSchema
>;

export const NextDNSSettingsSchema = z
	.object({
		logs: NextDNSSettingsLogsSchema.optional(),
		blockPage: NextDNSSettingsBlockPageSchema.optional(),
		performance: NextDNSSettingsPerformanceSchema.optional(),
		web3: z.boolean().optional(),
	})
	.loose();
export type NextDNSSettings = z.infer<typeof NextDNSSettingsSchema>;

/**
 * `linkedIp.updateToken` is a per-profile secret (used in the separate
 * `link-ip.nextdns.io/{profile}/{token}/{ip}` DDNS-style update URL routers
 * use) - never logged, matching this repo's discipline of keeping raw
 * secrets out of audit-log payloads.
 */
export const NextDNSSetupLinkedIpSchema = z
	.object({
		servers: z.array(z.string()).optional(),
		ip: z.string().nullable().optional(),
		ddns: z.string().nullable().optional(),
		updateToken: z.string().optional(),
	})
	.loose();
export type NextDNSSetupLinkedIp = z.infer<typeof NextDNSSetupLinkedIpSchema>;

export const NextDNSSetupSchema = z
	.object({
		ipv4: z.array(z.string()).optional(),
		ipv6: z.array(z.string()).optional(),
		linkedIp: NextDNSSetupLinkedIpSchema.nullable().optional(),
		dnscrypt: z.string().nullable().optional(),
	})
	.loose();
export type NextDNSSetup = z.infer<typeof NextDNSSetupSchema>;

/** Full `GET /profiles/:profile` response shape. */
export const NextDNSProfileSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		fingerprint: z.string().nullable().optional(),
		security: NextDNSSecuritySchema.optional(),
		privacy: NextDNSPrivacySchema.optional(),
		parentalControl: NextDNSParentalControlSchema.optional(),
		settings: NextDNSSettingsSchema.optional(),
		setup: NextDNSSetupSchema.optional(),
		denylist: z.array(NextDNSDenylistEntrySchema).optional(),
		allowlist: z.array(NextDNSAllowlistEntrySchema).optional(),
		rewrites: z.array(NextDNSRewriteSchema).optional(),
	})
	.loose();
export type NextDNSProfile = z.infer<typeof NextDNSProfileSchema>;

/**
 * Analytics (11 categories) and logs return `{data, meta.pagination.cursor}`
 * envelopes whose `data` row shape genuinely could not be confirmed beyond
 * the envelope itself: this account has no real DNS query traffic yet (a
 * brand-new profile, never pointed to as an actual resolver), so every
 * category returned an empty array live. Rather than fabricate a row shape
 * from docs prose alone, rows stay a loose passthrough record - the
 * envelope (and the fact these return real HTTP 200s with real pagination
 * metadata) is confirmed; the per-category field names are not, and are
 * flagged as an open item to tighten once real traffic exists.
 */
export const NextDNSAnalyticsRowSchema = z.looseObject({});
export type NextDNSAnalyticsRow = z.infer<typeof NextDNSAnalyticsRowSchema>;

export const NextDNSLogEntrySchema = z.looseObject({});
export type NextDNSLogEntry = z.infer<typeof NextDNSLogEntrySchema>;

const NextDNSPaginatedSchema = <T extends z.ZodType>(row: T) =>
	z.object({
		data: z.array(row),
		meta: z
			.object({
				pagination: z
					.object({ cursor: z.string().nullable().optional() })
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	});

export const NextDNSAnalyticsResponseSchema = NextDNSPaginatedSchema(
	NextDNSAnalyticsRowSchema,
);
export type NextDNSAnalyticsResponse = z.infer<
	typeof NextDNSAnalyticsResponseSchema
>;

export const NextDNSLogsResponseSchema = NextDNSPaginatedSchema(
	NextDNSLogEntrySchema,
);
export type NextDNSLogsResponse = z.infer<typeof NextDNSLogsResponseSchema>;

/* -------------------------------------------------------------------------- */
/* shared input fragments                                                     */
/* -------------------------------------------------------------------------- */

const ProfileIdInputSchema = { profileId: z.string() };
const IdInputSchema = { id: z.string() };
const DateRangeInputSchema = {
	from: z.string().optional(),
	to: z.string().optional(),
	limit: z.number().optional(),
	cursor: z.string().optional(),
};

/**
 * Reused directly (not re-spread into a fresh `z.object`) by every operation
 * whose only input is a profile id - 16 of the 71 operations. A shared zod
 * schema instance is safe to reference from multiple exported consts: it's
 * immutable and carries no per-use state.
 */
const ProfileIdOnlyInputSchema = z.object({ ...ProfileIdInputSchema });

/* -------------------------------------------------------------------------- */
/* profiles                                                                    */
/* -------------------------------------------------------------------------- */

const ProfilesListInputSchema = z.object({});
export type ProfilesListInput = z.infer<typeof ProfilesListInputSchema>;

const ProfilesGetInputSchema = ProfileIdOnlyInputSchema;
export type ProfilesGetInput = z.infer<typeof ProfilesGetInputSchema>;

/**
 * Only `name` is confirmed as the required field for `POST /profiles`
 * (live-tested); the rest of the profile shape is accepted as optional
 * pass-through for callers who want to seed settings at creation time,
 * matching the same object the provider returns from `GET`.
 */
const ProfilesCreateInputSchema = z.object({
	name: z.string(),
	security: NextDNSSecuritySchema.optional(),
	privacy: NextDNSPrivacySchema.optional(),
	parentalControl: NextDNSParentalControlSchema.optional(),
	settings: NextDNSSettingsSchema.optional(),
	denylist: z.array(NextDNSDenylistEntrySchema).optional(),
	allowlist: z.array(NextDNSAllowlistEntrySchema).optional(),
	rewrites: z.array(NextDNSRewriteSchema).optional(),
});
export type ProfilesCreateInput = z.infer<typeof ProfilesCreateInputSchema>;

/**
 * `denylist`/`allowlist`/`rewrites` are real, accepted fields here -
 * confirmed live and demonstrated by the catalog's own example
 * (`{"profile": "abc123", "denylist": [{"id": "malware.com", "active":
 * true}]}`), not present in the original implementation.
 */
const ProfilesUpdateInputSchema = z.object({
	...ProfileIdInputSchema,
	name: z.string().optional(),
	security: NextDNSSecuritySchema.optional(),
	privacy: NextDNSPrivacySchema.optional(),
	parentalControl: NextDNSParentalControlSchema.optional(),
	settings: NextDNSSettingsSchema.optional(),
	denylist: z.array(NextDNSDenylistEntrySchema).optional(),
	allowlist: z.array(NextDNSAllowlistEntrySchema).optional(),
	rewrites: z.array(NextDNSRewriteSchema).optional(),
});
export type ProfilesUpdateInput = z.infer<typeof ProfilesUpdateInputSchema>;

const ProfilesDeleteInputSchema = ProfileIdOnlyInputSchema;
export type ProfilesDeleteInput = z.infer<typeof ProfilesDeleteInputSchema>;

/** `NEXTDNS_RENAME_CONFIG` - a thin, name-only wrapper over profile update. */
const ProfilesRenameInputSchema = z.object({
	...ProfileIdInputSchema,
	name: z.string(),
});
export type ProfilesRenameInput = z.infer<typeof ProfilesRenameInputSchema>;

/* -------------------------------------------------------------------------- */
/* settings                                                                    */
/* -------------------------------------------------------------------------- */

const SettingsGetInputSchema = ProfileIdOnlyInputSchema;
export type SettingsGetInput = z.infer<typeof SettingsGetInputSchema>;

const SettingsUpdateInputSchema = z.object({
	...ProfileIdInputSchema,
	logs: NextDNSSettingsLogsSchema.optional(),
	blockPage: NextDNSSettingsBlockPageSchema.optional(),
	performance: NextDNSSettingsPerformanceSchema.optional(),
	web3: z.boolean().optional(),
});
export type SettingsUpdateInput = z.infer<typeof SettingsUpdateInputSchema>;

const SettingsGetBlockPageInputSchema = ProfileIdOnlyInputSchema;
export type SettingsGetBlockPageInput = z.infer<
	typeof SettingsGetBlockPageInputSchema
>;

const SettingsUpdateBlockPageInputSchema = z.object({
	...ProfileIdInputSchema,
	enabled: z.boolean(),
});
export type SettingsUpdateBlockPageInput = z.infer<
	typeof SettingsUpdateBlockPageInputSchema
>;

const SettingsGetLogsInputSchema = ProfileIdOnlyInputSchema;
export type SettingsGetLogsInput = z.infer<typeof SettingsGetLogsInputSchema>;

/**
 * `retention` is not a free-form number - confirmed live: `0` and `-1` both
 * 400 with `{"errors":[{"code":"enum","source":{"pointer":"/retention"}}]}`,
 * while these seven values (seconds) all succeed: 1h/1d/7d/30d/90d/180d/365d.
 */
export const NEXTDNS_LOG_RETENTION_SECONDS = [
	3600, 86400, 604800, 2592000, 7776000, 15552000, 31536000,
] as const;

const SettingsUpdateLogsInputSchema = z.object({
	...ProfileIdInputSchema,
	enabled: z.boolean().optional(),
	retention: z.literal(NEXTDNS_LOG_RETENTION_SECONDS).optional(),
	location: z.string().optional(),
});
export type SettingsUpdateLogsInput = z.infer<
	typeof SettingsUpdateLogsInputSchema
>;

const SettingsGetPerformanceInputSchema = ProfileIdOnlyInputSchema;
export type SettingsGetPerformanceInput = z.infer<
	typeof SettingsGetPerformanceInputSchema
>;

const SettingsUpdatePerformanceInputSchema = z.object({
	...ProfileIdInputSchema,
	ecs: z.boolean().optional(),
	cacheBoost: z.boolean().optional(),
	cnameFlattening: z.boolean().optional(),
});
export type SettingsUpdatePerformanceInput = z.infer<
	typeof SettingsUpdatePerformanceInputSchema
>;

/**
 * `NEXTDNS_LOG_CLIENT_IPS` / `NEXTDNS_LOG_DOMAINS` toggle the `drop.ip` /
 * `drop.domain` flags nested in `settings.logs` - `enabled: true` means the
 * field is *not* dropped (i.e. logged), matching the operation's own name
 * ("enable logging of X") rather than the raw `drop` polarity.
 */
const SettingsLogClientIpsInputSchema = z.object({
	...ProfileIdInputSchema,
	enabled: z.boolean(),
});
export type SettingsLogClientIpsInput = z.infer<
	typeof SettingsLogClientIpsInputSchema
>;

const SettingsLogDomainsInputSchema = z.object({
	...ProfileIdInputSchema,
	enabled: z.boolean(),
});
export type SettingsLogDomainsInput = z.infer<
	typeof SettingsLogDomainsInputSchema
>;

/* -------------------------------------------------------------------------- */
/* security                                                                    */
/* -------------------------------------------------------------------------- */

const SecurityGetInputSchema = ProfileIdOnlyInputSchema;
export type SecurityGetInput = z.infer<typeof SecurityGetInputSchema>;

const SecurityUpdateInputSchema = z.object({
	...ProfileIdInputSchema,
	threatIntelligenceFeeds: z.boolean().optional(),
	aiThreatDetection: z.boolean().optional(),
	googleSafeBrowsing: z.boolean().optional(),
	cryptojacking: z.boolean().optional(),
	dnsRebinding: z.boolean().optional(),
	idnHomographs: z.boolean().optional(),
	typosquatting: z.boolean().optional(),
	dga: z.boolean().optional(),
	nrd: z.boolean().optional(),
	ddns: z.boolean().optional(),
	parking: z.boolean().optional(),
	csam: z.boolean().optional(),
});
export type SecurityUpdateInput = z.infer<typeof SecurityUpdateInputSchema>;

const SecurityGetTldsInputSchema = ProfileIdOnlyInputSchema;
export type SecurityGetTldsInput = z.infer<typeof SecurityGetTldsInputSchema>;

const SecurityAddBlockedTldInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type SecurityAddBlockedTldInput = z.infer<
	typeof SecurityAddBlockedTldInputSchema
>;

const SecurityRemoveBlockedTldInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type SecurityRemoveBlockedTldInput = z.infer<
	typeof SecurityRemoveBlockedTldInputSchema
>;

const SecurityReplaceTldsInputSchema = z.object({
	...ProfileIdInputSchema,
	tlds: z.array(z.string()),
});
export type SecurityReplaceTldsInput = z.infer<
	typeof SecurityReplaceTldsInputSchema
>;

/* -------------------------------------------------------------------------- */
/* privacy                                                                     */
/* -------------------------------------------------------------------------- */

const PrivacyGetInputSchema = ProfileIdOnlyInputSchema;
export type PrivacyGetInput = z.infer<typeof PrivacyGetInputSchema>;

/**
 * `blocklists`/`natives` are real, accepted fields here - confirmed live
 * and stated by the catalog's own description ("change blocklists, native
 * trackers, disguisedTrackers, or allowAffiliate in one call"), not present
 * in the original implementation (which only exposed the two booleans).
 */
const PrivacyUpdateInputSchema = z.object({
	...ProfileIdInputSchema,
	disguisedTrackers: z.boolean().optional(),
	allowAffiliate: z.boolean().optional(),
	blocklists: z.array(NextDNSPrivacyBlocklistSchema).optional(),
	natives: z.array(NextDNSPrivacyNativeSchema).optional(),
});
export type PrivacyUpdateInput = z.infer<typeof PrivacyUpdateInputSchema>;

const PrivacyAddBlocklistInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type PrivacyAddBlocklistInput = z.infer<
	typeof PrivacyAddBlocklistInputSchema
>;

const PrivacyDeleteBlocklistInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type PrivacyDeleteBlocklistInput = z.infer<
	typeof PrivacyDeleteBlocklistInputSchema
>;

const PrivacyReplaceBlocklistsInputSchema = z.object({
	...ProfileIdInputSchema,
	ids: z.array(z.string()),
});
export type PrivacyReplaceBlocklistsInput = z.infer<
	typeof PrivacyReplaceBlocklistsInputSchema
>;

const PrivacyAddNativeInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type PrivacyAddNativeInput = z.infer<typeof PrivacyAddNativeInputSchema>;

const PrivacyDeleteNativeInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type PrivacyDeleteNativeInput = z.infer<
	typeof PrivacyDeleteNativeInputSchema
>;

const PrivacyReplaceNativesInputSchema = z.object({
	...ProfileIdInputSchema,
	ids: z.array(z.string()),
});
export type PrivacyReplaceNativesInput = z.infer<
	typeof PrivacyReplaceNativesInputSchema
>;

/* -------------------------------------------------------------------------- */
/* parental control                                                            */
/* -------------------------------------------------------------------------- */

const ParentalControlGetInputSchema = ProfileIdOnlyInputSchema;
export type ParentalControlGetInput = z.infer<
	typeof ParentalControlGetInputSchema
>;

const ParentalControlUpdateInputSchema = z.object({
	...ProfileIdInputSchema,
	safeSearch: z.boolean().optional(),
	youtubeRestrictedMode: z.boolean().optional(),
	blockBypass: z.boolean().optional(),
});
export type ParentalControlUpdateInput = z.infer<
	typeof ParentalControlUpdateInputSchema
>;

const ParentalControlGetCategoriesInputSchema = z.object({
	...ProfileIdInputSchema,
});
export type ParentalControlGetCategoriesInput = z.infer<
	typeof ParentalControlGetCategoriesInputSchema
>;

const ParentalControlAddCategoryInputSchema = z.object({
	...ProfileIdInputSchema,
	id: NextDNSParentalControlCategoryIdSchema,
	active: z.boolean().optional(),
	recreation: z.boolean().optional(),
});
export type ParentalControlAddCategoryInput = z.infer<
	typeof ParentalControlAddCategoryInputSchema
>;

const ParentalControlDeleteCategoryInputSchema = z.object({
	...ProfileIdInputSchema,
	id: NextDNSParentalControlCategoryIdSchema,
});
export type ParentalControlDeleteCategoryInput = z.infer<
	typeof ParentalControlDeleteCategoryInputSchema
>;

const ParentalControlUpdateCategoryInputSchema = z.object({
	...ProfileIdInputSchema,
	id: NextDNSParentalControlCategoryIdSchema,
	active: z.boolean().optional(),
	recreation: z.boolean().optional(),
});
export type ParentalControlUpdateCategoryInput = z.infer<
	typeof ParentalControlUpdateCategoryInputSchema
>;

const ParentalControlReplaceCategoriesInputSchema = z.object({
	...ProfileIdInputSchema,
	categories: z.array(
		z.object({
			id: NextDNSParentalControlCategoryIdSchema,
			active: z.boolean().optional(),
			recreation: z.boolean().optional(),
		}),
	),
});
export type ParentalControlReplaceCategoriesInput = z.infer<
	typeof ParentalControlReplaceCategoriesInputSchema
>;

const ParentalControlGetServicesInputSchema = z.object({
	...ProfileIdInputSchema,
});
export type ParentalControlGetServicesInput = z.infer<
	typeof ParentalControlGetServicesInputSchema
>;

const ParentalControlAddServiceInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
	active: z.boolean().optional(),
	recreation: z.boolean().optional(),
});
export type ParentalControlAddServiceInput = z.infer<
	typeof ParentalControlAddServiceInputSchema
>;

const ParentalControlDeleteServiceInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type ParentalControlDeleteServiceInput = z.infer<
	typeof ParentalControlDeleteServiceInputSchema
>;

const ParentalControlUpdateServiceInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
	active: z.boolean().optional(),
	recreation: z.boolean().optional(),
});
export type ParentalControlUpdateServiceInput = z.infer<
	typeof ParentalControlUpdateServiceInputSchema
>;

const ParentalControlReplaceServicesInputSchema = z.object({
	...ProfileIdInputSchema,
	services: z.array(
		z.object({
			id: z.string(),
			active: z.boolean().optional(),
			recreation: z.boolean().optional(),
		}),
	),
});
export type ParentalControlReplaceServicesInput = z.infer<
	typeof ParentalControlReplaceServicesInputSchema
>;

/* -------------------------------------------------------------------------- */
/* denylist / allowlist                                                       */
/* -------------------------------------------------------------------------- */

const DenylistListInputSchema = ProfileIdOnlyInputSchema;
export type DenylistListInput = z.infer<typeof DenylistListInputSchema>;

const DenylistAddInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
	active: z.boolean().optional(),
});
export type DenylistAddInput = z.infer<typeof DenylistAddInputSchema>;

const DenylistRemoveInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type DenylistRemoveInput = z.infer<typeof DenylistRemoveInputSchema>;

const DenylistUpdateInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
	active: z.boolean(),
});
export type DenylistUpdateInput = z.infer<typeof DenylistUpdateInputSchema>;

const DenylistReplaceInputSchema = z.object({
	...ProfileIdInputSchema,
	domains: z.array(
		z.object({ id: z.string(), active: z.boolean().optional() }),
	),
});
export type DenylistReplaceInput = z.infer<typeof DenylistReplaceInputSchema>;

const AllowlistGetInputSchema = ProfileIdOnlyInputSchema;
export type AllowlistGetInput = z.infer<typeof AllowlistGetInputSchema>;

const AllowlistAddInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
	active: z.boolean().optional(),
});
export type AllowlistAddInput = z.infer<typeof AllowlistAddInputSchema>;

const AllowlistDeleteInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type AllowlistDeleteInput = z.infer<typeof AllowlistDeleteInputSchema>;

const AllowlistUpdateInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
	active: z.boolean(),
});
export type AllowlistUpdateInput = z.infer<typeof AllowlistUpdateInputSchema>;

const AllowlistReplaceInputSchema = z.object({
	...ProfileIdInputSchema,
	domains: z.array(
		z.object({ id: z.string(), active: z.boolean().optional() }),
	),
});
export type AllowlistReplaceInput = z.infer<typeof AllowlistReplaceInputSchema>;

/* -------------------------------------------------------------------------- */
/* rewrites                                                                    */
/* -------------------------------------------------------------------------- */

const RewritesGetInputSchema = ProfileIdOnlyInputSchema;
export type RewritesGetInput = z.infer<typeof RewritesGetInputSchema>;

/** `type` defaults to `"A"` server-side when omitted (confirmed live). */
const RewritesAddInputSchema = z.object({
	...ProfileIdInputSchema,
	name: z.string(),
	content: z.string(),
	type: z.string().optional(),
});
export type RewritesAddInput = z.infer<typeof RewritesAddInputSchema>;

const RewritesDeleteInputSchema = z.object({
	...ProfileIdInputSchema,
	...IdInputSchema,
});
export type RewritesDeleteInput = z.infer<typeof RewritesDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* analytics                                                                   */
/* -------------------------------------------------------------------------- */

const AnalyticsInputSchema = z.object({
	...ProfileIdInputSchema,
	...DateRangeInputSchema,
});
export type AnalyticsInput = z.infer<typeof AnalyticsInputSchema>;

/**
 * `type` is required here and nowhere else in the 11 analytics categories -
 * confirmed live: `GET .../analytics/destinations` with no `type` 400s with
 * `{"errors":[{"code":"required","source":{"parameter":"type"}}]}`, and only
 * `countries`/`gafam` are accepted (a third value 400s with an `enum`
 * error). Matches the two endpoint variants the docs show
 * (`?type=countries` / `?type=gafam`) and the operation's own description
 * ("destinations by country or GAFAM company").
 */
const AnalyticsDestinationsInputSchema = z.object({
	...ProfileIdInputSchema,
	...DateRangeInputSchema,
	type: z.enum(['countries', 'gafam']),
});
export type AnalyticsDestinationsInput = z.infer<
	typeof AnalyticsDestinationsInputSchema
>;

/* -------------------------------------------------------------------------- */
/* logs                                                                        */
/* -------------------------------------------------------------------------- */

const LogsGetInputSchema = z.object({
	...ProfileIdInputSchema,
	...DateRangeInputSchema,
	raw: z.boolean().optional(),
});
export type LogsGetInput = z.infer<typeof LogsGetInputSchema>;

/**
 * The catalog description claims this "returns a download URL pointing to a
 * CSV file" - confirmed live this is wrong: the response is the raw CSV
 * content itself (`Content-Type: text/csv`, no wrapping JSON envelope, no
 * URL), not a link to fetch separately. Distrusting the description here,
 * not guessing from it.
 */
const LogsDownloadInputSchema = ProfileIdOnlyInputSchema;
export type LogsDownloadInput = z.infer<typeof LogsDownloadInputSchema>;

const LogsClearInputSchema = ProfileIdOnlyInputSchema;
export type LogsClearInput = z.infer<typeof LogsClearInputSchema>;

/* -------------------------------------------------------------------------- */
/* setup / linked IP                                                          */
/* -------------------------------------------------------------------------- */

/**
 * No body fields needed - confirmed live that `PATCH .../setup/linkedip`
 * with an empty body succeeds; the provider infers the caller's public IP
 * from the request itself, matching the operation's own description
 * ("Updates the linked IP address ... to the current caller's public IP").
 */
const SetupUpdateLinkedIpInputSchema = ProfileIdOnlyInputSchema;
export type SetupUpdateLinkedIpInput = z.infer<
	typeof SetupUpdateLinkedIpInputSchema
>;

/* -------------------------------------------------------------------------- */
/* auth                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * `NEXTDNS_LOGIN`'s catalog description ("verify credentials and obtain
 * session headers and cookies for subsequent requests") describes a real
 * NextDNS mechanism - but one that authenticates with email + password (plus
 * an optional 2FA code) against an undocumented endpoint
 * (`POST /accounts/@login`, confirmed from an independent open-source
 * client's source), not the `X-Api-Key` header this entire catalog is built
 * on. Building it literally would mean asking a caller for a second,
 * materially more sensitive credential than the catalog's declared "1 auth",
 * against an endpoint the provider has never documented publicly.
 *
 * Implemented instead as credential verification using the one credential
 * this plugin actually asks for: a successful, cheap, already-authenticated
 * call (`GET /profiles`) confirms the API key is valid. No email/password
 * field exists on this input on purpose.
 */
const AuthLoginInputSchema = z.object({});
export type AuthLoginInput = z.infer<typeof AuthLoginInputSchema>;

const AuthLoginResponseSchema = z
	.object({
		valid: z.boolean(),
		profileCount: z.number(),
	})
	.loose();
export type AuthLoginResponse = z.infer<typeof AuthLoginResponseSchema>;

/* -------------------------------------------------------------------------- */
/* endpoint input/output maps                                                 */
/* -------------------------------------------------------------------------- */

export type NextDNSEndpointInputs = {
	'profiles.list': ProfilesListInput;
	'profiles.get': ProfilesGetInput;
	'profiles.create': ProfilesCreateInput;
	'profiles.update': ProfilesUpdateInput;
	'profiles.delete': ProfilesDeleteInput;
	'profiles.rename': ProfilesRenameInput;

	'settings.get': SettingsGetInput;
	'settings.update': SettingsUpdateInput;
	'settings.getBlockPage': SettingsGetBlockPageInput;
	'settings.updateBlockPage': SettingsUpdateBlockPageInput;
	'settings.getLogs': SettingsGetLogsInput;
	'settings.updateLogs': SettingsUpdateLogsInput;
	'settings.getPerformance': SettingsGetPerformanceInput;
	'settings.updatePerformance': SettingsUpdatePerformanceInput;
	'settings.logClientIps': SettingsLogClientIpsInput;
	'settings.logDomains': SettingsLogDomainsInput;

	'security.get': SecurityGetInput;
	'security.update': SecurityUpdateInput;
	'security.getTlds': SecurityGetTldsInput;
	'security.addBlockedTld': SecurityAddBlockedTldInput;
	'security.removeBlockedTld': SecurityRemoveBlockedTldInput;
	'security.replaceTlds': SecurityReplaceTldsInput;

	'privacy.get': PrivacyGetInput;
	'privacy.update': PrivacyUpdateInput;
	'privacy.addBlocklist': PrivacyAddBlocklistInput;
	'privacy.deleteBlocklist': PrivacyDeleteBlocklistInput;
	'privacy.replaceBlocklists': PrivacyReplaceBlocklistsInput;
	'privacy.addNative': PrivacyAddNativeInput;
	'privacy.deleteNative': PrivacyDeleteNativeInput;
	'privacy.replaceNatives': PrivacyReplaceNativesInput;

	'parentalControl.get': ParentalControlGetInput;
	'parentalControl.update': ParentalControlUpdateInput;
	'parentalControl.getCategories': ParentalControlGetCategoriesInput;
	'parentalControl.addCategory': ParentalControlAddCategoryInput;
	'parentalControl.deleteCategory': ParentalControlDeleteCategoryInput;
	'parentalControl.updateCategory': ParentalControlUpdateCategoryInput;
	'parentalControl.replaceCategories': ParentalControlReplaceCategoriesInput;
	'parentalControl.getServices': ParentalControlGetServicesInput;
	'parentalControl.addService': ParentalControlAddServiceInput;
	'parentalControl.deleteService': ParentalControlDeleteServiceInput;
	'parentalControl.updateService': ParentalControlUpdateServiceInput;
	'parentalControl.replaceServices': ParentalControlReplaceServicesInput;

	'denylist.list': DenylistListInput;
	'denylist.add': DenylistAddInput;
	'denylist.remove': DenylistRemoveInput;
	'denylist.update': DenylistUpdateInput;
	'denylist.replace': DenylistReplaceInput;

	'allowlist.get': AllowlistGetInput;
	'allowlist.add': AllowlistAddInput;
	'allowlist.delete': AllowlistDeleteInput;
	'allowlist.update': AllowlistUpdateInput;
	'allowlist.replace': AllowlistReplaceInput;

	'rewrites.get': RewritesGetInput;
	'rewrites.add': RewritesAddInput;
	'rewrites.delete': RewritesDeleteInput;

	'analytics.status': AnalyticsInput;
	'analytics.domains': AnalyticsInput;
	'analytics.reasons': AnalyticsInput;
	'analytics.ips': AnalyticsInput;
	'analytics.devices': AnalyticsInput;
	'analytics.protocols': AnalyticsInput;
	'analytics.queryTypes': AnalyticsInput;
	'analytics.ipVersions': AnalyticsInput;
	'analytics.dnssec': AnalyticsInput;
	'analytics.encryption': AnalyticsInput;
	'analytics.destinations': AnalyticsDestinationsInput;

	'logs.get': LogsGetInput;
	'logs.download': LogsDownloadInput;
	'logs.clear': LogsClearInput;

	'setup.updateLinkedIp': SetupUpdateLinkedIpInput;

	'auth.login': AuthLoginInput;
};

export type NextDNSEndpointOutputs = {
	'profiles.list': NextDNSProfileSummary[];
	'profiles.get': NextDNSProfile;
	'profiles.create': NextDNSProfileSummary;
	'profiles.update': { id: string };
	'profiles.delete': { id: string };
	'profiles.rename': { id: string };

	'settings.get': NextDNSSettings;
	'settings.update': NextDNSSettings;
	'settings.getBlockPage': NextDNSSettingsBlockPage;
	'settings.updateBlockPage': NextDNSSettingsBlockPage;
	'settings.getLogs': NextDNSSettingsLogs;
	'settings.updateLogs': NextDNSSettingsLogs;
	'settings.getPerformance': NextDNSSettingsPerformance;
	'settings.updatePerformance': NextDNSSettingsPerformance;
	'settings.logClientIps': NextDNSSettingsLogs;
	'settings.logDomains': NextDNSSettingsLogs;

	'security.get': NextDNSSecurity;
	'security.update': NextDNSSecurity;
	'security.getTlds': NextDNSSecurityTld[];
	'security.addBlockedTld': { id: string };
	'security.removeBlockedTld': { id: string };
	'security.replaceTlds': NextDNSSecurityTld[];

	'privacy.get': NextDNSPrivacy;
	'privacy.update': NextDNSPrivacy;
	'privacy.addBlocklist': { id: string };
	'privacy.deleteBlocklist': { id: string };
	'privacy.replaceBlocklists': NextDNSPrivacyBlocklist[];
	'privacy.addNative': { id: string };
	'privacy.deleteNative': { id: string };
	'privacy.replaceNatives': NextDNSPrivacyNative[];

	'parentalControl.get': NextDNSParentalControl;
	'parentalControl.update': NextDNSParentalControl;
	'parentalControl.getCategories': NextDNSParentalControlCategory[];
	'parentalControl.addCategory': { id: string };
	'parentalControl.deleteCategory': { id: string };
	'parentalControl.updateCategory': { id: string };
	'parentalControl.replaceCategories': NextDNSParentalControlCategory[];
	'parentalControl.getServices': NextDNSParentalControlService[];
	'parentalControl.addService': { id: string };
	'parentalControl.deleteService': { id: string };
	'parentalControl.updateService': { id: string };
	'parentalControl.replaceServices': NextDNSParentalControlService[];

	'denylist.list': NextDNSDenylistEntry[];
	'denylist.add': { id: string };
	'denylist.remove': { id: string };
	'denylist.update': { id: string };
	'denylist.replace': NextDNSDenylistEntry[];

	'allowlist.get': NextDNSAllowlistEntry[];
	'allowlist.add': { id: string };
	'allowlist.delete': { id: string };
	'allowlist.update': { id: string };
	'allowlist.replace': NextDNSAllowlistEntry[];

	'rewrites.get': NextDNSRewrite[];
	'rewrites.add': NextDNSRewrite;
	'rewrites.delete': { id: string };

	'analytics.status': NextDNSAnalyticsResponse;
	'analytics.domains': NextDNSAnalyticsResponse;
	'analytics.reasons': NextDNSAnalyticsResponse;
	'analytics.ips': NextDNSAnalyticsResponse;
	'analytics.devices': NextDNSAnalyticsResponse;
	'analytics.protocols': NextDNSAnalyticsResponse;
	'analytics.queryTypes': NextDNSAnalyticsResponse;
	'analytics.ipVersions': NextDNSAnalyticsResponse;
	'analytics.dnssec': NextDNSAnalyticsResponse;
	'analytics.encryption': NextDNSAnalyticsResponse;
	'analytics.destinations': NextDNSAnalyticsResponse;

	'logs.get': NextDNSLogsResponse;
	'logs.download': string;
	'logs.clear': { cleared: boolean };

	'setup.updateLinkedIp': NextDNSSetupLinkedIp;

	'auth.login': AuthLoginResponse;
};

export const NextDNSEndpointInputSchemas = {
	'profiles.list': ProfilesListInputSchema,
	'profiles.get': ProfilesGetInputSchema,
	'profiles.create': ProfilesCreateInputSchema,
	'profiles.update': ProfilesUpdateInputSchema,
	'profiles.delete': ProfilesDeleteInputSchema,
	'profiles.rename': ProfilesRenameInputSchema,

	'settings.get': SettingsGetInputSchema,
	'settings.update': SettingsUpdateInputSchema,
	'settings.getBlockPage': SettingsGetBlockPageInputSchema,
	'settings.updateBlockPage': SettingsUpdateBlockPageInputSchema,
	'settings.getLogs': SettingsGetLogsInputSchema,
	'settings.updateLogs': SettingsUpdateLogsInputSchema,
	'settings.getPerformance': SettingsGetPerformanceInputSchema,
	'settings.updatePerformance': SettingsUpdatePerformanceInputSchema,
	'settings.logClientIps': SettingsLogClientIpsInputSchema,
	'settings.logDomains': SettingsLogDomainsInputSchema,

	'security.get': SecurityGetInputSchema,
	'security.update': SecurityUpdateInputSchema,
	'security.getTlds': SecurityGetTldsInputSchema,
	'security.addBlockedTld': SecurityAddBlockedTldInputSchema,
	'security.removeBlockedTld': SecurityRemoveBlockedTldInputSchema,
	'security.replaceTlds': SecurityReplaceTldsInputSchema,

	'privacy.get': PrivacyGetInputSchema,
	'privacy.update': PrivacyUpdateInputSchema,
	'privacy.addBlocklist': PrivacyAddBlocklistInputSchema,
	'privacy.deleteBlocklist': PrivacyDeleteBlocklistInputSchema,
	'privacy.replaceBlocklists': PrivacyReplaceBlocklistsInputSchema,
	'privacy.addNative': PrivacyAddNativeInputSchema,
	'privacy.deleteNative': PrivacyDeleteNativeInputSchema,
	'privacy.replaceNatives': PrivacyReplaceNativesInputSchema,

	'parentalControl.get': ParentalControlGetInputSchema,
	'parentalControl.update': ParentalControlUpdateInputSchema,
	'parentalControl.getCategories': ParentalControlGetCategoriesInputSchema,
	'parentalControl.addCategory': ParentalControlAddCategoryInputSchema,
	'parentalControl.deleteCategory': ParentalControlDeleteCategoryInputSchema,
	'parentalControl.updateCategory': ParentalControlUpdateCategoryInputSchema,
	'parentalControl.replaceCategories':
		ParentalControlReplaceCategoriesInputSchema,
	'parentalControl.getServices': ParentalControlGetServicesInputSchema,
	'parentalControl.addService': ParentalControlAddServiceInputSchema,
	'parentalControl.deleteService': ParentalControlDeleteServiceInputSchema,
	'parentalControl.updateService': ParentalControlUpdateServiceInputSchema,
	'parentalControl.replaceServices': ParentalControlReplaceServicesInputSchema,

	'denylist.list': DenylistListInputSchema,
	'denylist.add': DenylistAddInputSchema,
	'denylist.remove': DenylistRemoveInputSchema,
	'denylist.update': DenylistUpdateInputSchema,
	'denylist.replace': DenylistReplaceInputSchema,

	'allowlist.get': AllowlistGetInputSchema,
	'allowlist.add': AllowlistAddInputSchema,
	'allowlist.delete': AllowlistDeleteInputSchema,
	'allowlist.update': AllowlistUpdateInputSchema,
	'allowlist.replace': AllowlistReplaceInputSchema,

	'rewrites.get': RewritesGetInputSchema,
	'rewrites.add': RewritesAddInputSchema,
	'rewrites.delete': RewritesDeleteInputSchema,

	'analytics.status': AnalyticsInputSchema,
	'analytics.domains': AnalyticsInputSchema,
	'analytics.reasons': AnalyticsInputSchema,
	'analytics.ips': AnalyticsInputSchema,
	'analytics.devices': AnalyticsInputSchema,
	'analytics.protocols': AnalyticsInputSchema,
	'analytics.queryTypes': AnalyticsInputSchema,
	'analytics.ipVersions': AnalyticsInputSchema,
	'analytics.dnssec': AnalyticsInputSchema,
	'analytics.encryption': AnalyticsInputSchema,
	'analytics.destinations': AnalyticsDestinationsInputSchema,

	'logs.get': LogsGetInputSchema,
	'logs.download': LogsDownloadInputSchema,
	'logs.clear': LogsClearInputSchema,

	'setup.updateLinkedIp': SetupUpdateLinkedIpInputSchema,

	'auth.login': AuthLoginInputSchema,
} as const;

export const NextDNSEndpointOutputSchemas = {
	'profiles.list': z.array(NextDNSProfileSummarySchema),
	'profiles.get': NextDNSProfileSchema,
	'profiles.create': NextDNSProfileSummarySchema,
	'profiles.update': z.object({ id: z.string() }),
	'profiles.delete': z.object({ id: z.string() }),
	'profiles.rename': z.object({ id: z.string() }),

	'settings.get': NextDNSSettingsSchema,
	'settings.update': NextDNSSettingsSchema,
	'settings.getBlockPage': NextDNSSettingsBlockPageSchema,
	'settings.updateBlockPage': NextDNSSettingsBlockPageSchema,
	'settings.getLogs': NextDNSSettingsLogsSchema,
	'settings.updateLogs': NextDNSSettingsLogsSchema,
	'settings.getPerformance': NextDNSSettingsPerformanceSchema,
	'settings.updatePerformance': NextDNSSettingsPerformanceSchema,
	'settings.logClientIps': NextDNSSettingsLogsSchema,
	'settings.logDomains': NextDNSSettingsLogsSchema,

	'security.get': NextDNSSecuritySchema,
	'security.update': NextDNSSecuritySchema,
	'security.getTlds': z.array(NextDNSSecurityTldSchema),
	'security.addBlockedTld': z.object({ id: z.string() }),
	'security.removeBlockedTld': z.object({ id: z.string() }),
	'security.replaceTlds': z.array(NextDNSSecurityTldSchema),

	'privacy.get': NextDNSPrivacySchema,
	'privacy.update': NextDNSPrivacySchema,
	'privacy.addBlocklist': z.object({ id: z.string() }),
	'privacy.deleteBlocklist': z.object({ id: z.string() }),
	'privacy.replaceBlocklists': z.array(NextDNSPrivacyBlocklistSchema),
	'privacy.addNative': z.object({ id: z.string() }),
	'privacy.deleteNative': z.object({ id: z.string() }),
	'privacy.replaceNatives': z.array(NextDNSPrivacyNativeSchema),

	'parentalControl.get': NextDNSParentalControlSchema,
	'parentalControl.update': NextDNSParentalControlSchema,
	'parentalControl.getCategories': z.array(
		NextDNSParentalControlCategorySchema,
	),
	'parentalControl.addCategory': z.object({ id: z.string() }),
	'parentalControl.deleteCategory': z.object({ id: z.string() }),
	'parentalControl.updateCategory': z.object({ id: z.string() }),
	'parentalControl.replaceCategories': z.array(
		NextDNSParentalControlCategorySchema,
	),
	'parentalControl.getServices': z.array(NextDNSParentalControlServiceSchema),
	'parentalControl.addService': z.object({ id: z.string() }),
	'parentalControl.deleteService': z.object({ id: z.string() }),
	'parentalControl.updateService': z.object({ id: z.string() }),
	'parentalControl.replaceServices': z.array(
		NextDNSParentalControlServiceSchema,
	),

	'denylist.list': z.array(NextDNSDenylistEntrySchema),
	'denylist.add': z.object({ id: z.string() }),
	'denylist.remove': z.object({ id: z.string() }),
	'denylist.update': z.object({ id: z.string() }),
	'denylist.replace': z.array(NextDNSDenylistEntrySchema),

	'allowlist.get': z.array(NextDNSAllowlistEntrySchema),
	'allowlist.add': z.object({ id: z.string() }),
	'allowlist.delete': z.object({ id: z.string() }),
	'allowlist.update': z.object({ id: z.string() }),
	'allowlist.replace': z.array(NextDNSAllowlistEntrySchema),

	'rewrites.get': z.array(NextDNSRewriteSchema),
	'rewrites.add': NextDNSRewriteSchema,
	'rewrites.delete': z.object({ id: z.string() }),

	'analytics.status': NextDNSAnalyticsResponseSchema,
	'analytics.domains': NextDNSAnalyticsResponseSchema,
	'analytics.reasons': NextDNSAnalyticsResponseSchema,
	'analytics.ips': NextDNSAnalyticsResponseSchema,
	'analytics.devices': NextDNSAnalyticsResponseSchema,
	'analytics.protocols': NextDNSAnalyticsResponseSchema,
	'analytics.queryTypes': NextDNSAnalyticsResponseSchema,
	'analytics.ipVersions': NextDNSAnalyticsResponseSchema,
	'analytics.dnssec': NextDNSAnalyticsResponseSchema,
	'analytics.encryption': NextDNSAnalyticsResponseSchema,
	'analytics.destinations': NextDNSAnalyticsResponseSchema,

	'logs.get': NextDNSLogsResponseSchema,
	'logs.download': z.string(),
	'logs.clear': z.object({ cleared: z.boolean() }),

	'setup.updateLinkedIp': NextDNSSetupLinkedIpSchema,

	'auth.login': AuthLoginResponseSchema,
} as const;
