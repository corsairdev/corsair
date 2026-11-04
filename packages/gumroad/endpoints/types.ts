import { z } from 'zod';

// Shapes follow https://gumroad.com/api (single-page reference). Every
// documented field marked "omitted when ..." is optional here, and every
// object is loose because Gumroad adds and drops fields on these payloads
// frequently.

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();

// Gumroad ids are opaque base64-style strings ("A-m3CDDC5dlrSdKZp0RFhA=="),
// not UUIDs, so only non-emptiness is pinned.
const ProductId = z.string().min(1).describe('Product id from products.list');
const SaleId = z.string().min(1).describe('Sale id from sales.list');
// License keys look like "A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD" in the docs
// but the format is not documented as a constraint, so only non-emptiness is
// pinned.
const LicenseKey = z.string().min(1).describe('License key provided by the customer');
const Date10 = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date as YYYY-MM-DD');
// Gumroad documents these params as the literal strings "true"/"false".
const StringFlag = z.enum(['true', 'false']);
const PageKey = z
	.string()
	.min(1)
	.describe('Cursor from next_page_key of the previous response');

// ── Objects ──────────────────────────────────────────────────────────────────

export const GumroadProductSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: str,
		published: bool,
		deleted: bool,
		price: num,
		currency: str,
		short_url: str,
		thumbnail_url: str,
		preview_url: str,
		custom_permalink: str,
		custom_summary: str,
		custom_receipt: str,
		custom_html: str,
		require_shipping: bool,
		customizable_price: bool,
		max_purchase_count: num,
		subscription_duration: str,
		tags: z.array(z.string()).nullish(),
		formatted_price: str,
		sales_count: num,
		sales_usd_cents: num,
		is_tiered_membership: bool,
		recurrences: z.array(z.string()).nullish(),
		purchasing_power_parity_prices: z
			.record(z.string(), z.number())
			.nullish(),
	})
	.loose();

export const GumroadSaleSchema = z
	.object({
		id: z.string(),
		email: z.string(),
		seller_id: z.string(),
		product_id: z.string(),
		product_name: z.string(),
		product_permalink: str,
		product_has_variants: bool,
		created_at: str,
		price: num,
		gumroad_fee: num,
		tax_cents: num,
		shipping_cents: num,
		tip_cents: num,
		variants_price_cents: num,
		currency: str,
		order_id: str,
		license_key: str,
		access_revoked: bool,
		partially_refunded: bool,
		refunded: bool,
		chargedback: bool,
		disputed: bool,
		sent_abandoned_cart_email: bool,
		subscription_duration: str,
		formatted_display_price: str,
		formatted_total_price: str,
	})
	.loose();

export const GumroadSubscriberSchema = z
	.object({
		id: z.string(),
		email: str,
		product_id: z.string(),
		product_name: z.string(),
		user_id: str,
		user_email: str,
		purchase_ids: z.array(z.string()).nullish(),
		created_at: str,
		user_requested_cancellation_at: str,
		charge_occurrence_count: num,
		// Left a plain string: the docs enumerate statuses but can add new
		// ones, and an enum pin would break output parses on the day they do.
		recurrence: str,
		cancelled_at: str,
		ended_at: str,
		failed_at: str,
		free_trial_ends_at: str,
		license_key: z.string(),
		status: str,
	})
	.loose();

export const GumroadPurchaseSchema = z
	.object({
		id: z.string(),
		seller_id: z.string(),
		product_id: z.string(),
		product_name: z.string(),
		permalink: str,
		product_permalink: str,
		email: z.string(),
		price: num,
		gumroad_fee: num,
		currency: str,
		quantity: num,
		discover_fee_charged: bool,
		can_contact: bool,
		referrer: str,
		card: z.object({ visual: str, type: str }).loose().nullish(),
		order_number: num,
		sale_id: z.string(),
		sale_timestamp: str,
		purchaser_id: str,
		subscription_id: str,
		variants: str,
		license_key: z.string(),
		is_multiseat_license: bool,
		ip_country: str,
		recurrence: str,
		is_gift_receiver_purchase: bool,
		refunded: bool,
		disputed: bool,
		dispute_won: bool,
		created_at: str,
		custom_fields: z.array(z.object({}).loose()).nullish(),
		chargebacked: bool,
		subscription_ended_at: str,
		subscription_cancelled_at: str,
		subscription_failed_at: str,
	})
	.loose();

// ── Inputs and outputs ───────────────────────────────────────────────────────

// No documented parameters; not strict because there is no wire body to
// protect and callers attach harmless extras.
const ProductsListInputSchema = z.object({});

const ProductsGetInputSchema = z.object({
	id: ProductId,
});

const SalesListInputSchema = z
	.object({
		after: Date10.optional().describe('Only sales after this date'),
		before: Date10.optional().describe('Only sales before this date'),
		product_id: ProductId.optional().describe('Filter sales by product'),
		email: z.string().min(1).optional().describe('Filter sales by buyer email'),
		order_id: z.string().min(1).optional().describe('Filter sales by order id'),
		name: z
			.string()
			.min(1)
			.optional()
			.describe('Filter sales by customer name'),
		license_key: LicenseKey.optional().describe('Filter sales by license key'),
		page_key: PageKey.optional(),
	})
	.strict();

const SalesGetInputSchema = z.object({
	id: SaleId,
});

const SubscribersListInputSchema = z
	.object({
		product_id: ProductId,
		email: z.string().min(1).optional().describe('Filter by subscriber email'),
		paginated: StringFlag
			.optional()
			.describe(
				'"true" to page 100 at a time and get next_page_key (default "false")',
			),
		page_key: PageKey.optional(),
	})
	.strict();

const LicensesVerifyInputSchema = z
	.object({
		product_id: ProductId,
		license_key: LicenseKey,
		increment_uses_count: StringFlag
			.default('true')
			.describe('"false" to leave the license use counter unchanged'),
	})
	.strict();

const ProductsListOutputSchema = z
	.object({
		success: z.boolean(),
		products: z.array(GumroadProductSchema),
	})
	.loose();

const ProductsGetOutputSchema = z
	.object({
		success: z.boolean(),
		product: GumroadProductSchema,
	})
	.loose();

const SalesListOutputSchema = z
	.object({
		success: z.boolean(),
		sales: z.array(GumroadSaleSchema),
		next_page_url: str,
		next_page_key: str,
	})
	.loose();

const SalesGetOutputSchema = z
	.object({
		success: z.boolean(),
		sale: GumroadSaleSchema,
	})
	.loose();

const SubscribersListOutputSchema = z
	.object({
		success: z.boolean(),
		subscribers: z.array(GumroadSubscriberSchema),
		next_page_url: str,
		next_page_key: str,
	})
	.loose();

const LicensesVerifyOutputSchema = z
	.object({
		success: z.boolean(),
		uses: z.number(),
		purchase: GumroadPurchaseSchema,
	})
	.loose();

// ── Registry ─────────────────────────────────────────────────────────────────

export const GumroadEndpointInputSchemas = {
	productsList: ProductsListInputSchema,
	productsGet: ProductsGetInputSchema,
	salesList: SalesListInputSchema,
	salesGet: SalesGetInputSchema,
	subscribersList: SubscribersListInputSchema,
	licensesVerify: LicensesVerifyInputSchema,
} as const;

export const GumroadEndpointOutputSchemas = {
	productsList: ProductsListOutputSchema,
	productsGet: ProductsGetOutputSchema,
	salesList: SalesListOutputSchema,
	salesGet: SalesGetOutputSchema,
	subscribersList: SubscribersListOutputSchema,
	licensesVerify: LicensesVerifyOutputSchema,
} as const;

type Inputs = typeof GumroadEndpointInputSchemas;
type Outputs = typeof GumroadEndpointOutputSchemas;

export type GumroadEndpointInputs = {
	[K in keyof Inputs]: z.input<Inputs[K]>;
};

export type GumroadEndpointOutputs = {
	[K in keyof Outputs]: z.infer<Outputs[K]>;
};

export type GumroadOperation = keyof Inputs;

export type ProductsListInput = GumroadEndpointInputs['productsList'];
export type ProductsListResponse = GumroadEndpointOutputs['productsList'];
export type ProductsGetInput = GumroadEndpointInputs['productsGet'];
export type ProductsGetResponse = GumroadEndpointOutputs['productsGet'];
export type SalesListInput = GumroadEndpointInputs['salesList'];
export type SalesListResponse = GumroadEndpointOutputs['salesList'];
export type SalesGetInput = GumroadEndpointInputs['salesGet'];
export type SalesGetResponse = GumroadEndpointOutputs['salesGet'];
export type SubscribersListInput = GumroadEndpointInputs['subscribersList'];
export type SubscribersListResponse = GumroadEndpointOutputs['subscribersList'];
export type LicensesVerifyInput = GumroadEndpointInputs['licensesVerify'];
export type LicensesVerifyResponse = GumroadEndpointOutputs['licensesVerify'];

export type GumroadProduct = z.infer<typeof GumroadProductSchema>;
export type GumroadSale = z.infer<typeof GumroadSaleSchema>;
export type GumroadSubscriber = z.infer<typeof GumroadSubscriberSchema>;
export type GumroadPurchase = z.infer<typeof GumroadPurchaseSchema>;
