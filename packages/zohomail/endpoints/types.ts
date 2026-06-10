import { z } from 'zod';
import type {
	ZohoFolder,
	ZohoFolderListResponse,
	ZohoMessage,
	ZohoMessageDetail,
	ZohoMessageListResponse,
} from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Input schemas
// ─────────────────────────────────────────────────────────────────────────────

const accountIdField = z
	.string()
	.optional()
	.describe(
		'Zoho Mail accountId. When omitted, the first account on the authenticated user is resolved automatically.',
	);

const MessagesListInputSchema = z.object({
	accountId: accountIdField,
	folderId: z
		.string()
		.optional()
		.describe(
			'Folder to list emails from. Defaults to the Inbox when omitted.',
		),
	start: z
		.number()
		.optional()
		.describe('Starting sequence number (default 1).'),
	limit: z
		.number()
		.optional()
		.describe('Number of emails to retrieve, 1-200 (default 10).'),
	status: z.enum(['read', 'unread', 'all']).optional(),
	sortBy: z.enum(['date', 'messageId', 'size']).optional(),
	sortorder: z
		.boolean()
		.optional()
		.describe('true = ascending, false = descending (default).'),
	includeto: z.boolean().optional(),
});

const MessagesGetInputSchema = z.object({
	accountId: accountIdField,
	folderId: z.string(),
	messageId: z.string(),
});

const MessagesSendInputSchema = z.object({
	accountId: accountIdField,
	fromAddress: z
		.string()
		.describe('Sender address; must belong to the authenticated account.'),
	toAddress: z.string().describe('Recipient address(es), comma-separated.'),
	ccAddress: z.string().optional(),
	bccAddress: z.string().optional(),
	subject: z.string().optional(),
	content: z.string().optional(),
	mailFormat: z.enum(['html', 'plaintext']).optional(),
	askReceipt: z.enum(['yes', 'no']).optional(),
});

const MessagesDeleteInputSchema = z.object({
	accountId: accountIdField,
	folderId: z.string(),
	messageId: z.string(),
});

const MessagesMoveInputSchema = z.object({
	accountId: accountIdField,
	messageId: z.array(z.string()).describe('Message IDs to move.'),
	destfolderId: z.string().describe('Destination folder ID.'),
});

const MessagesMarkReadInputSchema = z.object({
	accountId: accountIdField,
	messageId: z.array(z.string()),
});

const MessagesMarkUnreadInputSchema = z.object({
	accountId: accountIdField,
	messageId: z.array(z.string()),
});

const FoldersListInputSchema = z.object({
	accountId: accountIdField,
});

const FoldersGetInputSchema = z.object({
	accountId: accountIdField,
	folderId: z.string(),
});

const FoldersCreateInputSchema = z.object({
	accountId: accountIdField,
	folderName: z.string(),
	parentFolderId: z
		.string()
		.optional()
		.describe('Parent folder ID for creating a sub-folder.'),
});

const FoldersUpdateInputSchema = z.object({
	accountId: accountIdField,
	folderId: z.string(),
	mode: z.enum(['rename', 'markAsRead', 'emptyFolder']),
	folderName: z
		.string()
		.optional()
		.describe('New folder name. Required when mode = rename.'),
});

const FoldersDeleteInputSchema = z.object({
	accountId: accountIdField,
	folderId: z.string(),
});

export const ZohoMailEndpointInputSchemas = {
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	messagesMove: MessagesMoveInputSchema,
	messagesMarkRead: MessagesMarkReadInputSchema,
	messagesMarkUnread: MessagesMarkUnreadInputSchema,
	foldersList: FoldersListInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
} as const;

export type ZohoMailEndpointInputs = {
	[K in keyof typeof ZohoMailEndpointInputSchemas]: z.infer<
		(typeof ZohoMailEndpointInputSchemas)[K]
	>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Output schemas
// ─────────────────────────────────────────────────────────────────────────────

const MessageSchema = z
	.object({
		messageId: z.coerce.string().optional(),
		threadId: z.coerce.string().optional(),
		folderId: z.coerce.string().optional(),
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
		hasInline: z.string().optional(),
		status: z.string().optional(),
		status2: z.string().optional(),
		flagid: z.string().optional(),
		priority: z.string().optional(),
		calendarType: z.string().optional(),
		threadCount: z.string().optional(),
	})
	.loose();

const MessageDetailSchema = MessageSchema.extend({
	content: z.string().optional(),
	mailFormat: z.string().optional(),
	returnPath: z.string().optional(),
	bccAddress: z.string().optional(),
	replyTo: z.string().optional(),
}).loose();

const MessageListResponseSchema = z.object({
	messages: z.array(MessageSchema),
});

const FolderSchema = z
	.object({
		folderId: z.coerce.string().optional(),
		folderName: z.string().optional(),
		path: z.string().optional(),
		parentFolderId: z.coerce.string().optional(),
		previousFolderId: z.coerce.string().optional(),
		folderType: z.string().optional(),
		isArchived: z.union([z.string(), z.boolean()]).optional(),
		imapAccess: z.union([z.string(), z.boolean()]).optional(),
		unreadCount: z.union([z.string(), z.number()]).optional(),
		messageCount: z.union([z.string(), z.number()]).optional(),
		URI: z.string().optional(),
	})
	.loose();

const FolderListResponseSchema = z.object({
	folders: z.array(FolderSchema),
});

export const ZohoMailEndpointOutputSchemas = {
	messagesList: MessageListResponseSchema,
	messagesGet: MessageDetailSchema,
	messagesSend: MessageSchema,
	messagesDelete: z.void(),
	messagesMove: z.void(),
	messagesMarkRead: z.void(),
	messagesMarkUnread: z.void(),
	foldersList: FolderListResponseSchema,
	foldersGet: FolderSchema,
	foldersCreate: FolderSchema,
	foldersUpdate: z.void(),
	foldersDelete: z.void(),
} as const;

export type ZohoMailEndpointOutputs = {
	messagesList: ZohoMessageListResponse;
	messagesGet: ZohoMessageDetail;
	messagesSend: ZohoMessage;
	messagesDelete: void;
	messagesMove: void;
	messagesMarkRead: void;
	messagesMarkUnread: void;
	foldersList: ZohoFolderListResponse;
	foldersGet: ZohoFolder;
	foldersCreate: ZohoFolder;
	foldersUpdate: void;
	foldersDelete: void;
};
