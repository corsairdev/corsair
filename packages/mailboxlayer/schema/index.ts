import { MailboxLayerEmailCheck } from './database';

export const MailboxLayerSchema = {
	version: '1.0.0',
	entities: {
		emailChecks: MailboxLayerEmailCheck,
	},
} as const;
