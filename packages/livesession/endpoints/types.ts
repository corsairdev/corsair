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

// The provider accepts an ISO 8601 date or datetime in addition to the
// relative values above. A regex keeps both accepted forms while still
// rejecting arbitrary strings.
const ISO_8601_PATTERN =
	/^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

const DateFilterSchema = z.union([
	RelativeDateStringSchema,
	z.string().refine((value) => ISO_8601_PATTERN.test(value), {
		message: 'must be an ISO 8601 date/datetime or a documented relative date',
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

// Provider responses may contain additional event fields, unlike strict inputs.
const AlertEventResponseSchema = AlertEventSchema.loose();

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
		country_code: z.string().optional(),
		city: z.string().optional(),
		region: z.string().optional(),
	})
	.loose();

const SessionVisitorParamsSchema = z
	.object({
		name: z.string().optional(),
		value: z.string().optional(),
	})
	.loose();

const SessionVisitorSchema = z
	.object({
		id: z.string().optional(),
		ip: z.string().optional(),
		geolocation: SessionVisitorGeolocationSchema.optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		email_hash: z.string().optional(),
		params: z.array(SessionVisitorParamsSchema).optional(),
		last_session_timestamp: z.number().int().optional(),
		first_session_timestamp: z.number().int().optional(),
	})
	.loose();

const SessionResolutionSchema = z
	.object({
		height: z.number().int().optional(),
		width: z.number().int().optional(),
		resolution: z.string().optional(),
	})
	.loose();

const SessionOsSchema = z
	.object({
		name: z.string().optional(),
		version: z.string().optional(),
	})
	.loose();

const SessionBrowserSchema = z
	.object({
		description: z.string().optional(),
		name: z.string().optional(),
		version: z.string().optional(),
	})
	.loose();

const SessionUtmSchema = z
	.object({
		source: z.string().optional(),
		medium: z.string().optional(),
		campaign: z.string().optional(),
		term: z.string().optional(),
		content: z.string().optional(),
	})
	.loose();

const SessionPageViewsStatisticsSchema = z
	.object({
		count: z.number().int().optional(),
	})
	.loose();

const SessionEventsStatisticsSchema = z
	.object({
		clicks: z.number().int().optional(),
		error_clicks: z.number().int().optional(),
		rage_clicks: z.number().int().optional(),
		error_logs: z.number().int().optional(),
		net_errors: z.number().int().optional(),
	})
	.loose();

export const SessionSchema = z
	.object({
		id: z.string(),
		website_id: z.string().optional(),
		session_url: z.string().optional(),
		creation_timestamp: z.number().int().optional(),
		duration: z.number().int().optional(),
		end_timestamp: z.number().int().optional(),
		active_time: z.number().int().optional(),
		end_url: z.string().optional(),
		expiration_timestamp: z.number().int().optional(),
		last_event_timestamp: z.number().int().optional(),
		product: z.string().optional(),
		device: z.string().optional(),
		tags: z.array(z.string()).optional(),
		last_seen_page_view_id: z.string().optional(),
		seen: z.boolean().optional(),
		referrer: z.string().optional(),
		start_url: z.string().optional(),
		visitor_first_session: z.boolean().optional(),
		// The provider spells this field without the second "e".
		engagment_score: z.number().optional(),
		visitor: SessionVisitorSchema.optional(),
		resolution: SessionResolutionSchema.optional(),
		os: SessionOsSchema.optional(),
		browser: SessionBrowserSchema.optional(),
		utm: SessionUtmSchema.optional(),
		page_views_statistics: SessionPageViewsStatisticsSchema.optional(),
		events_statistics: SessionEventsStatisticsSchema.optional(),
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
		sessions: z.array(SessionSchema),
	})
	.loose();

export const AlertSchema = z
	.object({
		alert_id: z.string(),
		name: z.string().optional(),
		events: z.array(AlertEventResponseSchema).optional(),
		provider: AlertProviderSchema.optional(),
		slack_channel_id: z.string().optional(),
		webhook_id: z.string().optional(),
		enabled: z.boolean().optional(),
		creation_date: z.string().optional(),
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
		url: z.string().optional(),
		website: z.string().optional(),
		website_id: z.string().optional(),
		version: z.string().optional(),
		enabled: z.boolean().optional(),
		created_date: z.number().int().optional(),
		created_by: z.string().optional(),
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
		host: z.string().optional(),
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
