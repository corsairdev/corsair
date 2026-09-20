import { z } from 'zod';
import {
	CodyBot,
	CodyConversation,
	CodyDocument,
	CodyFolder,
	CodyMessage,
	CodyUsage,
} from '../schema/database';

export const PaginationMetaSchema = z.object({
	pagination: z
		.object({
			total: z.number().optional(),
			count: z.number().optional(),
			per_page: z.number().optional(),
			current_page: z.number().optional(),
			total_pages: z.number().optional(),
			// unknown: pagination links are an open key-value object of URL strings.
			links: z.record(z.string(), z.string().nullable().optional()).optional(),
		})
		.optional(),
});

// ── Bots ─────────────────────────────────────────────────────────────────────

const BotsListInputSchema = z.object({
	search: z.string().optional().describe('Keyword to filter bots by name'),
});

const BotsListResponseSchema = z.object({
	data: z.array(CodyBot),
	meta: PaginationMetaSchema.optional(),
});

// ── Conversations ────────────────────────────────────────────────────────────

const ConversationDetailedSchema = CodyConversation.extend({
	document_ids: z
		.array(z.string())
		.optional()
		.describe('List of document IDs assigned for focus mode'),
});

const ConversationsListInputSchema = z.object({
	search: z
		.string()
		.optional()
		.describe('Keyword to filter conversations by name'),
	bot_id: z.string().optional().describe('Filter conversations by bot ID'),
	includes: z
		.string()
		.optional()
		.describe('Extra attributes to include (e.g. document_ids)'),
});

const ConversationsListResponseSchema = z.object({
	data: z.array(ConversationDetailedSchema),
	meta: PaginationMetaSchema.optional(),
});

const ConversationsCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the conversation'),
	bot_id: z.string().min(1).describe('Bot ID to create the conversation with'),
	document_ids: z
		.array(z.string())
		.optional()
		.describe('Optional document IDs to limit bot focus to specific knowledge'),
});

const ConversationsCreateResponseSchema = z.object({
	data: ConversationDetailedSchema,
});

const ConversationsGetInputSchema = z.object({
	id: z.string().min(1).describe('Unique identifier of the conversation'),
	includes: z
		.string()
		.optional()
		.describe('Extra attributes to include (e.g. document_ids)'),
});

const ConversationsGetResponseSchema = z.object({
	data: ConversationDetailedSchema,
});

const ConversationsUpdateInputSchema = z.object({
	id: z.string().min(1).describe('Unique identifier of the conversation'),
	name: z.string().optional().describe('Updated name for the conversation'),
	bot_id: z.string().optional().describe('Updated bot ID for the conversation'),
	document_ids: z
		.array(z.string())
		.optional()
		.describe('Updated document IDs for focus mode'),
});

const ConversationsUpdateResponseSchema = z.object({
	data: ConversationDetailedSchema,
});

const ConversationsDeleteInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe('Unique identifier of the conversation to delete'),
});

const ConversationsDeleteResponseSchema = z.object({
	data: z.union([z.boolean(), z.null()]).optional(),
	success: z.boolean().optional(),
});

// ── Documents ────────────────────────────────────────────────────────────────

const DocumentsListInputSchema = z.object({
	search: z.string().optional().describe('Keyword to filter documents by name'),
	folder_id: z.string().optional().describe('Filter documents by folder ID'),
	conversation_id: z
		.string()
		.optional()
		.describe('Filter documents by conversation ID'),
});

const DocumentsListResponseSchema = z.object({
	data: z.array(CodyDocument),
	meta: PaginationMetaSchema.optional(),
});

const DocumentsCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the document'),
	content: z
		.string()
		.min(1)
		.max(786432)
		.describe('Text or HTML content of the document (up to 768 KB)'),
	content_type: z
		.enum(['text/plain', 'text/html'])
		.default('text/plain')
		.describe('MIME content type of the content body'),
	folder_id: z
		.string()
		.optional()
		.describe('Folder ID where the document should be stored'),
});

const DocumentsCreateResponseSchema = z.object({
	data: CodyDocument,
});

const DocumentsCreateFromFileInputSchema = z.object({
	key: z
		.string()
		.min(1)
		.describe('S3 storage key obtained from uploads.getSignedUrl'),
	folder_id: z
		.string()
		.optional()
		.describe('Folder ID where the document should be stored'),
});

const DocumentsCreateFromFileResponseSchema = z.object({
	data: CodyDocument,
});

const DocumentsCreateFromWebpageInputSchema = z.object({
	url: z.string().url().describe('Publicly accessible webpage URL to import'),
	folder_id: z
		.string()
		.optional()
		.describe('Folder ID where the document should be stored'),
});

const DocumentsCreateFromWebpageResponseSchema = z.object({
	data: CodyDocument,
});

const DocumentsGetInputSchema = z.object({
	id: z.string().min(1).describe('Unique identifier of the document'),
});

const DocumentsGetResponseSchema = z.object({
	data: CodyDocument,
});

const DocumentsDeleteInputSchema = z.object({
	id: z.string().min(1).describe('Unique identifier of the document to delete'),
});

const DocumentsDeleteResponseSchema = z.object({
	data: z.union([z.boolean(), z.null()]).optional(),
	success: z.boolean().optional(),
});

// ── Folders ──────────────────────────────────────────────────────────────────

const FoldersListInputSchema = z.object({
	search: z.string().optional().describe('Keyword to filter folders by name'),
});

const FoldersListResponseSchema = z.object({
	data: z.array(CodyFolder),
	meta: PaginationMetaSchema.optional(),
});

const FoldersCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the folder'),
});

const FoldersCreateResponseSchema = z.object({
	data: CodyFolder,
});

const FoldersGetInputSchema = z.object({
	id: z.string().min(1).describe('Unique identifier of the folder'),
});

const FoldersGetResponseSchema = z.object({
	data: CodyFolder,
});

const FoldersUpdateInputSchema = z.object({
	id: z.string().min(1).describe('Unique identifier of the folder to update'),
	name: z.string().min(1).describe('New name for the folder'),
});

const FoldersUpdateResponseSchema = z.object({
	data: CodyFolder,
});

// ── Messages ─────────────────────────────────────────────────────────────────

const MessageSourceSchema = z.object({
	// unknown: source object shape contains polymorphic document, webpage, or file references.
	data: z.array(z.record(z.string(), z.unknown())).optional(),
});

const MessageDetailedSchema = CodyMessage.extend({
	sources: MessageSourceSchema.optional(),
	usage: CodyUsage.optional(),
});

const MessagesListInputSchema = z.object({
	conversation_id: z
		.string()
		.min(1)
		.describe('Conversation ID to retrieve messages for'),
	includes: z
		.string()
		.optional()
		.describe('Extra message attributes to include (sources, usage)'),
});

const MessagesListResponseSchema = z.object({
	data: z.array(MessageDetailedSchema),
	meta: PaginationMetaSchema.optional(),
});

const MessagesSendInputSchema = z.object({
	conversation_id: z
		.string()
		.min(1)
		.describe('Conversation ID to send the message in'),
	content: z
		.string()
		.min(1)
		.max(2000)
		.describe('Text content of the message (up to 2000 characters)'),
});

const MessagesSendResponseSchema = z.object({
	data: MessageDetailedSchema,
});

const MessagesGetInputSchema = z.object({
	id: z.string().min(1).describe('Unique identifier of the message'),
	includes: z
		.string()
		.optional()
		.describe('Extra message attributes to include (sources, usage)'),
});

const MessagesGetResponseSchema = z.object({
	data: MessageDetailedSchema,
});

const MessagesSendForStreamInputSchema = z.object({
	conversation_id: z
		.string()
		.min(1)
		.describe('Conversation ID to send the streaming message in'),
	content: z
		.string()
		.min(1)
		.max(2000)
		.describe('Text content of the message (up to 2000 characters)'),
});

const MessagesSendForStreamResponseSchema = z.object({
	data: z.object({
		stream_url: z
			.string()
			.describe('Server-Sent Events (SSE) stream URL for AI response chunks'),
	}),
});

// ── Uploads ──────────────────────────────────────────────────────────────────

const UploadsGetSignedUrlInputSchema = z.object({
	file_name: z
		.string()
		.min(1)
		.describe(
			'Original file name with extension to upload (e.g. document.pdf)',
		),
	content_type: z
		.string()
		.min(1)
		.describe('MIME content type of the file (e.g. application/pdf)'),
});

const UploadsGetSignedUrlResponseSchema = z.object({
	data: z.object({
		url: z.string().describe('AWS S3 pre-signed upload URL for PUT request'),
		key: z
			.string()
			.describe('Storage key to pass to documents.createFromFile after upload'),
	}),
});

// ── Types Mapping ────────────────────────────────────────────────────────────

export type CodyEndpointInputs = {
	botsList: z.infer<typeof BotsListInputSchema>;
	conversationsList: z.infer<typeof ConversationsListInputSchema>;
	conversationsCreate: z.infer<typeof ConversationsCreateInputSchema>;
	conversationsGet: z.infer<typeof ConversationsGetInputSchema>;
	conversationsUpdate: z.infer<typeof ConversationsUpdateInputSchema>;
	conversationsDelete: z.infer<typeof ConversationsDeleteInputSchema>;
	documentsList: z.infer<typeof DocumentsListInputSchema>;
	documentsCreate: z.infer<typeof DocumentsCreateInputSchema>;
	documentsCreateFromFile: z.infer<typeof DocumentsCreateFromFileInputSchema>;
	documentsCreateFromWebpage: z.infer<
		typeof DocumentsCreateFromWebpageInputSchema
	>;
	documentsGet: z.infer<typeof DocumentsGetInputSchema>;
	documentsDelete: z.infer<typeof DocumentsDeleteInputSchema>;
	foldersList: z.infer<typeof FoldersListInputSchema>;
	foldersCreate: z.infer<typeof FoldersCreateInputSchema>;
	foldersGet: z.infer<typeof FoldersGetInputSchema>;
	foldersUpdate: z.infer<typeof FoldersUpdateInputSchema>;
	messagesList: z.infer<typeof MessagesListInputSchema>;
	messagesSend: z.infer<typeof MessagesSendInputSchema>;
	messagesGet: z.infer<typeof MessagesGetInputSchema>;
	messagesSendForStream: z.infer<typeof MessagesSendForStreamInputSchema>;
	uploadsGetSignedUrl: z.infer<typeof UploadsGetSignedUrlInputSchema>;
};

export type CodyEndpointOutputs = {
	botsList: z.infer<typeof BotsListResponseSchema>;
	conversationsList: z.infer<typeof ConversationsListResponseSchema>;
	conversationsCreate: z.infer<typeof ConversationsCreateResponseSchema>;
	conversationsGet: z.infer<typeof ConversationsGetResponseSchema>;
	conversationsUpdate: z.infer<typeof ConversationsUpdateResponseSchema>;
	conversationsDelete: z.infer<typeof ConversationsDeleteResponseSchema>;
	documentsList: z.infer<typeof DocumentsListResponseSchema>;
	documentsCreate: z.infer<typeof DocumentsCreateResponseSchema>;
	documentsCreateFromFile: z.infer<
		typeof DocumentsCreateFromFileResponseSchema
	>;
	documentsCreateFromWebpage: z.infer<
		typeof DocumentsCreateFromWebpageResponseSchema
	>;
	documentsGet: z.infer<typeof DocumentsGetResponseSchema>;
	documentsDelete: z.infer<typeof DocumentsDeleteResponseSchema>;
	foldersList: z.infer<typeof FoldersListResponseSchema>;
	foldersCreate: z.infer<typeof FoldersCreateResponseSchema>;
	foldersGet: z.infer<typeof FoldersGetResponseSchema>;
	foldersUpdate: z.infer<typeof FoldersUpdateResponseSchema>;
	messagesList: z.infer<typeof MessagesListResponseSchema>;
	messagesSend: z.infer<typeof MessagesSendResponseSchema>;
	messagesGet: z.infer<typeof MessagesGetResponseSchema>;
	messagesSendForStream: z.infer<typeof MessagesSendForStreamResponseSchema>;
	uploadsGetSignedUrl: z.infer<typeof UploadsGetSignedUrlResponseSchema>;
};

export const CodyEndpointInputSchemas = {
	botsList: BotsListInputSchema,
	conversationsList: ConversationsListInputSchema,
	conversationsCreate: ConversationsCreateInputSchema,
	conversationsGet: ConversationsGetInputSchema,
	conversationsUpdate: ConversationsUpdateInputSchema,
	conversationsDelete: ConversationsDeleteInputSchema,
	documentsList: DocumentsListInputSchema,
	documentsCreate: DocumentsCreateInputSchema,
	documentsCreateFromFile: DocumentsCreateFromFileInputSchema,
	documentsCreateFromWebpage: DocumentsCreateFromWebpageInputSchema,
	documentsGet: DocumentsGetInputSchema,
	documentsDelete: DocumentsDeleteInputSchema,
	foldersList: FoldersListInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
	messagesList: MessagesListInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSendForStream: MessagesSendForStreamInputSchema,
	uploadsGetSignedUrl: UploadsGetSignedUrlInputSchema,
} as const;

export const CodyEndpointOutputSchemas = {
	botsList: BotsListResponseSchema,
	conversationsList: ConversationsListResponseSchema,
	conversationsCreate: ConversationsCreateResponseSchema,
	conversationsGet: ConversationsGetResponseSchema,
	conversationsUpdate: ConversationsUpdateResponseSchema,
	conversationsDelete: ConversationsDeleteResponseSchema,
	documentsList: DocumentsListResponseSchema,
	documentsCreate: DocumentsCreateResponseSchema,
	documentsCreateFromFile: DocumentsCreateFromFileResponseSchema,
	documentsCreateFromWebpage: DocumentsCreateFromWebpageResponseSchema,
	documentsGet: DocumentsGetResponseSchema,
	documentsDelete: DocumentsDeleteResponseSchema,
	foldersList: FoldersListResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
	foldersGet: FoldersGetResponseSchema,
	foldersUpdate: FoldersUpdateResponseSchema,
	messagesList: MessagesListResponseSchema,
	messagesSend: MessagesSendResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesSendForStream: MessagesSendForStreamResponseSchema,
	uploadsGetSignedUrl: UploadsGetSignedUrlResponseSchema,
} as const;
