import { GmailDraft, GmailLabel, GmailMessage, GmailThread } from './database';

export const GmailSchema = {
	version: '1.0.0',
	entities: {
		messages: GmailMessage,
		labels: GmailLabel,
		drafts: GmailDraft,
		threads: GmailThread,
	},
} as const;
