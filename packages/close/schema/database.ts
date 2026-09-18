import { z } from 'zod';

/**
 * Close CRM Lead
 * Official: https://developer.close.com/resources/leads/
 */
export const CloseLead = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		status_id: z.string().nullable().optional(),
		status_label: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		organization_id: z.string().optional(),
		contacts: z.array(z.record(z.string(), z.unknown())).optional(),
		custom: z.record(z.string(), z.unknown()).optional(),
		created_by: z.string().nullable().optional(),
		updated_by: z.string().nullable().optional(),
		date_created: z.string().optional(),
		date_updated: z.string().optional(),
	})
	.loose();
export type CloseLead = z.infer<typeof CloseLead>;

/**
 * Close CRM Contact
 * Official: https://developer.close.com/resources/contacts/
 */
export const CloseContact = z
	.object({
		id: z.string(),
		lead_id: z.string().optional(),
		name: z.string().optional(),
		title: z.string().nullable().optional(),
		emails: z
			.array(
				z
					.object({
						email: z.string(),
						type: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		phones: z
			.array(
				z
					.object({
						phone: z.string(),
						type: z.string().optional(),
					})
					.loose(),
			)
			.optional(),
		organization_id: z.string().optional(),
		created_by: z.string().nullable().optional(),
		date_created: z.string().optional(),
		date_updated: z.string().optional(),
	})
	.loose();
export type CloseContact = z.infer<typeof CloseContact>;

/**
 * Close CRM Opportunity
 * Official: https://developer.close.com/resources/opportunities/
 */
export const CloseOpportunity = z
	.object({
		id: z.string(),
		lead_id: z.string().optional(),
		lead_name: z.string().optional(),
		status_id: z.string().optional(),
		status_label: z.string().optional(),
		status_type: z.string().optional(),
		value: z.number().optional(),
		value_period: z.string().optional(),
		confidence: z.number().optional(),
		user_id: z.string().nullable().optional(),
		organization_id: z.string().optional(),
		date_won: z.string().nullable().optional(),
		date_lost: z.string().nullable().optional(),
		date_created: z.string().optional(),
		date_updated: z.string().optional(),
	})
	.loose();
export type CloseOpportunity = z.infer<typeof CloseOpportunity>;

/**
 * Close CRM Task
 * Official: https://developer.close.com/resources/tasks/
 */
export const CloseTask = z
	.object({
		id: z.string(),
		lead_id: z.string().optional(),
		text: z.string().optional(),
		due_date: z.string().nullable().optional(),
		is_complete: z.boolean().optional(),
		assigned_to: z.string().nullable().optional(),
		type: z.string().optional(),
		organization_id: z.string().optional(),
		created_by: z.string().nullable().optional(),
		date_created: z.string().optional(),
		date_updated: z.string().optional(),
	})
	.loose();
export type CloseTask = z.infer<typeof CloseTask>;

/**
 * Close CRM Activity Note
 * Official: https://developer.close.com/resources/activities/note/
 */
export const CloseActivityNote = z
	.object({
		id: z.string(),
		lead_id: z.string().optional(),
		note: z.string().optional(),
		user_id: z.string().nullable().optional(),
		organization_id: z.string().optional(),
		date_created: z.string().optional(),
		date_updated: z.string().optional(),
	})
	.loose();
export type CloseActivityNote = z.infer<typeof CloseActivityNote>;

/**
 * Close CRM Activity Call
 * Official: https://developer.close.com/resources/activities/call/
 */
export const CloseActivityCall = z
	.object({
		id: z.string(),
		lead_id: z.string().optional(),
		phone: z.string().optional(),
		direction: z.string().optional(),
		duration: z.number().optional(),
		status: z.string().optional(),
		user_id: z.string().nullable().optional(),
		organization_id: z.string().optional(),
		date_created: z.string().optional(),
	})
	.loose();
export type CloseActivityCall = z.infer<typeof CloseActivityCall>;

/**
 * Close CRM Activity Email
 * Official: https://developer.close.com/resources/activities/email/
 */
export const CloseActivityEmail = z
	.object({
		id: z.string(),
		lead_id: z.string().optional(),
		subject: z.string().optional(),
		body_text: z.string().optional(),
		sender: z.string().optional(),
		direction: z.string().optional(),
		user_id: z.string().nullable().optional(),
		organization_id: z.string().optional(),
		date_created: z.string().optional(),
	})
	.loose();
export type CloseActivityEmail = z.infer<typeof CloseActivityEmail>;

/**
 * Close CRM User
 * Official: https://developer.close.com/resources/users/
 */
export const CloseUser = z
	.object({
		id: z.string(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		image: z.string().nullable().optional(),
		organization_id: z.string().optional(),
	})
	.loose();
export type CloseUser = z.infer<typeof CloseUser>;

/**
 * Close CRM Custom Field
 * Official: https://developer.close.com/resources/custom-fields/
 */
export const CloseCustomField = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		type: z.string().optional(),
		choices: z.array(z.string()).optional(),
		organization_id: z.string().optional(),
	})
	.loose();
export type CloseCustomField = z.infer<typeof CloseCustomField>;
