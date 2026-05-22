import { get as callsGet, list as callsList } from './calls';
import { get as messagesGet, list as messagesList } from './messages';

export const Messages = {
	list: messagesList,
	get: messagesGet,
};

export const Calls = {
	list: callsList,
	get: callsGet,
};

export * from './types';
