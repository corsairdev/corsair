import { z } from 'zod';

/**
 * Schemas follow the LiveSession REST API reference.
 * https://livesession.dev/docs/api/rest
 */

const RelativeDateStringSchema = z.enum([
	'TODAY',
	'YESTERDAY',
	'BEGINNING_OF_WEEK',
	'BEGINNING_OF_MONTH',
	'BEGINNING_OF_PREV_MONTH',
	'TODAY-7DAYS',
	'TODAY-30DAYS',
]);

// The provider accepts an ISO 8601 datetime in addition to the relative values
// above. A date without a time is silently ignored by LiveSession (live run
// 11-15: date_from=2020-01-01&date_to=2020-01-02 returned today's session), so
// the time part is required.
const ISO_8601_PATTERN =
	/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,9})?)?(?:Z|[+-](\d{2}):?(\d{2}))?$/;

// Impossible values (Feb 30, hour 24, offset +99:99) are ignored by LiveSession
// the same way, with no 400 (live run 11-15), so the ranges are checked here.
function isIsoDateTime(value: string): boolean {
	const m = ISO_8601_PATTERN.exec(value);
	if (!m) return false;
	const [year, month, day, hour, minute, second, offH, offM] = m
		.slice(1)
		.map((part) => (part === undefined ? 0 : Number(part)));
	const daysInMonth = new Date(Date.UTC(year!, month!, 0)).getUTCDate();
	return (
		month! >= 1 &&
		month! <= 12 &&
		day! >= 1 &&
		day! <= daysInMonth &&
		hour! <= 23 &&
		minute! <= 59 &&
		second! <= 59 &&
		offH! <= 14 &&
		offM! <= 59
	);
}

const DateFilterSchema = z.union([
	RelativeDateStringSchema,
	z.string().refine(isIsoDateTime, {
		message:
			'must be an ISO 8601 datetime (e.g. 2026-01-31T00:00:00Z) or a documented relative date',
	}),
]);

// Reject values that could escape or reshape the request path before any
// encoding happens.
const PathIdSchema = z
	.string()
	.min(1)
	.refine(
		(value) =>
			value.trim() === value &&
			value !== '.' &&
			value !== '..' &&
			!/[/\\'"]/.test(value),
		{
			message:
				'id must not be empty, contain whitespace at either end, contain path separators or quotes, or be "." or ".."',
		},
	);

export const ListSessionsInputSchema = z
	.object({
		page: z.number().int().min(0).max(10000).optional(),
		size: z.number().int().min(1).max(100).optional(),
		email: z.string().min(1).optional(),
		visitor_id: z.string().min(1).optional(),
		tz: z.string().min(1).optional(),
		date_from: DateFilterSchema.optional(),
		date_to: DateFilterSchema.optional(),
	})
	.strict();

export const AlertEventKindSchema = z.union([
	z.literal(5), // MouseClick
	z.literal(6), // MouseDoubleClick
	z.literal(20), // ErrorClick
	z.literal(21), // RageClick
	z.literal(24), // Log
	z.literal(25), // Error
	z.literal(26), // Custom
	z.literal(29), // NetLog
	z.literal(30), // NetError
]);

export const AlertProviderSchema = z.enum(['slack', 'webhooks']);

export const AlertEventSchema = z
	.object({
		kind: AlertEventKindSchema,
		value: z.string(),
	})
	.strict();

// Responses stay open: LiveSession can add event kinds and fields, and a new
// kind on one alert must not fail the whole alerts.list call. Inputs stay strict.
const AlertEventResponseSchema = z
	.object({
		kind: z.number(),
		value: z.string().nullish(),
	})
	.loose();

export const CreateAlertInputSchema = z
	.object({
		name: z.string().min(1),
		events: z.array(AlertEventSchema).min(1),
		provider: AlertProviderSchema,
		slack_channel_id: z.string().min(1).optional(),
		webhook_id: z.string().min(1).optional(),
	})
	.strict()
	.superRefine((value, ctx) => {
		if (value.provider === 'slack' && !value.slack_channel_id) {
			ctx.addIssue({
				code: 'custom',
				path: ['slack_channel_id'],
				message: 'slack_channel_id is required when provider is "slack"',
			});
		}
		if (value.provider === 'webhooks' && !value.webhook_id) {
			ctx.addIssue({
				code: 'custom',
				path: ['webhook_id'],
				message: 'webhook_id is required when provider is "webhooks"',
			});
		}
	});

export const UpdateAlertInputSchema = z
	.object({
		id: PathIdSchema,
		name: z.string().min(1).optional(),
		events: z.array(AlertEventSchema).min(1).optional(),
		provider: AlertProviderSchema.optional(),
		slack_channel_id: z.string().min(1).optional(),
		webhook_id: z.string().min(1).optional(),
	})
	.strict();

export const DeleteAlertInputSchema = z.object({ id: PathIdSchema }).strict();

export const ListAlertsInputSchema = z.object({}).strict();

export const CreateWebhookInputSchema = z
	.object({
		url: z.string().url(),
		website_id: z.string().min(1),
		version: z.string().min(1),
	})
	.strict();

export const UpdateWebhookInputSchema = z
	.object({
		id: PathIdSchema,
		url: z.string().url(),
		website_id: z.string().min(1),
		// The documented update route requires `version=v1.0` as a query
		// parameter as well as in the body.
		version: z.literal('v1.0'),
	})
	.strict();

export const DeleteWebhookInputSchema = z.object({ id: PathIdSchema }).strict();

export const ListWebhooksInputSchema = z.object({}).strict();

export const CreateWebsiteInputSchema = z
	.object({
		host: z.string().min(1),
		description: z.string().optional(),
	})
	.strict();

export const ListWebsitesInputSchema = z.object({}).strict();

const SessionVisitorGeolocationSchema = z
	.object({
		country_code: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
	})
	.loose();

const SessionVisitorParamsSchema = z
	.object({
		name: z.string().nullish(),
		value: z.string().nullish(),
	})
	.loose();

const SessionVisitorSchema = z
	.object({
		id: z.string().nullish(),
		ip: z.string().nullish(),
		geolocation: SessionVisitorGeolocationSchema.nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		email_hash: z.string().nullish(),
		params: z.array(SessionVisitorParamsSchema).nullish(),
		last_session_timestamp: z.number().int().nullish(),
		first_session_timestamp: z.number().int().nullish(),
	})
	.loose();

const SessionResolutionSchema = z
	.object({
		height: z.number().int().nullish(),
		width: z.number().int().nullish(),
		resolution: z.string().nullish(),
	})
	.loose();

const SessionOsSchema = z
	.object({
		name: z.string().nullish(),
		version: z.string().nullish(),
	})
	.loose();

const SessionBrowserSchema = z
	.object({
		description: z.string().nullish(),
		name: z.string().nullish(),
		version: z.string().nullish(),
	})
	.loose();

const SessionUtmSchema = z
	.object({
		source: z.string().nullish(),
		medium: z.string().nullish(),
		campaign: z.string().nullish(),
		term: z.string().nullish(),
		content: z.string().nullish(),
	})
	.loose();

const SessionPageViewsStatisticsSchema = z
	.object({
		count: z.number().int().nullish(),
	})
	.loose();

const SessionEventsStatisticsSchema = z
	.object({
		clicks: z.number().int().nullish(),
		error_clicks: z.number().int().nullish(),
		rage_clicks: z.number().int().nullish(),
		error_logs: z.number().int().nullish(),
		net_errors: z.number().int().nullish(),
	})
	.loose();

// Responses use nullish fields: LiveSession sends null for empty values (live
// run 11-15: "tags": null on a new session). Inputs stay strict.
export const SessionSchema = z
	.object({
		id: z.string(),
		website_id: z.string().nullish(),
		session_url: z.string().nullish(),
		creation_timestamp: z.number().int().nullish(),
		duration: z.number().int().nullish(),
		end_timestamp: z.number().int().nullish(),
		active_time: z.number().int().nullish(),
		end_url: z.string().nullish(),
		expiration_timestamp: z.number().int().nullish(),
		last_event_timestamp: z.number().int().nullish(),
		product: z.string().nullish(),
		device: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		last_seen_page_view_id: z.string().nullish(),
		seen: z.boolean().nullish(),
		referrer: z.string().nullish(),
		start_url: z.string().nullish(),
		visitor_first_session: z.boolean().nullish(),
		// The provider spells this field without the second "e".
		engagment_score: z.number().nullish(),
		visitor: SessionVisitorSchema.nullish(),
		resolution: SessionResolutionSchema.nullish(),
		os: SessionOsSchema.nullish(),
		browser: SessionBrowserSchema.nullish(),
		utm: SessionUtmSchema.nullish(),
		page_views_statistics: SessionPageViewsStatisticsSchema.nullish(),
		events_statistics: SessionEventsStatisticsSchema.nullish(),
	})
	.loose();

export const PaginationSchema = z
	.object({
		num: z.number().int(),
		size: z.number().int(),
	})
	.loose();

export const ListSessionsResponseSchema = z
	.object({
		total: z.number().int(),
		page: PaginationSchema,
		// Live run 11-15: some empty results (an email filter with no match, a
		// new account) come back as `"sessions": null`, not `[]`.
		sessions: z.array(SessionSchema).nullable(),
	})
	.loose();

export const AlertSchema = z
	.object({
		alert_id: z.string(),
		name: z.string().nullish(),
		events: z.array(AlertEventResponseSchema).nullish(),
		// Documented values are "slack" and "webhooks"; kept open for new providers.
		provider: z.string().nullish(),
		slack_channel_id: z.string().nullish(),
		webhook_id: z.string().nullish(),
		enabled: z.boolean().nullish(),
		creation_date: z.string().nullish(),
	})
	.loose();

export const ListAlertsResponseSchema = z.array(AlertSchema);

export const DeleteAlertResponseSchema = z
	.object({
		alert_id: z.string(),
		deleted: z.boolean(),
	})
	.loose();

export const WebhookSchema = z
	.object({
		webhook_id: z.string(),
		url: z.string().nullish(),
		website: z.string().nullish(),
		website_id: z.string().nullish(),
		version: z.string().nullish(),
		enabled: z.boolean().nullish(),
		created_date: z.number().int().nullish(),
		created_by: z.string().nullish(),
	})
	.loose();

export const ListWebhooksResponseSchema = z.array(WebhookSchema);

export const DeleteWebhookResponseSchema = z
	.object({
		webhook_id: z.string(),
		deleted: z.boolean(),
	})
	.loose();

export const WebsiteSchema = z
	.object({
		website_id: z.string(),
		host: z.string().nullish(),
	})
	.loose();

export const ListWebsitesResponseSchema = z.array(WebsiteSchema);

export type LiveSessionListSessionsInput = z.infer<
	typeof ListSessionsInputSchema
>;
export type LiveSessionListSessionsResponse = z.infer<
	typeof ListSessionsResponseSchema
>;
export type LiveSessionListAlertsInput = z.infer<typeof ListAlertsInputSchema>;
export type LiveSessionListAlertsResponse = z.infer<
	typeof ListAlertsResponseSchema
>;
export type LiveSessionCreateAlertInput = z.infer<
	typeof CreateAlertInputSchema
>;
export type LiveSessionCreateAlertResponse = z.infer<typeof AlertSchema>;
export type LiveSessionUpdateAlertInput = z.infer<
	typeof UpdateAlertInputSchema
>;
export type LiveSessionUpdateAlertResponse = z.infer<typeof AlertSchema>;
export type LiveSessionDeleteAlertInput = z.infer<
	typeof DeleteAlertInputSchema
>;
export type LiveSessionDeleteAlertResponse = z.infer<
	typeof DeleteAlertResponseSchema
>;
export type LiveSessionListWebhooksInput = z.infer<
	typeof ListWebhooksInputSchema
>;
export type LiveSessionListWebhooksResponse = z.infer<
	typeof ListWebhooksResponseSchema
>;
export type LiveSessionCreateWebhookInput = z.infer<
	typeof CreateWebhookInputSchema
>;
export type LiveSessionCreateWebhookResponse = z.infer<typeof WebhookSchema>;
export type LiveSessionUpdateWebhookInput = z.infer<
	typeof UpdateWebhookInputSchema
>;
export type LiveSessionUpdateWebhookResponse = z.infer<typeof WebhookSchema>;
export type LiveSessionDeleteWebhookInput = z.infer<
	typeof DeleteWebhookInputSchema
>;
export type LiveSessionDeleteWebhookResponse = z.infer<
	typeof DeleteWebhookResponseSchema
>;
export type LiveSessionListWebsitesInput = z.infer<
	typeof ListWebsitesInputSchema
>;
export type LiveSessionListWebsitesResponse = z.infer<
	typeof ListWebsitesResponseSchema
>;
export type LiveSessionCreateWebsiteInput = z.infer<
	typeof CreateWebsiteInputSchema
>;
export type LiveSessionCreateWebsiteResponse = z.infer<typeof WebsiteSchema>;

export type LiveSessionEndpointInputs = {
	sessionsList: LiveSessionListSessionsInput;
	alertsList: LiveSessionListAlertsInput;
	alertsCreate: LiveSessionCreateAlertInput;
	alertsUpdate: LiveSessionUpdateAlertInput;
	alertsDelete: LiveSessionDeleteAlertInput;
	webhooksList: LiveSessionListWebhooksInput;
	webhooksCreate: LiveSessionCreateWebhookInput;
	webhooksUpdate: LiveSessionUpdateWebhookInput;
	webhooksDelete: LiveSessionDeleteWebhookInput;
	websitesList: LiveSessionListWebsitesInput;
	websitesCreate: LiveSessionCreateWebsiteInput;
};

export type LiveSessionEndpointOutputs = {
	sessionsList: LiveSessionListSessionsResponse;
	alertsList: LiveSessionListAlertsResponse;
	alertsCreate: LiveSessionCreateAlertResponse;
	alertsUpdate: LiveSessionUpdateAlertResponse;
	alertsDelete: LiveSessionDeleteAlertResponse;
	webhooksList: LiveSessionListWebhooksResponse;
	webhooksCreate: LiveSessionCreateWebhookResponse;
	webhooksUpdate: LiveSessionUpdateWebhookResponse;
	webhooksDelete: LiveSessionDeleteWebhookResponse;
	websitesList: LiveSessionListWebsitesResponse;
	websitesCreate: LiveSessionCreateWebsiteResponse;
};

export const LiveSessionEndpointInputSchemas = {
	sessionsList: ListSessionsInputSchema,
	alertsList: ListAlertsInputSchema,
	alertsCreate: CreateAlertInputSchema,
	alertsUpdate: UpdateAlertInputSchema,
	alertsDelete: DeleteAlertInputSchema,
	webhooksList: ListWebhooksInputSchema,
	webhooksCreate: CreateWebhookInputSchema,
	webhooksUpdate: UpdateWebhookInputSchema,
	webhooksDelete: DeleteWebhookInputSchema,
	websitesList: ListWebsitesInputSchema,
	websitesCreate: CreateWebsiteInputSchema,
} as const;

export const LiveSessionEndpointOutputSchemas = {
	sessionsList: ListSessionsResponseSchema,
	alertsList: ListAlertsResponseSchema,
	alertsCreate: AlertSchema,
	alertsUpdate: AlertSchema,
	alertsDelete: DeleteAlertResponseSchema,
	webhooksList: ListWebhooksResponseSchema,
	webhooksCreate: WebhookSchema,
	webhooksUpdate: WebhookSchema,
	webhooksDelete: DeleteWebhookResponseSchema,
	websitesList: ListWebsitesResponseSchema,
	websitesCreate: WebsiteSchema,
} as const;
