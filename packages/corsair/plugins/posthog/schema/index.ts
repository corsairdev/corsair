import { z } from 'zod';
import { PostHogEvent } from './database';

export const PostHogCredentials = z.object({
	apiKey: z.string(),
	secret: z.string().optional(),
});

export type PostHogCredentials = z.infer<typeof PostHogCredentials>;

export const PostHogSchema = {
	version: '1.0.0',
	services: {
		events: PostHogEvent,
	},
} as const;
