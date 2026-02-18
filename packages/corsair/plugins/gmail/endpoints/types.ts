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

const MessagesListInputSchema = z.object({
	userId: z.string().optional(),
	q: z.string().optional(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
	labelIds: z.array(z.string()).optional(),
	includeSpamTrash: z.boolean().optional(),
});

const MessagesGetInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	format: z.enum(['minimal', 'full', 'raw', 'metadata']).optional(),
	metadataHeaders: z.array(z.string()).optional(),
});

const MessagesSendInputSchema = z.object({
	userId: z.string().optional(),
	raw: z.string(),
	threadId: z.string().optional(),
});

const MessagesDeleteInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const MessagesModifyInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	addLabelIds: z.array(z.string()).optional(),
	removeLabelIds: z.array(z.string()).optional(),
});

const MessagesBatchModifyInputSchema = z.object({
	userId: z.string().optional(),
	ids: z.array(z.string()).optional(),
	addLabelIds: z.array(z.string()).optional(),
	removeLabelIds: z.array(z.string()).optional(),
});

const MessagesTrashInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const MessagesUntrashInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const LabelsListInputSchema = z.object({
	userId: z.string().optional(),
});

const LabelsGetInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const LabelsCreateInputSchema = z.object({
	userId: z.string().optional(),
	label: z.object({
		name: z.string().optional(),
		messageListVisibility: z.enum(['show', 'hide']).optional(),
		labelListVisibility: z
			.enum(['labelShow', 'labelShowIfUnread', 'labelHide'])
			.optional(),
		color: z
			.object({
				textColor: z.string().optional(),
				backgroundColor: z.string().optional(),
			})
			.optional(),
	}),
});

const LabelsUpdateInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	label: z.object({
		name: z.string().optional(),
		messageListVisibility: z.enum(['show', 'hide']).optional(),
		labelListVisibility: z
			.enum(['labelShow', 'labelShowIfUnread', 'labelHide'])
			.optional(),
		color: z
			.object({
				textColor: z.string().optional(),
				backgroundColor: z.string().optional(),
			})
			.optional(),
	}),
});

const LabelsDeleteInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const DraftsListInputSchema = z.object({
	userId: z.string().optional(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
	q: z.string().optional(),
});

const DraftsGetInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	format: z.enum(['minimal', 'full', 'raw', 'metadata']).optional(),
});

const DraftsCreateInputSchema = z.object({
	userId: z.string().optional(),
	draft: z.object({
		message: z
			.object({
				raw: z.string().optional(),
				threadId: z.string().optional(),
			})
			.optional(),
	}),
});

const DraftsUpdateInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	draft: z.object({
		message: z
			.object({
				raw: z.string().optional(),
				threadId: z.string().optional(),
			})
			.optional(),
	}),
});

const DraftsDeleteInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const DraftsSendInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string().optional(),
	message: z
		.object({
			raw: z.string().optional(),
			threadId: z.string().optional(),
		})
		.optional(),
});

const ThreadsListInputSchema = z.object({
	userId: z.string().optional(),
	q: z.string().optional(),
	maxResults: z.number().optional(),
	pageToken: z.string().optional(),
	labelIds: z.array(z.string()).optional(),
	includeSpamTrash: z.boolean().optional(),
});

const ThreadsGetInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	format: z.enum(['minimal', 'full', 'metadata']).optional(),
	metadataHeaders: z.array(z.string()).optional(),
});

const ThreadsModifyInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
	addLabelIds: z.array(z.string()).optional(),
	removeLabelIds: z.array(z.string()).optional(),
});

const ThreadsDeleteInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const ThreadsTrashInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const ThreadsUntrashInputSchema = z.object({
	userId: z.string().optional(),
	id: z.string(),
});

const UsersGetProfileInputSchema = z.object({
	userId: z.string().optional(),
});

export const GmailEndpointInputSchemas = {
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	messagesModify: MessagesModifyInputSchema,
	messagesBatchModify: MessagesBatchModifyInputSchema,
	messagesTrash: MessagesTrashInputSchema,
	messagesUntrash: MessagesUntrashInputSchema,
	labelsList: LabelsListInputSchema,
	labelsGet: LabelsGetInputSchema,
	labelsCreate: LabelsCreateInputSchema,
	labelsUpdate: LabelsUpdateInputSchema,
	labelsDelete: LabelsDeleteInputSchema,
	draftsList: DraftsListInputSchema,
	draftsGet: DraftsGetInputSchema,
	draftsCreate: DraftsCreateInputSchema,
	draftsUpdate: DraftsUpdateInputSchema,
	draftsDelete: DraftsDeleteInputSchema,
	draftsSend: DraftsSendInputSchema,
	threadsList: ThreadsListInputSchema,
	threadsGet: ThreadsGetInputSchema,
	threadsModify: ThreadsModifyInputSchema,
	threadsDelete: ThreadsDeleteInputSchema,
	threadsTrash: ThreadsTrashInputSchema,
	threadsUntrash: ThreadsUntrashInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
} as const;

export type GmailEndpointInputs = {
	[K in keyof typeof GmailEndpointInputSchemas]: z.infer<
		(typeof GmailEndpointInputSchemas)[K]
	>;
};

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
	internalDate: z.coerce.date().nullable().optional(),
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
