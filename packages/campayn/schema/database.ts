import { z } from 'zod';

export const CampaynList = z
	.object({
		id: z.string(),
		list_name: z.string(),
		tags: z.string().optional(),
		contact_count: z.number().or(z.string()),
	})
	.loose();

export const CampaynContact = z
	.object({
		id: z.string(),
		email: z.string(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		status: z.string().optional(),
	})
	.loose();

export const CampaynMessage = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		status: z.string().optional(),
		scheduled_date: z.string().nullable().optional(),
	})
	.loose();

export const CampaynReport = z
	.object({
		id: z.string(),
		name: z.string(),
		status: z.string(),
		report_url: z.string().nullable(),
	})
	.loose();

export const CampaynWebform = z
	.object({
		id: z.string(),
		contact_list_id: z.string(),
		form_title: z.string(),
		form_type: z.string(),
	})
	.loose();
