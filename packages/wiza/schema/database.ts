import { z } from 'zod';

export const WizaReveal = z
	.object({
		id: z.number(),
		status: z.string(),
		is_complete: z.boolean().optional(),
		name: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		linkedin_profile_url: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		email_status: z.string().nullable().optional(),
		mobile_phone: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		company_domain: z.string().nullable().optional(),
		company_industry: z.string().nullable().optional(),
		enrichment_level: z.string().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();
export type WizaReveal = z.infer<typeof WizaReveal>;

export const WizaList = z
	.object({
		id: z.number(),
		name: z.string().optional(),
		status: z.string(),
		enrichment_level: z.string().optional(),
		report_type: z.string().optional(),
		created_at: z.string().optional(),
		finished_at: z.string().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();
export type WizaList = z.infer<typeof WizaList>;

export const WizaProspect = z
	.object({
		linkedin_url: z.string().nullable().optional(),
		full_name: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		job_company_name: z.string().nullable().optional(),
		industry: z.string().nullable().optional(),
		location_name: z.string().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();
export type WizaProspect = z.infer<typeof WizaProspect>;
