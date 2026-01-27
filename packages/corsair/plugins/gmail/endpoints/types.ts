import type {
	BatchModifyMessagesRequest,
	Draft,
	DraftListResponse,
	Label,
	LabelListResponse,
	Message,
	MessageListResponse,
	ModifyMessageRequest,
	ModifyThreadRequest,
	Profile,
	Thread,
	ThreadListResponse,
} from '../types';

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
