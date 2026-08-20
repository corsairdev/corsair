import { z } from 'zod';

const LinkedInGetDetailsInputSchema = z.object({
	linkedin_url: z.string().describe('LinkedIn profile URL of the prospect'),
});

export type LinkedInGetDetailsInput = z.infer<typeof LinkedInGetDetailsInputSchema>;

const LinkedInGetDetailsResponseSchema = z.object({
	first_name: z.string().optional(),
	full_name: z.string().optional(),
	last_name: z.string().optional(),
	gender: z.string().optional(),
	address: z.string().optional(),
	city: z.string().optional(),
	country: z.string().optional(),
	job_summary: z.string().optional(),
	job_title_role: z.string().optional(),
	job_title_level: z.string().optional(),
	job_company_name: z.string().optional(),
	job_company_website: z.string().optional(),
	job_description: z.string().optional(),
	job_company_linkedin_url: z.string().optional(),
	education: z.string().optional(),
	experience: z.string().optional(),
	interests: z.string().optional(),
	skills: z.string().optional(),
	languages: z.string().optional(),
	emails: z.string().optional(),
	phone_numbers: z.string().optional(),
	cb_rank: z.string().optional(),
	db_logo_url: z.string().optional(),
	profile_picture_url: z.string().optional(),
	job_company_size: z.string().optional(),
	industry: z.string().optional(),
	job_title_detailed_role_s2: z.string().optional(),
	organization_founded_year_s2: z.string().optional(),
	organization_facebook_url_s2: z.string().optional(),
	organization_twitter_url_s2: z.string().optional(),
	organization_current_technologies_s2: z.string().optional(),
	emails_s2: z.string().optional(),
	phone_numbers_s2: z.string().optional(),
});

export type LinkedInGetDetailsResponse = z.infer<typeof LinkedInGetDetailsResponseSchema>;

const EmailGetCompanyEmailInputSchema = z.object({
	email: z.string().describe('Email address to verify'),
});

export type EmailGetCompanyEmailInput = z.infer<typeof EmailGetCompanyEmailInputSchema>;

const EmailGetCompanyEmailResponseSchema = z.object({
	status: z.string().optional(),
	address: z.string().optional(),
	type: z.string().optional(),
	email_status: z.string().optional(),
	safe_to_send: z.string().optional(),
	deliverable: z.string().optional(),
	catch_all: z.string().optional(),
	domain_status: z.string().optional(),
	domain: z.string().optional(),
	disposable_domain: z.string().optional(),
});

export type EmailGetCompanyEmailResponse = z.infer<typeof EmailGetCompanyEmailResponseSchema>;

export type AeroLeadsEndpointInputs = {
	linkedinGetDetails: LinkedInGetDetailsInput;
	emailGetCompanyEmail: EmailGetCompanyEmailInput;
};

export type AeroLeadsEndpointOutputs = {
	linkedinGetDetails: LinkedInGetDetailsResponse;
	emailGetCompanyEmail: EmailGetCompanyEmailResponse;
};

export const AeroLeadsEndpointInputSchemas = {
	linkedinGetDetails: LinkedInGetDetailsInputSchema,
	emailGetCompanyEmail: EmailGetCompanyEmailInputSchema,
} as const;

export const AeroLeadsEndpointOutputSchemas = {
	linkedinGetDetails: LinkedInGetDetailsResponseSchema,
	emailGetCompanyEmail: EmailGetCompanyEmailResponseSchema,
} as const;
