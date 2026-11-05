import { RetellCallEntity, RetellChatEntity } from './database';

export const RetellSchema = {
	version: '1.0.0',
	entities: {
		calls: RetellCallEntity,
		chats: RetellChatEntity,
	},
} as const;
