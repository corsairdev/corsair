import { z } from 'zod';
import {
	SlackChannel,
	SlackFile,
	SlackMessage,
	SlackUser,
	SlackUsergroup,
} from './database';

export const SlackCredentials = z.object({
	botToken: z.string(),
});

export type SlackCredentials = z.infer<typeof SlackCredentials>;

export const SlackSchema = {
	version: '1.1.0',
	services: {
		messages: SlackMessage,
		channels: SlackChannel,
		users: SlackUser,
		files: SlackFile,
		userGroups: SlackUsergroup,
	},
} as const;
