import {
	createChat,
	getMessages,
	listChats,
} from '../chat-store.js';
import type { HandlerFn } from '../types.js';

export const listChatsHandler: HandlerFn = async () => {
	return { chats: listChats() };
};

export const createChatHandler: HandlerFn = async () => {
	return { chat: createChat() };
};

export const getChatMessagesHandler: HandlerFn = async (ctx) => {
	const chatId = ctx.url.searchParams.get('chatId');
	if (!chatId) throw new Error('chatId is required');
	return { messages: getMessages(chatId) };
};
