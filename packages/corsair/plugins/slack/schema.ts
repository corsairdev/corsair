import { z } from 'zod';

export const SlackAuthenticationSchema = z.object({
	botToken: z.string(),
});

export const slackMessageSchema = z.object({
	// Slack identifiers
	id: z.string(), // usually the message ts
	channel: z.string(),
	text: z.string(),
	// Optional metadata
	authorId: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export const slackChannelSchema = z.object({
	// Slack identifiers
	id: z.string(),
	name: z.string(),
	createdAt: z.coerce.date().optional(),
});

export type SlackMessage = z.infer<typeof slackMessageSchema>;
export type SlackChannel = z.infer<typeof slackChannelSchema>;
export type SlackAuthenticationSchema = z.infer<
	typeof SlackAuthenticationSchema
>;

export const slackSchema = {
	version: '1.1.0',
	services: {
		messages: slackMessageSchema,
		channels: slackChannelSchema,
	},
} as const;
