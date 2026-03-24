import { HackerNewsItem, HackerNewsUser } from './database';

export const HackerNewsSchema = {
	version: '1.0.0',
	entities: {
		items: HackerNewsItem,
		users: HackerNewsUser,
	},
} as const;
