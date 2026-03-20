import {
	TelegramChat,
	TelegramFile,
	TelegramMessage,
	TelegramPoll,
	TelegramUser,
} from './database';

export const TelegramSchema = {
	version: '1.0.0',
	entities: {
		messages: TelegramMessage,
		chats: TelegramChat,
		users: TelegramUser,
		files: TelegramFile,
		polls: TelegramPoll,
	},
} as const;
