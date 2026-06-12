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

export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

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

const MessagesListResponseSchema = z.object({
	count: z.number(),
	messages: z.array(MessageSummarySchema),
	limit: z.number(),
	next_page_token: z.string().nullable().optional(),
});

export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;

export type AgentMailEndpointInputs = {
	messagesList: MessagesListInput;
};

export type AgentMailEndpointOutputs = {
	messagesList: MessagesListResponse;
};

export const AgentMailEndpointInputSchemas = {
	messagesList: MessagesListInputSchema,
} as const;

export const AgentMailEndpointOutputSchemas = {
	messagesList: MessagesListResponseSchema,
} as const;
