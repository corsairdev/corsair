import {
	get as messagesGet,
	list as messagesList,
	send as messagesSend,
} from './messages';

export const Messages = {
	get: messagesGet,
	list: messagesList,
	send: messagesSend,
};

export * from './types';
