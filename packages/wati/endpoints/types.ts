import { z } from 'zod';

// Inputs use WATI's own parameter names. Outputs are `.loose()` and their
// documented fields nullish.
// Reference: https://docs.wati.io/llms.txt and the V3 contract pages it links.
//
// V3 puts no tenant in the path: the token identifies the workspace, and the
// host identifies the region. Pagination is `page_number` (1-based) plus
// `page_size`, capped at 100.

const PageSchema = {
	page_number: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('The page to return, 1-based.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Items per page, up to 100.'),
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

const ContactResponseSchema = z.object({}).loose();

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
		count: z.number().nullish(),
		total: z.number().nullish(),
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
		message: z.string().nullish(),
	})
	.loose();

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

// ── conversations ─────────────────────────────────────────────────────────

const ConversationSchema = z
	.object({
		id: z.string().nullish(),
		conversation_id: z.string().nullish(),
		wa_id: z.string().nullish(),
		contact_name: z.string().nullish(),
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
const MessagesSendTemplateInputSchema = z
	.object({
		whatsapp_number: z
			.string()
			.min(1)
			.describe('The recipient number, without a leading +.'),
		template_name: z.string().min(1),
		broadcast_name: z
			.string()
			.optional()
			.describe('Groups the send as a campaign under this name.'),
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
	})
	.superRefine((value, ctx) => {
		if (value.broadcast_name !== undefined && value.parameters === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['parameters'],
				message:
					'A template campaign without parameters only works for a template with no placeholders — send parameters or drop broadcast_name.',
			});
		}
	});

export type MessagesSendTemplateInput = z.infer<
	typeof MessagesSendTemplateInputSchema
>;

const SendResponseSchema = z
	.object({
		result: z.unknown().nullish(),
		message: z.string().nullish(),
		success: z.boolean().nullish(),
		/** WATI's own id for the queued message. */
		id: z.string().nullish(),
		local_message_id: z.string().nullish(),
	})
	.loose();

export type SendResponse = z.infer<typeof SendResponseSchema>;

/** A file message, by an already-uploaded media URL or id. */
const MessagesSendFileInputSchema = z.object({
	target: z.string().min(1),
	url: z.string().min(1).describe('A publicly reachable media URL.'),
	caption: z.string().optional(),
	filename: z.string().optional(),
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
		components: z.array(z.unknown()).nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type WatiTemplate = z.infer<typeof TemplateSchema>;

const TemplatesListInputSchema = z.object({ ...PageSchema });

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

const TemplatesListResponseSchema = z
	.object({
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
		status: z.string().nullish(),
		phone_number: z.string().nullish(),
	})
	.loose();

export type WatiChannel = z.infer<typeof ChannelSchema>;

const ChannelsListInputSchema = z.object({});

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
		credits: z.number().nullish(),
		balance: z.number().nullish(),
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
		created: z.string().nullish(),
		scheduled: z.string().nullish(),
		sent: z.number().nullish(),
		delivered: z.number().nullish(),
		read: z.number().nullish(),
		failed: z.number().nullish(),
	})
	.loose();

export type WatiBroadcast = z.infer<typeof BroadcastSchema>;

const BroadcastsListInputSchema = z.object({ ...PageSchema });

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
		contact_count: z.number().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type WatiSegment = z.infer<typeof SegmentSchema>;

const SegmentsListInputSchema = z.object({ ...PageSchema });

export type SegmentsListInput = z.infer<typeof SegmentsListInputSchema>;

const SegmentsListResponseSchema = z
	.object({
		segments: z.array(SegmentSchema).nullish(),
		...PageFieldsSchema,
	})
	.loose();

export type SegmentsListResponse = z.infer<typeof SegmentsListResponseSchema>;

const SegmentsGetInputSchema = z.object({ segmentId: z.string().min(1) });

export type SegmentsGetInput = z.infer<typeof SegmentsGetInputSchema>;

const SegmentResponseSchema = SegmentSchema;

export type SegmentResponse = z.infer<typeof SegmentResponseSchema>;

const SegmentsEvaluateInputSchema = z.object({
	segmentId: z.string().min(1),
});

export type SegmentsEvaluateInput = z.infer<typeof SegmentsEvaluateInputSchema>;

const SegmentEvaluateResponseSchema = z
	.object({
		count: z.number().nullish(),
		contacts: z.array(ContactSchema).nullish(),
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
		events: z.array(z.string()).nullish(),
		status: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type WatiWebhook = z.infer<typeof WebhookSchema>;

const WebhooksListInputSchema = z.object({ ...PageSchema });

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = z
	.object({
		webhooks: z.array(WebhookSchema).nullish(),
		...PageFieldsSchema,
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
	messagesSendTemplate: SendResponse;
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
	messagesSendTemplate: SendResponseSchema,
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
