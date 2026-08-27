import { z } from 'zod';

// TODO: Define your database entities here

export const CloudcartProduct = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string().optional(),
	description: z.string().optional(),
	price: z.number().optional(),
	sku: z.string().optional(),
	quantity: z.number().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const CloudcartOrder = z.object({
	id: z.union([z.string(), z.number()]),
	customer_id: z.union([z.string(), z.number()]).optional(),
	status: z.string().optional(),
	total_amount: z.number().optional(),
	currency: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const CloudcartCustomer = z.object({
	id: z.union([z.string(), z.number()]),
	email: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export const CloudcartCategory = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string().optional(),
	parent_id: z.union([z.string(), z.number()]).optional(),
	created_at: z.string().optional(),
});

export type CloudcartProduct = z.infer<typeof CloudcartProduct>;
export type CloudcartOrder = z.infer<typeof CloudcartOrder>;
export type CloudcartCustomer = z.infer<typeof CloudcartCustomer>;
export type CloudcartCategory = z.infer<typeof CloudcartCategory>;

// export const CloudcartExample = z.object({
// 	id: z.string(),
// 	name: z.string(),
// 	created_at: z.coerce.date().nullable().optional(),
// });
// export type CloudcartExample = z.infer<typeof CloudcartExample>;
