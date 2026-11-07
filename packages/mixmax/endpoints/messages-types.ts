import { z } from 'zod';

// Messages and the plain send endpoint (developer.mixmax.com/reference,
// Messages section). Body field names, types, and limits mirror the official
// MessageFields / MessageAddress / Message / MessagePage schemas.

export const MessageAddressSchema = z.object({
	email: z.string().min(1),
	// The provider marks the display name nullable on both create and update.
	name: z.string().nullable().optional(),
});

export type MessageAddress = z.infer<typeof MessageAddressSchema>;

const MessageFieldsSchema = z.object({
	to: z.array(MessageAddressSchema).optional(),
	cc: z.array(MessageAddressSchema).optional(),
	bcc: z.array(MessageAddressSchema).optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
	from: z
		.object({
			email: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
	trackingEnabled: z.boolean().optional(),
	linkTrackingEnabled: z.boolean().optional(),
	fileTrackingEnabled: z.boolean().optional(),
	notificationsEnabled: z.boolean().optional(),
	smartFollowupsEnabled: z.boolean().optional(),
	showContentTeamFeed: z.boolean().optional(),
	syncToOrg: z.boolean().optional(),
	inReplyTo: z.string().optional(),
	// A reminder to follow up on this message; the provider allows any object
	// shape here (additionalProperties: true).
	followUp: z.object({}).passthrough().optional(),
	attachments: z.array(z.object({}).passthrough()).optional(),
	snippetIds: z.array(z.string()).optional(),
});

export type MessageFields = z.infer<typeof MessageFieldsSchema>;

const MessageSchema = z
	.object({
		_id: z.string().optional(),
		userId: z.string().optional(),
		from: z
			.object({
				email: z.string().optional(),
				name: z.string().optional(),
				isDelegated: z.boolean().optional(),
			})
			.optional(),
		to: z.array(MessageAddressSchema).optional(),
		cc: z.array(MessageAddressSchema).optional(),
		bcc: z.array(MessageAddressSchema).optional(),
		subject: z.string().optional(),
		// Mixmax strips the body once a message is sent, so it is often empty
		// or missing on sent messages.
		body: z.string().optional(),
		created: z.number().optional(),
		updatedAt: z.number().optional(),
		trackingEnabled: z.boolean().optional(),
		linkTrackingEnabled: z.boolean().optional(),
		fileTrackingEnabled: z.boolean().optional(),
		notificationsEnabled: z.boolean().optional(),
		smartFollowupsEnabled: z.boolean().optional(),
		showContentTeamFeed: z.boolean().optional(),
		syncToOrg: z.boolean().optional(),
		snippetIds: z.array(z.string()).optional(),
		attachments: z
			.array(
				z.object({
					name: z.string().optional(),
					type: z.string().optional(),
					size: z.number().optional(),
				}),
			)
			.optional(),
		followUp: z.object({}).passthrough().optional(),
		sequence: z
			.object({
				id: z.string().optional(),
				stageId: z.string().optional(),
				recipientId: z.string().optional(),
			})
			.optional(),
		scheduled: z.number().optional(),
		sent: z.number().optional(),
		sendingError: z.string().optional(),
	})
	.passthrough();

export type Message = z.infer<typeof MessageSchema>;

const MessagePageSchema = z.object({
	results: z.array(MessageSchema),
	hasNext: z.boolean().optional(),
	next: z.string().optional(),
	hasPrevious: z.boolean().optional(),
	previous: z.string().optional(),
});

export type MessagePage = z.infer<typeof MessagePageSchema>;

export const MessagesListInputSchema = z.object({
	// Values above 300 return 300 messages.
	limit: z.coerce.number().int().max(300).optional(),
	next: z.string().optional(),
	previous: z.string().optional(),
	// Comma-separated list of message fields to return, e.g. `subject,created`.
	fields: z.string().optional(),
});

export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

export const MessagesListOutputSchema = MessagePageSchema;

export type MessagesListOutput = z.infer<typeof MessagesListOutputSchema>;

export const MessagesCreateInputSchema = MessageFieldsSchema;

export type MessagesCreateInput = z.infer<typeof MessagesCreateInputSchema>;

// POST /v1/messages answers 200 with the stored message.
export const MessagesCreateOutputSchema = MessageSchema;

export type MessagesCreateOutput = z.infer<typeof MessagesCreateOutputSchema>;

export const MessagesGetInputSchema = z.object({
	id: z.string().min(1),
});

export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;

export const MessagesGetOutputSchema = MessageSchema;

export type MessagesGetOutput = z.infer<typeof MessagesGetOutputSchema>;

export const MessagesUpdateInputSchema = MessageFieldsSchema.extend({
	id: z.string().min(1),
});

export type MessagesUpdateInput = z.infer<typeof MessagesUpdateInputSchema>;

// PATCH /v1/messages/{id} answers 204 with no body.
export const MessagesUpdateOutputSchema = z.undefined();

export type MessagesUpdateOutput = z.infer<typeof MessagesUpdateOutputSchema>;

export const MessagesSendInputSchema = z.object({
	id: z.string().min(1),
	// Optional message fields applied to the message right before sending.
	data: MessageFieldsSchema.optional(),
	// Sending options; the provider declares the object without properties.
	options: z.object({}).passthrough().optional(),
});

export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

// POST /v1/messages/{id}/send answers 202 once the message is queued; the
// acknowledgement body is provider-defined.
export const MessagesSendOutputSchema = z.object({}).passthrough();

export type MessagesSendOutput = z.infer<typeof MessagesSendOutputSchema>;

export const MessagesScheduleInputSchema = z.object({
	id: z.string().min(1),
	options: z.object({
		// When to send, in Unix milliseconds. The provider sends a number; a
		// date string is misread.
		scheduledDate: z.coerce.number().int(),
	}),
	// Optional message fields applied before scheduling.
	data: MessageFieldsSchema.optional(),
});

export type MessagesScheduleInput = z.infer<typeof MessagesScheduleInputSchema>;

// Schedule and unschedule answer with plain text (sent as text/html), not
// JSON, so the parsed output is that string — or undefined without a body.
const PlainTextResponseSchema = z.union([z.string(), z.undefined()]);

export const MessagesScheduleOutputSchema = PlainTextResponseSchema;

export type MessagesScheduleOutput = z.infer<
	typeof MessagesScheduleOutputSchema
>;

export const MessagesUnscheduleInputSchema = z.object({
	id: z.string().min(1),
});

export type MessagesUnscheduleInput = z.infer<
	typeof MessagesUnscheduleInputSchema
>;

export const MessagesUnscheduleOutputSchema = PlainTextResponseSchema;

export type MessagesUnscheduleOutput = z.infer<
	typeof MessagesUnscheduleOutputSchema
>;

export const MessagesTestInputSchema = z.object({
	subject: z.string().optional(),
	body: z.string().optional(),
	// The `_id` of a meeting template to fill the meeting variables from.
	meetingTypeId: z.string().optional(),
	// Meeting start time in Unix milliseconds for the meeting variables.
	meetingTimeMs: z.coerce.number().int().optional(),
	primaryTimeZone: z.string().optional(),
});

export type MessagesTestInput = z.infer<typeof MessagesTestInputSchema>;

// POST /v1/messages/test answers 200 with a provider-defined body.
export const MessagesTestOutputSchema = z.object({}).passthrough();

export type MessagesTestOutput = z.infer<typeof MessagesTestOutputSchema>;

// POST /v1/send addresses mirror the official SendAddress schema and the
// published example uses a single `to` recipient object.
export const SendAddressSchema = z.object({
	address: z.string().min(1),
	name: z.string().optional(),
});

export type SendAddress = z.infer<typeof SendAddressSchema>;

export const MessagesSendPlainInputSchema = z.object({
	message: z.object({
		// The provider declares `to` as opaque; the official example sends a
		// single { address, name } recipient object.
		to: SendAddressSchema,
		from: SendAddressSchema.optional(),
		cc: z.array(SendAddressSchema).optional(),
		bcc: z.array(SendAddressSchema).optional(),
		subject: z.string(),
		html: z.string(),
	}),
});

export type MessagesSendPlainInput = z.infer<
	typeof MessagesSendPlainInputSchema
>;

// POST /v1/send answers 200 without a JSON body.
export const MessagesSendPlainOutputSchema = z.undefined();

export type MessagesSendPlainOutput = z.infer<
	typeof MessagesSendPlainOutputSchema
>;
