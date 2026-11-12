import { z } from 'zod';

// Inputs use U301's own parameter names. Outputs are `.loose()` and the documented
// optionals nullish, so a field U301 adds or omits cannot fail a call that has
// already happened. Shapes come from https://u301.com/docs/ and the official SDK at
// https://www.npmjs.com/package/u301, whose `src/url-shortener.ts`,
// `src/domain.ts` and `src/analytics.ts` define the paths.
//
// Two things worth knowing before reading the models:
//
// - The workspace ID is a query parameter on every route, not part of the path or
//   the body. It travels in the composite key and the client adds it.
// - A link looks different on create than on read: a create answers `shortLink`,
//   `isReused` and `url`, while a read answers `shortUrl`, `originalUrl`,
//   `statsClicks` and the archived/suspended flags. Both are modelled as they are
//   rather than merged into one shape that would be wrong for one of them.

/** The default domain a short link gets when none is given. */
export const U301_DEFAULT_DOMAIN = 'u301.co';

/**
 * The analytics time ranges the click routes accept, taken from the SDK's own
 * `ranges` list. `1m` is a month and `90d`/`1y` are not accepted at all.
 */
export const U301_RANGES = [
	'24h',
	'1d',
	'3d',
	'7d',
	'14d',
	'30d',
	'60d',
	'1m',
] as const;

/** The click aggregation granularities: the SDK accepts only these two. */
export const U301_GRANULARITIES = ['day', 'hour'] as const;

/**
 * The audience breakdowns the `top-*` route serves. The values are the provider's
 * own path suffixes, which differ from the words a caller would guess for three of
 * them: `referers` (one r), `operating-systems` and `device-types`.
 */
export const U301_TOP_DIMENSIONS = [
	'countries',
	'cities',
	'referers',
	'browsers',
	'operating-systems',
	'device-types',
] as const;

const SlugSchema = z
	.string()
	.min(1)
	.describe('The path segment, without the domain or a leading slash.');

const DomainSchema = z
	.string()
	.min(1)
	// `.` and `..` would be resolved out of the /domains/<domain> path by fetch.
	.refine((domain) => domain !== '.' && domain !== '..', {
		message: 'A domain may not be a dot segment.',
	})
	.describe(
		`The domain for the link, such as ${U301_DEFAULT_DOMAIN} or one of your own.`,
	);

// ── links.create ──────────────────────────────────────────────────────────

const LinkCreateInputSchema = z.object({
	url: z.string().min(1).describe('The destination URL to shorten.'),
	domain: DomainSchema.optional(),
	slug: z
		.string()
		.min(1)
		.optional()
		.describe('A custom path. A random one is generated when omitted.'),
	reuseExisting: z
		.boolean()
		.optional()
		.describe(
			'Reuse an existing short link when the same URL is already shortened, instead of creating a second one.',
		),
	password: z
		.string()
		.optional()
		.describe('Require this password before the short link resolves.'),
	comment: z.string().optional().describe('A note to attach to the link.'),
});

export type LinkCreateInput = z.infer<typeof LinkCreateInputSchema>;

/**
 * A newly created link.
 *
 * `isReused` is true when `reuseExisting` matched an existing link, in which case
 * no new link was created and no allowance slot was spent.
 */
const LinkCreatedSchema = z
	.object({
		id: z.string().nullish(),
		url: z.string().nullish().describe('The destination URL.'),
		slug: z.string().nullish(),
		isCustomSlug: z.boolean().nullish(),
		domain: z.string().nullish(),
		isReused: z
			.boolean()
			.nullish()
			.describe(
				'True when an existing link was returned and no new one was created.',
			),
		shortLink: z
			.string()
			.nullish()
			.describe('The short link without a scheme, such as u301.co/jtyZ.'),
		comment: z.string().nullish(),
	})
	.loose();

export type U301LinkCreated = z.infer<typeof LinkCreatedSchema>;

const LinkCreateResponseSchema = LinkCreatedSchema;

export type LinkCreateResponse = z.infer<typeof LinkCreateResponseSchema>;

// ── links.list ────────────────────────────────────────────────────────────

const LinkListInputSchema = z.object({
	page: z.number().int().min(1).optional().describe('1-based page number.'),
	perPage: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Items per page. Defaults to 10.'),
});

export type LinkListInput = z.infer<typeof LinkListInputSchema>;

/**
 * A link as the list and get routes return it.
 *
 * `shortUrl` and `originalUrl` here, against `shortLink` and `url` on a create; and
 * `statsClicks`, `archived` and `suspended` only appear on a read.
 */
const LinkSchema = z
	.object({
		id: z.string().nullish(),
		domainName: z.string().nullish().describe('The domain, on a list row.'),
		domain: z.string().nullish().describe('The domain, on a single read.'),
		slug: z.string().nullish(),
		isCustomSlug: z.boolean().nullish(),
		shortUrl: z.string().nullish(),
		originalUrl: z.string().nullish().describe('The destination URL.'),
		allowSearchEngineIndexing: z.boolean().nullish(),
		archived: z.boolean().nullish(),
		suspended: z.boolean().nullish(),
		statsClicks: z.number().nullish().describe('Total clicks.'),
		expiresAt: z
			.string()
			.nullish()
			.describe('Null when the link never expires.'),
		userId: z.string().nullish(),
		workspaceId: z.string().nullish(),
		comment: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type U301Link = z.infer<typeof LinkSchema>;

/** The paging block of a list answer, as the SDK's list schema reads it. */
const LinkListMetadataSchema = z
	.object({
		total: z.number().nullish().describe('Links in the workspace.'),
		perPage: z.number().nullish(),
		page: z.number().nullish(),
	})
	.loose();

/** The list answers `{links, metadata}`. */
const LinkListResponseSchema = z
	.object({
		links: z.array(LinkSchema).nullish(),
		metadata: LinkListMetadataSchema.nullish(),
	})
	.loose();

export type LinkListResponse = z.infer<typeof LinkListResponseSchema>;

// ── links.get / links.delete ──────────────────────────────────────────────

const LinkRefInputSchema = z.object({
	shortlink: z
		.string()
		.min(1)
		.describe(
			'The short link as it appears, such as u301.co/abc123. It is sent as one path segment.',
		),
});

export type LinkRefInput = z.infer<typeof LinkRefInputSchema>;

const LinkGetResponseSchema = LinkSchema;

export type LinkGetResponse = z.infer<typeof LinkGetResponseSchema>;

const LinkDeleteResponseSchema = z
	.object({
		message: z.string().nullish().describe('"success" on deletion.'),
	})
	.loose();

export type LinkDeleteResponse = z.infer<typeof LinkDeleteResponseSchema>;

// ── domains ───────────────────────────────────────────────────────────────

const DomainListInputSchema = z.object({});

const DomainEntrySchema = z
	.object({
		domain: z.string().nullish(),
		randomCodeLength: z
			.number()
			.nullish()
			.describe('Length of the random slug on this domain.'),
		isPrimary: z.boolean().nullish(),
		isGlobal: z.boolean().nullish().describe('True for a U301-owned domain.'),
	})
	.loose();

const DomainListResponseSchema = z.array(DomainEntrySchema);

export type DomainListResponse = z.infer<typeof DomainListResponseSchema>;

const DomainCreateInputSchema = z.object({
	domain: DomainSchema,
	shortCodeLength: z
		.number()
		.int()
		.min(3)
		.max(10)
		.optional()
		.describe('Length of the random slug, 3 to 10. Defaults to 6.'),
});

export type DomainCreateInput = z.infer<typeof DomainCreateInputSchema>;

const DomainCreateResponseSchema = z
	.object({
		success: z.boolean().nullish(),
	})
	.loose();

export type DomainCreateResponse = z.infer<typeof DomainCreateResponseSchema>;

const DomainRefInputSchema = z.object({
	domain: DomainSchema,
});

export type DomainRefInput = z.infer<typeof DomainRefInputSchema>;

/**
 * What a custom domain needs in DNS, as the Get Domain Details page documents it.
 * `cnameValue` is the target the CNAME on `subdomain` must point at; on a domain
 * hosted on Cloudflare, `cloudflareAuthUrl` adds the record in one click.
 */
const DnsSettingsSchema = z
	.object({
		cnameValue: z
			.string()
			.nullish()
			.describe('The target the CNAME record must point at.'),
		isHostedOnCloudflare: z.boolean().nullish(),
		baseDomain: z.string().nullish(),
		subdomain: z
			.string()
			.nullish()
			.describe('The host the CNAME record is created on.'),
		domainConnectUrl: z.string().nullish(),
		cloudflareAuthUrl: z
			.string()
			.nullish()
			.describe('A link that adds the record on Cloudflare in one click.'),
	})
	.loose();

const DomainDetailSchema = z
	.object({
		domain: z.string().nullish(),
		isValid: z.boolean().nullish(),
		isArchived: z.boolean().nullish(),
		lastCheckedAt: z.string().nullish(),
		randomCodeLength: z.number().nullish(),
		workspaceId: z.string().nullish(),
		homePageRedirectUrl: z.string().nullish(),
		notFoundPageRedirectUrl: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		isPrimary: z.boolean().nullish(),
		isGlobal: z.boolean().nullish().describe('True for a U301-owned domain.'),
		dnsSettings: DnsSettingsSchema.nullish(),
	})
	.loose();

const DomainGetResponseSchema = DomainDetailSchema;

export type DomainGetResponse = z.infer<typeof DomainGetResponseSchema>;

/**
 * Whether the domain's DNS verification has completed. `actived` is U301's own
 * spelling, kept because that is the field the API sends.
 */
const DomainActiveResponseSchema = z
	.object({
		actived: z.boolean().nullish().describe('Whether the domain is active.'),
		message: z.string().nullish(),
	})
	.loose();

export type DomainActiveResponse = z.infer<typeof DomainActiveResponseSchema>;

const DomainDeleteResponseSchema = z
	.object({
		success: z.boolean().nullish(),
	})
	.loose();

export type DomainDeleteResponse = z.infer<typeof DomainDeleteResponseSchema>;

// ── domain settings ───────────────────────────────────────────────────────

/**
 * The three per-domain settings share one route and one PATCH, each sending a
 * single field. They are separate operations so a caller states which setting it
 * means rather than assembling a partial body.
 */
const DomainPathLengthInputSchema = z.object({
	domain: DomainSchema,
	randomCodeLength: z
		.number()
		.int()
		.min(3)
		.max(10)
		.describe('Length of the random slug, 3 to 10.'),
});

export type DomainPathLengthInput = z.infer<typeof DomainPathLengthInputSchema>;

const DomainHomeRedirectInputSchema = z.object({
	domain: DomainSchema,
	homePageRedirectUrl: z
		.string()
		.describe('Where the domain root redirects to.'),
});

export type DomainHomeRedirectInput = z.infer<
	typeof DomainHomeRedirectInputSchema
>;

const DomainNotFoundRedirectInputSchema = z.object({
	domain: DomainSchema,
	notFoundPageRedirectUrl: z
		.string()
		.describe('Where an unknown slug on this domain redirects to.'),
});

export type DomainNotFoundRedirectInput = z.infer<
	typeof DomainNotFoundRedirectInputSchema
>;

/**
 * The three settings routes answer `{ success: true }`, not the updated domain, so
 * aliasing `DomainDetailSchema` accepted `{ success: false }` and any other object.
 * Requiring `success: true` is what makes a rejected update fail the parse.
 */
const DomainSettingsResponseSchema = z
	.object({
		success: z.literal(true),
	})
	.loose();

export type DomainSettingsResponse = z.infer<
	typeof DomainSettingsResponseSchema
>;

// ── analytics ─────────────────────────────────────────────────────────────

const ClicksInputSchema = z.object({
	range: z.enum(U301_RANGES).describe('The window to aggregate over.'),
	granularity: z
		.enum(U301_GRANULARITIES)
		.describe('The bucket size within that window.'),
	timezone: z
		.string()
		.optional()
		.describe('An IANA timezone for the buckets. Defaults to UTC.'),
});

export type ClicksInput = z.infer<typeof ClicksInputSchema>;

const ClickPointSchema = z
	.object({
		date: z
			.string()
			.nullish()
			.describe('The bucket, formatted to match the granularity.'),
		// The API sends `click`, singular. Declaring `clicks` let every real response
		// pass through loose while the typed field stayed undefined.
		click: z.number().nullish(),
	})
	.loose();

const ClicksResponseSchema = z
	.object({
		start: z.string().nullish().describe('ISO 8601 start of the window.'),
		end: z.string().nullish().describe('ISO 8601 end of the window.'),
		data: z.array(ClickPointSchema).nullish().describe('One entry per bucket.'),
	})
	.loose();

export type ClicksResponse = z.infer<typeof ClicksResponseSchema>;

const AudienceInputSchema = z.object({
	dimension: z
		.enum(U301_TOP_DIMENSIONS)
		.describe(
			'Which breakdown to read: countries, cities, referers, browsers, operating-systems or device-types.',
		),
	range: z.enum(U301_RANGES).describe('The window to aggregate over.'),
	timezone: z
		.string()
		.optional()
		.describe('An IANA timezone for the buckets. Defaults to UTC.'),
});

export type AudienceInput = z.infer<typeof AudienceInputSchema>;

/**
 * One row of a breakdown. The SDK's schema calls the label `label` and the count
 * `click`, singular.
 */
const AudienceRowSchema = z
	.object({
		label: z.string().nullish(),
		click: z.number().nullish(),
		// A free-form map the API sometimes attaches; it is passed through untouched.
		meta: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

/** The route answers an envelope, not a bare array. */
const AudienceResponseSchema = z
	.object({
		datetimeRange: z.array(z.string()).nullish(),
		// A string, not the input enum: an output must not fail on a range U301
		// adds later, after the call has already happened.
		range: z.string().nullish(),
		data: z.array(AudienceRowSchema).nullish(),
	})
	.loose();

export type AudienceResponse = z.infer<typeof AudienceResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type U301EndpointInputs = {
	linkCreate: LinkCreateInput;
	linkList: LinkListInput;
	linkGet: LinkRefInput;
	linkDelete: LinkRefInput;
	domainList: z.infer<typeof DomainListInputSchema>;
	domainCreate: DomainCreateInput;
	domainGet: DomainRefInput;
	domainActive: DomainRefInput;
	domainDelete: DomainRefInput;
	domainPathLength: DomainPathLengthInput;
	domainHomeRedirect: DomainHomeRedirectInput;
	domainNotFoundRedirect: DomainNotFoundRedirectInput;
	clicks: ClicksInput;
	audience: AudienceInput;
};

export type U301EndpointOutputs = {
	linkCreate: LinkCreateResponse;
	linkList: LinkListResponse;
	linkGet: LinkGetResponse;
	linkDelete: LinkDeleteResponse;
	domainList: DomainListResponse;
	domainCreate: DomainCreateResponse;
	domainGet: DomainGetResponse;
	domainActive: DomainActiveResponse;
	domainDelete: DomainDeleteResponse;
	domainPathLength: DomainSettingsResponse;
	domainHomeRedirect: DomainSettingsResponse;
	domainNotFoundRedirect: DomainSettingsResponse;
	clicks: ClicksResponse;
	audience: AudienceResponse;
};

export const U301EndpointInputSchemas = {
	linkCreate: LinkCreateInputSchema,
	linkList: LinkListInputSchema,
	linkGet: LinkRefInputSchema,
	linkDelete: LinkRefInputSchema,
	domainList: DomainListInputSchema,
	domainCreate: DomainCreateInputSchema,
	domainGet: DomainRefInputSchema,
	domainActive: DomainRefInputSchema,
	domainDelete: DomainRefInputSchema,
	domainPathLength: DomainPathLengthInputSchema,
	domainHomeRedirect: DomainHomeRedirectInputSchema,
	domainNotFoundRedirect: DomainNotFoundRedirectInputSchema,
	clicks: ClicksInputSchema,
	audience: AudienceInputSchema,
} as const;

export const U301EndpointOutputSchemas = {
	linkCreate: LinkCreateResponseSchema,
	linkList: LinkListResponseSchema,
	linkGet: LinkGetResponseSchema,
	linkDelete: LinkDeleteResponseSchema,
	domainList: DomainListResponseSchema,
	domainCreate: DomainCreateResponseSchema,
	domainGet: DomainGetResponseSchema,
	domainActive: DomainActiveResponseSchema,
	domainDelete: DomainDeleteResponseSchema,
	domainPathLength: DomainSettingsResponseSchema,
	domainHomeRedirect: DomainSettingsResponseSchema,
	domainNotFoundRedirect: DomainSettingsResponseSchema,
	clicks: ClicksResponseSchema,
	audience: AudienceResponseSchema,
} as const;
