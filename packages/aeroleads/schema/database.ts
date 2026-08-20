import { z } from 'zod';

export const AeroLeadsProfile = z.object({
	id: z.string(),
	linkedin_url: z.string(),
	full_name: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	job_title_role: z.string().optional(),
	job_company_name: z.string().optional(),
	job_company_website: z.string().optional(),
	emails: z.string().optional(),
	phone_numbers: z.string().optional(),
	city: z.string().optional(),
	country: z.string().optional(),
	industry: z.string().optional(),
	profile_picture_url: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
});

export type AeroLeadsProfile = z.infer<typeof AeroLeadsProfile>;
