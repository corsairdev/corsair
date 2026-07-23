import { z } from 'zod';

export const SalesforceAccountEntity = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string().optional().nullable(),
	industry: z.string().optional().nullable(),
	created_at: z.string().optional().nullable(),
});
export type SalesforceAccountEntity = z.infer<typeof SalesforceAccountEntity>;

export const SalesforceContactEntity = z.object({
	id: z.string(),
	first_name: z.string().optional().nullable(),
	last_name: z.string(),
	email: z.string().optional().nullable(),
	account_id: z.string().optional().nullable(),
});
export type SalesforceContactEntity = z.infer<typeof SalesforceContactEntity>;

export const SalesforceLeadEntity = z.object({
	id: z.string(),
	first_name: z.string().optional().nullable(),
	last_name: z.string(),
	company: z.string(),
	status: z.string().optional().nullable(),
});
export type SalesforceLeadEntity = z.infer<typeof SalesforceLeadEntity>;

export const SalesforceOpportunityEntity = z.object({
	id: z.string(),
	name: z.string(),
	stage_name: z.string(),
	close_date: z.string(),
	amount: z.number().optional().nullable(),
});
export type SalesforceOpportunityEntity = z.infer<
	typeof SalesforceOpportunityEntity
>;
