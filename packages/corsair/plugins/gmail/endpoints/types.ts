import { z } from 'zod';
import type {
	Draft,
	DraftListResponse,
	Label,
	LabelListResponse,
	Message,
	MessageListResponse,
	Profile,
	Thread,
	ThreadListResponse,
} from '../types';

const MessagePartHeaderSchema = z.object({
	name: z.string().optional(),
	value: z.string().optional(),
});

const MessagePartBodySchema = z.object({
	attachmentId: z.string().optional(),
	size: z.number().optional(),
	data: z.string().optional(),
});

const MessagePartSchema: z.ZodType<any> = z.lazy(() =>
	z.object({
		partId: z.string().optional(),
		mimeType: z.string().optional(),
		filename: z.string().optional(),
		headers: z.array(MessagePartHeaderSchema).optional(),
		body: MessagePartBodySchema.optional(),
		parts: z.array(MessagePartSchema).optional(),
	}),
);

const MessageSchema = z.object({
	id: z.string().optional(),
	threadId: z.string().optional(),
	labelIds: z.array(z.string()).optional(),
	snippet: z.string().optional(),
	historyId: z.string().optional(),
	internalDate: z.string().optional(),
	sizeEstimate: z.number().optional(),
	payload: MessagePartSchema.optional(),
	raw: z.string().optional(),
});

const MessageListResponseSchema = z.object({
	messages: z.array(MessageSchema).optional(),
	nextPageToken: z.string().optional(),
	resultSizeEstimate: z.number().optional(),
});

const LabelColorSchema = z.object({
	textColor: z.string().optional(),
	backgroundColor: z.string().optional(),
});

const LabelSchema = z.object({
	id: z.string().optional(),
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
	color: LabelColorSchema.optional(),
});

const LabelListResponseSchema = z.object({
	labels: z.array(LabelSchema).optional(),
});

const DraftSchema = z.object({
	id: z.string().optional(),
	message: MessageSchema.optional(),
});

const DraftListResponseSchema = z.object({
	drafts: z.array(DraftSchema).optional(),
	nextPageToken: z.string().optional(),
	resultSizeEstimate: z.number().optional(),
});

const ThreadSchema = z.object({
	id: z.string().optional(),
	snippet: z.string().optional(),
	historyId: z.string().optional(),
	messages: z.array(MessageSchema).optional(),
});

const ThreadListResponseSchema = z.object({
	threads: z.array(ThreadSchema).optional(),
	nextPageToken: z.string().optional(),
	resultSizeEstimate: z.number().optional(),
});

const ProfileSchema = z.object({
	emailAddress: z.string().optional(),
	messagesTotal: z.number().optional(),
	threadsTotal: z.number().optional(),
	historyId: z.string().optional(),
});

export const GmailEndpointOutputSchemas = {
	messagesList: MessageListResponseSchema,
	messagesGet: MessageSchema,
	messagesSend: MessageSchema,
	messagesDelete: z.void(),
	messagesModify: MessageSchema,
	messagesBatchModify: z.void(),
	messagesTrash: MessageSchema,
	messagesUntrash: MessageSchema,
	labelsList: LabelListResponseSchema,
	labelsGet: LabelSchema,
	labelsCreate: LabelSchema,
	labelsUpdate: LabelSchema,
	labelsDelete: z.void(),
	draftsList: DraftListResponseSchema,
	draftsGet: DraftSchema,
	draftsCreate: DraftSchema,
	draftsUpdate: DraftSchema,
	draftsDelete: z.void(),
	draftsSend: MessageSchema,
	threadsList: ThreadListResponseSchema,
	threadsGet: ThreadSchema,
	threadsModify: ThreadSchema,
	threadsDelete: z.void(),
	threadsTrash: ThreadSchema,
	threadsUntrash: ThreadSchema,
	usersGetProfile: ProfileSchema,
} as const;

export type GmailEndpointOutputs = {
	messagesList: MessageListResponse;
	messagesGet: Message;
	messagesSend: Message;
	messagesDelete: void;
	messagesModify: Message;
	messagesBatchModify: void;
	messagesTrash: Message;
	messagesUntrash: Message;
	labelsList: LabelListResponse;
	labelsGet: Label;
	labelsCreate: Label;
	labelsUpdate: Label;
	labelsDelete: void;
	draftsList: DraftListResponse;
	draftsGet: Draft;
	draftsCreate: Draft;
	draftsUpdate: Draft;
	draftsDelete: void;
	draftsSend: Message;
	threadsList: ThreadListResponse;
	threadsGet: Thread;
	threadsModify: Thread;
	threadsDelete: void;
	threadsTrash: Thread;
	threadsUntrash: Thread;
	usersGetProfile: Profile;
};
