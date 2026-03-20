import {
	IntercomAdmin,
	IntercomArticle,
	IntercomCompany,
	IntercomContact,
	IntercomConversation,
} from './database';

export const IntercomSchema = {
	version: '1.0.0',
	entities: {
		contacts: IntercomContact,
		conversations: IntercomConversation,
		companies: IntercomCompany,
		articles: IntercomArticle,
		admins: IntercomAdmin,
	},
} as const;
