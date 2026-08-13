import { z } from 'zod';

/**
 * Locally persisted Loyverse entities.
 *
 * Loyverse splits cleanly into reference data and transactional records. The
 * reference side - the catalogue (items, variants, categories, modifiers,
 * discounts, taxes), who the customers and suppliers are, and how the account
 * is configured (stores, employees, payment types, POS devices) - changes
 * rarely and is the lookup every other operation needs, so it is mirrored.
 *
 * Receipts, refunds and shifts are transactional: appended continuously and
 * only meaningful against a date range, so mirroring them would copy a moving
 * target without helping any lookup. Inventory levels are excluded for a
 * stronger reason - they carry no id at all and change on every sale, so a
 * mirrored stock figure would be misleading rather than useful.
 *
 * Field names match the official JSON keys exactly.
 * Docs: https://developer.loyverse.com/docs/
 *
 * Every field below was observed on a live response (live account,
 * 2026-08-13). Only the primary key is required: Loyverse nulls or omits most
 * fields depending on which features an account has enabled, so a stricter
 * schema would reject valid rows, and a rejected row is a lost row.
 */

/** Nullable-optional helpers - Loyverse nulls unset fields rather than omitting them. */
const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/** Ids are UUID strings on every entity except receipts, which use a sequence. */
const Id = z.string();

/**
 * Per-store price and stock overrides carried by a variant.
 *
 * An account with one store still gets one entry here, so this is not an
 * optional extra on multi-store accounts only.
 */
export const LoyverseStoreOverride = z
	.object({
		store_id: S,
		pricing_type: S,
		price: N,
		available_for_sale: B,
		optimal_stock: N,
		low_stock: N,
	})
	.loose();
export type LoyverseStoreOverride = z.infer<typeof LoyverseStoreOverride>;

/**
 * A component of a composite item.
 *
 * Never observed populated on the capture account - composite items require the
 * feature to be enabled - so the shape comes from the published spec and is
 * kept loose. `z.unknown()` is not used because the two fields are documented
 * unambiguously.
 */
export const LoyverseComponent = z
	.object({
		variant_id: S,
		quantity: N,
	})
	.loose();
export type LoyverseComponent = z.infer<typeof LoyverseComponent>;

/**
 * Item variants. Keyed on `variant_id`, **not** `id` - the only entity in the
 * API that does not use `id` as its primary key.
 *
 * 16 live keys.
 */
export const LoyverseVariantEntity = z
	.object({
		variant_id: Id,
		item_id: S,
		sku: S,
		reference_variant_id: S,
		option1_value: S,
		option2_value: S,
		option3_value: S,
		barcode: S,
		cost: N,
		purchase_cost: N,
		default_pricing_type: S,
		default_price: N,
		stores: z.array(LoyverseStoreOverride).nullable().optional(),
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseVariantEntity = z.infer<typeof LoyverseVariantEntity>;

/**
 * Items. https://developer.loyverse.com/docs/#tag/Items
 * 24 live keys, with variants nested inline.
 *
 * Note `modifier_ids`, singular `modifier`. The published spec documents the
 * request field as `modifiers_ids`, which the API accepts without complaint and
 * then ignores - verified live, the modifier simply never attaches. Both the
 * request and the response use `modifier_ids`.
 */
export const LoyverseItemEntity = z
	.object({
		id: Id,
		handle: S,
		item_name: S,
		description: S,
		reference_id: S,
		category_id: S,
		track_stock: B,
		sold_by_weight: B,
		is_composite: B,
		use_production: B,
		components: z.array(LoyverseComponent).nullable().optional(),
		primary_supplier_id: S,
		tax_ids: z.array(z.string()).nullable().optional(),
		modifier_ids: z.array(z.string()).nullable().optional(),
		form: S,
		color: S,
		image_url: S,
		option1_name: S,
		option2_name: S,
		option3_name: S,
		variants: z.array(LoyverseVariantEntity).nullable().optional(),
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseItemEntity = z.infer<typeof LoyverseItemEntity>;

/**
 * Categories. 5 live keys - the smallest entity in the API.
 */
export const LoyverseCategoryEntity = z
	.object({
		id: Id,
		name: S,
		color: S,
		created_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseCategoryEntity = z.infer<typeof LoyverseCategoryEntity>;

/** One selectable option on a modifier, with its own price. */
export const LoyverseModifierOption = z
	.object({
		id: S,
		name: S,
		price: N,
		position: N,
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseModifierOption = z.infer<typeof LoyverseModifierOption>;

/** Modifiers. 8 live keys, options nested inline. */
export const LoyverseModifierEntity = z
	.object({
		id: Id,
		name: S,
		position: N,
		stores: z.array(z.string()).nullable().optional(),
		modifier_options: z.array(LoyverseModifierOption).nullable().optional(),
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseModifierEntity = z.infer<typeof LoyverseModifierEntity>;

/**
 * Discounts. 9 live keys.
 *
 * `discount_percent` and `discount_amount` are mutually exclusive and depend on
 * `type`, so both are optional here; the input schema encodes the constraint.
 */
export const LoyverseDiscountEntity = z
	.object({
		id: Id,
		type: S,
		name: S,
		discount_amount: N,
		discount_percent: N,
		stores: z.array(z.string()).nullable().optional(),
		restricted_access: B,
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseDiscountEntity = z.infer<typeof LoyverseDiscountEntity>;

/** Taxes. 8 live keys. `type` is INCLUDED or ADDED. */
export const LoyverseTaxEntity = z
	.object({
		id: Id,
		name: S,
		type: S,
		rate: N,
		stores: z.array(z.string()).nullable().optional(),
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseTaxEntity = z.infer<typeof LoyverseTaxEntity>;

/**
 * Customers. 20 live keys, and the one entity that is mostly personal data.
 *
 * Loyverse does **not** soft-delete customers - the spec states this is due to
 * personal-data restrictions, and `permanent_deletion_at` records when the
 * record is purged. A delete is therefore permanent and the mirror must evict.
 *
 * None of these fields reach the event log; see `endpoints/logging.ts`.
 */
export const LoyverseCustomerEntity = z
	.object({
		id: Id,
		name: S,
		email: S,
		phone_number: S,
		address: S,
		city: S,
		region: S,
		postal_code: S,
		country_code: S,
		customer_code: S,
		note: S,
		first_visit: S,
		last_visit: S,
		total_visits: N,
		total_spent: N,
		total_points: N,
		permanent_deletion_at: S,
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseCustomerEntity = z.infer<typeof LoyverseCustomerEntity>;

/** Suppliers. 16 live keys. Carries supplier contact details. */
export const LoyverseSupplierEntity = z
	.object({
		id: Id,
		name: S,
		contact: S,
		email: S,
		phone_number: S,
		address_1: S,
		address_2: S,
		city: S,
		region: S,
		postal_code: S,
		country_code: S,
		website: S,
		note: S,
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseSupplierEntity = z.infer<typeof LoyverseSupplierEntity>;

/** Stores. 12 live keys. */
export const LoyverseStoreEntity = z
	.object({
		id: Id,
		name: S,
		address: S,
		city: S,
		region: S,
		postal_code: S,
		country_code: S,
		phone_number: S,
		description: S,
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseStoreEntity = z.infer<typeof LoyverseStoreEntity>;

/** Employees. 9 live keys. Carries a name and email, so it is personal data. */
export const LoyverseEmployeeEntity = z
	.object({
		id: Id,
		name: S,
		email: S,
		phone_number: S,
		stores: z.array(z.string()).nullable().optional(),
		is_owner: B,
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyverseEmployeeEntity = z.infer<typeof LoyverseEmployeeEntity>;

/** Payment types. 7 live keys. Read-only over the API. */
export const LoyversePaymentTypeEntity = z
	.object({
		id: Id,
		name: S,
		type: S,
		stores: z.array(z.string()).nullable().optional(),
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();
export type LoyversePaymentTypeEntity = z.infer<
	typeof LoyversePaymentTypeEntity
>;

/**
 * POS devices. 5 live keys - and notably no `created_at` or `updated_at`, so
 * the timestamps present on every other entity cannot be assumed here.
 */
export const LoyversePosDeviceEntity = z
	.object({
		id: Id,
		name: S,
		store_id: S,
		activated: B,
		deleted_at: S,
	})
	.loose();
export type LoyversePosDeviceEntity = z.infer<typeof LoyversePosDeviceEntity>;

/** The account's currency, nested on the merchant record. */
export const LoyverseCurrency = z
	.object({
		code: S,
		decimal_places: N,
	})
	.loose();
export type LoyverseCurrency = z.infer<typeof LoyverseCurrency>;

/**
 * Merchant information. 6 live keys.
 *
 * A per-account singleton reached at `GET /merchant/`. It does have an `id`, so
 * unlike Harvest's company settings it needs no entity-id override, but there is
 * only ever one row.
 */
export const LoyverseMerchantEntity = z
	.object({
		id: Id,
		business_name: S,
		email: S,
		country: S,
		currency: LoyverseCurrency.nullable().optional(),
		created_at: S,
	})
	.loose();
export type LoyverseMerchantEntity = z.infer<typeof LoyverseMerchantEntity>;
