import { z } from 'zod';

// Inputs use WATI's own parameter names. Outputs are `.loose()` and their
// documented fields nullish.
// Reference: https://docs.wati.io/llms.txt and the V3 contract pages it links.
//
// V3 puts no tenant in the path: the token identifies the workspace, and the
// host identifies the region. Pagination is `page_number` (1-based) plus
// `page_size`, capped at 100.

/**
 * WATI requires both paging fields on every list route, and a request without them
 * can be refused, so they carry documented defaults rather than being optional.
 */
const PageSchema = {
	page_number: z
		.number()
		.int()
		.min(1)
		.default(1)
		.describe('The page to return, 1-based. Defaults to 1.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.default(20)
		.describe('Items per page, up to 100. Defaults to 20.'),
};

/** The paging fields a list response echoes back. */
const PageFieldsSchema = {
	page_number: z.number().nullish(),
	page_size: z.number().nullish(),
	total: z.number().nullish(),
	total_pages: z.number().nullish(),
};

// ── contacts ──────────────────────────────────────────────────────────────

/**
 * A custom attribute on a contact, sent as a name/value pair rather than a map
 * — WATI's choice, not the plugin's.
 */
const CustomParamSchema = z
	.object({
		name: z.string().min(1),
		value: z.string(),
	})
	.loose();

const ContactSchema = z
	.object({
		id: z.string().nullish(),
		wa_id: z.string().nullish().describe('The WhatsApp identifier.'),
		name: z.string().nullish(),
		phone: z.string().nullish(),
		photo: z.string().nullish(),
		created: z.string().nullish(),
		last_updated: z.string().nullish(),
		contact_status: z.string().nullish(),
		source: z
			.string()
			.nullish()
			.describe('Where the contact came from, e.g. manual.'),
		channel_id: z.string().nullish(),
		opted_in: z.boolean().nullish(),
		allow_broadcast: z.boolean().nullish(),
		allow_sms: z.boolean().nullish(),
		teams: z.array(z.string()).nullish(),
		custom_params: z.array(CustomParamSchema).nullish(),
	})
	.loose();

export type WatiContact = z.infer<typeof ContactSchema>;

const ContactsCreateInputSchema = z.object({
	whatsapp_number: z
		.string()
		.min(1)
		.describe('The number in international form, without a leading +.'),
	name: z.string().min(1),
	custom_params: z
		.array(CustomParamSchema)
		.min(1)
		.optional()
		.describe('Custom attributes, as name/value pairs.'),
});

export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

const ContactsGetInputSchema = z.object({
	target: z
		.string()
		.min(1)
		.describe('The contact wa_id or phone number. A leading + is allowed.'),
});

export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

// One contact looks like a row of the contact list, so the same model is used;
// an empty object exposed nothing and made the generated docs read "empty object".
const ContactResponseSchema = ContactSchema;

export type ContactResponse = z.infer<typeof ContactResponseSchema>;

const ContactsListInputSchema = z.object({ ...PageSchema });

export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = z
	.object({
		contact_list: z.array(ContactSchema).nullish(),
		...PageFieldsSchema,
	})
	.loose();

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const ContactsCountInputSchema = z.object({});

export type ContactsCountInput = z.infer<typeof ContactsCountInputSchema>;

const ContactsCountResponseSchema = z
	.object({
		contact_count: z.number().nullish().describe('The number of contacts.'),
	})
	.loose();

export type ContactsCountResponse = z.infer<typeof ContactsCountResponseSchema>;

const ContactsDeleteInputSchema = z.object({
	target: z.string().min(1),
});

export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;

/** A delete answers a flag, which the plugin states plainly. */
const DeleteResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		/** The deleted webhook's id. */
		id: z.string().nullish(),
		/** The deleted contact's id (snake_case live, camelCase in the reference). */
		contact_id: z.string().nullish(),
		deleted: z.boolean().nullish(),
		cleanup_completed: z.boolean().nullish(),
	})
	.loose();

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

// ── conversations ─────────────────────────────────────────────────────────

const ConversationSchema = z
	.object({
		id: z.string().nullish(),
		conversation_id: z.string().nullish(),
		contact_id: z.string().nullish(),
		wa_id: z.string().nullish(),
		contact_name: z.string().nullish(),
		started_date: z.string().nullish(),
		last_updated: z.string().nullish(),
		phone: z.string().nullish(),
		channel_id: z.string().nullish(),
		channel_type: z.string().nullish(),
		last_message: z.string().nullish(),
		last_message_timestamp: z.string().nullish(),
		unread_count: z.number().nullish(),
		status: z.string().nullish(),
		assigned_operator: z.string().nullish(),
		assigned_team: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

export type WatiConversation = z.infer<typeof ConversationSchema>;

const ConversationsListInputSchema = z.object({
	...PageSchema,
	channel_type: z
		.string()
		.optional()
		.describe('Filter by channel type, case-insensitive, such as whatsapp.'),
	channel_id: z.string().optional().describe('Filter by connected channel ID.'),
});

export type ConversationsListInput = z.infer<
	typeof ConversationsListInputSchema
>;

const ConversationsListResponseSchema = z
	.object({
		conversation_list: z.array(ConversationSchema).nullish(),
		...PageFieldsSchema,
	})
	.loose();

export type ConversationsListResponse = z.infer<
	typeof ConversationsListResponseSchema
>;

/**
 * A message in a conversation, which is one event of the thread: it may be
 * inbound, outbound, a template or a system note, and `message_type` says which.
 */
const MessageSchema = z
	.object({
		id: z.string().nullish(),
		message_id: z.string().nullish(),
		conversation_id: z.string().nullish(),
		wa_id: z.string().nullish(),
		message_type: z.string().nullish(),
		/** The message kind, e.g. text, image or template. */
		type: z.string().nullish(),
		/** message, or a system event such as an assignment. */
		event_type: z.string().nullish(),
		ticket_id: z.string().nullish(),
		/** True when the workspace sent it. */
		owner: z.boolean().nullish(),
		operator_name: z.string().nullish(),
		local_message_id: z.string().nullish(),
		failed_detail: z.string().nullish(),
		text: z.string().nullish(),
		content: z.unknown().nullish(),
		status: z.string().nullish(),
		timestamp: z.string().nullish(),
		created: z.string().nullish(),
		from_me: z.boolean().nullish(),
		operator: z.string().nullish(),
		template_name: z.string().nullish(),
		media_url: z.string().nullish(),
	})
	.loose();

export type WatiMessage = z.infer<typeof MessageSchema>;

const ConversationsMessagesInputSchema = z.object({
	target: z
		.string()
		.min(1)
		.describe(
			'The conversation target: a contact wa_id, a phone number, or a conversation ID. Do not pass a bare contact ID, which is a different value.',
		),
	...PageSchema,
});

export type ConversationsMessagesInput = z.infer<
	typeof ConversationsMessagesInputSchema
>;

const ConversationsMessagesResponseSchema = z
	.object({
		message_list: z.array(MessageSchema).nullish(),
		...PageFieldsSchema,
	})
	.loose();

export type ConversationsMessagesResponse = z.infer<
	typeof ConversationsMessagesResponseSchema
>;

// ── sending ───────────────────────────────────────────────────────────────

/**
 * A text message to an open conversation. WATI rejects this outside the 24-hour
 * service window, which is why a template send exists at all.
 */
const MessagesSendTextInputSchema = z.object({
	target: z.string().min(1).describe('The contact wa_id or phone number.'),
	text: z.string().min(1),
});

export type MessagesSendTextInput = z.infer<typeof MessagesSendTextInputSchema>;

/**
 * A template send, which works outside the service window. `parameters` binds
 * the template's `{{1}}`-style placeholders in order, and `broadcast_name` is
 * what makes it a campaign rather than a one-off.
 */
const MessagesSendTemplateInputSchema = z.object({
	whatsapp_number: z
		.string()
		.min(1)
		.describe('The recipient number, without a leading +.'),
	template_name: z.string().min(1),
	broadcast_name: z
		.string()
		.min(1)
		.describe(
			'Groups the send as a campaign under this name. Required by WATI even for a single recipient.',
		),
	parameters: z
		.array(
			z
				.object({
					name: z.string().min(1).describe('The placeholder, e.g. `1`.'),
					value: z.string(),
				})
				.loose(),
		)
		.min(1)
		.optional()
		.describe('The values bound to the template placeholders, in order.'),
	local_message_id: z
		.string()
		.optional()
		.describe('Your own id, which WATI echoes back for correlation.'),
});
// No cross-field rule: `parameters` is omitted for a template with no
// placeholders, which is a valid send, and `broadcast_name` is always required.

export type MessagesSendTemplateInput = z.infer<
	typeof MessagesSendTemplateInputSchema
>;

/**
 * A text or file send answers `{ message: {...} }`: the message WATI queued,
 * with its id and status. `message` is an object, not a status string.
 */
const SendResponseSchema = z
	.object({
		message: MessageSchema.nullish(),
	})
	.loose();

export type SendResponse = z.infer<typeof SendResponseSchema>;

/**
 * A template send answers with the campaign it created and one row per
 * recipient. HTTP 200 can still carry `success: false` with `error`, and a
 * recipient row can carry its own `errors`, so both need checking.
 */
const TemplateSendResponseSchema = z
	.object({
		success: z.boolean().nullish(),
		broadcast_id: z.string().nullish(),
		error: z.string().nullish(),
		recipients: z
			.array(
				z
					.object({
						local_message_id: z.string().nullish(),
						phone_number: z.string().nullish(),
						target: z.string().nullish(),
						errors: z.array(z.string()).nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type TemplateSendResponse = z.infer<typeof TemplateSendResponseSchema>;

/**
 * A file message from a public URL. The V3 route takes no file name: WATI
 * reads it from the URL.
 */
const MessagesSendFileInputSchema = z.object({
	target: z.string().min(1),
	url: z.string().min(1).describe('A publicly reachable media URL.'),
	caption: z.string().optional(),
});

export type MessagesSendFileInput = z.infer<typeof MessagesSendFileInputSchema>;

// ── templates ─────────────────────────────────────────────────────────────

const TemplateSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		language: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe('APPROVED, PENDING, REJECTED and so on.'),
		category: z.string().nullish(),
		/** The template body with its `{{1}}`-style placeholders. */
		body: z.string().nullish(),
		/** The placeholders the template takes, as name/value pairs. */
		custom_params: z.array(CustomParamSchema).nullish(),
		language_option: z
			.object({
				key: z.string().nullish(),
				value: z.string().nullish(),
				text: z.string().nullish(),
			})
			.loose()
			.nullish(),
		last_modified: z.string().nullish(),
		// unknown: older template shapes; the V3 list does not document this.
		components: z.array(z.unknown()).nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type WatiTemplate = z.infer<typeof TemplateSchema>;

const TemplatesListInputSchema = z.object({
	...PageSchema,
	channel: z
		.string()
		.min(1)
		.optional()
		.describe('Only templates on this sending channel.'),
});

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

const TemplatesListResponseSchema = z
	.object({
		/** Where V3 puts the list. */
		templates: z.array(TemplateSchema).nullish(),
		messageTemplates: z.array(TemplateSchema).nullish(),
		message_templates: z.array(TemplateSchema).nullish(),
		...PageFieldsSchema,
	})
	.loose();

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

const TemplatesGetInputSchema = z.object({ template_id: z.string().min(1) });

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

const TemplateResponseSchema = TemplateSchema;

export type TemplateResponse = z.infer<typeof TemplateResponseSchema>;

// ── channels and account ──────────────────────────────────────────────────

const ChannelSchema = z
	.object({
		id: z.string().nullish(),
		channel_id: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		/** The channel kind as WATI names it, e.g. WhatsApp or Instagram. */
		channel: z.string().nullish(),
		status: z.string().nullish(),
		phone_number: z.string().nullish(),
	})
	.loose();

export type WatiChannel = z.infer<typeof ChannelSchema>;

const ChannelsListInputSchema = z.object({ ...PageSchema });

export type ChannelsListInput = z.infer<typeof ChannelsListInputSchema>;

const ChannelsListResponseSchema = z
	.object({
		channels: z.array(ChannelSchema).nullish(),
	})
	.loose();

export type ChannelsListResponse = z.infer<typeof ChannelsListResponseSchema>;

const CreditsInputSchema = z.object({});

export type CreditsInput = z.infer<typeof CreditsInputSchema>;

const CreditsResponseSchema = z
	.object({
		credit: z.number().nullish().describe('The credit balance.'),
		// The live API answers these in snake_case; the reference shows camelCase.
		welcome_credit: z.number().nullish(),
		remaining_free_conversations_count: z.number().nullish(),
		currency: z.string().nullish(),
		auto_charge_enabled: z.boolean().nullish(),
	})
	.loose();

export type CreditsResponse = z.infer<typeof CreditsResponseSchema>;

// ── broadcasts ────────────────────────────────────────────────────────────

const BroadcastSchema = z
	.object({
		id: z.string().nullish(),
		broadcast_id: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		template_name: z.string().nullish(),
		template_id: z.string().nullish(),
		channel_id: z.string().nullish(),
		created: z.string().nullish(),
		last_updated: z.string().nullish(),
		scheduled: z.string().nullish(),
		scheduled_at: z.string().nullish(),
		/** Delivery counts, on the single-campaign read. */
		statistics: z.record(z.string(), z.number().nullish()).nullish(),
		sent: z.number().nullish(),
		delivered: z.number().nullish(),
		read: z.number().nullish(),
		failed: z.number().nullish(),
	})
	.loose();

export type WatiBroadcast = z.infer<typeof BroadcastSchema>;

const BroadcastsListInputSchema = z.object({
	...PageSchema,
	// The live API refuses the list without both dates, though the reference
	// does not mark them.
	date_from: z
		.string()
		.min(1)
		.describe('Campaigns created from this date, e.g. 2026-11-01.'),
	date_to: z
		.string()
		.min(1)
		.describe('Campaigns created up to this date, e.g. 2026-11-30.'),
	channel: z
		.string()
		.min(1)
		.optional()
		.describe('Only campaigns sent from this channel.'),
});

export type BroadcastsListInput = z.infer<typeof BroadcastsListInputSchema>;

const BroadcastsListResponseSchema = z
	.object({
		broadcasts: z.array(BroadcastSchema).nullish(),
		broadcast_list: z.array(BroadcastSchema).nullish(),
		...PageFieldsSchema,
	})
	.loose();

export type BroadcastsListResponse = z.infer<
	typeof BroadcastsListResponseSchema
>;

const BroadcastsGetInputSchema = z.object({ broadcast_id: z.string().min(1) });

export type BroadcastsGetInput = z.infer<typeof BroadcastsGetInputSchema>;

const BroadcastResponseSchema = BroadcastSchema;

export type BroadcastResponse = z.infer<typeof BroadcastResponseSchema>;

const BroadcastsRecipientsInputSchema = z.object({
	broadcast_id: z.string().min(1),
	...PageSchema,
});

export type BroadcastsRecipientsInput = z.infer<
	typeof BroadcastsRecipientsInputSchema
>;

const BroadcastRecipientSchema = z
	.object({
		id: z.string().nullish(),
		contact_id: z.string().nullish(),
		contact_name: z.string().nullish(),
		contact_phone: z.string().nullish(),
		failed_code: z.string().nullish(),
		message_id: z.string().nullish(),
		local_message_id: z.string().nullish(),
		created: z.string().nullish(),
		wa_id: z.string().nullish(),
		phone: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		sent: z.string().nullish(),
		delivered: z.string().nullish(),
		read: z.string().nullish(),
		error: z.string().nullish(),
	})
	.loose();

export type WatiBroadcastRecipient = z.infer<typeof BroadcastRecipientSchema>;

const BroadcastsRecipientsResponseSchema = z
	.object({
		recipients: z.array(BroadcastRecipientSchema).nullish(),
		recipient_list: z.array(BroadcastRecipientSchema).nullish(),
		/** This route names its total `total_count`. */
		total_count: z.number().nullish(),
		...PageFieldsSchema,
	})
	.loose();

export type BroadcastsRecipientsResponse = z.infer<
	typeof BroadcastsRecipientsResponseSchema
>;

// ── segments ──────────────────────────────────────────────────────────────

const SegmentSchema = z
	.object({
		id: z.string().nullish(),
		segmentId: z.string().nullish(),
		name: z.string().nullish(),
		tag: z.string().nullish(),
		description: z.string().nullish(),
		/** How many contacts matched at the last refresh. */
		hitCount: z.number().nullish(),
		totalContactCount: z.number().nullish(),
		contact_count: z.number().nullish(),
		created: z.string().nullish(),
		lastUpdated: z.string().nullish(),
	})
	.loose();

export type WatiSegment = z.infer<typeof SegmentSchema>;

const SegmentsListInputSchema = z.object({ ...PageSchema });

export type SegmentsListInput = z.infer<typeof SegmentsListInputSchema>;

const SegmentsListResponseSchema = z
	.object({
		segments: z.array(SegmentSchema).nullish(),
		// The segment routes page in camelCase.
		pageNumber: z.number().nullish(),
		pageSize: z.number().nullish(),
		...PageFieldsSchema,
	})
	.loose();

export type SegmentsListResponse = z.infer<typeof SegmentsListResponseSchema>;

const SegmentsGetInputSchema = z.object({ segmentId: z.string().min(1) });

export type SegmentsGetInput = z.infer<typeof SegmentsGetInputSchema>;

const SegmentResponseSchema = SegmentSchema;

export type SegmentResponse = z.infer<typeof SegmentResponseSchema>;

/**
 * The filters to evaluate. Each group is a set of conditions combined by its own
 * operator, and the groups themselves are combined with `operator`.
 */
const SegmentFilterGroupSchema = z
	.object({
		operator: z
			.enum(['AND', 'OR'])
			.describe('How the conditions inside this group combine.'),
		conditions: z
			.array(
				z
					.object({
						attribute: z
							.string()
							.min(1)
							.describe('The contact attribute, e.g. `contact_status`.'),
						operator: z
							.string()
							.min(1)
							.describe('The comparison, e.g. `eq`, `contains`, `gt`.'),
						value: z.string().describe('The value to compare against.'),
					})
					.loose(),
			)
			.min(1),
	})
	.loose();

const SegmentsEvaluateInputSchema = z.object({
	groups: z
		.array(SegmentFilterGroupSchema)
		.min(1)
		.describe('The filters to run.'),
	...PageSchema,
});

export type SegmentsEvaluateInput = z.infer<typeof SegmentsEvaluateInputSchema>;

const SegmentEvaluateResponseSchema = z
	.object({
		contacts: z.array(ContactSchema).nullish(),
		/** How many contacts match across all pages. */
		total: z.number().nullish(),
		pageNumber: z.number().nullish(),
		pageSize: z.number().nullish(),
		hasNextPage: z.boolean().nullish(),
		count: z.number().nullish(),
	})
	.loose();

export type SegmentEvaluateResponse = z.infer<
	typeof SegmentEvaluateResponseSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

const WebhookSchema = z
	.object({
		id: z.string().nullish(),
		url: z.string().nullish(),
		name: z.string().nullish(),
		/** The WhatsApp number the subscription belongs to. */
		phone_number: z.string().nullish(),
		// WATI's webhook migration guide says V3 responses use `event_types`; the
		// OpenAPI page shows `eventTypes`, so both are read.
		event_types: z.array(z.string()).nullish(),
		eventTypes: z.array(z.string()).nullish(),
		status: z.string().nullish().describe('Enabled, Disabled or Defective.'),
		created: z.string().nullish(),
	})
	.loose();

export type WatiWebhook = z.infer<typeof WebhookSchema>;

// The V3 list takes no paging and answers a bare array.
const WebhooksListInputSchema = z.object({});

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z
	.object({
		webhooks: z.array(WebhookSchema).nullish(),
	})
	.loose();

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksGetInputSchema = z.object({ id: z.string().min(1) });

export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

const WebhookResponseSchema = WebhookSchema;

export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;

const WebhooksDeleteInputSchema = z.object({ id: z.string().min(1) });

export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type WatiEndpointInputs = {
	contactsCreate: ContactsCreateInput;
	contactsGet: ContactsGetInput;
	contactsList: ContactsListInput;
	contactsCount: ContactsCountInput;
	contactsDelete: ContactsDeleteInput;
	conversationsList: ConversationsListInput;
	conversationsMessages: ConversationsMessagesInput;
	messagesSendText: MessagesSendTextInput;
	messagesSendTemplate: MessagesSendTemplateInput;
	messagesSendFile: MessagesSendFileInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	channelsList: ChannelsListInput;
	accountCredits: CreditsInput;
	broadcastsList: BroadcastsListInput;
	broadcastsGet: BroadcastsGetInput;
	broadcastsRecipients: BroadcastsRecipientsInput;
	segmentsList: SegmentsListInput;
	segmentsGet: SegmentsGetInput;
	segmentsEvaluate: SegmentsEvaluateInput;
	webhooksList: WebhooksListInput;
	webhooksGet: WebhooksGetInput;
	webhooksDelete: WebhooksDeleteInput;
};

export type WatiEndpointOutputs = {
	contactsCreate: ContactResponse;
	contactsGet: ContactResponse;
	contactsList: ContactsListResponse;
	contactsCount: ContactsCountResponse;
	contactsDelete: DeleteResponse;
	conversationsList: ConversationsListResponse;
	conversationsMessages: ConversationsMessagesResponse;
	messagesSendText: SendResponse;
	messagesSendTemplate: TemplateSendResponse;
	messagesSendFile: SendResponse;
	templatesList: TemplatesListResponse;
	templatesGet: TemplateResponse;
	channelsList: ChannelsListResponse;
	accountCredits: CreditsResponse;
	broadcastsList: BroadcastsListResponse;
	broadcastsGet: BroadcastResponse;
	broadcastsRecipients: BroadcastsRecipientsResponse;
	segmentsList: SegmentsListResponse;
	segmentsGet: SegmentResponse;
	segmentsEvaluate: SegmentEvaluateResponse;
	webhooksList: WebhooksListResponse;
	webhooksGet: WebhookResponse;
	webhooksDelete: DeleteResponse;
};

export const WatiEndpointInputSchemas = {
	contactsCreate: ContactsCreateInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsList: ContactsListInputSchema,
	contactsCount: ContactsCountInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	conversationsList: ConversationsListInputSchema,
	conversationsMessages: ConversationsMessagesInputSchema,
	messagesSendText: MessagesSendTextInputSchema,
	messagesSendTemplate: MessagesSendTemplateInputSchema,
	messagesSendFile: MessagesSendFileInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	channelsList: ChannelsListInputSchema,
	accountCredits: CreditsInputSchema,
	broadcastsList: BroadcastsListInputSchema,
	broadcastsGet: BroadcastsGetInputSchema,
	broadcastsRecipients: BroadcastsRecipientsInputSchema,
	segmentsList: SegmentsListInputSchema,
	segmentsGet: SegmentsGetInputSchema,
	segmentsEvaluate: SegmentsEvaluateInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
} as const;

export const WatiEndpointOutputSchemas = {
	contactsCreate: ContactResponseSchema,
	contactsGet: ContactResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsCount: ContactsCountResponseSchema,
	contactsDelete: DeleteResponseSchema,
	conversationsList: ConversationsListResponseSchema,
	conversationsMessages: ConversationsMessagesResponseSchema,
	messagesSendText: SendResponseSchema,
	messagesSendTemplate: TemplateSendResponseSchema,
	messagesSendFile: SendResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplateResponseSchema,
	channelsList: ChannelsListResponseSchema,
	accountCredits: CreditsResponseSchema,
	broadcastsList: BroadcastsListResponseSchema,
	broadcastsGet: BroadcastResponseSchema,
	broadcastsRecipients: BroadcastsRecipientsResponseSchema,
	segmentsList: SegmentsListResponseSchema,
	segmentsGet: SegmentResponseSchema,
	segmentsEvaluate: SegmentEvaluateResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksGet: WebhookResponseSchema,
	webhooksDelete: DeleteResponseSchema,
} as const;
