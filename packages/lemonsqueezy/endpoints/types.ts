import { z } from 'zod';

// Lemon Squeezy speaks JSON:API 1.0. Every response is
// `{ data, links?, meta?, jsonapi }`, and a write body is
// `{ data: { type, id?, attributes, relationships? } }`.
//
// Shapes here were checked against live answers on 2026-11-10 with a test-mode
// store, not copied from the docs' examples: the docs show a customer's
// `total_revenue_currency` as a number (it is), a store's `total_revenue` as a
// number (it is), and every collection answer carries `meta.page`, which the
// per-endpoint examples omit for single resources.

// ── Shared JSON:API building blocks ───────────────────────────────────────

/** Links a JSON:API document may carry. Each resource relation has its own. */
const LinksSchema = z
	.object({ first: z.string().nullish(), last: z.string().nullish() })
	.loose();

/** The page block on every list answer. */
export const PageMetaSchema = z
	.object({
		currentPage: z.number(),
		from: z.number().nullish(),
		lastPage: z.number(),
		perPage: z.number(),
		to: z.number().nullish(),
		total: z.number().nullish(),
	})
	.loose();

export type LemonSqueezyPageMeta = z.infer<typeof PageMetaSchema>;

/**
 * One entry of the `errors` array. `detail` is the sentence to show; `source`
 * names the offending field as either a parameter name or a JSON pointer.
 */
export const LemonSqueezyErrorSchema = z
	.object({
		status: z.string().nullish(),
		code: z.string().nullish(),
		title: z.string().nullish(),
		detail: z.string().nullish(),
		source: z
			.object({
				pointer: z.string().nullish(),
				parameter: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

/** A resource's relationship links. `related` is the collection to read. */
const RelationshipSchema = z
	.object({
		links: z
			.object({ related: z.string().nullish(), self: z.string().nullish() })
			.loose()
			.nullish(),
	})
	.loose();

/** Every resource carries these; `type` and `id` are strings even for numeric ids. */
const ResourceBaseSchema = z
	.object({
		type: z.string(),
		id: z.string(),
		attributes: z.record(z.string(), z.json()).optional(),
		relationships: z.record(z.string(), RelationshipSchema).optional(),
		links: z.object({ self: z.string().nullish() }).loose().optional(),
	})
	.loose();

/**
 * A single-resource answer. `meta.test_mode` appears on the endpoints that
 * report it, which is why `meta` stays an open object rather than the page
 * block used by lists.
 */
const SingleDocumentSchema = <T extends z.ZodType>(resource: T) =>
	z
		.object({
			data: resource,
			links: LinksSchema.optional(),
			meta: z.record(z.string(), z.json()).optional(),
			jsonapi: z.object({ version: z.string() }).loose().optional(),
		})
		.loose();

/** A list answer: the resources plus the page block the API always sends. */
const ListDocumentSchema = <T extends z.ZodType>(resource: T) =>
	z
		.object({
			data: z.array(resource),
			links: LinksSchema.optional(),
			meta: z.object({ page: PageMetaSchema }).loose(),
			jsonapi: z.object({ version: z.string() }).loose().optional(),
		})
		.loose();

// ── Resource schemas ──────────────────────────────────────────────────────
//
// Attributes are `.loose()` and their optional fields `.nullish()`: Lemon
// Squeezy sends JSON null for unset values and adds fields over time, so a
// strict shape would fail a call that already happened.

export const StoreSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			name: z.string().nullish(),
			slug: z.string().nullish(),
			domain: z.string().nullish(),
			url: z.string().nullish(),
			avatar_url: z.string().nullish(),
			plan: z.string().nullish(),
			country: z.string().nullish(),
			country_nicename: z.string().nullish(),
			currency: z.string().nullish(),
			total_sales: z.number().nullish(),
			total_revenue: z.number().nullish(),
			thirty_day_sales: z.number().nullish(),
			thirty_day_revenue: z.number().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyStore = z.infer<typeof StoreSchema>;

export const UserSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			name: z.string().nullish(),
			email: z.string().nullish(),
			color: z.string().nullish(),
			avatar_url: z.string().nullish(),
			has_custom_avatar: z.boolean().nullish(),
			// These two are camelCase on the live answer, unlike every other field.
			createdAt: z.string().nullish(),
			updatedAt: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyUser = z.infer<typeof UserSchema>;

export const ProductSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			name: z.string().nullish(),
			slug: z.string().nullish(),
			description: z.string().nullish(),
			status: z.string().nullish(),
			status_formatted: z.string().nullish(),
			thumb_url: z.string().nullish(),
			large_thumb_url: z.string().nullish(),
			price: z.number().nullish(),
			price_formatted: z.string().nullish(),
			from_price: z.number().nullish(),
			from_price_formatted: z.string().nullish(),
			to_price: z.number().nullish(),
			to_price_formatted: z.string().nullish(),
			pay_what_you_want: z.boolean().nullish(),
			buy_now_url: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyProduct = z.infer<typeof ProductSchema>;

/** A variant's `links` holds the checkout URLs, not relationship links. */
export const VariantSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			product_id: z.number().nullish(),
			name: z.string().nullish(),
			slug: z.string().nullish(),
			description: z.string().nullish(),
			has_license_keys: z.boolean().nullish(),
			license_activation_limit: z.number().nullish(),
			is_license_limit_unlimited: z.boolean().nullish(),
			license_length_value: z.number().nullish(),
			license_length_unit: z.string().nullish(),
			is_license_length_unlimited: z.boolean().nullish(),
			sort: z.number().nullish(),
			status: z.string().nullish(),
			status_formatted: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
	links: z.object({ self: z.string().nullish() }).loose().optional(),
}).loose();

export type LemonSqueezyVariant = z.infer<typeof VariantSchema>;

/** `tiers` and `unit_price_decimal` differ by price scheme, so both stay open. */
export const PriceSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			variant_id: z.number().nullish(),
			category: z.string().nullish(),
			scheme: z.string().nullish(),
			usage_aggregation: z.string().nullish(),
			unit_price: z.number().nullish(),
			unit_price_decimal: z.string().nullish(),
			setup_fee_enabled: z.boolean().nullish(),
			setup_fee: z.number().nullish(),
			package_size: z.number().nullish(),
			renewal_interval_unit: z.string().nullish(),
			renewal_interval_quantity: z.number().nullish(),
			trial_interval_unit: z.string().nullish(),
			trial_interval_quantity: z.number().nullish(),
			min_price: z.number().nullish(),
			suggested_price: z.number().nullish(),
			tax_code: z.string().nullish(),
			// unknown: a tier's fields depend on the price scheme, and Lemon
			// Squeezy documents them per scheme rather than as one shape.
			tiers: z.array(z.record(z.string(), z.json())).nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyPrice = z.infer<typeof PriceSchema>;

export const FileSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			variant_id: z.number().nullish(),
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			extension: z.string().nullish(),
			download_url: z.string().nullish(),
			size: z.number().nullish(),
			size_formatted: z.string().nullish(),
			version: z.string().nullish(),
			sort: z.number().nullish(),
			status: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyFile = z.infer<typeof FileSchema>;

export const OrderSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			customer_id: z.number().nullish(),
			affiliate_id: z.number().nullish(),
			identifier: z.string().nullish(),
			order_number: z.number().nullish(),
			user_name: z.string().nullish(),
			user_email: z.string().nullish(),
			currency: z.string().nullish(),
			currency_rate: z.string().nullish(),
			subtotal: z.number().nullish(),
			setup_fee: z.number().nullish(),
			discount_total: z.number().nullish(),
			tax: z.number().nullish(),
			total: z.number().nullish(),
			refunded_amount: z.number().nullish(),
			subtotal_usd: z.number().nullish(),
			setup_fee_usd: z.number().nullish(),
			discount_total_usd: z.number().nullish(),
			tax_usd: z.number().nullish(),
			total_usd: z.number().nullish(),
			refunded_amount_usd: z.number().nullish(),
			tax_name: z.string().nullish(),
			// A decimal percentage sent as a string, such as "20.00", the same
			// way currency_rate is. Live docs example, checked 2026-11-10.
			tax_rate: z.string().nullish(),
			refunded: z.boolean().nullish(),
			refunded_at: z.string().nullish(),
			status: z.string().nullish(),
			status_formatted: z.string().nullish(),
			subtotal_formatted: z.string().nullish(),
			setup_fee_formatted: z.string().nullish(),
			discount_total_formatted: z.string().nullish(),
			tax_formatted: z.string().nullish(),
			total_formatted: z.string().nullish(),
			refunded_amount_formatted: z.string().nullish(),
			// unknown: the first line item is a product snapshot whose fields
			// Lemon Squeezy owns; the order-item endpoints read it typed.
			first_order_item: z.record(z.string(), z.json()).nullish(),
			urls: z.object({ receipt: z.string().nullish() }).loose().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyOrder = z.infer<typeof OrderSchema>;

export const OrderItemSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			order_id: z.number().nullish(),
			product_id: z.number().nullish(),
			variant_id: z.number().nullish(),
			product_name: z.string().nullish(),
			variant_name: z.string().nullish(),
			price: z.number().nullish(),
			quantity: z.number().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyOrderItem = z.infer<typeof OrderItemSchema>;

export const SubscriptionSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			customer_id: z.number().nullish(),
			order_id: z.number().nullish(),
			order_item_id: z.number().nullish(),
			product_id: z.number().nullish(),
			variant_id: z.number().nullish(),
			product_name: z.string().nullish(),
			variant_name: z.string().nullish(),
			user_name: z.string().nullish(),
			user_email: z.string().nullish(),
			status: z.string().nullish(),
			status_formatted: z.string().nullish(),
			card_brand: z.string().nullish(),
			card_last_four: z.string().nullish(),
			payment_processor: z.string().nullish(),
			// `pause` is null unless the subscription is paused.
			pause: z
				.object({
					mode: z.string().nullish(),
					resumes_at: z.string().nullish(),
				})
				.loose()
				.nullish(),
			cancelled: z.boolean().nullish(),
			trial_ends_at: z.string().nullish(),
			billing_anchor: z.number().nullish(),
			// The first item is inlined rather than related, so it keeps its shape.
			first_subscription_item: z
				.object({
					id: z.number().nullish(),
					subscription_id: z.number().nullish(),
					price_id: z.number().nullish(),
					quantity: z.number().nullish(),
					is_usage_based: z.boolean().nullish(),
					created_at: z.string().nullish(),
					updated_at: z.string().nullish(),
				})
				.loose()
				.nullish(),
			urls: z
				.object({
					update_payment_method: z.string().nullish(),
					customer_portal: z.string().nullish(),
					customer_portal_update_subscription: z.string().nullish(),
				})
				.loose()
				.nullish(),
			renews_at: z.string().nullish(),
			ends_at: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezySubscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionItemSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			subscription_id: z.number().nullish(),
			price_id: z.number().nullish(),
			quantity: z.number().nullish(),
			is_usage_based: z.boolean().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezySubscriptionItem = z.infer<
	typeof SubscriptionItemSchema
>;

/**
 * `current-usage` answers only a `meta` block with the period and its usage
 * total; there is no `data` member.
 */
export const SubscriptionItemUsageSchema = z
	.object({
		meta: z
			.object({
				period_start: z.string().nullish(),
				period_end: z.string().nullish(),
				quantity: z.number().nullish(),
				interval_unit: z.string().nullish(),
				interval_quantity: z.number().nullish(),
			})
			.loose(),
		jsonapi: z.object({ version: z.string() }).loose().optional(),
	})
	.loose();

export type LemonSqueezySubscriptionItemUsage = z.infer<
	typeof SubscriptionItemUsageSchema
>;

export const SubscriptionInvoiceSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			subscription_id: z.number().nullish(),
			customer_id: z.number().nullish(),
			user_name: z.string().nullish(),
			user_email: z.string().nullish(),
			billing_reason: z.string().nullish(),
			card_brand: z.string().nullish(),
			card_last_four: z.string().nullish(),
			currency: z.string().nullish(),
			currency_rate: z.string().nullish(),
			status: z.string().nullish(),
			status_formatted: z.string().nullish(),
			refunded: z.boolean().nullish(),
			refunded_at: z.string().nullish(),
			subtotal: z.number().nullish(),
			discount_total: z.number().nullish(),
			tax: z.number().nullish(),
			total: z.number().nullish(),
			refunded_amount: z.number().nullish(),
			subtotal_usd: z.number().nullish(),
			discount_total_usd: z.number().nullish(),
			tax_usd: z.number().nullish(),
			total_usd: z.number().nullish(),
			refunded_amount_usd: z.number().nullish(),
			subtotal_formatted: z.string().nullish(),
			discount_total_formatted: z.string().nullish(),
			tax_formatted: z.string().nullish(),
			total_formatted: z.string().nullish(),
			refunded_amount_formatted: z.string().nullish(),
			urls: z.object({ invoice_url: z.string().nullish() }).loose().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezySubscriptionInvoice = z.infer<
	typeof SubscriptionInvoiceSchema
>;

export const CustomerSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			name: z.string().nullish(),
			email: z.string().nullish(),
			status: z.string().nullish(),
			status_formatted: z.string().nullish(),
			city: z.string().nullish(),
			region: z.string().nullish(),
			country: z.string().nullish(),
			country_formatted: z.string().nullish(),
			total_revenue_currency: z.number().nullish(),
			total_revenue_currency_formatted: z.string().nullish(),
			mrr: z.number().nullish(),
			mrr_formatted: z.string().nullish(),
			urls: z
				.object({ customer_portal: z.string().nullish() })
				.loose()
				.nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyCustomer = z.infer<typeof CustomerSchema>;

export const DiscountSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			name: z.string().nullish(),
			code: z.string().nullish(),
			amount: z.number().nullish(),
			amount_type: z.string().nullish(),
			is_limited_to_products: z.boolean().nullish(),
			is_limited_redemptions: z.boolean().nullish(),
			max_redemptions: z.number().nullish(),
			starts_at: z.string().nullish(),
			expires_at: z.string().nullish(),
			duration: z.string().nullish(),
			duration_in_months: z.number().nullish(),
			status: z.string().nullish(),
			status_formatted: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyDiscount = z.infer<typeof DiscountSchema>;

export const DiscountRedemptionSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			discount_id: z.number().nullish(),
			order_id: z.number().nullish(),
			discount_name: z.string().nullish(),
			discount_code: z.string().nullish(),
			discount_amount: z.number().nullish(),
			discount_amount_type: z.string().nullish(),
			amount: z.number().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyDiscountRedemption = z.infer<
	typeof DiscountRedemptionSchema
>;

export const LicenseKeySchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			customer_id: z.number().nullish(),
			order_id: z.number().nullish(),
			order_item_id: z.number().nullish(),
			product_id: z.number().nullish(),
			user_name: z.string().nullish(),
			user_email: z.string().nullish(),
			key: z.string().nullish(),
			key_short: z.string().nullish(),
			activation_limit: z.number().nullish(),
			instances_count: z.number().nullish(),
			disabled: z.boolean().nullish(),
			status: z.string().nullish(),
			status_formatted: z.string().nullish(),
			expires_at: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyLicenseKey = z.infer<typeof LicenseKeySchema>;

export const LicenseKeyInstanceSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			license_key_id: z.number().nullish(),
			identifier: z.string().nullish(),
			name: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyLicenseKeyInstance = z.infer<
	typeof LicenseKeyInstanceSchema
>;

export const CheckoutSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			variant_id: z.number().nullish(),
			// A custom price is null unless the checkout overrides the variant's.
			custom_price: z.number().nullish(),
			// unknown: these three are free-form option maps whose keys Lemon
			// Squeezy documents but does not close, so they stay open objects.
			product_options: z.record(z.string(), z.json()).nullish(),
			checkout_options: z.record(z.string(), z.json()).nullish(),
			checkout_data: z.record(z.string(), z.json()).nullish(),
			expires_at: z.string().nullish(),
			// The checkout URL for this session; the create call is its only source.
			url: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyCheckout = z.infer<typeof CheckoutSchema>;

export const WebhookSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			url: z.string().nullish(),
			events: z.array(z.string()).nullish(),
			last_sent_at: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
			test_mode: z.boolean().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyWebhook = z.infer<typeof WebhookSchema>;

export const UsageRecordSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			subscription_item_id: z.number().nullish(),
			quantity: z.number().nullish(),
			action: z.string().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyUsageRecord = z.infer<typeof UsageRecordSchema>;

export const AffiliateSchema = ResourceBaseSchema.extend({
	attributes: z
		.object({
			store_id: z.number().nullish(),
			user_id: z.number().nullish(),
			user_name: z.string().nullish(),
			user_email: z.string().nullish(),
			share_domain: z.string().nullish(),
			status: z.string().nullish(),
			// unknown: this is a map of the store's per-product affiliate rates,
			// keyed by product id, which Lemon Squeezy sends as an open object.
			products: z.record(z.string(), z.json()).nullish(),
			total_earnings: z.number().nullish(),
			unpaid_earnings: z.number().nullish(),
			created_at: z.string().nullish(),
			updated_at: z.string().nullish(),
		})
		.loose(),
}).loose();

export type LemonSqueezyAffiliate = z.infer<typeof AffiliateSchema>;

// ── Query parameters ──────────────────────────────────────────────────────

/**
 * Paging, sorting and sparse fieldsets, which every list accepts. Lemon
 * Squeezy caps `page[size]` at 100 and rejects anything larger with a 400
 * naming `page.size`, so the cap is enforced here.
 */
const ListQueryShape = {
	pageNumber: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('The page to read, starting at 1.'),
	pageSize: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Items per page. Lemon Squeezy caps this at 100.'),
	sort: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Field to sort by, prefixed with `-` for descending, such as `-createdAt`. The allowed fields differ per resource; an unsupported one answers 400.',
		),
	include: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe(
			'Related resources to embed, such as ["subscription-items"]. They arrive in the answer\'s `included` array.',
		),
} as const;

/** Turns the shared paging and include parameters into JSON:API keys. */
function listQuery(parsed: {
	pageNumber?: number;
	pageSize?: number;
	sort?: string;
	include?: readonly string[];
}): Record<string, string | number | boolean | undefined> {
	return {
		'page[number]': parsed.pageNumber,
		'page[size]': parsed.pageSize,
		sort: parsed.sort,
		include: parsed.include?.join(','),
	};
}

/** A single resource's id, which every retrieve, update and action takes. */
const ResourceId = z.string().min(1);

// ── users ─────────────────────────────────────────────────────────────────

const GetUserInputSchema = z.object({});

export type GetUserInput = z.infer<typeof GetUserInputSchema>;

const GetUserResponseSchema = SingleDocumentSchema(UserSchema);

export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;

// ── stores ────────────────────────────────────────────────────────────────

const ListStoresInputSchema = z.object({ ...ListQueryShape });

export type ListStoresInput = z.input<typeof ListStoresInputSchema>;

const ListStoresResponseSchema = ListDocumentSchema(StoreSchema);

export type ListStoresResponse = z.infer<typeof ListStoresResponseSchema>;

const GetStoreInputSchema = z.object({
	storeId: ResourceId.describe('The store id, as `data.id` reports it.'),
});

export type GetStoreInput = z.infer<typeof GetStoreInputSchema>;

const GetStoreResponseSchema = SingleDocumentSchema(StoreSchema);

export type GetStoreResponse = z.infer<typeof GetStoreResponseSchema>;

// ── products ──────────────────────────────────────────────────────────────

const ListProductsInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only products in this store.'),
});

export type ListProductsInput = z.input<typeof ListProductsInputSchema>;

const ListProductsResponseSchema = ListDocumentSchema(ProductSchema);

export type ListProductsResponse = z.infer<typeof ListProductsResponseSchema>;

const GetProductInputSchema = z.object({
	productId: ResourceId.describe('The product id.'),
});

export type GetProductInput = z.infer<typeof GetProductInputSchema>;

const GetProductResponseSchema = SingleDocumentSchema(ProductSchema);

export type GetProductResponse = z.infer<typeof GetProductResponseSchema>;

// ── variants ──────────────────────────────────────────────────────────────

const ListVariantsInputSchema = z.object({
	...ListQueryShape,
	productId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only variants of this product.'),
	status: z
		.enum(['pending', 'draft', 'published'])
		.optional()
		.describe('Only variants in this status.'),
});

export type ListVariantsInput = z.input<typeof ListVariantsInputSchema>;

const ListVariantsResponseSchema = ListDocumentSchema(VariantSchema);

export type ListVariantsResponse = z.infer<typeof ListVariantsResponseSchema>;

const GetVariantInputSchema = z.object({
	variantId: ResourceId.describe('The variant id.'),
});

export type GetVariantInput = z.infer<typeof GetVariantInputSchema>;

const GetVariantResponseSchema = SingleDocumentSchema(VariantSchema);

export type GetVariantResponse = z.infer<typeof GetVariantResponseSchema>;

// ── prices ────────────────────────────────────────────────────────────────

const ListPricesInputSchema = z.object({
	...ListQueryShape,
	variantId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only prices of this variant.'),
});

export type ListPricesInput = z.input<typeof ListPricesInputSchema>;

const ListPricesResponseSchema = ListDocumentSchema(PriceSchema);

export type ListPricesResponse = z.infer<typeof ListPricesResponseSchema>;

const GetPriceInputSchema = z.object({
	priceId: ResourceId.describe('The price id.'),
});

export type GetPriceInput = z.infer<typeof GetPriceInputSchema>;

const GetPriceResponseSchema = SingleDocumentSchema(PriceSchema);

export type GetPriceResponse = z.infer<typeof GetPriceResponseSchema>;

// ── files ─────────────────────────────────────────────────────────────────

const ListFilesInputSchema = z.object({
	...ListQueryShape,
	variantId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only files of this variant.'),
});

export type ListFilesInput = z.input<typeof ListFilesInputSchema>;

const ListFilesResponseSchema = ListDocumentSchema(FileSchema);

export type ListFilesResponse = z.infer<typeof ListFilesResponseSchema>;

const GetFileInputSchema = z.object({
	fileId: ResourceId.describe('The file id.'),
});

export type GetFileInput = z.infer<typeof GetFileInputSchema>;

const GetFileResponseSchema = SingleDocumentSchema(FileSchema);

export type GetFileResponse = z.infer<typeof GetFileResponseSchema>;

// ── orders ────────────────────────────────────────────────────────────────

const ListOrdersInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only orders in this store.'),
	userEmail: z
		.string()
		.email()
		.optional()
		.describe('Only orders for this email address.'),
	orderNumber: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only the order with this number.'),
});

export type ListOrdersInput = z.input<typeof ListOrdersInputSchema>;

const ListOrdersResponseSchema = ListDocumentSchema(OrderSchema);

export type ListOrdersResponse = z.infer<typeof ListOrdersResponseSchema>;

const GetOrderInputSchema = z.object({
	orderId: ResourceId.describe('The order id.'),
});

export type GetOrderInput = z.infer<typeof GetOrderInputSchema>;

const GetOrderResponseSchema = SingleDocumentSchema(OrderSchema);

export type GetOrderResponse = z.infer<typeof GetOrderResponseSchema>;

/**
 * The billing details printed on a generated invoice. Lemon Squeezy reads them
 * from the query string, not a body, and documents name, address, city, ZIP
 * code and country as required, with the state required for the US and Canada.
 */
const InvoiceDetailsShape = {
	name: z.string().min(1).describe('The full name shown on the invoice.'),
	address: z.string().min(1).describe('The street address.'),
	city: z.string().min(1).describe('The city.'),
	state: z
		.string()
		.min(1)
		.optional()
		.describe('The state or province. Required for the US and Canada.'),
	zipCode: z.string().min(1).describe('The ZIP or postal code.'),
	country: z
		.string()
		.min(1)
		.describe('The country, as an ISO 3166-1 alpha-2 code such as US.'),
	notes: z
		.string()
		.min(1)
		.optional()
		.describe('Extra notes printed on the invoice.'),
	locale: z
		.string()
		.min(1)
		.optional()
		.describe('An ISO 639 language code for the invoice, such as en.'),
} as const;

function requireStateForUsAndCanada(
	value: { country: string; state?: string },
	ctx: z.RefinementCtx,
) {
	if (
		['US', 'CA'].includes(value.country.toUpperCase()) &&
		value.state === undefined
	) {
		ctx.addIssue({
			code: 'custom',
			path: ['state'],
			message: 'state is required for a US or Canadian address',
		});
	}
}

/** Turns the invoice details into the query parameters Lemon Squeezy reads. */
export function invoiceQuery(parsed: {
	name: string;
	address: string;
	city: string;
	state?: string;
	zipCode: string;
	country: string;
	notes?: string;
	locale?: string;
}): Record<string, string | undefined> {
	return {
		name: parsed.name,
		address: parsed.address,
		city: parsed.city,
		state: parsed.state,
		zip_code: parsed.zipCode,
		country: parsed.country,
		notes: parsed.notes,
		locale: parsed.locale,
	};
}

/**
 * Both generate-invoice routes answer a link to the PDF under `meta.urls`, with
 * no `data` member.
 */
const GeneratedInvoiceSchema = z
	.object({
		meta: z
			.object({
				urls: z.object({ download_invoice: z.string() }).loose(),
			})
			.loose(),
		jsonapi: z.object({ version: z.string() }).loose().optional(),
	})
	.loose();

const GenerateOrderInvoiceInputSchema = z
	.object({
		orderId: ResourceId.describe('The order to generate an invoice for.'),
		...InvoiceDetailsShape,
	})
	.superRefine(requireStateForUsAndCanada);

export type GenerateOrderInvoiceInput = z.input<
	typeof GenerateOrderInvoiceInputSchema
>;

const GenerateOrderInvoiceResponseSchema = GeneratedInvoiceSchema;

export type GenerateOrderInvoiceResponse = z.infer<
	typeof GenerateOrderInvoiceResponseSchema
>;

/**
 * A refund. `amount` is in cents and optional: omitting it refunds the whole
 * order. A partial refund cannot be undone through the API.
 */
const IssueOrderRefundInputSchema = z.object({
	orderId: ResourceId.describe('The order to refund.'),
	amount: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'The amount to refund, in cents. Omit it for a full refund. A partial refund cannot be undone.',
		),
});

export type IssueOrderRefundInput = z.infer<typeof IssueOrderRefundInputSchema>;

const IssueOrderRefundResponseSchema = SingleDocumentSchema(OrderSchema);

export type IssueOrderRefundResponse = z.infer<
	typeof IssueOrderRefundResponseSchema
>;

// ── order items ───────────────────────────────────────────────────────────

const ListOrderItemsInputSchema = z.object({
	...ListQueryShape,
	orderId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only items of this order.'),
	productId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only items for this product.'),
	variantId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only items for this variant.'),
});

export type ListOrderItemsInput = z.input<typeof ListOrderItemsInputSchema>;

const ListOrderItemsResponseSchema = ListDocumentSchema(OrderItemSchema);

export type ListOrderItemsResponse = z.infer<
	typeof ListOrderItemsResponseSchema
>;

const GetOrderItemInputSchema = z.object({
	orderItemId: ResourceId.describe('The order item id.'),
});

export type GetOrderItemInput = z.infer<typeof GetOrderItemInputSchema>;

const GetOrderItemResponseSchema = SingleDocumentSchema(OrderItemSchema);

export type GetOrderItemResponse = z.infer<typeof GetOrderItemResponseSchema>;

// ── subscriptions ─────────────────────────────────────────────────────────

const ListSubscriptionsInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only subscriptions in this store.'),
	orderId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only subscriptions from this order.'),
	orderItemId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only subscriptions from this order item.'),
	productId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only subscriptions for this product.'),
	variantId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only subscriptions for this variant.'),
	userEmail: z
		.string()
		.email()
		.optional()
		.describe('Only subscriptions for this email address.'),
	status: z
		.enum([
			'on_trial',
			'active',
			'paused',
			'past_due',
			'unpaid',
			'cancelled',
			'expired',
		])
		.optional()
		.describe('Only subscriptions in this status.'),
});

export type ListSubscriptionsInput = z.input<
	typeof ListSubscriptionsInputSchema
>;

const ListSubscriptionsResponseSchema = ListDocumentSchema(SubscriptionSchema);

export type ListSubscriptionsResponse = z.infer<
	typeof ListSubscriptionsResponseSchema
>;

const GetSubscriptionInputSchema = z.object({
	subscriptionId: ResourceId.describe('The subscription id.'),
});

export type GetSubscriptionInput = z.infer<typeof GetSubscriptionInputSchema>;

const GetSubscriptionResponseSchema = SingleDocumentSchema(SubscriptionSchema);

export type GetSubscriptionResponse = z.infer<
	typeof GetSubscriptionResponseSchema
>;

/**
 * An update moves the subscription to another variant, pauses or resumes it,
 * or changes its billing date. Every attribute is optional, but sending none
 * is a request the API answers with an unchanged resource, so at least one is
 * required here.
 */
const UpdateSubscriptionInputSchema = z
	.object({
		subscriptionId: ResourceId.describe('The subscription to update.'),
		variantId: z
			.number()
			.int()
			.positive()
			.optional()
			.describe(
				'Move the subscription to this variant. Lemon Squeezy prorates the next charge unless `invoiceImmediately` is set.',
			),
		invoiceImmediately: z
			.boolean()
			.optional()
			.describe(
				'Charge the prorated difference now instead of at the next billing date.',
			),
		disableProrations: z
			.boolean()
			.optional()
			.describe('Do not prorate the charge when the plan changes.'),
		pause: z
			.object({
				mode: z
					.enum(['void', 'free'])
					.describe(
						'`void` cancels the pending invoice, `free` keeps the subscription active without charging until `resumesAt`.',
					),
				resumesAt: z
					.string()
					.min(1)
					.optional()
					.describe(
						'When collection resumes, as an ISO 8601 date such as 2027-01-01.',
					),
			})
			.optional()
			.describe('Pause collection. Only valid on an active subscription.'),
		unpause: z
			.boolean()
			.optional()
			.describe(
				'Resume collection on a paused subscription. Sent as `pause: null`, which is how the API unpauses.',
			),
		billingAnchor: z
			.number()
			.int()
			.min(1)
			.max(31)
			.optional()
			.describe(
				"Move the billing date to this day of the month, 1 to 31. A day past the month's end uses its last day.",
			),
	})
	.superRefine((value, ctx) => {
		const changes = [
			value.variantId,
			value.pause,
			value.unpause,
			value.billingAnchor,
		].filter((v) => v !== undefined);
		if (changes.length === 0) {
			ctx.addIssue({
				code: 'custom',
				message:
					'give at least one of variantId, pause, unpause or billingAnchor, or the update changes nothing',
			});
		}
		if (value.pause !== undefined && value.unpause !== undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['unpause'],
				message: 'pause and unpause are opposite actions; send one',
			});
		}
		if (
			value.invoiceImmediately !== undefined &&
			value.variantId === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['invoiceImmediately'],
				message: 'invoiceImmediately only applies to a variant change',
			});
		}
	});

export type UpdateSubscriptionInput = z.input<
	typeof UpdateSubscriptionInputSchema
>;

const UpdateSubscriptionResponseSchema =
	SingleDocumentSchema(SubscriptionSchema);

export type UpdateSubscriptionResponse = z.infer<
	typeof UpdateSubscriptionResponseSchema
>;

const CancelSubscriptionInputSchema = z.object({
	subscriptionId: ResourceId.describe('The subscription to cancel.'),
});

export type CancelSubscriptionInput = z.infer<
	typeof CancelSubscriptionInputSchema
>;

const CancelSubscriptionResponseSchema =
	SingleDocumentSchema(SubscriptionSchema);

export type CancelSubscriptionResponse = z.infer<
	typeof CancelSubscriptionResponseSchema
>;

// ── subscription items ────────────────────────────────────────────────────

const ListSubscriptionItemsInputSchema = z.object({
	...ListQueryShape,
	subscriptionId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only items of this subscription.'),
	priceId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only items on this price.'),
});

export type ListSubscriptionItemsInput = z.input<
	typeof ListSubscriptionItemsInputSchema
>;

const ListSubscriptionItemsResponseSchema = ListDocumentSchema(
	SubscriptionItemSchema,
);

export type ListSubscriptionItemsResponse = z.infer<
	typeof ListSubscriptionItemsResponseSchema
>;

const GetSubscriptionItemInputSchema = z.object({
	subscriptionItemId: ResourceId.describe('The subscription item id.'),
});

export type GetSubscriptionItemInput = z.infer<
	typeof GetSubscriptionItemInputSchema
>;

const GetSubscriptionItemResponseSchema = SingleDocumentSchema(
	SubscriptionItemSchema,
);

export type GetSubscriptionItemResponse = z.infer<
	typeof GetSubscriptionItemResponseSchema
>;

/** A usage-based item's metered usage so far in the billing period. */
const GetSubscriptionItemUsageInputSchema = z.object({
	subscriptionItemId: ResourceId.describe('The subscription item id.'),
});

export type GetSubscriptionItemUsageInput = z.infer<
	typeof GetSubscriptionItemUsageInputSchema
>;

const GetSubscriptionItemUsageResponseSchema = SubscriptionItemUsageSchema;

export type GetSubscriptionItemUsageResponse = z.infer<
	typeof GetSubscriptionItemUsageResponseSchema
>;

const UpdateSubscriptionItemInputSchema = z.object({
	subscriptionItemId: ResourceId.describe('The subscription item to update.'),
	quantity: z
		.number()
		.int()
		.min(1)
		.describe(
			'The new quantity. Use `usageRecords.create` for metered increases.',
		),
});

export type UpdateSubscriptionItemInput = z.input<
	typeof UpdateSubscriptionItemInputSchema
>;

const UpdateSubscriptionItemResponseSchema = SingleDocumentSchema(
	SubscriptionItemSchema,
);

export type UpdateSubscriptionItemResponse = z.infer<
	typeof UpdateSubscriptionItemResponseSchema
>;

// ── subscription invoices ─────────────────────────────────────────────────

const ListSubscriptionInvoicesInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only invoices in this store.'),
	status: z
		.enum(['pending', 'paid', 'void', 'refunded', 'partial_refund'])
		.optional()
		.describe('Only invoices in this status.'),
	refunded: z
		.boolean()
		.optional()
		.describe('Only refunded or only unrefunded invoices.'),
	subscriptionId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only invoices of this subscription.'),
});

export type ListSubscriptionInvoicesInput = z.input<
	typeof ListSubscriptionInvoicesInputSchema
>;

const ListSubscriptionInvoicesResponseSchema = ListDocumentSchema(
	SubscriptionInvoiceSchema,
);

export type ListSubscriptionInvoicesResponse = z.infer<
	typeof ListSubscriptionInvoicesResponseSchema
>;

const GetSubscriptionInvoiceInputSchema = z.object({
	subscriptionInvoiceId: ResourceId.describe('The subscription invoice id.'),
});

export type GetSubscriptionInvoiceInput = z.infer<
	typeof GetSubscriptionInvoiceInputSchema
>;

const GetSubscriptionInvoiceResponseSchema = SingleDocumentSchema(
	SubscriptionInvoiceSchema,
);

export type GetSubscriptionInvoiceResponse = z.infer<
	typeof GetSubscriptionInvoiceResponseSchema
>;

const GenerateSubscriptionInvoiceInputSchema = z
	.object({
		subscriptionInvoiceId: ResourceId.describe(
			'The subscription invoice to generate a PDF invoice for.',
		),
		...InvoiceDetailsShape,
	})
	.superRefine(requireStateForUsAndCanada);

export type GenerateSubscriptionInvoiceInput = z.input<
	typeof GenerateSubscriptionInvoiceInputSchema
>;

const GenerateSubscriptionInvoiceResponseSchema = GeneratedInvoiceSchema;

export type GenerateSubscriptionInvoiceResponse = z.infer<
	typeof GenerateSubscriptionInvoiceResponseSchema
>;

const IssueSubscriptionInvoiceRefundInputSchema = z.object({
	subscriptionInvoiceId: ResourceId.describe(
		'The subscription invoice to refund.',
	),
	amount: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'The amount to refund, in cents. Omit it for a full refund. A partial refund cannot be undone.',
		),
});

export type IssueSubscriptionInvoiceRefundInput = z.infer<
	typeof IssueSubscriptionInvoiceRefundInputSchema
>;

const IssueSubscriptionInvoiceRefundResponseSchema = SingleDocumentSchema(
	SubscriptionInvoiceSchema,
);

export type IssueSubscriptionInvoiceRefundResponse = z.infer<
	typeof IssueSubscriptionInvoiceRefundResponseSchema
>;

// ── usage records ─────────────────────────────────────────────────────────

const ListUsageRecordsInputSchema = z.object({
	...ListQueryShape,
	subscriptionItemId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only usage records of this subscription item.'),
});

export type ListUsageRecordsInput = z.input<typeof ListUsageRecordsInputSchema>;

const ListUsageRecordsResponseSchema = ListDocumentSchema(UsageRecordSchema);

export type ListUsageRecordsResponse = z.infer<
	typeof ListUsageRecordsResponseSchema
>;

const GetUsageRecordInputSchema = z.object({
	usageRecordId: ResourceId.describe('The usage record id.'),
});

export type GetUsageRecordInput = z.infer<typeof GetUsageRecordInputSchema>;

const GetUsageRecordResponseSchema = SingleDocumentSchema(UsageRecordSchema);

export type GetUsageRecordResponse = z.infer<
	typeof GetUsageRecordResponseSchema
>;

/**
 * Records metered usage against a subscription item. `quantity` is additive:
 * each call increases the period's usage by that amount.
 */
const CreateUsageRecordInputSchema = z.object({
	subscriptionItemId: z
		.number()
		.int()
		.positive()
		.describe('The usage-based subscription item to record usage against.'),
	quantity: z
		.number()
		.int()
		.min(1)
		.describe(
			'The amount to add for this period. Each call adds to the total.',
		),
	action: z
		.enum(['increment', 'set'])
		.optional()
		.describe(
			'`increment` adds the quantity to the period total; `set` replaces it. Defaults to increment.',
		),
});

export type CreateUsageRecordInput = z.input<
	typeof CreateUsageRecordInputSchema
>;

const CreateUsageRecordResponseSchema = SingleDocumentSchema(UsageRecordSchema);

export type CreateUsageRecordResponse = z.infer<
	typeof CreateUsageRecordResponseSchema
>;

// ── customers ─────────────────────────────────────────────────────────────

const ListCustomersInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only customers in this store.'),
	email: z
		.string()
		.email()
		.optional()
		.describe('Only the customer with this email.'),
});

export type ListCustomersInput = z.input<typeof ListCustomersInputSchema>;

const ListCustomersResponseSchema = ListDocumentSchema(CustomerSchema);

export type ListCustomersResponse = z.infer<typeof ListCustomersResponseSchema>;

const GetCustomerInputSchema = z.object({
	customerId: ResourceId.describe('The customer id.'),
});

export type GetCustomerInput = z.infer<typeof GetCustomerInputSchema>;

const GetCustomerResponseSchema = SingleDocumentSchema(CustomerSchema);

export type GetCustomerResponse = z.infer<typeof GetCustomerResponseSchema>;

/**
 * Creates a customer record. Lemon Squeezy does not send an invite; a customer
 * made this way only shows up in the dashboard and can be linked to an order.
 */
const CreateCustomerInputSchema = z.object({
	storeId: z
		.number()
		.int()
		.positive()
		.describe('The store the customer belongs to.'),
	name: z.string().min(1).describe('The customer name.'),
	email: z.string().email().describe('The customer email address.'),
});

export type CreateCustomerInput = z.input<typeof CreateCustomerInputSchema>;

const CreateCustomerResponseSchema = SingleDocumentSchema(CustomerSchema);

export type CreateCustomerResponse = z.infer<
	typeof CreateCustomerResponseSchema
>;

const UpdateCustomerInputSchema = z
	.object({
		customerId: ResourceId.describe('The customer to update.'),
		name: z.string().min(1).optional().describe('The new name.'),
		email: z.string().email().optional().describe('The new email address.'),
	})
	.superRefine((value, ctx) => {
		if (value.name === undefined && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'give name or email, or the update changes nothing',
			});
		}
	});

export type UpdateCustomerInput = z.input<typeof UpdateCustomerInputSchema>;

const UpdateCustomerResponseSchema = SingleDocumentSchema(CustomerSchema);

export type UpdateCustomerResponse = z.infer<
	typeof UpdateCustomerResponseSchema
>;

// ── discounts ─────────────────────────────────────────────────────────────

export const LEMONSQUEEZY_DISCOUNT_DURATIONS = [
	'once',
	'repeating',
	'forever',
] as const;

const ListDiscountsInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only discounts in this store.'),
});

export type ListDiscountsInput = z.input<typeof ListDiscountsInputSchema>;

const ListDiscountsResponseSchema = ListDocumentSchema(DiscountSchema);

export type ListDiscountsResponse = z.infer<typeof ListDiscountsResponseSchema>;

const GetDiscountInputSchema = z.object({
	discountId: ResourceId.describe('The discount id.'),
});

export type GetDiscountInput = z.infer<typeof GetDiscountInputSchema>;

const GetDiscountResponseSchema = SingleDocumentSchema(DiscountSchema);

export type GetDiscountResponse = z.infer<typeof GetDiscountResponseSchema>;

/**
 * Creates a discount code. `amount` means percent or cents depending on
 * `amountType`, and `durationInMonths` is only read when `duration` is
 * `repeating`; sending it otherwise is accepted and ignored, so the mismatch
 * is rejected here.
 */
const CreateDiscountInputSchema = z
	.object({
		storeId: z
			.number()
			.int()
			.positive()
			.describe('The store the discount belongs to.'),
		name: z
			.string()
			.min(1)
			.describe('A name for the discount, shown in the dashboard.'),
		code: z
			.string()
			.min(1)
			.describe(
				'The code a customer enters. Lemon Squeezy rejects one already in use.',
			),
		amount: z
			.number()
			.int()
			.min(1)
			.describe(
				'The discount: a percentage when `amountType` is percent, cents when fixed.',
			),
		amountType: z
			.enum(['percent', 'fixed'])
			.describe('Whether `amount` is a percentage or an amount in cents.'),
		duration: z
			.enum(LEMONSQUEEZY_DISCOUNT_DURATIONS)
			.describe(
				'`once` applies to the first payment, `repeating` to a number of months, `forever` to every payment.',
			),
		durationInMonths: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('How many months a `repeating` discount lasts.'),
		isLimitedRedemptions: z
			.boolean()
			.optional()
			.describe('Cap how many times the code can be redeemed.'),
		maxRedemptions: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('The redemption cap, when `isLimitedRedemptions` is true.'),
		startsAt: z
			.string()
			.min(1)
			.optional()
			.describe(
				'When the discount starts, as an ISO 8601 date. Defaults to now.',
			),
		expiresAt: z
			.string()
			.min(1)
			.optional()
			.describe('When the discount expires, as an ISO 8601 date.'),
	})
	.superRefine((value, ctx) => {
		if (value.amountType === 'percent' && value.amount > 100) {
			ctx.addIssue({
				code: 'custom',
				path: ['amount'],
				message: 'a percent discount cannot exceed 100',
			});
		}
		if (
			value.duration === 'repeating' &&
			value.durationInMonths === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['durationInMonths'],
				message: 'a repeating discount needs durationInMonths',
			});
		}
		if (
			value.isLimitedRedemptions === true &&
			value.maxRedemptions === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['maxRedemptions'],
				message: 'a redemption limit needs maxRedemptions',
			});
		}
		if (
			value.maxRedemptions !== undefined &&
			value.isLimitedRedemptions !== true
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['maxRedemptions'],
				message:
					'maxRedemptions is only read when isLimitedRedemptions is true',
			});
		}
	});

export type CreateDiscountInput = z.input<typeof CreateDiscountInputSchema>;

const CreateDiscountResponseSchema = SingleDocumentSchema(DiscountSchema);

export type CreateDiscountResponse = z.infer<
	typeof CreateDiscountResponseSchema
>;

const DeleteDiscountInputSchema = z.object({
	discountId: ResourceId.describe('The discount to delete.'),
});

export type DeleteDiscountInput = z.infer<typeof DeleteDiscountInputSchema>;

/** A delete answers 204 with no body. */
const DeleteDiscountResponseSchema = z.object({
	deleted: z.boolean(),
	discountId: z.string(),
});

export type DeleteDiscountResponse = z.infer<
	typeof DeleteDiscountResponseSchema
>;

// ── discount redemptions ──────────────────────────────────────────────────

const ListDiscountRedemptionsInputSchema = z.object({
	...ListQueryShape,
	discountId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only redemptions of this discount.'),
	orderId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only redemptions on this order.'),
});

export type ListDiscountRedemptionsInput = z.input<
	typeof ListDiscountRedemptionsInputSchema
>;

const ListDiscountRedemptionsResponseSchema = ListDocumentSchema(
	DiscountRedemptionSchema,
);

export type ListDiscountRedemptionsResponse = z.infer<
	typeof ListDiscountRedemptionsResponseSchema
>;

const GetDiscountRedemptionInputSchema = z.object({
	discountRedemptionId: ResourceId.describe('The discount redemption id.'),
});

export type GetDiscountRedemptionInput = z.infer<
	typeof GetDiscountRedemptionInputSchema
>;

const GetDiscountRedemptionResponseSchema = SingleDocumentSchema(
	DiscountRedemptionSchema,
);

export type GetDiscountRedemptionResponse = z.infer<
	typeof GetDiscountRedemptionResponseSchema
>;

// ── license keys ──────────────────────────────────────────────────────────

const ListLicenseKeysInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only license keys in this store.'),
	orderId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only license keys from this order.'),
	orderItemId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only license keys from this order item.'),
	productId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only license keys for this product.'),
	status: z
		.enum(['inactive', 'active', 'expired', 'disabled'])
		.optional()
		.describe('Only license keys in this status.'),
});

export type ListLicenseKeysInput = z.input<typeof ListLicenseKeysInputSchema>;

const ListLicenseKeysResponseSchema = ListDocumentSchema(LicenseKeySchema);

export type ListLicenseKeysResponse = z.infer<
	typeof ListLicenseKeysResponseSchema
>;

const GetLicenseKeyInputSchema = z.object({
	licenseKeyId: ResourceId.describe('The license key id.'),
});

export type GetLicenseKeyInput = z.infer<typeof GetLicenseKeyInputSchema>;

const GetLicenseKeyResponseSchema = SingleDocumentSchema(LicenseKeySchema);

export type GetLicenseKeyResponse = z.infer<typeof GetLicenseKeyResponseSchema>;

const UpdateLicenseKeyInputSchema = z
	.object({
		licenseKeyId: ResourceId.describe('The license key to update.'),
		activationLimit: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('The number of instances that can use this key.'),
		expiresAt: z
			.string()
			.min(1)
			.optional()
			.describe('When the key expires, as an ISO 8601 date.'),
		disabled: z.boolean().optional().describe('Disable or re-enable the key.'),
	})
	.superRefine((value, ctx) => {
		if (
			value.activationLimit === undefined &&
			value.expiresAt === undefined &&
			value.disabled === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message:
					'give activationLimit, expiresAt or disabled, or the update changes nothing',
			});
		}
	});

export type UpdateLicenseKeyInput = z.input<typeof UpdateLicenseKeyInputSchema>;

const UpdateLicenseKeyResponseSchema = SingleDocumentSchema(LicenseKeySchema);

export type UpdateLicenseKeyResponse = z.infer<
	typeof UpdateLicenseKeyResponseSchema
>;

// ── license key instances ─────────────────────────────────────────────────

const ListLicenseKeyInstancesInputSchema = z.object({
	...ListQueryShape,
	licenseKeyId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only instances of this license key.'),
});

export type ListLicenseKeyInstancesInput = z.input<
	typeof ListLicenseKeyInstancesInputSchema
>;

const ListLicenseKeyInstancesResponseSchema = ListDocumentSchema(
	LicenseKeyInstanceSchema,
);

export type ListLicenseKeyInstancesResponse = z.infer<
	typeof ListLicenseKeyInstancesResponseSchema
>;

const GetLicenseKeyInstanceInputSchema = z.object({
	licenseKeyInstanceId: ResourceId.describe('The license key instance id.'),
});

export type GetLicenseKeyInstanceInput = z.infer<
	typeof GetLicenseKeyInstanceInputSchema
>;

const GetLicenseKeyInstanceResponseSchema = SingleDocumentSchema(
	LicenseKeyInstanceSchema,
);

export type GetLicenseKeyInstanceResponse = z.infer<
	typeof GetLicenseKeyInstanceResponseSchema
>;

// ── checkouts ─────────────────────────────────────────────────────────────

const ListCheckoutsInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only checkouts in this store.'),
	variantId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only checkouts for this variant.'),
});

export type ListCheckoutsInput = z.input<typeof ListCheckoutsInputSchema>;

const ListCheckoutsResponseSchema = ListDocumentSchema(CheckoutSchema);

export type ListCheckoutsResponse = z.infer<typeof ListCheckoutsResponseSchema>;

const GetCheckoutInputSchema = z.object({
	checkoutId: ResourceId.describe('The checkout id.'),
});

export type GetCheckoutInput = z.infer<typeof GetCheckoutInputSchema>;

const GetCheckoutResponseSchema = SingleDocumentSchema(CheckoutSchema);

export type GetCheckoutResponse = z.infer<typeof GetCheckoutResponseSchema>;

/**
 * Creates a checkout session and returns its `url`, which is the point of the
 * call: the answer's `data.attributes.url` is the page to send a buyer to.
 */
const CreateCheckoutInputSchema = z.object({
	storeId: z
		.number()
		.int()
		.positive()
		.describe('The store the checkout belongs to.'),
	variantId: z
		.number()
		.int()
		.positive()
		.describe(
			'The variant to sell. Other variants of its product appear alongside it.',
		),
	customPrice: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Override the variant price, in cents. Only valid for a pay-what-you-want product.',
		),
	productOptions: z
		.record(z.string(), z.json())
		.optional()
		.describe(
			'Overrides such as `name`, `description`, `redirect_url`, `receipt_button_text`, `receipt_link_url`, `receipt_thank_you_note` and `enabled_variants`.',
		),
	checkoutOptions: z
		.record(z.string(), z.json())
		.optional()
		.describe(
			'Appearance and behaviour such as `embed`, `media`, `logo`, `desc`, `discount`, `subscription_preview`, the `*_color` values and `locale`.',
		),
	checkoutData: z
		.record(z.string(), z.json())
		.optional()
		.describe(
			'Prefill and custom data such as `email`, `name`, `billing_address`, `tax_number`, `discount_code`, `custom` and `variant_quantities`.',
		),
	expiresAt: z
		.string()
		.min(1)
		.optional()
		.describe('When the checkout link stops working, as an ISO 8601 date.'),
	preview: z
		.boolean()
		.optional()
		.describe('Return a preview checkout that cannot take a payment.'),
	testMode: z
		.boolean()
		.optional()
		.describe('Create a test-mode checkout. Defaults to the store mode.'),
});

export type CreateCheckoutInput = z.input<typeof CreateCheckoutInputSchema>;

const CreateCheckoutResponseSchema = SingleDocumentSchema(CheckoutSchema);

export type CreateCheckoutResponse = z.infer<
	typeof CreateCheckoutResponseSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

export const LEMONSQUEEZY_WEBHOOK_EVENTS = [
	'order_created',
	'order_refunded',
	'subscription_created',
	'subscription_updated',
	'subscription_cancelled',
	'subscription_resumed',
	'subscription_expired',
	'subscription_paused',
	'subscription_unpaused',
	'subscription_payment_success',
	'subscription_payment_failed',
	'subscription_payment_recovered',
	'subscription_payment_refunded',
	'subscription_trial_will_end',
	'license_key_created',
	'license_key_updated',
] as const;

const WebhookEventSchema = z.enum(LEMONSQUEEZY_WEBHOOK_EVENTS);

const ListWebhooksInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only webhooks in this store.'),
});

export type ListWebhooksInput = z.input<typeof ListWebhooksInputSchema>;

const ListWebhooksResponseSchema = ListDocumentSchema(WebhookSchema);

export type ListWebhooksResponse = z.infer<typeof ListWebhooksResponseSchema>;

const GetWebhookInputSchema = z.object({
	webhookId: ResourceId.describe('The webhook id.'),
});

export type GetWebhookInput = z.infer<typeof GetWebhookInputSchema>;

const GetWebhookResponseSchema = SingleDocumentSchema(WebhookSchema);

export type GetWebhookResponse = z.infer<typeof GetWebhookResponseSchema>;

/**
 * Registers a webhook. `secret` is required (live-verified: omitting it answers
 * 422 "The secret field is required") and is used to sign deliveries.
 */
const CreateWebhookInputSchema = z.object({
	storeId: z
		.number()
		.int()
		.positive()
		.describe('The store the webhook listens to.'),
	url: z
		.string()
		.url()
		.refine((value) => value.startsWith('https://'), 'must be https')
		.describe('The https URL Lemon Squeezy posts events to.'),
	events: z
		.array(WebhookEventSchema)
		.min(1)
		.describe('The events to send. At least one is required.'),
	secret: z
		.string()
		.min(6)
		.describe(
			'The signing secret. Lemon Squeezy signs each delivery with it, so store the same value to verify the `X-Signature` header.',
		),
});

export type CreateWebhookInput = z.input<typeof CreateWebhookInputSchema>;

const CreateWebhookResponseSchema = SingleDocumentSchema(WebhookSchema);

export type CreateWebhookResponse = z.infer<typeof CreateWebhookResponseSchema>;

const UpdateWebhookInputSchema = z
	.object({
		webhookId: ResourceId.describe('The webhook to update.'),
		url: z
			.string()
			.url()
			.refine((value) => value.startsWith('https://'), 'must be https')
			.optional()
			.describe('The new https URL.'),
		events: z
			.array(WebhookEventSchema)
			.min(1)
			.optional()
			.describe('The new event list, which replaces the old one.'),
		secret: z
			.string()
			.min(6)
			.optional()
			.describe('A new signing secret. Deliveries start using it immediately.'),
	})
	.superRefine((value, ctx) => {
		if (
			value.url === undefined &&
			value.events === undefined &&
			value.secret === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'give url, events or secret, or the update changes nothing',
			});
		}
	});

export type UpdateWebhookInput = z.input<typeof UpdateWebhookInputSchema>;

const UpdateWebhookResponseSchema = SingleDocumentSchema(WebhookSchema);

export type UpdateWebhookResponse = z.infer<typeof UpdateWebhookResponseSchema>;

const DeleteWebhookInputSchema = z.object({
	webhookId: ResourceId.describe('The webhook to delete.'),
});

export type DeleteWebhookInput = z.infer<typeof DeleteWebhookInputSchema>;

/** A delete answers 204 with no body. */
const DeleteWebhookResponseSchema = z.object({
	deleted: z.boolean(),
	webhookId: z.string(),
});

export type DeleteWebhookResponse = z.infer<typeof DeleteWebhookResponseSchema>;

// ── affiliates ────────────────────────────────────────────────────────────

const ListAffiliatesInputSchema = z.object({
	...ListQueryShape,
	storeId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only affiliates of this store.'),
	userEmail: z
		.string()
		.email()
		.optional()
		.describe('Only the affiliate with this email.'),
});

export type ListAffiliatesInput = z.input<typeof ListAffiliatesInputSchema>;

const ListAffiliatesResponseSchema = ListDocumentSchema(AffiliateSchema);

export type ListAffiliatesResponse = z.infer<
	typeof ListAffiliatesResponseSchema
>;

const GetAffiliateInputSchema = z.object({
	affiliateId: ResourceId.describe('The affiliate id.'),
});

export type GetAffiliateInput = z.infer<typeof GetAffiliateInputSchema>;

const GetAffiliateResponseSchema = SingleDocumentSchema(AffiliateSchema);

export type GetAffiliateResponse = z.infer<typeof GetAffiliateResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type LemonSqueezyEndpointInputs = {
	usersGet: GetUserInput;
	storesList: ListStoresInput;
	storesGet: GetStoreInput;
	productsList: ListProductsInput;
	productsGet: GetProductInput;
	variantsList: ListVariantsInput;
	variantsGet: GetVariantInput;
	pricesList: ListPricesInput;
	pricesGet: GetPriceInput;
	filesList: ListFilesInput;
	filesGet: GetFileInput;
	ordersList: ListOrdersInput;
	ordersGet: GetOrderInput;
	ordersGenerateInvoice: GenerateOrderInvoiceInput;
	ordersRefund: IssueOrderRefundInput;
	orderItemsList: ListOrderItemsInput;
	orderItemsGet: GetOrderItemInput;
	subscriptionsList: ListSubscriptionsInput;
	subscriptionsGet: GetSubscriptionInput;
	subscriptionsUpdate: UpdateSubscriptionInput;
	subscriptionsCancel: CancelSubscriptionInput;
	subscriptionItemsList: ListSubscriptionItemsInput;
	subscriptionItemsGet: GetSubscriptionItemInput;
	subscriptionItemsUsage: GetSubscriptionItemUsageInput;
	subscriptionItemsUpdate: UpdateSubscriptionItemInput;
	subscriptionInvoicesList: ListSubscriptionInvoicesInput;
	subscriptionInvoicesGet: GetSubscriptionInvoiceInput;
	subscriptionInvoicesGenerate: GenerateSubscriptionInvoiceInput;
	subscriptionInvoicesRefund: IssueSubscriptionInvoiceRefundInput;
	usageRecordsList: ListUsageRecordsInput;
	usageRecordsGet: GetUsageRecordInput;
	usageRecordsCreate: CreateUsageRecordInput;
	customersList: ListCustomersInput;
	customersGet: GetCustomerInput;
	customersCreate: CreateCustomerInput;
	customersUpdate: UpdateCustomerInput;
	discountsList: ListDiscountsInput;
	discountsGet: GetDiscountInput;
	discountsCreate: CreateDiscountInput;
	discountsDelete: DeleteDiscountInput;
	discountRedemptionsList: ListDiscountRedemptionsInput;
	discountRedemptionsGet: GetDiscountRedemptionInput;
	licenseKeysList: ListLicenseKeysInput;
	licenseKeysGet: GetLicenseKeyInput;
	licenseKeysUpdate: UpdateLicenseKeyInput;
	licenseKeyInstancesList: ListLicenseKeyInstancesInput;
	licenseKeyInstancesGet: GetLicenseKeyInstanceInput;
	checkoutsList: ListCheckoutsInput;
	checkoutsGet: GetCheckoutInput;
	checkoutsCreate: CreateCheckoutInput;
	webhooksList: ListWebhooksInput;
	webhooksGet: GetWebhookInput;
	webhooksCreate: CreateWebhookInput;
	webhooksUpdate: UpdateWebhookInput;
	webhooksDelete: DeleteWebhookInput;
	affiliatesList: ListAffiliatesInput;
	affiliatesGet: GetAffiliateInput;
};

export type LemonSqueezyEndpointOutputs = {
	usersGet: GetUserResponse;
	storesList: ListStoresResponse;
	storesGet: GetStoreResponse;
	productsList: ListProductsResponse;
	productsGet: GetProductResponse;
	variantsList: ListVariantsResponse;
	variantsGet: GetVariantResponse;
	pricesList: ListPricesResponse;
	pricesGet: GetPriceResponse;
	filesList: ListFilesResponse;
	filesGet: GetFileResponse;
	ordersList: ListOrdersResponse;
	ordersGet: GetOrderResponse;
	ordersGenerateInvoice: GenerateOrderInvoiceResponse;
	ordersRefund: IssueOrderRefundResponse;
	orderItemsList: ListOrderItemsResponse;
	orderItemsGet: GetOrderItemResponse;
	subscriptionsList: ListSubscriptionsResponse;
	subscriptionsGet: GetSubscriptionResponse;
	subscriptionsUpdate: UpdateSubscriptionResponse;
	subscriptionsCancel: CancelSubscriptionResponse;
	subscriptionItemsList: ListSubscriptionItemsResponse;
	subscriptionItemsGet: GetSubscriptionItemResponse;
	subscriptionItemsUsage: GetSubscriptionItemUsageResponse;
	subscriptionItemsUpdate: UpdateSubscriptionItemResponse;
	subscriptionInvoicesList: ListSubscriptionInvoicesResponse;
	subscriptionInvoicesGet: GetSubscriptionInvoiceResponse;
	subscriptionInvoicesGenerate: GenerateSubscriptionInvoiceResponse;
	subscriptionInvoicesRefund: IssueSubscriptionInvoiceRefundResponse;
	usageRecordsList: ListUsageRecordsResponse;
	usageRecordsGet: GetUsageRecordResponse;
	usageRecordsCreate: CreateUsageRecordResponse;
	customersList: ListCustomersResponse;
	customersGet: GetCustomerResponse;
	customersCreate: CreateCustomerResponse;
	customersUpdate: UpdateCustomerResponse;
	discountsList: ListDiscountsResponse;
	discountsGet: GetDiscountResponse;
	discountsCreate: CreateDiscountResponse;
	discountsDelete: DeleteDiscountResponse;
	discountRedemptionsList: ListDiscountRedemptionsResponse;
	discountRedemptionsGet: GetDiscountRedemptionResponse;
	licenseKeysList: ListLicenseKeysResponse;
	licenseKeysGet: GetLicenseKeyResponse;
	licenseKeysUpdate: UpdateLicenseKeyResponse;
	licenseKeyInstancesList: ListLicenseKeyInstancesResponse;
	licenseKeyInstancesGet: GetLicenseKeyInstanceResponse;
	checkoutsList: ListCheckoutsResponse;
	checkoutsGet: GetCheckoutResponse;
	checkoutsCreate: CreateCheckoutResponse;
	webhooksList: ListWebhooksResponse;
	webhooksGet: GetWebhookResponse;
	webhooksCreate: CreateWebhookResponse;
	webhooksUpdate: UpdateWebhookResponse;
	webhooksDelete: DeleteWebhookResponse;
	affiliatesList: ListAffiliatesResponse;
	affiliatesGet: GetAffiliateResponse;
};

export const LemonSqueezyEndpointInputSchemas = {
	usersGet: GetUserInputSchema,
	storesList: ListStoresInputSchema,
	storesGet: GetStoreInputSchema,
	productsList: ListProductsInputSchema,
	productsGet: GetProductInputSchema,
	variantsList: ListVariantsInputSchema,
	variantsGet: GetVariantInputSchema,
	pricesList: ListPricesInputSchema,
	pricesGet: GetPriceInputSchema,
	filesList: ListFilesInputSchema,
	filesGet: GetFileInputSchema,
	ordersList: ListOrdersInputSchema,
	ordersGet: GetOrderInputSchema,
	ordersGenerateInvoice: GenerateOrderInvoiceInputSchema,
	ordersRefund: IssueOrderRefundInputSchema,
	orderItemsList: ListOrderItemsInputSchema,
	orderItemsGet: GetOrderItemInputSchema,
	subscriptionsList: ListSubscriptionsInputSchema,
	subscriptionsGet: GetSubscriptionInputSchema,
	subscriptionsUpdate: UpdateSubscriptionInputSchema,
	subscriptionsCancel: CancelSubscriptionInputSchema,
	subscriptionItemsList: ListSubscriptionItemsInputSchema,
	subscriptionItemsGet: GetSubscriptionItemInputSchema,
	subscriptionItemsUsage: GetSubscriptionItemUsageInputSchema,
	subscriptionItemsUpdate: UpdateSubscriptionItemInputSchema,
	subscriptionInvoicesList: ListSubscriptionInvoicesInputSchema,
	subscriptionInvoicesGet: GetSubscriptionInvoiceInputSchema,
	subscriptionInvoicesGenerate: GenerateSubscriptionInvoiceInputSchema,
	subscriptionInvoicesRefund: IssueSubscriptionInvoiceRefundInputSchema,
	usageRecordsList: ListUsageRecordsInputSchema,
	usageRecordsGet: GetUsageRecordInputSchema,
	usageRecordsCreate: CreateUsageRecordInputSchema,
	customersList: ListCustomersInputSchema,
	customersGet: GetCustomerInputSchema,
	customersCreate: CreateCustomerInputSchema,
	customersUpdate: UpdateCustomerInputSchema,
	discountsList: ListDiscountsInputSchema,
	discountsGet: GetDiscountInputSchema,
	discountsCreate: CreateDiscountInputSchema,
	discountsDelete: DeleteDiscountInputSchema,
	discountRedemptionsList: ListDiscountRedemptionsInputSchema,
	discountRedemptionsGet: GetDiscountRedemptionInputSchema,
	licenseKeysList: ListLicenseKeysInputSchema,
	licenseKeysGet: GetLicenseKeyInputSchema,
	licenseKeysUpdate: UpdateLicenseKeyInputSchema,
	licenseKeyInstancesList: ListLicenseKeyInstancesInputSchema,
	licenseKeyInstancesGet: GetLicenseKeyInstanceInputSchema,
	checkoutsList: ListCheckoutsInputSchema,
	checkoutsGet: GetCheckoutInputSchema,
	checkoutsCreate: CreateCheckoutInputSchema,
	webhooksList: ListWebhooksInputSchema,
	webhooksGet: GetWebhookInputSchema,
	webhooksCreate: CreateWebhookInputSchema,
	webhooksUpdate: UpdateWebhookInputSchema,
	webhooksDelete: DeleteWebhookInputSchema,
	affiliatesList: ListAffiliatesInputSchema,
	affiliatesGet: GetAffiliateInputSchema,
} as const;

export const LemonSqueezyEndpointOutputSchemas = {
	usersGet: GetUserResponseSchema,
	storesList: ListStoresResponseSchema,
	storesGet: GetStoreResponseSchema,
	productsList: ListProductsResponseSchema,
	productsGet: GetProductResponseSchema,
	variantsList: ListVariantsResponseSchema,
	variantsGet: GetVariantResponseSchema,
	pricesList: ListPricesResponseSchema,
	pricesGet: GetPriceResponseSchema,
	filesList: ListFilesResponseSchema,
	filesGet: GetFileResponseSchema,
	ordersList: ListOrdersResponseSchema,
	ordersGet: GetOrderResponseSchema,
	ordersGenerateInvoice: GenerateOrderInvoiceResponseSchema,
	ordersRefund: IssueOrderRefundResponseSchema,
	orderItemsList: ListOrderItemsResponseSchema,
	orderItemsGet: GetOrderItemResponseSchema,
	subscriptionsList: ListSubscriptionsResponseSchema,
	subscriptionsGet: GetSubscriptionResponseSchema,
	subscriptionsUpdate: UpdateSubscriptionResponseSchema,
	subscriptionsCancel: CancelSubscriptionResponseSchema,
	subscriptionItemsList: ListSubscriptionItemsResponseSchema,
	subscriptionItemsGet: GetSubscriptionItemResponseSchema,
	subscriptionItemsUsage: GetSubscriptionItemUsageResponseSchema,
	subscriptionItemsUpdate: UpdateSubscriptionItemResponseSchema,
	subscriptionInvoicesList: ListSubscriptionInvoicesResponseSchema,
	subscriptionInvoicesGet: GetSubscriptionInvoiceResponseSchema,
	subscriptionInvoicesGenerate: GenerateSubscriptionInvoiceResponseSchema,
	subscriptionInvoicesRefund: IssueSubscriptionInvoiceRefundResponseSchema,
	usageRecordsList: ListUsageRecordsResponseSchema,
	usageRecordsGet: GetUsageRecordResponseSchema,
	usageRecordsCreate: CreateUsageRecordResponseSchema,
	customersList: ListCustomersResponseSchema,
	customersGet: GetCustomerResponseSchema,
	customersCreate: CreateCustomerResponseSchema,
	customersUpdate: UpdateCustomerResponseSchema,
	discountsList: ListDiscountsResponseSchema,
	discountsGet: GetDiscountResponseSchema,
	discountsCreate: CreateDiscountResponseSchema,
	discountsDelete: DeleteDiscountResponseSchema,
	discountRedemptionsList: ListDiscountRedemptionsResponseSchema,
	discountRedemptionsGet: GetDiscountRedemptionResponseSchema,
	licenseKeysList: ListLicenseKeysResponseSchema,
	licenseKeysGet: GetLicenseKeyResponseSchema,
	licenseKeysUpdate: UpdateLicenseKeyResponseSchema,
	licenseKeyInstancesList: ListLicenseKeyInstancesResponseSchema,
	licenseKeyInstancesGet: GetLicenseKeyInstanceResponseSchema,
	checkoutsList: ListCheckoutsResponseSchema,
	checkoutsGet: GetCheckoutResponseSchema,
	checkoutsCreate: CreateCheckoutResponseSchema,
	webhooksList: ListWebhooksResponseSchema,
	webhooksGet: GetWebhookResponseSchema,
	webhooksCreate: CreateWebhookResponseSchema,
	webhooksUpdate: UpdateWebhookResponseSchema,
	webhooksDelete: DeleteWebhookResponseSchema,
	affiliatesList: ListAffiliatesResponseSchema,
	affiliatesGet: GetAffiliateResponseSchema,
} as const;

/** Turns the shared list parameters into JSON:API query keys. */
export { listQuery };
