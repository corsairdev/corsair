import {
	ChatworkAccount,
	ChatworkMember,
	ChatworkMessage,
	ChatworkRoom,
} from './database';

export const ChatworkSchema = {
	version: '1.0.0',
	entities: {
		accounts: ChatworkAccount,
		rooms: ChatworkRoom,
		messages: ChatworkMessage,
		members: ChatworkMember,
	},
} as const;

export * from './database';
