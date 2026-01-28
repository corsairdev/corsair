import { PostHogEvent } from './database';

export const PostHogSchema = {
	version: '1.0.0',
	entities: {
		events: PostHogEvent,
	},
} as const;
