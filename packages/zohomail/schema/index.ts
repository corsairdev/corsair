import { z } from 'zod';
import { ZohoMailFolder, ZohoMailMessage } from './database';

export const ZohoMailCredentials = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
});

export type ZohoMailCredentials = z.infer<typeof ZohoMailCredentials>;

export const ZohoMailSchema = {
	version: '1.0.0',
	entities: {
		messages: ZohoMailMessage,
		folders: ZohoMailFolder,
	},
} as const;
