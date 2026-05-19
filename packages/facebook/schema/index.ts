import {
	FacebookConversation,
	FacebookMessage,
	FacebookPage,
} from './database';

export const FacebookSchema = {
	version: '1.0.0',
	entities: {
		messages: FacebookMessage,
		conversations: FacebookConversation,
		pages: FacebookPage,
	},
} as const;
