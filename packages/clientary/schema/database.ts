import { z } from 'zod';

const ClientaryIdSchema = z.number().int().positive();

const ClientaryClientEntitySchema = z
	.object({
		id: ClientaryIdSchema,
		name: z.string(),
		number: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		address_2: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
	})
	.loose();

const ClientaryContactEntitySchema = z
	.object({
		id: ClientaryIdSchema,
		client_id: ClientaryIdSchema.nullable().optional(),
		name: z.string(),
		email: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		mobile: z.string().nullable().optional(),
	})
	.loose();

const ClientaryProjectEntitySchema = z
	.object({
		id: ClientaryIdSchema,
		name: z.string(),
		number: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		status: z.number(),
		budget_type: z.number(),
		project_type: z.number(),
		budget: z.number().nullable().optional(),
		rate: z.number().nullable().optional(),
		currency_code: z.string().nullable().optional(),
		start_date: z.string().nullable().optional(),
		end_date: z.string().nullable().optional(),
		client_id: ClientaryIdSchema.nullable().optional(),
	})
	.loose();

const ClientaryInvoiceEntitySchema = z
	.object({
		id: ClientaryIdSchema,
		number: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		date: z.string(),
		due_date: z.string().nullable().optional(),
		client_id: ClientaryIdSchema.nullable().optional(),
		status: z.number(),
		currency_code: z.string(),
		subtotal: z.number(),
		total_cost: z.number(),
		balance: z.number(),
		total_payments: z.number(),
	})
	.loose();

const ClientaryEstimateEntitySchema = z
	.object({
		id: ClientaryIdSchema,
		number: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		date: z.string(),
		client_id: ClientaryIdSchema.nullable().optional(),
		status: z.number(),
		currency_code: z.string(),
		subtotal: z.number(),
		total_cost: z.number(),
		tax: z.number(),
	})
	.loose();

const ClientaryTaskEntitySchema = z
	.object({
		id: ClientaryIdSchema,
		client_id: ClientaryIdSchema.nullable().optional(),
		project_id: ClientaryIdSchema.nullable().optional(),
		user_id: ClientaryIdSchema.nullable().optional(),
		assignee_id: ClientaryIdSchema.nullable().optional(),
		title: z.string(),
		description: z.string().nullable().optional(),
		complete: z.boolean(),
		due_date: z.string().nullable().optional(),
	})
	.loose();

export const ClientaryClient = ClientaryClientEntitySchema;
export const ClientaryContact = ClientaryContactEntitySchema;
export const ClientaryProject = ClientaryProjectEntitySchema;
export const ClientaryInvoice = ClientaryInvoiceEntitySchema;
export const ClientaryEstimate = ClientaryEstimateEntitySchema;
export const ClientaryTask = ClientaryTaskEntitySchema;

export type ClientaryClient = z.infer<typeof ClientaryClientEntitySchema>;
export type ClientaryContact = z.infer<typeof ClientaryContactEntitySchema>;
export type ClientaryProject = z.infer<typeof ClientaryProjectEntitySchema>;
export type ClientaryInvoice = z.infer<typeof ClientaryInvoiceEntitySchema>;
export type ClientaryEstimate = z.infer<typeof ClientaryEstimateEntitySchema>;
export type ClientaryTask = z.infer<typeof ClientaryTaskEntitySchema>;
