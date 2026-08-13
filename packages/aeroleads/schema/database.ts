import { z } from 'zod';

// Response schema for GET /api/get_linkedin_details
// Based on https://aeroleads.com/api#linkedin_api_get_started
export const AeroleadsLinkedinDetails = z.object({
	full_name: z.string().nullable().optional(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	linkedin_url: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	job_title: z.string().nullable().optional(),
	job_company_name: z.string().nullable().optional(),
	job_company_url: z.string().nullable().optional(),
	job_company_linkedin_url: z.string().nullable().optional(),
	job_description: z.string().nullable().optional(),
	education: z
		.union([z.string(), z.array(z.unknown())])
		.nullable()
		.optional(),
	experience: z
		.union([z.string(), z.array(z.unknown())])
		.nullable()
		.optional(),
	interests: z
		.union([z.string(), z.array(z.unknown())])
		.nullable()
		.optional(),
	skills: z
		.union([z.string(), z.array(z.unknown())])
		.nullable()
		.optional(),
	languages: z
		.union([
			z.string(),
			z.record(z.string(), z.unknown()),
			z.array(z.unknown()),
		])
		.nullable()
		.optional(),
	emails: z
		.union([z.string(), z.array(z.unknown())])
		.nullable()
		.optional(),
	phone_numbers: z
		.union([z.string(), z.array(z.unknown())])
		.nullable()
		.optional(),
	cb_rank: z.string().nullable().optional(),
	db_logo_url: z.string().nullable().optional(),
	profile_picture_url: z.string().nullable().optional(),
	job_company_size: z.union([z.string(), z.number()]).nullable().optional(),
	industry: z.string().nullable().optional(),
	job_title_detailed_role_s2: z.string().nullable().optional(),
	organization_founded_year_s2: z.string().nullable().optional(),
	organization_facebook_url_s2: z.string().nullable().optional(),
	organization_twitter_url_s2: z.string().nullable().optional(),
	organization_current_technologies_s2: z.string().nullable().optional(),
	emails_s2: z.string().nullable().optional(),
	phone_numbers_s2: z.string().nullable().optional(),
});
export type AeroleadsLinkedinDetails = z.infer<typeof AeroleadsLinkedinDetails>;
