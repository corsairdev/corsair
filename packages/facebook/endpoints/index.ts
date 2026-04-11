import { getMessages, sendMessage } from './messages';
import { getPageDetails, listConversations } from './pages';

export const Messages = {
	sendMessage,
	getMessages,
};

export const Pages = {
	getPageDetails,
	listConversations,
};

export * from './types';
