import { z } from 'zod';

export const ZohoMailMessage = z.object({
	id: z.string(),
	messageId: z.string().optional(),
	threadId: z.string().optional(),
	folderId: z.string().optional(),
	subject: z.string().optional(),
	summary: z.string().optional(),
	fromAddress: z.string().optional(),
	toAddress: z.string().optional(),
	ccAddress: z.string().optional(),
	sender: z.string().optional(),
	sentDateInGMT: z.string().optional(),
	receivedTime: z.string().optional(),
	size: z.string().optional(),
	hasAttachment: z.string().optional(),
	status: z.string().optional(),
	flagid: z.string().optional(),
	priority: z.string().optional(),
	content: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ZohoMailFolder = z.object({
	id: z.string(),
	folderId: z.string().optional(),
	folderName: z.string().optional(),
	path: z.string().optional(),
	parentFolderId: z.string().optional(),
	folderType: z.string().optional(),
	unreadCount: z.union([z.string(), z.number()]).optional(),
	messageCount: z.union([z.string(), z.number()]).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type ZohoMailMessage = z.infer<typeof ZohoMailMessage>;
export type ZohoMailFolder = z.infer<typeof ZohoMailFolder>;
