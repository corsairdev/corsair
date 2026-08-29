import { MailcheckEntities } from './database';

export const MailcheckSchema = {
	version: '1.0.0',
	entities: MailcheckEntities,
} as const;
