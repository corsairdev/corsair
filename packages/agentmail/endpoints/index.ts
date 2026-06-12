import { get as messagesGet, list as messagesList } from './messages';

export const Messages = {
	get: messagesGet,
	list: messagesList,
};

export * from './types';
