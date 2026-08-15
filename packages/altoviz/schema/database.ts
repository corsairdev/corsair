import { z } from 'zod';

/**
 * Locally persisted Altoviz entities.
 *
 * Eight stores, all reference data: the three accounting tables every invoice
 * line depends on (units, VAT rates, classifications), the two family
 * groupings, products, customers and contacts.
 *
 * Products and customers earn their place twice over. They are catalog data
 * read far more often than written, and — because Altoviz resolves nested
 * references (vat, unit, family) by VALUE rather than by id, with `id` marked
 * `readOnly` in the provider's own schema — the mirror is also what lets a
 * caller hand this plugin an id and have it translated into the `{code}`,
 * `{rate, region}` or `{label, number}` shape the API actually requires. See
 * `endpoints/shared.ts` for the resolvers that use these stores.
 *
 * Contacts are mirrored because creating a customer, supplier or colleague
 * auto-creates one, and a plugin that never records that side effect can't
 * clean it up later - the three parent deletes evict any contact rows this
 * mirror is holding for them.
 *
 * Sale invoices, credit notes, quotes and receipts are deliberately NOT
 * stored. They are transactional financial records whose status changes
 * server-side (a draft becomes finalized, an invoice becomes paid) without
 * this plugin being told, and a cached invoice that still says "draft" when
 * the provider says "paid" is the kind of wrong answer that costs money.
 */

export const AltovizUnitEntity = z
	.object({
		id: z.number(),
		code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		conversion: z.number().nullable().optional(),
		decimals: z.number().nullable().optional(),
	})
	.loose();
export type AltovizUnitEntity = z.infer<typeof AltovizUnitEntity>;

export const AltovizVatEntity = z
	.object({
		id: z.number(),
		rate: z.number().nullable().optional(),
		region: z.string().nullable().optional(),
		label: z.string().nullable().optional(),
		default: z.boolean().nullable().optional(),
	})
	.loose();
export type AltovizVatEntity = z.infer<typeof AltovizVatEntity>;

export const AltovizClassificationEntity = z
	.object({
		id: z.number(),
		label: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		accountNumber: z.string().nullable().optional(),
		isProduct: z.boolean().nullable().optional(),
		isService: z.boolean().nullable().optional(),
	})
	.loose();
export type AltovizClassificationEntity = z.infer<
	typeof AltovizClassificationEntity
>;

export const AltovizCustomerFamilyEntity = z
	.object({
		id: z.number(),
		label: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
	})
	.loose();
export type AltovizCustomerFamilyEntity = z.infer<
	typeof AltovizCustomerFamilyEntity
>;

export const AltovizProductFamilyEntity = z
	.object({
		id: z.number(),
		label: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
	})
	.loose();
export type AltovizProductFamilyEntity = z.infer<
	typeof AltovizProductFamilyEntity
>;

export const AltovizProductEntity = z
	.object({
		id: z.number(),
		name: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
		unitPrice: z.number().nullable().optional(),
		unit_code: z.string().nullable().optional(),
		vat_rate: z.number().nullable().optional(),
		vat_region: z.string().nullable().optional(),
		family_id: z.number().nullable().optional(),
	})
	.loose();
export type AltovizProductEntity = z.infer<typeof AltovizProductEntity>;

export const AltovizCustomerEntity = z
	.object({
		id: z.number(),
		type: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
	})
	.loose();
export type AltovizCustomerEntity = z.infer<typeof AltovizCustomerEntity>;

export const AltovizContactEntity = z
	.object({
		id: z.number(),
		displayName: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
	})
	.loose();
export type AltovizContactEntity = z.infer<typeof AltovizContactEntity>;
