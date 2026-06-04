import {
	create as callsCreate,
	get as callsGet,
	list as callsList,
} from './calls';
import {
	get as messagesGet,
	list as messagesList,
	send as messagesSend,
} from './messages';

export const Messages = {
	send: messagesSend,
	get: messagesGet,
	list: messagesList,
};

export const Calls = {
	create: callsCreate,
	get: callsGet,
	list: callsList,
};

export * from './types';
