import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/**
 * The envelope every write answers, as the docs document it. Reads answer
 * bare JSON.
 */
export const WriteResultSchema = z
	.object({
		success: z.boolean().describe('Whether the operation succeeded'),
		description: z
			.string()
			.nullish()
			.describe('Human-readable result description'),
		statusCode: z
			.number()
			.nullish()
			.describe('HTTP status code of the response'),
	})
	.loose()
	.describe('A Passcreator write result');
export type WriteResult = z.infer<typeof WriteResultSchema>;

/**
 * Personalised properties, keyed by property name or property ID, as the
 * create and update bodies take them.
 */
const PassPropertiesSchema = z
	// unknown: the property keys come from the pass template (names or IDs
	// like 5b3f2f9f66a228.52093670), so the record cannot be stricter.
	.record(z.string(), z.unknown())
	.describe(
		'Additional properties keyed by the template property name or property ID',
	);

/** A pass as the read endpoints answer it. */
export const PassSchema = z
	.object({
		passId: z.string().nullish().describe('Pass id'),
		identifier: z
			.string()
			.nullish()
			.describe('Pass identifier (UUID, barcode value or user-provided ID)'),
		uniqueIdentifier: z.string().nullish().describe('Pass UID'),
		barcodeValue: z.string().nullish().describe('Barcode value'),
		linkToPassPage: z
			.string()
			.nullish()
			.describe('Link to the pass page in the wallet app'),
		passTemplate: z.string().nullish().describe('Template name'),
		passTemplateGuid: z.string().nullish().describe('Template UID'),
		createdOn: z.string().nullish().describe('Creation timestamp'),
		voided: z.boolean().nullish().describe('Whether the pass is voided'),
	})
	.loose()
	.describe('A Passcreator pass');
export type Pass = z.infer<typeof PassSchema>;

// ── passes ─────────────────────────────────────────────────────────────────

export const CreatePassInputSchema = z
	.object({
		passtemplate: z
			.string()
			.min(1)
			.describe('Pass-template UID the pass is created from'),
		properties: PassPropertiesSchema.describe(
			'Additional properties keyed by property name or ID',
		),
	})
	.describe('Create a pass from a template (zapierStyle=true)');
export type CreatePassInput = z.infer<typeof CreatePassInputSchema>;

export const CreatePassOutputSchema = PassSchema.describe(
	'The pass as created (201)',
);
export type CreatePassOutput = z.infer<typeof CreatePassOutputSchema>;

export const ListPassesInputSchema = z
	.object({
		templateUid: z
			.string()
			.min(1)
			.describe('Pass-template UID to list passes of'),
		start: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Offset of the first pass to return'),
		pageSize: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Number of passes per page (max 100)'),
		lastIdOfPriorPage: z
			.string()
			.optional()
			.describe(
				'Identifier of the last pass of the prior page, for cursor paging',
			),
		lastCreatedOnOfPriorPage: z
			.string()
			.optional()
			.describe(
				'createdOn of the last pass of the prior page, for cursor paging',
			),
		createdSince: z
			.string()
			.optional()
			.describe('Only passes created after this date, e.g. "2021-07-01 15:30"'),
		modifiedSince: z
			.string()
			.optional()
			.describe(
				'Only passes modified after this date, e.g. "2021-07-01 15:30"',
			),
	})
	.describe('List the passes of a pass-template');
export type ListPassesInput = z.infer<typeof ListPassesInputSchema>;

export const ListPassesOutputSchema = z
	.object({
		query: z
			.object({
				start: z.number().nullish().describe('Offset of this page'),
				pageSize: z.number().nullish().describe('Page size'),
				self: z.string().nullish().describe('URL of this page'),
				next: z
					.string()
					.nullish()
					.describe('URL of the next page; missing on the last page'),
			})
			.loose()
			.nullish()
			.describe('The query and its paging links'),
		total: z.number().nullish().describe('Total passes matching the query'),
		results: z.array(PassSchema).describe('The passes on this page'),
	})
	.loose()
	.describe('A page of passes');

export type ListPassesOutput = z.infer<typeof ListPassesOutputSchema>;

export const GetPassInputSchema = z
	.object({
		passUid: z
			.string()
			.min(1)
			.describe('Pass UID, barcode value or user-provided ID'),
		includeFieldMapping: z
			.boolean()
			.optional()
			.describe('Include the field mapping of the pass'),
		appConfigurationId: z
			.string()
			.optional()
			.describe('Read the pass as a specific app configuration sees it'),
	})
	.describe('Read one pass');
export type GetPassInput = z.infer<typeof GetPassInputSchema>;

export const GetPassOutputSchema = PassSchema.describe('The pass');
export type GetPassOutput = z.infer<typeof GetPassOutputSchema>;

export const UpdatePassInputSchema = z
	.object({
		passUid: z
			.string()
			.min(1)
			.describe('Pass UID, barcode value or user-provided ID'),
		properties: PassPropertiesSchema.optional().describe(
			'Additional properties to update',
		),
		voided: z
			.boolean()
			.optional()
			.describe(
				'Mark the pass voided (true) or not voided (false), as the mark-voided section documents',
			),
	})
	.superRefine((input, ctx) => {
		const hasProperties =
			input.properties !== undefined &&
			Object.keys(input.properties).length > 0;
		if (!hasProperties && input.voided === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['properties'],
				message: 'Give properties or voided to update',
			});
		}
	})
	.describe('Update a pass (answers 204 with no body)');
export type UpdatePassInput = z.infer<typeof UpdatePassInputSchema>;

export const UpdatePassOutputSchema = z
	.object({
		passUid: z.string().describe('Updated pass UID'),
		success: z.boolean().describe('Whether the update succeeded'),
	})
	.describe('The pass was updated (the API answers 204 with no body)');
export type UpdatePassOutput = z.infer<typeof UpdatePassOutputSchema>;

export const DeletePassInputSchema = z
	.object({
		passUid: z
			.string()
			.min(1)
			.describe('Pass UID, barcode value or user-provided ID'),
	})
	.describe('Delete a pass');
export type DeletePassInput = z.infer<typeof DeletePassInputSchema>;

export const DeletePassOutputSchema = z
	.object({
		passUid: z.string().describe('The pass the call was for'),
		success: z.boolean().describe('Whether the call succeeded'),
	})
	.describe('The pass was deleted (the API answers 200 with no body)');

export type DeletePassOutput = z.infer<typeof DeletePassOutputSchema>;

export const SearchPassesInputSchema = z
	.object({
		templateUid: z.string().min(1).describe('Pass-template UID to search in'),
		searchTerm: z
			.string()
			.min(1)
			.describe('Search term matched against pass content'),
	})
	.describe('Search passes of a template by content');
export type SearchPassesInput = z.infer<typeof SearchPassesInputSchema>;

export const SearchPassesOutputSchema = z
	.array(PassSchema)
	.describe('The matching passes; an empty array means no match');
export type SearchPassesOutput = z.infer<typeof SearchPassesOutputSchema>;

export const GetPassUrisInputSchema = z
	.object({ passUid: z.string().min(1).describe('Pass UID') })
	.describe('Read the resource URIs of a pass');
export type GetPassUrisInput = z.infer<typeof GetPassUrisInputSchema>;

export const GetPassUrisOutputSchema = z
	.object({})
	.loose()
	.describe('URIs to the pass resources');
export type GetPassUrisOutput = z.infer<typeof GetPassUrisOutputSchema>;

export const GetPassStatisticsInputSchema = z
	.object({
		templateUid: z.string().min(1).describe('Pass-template UID'),
		timeFrame: z
			.enum(['day', 'week', 'month'])
			.optional()
			.describe('Statistics granularity'),
		day: z
			.string()
			.optional()
			.describe('The day to report, e.g. "today" or 2025-01-15'),
	})
	.describe('Read pass usage statistics of a template');
export type GetPassStatisticsInput = z.infer<
	typeof GetPassStatisticsInputSchema
>;

export const GetPassStatisticsOutputSchema = z
	.object({})
	.loose()
	.describe('Pass usage statistics for the timeframe');
export type GetPassStatisticsOutput = z.infer<
	typeof GetPassStatisticsOutputSchema
>;

export const GetActiveHistoryInputSchema = z
	.object({
		templateUid: z.string().min(1).describe('Pass-template UID'),
		day: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date in YYYY-MM-DD format')
			.optional()
			.describe(
				'First day of the history (YYYY-MM-DD); omit for the last seven days',
			),
	})
	.describe('Read the history of active and inactive passes of a template');
export type GetActiveHistoryInput = z.infer<typeof GetActiveHistoryInputSchema>;

export const GetActiveHistoryOutputSchema = z
	.array(
		z
			.object({
				date: z.string().describe('Day, YYYY-MM-DD'),
				active: z.number().nullish().describe('Active passes that day'),
				inactive: z.number().nullish().describe('Inactive passes that day'),
			})
			.loose(),
	)
	.describe('Active and inactive pass counts per day');

export type GetActiveHistoryOutput = z.infer<
	typeof GetActiveHistoryOutputSchema
>;

export const EnableDownloadInputSchema = z
	.object({ passUid: z.string().min(1).describe('Pass UID') })
	.describe('Enable the download of a pass (answers 204 with no body)');
export type EnableDownloadInput = z.infer<typeof EnableDownloadInputSchema>;

export const EnableDownloadOutputSchema = z
	.object({
		passUid: z.string().describe('Pass UID'),
		success: z.boolean().describe('Whether the enable succeeded'),
	})
	.describe('Download was enabled (the API answers 204 with no body)');
export type EnableDownloadOutput = z.infer<typeof EnableDownloadOutputSchema>;

export const PushNotificationInputSchema = z
	.object({
		passUid: z.string().min(1).describe('Pass UID'),
		message: z
			.string()
			.min(1)
			.describe(
				'Text pushed to the pass holder (sent as pushNotificationText); may use {Property} placeholders',
			),
	})
	.describe('Send a push notification to one pass holder');
export type PushNotificationInput = z.infer<typeof PushNotificationInputSchema>;

export const PushNotificationOutputSchema = z
	.object({
		passUid: z.string().describe('The pass the call was for'),
		success: z.boolean().describe('Whether the call succeeded'),
	})
	.describe('The notification was sent (the API answers 204 with no body)');

export type PushNotificationOutput = z.infer<
	typeof PushNotificationOutputSchema
>;

export const SendEmailInputSchema = z
	.object({
		passUid: z
			.string()
			.min(1)
			.describe('Pass UID, barcode value or user-provided ID'),
		email: z
			.string()
			.email()
			.describe('Email address the pass link is sent to'),
	})
	.describe('Send a pass to an email address');
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export const SendEmailOutputSchema = z
	.object({
		passUid: z.string().describe('The pass the call was for'),
		success: z.boolean().describe('Whether the call succeeded'),
	})
	.describe('The pass was sent by email');

export type SendEmailOutput = z.infer<typeof SendEmailOutputSchema>;

// ── templates ──────────────────────────────────────────────────────────────

export const TemplateSchema = z
	.object({
		identifier: z.string().min(1).describe('Template UID'),
		name: z.string().nullish().describe('Template name'),
	})
	.loose()
	.describe('A Passcreator pass template');
export type Template = z.infer<typeof TemplateSchema>;

export const ListTemplatesInputSchema = z
	.object({})
	.describe('Input for listing pass templates (none)');
export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

export const ListTemplatesOutputSchema = z
	.array(TemplateSchema)
	.describe('All pass templates of the account');
export type ListTemplatesOutput = z.infer<typeof ListTemplatesOutputSchema>;

export const GetTemplateFieldsInputSchema = z
	.object({ templateUid: z.string().min(1).describe('Template UID') })
	.describe('Read the field information of a pass template');
export type GetTemplateFieldsInput = z.infer<
	typeof GetTemplateFieldsInputSchema
>;

export const GetTemplateFieldsOutputSchema = z
	.array(
		z
			.object({
				id: z.string().nullish().describe('Field id'),
				name: z.string().nullish().describe('Field name'),
				type: z.string().nullish().describe('Field type'),
			})
			.loose(),
	)
	.describe('The template fields, as an array of field objects');

export type GetTemplateFieldsOutput = z.infer<
	typeof GetTemplateFieldsOutputSchema
>;

export const CopyTemplateInputSchema = z
	.object({
		templateUid: z.string().min(1).describe('Template UID to copy'),
		name: z.string().min(1).describe('Name of the copy'),
		description: z
			.string()
			.optional()
			.describe('Description of the copy; defaults to the original'),
		organizationName: z
			.string()
			.optional()
			.describe('Organization name of the copy; defaults to the original'),
	})
	.loose()
	.describe(
		'Copy a pass template; other optional fields (colors) pass through',
	);

export type CopyTemplateInput = z.infer<typeof CopyTemplateInputSchema>;

export const CopyTemplateOutputSchema = z
	.object({
		identifier: z.string().nullish().describe('UUID of the new template'),
	})
	.loose()
	.describe('The copied template (201)');

export type CopyTemplateOutput = z.infer<typeof CopyTemplateOutputSchema>;

export const DeleteTemplateInputSchema = z
	.object({ templateUid: z.string().min(1).describe('Template UID') })
	.describe(
		'Delete a pass template; the API refuses when scheduled tasks exist',
	);
export type DeleteTemplateInput = z.infer<typeof DeleteTemplateInputSchema>;

export const DeleteTemplateOutputSchema = z
	.object({
		templateUid: z.string().describe('Deleted template UID'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The template was deleted (the API answers 200 with no body)');

export type DeleteTemplateOutput = z.infer<typeof DeleteTemplateOutputSchema>;

// ── v2 move ────────────────────────────────────────────────────────────────

export const MovePassInputSchema = z
	.object({
		passUid: z
			.string()
			.min(1)
			.describe('Pass UID, barcode value or user-provided ID'),
		targetTemplateIdentifier: z
			.string()
			.min(1)
			.describe(
				'UID of the template the pass moves to (same project and signing certificate)',
			),
	})
	.describe('Move a pass to a different template of the same project (API v2)');
export type MovePassInput = z.infer<typeof MovePassInputSchema>;

export const MovePassOutputSchema =
	WriteResultSchema.describe('The move result');
export type MovePassOutput = z.infer<typeof MovePassOutputSchema>;

// ── webhooks ───────────────────────────────────────────────────────────────

export const WebhookSubscriptionSchema = z
	.object({
		subscription_url: z
			.string()
			.nullish()
			.describe('Subscription resource URL'),
		target_url: z
			.string()
			.nullish()
			.describe('Endpoint deliveries are posted to'),
		event: z.string().nullish().describe('Event the subscription delivers'),
		pass_template: z
			.string()
			.nullish()
			.describe('Template the subscription is scoped to'),
		pull_mode: z
			.boolean()
			.nullish()
			.describe('Whether the subscription is pull-mode'),
	})
	.loose()
	.describe('A Passcreator webhook subscription');
export type WebhookSubscription = z.infer<typeof WebhookSubscriptionSchema>;

export const SubscribeWebhookInputSchema = z
	.object({
		target_url: z
			.string()
			.url()
			.describe(
				"Endpoint deliveries are posted to; the plugin adds this account's corsair_token query parameter, which the webhook handler requires",
			),
		event: z
			.string()
			.min(1)
			.describe(
				'Event to subscribe to, e.g. pass_created, pass_updated, pass_voided, pushnotification_registered, pass_template_created, pass_template_updated, app_scan_created',
			),
		pass_template: z
			.string()
			.optional()
			.describe(
				'Scope the subscription to one pass-template UID (sent in the path)',
			),
		subscription_url: z
			.string()
			.optional()
			.describe('Optional URL that identifies this subscription'),
		retryEnabled: z.boolean().optional().describe('Retry failed deliveries'),
		signPayload: z
			.boolean()
			.default(true)
			.describe(
				'Sign deliveries (default true here: the receiver rejects unsigned ones)',
			),
	})
	.describe('Subscribe a URL to a webhook event');

export type SubscribeWebhookInput = z.infer<typeof SubscribeWebhookInputSchema>;

export const SubscribeWebhookOutputSchema = z
	.object({
		accessToken: z
			.string()
			.nullish()
			.describe('Only returned with generateAccessToken'),
	})
	.loose()
	.describe('The subscription was created (201, usually an empty object)');

export type SubscribeWebhookOutput = z.infer<
	typeof SubscribeWebhookOutputSchema
>;

export const UnsubscribeWebhookInputSchema = z
	.object({
		target_url: z
			.string()
			.url()
			.describe(
				'target_url the subscription was created with, including its corsair_token (as webhooks.list shows it)',
			),
	})
	.describe('Unsubscribe a webhook by its target URL');

export type UnsubscribeWebhookInput = z.infer<
	typeof UnsubscribeWebhookInputSchema
>;

export const UnsubscribeWebhookOutputSchema = z
	.object({
		success: z.boolean().describe('Whether the unsubscribe succeeded'),
	})
	.describe('The subscription was removed (the API answers 200 with {})');

export type UnsubscribeWebhookOutput = z.infer<
	typeof UnsubscribeWebhookOutputSchema
>;

export const ListWebhooksInputSchema = z
	.object({})
	.describe('Input for listing active webhook subscriptions (none)');
export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

export const ListWebhooksOutputSchema = z
	.array(WebhookSubscriptionSchema)
	.describe('All active webhook subscriptions, including pull-mode entries');
export type ListWebhooksOutput = z.infer<typeof ListWebhooksOutputSchema>;

export const GetPublicKeyInputSchema = z
	.object({})
	.describe('Input for reading the webhook signature public key (none)');
export type GetPublicKeyInput = z.infer<typeof GetPublicKeyInputSchema>;

export const GetPublicKeyOutputSchema = z
	.object({
		publicKey: z
			.string()
			.min(1)
			.describe(
				'PEM-encoded public key used to verify webhook payload signatures',
			),
	})
	.loose()
	.describe('The webhook signature public key');
export type GetPublicKeyOutput = z.infer<typeof GetPublicKeyOutputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PasscreatorEndpointInputSchemas = {
	passesCreate: CreatePassInputSchema,
	passesList: ListPassesInputSchema,
	passesGet: GetPassInputSchema,
	passesUpdate: UpdatePassInputSchema,
	passesDelete: DeletePassInputSchema,
	passesSearch: SearchPassesInputSchema,
	passesUris: GetPassUrisInputSchema,
	passesStatistics: GetPassStatisticsInputSchema,
	passesActiveHistory: GetActiveHistoryInputSchema,
	passesEnableDownload: EnableDownloadInputSchema,
	passesPushNotification: PushNotificationInputSchema,
	passesSendEmail: SendEmailInputSchema,
	templatesList: ListTemplatesInputSchema,
	templatesFields: GetTemplateFieldsInputSchema,
	templatesCopy: CopyTemplateInputSchema,
	templatesDelete: DeleteTemplateInputSchema,
	templatesMovePass: MovePassInputSchema,
	webhooksSubscribe: SubscribeWebhookInputSchema,
	webhooksUnsubscribe: UnsubscribeWebhookInputSchema,
	webhooksList: ListWebhooksInputSchema,
	webhooksGetPublicKey: GetPublicKeyInputSchema,
};

export const PasscreatorEndpointOutputSchemas = {
	passesCreate: CreatePassOutputSchema,
	passesList: ListPassesOutputSchema,
	passesGet: GetPassOutputSchema,
	passesUpdate: UpdatePassOutputSchema,
	passesDelete: DeletePassOutputSchema,
	passesSearch: SearchPassesOutputSchema,
	passesUris: GetPassUrisOutputSchema,
	passesStatistics: GetPassStatisticsOutputSchema,
	passesActiveHistory: GetActiveHistoryOutputSchema,
	passesEnableDownload: EnableDownloadOutputSchema,
	passesPushNotification: PushNotificationOutputSchema,
	passesSendEmail: SendEmailOutputSchema,
	templatesList: ListTemplatesOutputSchema,
	templatesFields: GetTemplateFieldsOutputSchema,
	templatesCopy: CopyTemplateOutputSchema,
	templatesDelete: DeleteTemplateOutputSchema,
	templatesMovePass: MovePassOutputSchema,
	webhooksSubscribe: SubscribeWebhookOutputSchema,
	webhooksUnsubscribe: UnsubscribeWebhookOutputSchema,
	webhooksList: ListWebhooksOutputSchema,
	webhooksGetPublicKey: GetPublicKeyOutputSchema,
};

export type PasscreatorEndpointInputs = {
	[K in keyof typeof PasscreatorEndpointInputSchemas]: z.input<
		(typeof PasscreatorEndpointInputSchemas)[K]
	>;
};

export type PasscreatorEndpointOutputs = {
	[K in keyof typeof PasscreatorEndpointOutputSchemas]: z.infer<
		(typeof PasscreatorEndpointOutputSchemas)[K]
	>;
};
