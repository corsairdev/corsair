import * as Folders from './folders';
import * as Messages from './messages';

export const MessagesEndpoints = {
	list: Messages.list,
	get: Messages.get,
	send: Messages.send,
	delete: Messages.deleteMessage,
	move: Messages.move,
	markRead: Messages.markRead,
	markUnread: Messages.markUnread,
};

export const FoldersEndpoints = {
	list: Folders.list,
	get: Folders.get,
	create: Folders.create,
	update: Folders.update,
	delete: Folders.deleteFolder,
};

export * from './types';
