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
 * Field names match official JSON keys.
 * Official: https://developer.loyverse.com/docs/
 * Agent knowledge (OpenAPI field tables): https://www.withone.ai/knowledge/loyverse
 *
 * Each field is labeled from the official attribute table. Live keys this
 * account (2026-08-13 / 2026-08-14) returned that the spec example omits are
 * marked live-observed. Only the primary key is required: Loyverse nulls or
 * omits most fields depending on which features an account has enabled.
 *
 * `schema.test.ts` asserts every captured key is declared here.
 */

/** Nullable-optional helpers - Loyverse nulls unset fields rather than omitting them. */
const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/** Ids are UUID strings on every entity except receipts, which use a sequence. */
const Id = z.string();

/**
 * Per-store price and stock overrides carried by a variant.
 * Official: Item / Variant `stores[]`.
 */
export const LoyverseStoreOverride = z
	.object({
		/** Store id. Official. */
		store_id: S,
		/**
		 * Variant pricing type for this store. Official: FIXED or VARIABLE.
		 * VARIABLE means the price is specified at the time of a sale. Defaults
		 * to `default_pricing_type`.
		 */
		pricing_type: S,
		/**
		 * Variant price in this store, only if this store's `pricing_type` is
		 * FIXED. Defaults to `default_price`. Official.
		 */
		price: N,
		/** If true, variant is available for sale at this store. Official. Default: true. */
		available_for_sale: B,
		/**
		 * Optimal stock used to automatically calculate stock while creating a
		 * purchase order. Official. Default: null. Maximum: 9999999.999.
		 */
		optimal_stock: N,
		/**
		 * Low-stock threshold. At or below this, the back office shows an alert
		 * and may send email. Official. Default: null. Maximum: 9999999.999.
		 */
		low_stock: N,
	})
	.loose();
export type LoyverseStoreOverride = z.infer<typeof LoyverseStoreOverride>;

/**
 * A component of a composite item.
 * Official: Item `components[]`.
 *
 * Never observed populated on the capture account - composite items require the
 * feature to be enabled - so the shape comes from the published spec and is
 * kept loose.
 */
export const LoyverseComponent = z
	.object({
		/** Variant id of the component. Official. */
		variant_id: S,
		/** Quantity of this component in the composite item. Official. */
		quantity: N,
	})
	.loose();
export type LoyverseComponent = z.infer<typeof LoyverseComponent>;

/**
 * Item variants. Keyed on `variant_id`, **not** `id` - the only entity in the
 * API that does not use `id` as its primary key.
 *
 * Official: https://developer.loyverse.com/docs/#tag/Item-variants
 * 16 live keys.
 */
export const LoyverseVariantEntity = z
	.object({
		/**
		 * Read-only internal id of the variant. If included in POST it updates
		 * instead of creating. Official.
		 */
		variant_id: Id,
		/** Item id this variant is attached to. Official. */
		item_id: S,
		/** Variant SKU. Should be unique. Official. min 1, max 40. */
		sku: S,
		/** External reference id for the variant. Official. max 128. */
		reference_variant_id: S,
		/**
		 * Value of the first option. Required if `option1_name` is set on the
		 * parent item. Official. min 1, max 20.
		 */
		option1_value: S,
		/** Value of the second option. Official. Required if `option2_name` is set. */
		option2_value: S,
		/** Value of the third option. Official. Required if `option3_name` is set. */
		option3_value: S,
		/** Barcode value. Official. min 1, max 128. */
		barcode: S,
		/** Variant cost. Official. Default: 0. */
		cost: N,
		/** Variant purchase cost. Official. Default: 0. */
		purchase_cost: N,
		/**
		 * Default variant pricing type. Official: FIXED or VARIABLE.
		 * VARIABLE means the price is specified at the time of a sale.
		 * Default: VARIABLE.
		 */
		default_pricing_type: S,
		/**
		 * Default variant price, only for FIXED pricing. Official. Default: null.
		 * Per-store prices default to this unless overridden in `stores`.
		 */
		default_price: N,
		/** Per-store price and stock overrides. Official. */
		stores: z.array(LoyverseStoreOverride).nullable().optional(),
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseVariantEntity = z.infer<typeof LoyverseVariantEntity>;

/**
 * Items. Official: https://developer.loyverse.com/docs/#tag/Items
 * 24 live keys, with variants nested inline.
 *
 * Note `modifier_ids`, singular `modifier`. The published spec documents the
 * request field as `modifiers_ids`, which the API accepts without complaint and
 * then ignores - verified live, the modifier simply never attaches. Both the
 * request and the response use `modifier_ids`.
 */
export const LoyverseItemEntity = z
	.object({
		/**
		 * Read-only internal id of the item. If included in POST it updates
		 * instead of creating. Official.
		 */
		id: Id,
		/** Item handle. Official. */
		handle: S,
		/** Item name. Official. min 1, max 64. */
		item_name: S,
		/** Item description. Official. */
		description: S,
		/** External reference id for the item. Official. max 128. */
		reference_id: S,
		/** Category id of the item. Official. */
		category_id: S,
		/**
		 * If true, the system tracks inventory for this item at all stores.
		 * Setting this to false zeroes all inventory levels. Official.
		 */
		track_stock: B,
		/**
		 * If true, a fractional quantity can be specified at sale (for example
		 * 1.5). Official.
		 */
		sold_by_weight: B,
		/**
		 * If true, the item contains a specified quantity of other items.
		 * Official. https://help.loyverse.com/help/how-create-composite-item
		 */
		is_composite: B,
		/**
		 * If true, the system tracks stock for the composite item as well as
		 * its components. Composite items only. Official.
		 * https://help.loyverse.com/help/how-work-production
		 */
		use_production: B,
		/** Components of a composite item. Official. */
		components: z.array(LoyverseComponent).nullable().optional(),
		/** Primary supplier id. Official. */
		primary_supplier_id: S,
		/** Tax ids applied to this item. Official. */
		tax_ids: z.array(z.string()).nullable().optional(),
		/**
		 * Modifier ids applied to this item. Official table names this
		 * `modifiers_ids`; live request and response use `modifier_ids`.
		 */
		modifier_ids: z.array(z.string()).nullable().optional(),
		/**
		 * Visual form of the item on the POS. Official: SQUARE, CIRCLE, SUN,
		 * OCTAGON.
		 */
		form: S,
		/**
		 * Predefined POS color. Official: GREY, RED, PINK, ORANGE, YELLOW,
		 * GREEN, BLUE, PURPLE.
		 */
		color: S,
		/** Image URL. Official. */
		image_url: S,
		/**
		 * Name of the first option (for example "Size"). Official.
		 * https://help.loyverse.com/help/how-use-variants-items
		 */
		option1_name: S,
		/** Name of the second option (for example "Color"). Official. */
		option2_name: S,
		/** Name of the third option (for example "Material"). Official. */
		option3_name: S,
		/** Variants attached to this item. Official. */
		variants: z.array(LoyverseVariantEntity).nullable().optional(),
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseItemEntity = z.infer<typeof LoyverseItemEntity>;

/**
 * Categories. Official: https://developer.loyverse.com/docs/#tag/Categories
 * 5 live keys - the smallest entity in the API.
 */
export const LoyverseCategoryEntity = z
	.object({
		/**
		 * Category id. If included in POST it updates instead of creating.
		 * Official.
		 */
		id: Id,
		/** Category name. Official. min 1, max 64. */
		name: S,
		/**
		 * Category color. Official: GREY, RED, PINK, ORANGE, GREEN, BLUE,
		 * PURPLE. Default: GREY.
		 */
		color: S,
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseCategoryEntity = z.infer<typeof LoyverseCategoryEntity>;

/**
 * One selectable option on a modifier, with its own price.
 * Official: Modifier `modifier_options[]`.
 */
export const LoyverseModifierOption = z
	.object({
		/** Modifier option id. Official. */
		id: S,
		/** Modifier option name. Official. */
		name: S,
		/** Modifier option price. Official. */
		price: N,
		/** Position of this option in the modifier options list. Official. */
		position: N,
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseModifierOption = z.infer<typeof LoyverseModifierOption>;

/**
 * Modifiers. Official: https://developer.loyverse.com/docs/#tag/Modifiers
 * 8 live keys, options nested inline.
 */
export const LoyverseModifierEntity = z
	.object({
		/**
		 * Modifier id. If included in POST it updates instead of creating.
		 * Official.
		 */
		id: Id,
		/** Modifier name. Official. max 40. */
		name: S,
		/** Position of this modifier in the modifiers list. Official. */
		position: N,
		/** Store ids where this modifier is available. Official. */
		stores: z.array(z.string()).nullable().optional(),
		/** Modifier options. Official. */
		modifier_options: z.array(LoyverseModifierOption).nullable().optional(),
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseModifierEntity = z.infer<typeof LoyverseModifierEntity>;

/**
 * Discounts. Official: https://developer.loyverse.com/docs/#tag/Discounts
 * 9 live keys.
 *
 * `discount_percent` and `discount_amount` are mutually exclusive and depend on
 * `type`, so both are optional here; the input schema encodes the constraint.
 */
export const LoyverseDiscountEntity = z
	.object({
		/**
		 * Discount id. If included in POST it updates instead of creating.
		 * Official.
		 */
		id: Id,
		/**
		 * Discount type. Official: FIXED_PERCENT, FIXED_AMOUNT,
		 * VARIABLE_PERCENT, VARIABLE_AMOUNT, DISCOUNT_BY_POINTS.
		 */
		type: S,
		/** Discount name. Official. min 1, max 40. */
		name: S,
		/**
		 * Discount value in money. Official. Only for type FIXED_AMOUNT.
		 */
		discount_amount: N,
		/**
		 * Discount value in percentage. Official. Only for type FIXED_PERCENT.
		 */
		discount_percent: N,
		/**
		 * Store ids where this discount is available. Official. Default: all
		 * stores.
		 */
		stores: z.array(z.string()).nullable().optional(),
		/**
		 * If true, password verification is required to apply this discount on
		 * POS. Official.
		 */
		restricted_access: B,
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseDiscountEntity = z.infer<typeof LoyverseDiscountEntity>;

/**
 * Taxes. Official: https://developer.loyverse.com/docs/#tag/Taxes
 * 8 live keys.
 */
export const LoyverseTaxEntity = z
	.object({
		/**
		 * Tax id. If included in POST it updates instead of creating. Official.
		 */
		id: Id,
		/** Tax name. Official. */
		name: S,
		/**
		 * INCLUDED means the tax is in the item price; ADDED means it is added
		 * on top. Official.
		 */
		type: S,
		/**
		 * Tax rate. Official. A value of 5.255 is 5.255%.
		 */
		rate: N,
		/** Store ids where this tax is available. Official. */
		stores: z.array(z.string()).nullable().optional(),
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseTaxEntity = z.infer<typeof LoyverseTaxEntity>;

/**
 * Customers. Official: https://developer.loyverse.com/docs/#tag/Customers
 * 20 live keys, and the one entity that is mostly personal data.
 *
 * Loyverse does **not** soft-delete customers - the spec states this is due to
 * personal-data restrictions, and `permanent_deletion_at` records when the
 * record is purged. A delete is therefore permanent and the mirror must evict.
 *
 * None of these fields reach the event log; see `endpoints/logging.ts`.
 */
export const LoyverseCustomerEntity = z
	.object({
		/**
		 * Customer id. If included in POST it updates instead of creating.
		 * Official.
		 */
		id: Id,
		/** Customer's name. Official. max 64. */
		name: S,
		/** Customer's email. Official. max 100. */
		email: S,
		/** Customer's phone number. Official. max 15. */
		phone_number: S,
		/** Customer's address. Official. max 192. */
		address: S,
		/** Customer's city, town, or village. Official. max 64. */
		city: S,
		/**
		 * Customer's region name. Typically a province, a state, or a
		 * prefecture. Official.
		 */
		region: S,
		/**
		 * Customer's postal code (zip, postcode, Eircode, etc.). Official.
		 */
		postal_code: S,
		/**
		 * Two-letter country code in ISO 3166-1-alpha-2. Official.
		 */
		country_code: S,
		/** Customer code. Official. */
		customer_code: S,
		/** Note about the customer. Official. */
		note: S,
		/** Date of the first customer visit. Official. */
		first_visit: S,
		/** Date of the most recent customer visit. Official. */
		last_visit: S,
		/** Total number of visits. Official. */
		total_visits: N,
		/** Total money amount the customer has spent. Official. */
		total_spent: N,
		/** Actual customer points balance. Official. */
		total_points: N,
		/**
		 * Time when customer data will be permanently deleted (usually 24 hours
		 * after deletion). Official.
		 */
		permanent_deletion_at: S,
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseCustomerEntity = z.infer<typeof LoyverseCustomerEntity>;

/**
 * Suppliers. Official: https://developer.loyverse.com/docs/#tag/Suppliers
 * 16 live keys.
 */
export const LoyverseSupplierEntity = z
	.object({
		/**
		 * Supplier id. If included in POST it updates instead of creating.
		 * Official.
		 */
		id: Id,
		/** Supplier company name. Official. */
		name: S,
		/** Supplier contact person name. Official. */
		contact: S,
		/** Supplier email. Official. */
		email: S,
		/** Supplier phone number. Official. */
		phone_number: S,
		/** Supplier address line 1. Official. */
		address_1: S,
		/** Supplier address line 2. Official. */
		address_2: S,
		/** Supplier city, town, or village. Official. */
		city: S,
		/**
		 * Supplier's region name. Typically a province, a state, or a
		 * prefecture. Official.
		 */
		region: S,
		/**
		 * Supplier's postal code (zip, postcode, Eircode, etc.). Official.
		 */
		postal_code: S,
		/**
		 * Two-letter country code in ISO 3166-1-alpha-2. Official.
		 */
		country_code: S,
		/** Supplier website page. Official. */
		website: S,
		/** Note about the supplier. Official. */
		note: S,
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseSupplierEntity = z.infer<typeof LoyverseSupplierEntity>;

/**
 * Stores. Official: https://developer.loyverse.com/docs/#tag/Stores
 * 12 live keys.
 *
 * `state` and `country` are the names the published spec gives the region and
 * country fields; the live response returns `region` and `country_code`
 * instead. Both spellings are declared because the difference is undocumented.
 * Neither documented alias has been observed on a response.
 */
export const LoyverseStoreEntity = z
	.object({
		/** Store id. Official. */
		id: Id,
		/** Store name. Official. */
		name: S,
		/** Store address. Official. */
		address: S,
		/** Store city, town, or village. Official. */
		city: S,
		/**
		 * Store region name. Typically a province, a state, or a prefecture.
		 * Live-observed (spec example sometimes uses `state`).
		 */
		region: S,
		/** Spec alias for `region`. Never observed live. */
		state: S,
		/** Store postal code. Official. */
		postal_code: S,
		/**
		 * Two-letter country code in ISO 3166-1-alpha-2. Live-observed (spec
		 * example sometimes uses `country`).
		 */
		country_code: S,
		/** Spec alias for `country_code`. Never observed live. */
		country: S,
		/** Store phone number. Official. */
		phone_number: S,
		/** Store description. Official. */
		description: S,
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseStoreEntity = z.infer<typeof LoyverseStoreEntity>;

/**
 * Employees. Official: https://developer.loyverse.com/docs/#tag/Employees
 * 9 live keys. Carries a name and email, so it is personal data.
 */
export const LoyverseEmployeeEntity = z
	.object({
		/** Employee id. Official. */
		id: Id,
		/** Employee name. Official. min 1, max 64. */
		name: S,
		/** Employee email. Official. min 1, max 100. */
		email: S,
		/** Employee phone number. Official. min 1, max 15. */
		phone_number: S,
		/** Store ids associated with the employee. Official. */
		stores: z.array(z.string()).nullable().optional(),
		/** Whether the employee is the account owner. Official. */
		is_owner: B,
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyverseEmployeeEntity = z.infer<typeof LoyverseEmployeeEntity>;

/**
 * Payment types. Official: https://developer.loyverse.com/docs/#tag/Payment-types
 * 7 live keys. Read-only over the API.
 */
export const LoyversePaymentTypeEntity = z
	.object({
		/** Payment type id. Official. */
		id: Id,
		/** Payment type name. Official. */
		name: S,
		/** Payment type (for example CASH, CARD). Official. */
		type: S,
		/** Store ids where this payment type is available. Official. */
		stores: z.array(z.string()).nullable().optional(),
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
		/** Time this resource was updated, ISO 8601. Official. */
		updated_at: S,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyversePaymentTypeEntity = z.infer<
	typeof LoyversePaymentTypeEntity
>;

/**
 * POS devices. Official: https://developer.loyverse.com/docs/#tag/POS-devices
 * 5 live keys - and notably no `created_at` or `updated_at`, so the timestamps
 * present on every other entity cannot be assumed here.
 */
export const LoyversePosDeviceEntity = z
	.object({
		/**
		 * POS device id. If included in POST it updates instead of creating.
		 * Official.
		 */
		id: Id,
		/** POS device name. Official. */
		name: S,
		/** Store id this device is connected to. Official. */
		store_id: S,
		/**
		 * If true, this device is connected to the physical device. Official.
		 */
		activated: B,
		/** Time this resource was deleted, ISO 8601. Official. */
		deleted_at: S,
	})
	.loose();
export type LoyversePosDeviceEntity = z.infer<typeof LoyversePosDeviceEntity>;

/**
 * The account's currency, nested on the merchant record.
 * Official: Merchant `currency`.
 */
export const LoyverseCurrency = z
	.object({
		/** ISO currency code. Official. */
		code: S,
		/** Number of decimal places for this currency. Official. */
		decimal_places: N,
	})
	.loose();
export type LoyverseCurrency = z.infer<typeof LoyverseCurrency>;

/**
 * Merchant information. Official: https://developer.loyverse.com/docs/#tag/Merchant
 * 6 live keys.
 *
 * A per-account singleton reached at `GET /merchant/`. It does have an `id`, so
 * unlike Harvest's company settings it needs no entity-id override, but there is
 * only ever one row.
 */
export const LoyverseMerchantEntity = z
	.object({
		/** Merchant id. Official. */
		id: Id,
		/** Business name. Official. */
		business_name: S,
		/** Merchant email. Official. */
		email: S,
		/** Merchant country. Official. */
		country: S,
		/** Account currency. Official. */
		currency: LoyverseCurrency.nullable().optional(),
		/** Time this resource was created, ISO 8601. Official. */
		created_at: S,
	})
	.loose();
export type LoyverseMerchantEntity = z.infer<typeof LoyverseMerchantEntity>;
