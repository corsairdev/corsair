import * as AccountEndpoints from './account';
import * as ContactsEndpoints from './contacts';
import * as FilesEndpoints from './files';
import * as LinksEndpoints from './links';
import * as MembersEndpoints from './members';
import * as MessagesEndpoints from './messages';
import * as RoomsEndpoints from './rooms';
import * as TasksEndpoints from './tasks';

export const Account = {
	get: AccountEndpoints.get,
	getStatus: AccountEndpoints.getStatus,
	listTasks: AccountEndpoints.listTasks,
};

export const Contacts = {
	list: ContactsEndpoints.list,
	listIncomingRequests: ContactsEndpoints.listIncomingRequests,
};

export const Rooms = {
	list: RoomsEndpoints.list,
	get: RoomsEndpoints.get,
	create: RoomsEndpoints.create,
	update: RoomsEndpoints.update,
	delete: RoomsEndpoints.deleteRoom,
};

export const Links = {
	get: LinksEndpoints.get,
	create: LinksEndpoints.create,
	update: LinksEndpoints.update,
	delete: LinksEndpoints.deleteLink,
};

export const Messages = {
	list: MessagesEndpoints.list,
	get: MessagesEndpoints.get,
	send: MessagesEndpoints.send,
	update: MessagesEndpoints.update,
	delete: MessagesEndpoints.deleteMessage,
	markRead: MessagesEndpoints.markRead,
	markUnread: MessagesEndpoints.markUnread,
};

export const Members = {
	list: MembersEndpoints.list,
	update: MembersEndpoints.update,
};

export const Tasks = {
	list: TasksEndpoints.list,
	get: TasksEndpoints.get,
	create: TasksEndpoints.create,
	updateStatus: TasksEndpoints.updateStatus,
};

export const Files = {
	list: FilesEndpoints.list,
	get: FilesEndpoints.get,
	upload: FilesEndpoints.upload,
};

export * from './types';
