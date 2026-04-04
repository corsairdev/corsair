import * as Drafts from './drafts';
import * as Labels from './labels';
import * as Messages from './messages';
import * as Threads from './threads';

export const MessagesEndpoints = {
	list: Messages.list,
	get: Messages.get,
	send: Messages.send,
	delete: Messages.deleteMessage,
	modify: Messages.modify,
	batchModify: Messages.batchModify,
	trash: Messages.trash,
	untrash: Messages.untrash,
};

export const LabelsEndpoints = {
	list: Labels.list,
	get: Labels.get,
	create: Labels.create,
	update: Labels.update,
	delete: Labels.deleteLabel,
};

export const DraftsEndpoints = {
	list: Drafts.list,
	get: Drafts.get,
	create: Drafts.create,
	update: Drafts.update,
	delete: Drafts.deleteDraft,
	send: Drafts.send,
};

export const ThreadsEndpoints = {
	list: Threads.list,
	get: Threads.get,
	modify: Threads.modify,
	delete: Threads.deleteThread,
	trash: Threads.trash,
	untrash: Threads.untrash,
};

export * from './types';
