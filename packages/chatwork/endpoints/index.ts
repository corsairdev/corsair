import * as AccountEndpoints from './account';
import * as MembersEndpoints from './members';
import * as MessagesEndpoints from './messages';
import * as RoomsEndpoints from './rooms';

export const Account = {
	get: AccountEndpoints.get,
};

export const Rooms = {
	list: RoomsEndpoints.list,
	get: RoomsEndpoints.get,
};

export const Messages = {
	list: MessagesEndpoints.list,
	get: MessagesEndpoints.get,
	send: MessagesEndpoints.send,
};

export const Members = {
	list: MembersEndpoints.list,
};

export * from './types';
