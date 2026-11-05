import { z } from 'zod';
import type {
	LoyverseComponent,
	LoyverseStoreOverride,
} from '../schema/database';
import {
	LoyverseCategoryEntity,
	LoyverseCustomerEntity,
	LoyverseDiscountEntity,
	LoyverseEmployeeEntity,
	LoyverseItemEntity,
	LoyverseMerchantEntity,
	LoyverseModifierEntity,
	LoyversePaymentTypeEntity,
	LoyversePosDeviceEntity,
	LoyverseStoreEntity,
	LoyverseSupplierEntity,
	LoyverseTaxEntity,
	LoyverseVariantEntity,
} from '../schema/database';

/**
 * Input and output schemas for every Loyverse operation.
 *
 * Output schemas reuse the entity definitions in `schema/database.ts` rather
 * than restating them, so the persisted shape and the returned shape cannot
 * drift apart.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/* -------------------------------------------------------------------------- */
/*                                  Envelopes                                 */
/* -------------------------------------------------------------------------- */

/**
 * Loyverse wraps every collection in the same envelope: the rows under a
 * resource-named key, plus an opaque `cursor`.
 *
 * `cursor` is `.optional()` rather than `.nullable()` on purpose. Loyverse
 * **omits the key entirely** from the final page rather than sending `null`,
 * verified live by paging through items with `limit=1`, so an absent cursor is
 * the end-of-collection signal.
 *
 * Declaring the wrapper once keeps all sixteen list operations consistent.
 *
 * @see https://developer.loyverse.com/docs/
 */
const withCursor = <Key extends string, Item extends z.ZodType>(
	key: Key,
	item: Item,
) =>
	z
		.object({
			[key]: z.array(item),
			cursor: z.string().optional(),
		} as { [K in Key]: z.ZodArray<Item> } & {
			cursor: z.ZodOptional<z.ZodString>;
		})
		.loose();

/**
 * Query parameters accepted by the collection endpoints.
 *
 * `limit` is capped at 250 by the API, which enforces it: 251 is answered with
 * 400 INVALID_VALUE rather than being silently clamped, so the bound is
 * declared here to fail before the request is made.
 *
 * `show_deleted` surfaces soft-deleted rows. Loyverse hides them from a plain
 * list and from a direct read, but they remain retrievable this way and carry
 * `deleted_at`.
 */
const ListQuery = {
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(250).optional(),
	show_deleted: z.boolean().optional(),
	created_at_min: z.string().optional(),
	created_at_max: z.string().optional(),
	updated_at_min: z.string().optional(),
	updated_at_max: z.string().optional(),
};

// Only 10 of the 16 collections actually paginate. Established by sending a
// deliberately invalid cursor: the paginating endpoints reject it with 400
// INVALID_CURSOR, while /discounts, /taxes, /payment_types, /stores,
// /pos_devices and /webhooks/ answer 200 and ignore it - they return the whole
// collection. `cursor` and `limit` are accepted there and simply have no effect,
// so they stay on the shared filter set; an absent `cursor` in the response means
// "no more pages" either way.

/** An id filter, sent as one comma-separated parameter. */
const Ids = z.array(z.string()).optional();

/**
 * Every DELETE answers 200 with the ids it removed.
 *
 * This is a real response body rather than a synthesised one, so it is parsed
 * rather than invented - a caller can tell how many records a delete actually
 * touched.
 */
export const DeleteResultSchema = z
	.object({
		deleted_object_ids: z.array(z.string()).nullable().optional(),
	})
	.loose();

/**
 * The two image operations answer with an empty body - 201 for an upload and 200
 * for a delete - so there is nothing to parse. They report the outcome
 * explicitly instead of returning an empty object, which would be
 * indistinguishable from a response that was swallowed.
 */
export const ImageResultSchema = z.object({
	success: z.boolean(),
	item_id: z.string(),
});

/* -------------------------------------------------------------------------- */
/*                       Records that are not persisted                       */
/* -------------------------------------------------------------------------- */

/**
 * Inventory levels.
 *
 * Not mirrored: there is no id to key on - the natural key is
 * `variant_id` + `store_id` - and the figure changes on every sale, so a
 * mirrored copy would be stale by design.
 */
export const InventoryLevelSchema = z
	.object({
		variant_id: S,
		store_id: S,
		in_stock: N,
		updated_at: S,
	})
	.loose();

/** Tax applied to one receipt line, with the money it accounted for. */
export const ReceiptLineTaxSchema = z
	.object({
		id: S,
		name: S,
		type: S,
		rate: N,
		money_amount: N,
	})
	.loose();

/** Discount applied to one receipt line. */
export const ReceiptLineDiscountSchema = z
	.object({
		id: S,
		name: S,
		type: S,
		percentage: N,
		money_amount: N,
	})
	.loose();

/** Modifier option chosen on one receipt line. */
export const ReceiptLineModifierSchema = z
	.object({
		id: S,
		modifier_option_id: S,
		name: S,
		option: S,
		price: N,
		money_amount: N,
	})
	.loose();

/**
 * One line of a receipt.
 *
 * `line_note` is free text written at the till, so it is never logged; see
 * `endpoints/logging.ts`.
 */
export const ReceiptLineItemSchema = z
	.object({
		id: S,
		item_id: S,
		variant_id: S,
		item_name: S,
		variant_name: S,
		sku: S,
		quantity: N,
		price: N,
		gross_total_money: N,
		total_money: N,
		cost: N,
		cost_total: N,
		line_note: S,
		total_discount: N,
		line_taxes: z.array(ReceiptLineTaxSchema).nullable().optional(),
		line_discounts: z.array(ReceiptLineDiscountSchema).nullable().optional(),
		line_modifiers: z.array(ReceiptLineModifierSchema).nullable().optional(),
	})
	.loose();

/** Card and gateway detail attached to an integrated payment. */
export const PaymentDetailsSchema = z
	.object({
		authorization_code: S,
		reference_id: S,
		entry_method: S,
		card_company: S,
		card_number: S,
	})
	.loose();

/** One payment against a receipt. */
export const ReceiptPaymentSchema = z
	.object({
		payment_type_id: S,
		name: S,
		type: S,
		money_amount: N,
		paid_at: S,
		payment_details: PaymentDetailsSchema.nullable().optional(),
	})
	.loose();

/** Receipt-level discount or tax totals. */
export const ReceiptTotalSchema = z
	.object({
		id: S,
		name: S,
		type: S,
		percentage: N,
		rate: N,
		money_amount: N,
	})
	.loose();

/**
 * Receipts.
 *
 * Transactional rather than reference data, so this shape lives here rather than
 * in `schema/database.ts` and is not persisted. 27 top-level keys and 76 nested
 * paths on a live capture - the deepest shape in the API.
 *
 * Keyed by `receipt_number`, a sequential string such as `"0001"`, not a UUID.
 */
export const ReceiptSchema = z
	.object({
		receipt_number: S,
		receipt_type: S,
		refund_for: S,
		order: S,
		note: S,
		receipt_date: S,
		created_at: S,
		updated_at: S,
		cancelled_at: S,
		source: S,
		total_money: N,
		total_tax: N,
		total_discount: N,
		points_earned: N,
		points_deducted: N,
		points_balance: N,
		tip: N,
		surcharge: N,
		customer_id: S,
		employee_id: S,
		store_id: S,
		pos_device_id: S,
		dining_option: S,
		total_discounts: z.array(ReceiptTotalSchema).nullable().optional(),
		total_taxes: z.array(ReceiptTotalSchema).nullable().optional(),
		line_items: z.array(ReceiptLineItemSchema).nullable().optional(),
		payments: z.array(ReceiptPaymentSchema).nullable().optional(),
	})
	.loose();

/**
 * Shifts.
 *
 * **This is the one schema not built from a captured response.** A shift only
 * exists once a cashier opens and closes one in the Loyverse POS app, which
 * needs a device login, and there is no endpoint to create one - so the capture
 * account returned an empty collection. The fields below come from the published
 * spec (`Shift`).
 *
 * Two mitigations apply. Every field is nullable and optional, as everywhere
 * else, so a missing or renamed field cannot reject a row; and the object is
 * `.loose()`, so a field the spec omits still survives into the result.
 */
export const ShiftSchema = z
	.object({
		id: S,
		store_id: S,
		pos_device_id: S,
		opened_at: S,
		closed_at: S,
		opened_by_employee_id: S,
		closed_by_employee_id: S,
		starting_cash: N,
		cash_payments: N,
		cash_refunds: N,
		paid_in: N,
		paid_out: N,
		expected_cash: N,
		actual_cash: N,
		gross_sales: N,
		refunds: N,
		discounts: N,
		net_sales: N,
		tip: N,
		surcharge: N,
		taxes: z.array(ReceiptTotalSchema).nullable().optional(),
		payments: z.array(ReceiptPaymentSchema).nullable().optional(),
	})
	.loose();

/**
 * Webhooks.
 *
 * Account configuration rather than business reference data, so not mirrored.
 *
 * Note `deleted_at`: the live response returns it and the published `Webhook`
 * schema does not declare it, which is one of the reasons the entity shapes in
 * this plugin are enumerated from responses rather than from the spec.
 */
export const WebhookSchema = z
	.object({
		id: S,
		merchant_id: S,
		url: S,
		type: S,
		status: S,
		created_at: S,
		updated_at: S,
		deleted_at: S,
	})
	.loose();

/** The OpenID Connect discovery document, served unauthenticated. */
export const OidcDiscoverySchema = z
	.object({
		issuer: S,
		authorization_endpoint: S,
		token_endpoint: S,
		userinfo_endpoint: S,
		jwks_uri: S,
		scopes_supported: z.array(z.string()).nullable().optional(),
		response_types_supported: z.array(z.string()).nullable().optional(),
	})
	.loose();

/**
 * A JSON Web Key Set.
 *
 * The individual keys are deliberately `z.unknown()`: a JWKS is consumed by a
 * JOSE library, its members vary by key type (an RSA key carries `n` and `e`, an
 * EC key `crv`, `x` and `y`), and narrowing it here would reject a valid key set
 * the moment Loyverse rotates to a different algorithm. `unknown` rather than
 * `any` keeps callers honest about validating it themselves.
 */
export const JwksSchema = z
	.object({
		keys: z.array(z.unknown()),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                              Reusable inputs                               */
/* -------------------------------------------------------------------------- */

/** Per-store price and stock override accepted on a variant write. */
const StoreOverrideInput = z
	.object({
		store_id: z.string(),
		pricing_type: z.enum(['FIXED', 'VARIABLE']).optional(),
		price: z.number().optional(),
		available_for_sale: z.boolean().optional(),
		optimal_stock: z.number().nullable().optional(),
		low_stock: z.number().nullable().optional(),
	})
	.loose();

/**
 * A variant supplied inside an item write.
 *
 * `variant_id` turns the entry into an update of that variant; omitting it adds
 * a new one.
 */
const VariantInput = z
	.object({
		variant_id: z.string().optional(),
		sku: z.string().min(1).max(40).optional(),
		reference_variant_id: z.string().max(128).nullable().optional(),
		option1_value: z.string().min(1).max(20).nullable().optional(),
		option2_value: z.string().min(1).max(20).nullable().optional(),
		option3_value: z.string().min(1).max(20).nullable().optional(),
		barcode: z.string().min(1).max(128).nullable().optional(),
		cost: z.number().optional(),
		purchase_cost: z.number().nullable().optional(),
		default_pricing_type: z.enum(['FIXED', 'VARIABLE']).optional(),
		default_price: z.number().nullable().optional(),
		stores: z.array(StoreOverrideInput).optional(),
	})
	.loose();

const ComponentInput = z
	.object({
		variant_id: z.string(),
		quantity: z.number(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                Input schemas                               */
/* -------------------------------------------------------------------------- */

const ListInput = z.object(ListQuery);
const EmptyInput = z.object({});

/* -------------------------------------------------------------------------- */
/*                      Resource-specific list filters                        */
/* -------------------------------------------------------------------------- */

/**
 * Each collection accepts its own id filter, and a few accept more.
 *
 * These are spelled out per resource rather than derived, because Loyverse is
 * inconsistent about pluralisation and a wrong name fails silently - it returns
 * the whole collection with a 200 rather than an error. Every name below was
 * confirmed live by checking the filter actually narrowed the result.
 */
const ItemsListInput = z.object({ ...ListQuery, items_ids: Ids });

const VariantsListInput = z.object({
	...ListQuery,
	variants_ids: Ids,
	items_ids: Ids,
	sku: z.string().optional(),
});

const CategoriesListInput = z.object({ ...ListQuery, categories_ids: Ids });

const ModifiersListInput = z.object({ ...ListQuery, modifier_ids: Ids });

const TaxesListInput = z.object({ ...ListQuery, tax_ids: Ids });

const SuppliersListInput = z.object({ ...ListQuery, suppliers_ids: Ids });

const EmployeesListInput = z.object({ ...ListQuery, employee_ids: Ids });

const PaymentTypesListInput = z.object({
	...ListQuery,
	payment_type_ids: Ids,
});

const StoresListInput = z.object({ ...ListQuery, store_ids: Ids });

/** POS devices filter by a single store rather than a list of them. */
const PosDevicesListInput = z.object({
	...ListQuery,
	store_id: z.string().optional(),
});

/**
 * Customers additionally filter by an exact email address, which is the only
 * text-search filter anywhere in the API.
 */
const CustomersListInput = z.object({
	...ListQuery,
	customer_ids: Ids,
	email: z.email().optional(),
});

/**
 * The basic discounts list.
 *
 * The catalog lists two discount list operations against the single
 * `GET /discounts` endpoint. This is the plain one; `discounts.listFiltered`
 * carries the id and date filters.
 */
const DiscountsListInput = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(250).optional(),
});

/** The filtered discounts list, matching the catalog's second discount list. */
const DiscountsListFilteredInput = z.object({
	...ListQuery,
	discount_ids: Ids,
});

/**
 * Shifts accept a store filter and creation-date bounds only - no
 * `updated_at` bounds and no `show_deleted`, since a closed shift is never
 * revised or removed.
 */
const ShiftsListInput = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(250).optional(),
	store_ids: Ids,
	created_at_min: z.string().optional(),
	created_at_max: z.string().optional(),
});

/**
 * Receipts have the richest filter set, including two cursor-like bounds on the
 * receipt number itself.
 *
 * Note that the date filters are **plan-limited**: on an account without
 * Unlimited sales history, asking for receipts older than 31 days returns
 * 402 PAYMENT_REQUIRED rather than an empty page.
 */
const ReceiptsListInput = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(250).optional(),
	receipt_numbers: Ids,
	since_receipt_number: z.string().optional(),
	before_receipt_number: z.string().optional(),
	store_id: z.string().optional(),
	order: z.string().optional(),
	source: z.string().optional(),
	created_at_min: z.string().optional(),
	created_at_max: z.string().optional(),
	updated_at_min: z.string().optional(),
	updated_at_max: z.string().optional(),
});

/**
 * Item write.
 *
 * `id` present means update, absent means create - Loyverse treats the
 * collection POST as an upsert.
 *
 * The `.refine()` encodes a rule that is not in the documentation and was found
 * live: on an update Loyverse reads an **absent** `variants` array as "set the
 * variants to empty" and rejects it with
 * `INVALID_VALUE  Could not update variants to []`. So an update has to restate
 * the variants it wants to keep. Failing here is far cheaper than failing at the
 * API with a message that does not explain itself.
 *
 * `modifier_ids` is singular-`modifier` on purpose. The spec documents the
 * request field as `modifiers_ids`, which the API accepts and then silently
 * ignores - verified live, the modifiers simply never attach.
 */
const ItemUpsertInput = z
	.object({
		id: z.string().optional(),
		item_name: z.string().min(1).max(64),
		description: z.string().min(1).max(32768).nullable().optional(),
		reference_id: z.string().max(128).nullable().optional(),
		category_id: z.string().nullable().optional(),
		track_stock: z.boolean().optional(),
		sold_by_weight: z.boolean().optional(),
		is_composite: z.boolean().optional(),
		use_production: z.boolean().optional(),
		components: z.array(ComponentInput).optional(),
		primary_supplier_id: z.string().nullable().optional(),
		tax_ids: z.array(z.string()).optional(),
		modifier_ids: z.array(z.string()).optional(),
		form: z.enum(['SQUARE', 'CIRCLE', 'SUN', 'OCTAGON']).optional(),
		color: z
			.enum([
				'GREY',
				'RED',
				'PINK',
				'ORANGE',
				'YELLOW',
				'GREEN',
				'BLUE',
				'PURPLE',
			])
			.optional(),
		option1_name: z.string().nullable().optional(),
		option2_name: z.string().nullable().optional(),
		option3_name: z.string().nullable().optional(),
		variants: z.array(VariantInput).optional(),
	})
	.refine((input) => input.id === undefined || input.variants !== undefined, {
		message:
			'variants is required when updating an item: Loyverse reads an absent variants array as an instruction to remove every variant and rejects the request',
		path: ['variants'],
	});

/**
 * Variant write.
 *
 * Creating a variant has a precondition that is easy to hit and produces a
 * confusing error, so it is encoded here. The parent item must already declare
 * option names, and the new variant must supply the matching option values.
 * Verified live against both failure modes:
 *
 * - parent item has no `option1_name`:
 *   `INVALID_VALUE  Could not add variant to item with id '...' because it has
 *   no options.` - and it fails whether or not an option value is supplied.
 * - parent item has options but the variant omits `option1_value`:
 *   `INVALID_VALUE  You cannot add or delete options for an existing item with
 *   variants.`
 *
 * The schema cannot see the parent item, so it enforces what it can - a create
 * needs an `item_id` - and documents the rest. To give an item its first option
 * axis, set `option1_name` through `items.upsert` with the variants restated.
 */
const VariantUpsertInput = z
	.object({
		variant_id: z.string().optional(),
		item_id: z.string().optional(),
		sku: z.string().min(1).max(40).optional(),
		reference_variant_id: z.string().max(128).nullable().optional(),
		option1_value: z.string().min(1).max(20).nullable().optional(),
		option2_value: z.string().min(1).max(20).nullable().optional(),
		option3_value: z.string().min(1).max(20).nullable().optional(),
		barcode: z.string().min(1).max(128).nullable().optional(),
		cost: z.number().optional(),
		purchase_cost: z.number().nullable().optional(),
		default_pricing_type: z.enum(['FIXED', 'VARIABLE']).optional(),
		default_price: z.number().nullable().optional(),
		stores: z.array(StoreOverrideInput).optional(),
	})
	.refine(
		(input) => input.variant_id !== undefined || input.item_id !== undefined,
		{
			message:
				'item_id is required when creating a variant: a variant cannot exist without the item it belongs to, and that item must already declare option names',
			path: ['item_id'],
		},
	);

const CategoryUpsertInput = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	color: z.string().optional(),
});

const ModifierUpsertInput = z.object({
	id: z.string().optional(),
	name: z.string().max(40),
	position: z.number().int().optional(),
	stores: z.array(z.string()).optional(),
	modifier_options: z
		.array(
			z
				.object({
					id: z.string().optional(),
					name: z.string(),
					price: z.number().optional(),
					position: z.number().int().optional(),
				})
				.loose(),
		)
		.min(1),
});

/**
 * Discount write.
 *
 * The amount field depends on the type, which the API documents field by field:
 * `discount_percent` applies only to `FIXED_PERCENT` and `discount_amount` only
 * to `FIXED_AMOUNT`. The variable and points types take neither - the value is
 * chosen at the till. Encoded rather than left to a 400.
 */
const DiscountUpsertInput = z
	.object({
		id: z.string().optional(),
		name: z.string().min(1).max(40),
		type: z.enum([
			'FIXED_PERCENT',
			'FIXED_AMOUNT',
			'VARIABLE_PERCENT',
			'VARIABLE_AMOUNT',
			'DISCOUNT_BY_POINTS',
		]),
		discount_amount: z.number().min(0.01).max(999999.99).optional(),
		discount_percent: z.number().min(0.01).max(100).optional(),
		stores: z.array(z.string()).optional(),
		restricted_access: z.boolean().optional(),
	})
	.refine(
		(input) =>
			input.type !== 'FIXED_PERCENT' || input.discount_percent !== undefined,
		{
			message: 'discount_percent is required when type is FIXED_PERCENT',
			path: ['discount_percent'],
		},
	)
	.refine(
		(input) =>
			input.type !== 'FIXED_AMOUNT' || input.discount_amount !== undefined,
		{
			message: 'discount_amount is required when type is FIXED_AMOUNT',
			path: ['discount_amount'],
		},
	);

const TaxUpsertInput = z.object({
	id: z.string().optional(),
	name: z.string(),
	type: z.enum(['INCLUDED', 'ADDED']),
	rate: z.number().min(0).max(100),
	stores: z.array(z.string()).optional(),
});

/**
 * Customer write.
 *
 * `z.email()` rather than `z.string().email()`, which zod 4 deprecates.
 */
const CustomerUpsertInput = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	email: z.email().nullable().optional(),
	phone_number: z.string().nullable().optional(),
	address: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	region: z.string().nullable().optional(),
	postal_code: z.string().nullable().optional(),
	country_code: z.string().nullable().optional(),
	customer_code: z.string().nullable().optional(),
	note: z.string().nullable().optional(),
});

const SupplierUpsertInput = z.object({
	id: z.string().optional(),
	name: z.string().min(1),
	contact: z.string().nullable().optional(),
	email: z.email().nullable().optional(),
	phone_number: z.string().nullable().optional(),
	address_1: z.string().nullable().optional(),
	address_2: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	region: z.string().nullable().optional(),
	postal_code: z.string().nullable().optional(),
	country_code: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
	note: z.string().nullable().optional(),
});

const PosDeviceUpsertInput = z.object({
	id: z.string().optional(),
	name: z.string(),
	store_id: z.string(),
});

/**
 * Webhook write.
 *
 * `status` is required despite the spec listing only `url` as required -
 * verified live: omitting it returns
 * `MISSING_REQUIRED_PARAMETER  field: object.status`.
 */
const WebhookUpsertInput = z.object({
	id: z.string().optional(),
	url: z.string().url(),
	type: z.enum([
		'inventory_levels.update',
		'items.update',
		'customers.update',
		'receipts.update',
		'shifts.create',
	]),
	status: z.enum(['ENABLED', 'DISABLED']),
});

/**
 * Inventory update.
 *
 * `stock_after` is the resulting absolute level, not a delta, so repeating a
 * call is harmless - see the note in `error-handlers.ts`.
 */
const InventoryUpdateInput = z.object({
	inventory_levels: z
		.array(
			z.object({
				variant_id: z.string(),
				store_id: z.string(),
				stock_after: z.number(),
			}),
		)
		.min(1),
});

/**
 * Inventory filters by store and variant.
 *
 * `store_ids` is plural. An earlier draft sent `store_id`, which Loyverse
 * ignores - it answers 200 with every store's levels, so the mistake looked like
 * a working call returning too much data rather than an error.
 *
 * There is no `show_deleted` and no `created_at` bound: a stock level has no
 * lifecycle of its own, only an `updated_at`.
 */
const InventoryListInput = z.object({
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(250).optional(),
	store_ids: Ids,
	variant_ids: Ids,
	updated_at_min: z.string().optional(),
	updated_at_max: z.string().optional(),
});

/** Line item on a receipt write. */
const ReceiptLineItemInput = z
	.object({
		id: z.string().optional(),
		variant_id: z.string(),
		quantity: z.number(),
		price: z.number().optional(),
		cost: z.number().optional(),
		line_note: z.string().optional(),
		line_taxes: z.array(z.object({ id: z.string() })).optional(),
		line_discounts: z.array(z.object({ id: z.string() })).optional(),
		line_modifiers: z
			.array(
				z.object({
					modifier_option_id: z.string(),
					price: z.number().optional(),
				}),
			)
			.optional(),
	})
	.loose();

const ReceiptPaymentInput = z.object({
	payment_type_id: z.string(),
	money_amount: z.number(),
	paid_at: z.string().optional(),
});

/**
 * Receipt creation.
 *
 * The API accepts exactly one payment per POST, which is a documented
 * restriction rather than a modelling choice here, so the array is bounded to
 * one entry.
 */
const ReceiptCreateInput = z.object({
	store_id: z.string(),
	employee_id: z.string().optional(),
	customer_id: z.string().optional(),
	order: z.string().optional(),
	source: z.string().optional(),
	receipt_date: z.string().optional(),
	note: z.string().optional(),
	dining_option: z.string().optional(),
	total_discounts: z.array(z.object({ id: z.string() })).optional(),
	line_items: z.array(ReceiptLineItemInput).min(1),
	payments: z.array(ReceiptPaymentInput).min(1).max(1),
});

/**
 * Refund against an existing receipt.
 *
 * Each refunded line must carry the `id` of the line on the original receipt,
 * not just its `variant_id` - found live: sending only `variant_id` returns
 * `MISSING_REQUIRED_PARAMETER  field: object.line_items[0].id`.
 */
const ReceiptRefundInput = z.object({
	receipt_number: z.string(),
	store_id: z.string(),
	employee_id: z.string().optional(),
	note: z.string().optional(),
	line_items: z
		.array(
			z
				.object({
					id: z.string(),
					variant_id: z.string().optional(),
					quantity: z.number(),
					price: z.number().optional(),
				})
				.loose(),
		)
		.min(1),
	payments: z.array(ReceiptPaymentInput).min(1).max(1),
});

/**
 * Item image upload.
 *
 * The bytes arrive base64-encoded because an endpoint input has to be
 * serialisable; the endpoint decodes them and sends the raw binary body the API
 * expects. Loyverse rejects a very small image with a 500, so a minimum length
 * is enforced here to catch an empty or truncated payload before it becomes an
 * unexplained server error.
 */
const ItemImageUploadInput = z.object({
	item_id: z.string(),
	image_base64: z.string().min(64),
	/**
	 * PNG unless stated otherwise. Both types the catalog names are accepted; the
	 * API does not appear to validate the declared type against the bytes, but
	 * declaring the right one keeps the request honest.
	 */
	media_type: z.enum(['image/png', 'image/jpeg']).optional(),
});

/* -------------------------------------------------------------------------- */
/*                            Input schema registry                           */
/* -------------------------------------------------------------------------- */

export const LoyverseEndpointInputSchemas = {
	itemsList: ItemsListInput,
	itemsGet: z.object({ item_id: z.string() }),
	itemsUpsert: ItemUpsertInput,
	itemsDelete: z.object({ item_id: z.string() }),
	itemsUploadImage: ItemImageUploadInput,
	itemsDeleteImage: z.object({ item_id: z.string() }),

	variantsList: VariantsListInput,
	variantsGet: z.object({ variant_id: z.string() }),
	variantsUpsert: VariantUpsertInput,
	variantsDelete: z.object({ variant_id: z.string() }),

	categoriesList: CategoriesListInput,
	categoriesGet: z.object({ category_id: z.string() }),
	categoriesUpsert: CategoryUpsertInput,
	categoriesDelete: z.object({ category_id: z.string() }),

	modifiersList: ModifiersListInput,
	modifiersGet: z.object({ modifier_id: z.string() }),
	modifiersUpsert: ModifierUpsertInput,
	modifiersDelete: z.object({ modifier_id: z.string() }),

	discountsList: DiscountsListInput,
	discountsListFiltered: DiscountsListFilteredInput,
	discountsGet: z.object({ discount_id: z.string() }),
	discountsUpsert: DiscountUpsertInput,
	discountsDelete: z.object({ discount_id: z.string() }),

	taxesList: TaxesListInput,
	taxesGet: z.object({ tax_id: z.string() }),
	taxesUpsert: TaxUpsertInput,
	taxesDelete: z.object({ tax_id: z.string() }),

	customersList: CustomersListInput,
	customersGet: z.object({ customer_id: z.string() }),
	customersUpsert: CustomerUpsertInput,
	customersDelete: z.object({ customer_id: z.string() }),

	suppliersList: SuppliersListInput,
	suppliersGet: z.object({ supplier_id: z.string() }),
	suppliersUpsert: SupplierUpsertInput,
	suppliersDelete: z.object({ supplier_id: z.string() }),

	posDevicesList: PosDevicesListInput,
	posDevicesGet: z.object({ pos_device_id: z.string() }),
	posDevicesUpsert: PosDeviceUpsertInput,
	posDevicesDelete: z.object({ pos_device_id: z.string() }),

	// The webhook collection accepts no query parameters at all.
	webhooksList: EmptyInput,
	webhooksGet: z.object({ webhook_id: z.string() }),
	webhooksUpsert: WebhookUpsertInput,
	webhooksDelete: z.object({ webhook_id: z.string() }),

	inventoryList: InventoryListInput,
	inventoryUpdate: InventoryUpdateInput,

	employeesList: EmployeesListInput,
	employeesGet: z.object({ employee_id: z.string() }),

	paymentTypesList: PaymentTypesListInput,
	paymentTypesGet: z.object({ payment_type_id: z.string() }),

	storesList: StoresListInput,
	storesGet: z.object({ store_id: z.string() }),

	// The catalog lists no Get Shift, and none is implemented; a shift is only
	// ever read as part of a range.
	shiftsList: ShiftsListInput,

	receiptsList: ReceiptsListInput,
	receiptsGet: z.object({ receipt_number: z.string() }),
	receiptsCreate: ReceiptCreateInput,
	receiptsRefund: ReceiptRefundInput,

	merchantGet: EmptyInput,

	oidcDiscovery: EmptyInput,
	oidcJwks: EmptyInput,
} as const;

/* -------------------------------------------------------------------------- */
/*                           Output schema registry                           */
/* -------------------------------------------------------------------------- */

export const LoyverseEndpointOutputSchemas = {
	itemsList: withCursor('items', LoyverseItemEntity),
	itemsGet: LoyverseItemEntity,
	itemsUpsert: LoyverseItemEntity,
	itemsDelete: DeleteResultSchema,
	itemsUploadImage: ImageResultSchema,
	itemsDeleteImage: ImageResultSchema,

	variantsList: withCursor('variants', LoyverseVariantEntity),
	variantsGet: LoyverseVariantEntity,
	variantsUpsert: LoyverseVariantEntity,
	variantsDelete: DeleteResultSchema,

	categoriesList: withCursor('categories', LoyverseCategoryEntity),
	categoriesGet: LoyverseCategoryEntity,
	categoriesUpsert: LoyverseCategoryEntity,
	categoriesDelete: DeleteResultSchema,

	modifiersList: withCursor('modifiers', LoyverseModifierEntity),
	modifiersGet: LoyverseModifierEntity,
	modifiersUpsert: LoyverseModifierEntity,
	modifiersDelete: DeleteResultSchema,

	discountsList: withCursor('discounts', LoyverseDiscountEntity),
	discountsListFiltered: withCursor('discounts', LoyverseDiscountEntity),
	discountsGet: LoyverseDiscountEntity,
	discountsUpsert: LoyverseDiscountEntity,
	discountsDelete: DeleteResultSchema,

	taxesList: withCursor('taxes', LoyverseTaxEntity),
	taxesGet: LoyverseTaxEntity,
	taxesUpsert: LoyverseTaxEntity,
	taxesDelete: DeleteResultSchema,

	customersList: withCursor('customers', LoyverseCustomerEntity),
	customersGet: LoyverseCustomerEntity,
	customersUpsert: LoyverseCustomerEntity,
	customersDelete: DeleteResultSchema,

	suppliersList: withCursor('suppliers', LoyverseSupplierEntity),
	suppliersGet: LoyverseSupplierEntity,
	suppliersUpsert: LoyverseSupplierEntity,
	suppliersDelete: DeleteResultSchema,

	posDevicesList: withCursor('pos_devices', LoyversePosDeviceEntity),
	posDevicesGet: LoyversePosDeviceEntity,
	posDevicesUpsert: LoyversePosDeviceEntity,
	posDevicesDelete: DeleteResultSchema,

	webhooksList: withCursor('webhooks', WebhookSchema),
	webhooksGet: WebhookSchema,
	webhooksUpsert: WebhookSchema,
	webhooksDelete: DeleteResultSchema,

	// The one collection whose array key does not match its path segment.
	inventoryList: withCursor('inventory_levels', InventoryLevelSchema),
	inventoryUpdate: z
		.object({ inventory_levels: z.array(InventoryLevelSchema) })
		.loose(),

	employeesList: withCursor('employees', LoyverseEmployeeEntity),
	employeesGet: LoyverseEmployeeEntity,

	paymentTypesList: withCursor('payment_types', LoyversePaymentTypeEntity),
	paymentTypesGet: LoyversePaymentTypeEntity,

	storesList: withCursor('stores', LoyverseStoreEntity),
	storesGet: LoyverseStoreEntity,

	shiftsList: withCursor('shifts', ShiftSchema),

	receiptsList: withCursor('receipts', ReceiptSchema),
	receiptsGet: ReceiptSchema,
	receiptsCreate: ReceiptSchema,
	receiptsRefund: ReceiptSchema,

	merchantGet: LoyverseMerchantEntity,

	oidcDiscovery: OidcDiscoverySchema,
	oidcJwks: JwksSchema,
} as const;

export type LoyverseEndpointInputs = {
	[K in keyof typeof LoyverseEndpointInputSchemas]: z.infer<
		(typeof LoyverseEndpointInputSchemas)[K]
	>;
};

export type LoyverseEndpointOutputs = {
	[K in keyof typeof LoyverseEndpointOutputSchemas]: z.infer<
		(typeof LoyverseEndpointOutputSchemas)[K]
	>;
};

export type LoyverseInventoryLevel = z.infer<typeof InventoryLevelSchema>;
export type LoyverseReceipt = z.infer<typeof ReceiptSchema>;
export type LoyverseShift = z.infer<typeof ShiftSchema>;
export type LoyverseWebhook = z.infer<typeof WebhookSchema>;
export type LoyverseStoreOverrideInput = z.infer<typeof StoreOverrideInput>;
export type LoyverseVariantInput = z.infer<typeof VariantInput>;
export type LoyverseComponentInput = z.infer<typeof ComponentInput>;

// Re-exported so the entity types travel with the operation types.
export type { LoyverseComponent, LoyverseStoreOverride };
