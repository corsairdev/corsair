import { z } from 'zod';

// ── Shared ────────────────────────────────────────────────────────────────

/** Fluxguard mixes epoch milliseconds and ISO strings; accept either. */
const timestamp = z
	.union([z.string(), z.number()])
	.describe('ISO 8601 string or epoch milliseconds');

/**
 * Fluxguard's own AI severity labels, as sent on the account (`flags`) and on
 * a change (`aiFlagged`): `warning`, `serenity`, `danger`, `resolved`. The
 * account reports them as objects, a change reports one as a bare string.
 */
const FluxguardFlagSchema = z
	.object({
		name: z.string().describe('Flag name, e.g. warning'),
		color: z.string().nullish().describe('Hex colour the console shows'),
		isDefault: z.boolean().nullish(),
	})
	.loose();

const FluxguardSiteRefSchema = z
	.object({
		id: z.string().describe('Site ID'),
		origin: z.string().nullish().describe('Root domain being monitored'),
	})
	.loose();

const FluxguardSessionRefSchema = z
	.object({
		id: z.string().describe('Session ID'),
		name: z.string().nullish(),
		comparisonType: z
			.string()
			.nullish()
			.describe('text, html, visual or network'),
	})
	.loose();

const FluxguardPageRefSchema = z
	.object({
		id: z.string().describe('Page ID'),
		path: z.string().nullish().describe('Path of the monitored page'),
	})
	.loose();

// ── account.get ───────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({});

export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

const AccountGetResponseSchema = z
	.object({
		id: z.string().describe('Organisation ID; the webhook tenant key'),
		status: z
			.string()
			.nullish()
			.describe('Lowercase account status, e.g. active'),
		plan: z.number().nullish().describe('Plan tier; 0 on a free account'),
		credits: z.number().nullish().describe('Credits remaining'),
		siteCount: z.number().nullish().describe('Sites being monitored'),
		notifyGap: z
			.number()
			.nullish()
			.describe('Minutes between change notifications'),
		created: timestamp.nullish().describe('When the account was created'),
		lastTouch: timestamp.nullish().describe('Last account activity'),
		lastFreeCredits: timestamp.nullish(),
		flags: z
			.record(z.string(), FluxguardFlagSchema)
			.nullish()
			.describe('Change severity labels with their console colours'),
	})
	.loose();

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── monitoring.addPage ────────────────────────────────────────────────────

const MonitoringAddPageInputSchema = z
	.object({
		// Not `.url()`: Fluxguard accepts a scheme-less host (`example.net`) and
		// even rejects nothing for a bare word, so a stricter check here would
		// refuse requests the API accepts.
		url: z
			.string()
			.min(1)
			.describe('URL to monitor; a scheme-less host is accepted'),
		siteId: z
			.string()
			.optional()
			.describe(
				'Existing site. Must be given with sessionId; siteNickname and the category options are rejected when it is set',
			),
		sessionId: z
			.string()
			.optional()
			.describe('Existing session. Must be given with siteId'),
		categories: z.array(z.string()).optional().describe('Category IDs'),
		categoryId: z.string().optional().describe('Single category ID'),
		categoryName: z.string().optional().describe('Single category name'),
		siteNickname: z
			.string()
			.optional()
			.describe('Nickname for the site created with this page'),
	})
	.superRefine((input, ctx) => {
		// The API answers 400 "Both or neither of siteId and sessionId must be
		// specified", so fail before the call.
		if ((input.siteId === undefined) !== (input.sessionId === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: [input.siteId === undefined ? 'sessionId' : 'siteId'],
				message:
					'siteId and sessionId must be given together, or omitted to create a new site',
			});
		}
		// The API answers 400 "Site settings (categories, nickname) cannot be
		// specified as the site already exists".
		if (input.siteId !== undefined) {
			const siteSettings = [
				'categories',
				'categoryId',
				'categoryName',
				'siteNickname',
			] as const;
			const rejected = siteSettings.find((name) => input[name] !== undefined);
			if (rejected !== undefined) {
				ctx.addIssue({
					code: 'custom',
					path: [rejected],
					message:
						'Fluxguard rejects site settings when adding a page to an existing site',
				});
			}
		}
	});

export type MonitoringAddPageInput = z.input<
	typeof MonitoringAddPageInputSchema
>;

const MonitoringAddPageResponseSchema = z
	.object({
		siteId: z.string().describe('Site the page was added to'),
		sessionId: z.string().describe('Session the page was added to'),
		pageId: z.string().describe('New page ID'),
	})
	.loose();

export type MonitoringAddPageResponse = z.infer<
	typeof MonitoringAddPageResponseSchema
>;

// ── monitoring.startCrawl ─────────────────────────────────────────────────

const MonitoringStartCrawlInputSchema = z.object({
	siteId: z.string().describe('Site ID'),
	sessionId: z.string().describe('Session ID'),
});

export type MonitoringStartCrawlInput = z.input<
	typeof MonitoringStartCrawlInputSchema
>;

// A crawl trigger answers 204 with no body, so the identifiers are echoed back.
const MonitoringStartCrawlResponseSchema = z
	.object({
		siteId: z.string().describe('Site that was crawled'),
		sessionId: z.string().describe('Session that was crawled'),
	})
	.loose();

export type MonitoringStartCrawlResponse = z.infer<
	typeof MonitoringStartCrawlResponseSchema
>;

// ── monitoring.getPage ────────────────────────────────────────────────────

const MonitoringGetPageInputSchema = z.object({
	siteId: z.string().describe('Site ID'),
	sessionId: z.string().describe('Session ID'),
	pageId: z.string().describe('Page ID'),
});

export type MonitoringGetPageInput = z.input<
	typeof MonitoringGetPageInputSchema
>;

const MonitoringGetPageResponseSchema = z
	.object({
		id: z.string().describe('Page ID'),
		orgId: z.string().nullish().describe('Organisation that owns the site'),
		path: z.string().nullish().describe('Path of the monitored page'),
		url: z.string().nullish().describe('URL being monitored'),
		status: z
			.string()
			.nullish()
			.describe('active, or ignore once the page was deleted'),
		versions: z.number().nullish().describe('Versions captured so far'),
		versionsKept: z.number().nullish().describe('Versions retained'),
		viewUrl: z.string().nullish().describe('Console URL for this page'),
		created: timestamp.nullish().describe('When the page was added'),
		site: FluxguardSiteRefSchema.nullish(),
		session: FluxguardSessionRefSchema.nullish(),
		siteCategories: z
			.array(z.string())
			.describe('Names of the site categories the site belongs to'),
		pageCategories: z
			.array(z.string())
			.describe('Names of the page categories the page belongs to'),
	})
	.loose();

export type MonitoringGetPageResponse = z.infer<
	typeof MonitoringGetPageResponseSchema
>;

// ── monitoring.deletePage ─────────────────────────────────────────────────

const MonitoringDeletePageInputSchema = z.object({
	siteId: z.string().describe('Site ID'),
	sessionId: z.string().describe('Session ID'),
	pageId: z.string().describe('Page ID'),
});

export type MonitoringDeletePageInput = z.input<
	typeof MonitoringDeletePageInputSchema
>;

// A delete answers 204 with no body.
const MonitoringDeletePageResponseSchema = z
	.object({
		success: z.boolean().describe('True once Fluxguard accepted the delete'),
		siteId: z.string(),
		sessionId: z.string(),
		pageId: z.string(),
	})
	.loose();

export type MonitoringDeletePageResponse = z.infer<
	typeof MonitoringDeletePageResponseSchema
>;

// ── monitoring.deleteSite ─────────────────────────────────────────────────

const MonitoringDeleteSiteInputSchema = z.object({
	siteId: z.string().describe('Site ID'),
});

export type MonitoringDeleteSiteInput = z.input<
	typeof MonitoringDeleteSiteInputSchema
>;

const MonitoringDeleteSiteResponseSchema = z
	.object({
		success: z.boolean().describe('True once Fluxguard accepted the delete'),
		siteId: z.string(),
	})
	.loose();

export type MonitoringDeleteSiteResponse = z.infer<
	typeof MonitoringDeleteSiteResponseSchema
>;

// ── webhooks.list ─────────────────────────────────────────────────────────

const WebhooksListInputSchema = z.object({});

export type WebhooksListInput = z.input<typeof WebhooksListInputSchema>;

const FluxguardWebhookSchema = z
	.object({
		id: z.string().describe('Webhook ID; pass it to webhooks.delete'),
		url: z.string().describe('URL Fluxguard POSTs change events to'),
		secret: z
			.string()
			.nullish()
			.describe(
				'Signing secret for this webhook; set it as webhookSecret to verify deliveries. Never logged',
			),
		api: z
			.string()
			.nullish()
			.describe('API version the webhook was created with, e.g. 2019-11-19'),
		created: timestamp.nullish().describe('When the webhook was added'),
	})
	.loose();

export type FluxguardWebhook = z.infer<typeof FluxguardWebhookSchema>;

// The endpoint answers a bare array; an account with no webhooks gets `[]`.
const WebhooksListResponseSchema = z.object({
	webhooks: z.array(FluxguardWebhookSchema),
});

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

// ── webhooks.create ───────────────────────────────────────────────────────

const WebhooksCreateInputSchema = z.object({
	url: z.string().min(1).describe('URL to POST change events to'),
});

export type WebhooksCreateInput = z.input<typeof WebhooksCreateInputSchema>;

// The API returns the new id alone, so the URL is echoed back beside it.
const WebhooksCreateResponseSchema = z
	.object({
		id: z.string().describe('Webhook ID; pass it to webhooks.delete'),
		url: z.string().describe('URL the webhook posts to'),
	})
	.loose();

export type WebhooksCreateResponse = z.infer<
	typeof WebhooksCreateResponseSchema
>;

// ── webhooks.delete ───────────────────────────────────────────────────────

const WebhooksDeleteInputSchema = z.object({
	id: z.string().describe('Webhook ID from webhooks.list'),
});

export type WebhooksDeleteInput = z.input<typeof WebhooksDeleteInputSchema>;

const WebhooksDeleteResponseSchema = z
	.object({
		success: z.boolean().describe('True once Fluxguard accepted the delete'),
		id: z.string(),
	})
	.loose();

export type WebhooksDeleteResponse = z.infer<
	typeof WebhooksDeleteResponseSchema
>;

// ── webhooks.sample ───────────────────────────────────────────────────────

const WebhooksSampleInputSchema = z.object({});

export type WebhooksSampleInput = z.input<typeof WebhooksSampleInputSchema>;

/**
 * One change, as Fluxguard POSTs it: the captured version with S3 filenames
 * for the HTML, screenshot, text and diff files. The endpoint returns these in
 * an array, and the account's own history when it has one.
 */
const FluxguardChangeSchema = z
	.object({
		url: z.string().nullish().describe('URL where the change was detected'),
		finalUrl: z.string().nullish().describe('URL after redirects'),
		capturedAt: timestamp.nullish().describe('When the version was captured'),
		comparisonType: z
			.string()
			.nullish()
			.describe('text, html, visual or network'),
		orgId: z.string().nullish(),
		orgName: z.string().nullish(),
		title: z.string().nullish().describe('Title of the page'),
		statusCode: z.number().nullish(),
		aiFlagged: z
			.string()
			.nullish()
			.describe('warning for a significant change, serenity otherwise'),
		summary: z
			.string()
			.nullish()
			.describe('AI summary of the captured version'),
		diffSummary: z
			.string()
			.nullish()
			.describe('AI summary of what changed since the previous version'),
		diffUrl: z.string().nullish().describe('Console URL for this version'),
		fileBaseUrl: z
			.string()
			.nullish()
			.describe('Prefix to append every filename under files to'),
		site: FluxguardSiteRefSchema.nullish(),
		session: FluxguardSessionRefSchema.nullish(),
		page: FluxguardPageRefSchema.nullish(),
		siteCategories: z.array(z.string()).nullish(),
		pageCategories: z.array(z.string()).nullish(),
		// unknown: the file map is provider-defined. `captures` holds filenames
		// and `diffs` mixes filenames with a boolean `net` flag.
		files: z.record(z.string(), z.unknown()).nullish(),
		// unknown: alarms are account-defined and carry arbitrary values.
		alarms: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type FluxguardChange = z.infer<typeof FluxguardChangeSchema>;

const WebhooksSampleResponseSchema = z.object({
	samples: z.array(FluxguardChangeSchema),
});

export type WebhooksSampleResponse = z.infer<
	typeof WebhooksSampleResponseSchema
>;

// ── categories.list ───────────────────────────────────────────────────────

const CategoriesListInputSchema = z.object({});

export type CategoriesListInput = z.input<typeof CategoriesListInputSchema>;

const FluxguardCategorySchema = z
	.object({
		id: z.string().describe('Category ID'),
		name: z.string().describe('Category name'),
		for: z
			.string()
			.nullish()
			.describe('site or page; Fluxguard stores the two separately'),
		created: timestamp.nullish().describe('When the category was created'),
		updated: timestamp.nullish(),
	})
	.loose();

export type FluxguardCategory = z.infer<typeof FluxguardCategorySchema>;

// Documented as keyed by category ID, and an empty account answers `{}`; the
// endpoint flattens it to an array so callers do not have to iterate a map.
const CategoriesListResponseSchema = z.object({
	categories: z.array(FluxguardCategorySchema),
});

export type CategoriesListResponse = z.infer<
	typeof CategoriesListResponseSchema
>;

// ── categories.create ─────────────────────────────────────────────────────

const CategoriesCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name for the new site category'),
});

export type CategoriesCreateInput = z.input<typeof CategoriesCreateInputSchema>;

const CategoriesCreateResponseSchema = z
	.object({
		id: z.string().describe('Category ID'),
		name: z.string(),
		created: timestamp.nullish().describe('When the category was created'),
	})
	.loose();

export type CategoriesCreateResponse = z.infer<
	typeof CategoriesCreateResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type FluxguardEndpointInputs = {
	accountGet: AccountGetInput;
	monitoringAddPage: MonitoringAddPageInput;
	monitoringStartCrawl: MonitoringStartCrawlInput;
	monitoringGetPage: MonitoringGetPageInput;
	monitoringDeletePage: MonitoringDeletePageInput;
	monitoringDeleteSite: MonitoringDeleteSiteInput;
	webhooksList: WebhooksListInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksDelete: WebhooksDeleteInput;
	webhooksSample: WebhooksSampleInput;
	categoriesList: CategoriesListInput;
	categoriesCreate: CategoriesCreateInput;
};

export type FluxguardEndpointOutputs = {
	accountGet: AccountGetResponse;
	monitoringAddPage: MonitoringAddPageResponse;
	monitoringStartCrawl: MonitoringStartCrawlResponse;
	monitoringGetPage: MonitoringGetPageResponse;
	monitoringDeletePage: MonitoringDeletePageResponse;
	monitoringDeleteSite: MonitoringDeleteSiteResponse;
	webhooksList: WebhooksListResponse;
	webhooksCreate: WebhooksCreateResponse;
	webhooksDelete: WebhooksDeleteResponse;
	webhooksSample: WebhooksSampleResponse;
	categoriesList: CategoriesListResponse;
	categoriesCreate: CategoriesCreateResponse;
};

export const FluxguardEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	monitoringAddPage: MonitoringAddPageInputSchema,
	monitoringStartCrawl: MonitoringStartCrawlInputSchema,
	monitoringGetPage: MonitoringGetPageInputSchema,
	monitoringDeletePage: MonitoringDeletePageInputSchema,
	monitoringDeleteSite: MonitoringDeleteSiteInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
	webhooksSample: WebhooksSampleInputSchema,
	categoriesList: CategoriesListInputSchema,
	categoriesCreate: CategoriesCreateInputSchema,
} as const;

export const FluxguardEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	monitoringAddPage: MonitoringAddPageResponseSchema,
	monitoringStartCrawl: MonitoringStartCrawlResponseSchema,
	monitoringGetPage: MonitoringGetPageResponseSchema,
	monitoringDeletePage: MonitoringDeletePageResponseSchema,
	monitoringDeleteSite: MonitoringDeleteSiteResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksCreate: WebhooksCreateResponseSchema,
	webhooksDelete: WebhooksDeleteResponseSchema,
	webhooksSample: WebhooksSampleResponseSchema,
	categoriesList: CategoriesListResponseSchema,
	categoriesCreate: CategoriesCreateResponseSchema,
} as const;
