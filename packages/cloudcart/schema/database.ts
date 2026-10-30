import { z } from 'zod';

/**
 * Locally persisted CloudCart entities.
 *
 * Only slow-changing structural records are mirrored: products, orders,
 * customers, categories, and variants. High-volume or continuously appended
 * data (order-payment events, shipping logs, subscriber activity) are
 * deliberately NOT stored — they are always wanted as a live view.
 *
 * Field names match the official CloudCart v2 JSON:API attributes
 * (snake_case). The `id` field on every entity is the CloudCart numeric
 * resource ID returned in the `data.id` member of a JSON:API document.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();

export const CloudcartProductEntity = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
		price: N,
		sku: S,
		status: S,
		quantity: N,
		weight: N,
		description: S,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type CloudcartProductEntity = z.infer<typeof CloudcartProductEntity>;

export const CloudcartOrderEntity = z
	.object({
		id: z.union([z.string(), z.number()]),
		order_total: N,
		status: S,
		status_fulfillment: S,
		customer_email: S,
		currency: S,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type CloudcartOrderEntity = z.infer<typeof CloudcartOrderEntity>;

export const CloudcartCustomerEntity = z
	.object({
		id: z.union([z.string(), z.number()]),
		email: S,
		first_name: S,
		last_name: S,
		phone: S,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type CloudcartCustomerEntity = z.infer<typeof CloudcartCustomerEntity>;

export const CloudcartCategoryEntity = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
		slug: S,
		parent_id: N,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type CloudcartCategoryEntity = z.infer<typeof CloudcartCategoryEntity>;

export const CloudcartVariantEntity = z
	.object({
		id: z.union([z.string(), z.number()]),
		sku: S,
		price: N,
		quantity: N,
		product_id: N,
	})
	.loose();
export type CloudcartVariantEntity = z.infer<typeof CloudcartVariantEntity>;
