import { z } from 'zod';
import { SlackChannel, SlackMessage } from './database';

export const SlackCredentials = z.object({
	botToken: z.string(),
});

export type SlackCredentials = z.infer<typeof SlackCredentials>;

export const SlackSchema = {
	version: '1.1.0',
	services: {
		messages: SlackMessage,
		channels: SlackChannel,
	},
} as const;
