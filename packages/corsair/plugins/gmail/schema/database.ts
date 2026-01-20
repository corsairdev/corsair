import { z } from 'zod';

const MessagePartHeader = z.object({
	name: z.string().optional(),
	value: z.string().optional(),
});

const MessagePartBody = z.object({
	attachmentId: z.string().optional(),
	size: z.number().optional(),
	data: z.string().optional(),
});

const MessagePart: z.ZodType<any> = z.lazy(() =>
	z.object({
		partId: z.string().optional(),
		mimeType: z.string().optional(),
		filename: z.string().optional(),
		headers: z.array(MessagePartHeader).optional(),
		body: MessagePartBody.optional(),
		parts: z.array(MessagePart).optional(),
	}),
);

export const GmailMessage = z.object({
	id: z.string(),
	threadId: z.string().optional(),
	labelIds: z.array(z.string()).optional(),
	snippet: z.string().optional(),
	historyId: z.string().optional(),
	internalDate: z.string().optional(),
	sizeEstimate: z.number().optional(),
	payload: MessagePart.optional(),
	raw: z.string().optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export const GmailLabel = z.object({
	id: z.string(),
	name: z.string().optional(),
	messageListVisibility: z.enum(['show', 'hide']).optional(),
	labelListVisibility: z
		.enum(['labelShow', 'labelShowIfUnread', 'labelHide'])
		.optional(),
	type: z.enum(['system', 'user']).optional(),
	messagesTotal: z.number().optional(),
	messagesUnread: z.number().optional(),
	threadsTotal: z.number().optional(),
	threadsUnread: z.number().optional(),
	createdAt: z.coerce.date().optional(),
});

export const GmailDraft = z.object({
	id: z.string(),
	messageId: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export const GmailThread = z.object({
	id: z.string(),
	snippet: z.string().optional(),
	historyId: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export type GmailMessage = z.infer<typeof GmailMessage>;
export type GmailLabel = z.infer<typeof GmailLabel>;
export type GmailDraft = z.infer<typeof GmailDraft>;
export type GmailThread = z.infer<typeof GmailThread>;
