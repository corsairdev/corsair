import { ChatfaiCharacter, ChatfaiConversation } from './database';

export const ChatfaiSchema = {
	version: '1.0.0',
	entities: {
		characters: ChatfaiCharacter,
		conversations: ChatfaiConversation,
	},
} as const;

export { ChatfaiCharacter, ChatfaiConversation } from './database';
