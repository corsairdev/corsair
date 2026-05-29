import { BlueskyPost } from './database';

export const BlueskySchema = {
	version: '1.0.0',
	entities: {
		posts: BlueskyPost,
	},
} as const;

export type { BlueskyPost } from './database';
