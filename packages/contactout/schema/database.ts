import { z } from 'zod';

// Source: LinkedIn Profile API and People Search API response fields,
// https://api.contactout.com/#linkedin-profile-api
export const ContactOutProfile = z.object({
	linkedinUrl: z.string(),
	fullName: z.string().nullable().optional(),
	headline: z.string().nullable().optional(),
	companyName: z.string().nullable().optional(),
	companyDomain: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	seniority: z.string().nullable().optional(),
	hasWorkEmail: z.boolean().optional(),
	hasPersonalEmail: z.boolean().optional(),
	hasPhone: z.boolean().optional(),
	updatedAt: z.coerce.date(),
});

export type ContactOutProfile = z.infer<typeof ContactOutProfile>;

// Source: Company Search API and domain enrich response fields,
// https://api.contactout.com/#company-search-api
export const ContactOutCompany = z.object({
	domain: z.string(),
	name: z.string().nullable().optional(),
	linkedinUrl: z.string().nullable().optional(),
	industry: z.string().nullable().optional(),
	size: z.number().nullable().optional(),
	country: z.string().nullable().optional(),
	foundedAt: z.number().nullable().optional(),
	updatedAt: z.coerce.date(),
});

export type ContactOutCompany = z.infer<typeof ContactOutCompany>;
