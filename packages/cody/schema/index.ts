import {
	CodyBot,
	CodyConversation,
	CodyDocument,
	CodyFolder,
	CodyMessage,
	CodyUsage,
} from './database';

export const CodySchema = {
	version: '1.0.0',
	entities: {
		bots: CodyBot,
		conversations: CodyConversation,
		documents: CodyDocument,
		folders: CodyFolder,
		messages: CodyMessage,
		usage: CodyUsage,
	},
} as const;

export * from './database';
