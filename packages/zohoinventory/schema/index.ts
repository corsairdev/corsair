import { z } from 'zod';
import { ZohoInventoryOrganizationEntity } from './database';

export const ZohoInventoryCredentials = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
});

export type ZohoInventoryCredentials = z.infer<typeof ZohoInventoryCredentials>;

export const ZohoInventorySchema = {
	version: '1.0.0',
	entities: {
		organizations: ZohoInventoryOrganizationEntity,
	},
} as const;

export * from './database';
