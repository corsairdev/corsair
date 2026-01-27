import { z } from 'zod';
import {
	SlackChannel,
	SlackFile,
	SlackMessage,
	SlackUser,
	SlackUserGroup,
} from './database';

export const SlackCredentials = z.object({
	botToken: z.string(),
	/** Signing secret for webhook verification (from Slack app settings). Optional for development. */
	signingSecret: z.string().optional(),
});

export type SlackCredentials = z.infer<typeof SlackCredentials>;

export const SlackSchema = {
	version: '1.1.0',
	entities: {
		messages: SlackMessage,
		channels: SlackChannel,
		users: SlackUser,
		files: SlackFile,
		userGroups: SlackUserGroup,
	},
} as const;
