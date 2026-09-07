import { z } from 'zod';

export const WixContact = z
	.object({
		id: z.string().optional(),
		// Wix returns Contact.revision as a read-only int64 encoded string.
		revision: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	.loose();

export type WixContact = z.infer<typeof WixContact>;

export const WixProduct = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		name: z.string().optional(),
		slug: z.string().optional(),
		// Verified from Query Products docs: narrow filterable/sortable set.
		// All optional because `fields` projection can omit them.
		// https://dev.wix.com/docs/api-reference/business-solutions/stores/catalog-v3/products-v3/query-products
		visible: z.boolean().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	.loose();

export type WixProduct = z.infer<typeof WixProduct>;

/**
 * Minimal inventory-item shape verified from Query Inventory Items docs.
 * Inventory tracks either `quantity` (integer) or `inStock` (boolean) —
 * both optional here because the API returns one of them depending on
 * `trackQuantity`. All optional: cursor queries with `fields` projection
 * can omit any of them.
 * https://dev.wix.com/docs/api-reference/business-solutions/stores/catalog-v3/inventory-items-v3/query-inventory-items
 */
export const WixInventoryItem = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		variantId: z.string().optional(),
		productId: z.string().optional(),
		locationId: z.string().optional(),
		trackQuantity: z.boolean().optional(),
		inStock: z.boolean().optional(),
		quantity: z.number().int().optional(),
		availabilityStatus: z.string().optional(),
		createdDate: z.string().optional(),
		updatedDate: z.string().optional(),
	})
	.loose();

export type WixInventoryItem = z.infer<typeof WixInventoryItem>;

/**
 * Minimal coupon shape verified from Query Coupons docs.
 * Real responses nest `code`/`name`/`active` under `specification`:
 * `coupons[]: { id, specification: { code, name, active, ... }, expired }`.
 * `code` is unique max-20 string, `active`/`expired` are booleans.
 * All optional: list queries can return partial projections.
 * https://dev.wix.com/docs/api-reference/business-solutions/coupons/coupons/query-coupons
 */
export const WixCoupon = z
	.object({
		id: z.string().optional(),
		expired: z.boolean().optional(),
		specification: z
			.looseObject({
				code: z.string().optional(),
				name: z.string().optional(),
				active: z.boolean().optional(),
			})
			.optional(),
	})
	.loose();

export type WixCoupon = z.infer<typeof WixCoupon>;

export const WixOrder = z
	.object({
		id: z.string().optional(),
		revision: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

export type WixOrder = z.infer<typeof WixOrder>;
