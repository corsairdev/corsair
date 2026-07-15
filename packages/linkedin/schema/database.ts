import { z } from 'zod';

export const LinkedInUser = z.object({
	id: z.string().describe('The LinkedIn member ID of the authenticated user.'),
	sub: z.string().optional().describe('The OIDC subject identifier.'),
	name: z
		.string()
		.nullable()
		.optional()
		.describe('Display name of the member.'),
	given_name: z.string().nullable().optional().describe('First name.'),
	family_name: z.string().nullable().optional().describe('Last name.'),
	picture: z.string().nullable().optional().describe('Profile picture URL.'),
	email: z.string().nullable().optional().describe('Primary email address.'),
	locale: z.string().nullable().optional().describe('Preferred locale.'),
	headline: z.string().nullable().optional().describe('Profile headline.'),
	vanityName: z.string().nullable().optional().describe('Public vanity name.'),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type LinkedInUser = z.infer<typeof LinkedInUser>;
