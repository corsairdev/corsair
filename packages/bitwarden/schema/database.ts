import { z } from 'zod';

// Organizations - cached for searching and listing
export const BitwardenOrganization = z.object({
	id: z.string().describe('Organization ID'),
	name: z.string().describe('Organization name'),
	billingEmail: z.string().describe('Billing email'),
	businessName: z.string().nullable().optional().describe('Business name'),
	businessCountry: z.string().nullable().optional().describe('Country'),
});
export type BitwardenOrganization = z.infer<typeof BitwardenOrganization>;

// Collections - cached for searching within organizations
export const BitwardenCollection = z.object({
	id: z.string().describe('Collection ID'),
	organizationId: z.string().describe('Organization ID'),
	name: z.string().describe('Collection name'),
	externalId: z.string().nullable().optional().describe('External ID'),
});
export type BitwardenCollection = z.infer<typeof BitwardenCollection>;

// Members - cached for team/access management
export const BitwardenMember = z.object({
	id: z.string().describe('Member ID'),
	organizationId: z.string().describe('Organization ID'),
	email: z.string().describe('Member email'),
	name: z.string().describe('Member name'),
	status: z.number().describe('Member status code'),
	type: z.number().describe('Member type code'),
	twoFactorEnabled: z.boolean().describe('2FA enabled'),
	accessAll: z.boolean().describe('Has access to all collections'),
});
export type BitwardenMember = z.infer<typeof BitwardenMember>;

// Cipher metadata - cached for listing (NO full credential payloads)
export const BitwardenCipherMetadata = z.object({
	id: z.string().describe('Cipher ID'),
	organizationId: z
		.string()
		.nullable()
		.optional()
		.describe('Organization ID if org cipher'),
	name: z.string().describe('Cipher name'),
	type: z
		.number()
		.describe('Cipher type (1=login, 2=note, 3=card, 4=identity)'),
	favorite: z.boolean().describe('Marked as favorite'),
	edit: z.boolean().describe('User can edit'),
});
export type BitwardenCipherMetadata = z.infer<typeof BitwardenCipherMetadata>;
