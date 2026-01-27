import { z } from 'zod';
import { ResendDomain, ResendEmail } from './database';

export const ResendCredentials = z.object({
	apiKey: z.string(),
	secret: z.string().optional(),
});

export type ResendCredentials = z.infer<typeof ResendCredentials>;

export const ResendSchema = {
	version: '1.0.0',
	entities: {
		emails: ResendEmail,
		domains: ResendDomain,
	},
} as const;
