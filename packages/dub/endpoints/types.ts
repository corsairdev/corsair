import { z } from 'zod';

// Inputs use Dub's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Dub adds or omits cannot fail a call
// that has already happened. The workspace is implied by the API key: no
// operation takes a workspaceId, and Dub's API defines none.

// ── Shared pieces ─────────────────────────────────────────────────────────

const TAG_COLORS = [
	'red',
	'yellow',
	'green',
	'blue',
	'purple',
	'brown',
	'gray',
	'pink',
] as const;

const TagColorSchema = z.enum(TAG_COLORS);

// The spec's customer/update and track email pattern, kept verbatim.
const EMAIL_PATTERN =
	/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

const EmailSchema = z
	.string()
	.max(100)
	.regex(EMAIL_PATTERN, 'Not a valid email address');

/** A tag as it appears nested in a link, and as the tags resource itself. */
export const TagSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		// A string rather than the enum: an unknown color must not fail a read.
		color: z.string().nullish(),
	})
	.loose();

export type DubTag = z.infer<typeof TagSchema>;

/** A short link as the links resource returns it, and nested in events. */
export const LinkSchema = z
	.object({
		id: z.string(),
		domain: z.string().nullish(),
		key: z.string().nullish(),
		url: z.string().nullish(),
		trackConversion: z.boolean().nullish(),
		externalId: z.string().nullish(),
		tenantId: z.string().nullish(),
		programId: z.string().nullish(),
		partnerId: z.string().nullish(),
		archived: z.boolean().nullish(),
		expiresAt: z.string().nullish(),
		expiredUrl: z.string().nullish(),
		disabledAt: z.string().nullish(),
		password: z.string().nullish(),
		proxy: z.boolean().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		image: z.string().nullish(),
		video: z.string().nullish(),
		rewrite: z.boolean().nullish(),
		doIndex: z.boolean().nullish(),
		ios: z.string().nullish(),
		android: z.string().nullish(),
		// unknown: per-country destination URLs, passed through as Dub sends them.
		geo: z.record(z.string(), z.unknown()).nullish(),
		publicStats: z.boolean().nullish(),
		tags: z.array(TagSchema).nullish(),
		folderId: z.string().nullish(),
		comments: z.string().nullish(),
		shortLink: z.string().nullish(),
		qrCode: z.string().nullish(),
		utm_source: z.string().nullish(),
		utm_medium: z.string().nullish(),
		utm_campaign: z.string().nullish(),
		utm_term: z.string().nullish(),
		utm_content: z.string().nullish(),
		testVariants: z
			.array(
				z
					.object({
						url: z.string().nullish(),
						percentage: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
		testStartedAt: z.string().nullish(),
		testCompletedAt: z.string().nullish(),
		userId: z.string().nullish(),
		workspaceId: z.string().nullish(),
		clicks: z.number().nullish(),
		leads: z.number().nullish(),
		conversions: z.number().nullish(),
		sales: z.number().nullish(),
		saleAmount: z.number().nullish(),
		lastClicked: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		projectId: z.string().nullish(),
	})
	.loose();

export type DubLink = z.infer<typeof LinkSchema>;

const LinkSchemaRef = LinkSchema;

/** One row of the analytics `timeseries` output. */
const AnalyticsMetrics = {
	clicks: z.number().nullish(),
	leads: z.number().nullish(),
	sales: z.number().nullish(),
	saleAmount: z.number().nullish(),
};

const AnalyticsCountSchema = z.object(AnalyticsMetrics).loose();

// The spec pins a row schema per groupBy value; they all share the four
// metrics plus one key field, so one loose row covers every documented shape.
// Rows the spec leaves undocumented (utm_*, top_partners, ...) pass through
// the same loose row.
const AnalyticsRowSchema = z
	.object({
		start: z.string().nullish(),
		continent: z.string().nullish(),
		country: z.string().nullish(),
		region: z.string().nullish(),
		city: z.string().nullish(),
		device: z.string().nullish(),
		browser: z.string().nullish(),
		os: z.string().nullish(),
		trigger: z.string().nullish(),
		eventName: z.string().nullish(),
		referer: z.string().nullish(),
		refererUrl: z.string().nullish(),
		url: z.string().nullish(),
		link: z.string().nullish(),
		id: z.string().nullish(),
		domain: z.string().nullish(),
		key: z.string().nullish(),
		shortLink: z.string().nullish(),
		createdAt: z.string().nullish(),
		...AnalyticsMetrics,
	})
	.loose();

export const AnalyticsResponseSchema = z.union([
	AnalyticsCountSchema,
	z.array(AnalyticsRowSchema),
]);

export type DubAnalyticsResponse = z.infer<typeof AnalyticsResponseSchema>;

/** The click detail nested in an event row. */
const EventClickSchema = z
	.object({
		id: z.string(),
		timestamp: z.string().nullish(),
		url: z.string().nullish(),
		country: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		continent: z.string().nullish(),
		device: z.string().nullish(),
		browser: z.string().nullish(),
		os: z.string().nullish(),
		ua: z.string().nullish(),
		trigger: z.string().nullish(),
		referer: z.string().nullish(),
		refererUrl: z.string().nullish(),
		qr: z.boolean().nullish(),
		ip: z.string().nullish(),
	})
	.loose();

/** The customer summary nested in a lead or sale event. */
const EventCustomerSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		avatar: z.string().nullish(),
		externalId: z.string().nullish(),
		createdAt: z.string().nullish(),
	})
	.loose();

const SaleDetailSchema = z
	.object({
		amount: z.number().nullish(),
		currency: z.string().nullish(),
		paymentProcessor: z.string().nullish(),
		invoiceId: z.string().nullish(),
		// unknown: caller-supplied metadata, passed through as Dub sends it.
		metadata: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const EventContextFields = {
	click: EventClickSchema.nullish(),
	link: LinkSchemaRef.nullish(),
	click_id: z.string().nullish(),
	link_id: z.string().nullish(),
	domain: z.string().nullish(),
	key: z.string().nullish(),
	url: z.string().nullish(),
	continent: z.string().nullish(),
	country: z.string().nullish(),
	city: z.string().nullish(),
	device: z.string().nullish(),
	browser: z.string().nullish(),
	os: z.string().nullish(),
	qr: z.boolean().nullish(),
	ip: z.string().nullish(),
};

const ClickEventSchema = z
	.object({
		event: z.literal('click'),
		timestamp: z.string().nullish(),
		...EventContextFields,
	})
	.loose();

const LeadEventSchema = z
	.object({
		event: z.literal('lead'),
		timestamp: z.string().nullish(),
		eventId: z.string().nullish(),
		eventName: z.string().nullish(),
		// unknown: caller-supplied metadata, passed through as Dub sends it.
		metadata: z.record(z.string(), z.unknown()).nullish(),
		customer: EventCustomerSchema.nullish(),
		...EventContextFields,
	})
	.loose();

const SaleEventSchema = z
	.object({
		event: z.literal('sale'),
		timestamp: z.string().nullish(),
		eventId: z.string().nullish(),
		eventName: z.string().nullish(),
		sale: SaleDetailSchema.nullish(),
		saleAmount: z.number().nullish(),
		invoice_id: z.string().nullish(),
		payment_processor: z.string().nullish(),
		// unknown: caller-supplied metadata, passed through as Dub sends it.
		metadata: z.record(z.string(), z.unknown()).nullish(),
		customer: EventCustomerSchema.nullish(),
		...EventContextFields,
	})
	.loose();

export const EventSchema = z.union([
	ClickEventSchema,
	LeadEventSchema,
	SaleEventSchema,
]);

export type DubEvent = z.infer<typeof EventSchema>;

// ── Link bodies ───────────────────────────────────────────────────────────

const TestVariantSchema = z.object({
	url: z.string(),
	percentage: z.number().min(10).max(90),
});

// Create and upsert share this body; update is the same minus keyLength and
// prefix. Deprecated fields (tagId, publicStats, webhookIds, ...) are left
// out: their current replacements (tagIds, dashboard) are documented here.
const LinkCreateFields = {
	url: z.string().max(32_000),
	domain: z.string().max(190).optional(),
	key: z.string().max(190).optional(),
	keyLength: z.number().int().min(3).max(190).optional(),
	externalId: z.string().max(190).nullish(),
	tenantId: z.string().max(190).nullish(),
	programId: z.string().nullish(),
	partnerId: z.string().nullish(),
	prefix: z.string().max(190).optional(),
	trackConversion: z.boolean().optional(),
	archived: z.boolean().optional(),
	tagIds: z.union([z.string(), z.array(z.string())]).optional(),
	tagNames: z.union([z.string(), z.array(z.string())]).optional(),
	folderId: z.string().nullish(),
	comments: z.string().nullish(),
	expiresAt: z.string().nullish(),
	expiredUrl: z.string().max(32_000).nullish(),
	password: z.string().max(190).nullish(),
	proxy: z.boolean().optional(),
	title: z.string().nullish(),
	description: z.string().nullish(),
	image: z.string().nullish(),
	video: z.string().nullish(),
	rewrite: z.boolean().optional(),
	ios: z.string().max(32_000).nullish(),
	android: z.string().max(32_000).nullish(),
	geo: z.record(z.string(), z.string()).nullish(),
	doIndex: z.boolean().optional(),
	utm_source: z.string().max(255).nullish(),
	utm_medium: z.string().max(255).nullish(),
	utm_campaign: z.string().max(255).nullish(),
	utm_term: z.string().max(255).nullish(),
	utm_content: z.string().max(255).nullish(),
	ref: z.string().max(255).nullish(),
	testVariants: z.array(TestVariantSchema).min(2).max(4).nullish(),
	testStartedAt: z.string().nullish(),
	testCompletedAt: z.string().nullish(),
};

const LinkCreateBodySchema = z.object({
	...LinkCreateFields,
	url: z
		.string()
		.max(32_000)
		.describe('The destination URL of the short link.'),
});

export const LinkCreateInputSchema = LinkCreateBodySchema;

export type LinkCreateInput = z.input<typeof LinkCreateInputSchema>;

// The update body is create minus keyLength and prefix.
const LinkUpdateFieldsSchema = z.object({
	url: z.string().max(32_000).optional(),
	domain: z.string().max(190).optional(),
	key: z.string().max(190).optional(),
	externalId: z.string().max(190).nullish(),
	tenantId: z.string().max(190).nullish(),
	programId: z.string().nullish(),
	partnerId: z.string().nullish(),
	trackConversion: z.boolean().optional(),
	archived: z.boolean().optional(),
	tagIds: z.union([z.string(), z.array(z.string())]).optional(),
	tagNames: z.union([z.string(), z.array(z.string())]).optional(),
	folderId: z.string().nullish(),
	comments: z.string().nullish(),
	expiresAt: z.string().nullish(),
	expiredUrl: z.string().max(32_000).nullish(),
	password: z.string().max(190).nullish(),
	proxy: z.boolean().optional(),
	title: z.string().nullish(),
	description: z.string().nullish(),
	image: z.string().nullish(),
	video: z.string().nullish(),
	rewrite: z.boolean().optional(),
	ios: z.string().max(32_000).nullish(),
	android: z.string().max(32_000).nullish(),
	geo: z.record(z.string(), z.string()).nullish(),
	doIndex: z.boolean().optional(),
	utm_source: z.string().max(255).nullish(),
	utm_medium: z.string().max(255).nullish(),
	utm_campaign: z.string().max(255).nullish(),
	utm_term: z.string().max(255).nullish(),
	utm_content: z.string().max(255).nullish(),
	ref: z.string().max(255).nullish(),
	testVariants: z.array(TestVariantSchema).min(2).max(4).nullish(),
	testStartedAt: z.string().nullish(),
	testCompletedAt: z.string().nullish(),
});

/** A per-link failure row in the bulkCreate answer. */
export const LinkErrorSchema = z
	.object({
		// unknown: Dub echoes the rejected link payload back untyped.
		link: z.unknown(),
		error: z.string().nullish(),
		code: z.string().nullish(),
	})
	.loose();

// ── Cursor pagination over bare arrays ────────────────────────────────────

// Dub pages /links and /customers Stripe-style: startingAfter/endingBefore
// cursors over bare arrays, with no nextCursor field. The next cursor is the
// last item's id; null when the page came back short.
export function nextCursorFrom(
	items: { id?: string | null }[],
	// The page size the provider used: the caller's pageSize or Dub's default.
	pageSize: number,
): string | null {
	if (items.length < pageSize) return null;
	const last = items.at(-1)?.id;
	return typeof last === 'string' && last.length > 0 ? last : null;
}

// ── links ─────────────────────────────────────────────────────────────────

const LinkListFilters = {
	domain: z.string().optional(),
	tagIds: z.array(z.string()).optional(),
	tagNames: z.array(z.string()).optional(),
	folderId: z.string().optional(),
	search: z.string().optional(),
	userId: z.string().optional(),
	tenantId: z.string().optional(),
	showArchived: z.boolean().optional(),
};

export const DUB_LINKS_PAGE_SIZE = 100;

const LinksListInputSchema = z.object({
	...LinkListFilters,
	startingAfter: z.string().optional(),
	endingBefore: z.string().optional(),
	pageSize: z.number().int().min(1).max(DUB_LINKS_PAGE_SIZE).optional(),
});

export type LinksListInput = z.input<typeof LinksListInputSchema>;

const LinksListResponseSchema = z.object({
	items: z.array(LinkSchema),
	nextCursor: z
		.string()
		.nullable()
		.describe(
			'The startingAfter cursor for the next page while this one is full; null once a page comes back short.',
		),
});

export type LinksListResponse = z.infer<typeof LinksListResponseSchema>;

const LINK_COUNT_GROUP_BYS = ['domain', 'tagId', 'folderId', 'userId'] as const;

const LinksCountInputSchema = z.object({
	...LinkListFilters,
	groupBy: z.enum(LINK_COUNT_GROUP_BYS).optional(),
});

export type LinksCountInput = z.input<typeof LinksCountInputSchema>;

// A bare number without groupBy. With groupBy Dub returns the grouped query
// result directly: an array of rows such as { domain, _count } (see
// apps/web/lib/api/links/get-links-count.ts), whose keys follow the groupBy.
const LinksCountResponseSchema = z.union([
	z.number(),
	z.array(
		z
			.object({ _count: z.union([z.number(), z.object({}).loose()]).nullish() })
			.loose(),
	),
	// unknown: kept for an object-shaped grouped answer.
	z.record(z.string(), z.unknown()),
]);

export type LinksCountResponse = z.infer<typeof LinksCountResponseSchema>;

const LinkSelectorInputSchema = z
	.object({
		linkId: z.string().optional(),
		externalId: z.string().optional(),
		domain: z.string().optional(),
		key: z.string().optional(),
	})
	.superRefine((input, ctx) => {
		const hasDomainKey = input.domain !== undefined && input.key !== undefined;
		if (!input.linkId && !input.externalId && !hasDomainKey) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'Identify the link with linkId, externalId, or both domain and key.',
			});
		}
	});

export type LinkSelectorInput = z.input<typeof LinkSelectorInputSchema>;

const LinksUpdateInputSchema = z.object({
	linkId: z
		.string()
		.describe(
			'The ID of the link to update, or its externalId prefixed with ext_.',
		),
	...LinkUpdateFieldsSchema.shape,
});

export type LinksUpdateInput = z.input<typeof LinksUpdateInputSchema>;

const LinksDeleteInputSchema = z.object({
	linkId: z.string().describe('The ID of the link to delete.'),
});

export type LinksDeleteInput = z.input<typeof LinksDeleteInputSchema>;

const DeletedLinkSchema = z.object({ id: z.string() }).loose();

// Dub's body is a bare array; the input wraps it in `links` because a tool
// input has to be an object.
const LinksBulkCreateInputSchema = z.object({
	links: z
		.array(LinkCreateBodySchema)
		.min(1)
		.max(100)
		.describe('1-100 links to create, each with the links.create fields.'),
});

export type LinksBulkCreateInput = z.input<typeof LinksBulkCreateInputSchema>;

const LinksBulkCreateResponseSchema = z.array(
	z.union([LinkSchema, LinkErrorSchema]),
);

export type LinksBulkCreateResponse = z.infer<
	typeof LinksBulkCreateResponseSchema
>;

const LinksBulkUpdateInputSchema = z
	.object({
		linkIds: z
			.array(z.string())
			.max(100)
			.optional()
			.describe('The IDs of the links to update.'),
		externalIds: z
			.array(z.string())
			.max(100)
			.optional()
			.describe('The external IDs of the links to update.'),
		data: LinkUpdateFieldsSchema,
	})
	.superRefine((input, ctx) => {
		if (!input.linkIds?.length && !input.externalIds?.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Name the links to update with linkIds or externalIds.',
			});
		}
	});

export type LinksBulkUpdateInput = z.input<typeof LinksBulkUpdateInputSchema>;

const LinksBulkUpdateResponseSchema = z.array(LinkSchema);

export type LinksBulkUpdateResponse = z.infer<
	typeof LinksBulkUpdateResponseSchema
>;

const LinksBulkDeleteInputSchema = z
	.object({
		linkIds: z
			.array(z.string())
			.min(1)
			.max(100)
			.describe('Up to 100 link IDs. Non-existing IDs are ignored.'),
	})
	.describe('Deletes the links; their analytics are not restored on recreate.');

export type LinksBulkDeleteInput = z.input<typeof LinksBulkDeleteInputSchema>;

const DeletedCountSchema = z.object({ deletedCount: z.number() }).loose();

const LinksUpsertInputSchema = LinkCreateBodySchema;

export type LinksUpsertInput = z.input<typeof LinksUpsertInputSchema>;

// ── analytics ─────────────────────────────────────────────────────────────

const ANALYTICS_EVENTS = ['clicks', 'leads', 'sales', 'composite'] as const;
const INTERVALS = [
	'24h',
	'7d',
	'30d',
	'90d',
	'1y',
	'mtd',
	'qtd',
	'ytd',
	'all',
] as const;
const GROUP_BYS = [
	'count',
	'timeseries',
	'continents',
	'regions',
	'countries',
	'cities',
	'devices',
	'browsers',
	'os',
	'trigger',
	'triggers',
	'event_names',
	'referers',
	'referer_urls',
	'top_folders',
	'top_link_tags',
	'top_domains',
	'top_links',
	'top_urls',
	'top_base_urls',
	'top_partners',
	'top_groups',
	'top_partner_tags',
	'utm_sources',
	'utm_mediums',
	'utm_campaigns',
	'utm_terms',
	'utm_contents',
] as const;

// Filters shared by analytics.retrieve and events.list. A filter accepts one
// value, a comma-separated list, or its negation prefixed with !; the string
// passes through unchanged.
const AnalyticsFilters = {
	domain: z.string().optional(),
	key: z.string().optional(),
	linkId: z.string().optional(),
	externalId: z.string().optional(),
	tenantId: z.string().optional(),
	tagId: z.string().optional(),
	folderId: z.string().optional(),
	partnerTagId: z.string().optional(),
	groupId: z.string().optional(),
	partnerId: z.string().optional(),
	customerId: z.string().optional(),
	interval: z
		.enum(INTERVALS)
		.optional()
		.describe('Defaults to 24h. Ignored when start or end is set.'),
	start: z
		.string()
		.optional()
		.describe(
			'Start date, taking precedence over interval. Accepts natural language such as "4 hours ago".',
		),
	end: z.string().optional(),
	timezone: z.string().optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	region: z.string().optional(),
	continent: z.string().optional(),
	device: z.string().optional(),
	browser: z.string().optional(),
	os: z.string().optional(),
	trigger: z.string().optional(),
	eventName: z.string().optional(),
	referer: z.string().optional(),
	refererUrl: z.string().optional(),
	url: z.string().optional(),
	utm_source: z.string().optional(),
	utm_medium: z.string().optional(),
	utm_campaign: z.string().optional(),
	utm_term: z.string().optional(),
	utm_content: z.string().optional(),
	root: z.boolean().optional(),
	saleType: z.enum(['new', 'recurring']).optional(),
	query: z.string().max(10_000).optional(),
};

const AnalyticsRetrieveInputSchema = z.object({
	...AnalyticsFilters,
	event: z.enum(ANALYTICS_EVENTS).optional(),
	groupBy: z.enum(GROUP_BYS).optional(),
});

export type AnalyticsRetrieveInput = z.input<
	typeof AnalyticsRetrieveInputSchema
>;

// ── events ────────────────────────────────────────────────────────────────

export const DUB_EVENTS_LIMIT_MAX = 1000;
export const DUB_EVENTS_LIMIT_DEFAULT = 100;

const EventsListInputSchema = z.object({
	...AnalyticsFilters,
	event: z.enum(['clicks', 'leads', 'sales']).optional(),
	page: z.number().int().min(1).optional(),
	limit: z
		.number()
		.int()
		.min(1)
		.max(DUB_EVENTS_LIMIT_MAX)
		.optional()
		.describe(`Defaults to ${DUB_EVENTS_LIMIT_DEFAULT}.`),
	sortBy: z.enum(['timestamp']).optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type EventsListInput = z.input<typeof EventsListInputSchema>;

const EventsListResponseSchema = z.object({
	items: z.array(EventSchema),
	page: z.number(),
	limit: z.number(),
	nextPage: z
		.number()
		.nullable()
		.describe(
			'The next page while this one came back full; null once it came back short. A full last page leads to one empty page.',
		),
});

export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

// ── qr ────────────────────────────────────────────────────────────────────

const QrGetInputSchema = z.object({
	url: z.string().max(32_000).describe('The URL to encode into the QR code.'),
	size: z.number().optional(),
	level: z.enum(['L', 'M', 'Q', 'H']).optional(),
	fgColor: z.string().optional(),
	bgColor: z.string().optional(),
	margin: z.number().optional(),
	// logo and hideLogo need a paid plan, so they are left out.
	format: z
		.enum(['svg'])
		.optional()
		.describe(
			'SVG only. PNG is left out because it answers binary, which the plugin does not decode.',
		),
});

export type QrGetInput = z.input<typeof QrGetInputSchema>;

const QrGetResponseSchema = z.object({
	svg: z.string(),
});

export type QrGetResponse = z.infer<typeof QrGetResponseSchema>;

// ── tags ──────────────────────────────────────────────────────────────────

// The spec leaves the create body's required list empty, but the docs mark
// name required, so it is pinned here (research note 4).
const TagCreateInputSchema = z.object({
	name: z.string().min(1).max(190),
	color: TagColorSchema.optional(),
});

export type TagCreateInput = z.input<typeof TagCreateInputSchema>;

const TagUpdateInputSchema = z.object({
	id: z.string().describe('The ID of the tag to update.'),
	name: z.string().min(1).max(190).optional(),
	color: TagColorSchema.optional(),
});

export type TagUpdateInput = z.input<typeof TagUpdateInputSchema>;

const TagDeleteInputSchema = z.object({
	id: z.string().describe('The ID of the tag to delete.'),
});

export type TagDeleteInput = z.input<typeof TagDeleteInputSchema>;

const DeletedTagSchema = z.object({ id: z.string() }).loose();

export const DUB_TAGS_PAGE_SIZE = 100;

const TagsListInputSchema = z.object({
	sortBy: z.enum(['name', 'createdAt']).optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
	search: z.string().optional(),
	ids: z.array(z.string()).optional(),
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(DUB_TAGS_PAGE_SIZE).optional(),
});

export type TagsListInput = z.input<typeof TagsListInputSchema>;

const TagsListResponseSchema = z.object({
	items: z.array(TagSchema),
	page: z.number(),
	pageSize: z.number(),
	nextPage: z
		.number()
		.nullable()
		.describe(
			'The next page while this one came back full; null once it came back short. A full last page leads to one empty page.',
		),
});

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

// ── domains ───────────────────────────────────────────────────────────────

// domains.register (buys a .link domain) and domains.status (availability
// check) are intentionally excluded: register spends money and status is a
// domain-shopping helper outside link management.
const DomainFields = {
	expiredUrl: z.string().max(32_000).nullish(),
	notFoundUrl: z.string().max(32_000).nullish(),
	archived: z.boolean().optional(),
	placeholder: z.string().max(100).nullish(),
	logo: z
		.union([
			z.string().regex(/^data:image\/(png|jpeg|jpg|gif|webp|avif);base64,/),
			z.string().url(),
		])
		.nullish(),
	assetLinks: z.string().nullish(),
	appleAppSiteAssociation: z.string().nullish(),
};

const DomainCreateInputSchema = z.object({
	slug: z.string().min(1).max(190),
	...DomainFields,
});

export type DomainCreateInput = z.input<typeof DomainCreateInputSchema>;

const DomainUpdateInputSchema = z.object({
	slug: z.string().describe('The current domain name to update.'),
	// The body field is also named slug, so a rename needs its own input key.
	newSlug: z
		.string()
		.min(1)
		.max(190)
		.optional()
		.describe('A new domain name, to rename the domain.'),
	...DomainFields,
});

export type DomainUpdateInput = z.input<typeof DomainUpdateInputSchema>;

const DomainDeleteInputSchema = z.object({
	slug: z.string().describe('The domain name to delete.'),
});

export type DomainDeleteInput = z.input<typeof DomainDeleteInputSchema>;

// registeredDomain is nullable and its shape is only documented for
// purchased domains, so it passes through unpinned.
export const DomainSchema = z
	.object({
		id: z.string(),
		slug: z.string().nullish(),
		verified: z.boolean().nullish(),
		primary: z.boolean().nullish(),
		archived: z.boolean().nullish(),
		placeholder: z.string().nullish(),
		expiredUrl: z.string().nullish(),
		notFoundUrl: z.string().nullish(),
		logo: z.string().nullish(),
		assetLinks: z.string().nullish(),
		appleAppSiteAssociation: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		registeredDomain: z
			.object({
				id: z.string().nullish(),
				autoRenewalDisabledAt: z.string().nullish(),
				createdAt: z.string().nullish(),
				expiresAt: z.string().nullish(),
				renewalFee: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type DubDomain = z.infer<typeof DomainSchema>;

const DeletedDomainSchema = z.object({ slug: z.string() }).loose();

export const DUB_DOMAINS_PAGE_SIZE = 50;

const DomainsListInputSchema = z.object({
	archived: z.boolean().optional(),
	search: z.string().optional(),
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(DUB_DOMAINS_PAGE_SIZE).optional(),
});

export type DomainsListInput = z.input<typeof DomainsListInputSchema>;

const DomainsListResponseSchema = z.object({
	items: z.array(DomainSchema),
	page: z.number(),
	pageSize: z.number(),
	nextPage: z
		.number()
		.nullable()
		.describe(
			'The next page while this one came back full; null once it came back short. A full last page leads to one empty page.',
		),
});

export type DomainsListResponse = z.infer<typeof DomainsListResponseSchema>;

// ── folders ───────────────────────────────────────────────────────────────

const FolderCreateInputSchema = z.object({
	name: z.string().max(190),
	description: z.string().max(500).nullish(),
	accessLevel: z
		.enum(['write', 'read'])
		.nullish()
		.describe('Defaults to write. read and null need Business plans.'),
});

export type FolderCreateInput = z.input<typeof FolderCreateInputSchema>;

const FolderUpdateInputSchema = z.object({
	id: z.string().describe('The ID of the folder to update.'),
	name: z.string().max(190).optional(),
	description: z.string().max(500).nullish(),
	accessLevel: z.enum(['write', 'read']).nullish(),
});

export type FolderUpdateInput = z.input<typeof FolderUpdateInputSchema>;

const FolderDeleteInputSchema = z.object({
	id: z.string().describe('The ID of the folder to delete.'),
});

export type FolderDeleteInput = z.input<typeof FolderDeleteInputSchema>;

export const FolderSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		// A string rather than the enum: an unknown type must not fail a read.
		type: z.string().nullish(),
		accessLevel: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type DubFolder = z.infer<typeof FolderSchema>;

const DeletedFolderSchema = z.object({ id: z.string() }).loose();

export const DUB_FOLDERS_PAGE_SIZE = 50;

const FoldersListInputSchema = z.object({
	search: z.string().optional(),
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(DUB_FOLDERS_PAGE_SIZE).optional(),
});

export type FoldersListInput = z.input<typeof FoldersListInputSchema>;

const FoldersListResponseSchema = z.object({
	items: z.array(FolderSchema),
	page: z.number(),
	pageSize: z.number(),
	nextPage: z
		.number()
		.nullable()
		.describe(
			'The next page while this one came back full; null once it came back short. A full last page leads to one empty page.',
		),
});

export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

// ── track ─────────────────────────────────────────────────────────────────

// track.lead and track.sale append conversion data with no undo: they are
// irreversible writes. track.open is excluded: it is unauthenticated on
// Dub's side and records an open event this plugin's callers cannot send
// meaningfully.
const TrackMetadata = z.record(z.string(), z.unknown()).nullish();

const TrackLeadInputSchema = z.object({
	clickId: z
		.string()
		.describe(
			'The click ID from the dub_id cookie. An empty string asks Dub to reuse the last click of the customer.',
		),
	eventName: z.string().min(1).max(255),
	customerExternalId: z.string().min(1).max(100),
	customerName: z.string().max(100).nullish(),
	customerEmail: EmailSchema.nullish(),
	customerAvatar: z.string().nullish(),
	mode: z.enum(['async', 'wait', 'deferred']).optional(),
	eventQuantity: z.number().int().max(100).nullish(),
	metadata: TrackMetadata,
});

export type TrackLeadInput = z.input<typeof TrackLeadInputSchema>;

const TrackLeadResponseSchema = z
	.object({
		click: z.object({ id: z.string().nullish() }).loose().nullish(),
		link: z
			.object({
				id: z.string().nullish(),
				domain: z.string().nullish(),
				key: z.string().nullish(),
				shortLink: z.string().nullish(),
				url: z.string().nullish(),
				partnerId: z.string().nullish(),
				programId: z.string().nullish(),
				tenantId: z.string().nullish(),
				externalId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		customer: EventCustomerSchema.nullish(),
	})
	.loose();

export type TrackLeadResponse = z.infer<typeof TrackLeadResponseSchema>;

const TrackSaleInputSchema = z.object({
	customerExternalId: z.string().min(1).max(100),
	amount: z
		.number()
		.int()
		.min(0)
		.describe(
			'The sale amount in cents, or the full integer for zero-decimal currencies.',
		),
	currency: z.string().optional(),
	eventName: z.string().max(255).optional(),
	paymentProcessor: z
		.enum([
			'stripe',
			'shopify',
			'polar',
			'paddle',
			'apple',
			'revenuecat',
			'lemonsqueezy',
			'dub',
			'custom',
		])
		.optional(),
	invoiceId: z
		.string()
		.nullish()
		.describe(
			'Acts as an idempotency key: only one sale is recorded per invoice ID.',
		),
	metadata: TrackMetadata,
	leadEventName: z.string().nullish(),
	clickId: z.string().nullish(),
	customerName: z.string().max(100).nullish(),
	customerEmail: EmailSchema.nullish(),
	customerAvatar: z.string().nullish(),
});

export type TrackSaleInput = z.input<typeof TrackSaleInputSchema>;

const TrackSaleResponseSchema = z
	.object({
		eventName: z.string().nullish(),
		customer: EventCustomerSchema.nullish(),
		sale: SaleDetailSchema.nullish(),
	})
	.loose();

export type TrackSaleResponse = z.infer<typeof TrackSaleResponseSchema>;

// ── customers ─────────────────────────────────────────────────────────────

export const CustomerSchema = z
	.object({
		id: z.string(),
		externalId: z.string().nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		avatar: z.string().nullish(),
		stripeCustomerId: z.string().nullish(),
		country: z.string().nullish(),
		sales: z.number().nullish(),
		saleAmount: z.number().nullish(),
		createdAt: z.string().nullish(),
		firstSaleAt: z.string().nullish(),
		subscriptionCanceledAt: z.string().nullish(),
		link: z
			.object({
				id: z.string().nullish(),
				domain: z.string().nullish(),
				key: z.string().nullish(),
				shortLink: z.string().nullish(),
				url: z.string().nullish(),
				programId: z.string().nullish(),
			})
			.loose()
			.nullish(),
		programId: z.string().nullish(),
		partner: z
			.object({
				id: z.string().nullish(),
				name: z.string().nullish(),
				email: z.string().nullish(),
				image: z.string().nullish(),
			})
			.loose()
			.nullish(),
		discount: z
			.object({
				id: z.string().nullish(),
				amount: z.number().nullish(),
				type: z.string().nullish(),
				maxDuration: z.number().nullish(),
				couponId: z.string().nullish(),
				couponTestId: z.string().nullish(),
				description: z.string().nullish(),
				partnersCount: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type DubCustomer = z.infer<typeof CustomerSchema>;

export const DUB_CUSTOMERS_PAGE_SIZE = 100;

const CustomersListInputSchema = z.object({
	email: z.string().optional(),
	externalId: z.string().optional(),
	search: z.string().optional(),
	country: z.string().optional(),
	linkId: z.string().optional(),
	programId: z.string().optional(),
	partnerId: z.string().optional(),
	includeExpandedFields: z.boolean().optional(),
	sortBy: z
		.enum(['createdAt', 'saleAmount', 'firstSaleAt', 'subscriptionCanceledAt'])
		.optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
	startingAfter: z.string().optional(),
	endingBefore: z.string().optional(),
	pageSize: z.number().int().min(1).max(DUB_CUSTOMERS_PAGE_SIZE).optional(),
});

export type CustomersListInput = z.input<typeof CustomersListInputSchema>;

const CustomersListResponseSchema = z.object({
	items: z.array(CustomerSchema),
	nextCursor: z
		.string()
		.nullable()
		.describe(
			'The startingAfter cursor for the next page while this one is full; null once a page comes back short.',
		),
});

export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;

const CustomerSelectorInputSchema = z.object({
	id: z
		.string()
		.describe(
			"The customer's ID on Dub, or their externalId prefixed with ext_.",
		),
});

export type CustomerSelectorInput = z.input<typeof CustomerSelectorInputSchema>;

const CustomersUpdateInputSchema = z.object({
	id: z.string(),
	email: EmailSchema.nullish(),
	name: z.string().max(100).nullish(),
	avatar: z.string().nullish(),
	externalId: z.string().max(100).optional(),
	stripeCustomerId: z.string().max(100).nullish(),
	country: z.string().nullish(),
	subscriptionCanceledAt: z.string().nullish(),
});

export type CustomersUpdateInput = z.input<typeof CustomersUpdateInputSchema>;

const CustomersDeleteInputSchema = z.object({
	id: z.string().describe('The ID of the customer to delete.'),
});

export type CustomersDeleteInput = z.input<typeof CustomersDeleteInputSchema>;

const DeletedCustomerSchema = z.object({ id: z.string() }).loose();

// ── Registry ──────────────────────────────────────────────────────────────

export type DubEndpointInputs = {
	linksCreate: LinkCreateInput;
	linksList: LinksListInput;
	linksGet: LinkSelectorInput;
	linksUpdate: LinksUpdateInput;
	linksUpsert: LinksUpsertInput;
	linksCount: LinksCountInput;
	linksDelete: LinksDeleteInput;
	linksBulkCreate: LinksBulkCreateInput;
	linksBulkUpdate: LinksBulkUpdateInput;
	linksBulkDelete: LinksBulkDeleteInput;
	analyticsRetrieve: AnalyticsRetrieveInput;
	eventsList: EventsListInput;
	qrGet: QrGetInput;
	tagsCreate: TagCreateInput;
	tagsList: TagsListInput;
	tagsUpdate: TagUpdateInput;
	tagsDelete: TagDeleteInput;
	domainsCreate: DomainCreateInput;
	domainsList: DomainsListInput;
	domainsUpdate: DomainUpdateInput;
	domainsDelete: DomainDeleteInput;
	foldersCreate: FolderCreateInput;
	foldersList: FoldersListInput;
	foldersUpdate: FolderUpdateInput;
	foldersDelete: FolderDeleteInput;
	trackLead: TrackLeadInput;
	trackSale: TrackSaleInput;
	customersList: CustomersListInput;
	customersGet: CustomerSelectorInput;
	customersUpdate: CustomersUpdateInput;
	customersDelete: CustomersDeleteInput;
};

export type DubEndpointOutputs = {
	linksCreate: DubLink;
	linksList: LinksListResponse;
	linksGet: DubLink;
	linksUpdate: DubLink;
	linksUpsert: DubLink;
	linksCount: LinksCountResponse;
	linksDelete: z.infer<typeof DeletedLinkSchema>;
	linksBulkCreate: LinksBulkCreateResponse;
	linksBulkUpdate: LinksBulkUpdateResponse;
	linksBulkDelete: z.infer<typeof DeletedCountSchema>;
	analyticsRetrieve: DubAnalyticsResponse;
	eventsList: EventsListResponse;
	qrGet: QrGetResponse;
	tagsCreate: DubTag;
	tagsList: TagsListResponse;
	tagsUpdate: DubTag;
	tagsDelete: z.infer<typeof DeletedTagSchema>;
	domainsCreate: DubDomain;
	domainsList: DomainsListResponse;
	domainsUpdate: DubDomain;
	domainsDelete: z.infer<typeof DeletedDomainSchema>;
	foldersCreate: DubFolder;
	foldersList: FoldersListResponse;
	foldersUpdate: DubFolder;
	foldersDelete: z.infer<typeof DeletedFolderSchema>;
	trackLead: TrackLeadResponse;
	trackSale: TrackSaleResponse;
	customersList: CustomersListResponse;
	customersGet: DubCustomer;
	customersUpdate: DubCustomer;
	customersDelete: z.infer<typeof DeletedCustomerSchema>;
};

export const DubEndpointInputSchemas = {
	linksCreate: LinkCreateInputSchema,
	linksList: LinksListInputSchema,
	linksGet: LinkSelectorInputSchema,
	linksUpdate: LinksUpdateInputSchema,
	linksUpsert: LinksUpsertInputSchema,
	linksCount: LinksCountInputSchema,
	linksDelete: LinksDeleteInputSchema,
	linksBulkCreate: LinksBulkCreateInputSchema,
	linksBulkUpdate: LinksBulkUpdateInputSchema,
	linksBulkDelete: LinksBulkDeleteInputSchema,
	analyticsRetrieve: AnalyticsRetrieveInputSchema,
	eventsList: EventsListInputSchema,
	qrGet: QrGetInputSchema,
	tagsCreate: TagCreateInputSchema,
	tagsList: TagsListInputSchema,
	tagsUpdate: TagUpdateInputSchema,
	tagsDelete: TagDeleteInputSchema,
	domainsCreate: DomainCreateInputSchema,
	domainsList: DomainsListInputSchema,
	domainsUpdate: DomainUpdateInputSchema,
	domainsDelete: DomainDeleteInputSchema,
	foldersCreate: FolderCreateInputSchema,
	foldersList: FoldersListInputSchema,
	foldersUpdate: FolderUpdateInputSchema,
	foldersDelete: FolderDeleteInputSchema,
	trackLead: TrackLeadInputSchema,
	trackSale: TrackSaleInputSchema,
	customersList: CustomersListInputSchema,
	customersGet: CustomerSelectorInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	customersDelete: CustomersDeleteInputSchema,
} as const;

export const DubEndpointOutputSchemas = {
	linksCreate: LinkSchemaRef,
	linksList: LinksListResponseSchema,
	linksGet: LinkSchemaRef,
	linksUpdate: LinkSchemaRef,
	linksUpsert: LinkSchemaRef,
	linksCount: LinksCountResponseSchema,
	linksDelete: DeletedLinkSchema,
	linksBulkCreate: LinksBulkCreateResponseSchema,
	linksBulkUpdate: LinksBulkUpdateResponseSchema,
	linksBulkDelete: DeletedCountSchema,
	analyticsRetrieve: AnalyticsResponseSchema,
	eventsList: EventsListResponseSchema,
	qrGet: QrGetResponseSchema,
	tagsCreate: TagSchema,
	tagsList: TagsListResponseSchema,
	tagsUpdate: TagSchema,
	tagsDelete: DeletedTagSchema,
	domainsCreate: DomainSchema,
	domainsList: DomainsListResponseSchema,
	domainsUpdate: DomainSchema,
	domainsDelete: DeletedDomainSchema,
	foldersCreate: FolderSchema,
	foldersList: FoldersListResponseSchema,
	foldersUpdate: FolderSchema,
	foldersDelete: DeletedFolderSchema,
	trackLead: TrackLeadResponseSchema,
	trackSale: TrackSaleResponseSchema,
	customersList: CustomersListResponseSchema,
	customersGet: CustomerSchema,
	customersUpdate: CustomerSchema,
	customersDelete: DeletedCustomerSchema,
} as const;
