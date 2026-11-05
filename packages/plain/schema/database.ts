import { z } from 'zod';

export const PlainCustomer = z
	.object({
		id: z.string(),
		externalId: z.string().nullable().optional(),
		fullName: z.string(),
		email: z.string().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export type PlainCustomer = z.infer<typeof PlainCustomer>;

export const PlainThread = z
	.object({
		id: z.string(),
		ref: z.string().optional(),
		title: z.string(),
		status: z.string().optional(),
		priority: z.number().int().optional(),
		updatedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export type PlainThread = z.infer<typeof PlainThread>;

export const PlainCompany = z
	.object({
		id: z.string(),
		name: z.string(),
		domainName: z.string().optional(),
		contractValue: z.number().int().nullable().optional(),
	})
	.loose();

export type PlainCompany = z.infer<typeof PlainCompany>;

export const PlainTier = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
	})
	.loose();

export type PlainTier = z.infer<typeof PlainTier>;

export const PlainCustomerGroup = z
	.object({
		id: z.string(),
		name: z.string(),
		key: z.string(),
		color: z.string(),
		externalId: z.string().nullable().optional(),
	})
	.loose();

export type PlainCustomerGroup = z.infer<typeof PlainCustomerGroup>;
