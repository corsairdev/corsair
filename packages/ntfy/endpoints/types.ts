import { z } from 'zod';

// https://docs.ntfy.sh/publish/#limitations - topic names are [-_A-Za-z0-9]{1,64}.
const TOPIC_PATTERN = /^[-_A-Za-z0-9]{1,64}$/;
// A poll can target several topics as a comma list (up to 150 on ntfy.sh).
// Sequence ids share the topic charset; they are interpolated into the
// clear and delete paths, so anything else is refused before the request.
const SEQUENCE_ID_PATTERN = /^[-_A-Za-z0-9]{1,64}$/;
const TOPIC_LIST_PATTERN = /^[-_A-Za-z0-9]{1,64}(,[-_A-Za-z0-9]{1,64})*$/;

const PrioritySchema = z.union([
	z.number().int().min(1).max(5),
	z.enum(['min', 'low', 'default', 'high', 'urgent']),
]);

const ActionSchema = z
	.object({
		action: z.enum(['view', 'broadcast', 'http', 'copy']),
		label: z.string().min(1),
		url: z.string().optional(),
		clear: z.boolean().optional(),
		method: z.string().optional(),
		headers: z.record(z.string(), z.string()).optional(),
		body: z.string().optional(),
		intent: z.string().optional(),
		extras: z.record(z.string(), z.string()).optional(),
		value: z.string().optional(),
	})
	.loose()
	.describe(
		"An action button; 'view' and 'http' need url, 'copy' needs value, 'broadcast' takes intent and extras",
	);

const PublishInputShape = {
	topic: z
		.string()
		.regex(TOPIC_PATTERN)
		.describe('Topic name, [-_A-Za-z0-9]{1,64}'),
	message: z
		.string()
		.optional()
		.describe('Notification body; the server default is "triggered"'),
	title: z.string().optional().describe('Notification title'),
	priority: PrioritySchema.optional().describe(
		'Priority as 1-5 or min|low|default|high|urgent',
	),
	tags: z
		.array(z.string())
		.optional()
		.describe('Emoji tags, e.g. ["warning","skull"]'),
	click: z
		.string()
		.optional()
		.describe('URL opened when the notification is clicked'),
	markdown: z.boolean().optional().describe('Render the message as markdown'),
	actions: z
		.array(ActionSchema)
		.max(3)
		.optional()
		.describe('Up to 3 action buttons'),
	delay: z
		.string()
		.optional()
		.describe(
			'Delayed delivery, e.g. "30min" or "9am"; ntfy.sh accepts 10s to 3d. Cancel before delivery with messages.delete',
		),
	icon: z
		.string()
		.optional()
		.describe('URL of a JPEG or PNG shown as the notification icon'),
	attach: z
		.string()
		.optional()
		.describe('URL of a file to attach (the server does not download it)'),
	filename: z.string().optional().describe('File name for the `attach` URL'),
	email: z
		.string()
		.optional()
		.describe(
			'Also email the notification to this address (the server must have email sending configured; counts against the daily email limit)',
		),
	call: z
		.string()
		.optional()
		.describe(
			'Also phone this verified number (or "yes" for the first one) and read the message out; needs a tier with calls',
		),
	cache: z
		.boolean()
		.optional()
		.describe('false: deliver to current subscribers only, do not cache'),
	firebase: z
		.boolean()
		.optional()
		.describe(
			'false: do not forward to Firebase (Android app without instant delivery)',
		),
};

const MessagesSendInputSchema = z.object({
	...PublishInputShape,
	sequenceId: z
		.string()
		.regex(SEQUENCE_ID_PATTERN)
		.optional()
		.describe(
			'Optional sequence id, [-_A-Za-z0-9]{1,64}; publishing again with the same id updates (replaces) the message on subscribers',
		),
});

const MessagesUpdateInputSchema = z.object({
	...PublishInputShape,
	sequenceId: z
		.string()
		.regex(SEQUENCE_ID_PATTERN)
		.describe(
			'Sequence id of the message to update; the server keeps both versions and notifies again',
		),
});

const MessagesPollInputSchema = z.object({
	topic: z
		.string()
		.regex(TOPIC_LIST_PATTERN)
		.describe(
			'Topic name, or a comma-separated list of up to 150 topics, [-_A-Za-z0-9]{1,64} each',
		),
	since: z
		.union([z.string(), z.number()])
		.optional()
		.describe(
			'Read messages since: a duration ("10min"), unix seconds, a message id, "all" (default), or "latest"',
		),
	scheduled: z
		.boolean()
		.optional()
		.describe('Include scheduled (undelivered) messages'),
	id: z.string().optional().describe('Only the message with this id'),
	message: z.string().optional().describe('Filter by message text'),
	title: z.string().optional().describe('Filter by title'),
	priority: z
		.array(PrioritySchema)
		.optional()
		.describe('Only these priorities (OR filter)'),
	tags: z
		.array(z.string())
		.optional()
		.describe('Only messages with all of these tags (AND filter)'),
});

const MessagesClearInputSchema = z.object({
	topic: z.string().regex(TOPIC_PATTERN).describe('Topic name'),
	sequenceId: z
		.string()
		.regex(SEQUENCE_ID_PATTERN)
		.describe('Sequence id of the message to mark as read'),
});

const MessagesDeleteInputSchema = z.object({
	topic: z.string().regex(TOPIC_PATTERN).describe('Topic name'),
	sequenceId: z
		.string()
		.regex(SEQUENCE_ID_PATTERN)
		.describe('Sequence id of the message to delete'),
});

// One consumed message. expires is absent with Cache: no; every other
// optional field is absent when not set on the publish.
const MessageOutputSchema = z
	.object({
		id: z.string(),
		time: z.number().int().describe('Unix seconds'),
		expires: z
			.number()
			.int()
			.nullish()
			.describe('Unix seconds the cache entry expires'),
		event: z.literal('message'),
		topic: z.string(),
		message: z.string(),
		sequence_id: z.string().nullish(),
		title: z.string().nullish(),
		priority: z.number().int().min(1).max(5).nullish(),
		tags: z.array(z.string()).nullish(),
		click: z.string().nullish(),
		icon: z.string().nullish(),
		content_type: z.string().nullish(),
		actions: z.array(ActionSchema).nullish(),
		attachment: z
			.object({
				name: z.string(),
				url: z.string(),
				type: z.string().nullish(),
				size: z.number().int().nullish(),
				expires: z.number().int().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

// clear and delete answer a tombstone object with no message body.
const MessageClearOutputSchema = z
	.object({
		id: z.string(),
		time: z.number().int().describe('Unix seconds'),
		expires: z
			.number()
			.int()
			.nullish()
			.describe('Unix seconds the cache entry expires'),
		event: z.literal('message_clear'),
		topic: z.string(),
		sequence_id: z.string().nullish(),
	})
	.loose();

const MessageDeleteOutputSchema = z
	.object({
		id: z.string(),
		time: z.number().int().describe('Unix seconds'),
		expires: z
			.number()
			.int()
			.nullish()
			.describe('Unix seconds the cache entry expires'),
		event: z.literal('message_delete'),
		topic: z.string(),
		sequence_id: z.string().nullish(),
	})
	.loose();

const MessagesPollOutputSchema = z
	.object({
		messages: z.array(MessageOutputSchema),
	})
	.loose();

const AccountUsageOutputSchema = z
	.object({
		username: z.string(),
		role: z.string(),
		limits: z
			.object({
				basis: z.string().nullish(),
				messages: z.number().int().nullish(),
				messages_expiry_duration: z.number().int().nullish(),
				emails: z.number().int().nullish(),
				calls: z.number().int().nullish(),
				reservations: z.number().int().nullish(),
				attachment_total_size: z.number().int().nullish(),
				attachment_file_size: z.number().int().nullish(),
				attachment_expiry_duration: z.number().int().nullish(),
				attachment_bandwidth: z.number().int().nullish(),
			})
			.loose(),
		stats: z
			.object({
				messages: z.number().int().nullish(),
				messages_remaining: z.number().int().nullish(),
				emails: z.number().int().nullish(),
				emails_remaining: z.number().int().nullish(),
				calls: z.number().int().nullish(),
				calls_remaining: z.number().int().nullish(),
				reservations: z.number().int().nullish(),
				reservations_remaining: z.number().int().nullish(),
				attachment_total_size: z.number().int().nullish(),
				attachment_total_size_remaining: z.number().int().nullish(),
				reset_at: z
					.number()
					.int()
					.nullish()
					.describe('Unix seconds the daily counters reset'),
			})
			.loose(),
	})
	.loose();

const ServerHealthOutputSchema = z
	.object({
		healthy: z.boolean(),
		role: z.string(),
	})
	.loose();

const ServerStatsOutputSchema = z
	.object({
		messages: z.number().int(),
		messages_rate: z.number(),
	})
	.loose();

export type MessagesSendInput = z.input<typeof MessagesSendInputSchema>;
export type MessagesSendResponse = z.infer<typeof MessageOutputSchema>;
export type MessagesPollInput = z.input<typeof MessagesPollInputSchema>;
export type MessagesPollResponse = z.infer<typeof MessagesPollOutputSchema>;
export type MessagesUpdateInput = z.input<typeof MessagesUpdateInputSchema>;
export type MessagesUpdateResponse = z.infer<typeof MessageOutputSchema>;
export type MessagesClearInput = z.input<typeof MessagesClearInputSchema>;
export type MessagesClearResponse = z.infer<typeof MessageClearOutputSchema>;
export type MessagesDeleteInput = z.input<typeof MessagesDeleteInputSchema>;
export type MessagesDeleteResponse = z.infer<typeof MessageDeleteOutputSchema>;
export type AccountUsageInput = Record<string, never>;
export type AccountUsageResponse = z.infer<typeof AccountUsageOutputSchema>;
export type ServerHealthInput = Record<string, never>;
export type ServerHealthResponse = z.infer<typeof ServerHealthOutputSchema>;
export type ServerStatsInput = Record<string, never>;
export type ServerStatsResponse = z.infer<typeof ServerStatsOutputSchema>;

export type NtfyEndpointInputs = {
	messagesSend: MessagesSendInput;
	messagesPoll: MessagesPollInput;
	messagesUpdate: MessagesUpdateInput;
	messagesClear: MessagesClearInput;
	messagesDelete: MessagesDeleteInput;
	accountUsage: AccountUsageInput;
	serverHealth: ServerHealthInput;
	serverStats: ServerStatsInput;
};

export type NtfyEndpointOutputs = {
	messagesSend: MessagesSendResponse;
	messagesPoll: MessagesPollResponse;
	messagesUpdate: MessagesUpdateResponse;
	messagesClear: MessagesClearResponse;
	messagesDelete: MessagesDeleteResponse;
	accountUsage: AccountUsageResponse;
	serverHealth: ServerHealthResponse;
	serverStats: ServerStatsResponse;
};

export const NtfyEndpointInputSchemas = {
	messagesSend: MessagesSendInputSchema,
	messagesPoll: MessagesPollInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	messagesClear: MessagesClearInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	accountUsage: z.object({}).loose(),
	serverHealth: z.object({}).loose(),
	serverStats: z.object({}).loose(),
} as const;

export const NtfyEndpointOutputSchemas = {
	messagesSend: MessageOutputSchema,
	messagesPoll: MessagesPollOutputSchema,
	messagesUpdate: MessageOutputSchema,
	messagesClear: MessageClearOutputSchema,
	messagesDelete: MessageDeleteOutputSchema,
	accountUsage: AccountUsageOutputSchema,
	serverHealth: ServerHealthOutputSchema,
	serverStats: ServerStatsOutputSchema,
} as const;
