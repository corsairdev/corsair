import { BotbabaBotEntity, BotbabaConversationEntity } from './database';

export const BotbabaSchema = {
	version: '1.0.0',
	entities: {
		bots: BotbabaBotEntity,
		conversations: BotbabaConversationEntity,
	},
} as const;
