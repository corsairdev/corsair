import {
	DraftsService,
	HistoryService,
	LabelsService,
	MessagesService,
	ThreadsService,
	UsersService,
} from './services';

export const Gmail = {
	Messages: {
		list: MessagesService.messagesList,
		get: MessagesService.messagesGet,
		send: MessagesService.messagesSend,
		delete: MessagesService.messagesDelete,
		modify: MessagesService.messagesModify,
		batchModify: MessagesService.messagesBatchModify,
		trash: MessagesService.messagesTrash,
		untrash: MessagesService.messagesUntrash,
		insert: MessagesService.messagesInsert,
		import: MessagesService.messagesImport,
	},

	Labels: {
		list: LabelsService.labelsList,
		get: LabelsService.labelsGet,
		create: LabelsService.labelsCreate,
		update: LabelsService.labelsUpdate,
		patch: LabelsService.labelsPatch,
		delete: LabelsService.labelsDelete,
	},

	Drafts: {
		list: DraftsService.draftsList,
		get: DraftsService.draftsGet,
		create: DraftsService.draftsCreate,
		update: DraftsService.draftsUpdate,
		delete: DraftsService.draftsDelete,
		send: DraftsService.draftsSend,
	},

	Threads: {
		list: ThreadsService.threadsList,
		get: ThreadsService.threadsGet,
		modify: ThreadsService.threadsModify,
		delete: ThreadsService.threadsDelete,
		trash: ThreadsService.threadsTrash,
		untrash: ThreadsService.threadsUntrash,
	},

	History: {
		list: HistoryService.historyList,
	},

	Users: {
		getProfile: UsersService.usersGetProfile,
		watch: UsersService.usersWatch,
		stop: UsersService.usersStop,
	},
};
