import { WhatsAppConversation, WhatsAppMessage } from './database';

export const WhatsAppSchema = {
	version: '1.0.0',
	entities: {
		messages: WhatsAppMessage,
		conversations: WhatsAppConversation,
	},
} as const;
