import { getStatus } from './accounts';
import { sendChat, sendImage, sendLink, sendMedia } from './messages';

export const Messages = {
	sendChat,
	sendImage,
	sendLink,
	sendMedia,
};

export const Accounts = {
	getStatus,
};

export * from './types';
