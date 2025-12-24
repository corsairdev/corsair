import { z } from 'zod';

// Zod Schemas
export const MessagePartHeaderSchema = z.object({
    name: z.string().optional(),
    value: z.string().optional(),
});
export type MessagePartHeader = z.infer<typeof MessagePartHeaderSchema>;

export const MessagePartBodySchema = z.object({
    attachmentId: z.string().optional(),
    size: z.number().optional(),
    data: z.string().optional(),
});
export type MessagePartBody = z.infer<typeof MessagePartBodySchema>;

export const MessagePartSchema: z.ZodType<any> = z.lazy(() => z.object({
    partId: z.string().optional(),
    mimeType: z.string().optional(),
    filename: z.string().optional(),
    headers: z.array(MessagePartHeaderSchema).optional(),
    body: MessagePartBodySchema.optional(),
    parts: z.array(z.lazy(() => MessagePartSchema)).optional(),
}).passthrough());
export type MessagePart = z.infer<typeof MessagePartSchema>;

export const MessageSchema = z.object({
    id: z.string().optional(),
    threadId: z.string().optional(),
    labelIds: z.array(z.string()).optional(),
    snippet: z.string().optional(),
    historyId: z.string().optional(),
    internalDate: z.string().optional(),
    payload: MessagePartSchema.optional(),
    sizeEstimate: z.number().optional(),
    raw: z.string().optional(),
});
export type Message = z.infer<typeof MessageSchema>;

export const MessageListResponseSchema = z.object({
    messages: z.array(MessageSchema).optional(),
    nextPageToken: z.string().optional(),
    resultSizeEstimate: z.number().optional(),
});
export type MessageListResponse = z.infer<typeof MessageListResponseSchema>;

export const ModifyMessageRequestSchema = z.object({
    addLabelIds: z.array(z.string()).optional(),
    removeLabelIds: z.array(z.string()).optional(),
});
export type ModifyMessageRequest = z.infer<typeof ModifyMessageRequestSchema>;

export const BatchModifyMessagesRequestSchema = z.object({
    ids: z.array(z.string()).optional(),
    addLabelIds: z.array(z.string()).optional(),
    removeLabelIds: z.array(z.string()).optional(),
});
export type BatchModifyMessagesRequest = z.infer<typeof BatchModifyMessagesRequestSchema>;

export const LabelColorSchema = z.object({
    textColor: z.string().optional(),
    backgroundColor: z.string().optional(),
});

export const LabelSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    messageListVisibility: z.enum(['show', 'hide']).optional(),
    labelListVisibility: z.enum(['labelShow', 'labelShowIfUnread', 'labelHide']).optional(),
    type: z.enum(['system', 'user']).optional(),
    messagesTotal: z.number().optional(),
    messagesUnread: z.number().optional(),
    threadsTotal: z.number().optional(),
    threadsUnread: z.number().optional(),
    color: LabelColorSchema.optional(),
});
export type Label = z.infer<typeof LabelSchema>;

export const LabelListResponseSchema = z.object({
    labels: z.array(LabelSchema).optional(),
});
export type LabelListResponse = z.infer<typeof LabelListResponseSchema>;

export const DraftSchema = z.object({
    id: z.string().optional(),
    message: MessageSchema.optional(),
});
export type Draft = z.infer<typeof DraftSchema>;

export const DraftListResponseSchema = z.object({
    drafts: z.array(DraftSchema).optional(),
    nextPageToken: z.string().optional(),
    resultSizeEstimate: z.number().optional(),
});
export type DraftListResponse = z.infer<typeof DraftListResponseSchema>;

export const ThreadSchema = z.object({
    id: z.string().optional(),
    snippet: z.string().optional(),
    historyId: z.string().optional(),
    messages: z.array(MessageSchema).optional(),
});
export type Thread = z.infer<typeof ThreadSchema>;

export const ThreadListResponseSchema = z.object({
    threads: z.array(ThreadSchema).optional(),
    nextPageToken: z.string().optional(),
    resultSizeEstimate: z.number().optional(),
});
export type ThreadListResponse = z.infer<typeof ThreadListResponseSchema>;

export const ModifyThreadRequestSchema = z.object({
    addLabelIds: z.array(z.string()).optional(),
    removeLabelIds: z.array(z.string()).optional(),
});
export type ModifyThreadRequest = z.infer<typeof ModifyThreadRequestSchema>;

export const HistoryMessageAddedSchema = z.object({
    message: MessageSchema.optional(),
});
export type HistoryMessageAdded = z.infer<typeof HistoryMessageAddedSchema>;

export const HistoryMessageDeletedSchema = z.object({
    message: MessageSchema.optional(),
});
export type HistoryMessageDeleted = z.infer<typeof HistoryMessageDeletedSchema>;

export const HistoryLabelAddedSchema = z.object({
    message: MessageSchema.optional(),
    labelIds: z.array(z.string()).optional(),
});
export type HistoryLabelAdded = z.infer<typeof HistoryLabelAddedSchema>;

export const HistoryLabelRemovedSchema = z.object({
    message: MessageSchema.optional(),
    labelIds: z.array(z.string()).optional(),
});
export type HistoryLabelRemoved = z.infer<typeof HistoryLabelRemovedSchema>;

export const HistorySchema = z.object({
    id: z.string().optional(),
    messages: z.array(MessageSchema).optional(),
    messagesAdded: z.array(HistoryMessageAddedSchema).optional(),
    messagesDeleted: z.array(HistoryMessageDeletedSchema).optional(),
    labelsAdded: z.array(HistoryLabelAddedSchema).optional(),
    labelsRemoved: z.array(HistoryLabelRemovedSchema).optional(),
});
export type History = z.infer<typeof HistorySchema>;

export const HistoryListResponseSchema = z.object({
    history: z.array(HistorySchema).optional(),
    nextPageToken: z.string().optional(),
    historyId: z.string().optional(),
});
export type HistoryListResponse = z.infer<typeof HistoryListResponseSchema>;

export const WatchRequestSchema = z.object({
    labelIds: z.array(z.string()).optional(),
    labelFilterAction: z.enum(['include', 'exclude']).optional(),
    topicName: z.string().optional(),
});
export type WatchRequest = z.infer<typeof WatchRequestSchema>;

export const WatchResponseSchema = z.object({
    historyId: z.string().optional(),
    expiration: z.string().optional(),
});
export type WatchResponse = z.infer<typeof WatchResponseSchema>;

export const ProfileSchema = z.object({
    emailAddress: z.string().optional(),
    messagesTotal: z.number().optional(),
    threadsTotal: z.number().optional(),
    historyId: z.string().optional(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const SendMessageRequestSchema = z.object({
    raw: z.string().optional(),
    threadId: z.string().optional(),
});
export type SendMessageRequest = z.infer<typeof SendMessageRequestSchema>;

export const GmailErrorSchema = z.object({
    error: z.object({
        code: z.number().optional(),
        message: z.string().optional(),
        errors: z.array(z.object({
            domain: z.string().optional(),
            reason: z.string().optional(),
            message: z.string().optional(),
        })).optional(),
    }).optional(),
});
export type GmailError = z.infer<typeof GmailErrorSchema>;

// Argument schemas for service methods
export const MessagesListArgsSchema = z.object({
    userId: z.string().default('me'),
    q: z.string().optional(),
    maxResults: z.number().optional(),
    pageToken: z.string().optional(),
    labelIds: z.array(z.string()).optional(),
    includeSpamTrash: z.boolean().optional(),
});
export type MessagesListArgs = z.infer<typeof MessagesListArgsSchema>;

export const MessagesGetArgsSchema = z.object({
    userId: z.string().default('me'),
    id: z.string(),
    format: z.enum(['minimal', 'full', 'raw', 'metadata']).optional(),
    metadataHeaders: z.array(z.string()).optional(),
});
export type MessagesGetArgs = z.infer<typeof MessagesGetArgsSchema>;

export const MessagesSendArgsSchema = z.object({
    userId: z.string().default('me'),
    body: SendMessageRequestSchema,
});
export type MessagesSendArgs = z.infer<typeof MessagesSendArgsSchema>;

export const MessagesDeleteArgsSchema = z.object({
    userId: z.string().default('me'),
    id: z.string(),
});
export type MessagesDeleteArgs = z.infer<typeof MessagesDeleteArgsSchema>;

export const MessagesModifyArgsSchema = z.object({
    userId: z.string().default('me'),
    id: z.string(),
    body: ModifyMessageRequestSchema,
});
export type MessagesModifyArgs = z.infer<typeof MessagesModifyArgsSchema>;

