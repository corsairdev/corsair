import { z } from 'zod';

const MessagesListInputSchema = z.object({
	inbox_id: z.string(),
	limit: z.number().int().optional(),
	page_token: z.string().optional(),
	labels: z.array(z.string()).optional(),
	before: z.string().optional(),
	after: z.string().optional(),
	ascending: z.boolean().optional(),
	include_spam: z.boolean().optional(),
	include_blocked: z.boolean().optional(),
	include_unauthenticated: z.boolean().optional(),
	include_trash: z.boolean().optional(),
	from: z.array(z.string()).optional(),
	to: z.array(z.string()).optional(),
	subject: z.array(z.string()).optional(),
});

const MessagesGetInputSchema = z.object({
	inbox_id: z.string(),
	message_id: z.string(),
});

const AddressOrAddressesSchema = z.union([z.string(), z.array(z.string())]);

const MessagesSendInputSchema = z.object({
	inbox_id: z.string(),
	labels: z.array(z.string()).optional(),
	reply_to: AddressOrAddressesSchema.optional(),
	to: AddressOrAddressesSchema.optional(),
	cc: AddressOrAddressesSchema.optional(),
	bcc: AddressOrAddressesSchema.optional(),
	subject: z.string().optional(),
	text: z.string().optional(),
	html: z.string().optional(),
	headers: z.record(z.string(), z.string()).optional(),
});

export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;
export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;
export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

const AttachmentSchema = z
	.object({
		attachment_id: z.string(),
		size: z.number(),
		filename: z.string().optional(),
		content_type: z.string().optional(),
		content_disposition: z.string().optional(),
		content_id: z.string().optional(),
	})
	.loose();

const MessageSummarySchema = z
	.object({
		inbox_id: z.string(),
		thread_id: z.string(),
		message_id: z.string(),
		labels: z.array(z.string()),
		timestamp: z.string(),
		from: z.string(),
		to: z.array(z.string()),
		size: z.number(),
		updated_at: z.string(),
		created_at: z.string(),
		cc: z.array(z.string()).optional(),
		bcc: z.array(z.string()).optional(),
		subject: z.string().optional(),
		preview: z.string().optional(),
		attachments: z.array(AttachmentSchema).optional(),
		in_reply_to: z.string().optional(),
		references: z.array(z.string()).optional(),
		headers: z.record(z.string(), z.string()).optional(),
	})
	.loose();

export type AgentMailMessageSummary = z.infer<typeof MessageSummarySchema>;

const MessageSchema = MessageSummarySchema.extend({
	reply_to: z.array(z.string()).optional(),
	text: z.string().optional(),
	html: z.string().optional(),
	extracted_text: z.string().optional(),
	extracted_html: z.string().optional(),
});

export type AgentMailMessage = z.infer<typeof MessageSchema>;

const MessagesListResponseSchema = z.object({
	count: z.number(),
	messages: z.array(MessageSummarySchema),
	limit: z.number(),
	next_page_token: z.string().nullable().optional(),
});

const MessagesSendResponseSchema = z.object({
	message_id: z.string(),
	thread_id: z.string(),
});

export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;
export type MessagesGetResponse = z.infer<typeof MessageSchema>;
export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;

export type AgentMailEndpointInputs = {
	messagesList: MessagesListInput;
	messagesGet: MessagesGetInput;
	messagesSend: MessagesSendInput;
};

export type AgentMailEndpointOutputs = {
	messagesList: MessagesListResponse;
	messagesGet: MessagesGetResponse;
	messagesSend: MessagesSendResponse;
};

export const AgentMailEndpointInputSchemas = {
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSend: MessagesSendInputSchema,
} as const;

export const AgentMailEndpointOutputSchemas = {
	messagesList: MessagesListResponseSchema,
	messagesGet: MessageSchema,
	messagesSend: MessagesSendResponseSchema,
} as const;
