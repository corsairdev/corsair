import {
	getChat,
	getChatAdministrators,
	getChatMember,
} from './chat';
import {
	answerCallbackQuery,
	answerInlineQuery,
} from './callback';
import { getFile } from './file';
import {
	sendMessage,
	sendMessageAndWaitForResponse,
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
} from './messages';
import { setWebhook, deleteWebhook } from './webhook';
import { getUpdates } from './updates';
import { getMe } from './me';

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
	sendMessageAndWaitForResponse,
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
