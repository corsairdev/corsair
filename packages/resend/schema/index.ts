import { ResendDomain, ResendEmail } from './database';

export const ResendSchema = {
	version: '1.0.0',
	entities: {
		emails: ResendEmail,
		domains: ResendDomain,
	},
} as const;
