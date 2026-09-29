import { z } from 'zod';

const OptionalStringSchema = z.string().nullable().optional();

// Official list object from GET /lists.json
export const CampaynList = z
	.object({
		id: z.string(),
		list_name: z.string(),
		tags: z.string().optional(),
		contact_count: z.number().or(z.string()),
	})
	.loose();

// Official contact object from GET /contacts/{id}.json
export const CampaynContact = z
	.object({
		id: z.string(),
		email: z.string(),
		first_name: OptionalStringSchema,
		last_name: OptionalStringSchema,
		title: OptionalStringSchema,
		company: OptionalStringSchema,
		address: OptionalStringSchema,
		country_id: OptionalStringSchema,
		country: OptionalStringSchema,
		city: OptionalStringSchema,
		state: OptionalStringSchema,
		zip: OptionalStringSchema,
		birthday: OptionalStringSchema,
		tags: OptionalStringSchema,
		image_url: OptionalStringSchema,
	})
	.loose();

// Official email object from GET /emails.json
export const CampaynMessage = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		scheduled_date: z.string().nullable().optional(),
		send_now: z.string().or(z.number()).optional(),
		send_count: z.string().or(z.number()).optional(),
		campaign_title: z.string().nullable().optional(),
		status: z.string().optional(),
		unique_views: z.number().or(z.string()).optional(),
		unique_responses: z.number().or(z.string()).optional(),
		percent_views: z.number().or(z.string()).optional(),
		percent_responses: z.number().or(z.string()).optional(),
		preview_url: z.string().optional(),
		preview_thumb: z.string().optional(),
	})
	.loose();

// Official calendar object from GET /reports/calendar.json
export const CampaynReport = z
	.object({
		id: z.string(),
		name: z.string(),
		scheduled_date: z.string().nullable(),
		status: z.string(),
		preview_url: z.string(),
		report_url: z.string().nullable(),
	})
	.loose();

// Official form object from GET /lists/{id}/forms.json
export const CampaynWebform = z
	.object({
		id: z.string(),
		contact_list_id: z.string(),
		form_title: z.string(),
		form_type: z.string(),
		form_html: z.string(),
		signup_count: z.string().or(z.number()),
	})
	.loose();
