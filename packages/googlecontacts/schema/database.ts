import { z } from 'zod';

export const GoogleContact = z.object({
	resourceName: z.string(),
	etag: z.string().optional(),
	displayName: z.string().optional(),
	givenName: z.string().optional(),
	familyName: z.string().optional(),
	primaryEmail: z.string().optional(),
	emails: z.array(z.string()).optional(),
	primaryPhone: z.string().optional(),
	phones: z.array(z.string()).optional(),
	organization: z.string().optional(),
	jobTitle: z.string().optional(),
	photoUrl: z.string().optional(),
	createdAt: z.coerce.date().optional(),
});

export const GoogleContactGroup = z.object({
	resourceName: z.string(),
	etag: z.string().optional(),
	name: z.string().optional(),
	formattedName: z.string().optional(),
	groupType: z.string().optional(),
	memberCount: z.number().optional(),
	createdAt: z.coerce.date().optional(),
});

export type GoogleContact = z.infer<typeof GoogleContact>;
export type GoogleContactGroup = z.infer<typeof GoogleContactGroup>;
