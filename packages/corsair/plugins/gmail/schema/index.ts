import { GmailDraft, GmailLabel, GmailMessage, GmailThread } from './database';
import { z } from 'zod';

export const GmailCredentials = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
});

export type GmailCredentials = z.infer<typeof GmailCredentials>;

export const GmailSchema = {
	version: '1.0.0',
	entities: {
		messages: GmailMessage,
		labels: GmailLabel,
		drafts: GmailDraft,
		threads: GmailThread,
	},
} as const;
