import {
	NotionBlock,
	NotionDatabase,
	NotionPage,
	NotionUser,
} from './database';

export const NotionSchema = {
	version: '1.0.0',
	entities: {
		blocks: NotionBlock,
		databases: NotionDatabase,
		pages: NotionPage,
		users: NotionUser,
	},
} as const;
