import { answerCallbackQuery, answerInlineQuery } from './callback';
import { getChat, getChatAdministrators, getChatMember } from './chat';
import { getFile } from './file';
import { getMe } from './me';
import {
	deleteMessage,
	editMessageText,
	pinChatMessage,
	sendAnimation,
	sendAudio,
	sendChatAction,
	sendDocument,
	sendLocation,
	sendMediaGroup,
	sendMessage,
	sendPhoto,
	sendSticker,
	sendVideo,
	unpinChatMessage,
} from './messages';
import { getUpdates } from './updates';
import { deleteWebhook, setWebhook } from './webhook';

export const Chat = {
	getChat,
	getChatAdministrators,
	getChatMember,
};

export const Callback = {
	answerCallbackQuery,
	answerInlineQuery,
};

export const File = {
	getFile,
};

export const Messages = {
	sendMessage,
	editMessageText,
	deleteMessage,
	pinChatMessage,
	unpinChatMessage,
	sendPhoto,
	sendVideo,
	sendAudio,
	sendDocument,
	sendSticker,
	sendAnimation,
	sendLocation,
	sendMediaGroup,
	sendChatAction,
};

export const Webhook = {
	setWebhook,
	deleteWebhook,
};

export const Updates = {
	getUpdates,
};

export const Me = {
	getMe,
};

export * from './types';
