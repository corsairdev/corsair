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
// "." and ".." are valid non-empty strings but resolve to other path
// segments when embedded in a URL, so path-carrier ids reject them.
const ProductId = z
	.string()
	.min(1)
	.refine((value) => value !== '.' && value !== '..')
	.describe('Product id from products.list');
const SaleId = z
	.string()
	.min(1)
	.refine((value) => value !== '.' && value !== '..')
	.describe('Sale id from sales.list');
// License keys look like "A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD" in the docs
// but the format is not documented as a constraint, so only non-emptiness is
// pinned.
const LicenseKey = z
	.string()
	.min(1)
	.describe('License key provided by the customer');
const Date10 = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date as YYYY-MM-DD');
// Gumroad documents these params as the literal strings "true"/"false".
const StringFlag = z.enum(['true', 'false']);
const PageKey = z
	.string()
	.min(1)
	.describe('Cursor from next_page_key of the previous response');
// Offer code schedules are "RFC 3339 timestamp with a time zone, such as
// 2026-11-27T00:00:00-05:00"; an empty string clears the value in a form.
const Rfc3339OrClear = z.union([
	z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/,
			'Expected an RFC 3339 timestamp with a time zone',
		),
	z.literal(''),
]);
const Subdomain = z
	.string()
	.regex(/^[A-Za-z0-9-]+$/, 'Expected a Gumroad profile subdomain');
const Year4 = z.string().regex(/^\d{4}$/, 'Expected a 4-digit tax year');
// The docs describe tracking/cover/post URLs as full http(s) URLs.
const HttpUrl = z
	.string()
	.url()
	.refine((value) => /^https?:\/\//.test(value), {
		message: 'Expected a full http:// or https:// URL',
	});
const ResourceName = z.enum([
	'sale',
	'refund',
	'dispute',
	'dispute_won',
	'cancellation',
	'subscription_updated',
	'subscription_ended',
	'subscription_restarted',
]);

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
		purchasing_power_parity_prices: z.record(z.string(), z.number()).nullish(),
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

export const GumroadOfferCodeSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		amount_cents: num,
		percent_off: num,
		max_purchase_count: num,
		minimum_amount_cents: num,
		universal: bool,
		currency_type: str,
		auto_apply: bool,
		sale_label: str,
		valid_at: str,
		expires_at: str,
		times_used: num,
	})
	.loose();

export const GumroadVariantCategorySchema = z
	.object({
		id: z.string(),
		title: z.string(),
	})
	.loose();

export const GumroadVariantSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		price_difference_cents: num,
		max_purchase_count: num,
	})
	.loose();

export const GumroadCustomFieldSchema = z
	.object({
		name: z.string(),
		// The docs' field table says boolean but their own example response
		// returns "false" as a string; both shapes parse.
		required: z.union([z.string(), z.boolean()]).nullish(),
	})
	.loose();

export const GumroadEmailSchema = z
	.object({
		id: z.string(),
		subject: str,
		message: str,
		audience_type: str,
		product_id: str,
		state: str,
		published_at: str,
		scheduled_at: str,
		send_emails: bool,
		shown_on_profile: bool,
		audience_count: num,
		recipients_count: num,
		url: str,
		created_at: str,
		updated_at: str,
	})
	.loose();

export const GumroadWorkflowEmailSchema = GumroadEmailSchema.extend({
	delay: z.object({ amount: num, unit: str }).loose().nullish(),
	sent_count: num,
	open_count: num,
	open_rate: num,
	click_count: num,
	click_rate: num,
});

export const GumroadWorkflowSchema = z
	.object({
		id: z.string(),
		name: str,
		audience_type: str,
		trigger: str,
		product_id: str,
		variant_id: str,
		state: str,
		published_at: str,
		first_published_at: str,
		send_to_past_customers: bool,
		emails_count: num,
		filters: z.record(z.string(), z.string()).nullish(),
		created_at: str,
		updated_at: str,
		emails: z.array(GumroadWorkflowEmailSchema).nullish(),
	})
	.loose();

export const GumroadMediaFileSchema = z
	.object({
		id: z.string(),
		name: str,
		extension: str,
		file_size: num,
		url: str,
		status: z.object({ type: str }).loose().nullish(),
		file_group: str,
		created_at: str,
	})
	.loose();

export const GumroadResourceSubscriptionSchema = z
	.object({
		id: z.string(),
		resource_name: z.string(),
		post_url: z.string(),
	})
	.loose();

export const GumroadPayoutSchema = z
	.object({
		// Upcoming payouts have no id yet.
		id: str,
		amount: str,
		currency: str,
		status: str,
		created_at: str,
		processed_at: str,
		payment_processor: str,
		bank_account_visual: str,
		paypal_email: str,
		sales: z.array(z.string()).nullish(),
		refunded_sales: z.array(z.string()).nullish(),
		disputed_sales: z.array(z.string()).nullish(),
		transactions: z.array(z.object({}).loose()).nullish(),
	})
	.loose();

export const GumroadTaxFormSchema = z
	.object({
		tax_year: num,
		tax_form_type: str,
		filed_at: str,
	})
	.loose();

export const GumroadCategorySchema = z
	.object({
		id: num,
		name: str,
		label: str,
		path: str,
		parent_id: num,
	})
	.loose();

export const GumroadReviewSchema = z
	.object({
		id: z.string(),
		rating: num,
		message: str,
		created_at: str,
		purchase_id: str,
		rater_name: str,
		response: z.object({ message: str, created_at: str }).loose().nullish(),
	})
	.loose();

export const GumroadUserSchema = z
	.object({
		bio: str,
		name: str,
		twitter_handle: str,
		user_id: str,
		email: str,
		url: str,
		profile_picture_url: str,
	})
	.loose();

export const GumroadRefundPolicySchema = z
	.object({
		refund_period: str,
		title: str,
		fine_print: str,
		in_effect: bool,
	})
	.loose();

export const GumroadCoverSchema = z
	.object({
		id: z.string(),
		url: str,
		original_url: str,
		thumbnail: str,
		type: str,
		filetype: str,
		width: num,
		height: num,
		native_width: num,
		native_height: num,
	})
	.loose();

export const GumroadSanitizationReportSchema = z
	.object({
		removed_tags: z.array(z.string()).nullish(),
		removed_attributes: z.array(z.string()).nullish(),
		total_removed: num,
		truncated: bool,
	})
	.loose();

// ── Inputs ───────────────────────────────────────────────────────────────────

// No documented parameters; not strict because there is no wire body to
// protect and callers attach harmless extras.
const ProductsListInputSchema = z.object({});

const ProductsGetInputSchema = z.object({
	id: ProductId,
});

// A ProseMirror doc is an arbitrarily nested tree whose node attributes vary
// by node type, so any JSON document is accepted for a rich content page.
const RichContentPageSchema = z
	.object({
		id: z.string().min(1),
		title: z.string(),
		description: z.json(),
	})
	.strict();

// Entries resubmit an existing file by id+url, or attach a new one by url
// (optionally tagged with a client id / external_id).
const ProductFileInputSchema = z
	.object({
		id: z.string().min(1).optional(),
		external_id: z.string().min(1).optional(),
		url: z.string().min(1),
	})
	.strict();

const ProductsCreateInputSchema = z
	.object({
		draft: StringFlag.optional().describe(
			'"true" saves as an unpublished draft instead of publishing',
		),
		published: StringFlag.optional().describe(
			'"false" saves as an unpublished draft, same as draft="true"',
		),
		native_type: z
			.enum([
				'digital',
				'course',
				'ebook',
				'membership',
				'bundle',
				'coffee',
				'call',
				'commission',
			])
			.optional()
			.describe('Product type; cannot be changed later'),
		name: z.string().min(1),
		description: z.string().optional().describe('HTML'),
		custom_permalink: z.string().min(1).optional(),
		price: z
			.number()
			.int()
			.nonnegative()
			.describe('Price in the smallest currency unit (e.g. cents)'),
		price_currency_type: z
			.string()
			.regex(/^[A-Z]{3}$/, 'Expected a 3-letter ISO currency code')
			.optional()
			.describe("Defaults to the account's currency"),
		subscription_duration: z
			.enum(['monthly', 'quarterly', 'biannually', 'yearly', 'every_two_years'])
			.optional()
			.describe('Membership products only'),
		customizable_price: StringFlag.optional().describe(
			'"true" for pay-what-you-want',
		),
		suggested_price_cents: z.number().int().nonnegative().optional(),
		max_purchase_count: z.number().int().positive().optional(),
		category: z
			.string()
			.min(1)
			.optional()
			.describe('Full category path from categories.list'),
		taxonomy_id: z.number().int().positive().optional(),
		tags: z.array(z.string().min(1)).optional(),
		custom_summary: z.string().optional(),
		refund_period: z
			.enum(['inherit', 'none', '7', '14', '30', '183'])
			.optional()
			.describe('Product-level refund policy'),
		refund_fine_print: z.string().optional(),
		rich_content: z.array(RichContentPageSchema).optional(),
		files: z.array(ProductFileInputSchema).optional(),
	})
	.strict()
	.refine(
		(data) => !(data.category !== undefined && data.taxonomy_id !== undefined),
		{
			message: 'category and taxonomy_id cannot be sent together',
			path: ['taxonomy_id'],
		},
	)
	.refine(
		(data) =>
			!(
				data.refund_period === 'inherit' && data.refund_fine_print !== undefined
			),
		{
			message:
				'refund_fine_print cannot be combined with refund_period "inherit"',
			path: ['refund_fine_print'],
		},
	);

const ProductsUpdateInputSchema = z
	.object({
		id: ProductId,
		name: z.string().min(1).optional(),
		description: z.string().optional().describe('HTML'),
		custom_permalink: z.string().min(1).optional(),
		price: z.number().int().nonnegative().optional(),
		price_currency_type: z
			.string()
			.regex(/^[A-Z]{3}$/, 'Expected a 3-letter ISO currency code')
			.optional(),
		customizable_price: StringFlag.optional(),
		suggested_price_cents: z.number().int().nonnegative().optional(),
		max_purchase_count: z.number().int().positive().optional(),
		quantity_enabled: StringFlag.optional(),
		is_adult: StringFlag.optional(),
		display_product_reviews: StringFlag.optional(),
		should_show_sales_count: StringFlag.optional(),
		category: z.string().min(1).optional(),
		taxonomy_id: z.number().int().positive().optional(),
		tags: z.array(z.string().min(1)).optional().describe('Full replacement'),
		custom_receipt: z.string().optional(),
		custom_summary: z.string().optional(),
		refund_period: z
			.enum(['inherit', 'none', '7', '14', '30', '183'])
			.optional(),
		refund_fine_print: z.string().optional(),
		custom_html: z
			.string()
			.optional()
			.describe('Custom landing page HTML; an empty string clears it'),
		cover_ids: z.array(z.string().min(1)).optional().describe('Display order'),
		rich_content: z
			.array(RichContentPageSchema)
			.optional()
			.describe('Full replacement'),
		has_same_rich_content_for_all_variants: StringFlag.optional(),
		files: z
			.array(ProductFileInputSchema)
			.optional()
			.describe('Full replacement; omitted files are deleted'),
	})
	.strict()
	.refine(
		(data) => !(data.category !== undefined && data.taxonomy_id !== undefined),
		{
			message: 'category and taxonomy_id cannot be sent together',
			path: ['taxonomy_id'],
		},
	)
	.refine(
		(data) =>
			!(
				data.refund_period === 'inherit' && data.refund_fine_print !== undefined
			),
		{
			message:
				'refund_fine_print cannot be combined with refund_period "inherit"',
			path: ['refund_fine_print'],
		},
	);

const ProductsDeleteInputSchema = z.object({
	id: ProductId,
});

const ProductsEnableInputSchema = z.object({
	id: ProductId,
});

const ProductsDisableInputSchema = z.object({
	id: ProductId,
});

const ProductsReviewsListInputSchema = z
	.object({
		product_id: ProductId,
		page_key: PageKey.optional(),
	})
	.strict();

const ProductsCategoriesListInputSchema = z.object({});

const ProductsCoversAddInputSchema = z
	.object({
		product_id: ProductId,
		url: HttpUrl.describe(
			'A publicly accessible image/video URL, or a YouTube/Vimeo URL',
		),
	})
	.strict();

const ProductsCoversDeleteInputSchema = z.object({
	product_id: ProductId,
	id: z.string().min(1).describe('Cover id from the covers response'),
});

const ProductsThumbnailSetInputSchema = z
	.object({
		product_id: ProductId,
		url: HttpUrl.optional(),
		signed_blob_id: z.string().min(1).optional(),
	})
	.strict()
	.refine(
		(data) => (data.url !== undefined) !== (data.signed_blob_id !== undefined),
		{
			message: 'Send exactly one of url or signed_blob_id',
			path: ['url'],
		},
	);

const ProductsThumbnailDeleteInputSchema = z.object({
	product_id: ProductId,
});

const OfferCodesListInputSchema = z
	.object({
		auto_apply: StringFlag.optional().describe(
			'Filter by automatic application',
		),
		page_key: PageKey.optional(),
	})
	.strict();

const OfferCodesGetInputSchema = z.object({
	id: z.string().min(1).describe('Store-wide offer code id'),
});

const OfferCodeWritableFields = {
	max_purchase_count: z.number().int().positive().optional(),
	minimum_amount_cents: z.number().int().nonnegative().optional(),
	auto_apply: StringFlag.optional(),
	sale_label: z.string().max(32).optional(),
	valid_at: Rfc3339OrClear.optional(),
	expires_at: Rfc3339OrClear.optional(),
};

const OfferCodesUpdateInputSchema = z
	.object({
		id: z.string().min(1).describe('Store-wide offer code id'),
		...OfferCodeWritableFields,
	})
	.strict();

const OfferCodesListForProductInputSchema = z.object({
	product_id: ProductId,
});

const OfferCodesGetForProductInputSchema = z.object({
	product_id: ProductId,
	id: z.string().min(1).describe('Offer code id'),
});

const OfferCodesCreateForProductInputSchema = z
	.object({
		product_id: ProductId,
		name: z.string().min(1).describe('The coupon code used at checkout'),
		amount_off: z
			.number()
			.int()
			.positive()
			.describe('Amount in cents or percent'),
		offer_type: z.enum(['cents', 'percent']).default('cents'),
		max_purchase_count: z.number().int().positive().optional(),
		minimum_amount_cents: z.number().int().nonnegative().optional(),
		universal: StringFlag.default('false').describe(
			'"true" applies the code to all products',
		),
		auto_apply: StringFlag.optional(),
		sale_label: z.string().max(32).optional(),
		valid_at: Rfc3339OrClear.optional(),
		expires_at: Rfc3339OrClear.optional(),
	})
	.strict()
	.refine(
		(data) => !(data.expires_at !== undefined && data.valid_at === undefined),
		{
			message: 'An end requires a start (valid_at)',
			path: ['expires_at'],
		},
	);

const OfferCodesUpdateForProductInputSchema = z
	.object({
		product_id: ProductId,
		id: z.string().min(1).describe('Offer code id'),
		...OfferCodeWritableFields,
	})
	.strict();

const OfferCodesDeleteForProductInputSchema = z.object({
	product_id: ProductId,
	id: z.string().min(1).describe('Offer code id'),
});

const VariantCategoriesListInputSchema = z.object({
	product_id: ProductId,
});

const VariantCategoriesCreateInputSchema = z.object({
	product_id: ProductId,
	title: z.string().min(1),
});

const VariantCategoriesGetInputSchema = z.object({
	product_id: ProductId,
	id: z.string().min(1).describe('Variant category id'),
});

const VariantCategoriesUpdateInputSchema = z.object({
	product_id: ProductId,
	id: z.string().min(1).describe('Variant category id'),
	title: z.string().min(1),
});

const VariantCategoriesDeleteInputSchema = z.object({
	product_id: ProductId,
	id: z.string().min(1).describe('Variant category id'),
});

const VariantCategoryId = z.string().min(1).describe('Variant category id');

const VariantsListInputSchema = z.object({
	product_id: ProductId,
	variant_category_id: VariantCategoryId,
});

const VariantsCreateInputSchema = z.object({
	product_id: ProductId,
	variant_category_id: VariantCategoryId,
	name: z.string().min(1),
	price_difference_cents: z.number().int(),
	max_purchase_count: z.number().int().positive().optional(),
});

const VariantsGetInputSchema = z.object({
	product_id: ProductId,
	variant_category_id: VariantCategoryId,
	id: z.string().min(1).describe('Variant id'),
});

const VariantsUpdateInputSchema = z
	.object({
		product_id: ProductId,
		variant_category_id: VariantCategoryId,
		id: z.string().min(1).describe('Variant id'),
		name: z.string().min(1).optional(),
		price_difference_cents: z.number().int().optional(),
		max_purchase_count: z.number().int().positive().optional(),
	})
	.strict();

const VariantsDeleteInputSchema = z.object({
	product_id: ProductId,
	variant_category_id: VariantCategoryId,
	id: z.string().min(1).describe('Variant id'),
});

const CustomFieldsListInputSchema = z.object({
	product_id: ProductId,
});

const CustomFieldsCreateInputSchema = z.object({
	product_id: ProductId,
	name: z.string().min(1),
	required: StringFlag.optional(),
});

const CustomFieldsUpdateInputSchema = z.object({
	product_id: ProductId,
	name: z.string().min(1).describe('Name of the existing custom field'),
	required: StringFlag.optional(),
});

const CustomFieldsDeleteInputSchema = z.object({
	product_id: ProductId,
	name: z
		.string()
		.min(1)
		.refine((value) => value !== '.' && value !== '..')
		.describe('Name of the custom field'),
});

const UserGetInputSchema = z.object({});

const UserCustomHtmlGetInputSchema = z.object({});

const UserCustomHtmlUpdateInputSchema = z.object({
	custom_html: z
		.string()
		.nullable()
		.describe('The profile landing page HTML; null clears it'),
});

const UserCustomHtmlPreviewInputSchema = z.object({
	custom_html: z.string().min(1).describe('The HTML to sanitize'),
});

const UserRefundPolicyGetInputSchema = z.object({});

const UserRefundPolicyUpdateInputSchema = z
	.object({
		refund_period: z.enum(['none', '7', '14', '30', '183']),
		fine_print: z
			.string()
			.max(3000)
			.optional()
			.describe('Send an empty value to clear it'),
	})
	.strict();

const PublicProductInputSchema = z.object({
	seller: Subdomain.describe("The seller's profile subdomain"),
	permalink: z.string().min(1).describe('The product permalink'),
});

const PublicProfileInputSchema = z.object({
	username: Subdomain,
});

const MediaListInputSchema = z.object({});

const MediaCreateInputSchema = z
	.object({
		url: HttpUrl.optional().describe('A publicly reachable image URL'),
		signed_blob_id: z.string().min(1).optional(),
		name: z.string().min(1).optional(),
	})
	.strict()
	.refine(
		(data) => (data.url !== undefined) !== (data.signed_blob_id !== undefined),
		{
			message: 'Send exactly one of url or signed_blob_id',
			path: ['url'],
		},
	);

const MediaDeleteInputSchema = z.object({
	id: z.string().min(1).describe('Media file id'),
});

// 20 GB in bytes, the documented presign ceiling.
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 * 1024;

const FilesPresignInputSchema = z.object({
	filename: z.string().min(1),
	file_size: z
		.number()
		.int()
		.positive()
		.max(MAX_FILE_SIZE_BYTES)
		.describe('File size in bytes; max 20 GB'),
});

const FilesCompleteInputSchema = z.object({
	upload_id: z.string().min(1),
	key: z.string().min(1),
	parts: z
		.array(
			z
				.object({
					part_number: z.number().int().positive(),
					etag: z.string().min(1),
				})
				.strict(),
		)
		.min(1),
});

const FilesAbortInputSchema = z.object({
	upload_id: z.string().min(1),
	key: z.string().min(1),
});

const EmailsListInputSchema = z
	.object({
		type: z.enum(['published', 'scheduled', 'draft']).optional(),
		page_key: PageKey.optional(),
	})
	.strict();

const EmailsGetInputSchema = z.object({
	id: z.string().min(1).describe('Email id'),
});

const EmailsCreateInputSchema = z
	.object({
		subject: z.string().min(1),
		body: z.string().min(1).describe('HTML email body'),
		audience: z
			.enum([
				'all',
				'audience',
				'customers',
				'seller',
				'followers',
				'follower',
				'product',
			])
			.default('audience'),
		product_id: ProductId.optional().describe(
			'Required when audience is "product"',
		),
		link_id: z.string().min(1).optional().describe('Product permalink'),
		publish: StringFlag.optional().describe('"true" to send immediately'),
		draft: StringFlag.optional().describe('"false" to send immediately'),
	})
	.strict()
	.refine(
		(data) => data.audience !== 'product' || data.product_id !== undefined,
		{
			message: 'product_id is required when audience is "product"',
			path: ['product_id'],
		},
	);

const EmailsPreviewInputSchema = z.object({
	id: z.string().min(1).describe('Email id'),
});

const EmailsSendInputSchema = z.object({
	id: z.string().min(1).describe('Email id'),
});

const EmailsScheduleInputSchema = z.object({
	id: z.string().min(1).describe('Email id'),
	to_be_published_at: z
		.string()
		.regex(
			/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/,
			'Expected a date and time as YYYY-MM-DD HH:mm',
		)
		.describe("Schedule time in the seller's timezone"),
});

const EmailsUnscheduleInputSchema = z.object({
	id: z.string().min(1).describe('Email id'),
});

const EmailsDeleteInputSchema = z.object({
	id: z.string().min(1).describe('Email id'),
});

const WorkflowsListInputSchema = z.object({});

const WorkflowsGetInputSchema = z.object({
	id: z.string().min(1).describe('Workflow id'),
});

const WorkflowsEmailsAddInputSchema = z.object({
	workflow_id: z.string().min(1),
	subject: z.string().min(1),
	body: z.string().min(1).describe('HTML email body'),
	delay_amount: z.number().int().nonnegative().max(2_147_483_647),
	delay_unit: z.enum(['hour', 'day', 'week', 'month']),
});

const WorkflowsEmailsUpdateInputSchema = z
	.object({
		workflow_id: z.string().min(1),
		email_id: z.string().min(1),
		subject: z.string().min(1).optional(),
		body: z.string().min(1).optional(),
		delay_amount: z.number().int().nonnegative().max(2_147_483_647).optional(),
		delay_unit: z.enum(['hour', 'day', 'week', 'month']).optional(),
	})
	.strict()
	.refine(
		(data) =>
			(data.delay_amount !== undefined) === (data.delay_unit !== undefined),
		{
			message: 'Supply delay_amount and delay_unit together',
			path: ['delay_unit'],
		},
	)
	.refine(
		(data) =>
			data.subject !== undefined ||
			data.body !== undefined ||
			data.delay_amount !== undefined,
		{
			message: 'Supply at least one of subject, body or the delay pair',
			path: ['subject'],
		},
	);

const ResourceSubscriptionsSubscribeInputSchema = z.object({
	resource_name: ResourceName,
	post_url: HttpUrl,
});

const ResourceSubscriptionsListInputSchema = z.object({
	resource_name: ResourceName,
});

const ResourceSubscriptionsTestEventInputSchema = z.object({
	resource_subscription_id: z.string().min(1),
});

const ResourceSubscriptionsUnsubscribeInputSchema = z.object({
	resource_subscription_id: z.string().min(1),
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

const SalesMarkAsShippedInputSchema = z
	.object({
		id: SaleId,
		tracking_url: HttpUrl.optional(),
	})
	.strict();

const SalesRefundInputSchema = z
	.object({
		id: SaleId,
		amount_cents: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Partial refund amount; omit for a full refund'),
	})
	.strict();

const SalesRevokeAccessInputSchema = z.object({
	id: SaleId,
});

const SalesUndoRevokeAccessInputSchema = z.object({
	id: SaleId,
});

const SalesResendReceiptInputSchema = z.object({
	id: SaleId,
});

const SubscribersListInputSchema = z
	.object({
		product_id: ProductId,
		email: z.string().min(1).optional().describe('Filter by subscriber email'),
		paginated: StringFlag.optional().describe(
			'"true" to page 100 at a time and get next_page_key (default "false")',
		),
		page_key: PageKey.optional(),
	})
	.strict();

const SubscribersGetInputSchema = z.object({
	id: z.string().min(1).describe('Subscriber id'),
});

const LicenseKeyInputSchema = z
	.object({
		product_id: ProductId,
		license_key: LicenseKey,
	})
	.strict();

const LicensesVerifyInputSchema = LicenseKeyInputSchema.extend({
	increment_uses_count: StringFlag.default('true').describe(
		'"false" to leave the license use counter unchanged',
	),
});

const PayoutsListInputSchema = z
	.object({
		after: Date10.optional(),
		before: Date10.optional(),
		page_key: PageKey.optional(),
		include_upcoming: StringFlag.default('true').describe(
			'"false" to exclude the upcoming payout',
		),
	})
	.strict();

const PayoutsGetInputSchema = z
	.object({
		id: z.string().min(1).describe('Payout id'),
		include_sales: StringFlag.default('true').describe(
			'"false" to exclude sales, refunded_sales and disputed_sales',
		),
		include_transactions: StringFlag.default('false').describe(
			'"true" to include the payout CSV transaction lines',
		),
	})
	.strict();

const PayoutsUpcomingInputSchema = z
	.object({
		include_sales: StringFlag.default('true'),
		include_transactions: StringFlag.default('false'),
	})
	.strict();

const TaxFormsListInputSchema = z
	.object({
		year: Year4.optional().describe('Omit to return forms for every year'),
	})
	.strict();

const TaxFormsDownloadInputSchema = z.object({
	year: Year4,
	tax_form_type: z.enum(['us_1099_k', 'us_1099_misc']),
});

const EarningsGetInputSchema = z.object({
	year: Year4,
});

// ── Outputs ──────────────────────────────────────────────────────────────────

const ProductsListOutputSchema = z
	.object({
		success: z.boolean(),
		products: z.array(GumroadProductSchema),
		next_page_url: str,
		next_page_key: str,
	})
	.loose();

const ProductsGetOutputSchema = z
	.object({
		success: z.boolean(),
		product: GumroadProductSchema,
	})
	.loose();

const ProductsCreateOutputSchema = z
	.object({
		success: z.boolean(),
		product: GumroadProductSchema,
		warning: str,
	})
	.loose();

const ProductsUpdateOutputSchema = z
	.object({
		success: z.boolean(),
		product: GumroadProductSchema,
		warning: str,
		file_id_mappings: z.record(z.string(), z.string()).nullish(),
	})
	.loose();

const ProductsDeleteOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
	})
	.loose();

const ProductsEnableOutputSchema = ProductsGetOutputSchema;
const ProductsDisableOutputSchema = ProductsGetOutputSchema;

const ProductsReviewsListOutputSchema = z
	.object({
		success: z.boolean(),
		product_reviews: z.array(GumroadReviewSchema),
		next_page_url: str,
		next_page_key: str,
	})
	.loose();

const ProductsCategoriesListOutputSchema = z
	.object({
		success: z.boolean(),
		categories: z.array(GumroadCategorySchema),
	})
	.loose();

const ProductsCoversAddOutputSchema = z
	.object({
		success: z.boolean(),
		covers: z.array(GumroadCoverSchema),
		main_cover_id: str,
	})
	.loose();

const ProductsCoversDeleteOutputSchema = ProductsCoversAddOutputSchema;

const ProductsThumbnailSetOutputSchema = z
	.object({
		success: z.boolean(),
		thumbnail: z.object({ url: str, guid: str }).loose(),
	})
	.loose();

const ProductsThumbnailDeleteOutputSchema = z
	.object({
		success: z.boolean(),
		thumbnail: str,
	})
	.loose();

const OfferCodeEnvelope = {
	success: z.boolean(),
	offer_code: GumroadOfferCodeSchema,
};

const OfferCodesListOutputSchema = z
	.object({
		success: z.boolean(),
		offer_codes: z.array(GumroadOfferCodeSchema),
		next_page_url: str,
		next_page_key: str,
	})
	.loose();

const OfferCodesGetOutputSchema = z.object(OfferCodeEnvelope).loose();
const OfferCodesUpdateOutputSchema = z.object(OfferCodeEnvelope).loose();
const OfferCodesListForProductOutputSchema = z
	.object({
		success: z.boolean(),
		offer_codes: z.array(GumroadOfferCodeSchema),
	})
	.loose();
const OfferCodesGetForProductOutputSchema = z.object(OfferCodeEnvelope).loose();
const OfferCodesCreateForProductOutputSchema = z
	.object(OfferCodeEnvelope)
	.loose();
const OfferCodesUpdateForProductOutputSchema = z
	.object(OfferCodeEnvelope)
	.loose();
const OfferCodesDeleteForProductOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
	})
	.loose();

const VariantCategoryEnvelope = {
	success: z.boolean(),
	variant_category: GumroadVariantCategorySchema,
};

const VariantCategoriesListOutputSchema = z
	.object({
		success: z.boolean(),
		variant_categories: z.array(GumroadVariantCategorySchema),
	})
	.loose();
const VariantCategoriesCreateOutputSchema = z
	.object(VariantCategoryEnvelope)
	.loose();
const VariantCategoriesGetOutputSchema = z
	.object(VariantCategoryEnvelope)
	.loose();
const VariantCategoriesUpdateOutputSchema = z
	.object(VariantCategoryEnvelope)
	.loose();
const VariantCategoriesDeleteOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
	})
	.loose();

const VariantEnvelope = {
	success: z.boolean(),
	variant: GumroadVariantSchema,
};

const VariantsListOutputSchema = z
	.object({
		success: z.boolean(),
		variants: z.array(GumroadVariantSchema),
	})
	.loose();
const VariantsCreateOutputSchema = z.object(VariantEnvelope).loose();
const VariantsGetOutputSchema = z.object(VariantEnvelope).loose();
const VariantsUpdateOutputSchema = z.object(VariantEnvelope).loose();
const VariantsDeleteOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
	})
	.loose();

const CustomFieldEnvelope = {
	success: z.boolean(),
	custom_field: GumroadCustomFieldSchema,
};

const CustomFieldsListOutputSchema = z
	.object({
		success: z.boolean(),
		custom_fields: z.array(GumroadCustomFieldSchema),
	})
	.loose();
const CustomFieldsCreateOutputSchema = z.object(CustomFieldEnvelope).loose();
const CustomFieldsUpdateOutputSchema = z.object(CustomFieldEnvelope).loose();
const CustomFieldsDeleteOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
	})
	.loose();

const UserGetOutputSchema = z
	.object({
		success: z.boolean(),
		user: GumroadUserSchema,
	})
	.loose();

const UserCustomHtmlGetOutputSchema = z
	.object({
		success: z.boolean(),
		custom_html: str,
		rendered_html: str,
		has_landing_page: bool,
		profile_url: str,
	})
	.loose();

const UserCustomHtmlUpdateOutputSchema = z
	.object({
		success: z.boolean(),
		custom_html: str,
		previous_custom_html: str,
		profile_url: str,
		sanitization_report: GumroadSanitizationReportSchema,
	})
	.loose();

const UserCustomHtmlPreviewOutputSchema = z
	.object({
		success: z.boolean(),
		custom_html: str,
		sanitization_report: GumroadSanitizationReportSchema,
	})
	.loose();

const UserRefundPolicyGetOutputSchema = z
	.object({
		success: z.boolean(),
		refund_policy: GumroadRefundPolicySchema,
	})
	.loose();

const UserRefundPolicyUpdateOutputSchema = UserRefundPolicyGetOutputSchema;

// The public payloads have no success envelope.
const PublicProductOutputSchema = z
	.object({
		api_version: z.number(),
		id: z.string(),
		permalink: z.string(),
		name: z.string(),
		native_type: str,
		url: str,
		thumbnail_url: str,
		created_at: str,
		updated_at: str,
		seller: z.object({}).loose().nullish(),
		price_cents: num,
		currency_code: str,
		price_formatted: str,
		is_pay_what_you_want: bool,
		suggested_price_cents: num,
		is_recurring_billing: bool,
		is_tiered_membership: bool,
		recurrences: z.object({}).loose().nullish(),
		free_trial: z.object({}).loose().nullish(),
		description_html: str,
		summary: str,
		covers: z.array(z.object({}).loose()).nullish(),
		attributes: z.array(z.object({}).loose()).nullish(),
		ratings: z.object({}).loose().nullish(),
		reviews: z.array(z.object({}).loose()).nullish(),
		sales_count: num,
		options: z.array(z.object({}).loose()).nullish(),
		quantity_remaining: num,
		is_quantity_enabled: bool,
		is_sales_limited: bool,
		is_published: bool,
		is_physical: bool,
		refund_policy: z.object({}).loose().nullish(),
	})
	.loose();

const PublicProfileOutputSchema = z
	.object({
		api_version: z.number(),
		id: z.string(),
		username: str,
		name: str,
		bio: str,
		avatar_url: str,
		profile_url: str,
		subdomain: str,
		twitter_handle: str,
		is_verified: bool,
		products: z.array(z.object({}).loose()).nullish(),
	})
	.loose();

const MediaListOutputSchema = z
	.object({
		success: z.boolean(),
		media: z.array(GumroadMediaFileSchema),
	})
	.loose();

const MediaCreateOutputSchema = z
	.object({
		success: z.boolean(),
		media: GumroadMediaFileSchema,
		message: str,
	})
	.loose();

const MediaDeleteOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
	})
	.loose();

const FilesPresignOutputSchema = z
	.object({
		success: z.boolean(),
		upload_id: z.string(),
		key: z.string(),
		file_url: z.string(),
		parts: z.array(
			z.object({ part_number: z.number(), presigned_url: z.string() }).loose(),
		),
	})
	.loose();

const FilesCompleteOutputSchema = z
	.object({
		success: z.boolean(),
		file_url: z.string(),
	})
	.loose();

const FilesAbortOutputSchema = z
	.object({
		success: z.boolean(),
		status: z.enum(['accepted', 'already_gone']),
	})
	.loose();

const EmailsListOutputSchema = z
	.object({
		success: z.boolean(),
		emails: z.array(GumroadEmailSchema),
		next_page_url: str,
		next_page_key: str,
	})
	.loose();

const EmailEnvelope = {
	success: z.boolean(),
	email: GumroadEmailSchema,
};

const EmailsGetOutputSchema = z.object(EmailEnvelope).loose();
const EmailsCreateOutputSchema = z.object(EmailEnvelope).loose();
const EmailsPreviewOutputSchema = z
	.object({
		...EmailEnvelope,
		preview_url: str,
		message: str,
	})
	.loose();
const EmailsSendOutputSchema = z.object(EmailEnvelope).loose();
const EmailsScheduleOutputSchema = z.object(EmailEnvelope).loose();
const EmailsUnscheduleOutputSchema = z.object(EmailEnvelope).loose();
const EmailsDeleteOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
	})
	.loose();

const WorkflowsListOutputSchema = z
	.object({
		success: z.boolean(),
		workflows: z.array(GumroadWorkflowSchema),
	})
	.loose();

const WorkflowsGetOutputSchema = z
	.object({
		success: z.boolean(),
		workflow: GumroadWorkflowSchema,
	})
	.loose();

const WorkflowsEmailsAddOutputSchema = z
	.object({
		success: z.boolean(),
		email: GumroadWorkflowEmailSchema,
	})
	.loose();

const WorkflowsEmailsUpdateOutputSchema = WorkflowsEmailsAddOutputSchema;

const ResourceSubscriptionEnvelope = {
	success: z.boolean(),
	resource_subscription: GumroadResourceSubscriptionSchema,
};

const ResourceSubscriptionsSubscribeOutputSchema = z
	.object(ResourceSubscriptionEnvelope)
	.loose();

const ResourceSubscriptionsListOutputSchema = z
	.object({
		success: z.boolean(),
		resource_subscriptions: z.array(GumroadResourceSubscriptionSchema),
	})
	.loose();

const ResourceSubscriptionsTestEventOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
		source: str,
		// The sample payload's keys vary by resource, so only object-ness is
		// pinned.
		payload: z.object({}).loose(),
	})
	.loose();

const ResourceSubscriptionsUnsubscribeOutputSchema = z
	.object({
		success: z.boolean(),
		message: str,
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

const SaleEnvelopeOutputSchema = SalesGetOutputSchema;
const SalesMarkAsShippedOutputSchema = SaleEnvelopeOutputSchema;
const SalesRefundOutputSchema = SaleEnvelopeOutputSchema;
const SalesRevokeAccessOutputSchema = SaleEnvelopeOutputSchema;
const SalesUndoRevokeAccessOutputSchema = SaleEnvelopeOutputSchema;

const SalesResendReceiptOutputSchema = z
	.object({
		success: z.boolean(),
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

// The docs' show response nests the single subscriber under a plural key.
const SubscribersGetOutputSchema = z
	.object({
		success: z.boolean(),
		subscribers: GumroadSubscriberSchema,
	})
	.loose();

const LicensesVerifyOutputSchema = z
	.object({
		success: z.boolean(),
		uses: z.number(),
		purchase: GumroadPurchaseSchema,
	})
	.loose();

const LicensesEnableOutputSchema = LicensesVerifyOutputSchema;
const LicensesDisableOutputSchema = LicensesVerifyOutputSchema;
const LicensesDecrementUsesCountOutputSchema = LicensesVerifyOutputSchema;
const LicensesRotateOutputSchema = LicensesVerifyOutputSchema;

const PayoutsListOutputSchema = z
	.object({
		success: z.boolean(),
		payouts: z.array(GumroadPayoutSchema),
		next_page_url: str,
		next_page_key: str,
	})
	.loose();

const PayoutsGetOutputSchema = z
	.object({
		success: z.boolean(),
		payout: GumroadPayoutSchema,
	})
	.loose();

const PayoutsUpcomingOutputSchema = z
	.object({
		success: z.boolean(),
		payouts: z.array(GumroadPayoutSchema),
	})
	.loose();

const TaxFormsListOutputSchema = z
	.object({
		success: z.boolean(),
		tax_forms: z.array(GumroadTaxFormSchema),
	})
	.loose();

// The download returns a raw PDF (Content-Type: application/pdf); the client
// normalizes it to a base64 file before this schema runs.
const TaxFormsDownloadOutputSchema = z.object({
	filename: z.string().optional(),
	contentType: z.string(),
	contentBase64: z.string(),
});

const EarningsGetOutputSchema = z
	.object({
		success: z.boolean(),
		year: z.number(),
		currency: str,
		gross_cents: z.number(),
		fees_cents: z.number(),
		taxes_cents: z.number(),
		affiliate_credit_cents: z.number(),
		net_cents: z.number(),
	})
	.loose();

// ── Registry ─────────────────────────────────────────────────────────────────

export const GumroadEndpointInputSchemas = {
	productsList: ProductsListInputSchema,
	productsGet: ProductsGetInputSchema,
	productsCreate: ProductsCreateInputSchema,
	productsUpdate: ProductsUpdateInputSchema,
	productsDelete: ProductsDeleteInputSchema,
	productsEnable: ProductsEnableInputSchema,
	productsDisable: ProductsDisableInputSchema,
	productsReviewsList: ProductsReviewsListInputSchema,
	productsCategoriesList: ProductsCategoriesListInputSchema,
	productsCoversAdd: ProductsCoversAddInputSchema,
	productsCoversDelete: ProductsCoversDeleteInputSchema,
	productsThumbnailSet: ProductsThumbnailSetInputSchema,
	productsThumbnailDelete: ProductsThumbnailDeleteInputSchema,
	offerCodesList: OfferCodesListInputSchema,
	offerCodesGet: OfferCodesGetInputSchema,
	offerCodesUpdate: OfferCodesUpdateInputSchema,
	offerCodesListForProduct: OfferCodesListForProductInputSchema,
	offerCodesGetForProduct: OfferCodesGetForProductInputSchema,
	offerCodesCreateForProduct: OfferCodesCreateForProductInputSchema,
	offerCodesUpdateForProduct: OfferCodesUpdateForProductInputSchema,
	offerCodesDeleteForProduct: OfferCodesDeleteForProductInputSchema,
	variantCategoriesList: VariantCategoriesListInputSchema,
	variantCategoriesCreate: VariantCategoriesCreateInputSchema,
	variantCategoriesGet: VariantCategoriesGetInputSchema,
	variantCategoriesUpdate: VariantCategoriesUpdateInputSchema,
	variantCategoriesDelete: VariantCategoriesDeleteInputSchema,
	variantCategoriesVariantsList: VariantsListInputSchema,
	variantCategoriesVariantsCreate: VariantsCreateInputSchema,
	variantCategoriesVariantsGet: VariantsGetInputSchema,
	variantCategoriesVariantsUpdate: VariantsUpdateInputSchema,
	variantCategoriesVariantsDelete: VariantsDeleteInputSchema,
	customFieldsList: CustomFieldsListInputSchema,
	customFieldsCreate: CustomFieldsCreateInputSchema,
	customFieldsUpdate: CustomFieldsUpdateInputSchema,
	customFieldsDelete: CustomFieldsDeleteInputSchema,
	userGet: UserGetInputSchema,
	userCustomHtmlGet: UserCustomHtmlGetInputSchema,
	userCustomHtmlUpdate: UserCustomHtmlUpdateInputSchema,
	userCustomHtmlPreview: UserCustomHtmlPreviewInputSchema,
	userRefundPolicyGet: UserRefundPolicyGetInputSchema,
	userRefundPolicyUpdate: UserRefundPolicyUpdateInputSchema,
	publicProduct: PublicProductInputSchema,
	publicProfile: PublicProfileInputSchema,
	mediaList: MediaListInputSchema,
	mediaCreate: MediaCreateInputSchema,
	mediaDelete: MediaDeleteInputSchema,
	filesPresign: FilesPresignInputSchema,
	filesComplete: FilesCompleteInputSchema,
	filesAbort: FilesAbortInputSchema,
	emailsList: EmailsListInputSchema,
	emailsGet: EmailsGetInputSchema,
	emailsCreate: EmailsCreateInputSchema,
	emailsPreview: EmailsPreviewInputSchema,
	emailsSend: EmailsSendInputSchema,
	emailsSchedule: EmailsScheduleInputSchema,
	emailsUnschedule: EmailsUnscheduleInputSchema,
	emailsDelete: EmailsDeleteInputSchema,
	workflowsList: WorkflowsListInputSchema,
	workflowsGet: WorkflowsGetInputSchema,
	workflowsEmailsAdd: WorkflowsEmailsAddInputSchema,
	workflowsEmailsUpdate: WorkflowsEmailsUpdateInputSchema,
	resourceSubscriptionsSubscribe: ResourceSubscriptionsSubscribeInputSchema,
	resourceSubscriptionsList: ResourceSubscriptionsListInputSchema,
	resourceSubscriptionsTestEvent: ResourceSubscriptionsTestEventInputSchema,
	resourceSubscriptionsUnsubscribe: ResourceSubscriptionsUnsubscribeInputSchema,
	salesList: SalesListInputSchema,
	salesGet: SalesGetInputSchema,
	salesMarkAsShipped: SalesMarkAsShippedInputSchema,
	salesRefund: SalesRefundInputSchema,
	salesRevokeAccess: SalesRevokeAccessInputSchema,
	salesUndoRevokeAccess: SalesUndoRevokeAccessInputSchema,
	salesResendReceipt: SalesResendReceiptInputSchema,
	subscribersList: SubscribersListInputSchema,
	subscribersGet: SubscribersGetInputSchema,
	licensesVerify: LicensesVerifyInputSchema,
	licensesEnable: LicenseKeyInputSchema,
	licensesDisable: LicenseKeyInputSchema,
	licensesDecrementUsesCount: LicenseKeyInputSchema,
	licensesRotate: LicenseKeyInputSchema,
	payoutsList: PayoutsListInputSchema,
	payoutsGet: PayoutsGetInputSchema,
	payoutsUpcoming: PayoutsUpcomingInputSchema,
	taxFormsList: TaxFormsListInputSchema,
	taxFormsDownload: TaxFormsDownloadInputSchema,
	earningsGet: EarningsGetInputSchema,
} as const;

export const GumroadEndpointOutputSchemas = {
	productsList: ProductsListOutputSchema,
	productsGet: ProductsGetOutputSchema,
	productsCreate: ProductsCreateOutputSchema,
	productsUpdate: ProductsUpdateOutputSchema,
	productsDelete: ProductsDeleteOutputSchema,
	productsEnable: ProductsEnableOutputSchema,
	productsDisable: ProductsDisableOutputSchema,
	productsReviewsList: ProductsReviewsListOutputSchema,
	productsCategoriesList: ProductsCategoriesListOutputSchema,
	productsCoversAdd: ProductsCoversAddOutputSchema,
	productsCoversDelete: ProductsCoversDeleteOutputSchema,
	productsThumbnailSet: ProductsThumbnailSetOutputSchema,
	productsThumbnailDelete: ProductsThumbnailDeleteOutputSchema,
	offerCodesList: OfferCodesListOutputSchema,
	offerCodesGet: OfferCodesGetOutputSchema,
	offerCodesUpdate: OfferCodesUpdateOutputSchema,
	offerCodesListForProduct: OfferCodesListForProductOutputSchema,
	offerCodesGetForProduct: OfferCodesGetForProductOutputSchema,
	offerCodesCreateForProduct: OfferCodesCreateForProductOutputSchema,
	offerCodesUpdateForProduct: OfferCodesUpdateForProductOutputSchema,
	offerCodesDeleteForProduct: OfferCodesDeleteForProductOutputSchema,
	variantCategoriesList: VariantCategoriesListOutputSchema,
	variantCategoriesCreate: VariantCategoriesCreateOutputSchema,
	variantCategoriesGet: VariantCategoriesGetOutputSchema,
	variantCategoriesUpdate: VariantCategoriesUpdateOutputSchema,
	variantCategoriesDelete: VariantCategoriesDeleteOutputSchema,
	variantCategoriesVariantsList: VariantsListOutputSchema,
	variantCategoriesVariantsCreate: VariantsCreateOutputSchema,
	variantCategoriesVariantsGet: VariantsGetOutputSchema,
	variantCategoriesVariantsUpdate: VariantsUpdateOutputSchema,
	variantCategoriesVariantsDelete: VariantsDeleteOutputSchema,
	customFieldsList: CustomFieldsListOutputSchema,
	customFieldsCreate: CustomFieldsCreateOutputSchema,
	customFieldsUpdate: CustomFieldsUpdateOutputSchema,
	customFieldsDelete: CustomFieldsDeleteOutputSchema,
	userGet: UserGetOutputSchema,
	userCustomHtmlGet: UserCustomHtmlGetOutputSchema,
	userCustomHtmlUpdate: UserCustomHtmlUpdateOutputSchema,
	userCustomHtmlPreview: UserCustomHtmlPreviewOutputSchema,
	userRefundPolicyGet: UserRefundPolicyGetOutputSchema,
	userRefundPolicyUpdate: UserRefundPolicyUpdateOutputSchema,
	publicProduct: PublicProductOutputSchema,
	publicProfile: PublicProfileOutputSchema,
	mediaList: MediaListOutputSchema,
	mediaCreate: MediaCreateOutputSchema,
	mediaDelete: MediaDeleteOutputSchema,
	filesPresign: FilesPresignOutputSchema,
	filesComplete: FilesCompleteOutputSchema,
	filesAbort: FilesAbortOutputSchema,
	emailsList: EmailsListOutputSchema,
	emailsGet: EmailsGetOutputSchema,
	emailsCreate: EmailsCreateOutputSchema,
	emailsPreview: EmailsPreviewOutputSchema,
	emailsSend: EmailsSendOutputSchema,
	emailsSchedule: EmailsScheduleOutputSchema,
	emailsUnschedule: EmailsUnscheduleOutputSchema,
	emailsDelete: EmailsDeleteOutputSchema,
	workflowsList: WorkflowsListOutputSchema,
	workflowsGet: WorkflowsGetOutputSchema,
	workflowsEmailsAdd: WorkflowsEmailsAddOutputSchema,
	workflowsEmailsUpdate: WorkflowsEmailsUpdateOutputSchema,
	resourceSubscriptionsSubscribe: ResourceSubscriptionsSubscribeOutputSchema,
	resourceSubscriptionsList: ResourceSubscriptionsListOutputSchema,
	resourceSubscriptionsTestEvent: ResourceSubscriptionsTestEventOutputSchema,
	resourceSubscriptionsUnsubscribe:
		ResourceSubscriptionsUnsubscribeOutputSchema,
	salesList: SalesListOutputSchema,
	salesGet: SalesGetOutputSchema,
	salesMarkAsShipped: SalesMarkAsShippedOutputSchema,
	salesRefund: SalesRefundOutputSchema,
	salesRevokeAccess: SalesRevokeAccessOutputSchema,
	salesUndoRevokeAccess: SalesUndoRevokeAccessOutputSchema,
	salesResendReceipt: SalesResendReceiptOutputSchema,
	subscribersList: SubscribersListOutputSchema,
	subscribersGet: SubscribersGetOutputSchema,
	licensesVerify: LicensesVerifyOutputSchema,
	licensesEnable: LicensesEnableOutputSchema,
	licensesDisable: LicensesDisableOutputSchema,
	licensesDecrementUsesCount: LicensesDecrementUsesCountOutputSchema,
	licensesRotate: LicensesRotateOutputSchema,
	payoutsList: PayoutsListOutputSchema,
	payoutsGet: PayoutsGetOutputSchema,
	payoutsUpcoming: PayoutsUpcomingOutputSchema,
	taxFormsList: TaxFormsListOutputSchema,
	taxFormsDownload: TaxFormsDownloadOutputSchema,
	earningsGet: EarningsGetOutputSchema,
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

type InputOf<K extends GumroadOperation> = GumroadEndpointInputs[K];
type ResponseOf<K extends GumroadOperation> = GumroadEndpointOutputs[K];

export type ProductsListInput = InputOf<'productsList'>;
export type ProductsListResponse = ResponseOf<'productsList'>;
export type ProductsGetInput = InputOf<'productsGet'>;
export type ProductsGetResponse = ResponseOf<'productsGet'>;
export type ProductsCreateInput = InputOf<'productsCreate'>;
export type ProductsCreateResponse = ResponseOf<'productsCreate'>;
export type ProductsUpdateInput = InputOf<'productsUpdate'>;
export type ProductsUpdateResponse = ResponseOf<'productsUpdate'>;
export type ProductsDeleteInput = InputOf<'productsDelete'>;
export type ProductsDeleteResponse = ResponseOf<'productsDelete'>;
export type ProductsEnableInput = InputOf<'productsEnable'>;
export type ProductsEnableResponse = ResponseOf<'productsEnable'>;
export type ProductsDisableInput = InputOf<'productsDisable'>;
export type ProductsDisableResponse = ResponseOf<'productsDisable'>;
export type ProductsReviewsListInput = InputOf<'productsReviewsList'>;
export type ProductsReviewsListResponse = ResponseOf<'productsReviewsList'>;
export type ProductsCategoriesListInput = InputOf<'productsCategoriesList'>;
export type ProductsCategoriesListResponse =
	ResponseOf<'productsCategoriesList'>;
export type ProductsCoversAddInput = InputOf<'productsCoversAdd'>;
export type ProductsCoversAddResponse = ResponseOf<'productsCoversAdd'>;
export type ProductsCoversDeleteInput = InputOf<'productsCoversDelete'>;
export type ProductsCoversDeleteResponse = ResponseOf<'productsCoversDelete'>;
export type ProductsThumbnailSetInput = InputOf<'productsThumbnailSet'>;
export type ProductsThumbnailSetResponse = ResponseOf<'productsThumbnailSet'>;
export type ProductsThumbnailDeleteInput = InputOf<'productsThumbnailDelete'>;
export type ProductsThumbnailDeleteResponse =
	ResponseOf<'productsThumbnailDelete'>;
export type OfferCodesListInput = InputOf<'offerCodesList'>;
export type OfferCodesListResponse = ResponseOf<'offerCodesList'>;
export type OfferCodesGetInput = InputOf<'offerCodesGet'>;
export type OfferCodesGetResponse = ResponseOf<'offerCodesGet'>;
export type OfferCodesUpdateInput = InputOf<'offerCodesUpdate'>;
export type OfferCodesUpdateResponse = ResponseOf<'offerCodesUpdate'>;
export type OfferCodesListForProductInput = InputOf<'offerCodesListForProduct'>;
export type OfferCodesListForProductResponse =
	ResponseOf<'offerCodesListForProduct'>;
export type OfferCodesGetForProductInput = InputOf<'offerCodesGetForProduct'>;
export type OfferCodesGetForProductResponse =
	ResponseOf<'offerCodesGetForProduct'>;
export type OfferCodesCreateForProductInput =
	InputOf<'offerCodesCreateForProduct'>;
export type OfferCodesCreateForProductResponse =
	ResponseOf<'offerCodesCreateForProduct'>;
export type OfferCodesUpdateForProductInput =
	InputOf<'offerCodesUpdateForProduct'>;
export type OfferCodesUpdateForProductResponse =
	ResponseOf<'offerCodesUpdateForProduct'>;
export type OfferCodesDeleteForProductInput =
	InputOf<'offerCodesDeleteForProduct'>;
export type OfferCodesDeleteForProductResponse =
	ResponseOf<'offerCodesDeleteForProduct'>;
export type VariantCategoriesListInput = InputOf<'variantCategoriesList'>;
export type VariantCategoriesListResponse = ResponseOf<'variantCategoriesList'>;
export type VariantCategoriesCreateInput = InputOf<'variantCategoriesCreate'>;
export type VariantCategoriesCreateResponse =
	ResponseOf<'variantCategoriesCreate'>;
export type VariantCategoriesGetInput = InputOf<'variantCategoriesGet'>;
export type VariantCategoriesGetResponse = ResponseOf<'variantCategoriesGet'>;
export type VariantCategoriesUpdateInput = InputOf<'variantCategoriesUpdate'>;
export type VariantCategoriesUpdateResponse =
	ResponseOf<'variantCategoriesUpdate'>;
export type VariantCategoriesDeleteInput = InputOf<'variantCategoriesDelete'>;
export type VariantCategoriesDeleteResponse =
	ResponseOf<'variantCategoriesDelete'>;
export type VariantCategoriesVariantsListInput =
	InputOf<'variantCategoriesVariantsList'>;
export type VariantCategoriesVariantsListResponse =
	ResponseOf<'variantCategoriesVariantsList'>;
export type VariantCategoriesVariantsCreateInput =
	InputOf<'variantCategoriesVariantsCreate'>;
export type VariantCategoriesVariantsCreateResponse =
	ResponseOf<'variantCategoriesVariantsCreate'>;
export type VariantCategoriesVariantsGetInput =
	InputOf<'variantCategoriesVariantsGet'>;
export type VariantCategoriesVariantsGetResponse =
	ResponseOf<'variantCategoriesVariantsGet'>;
export type VariantCategoriesVariantsUpdateInput =
	InputOf<'variantCategoriesVariantsUpdate'>;
export type VariantCategoriesVariantsUpdateResponse =
	ResponseOf<'variantCategoriesVariantsUpdate'>;
export type VariantCategoriesVariantsDeleteInput =
	InputOf<'variantCategoriesVariantsDelete'>;
export type VariantCategoriesVariantsDeleteResponse =
	ResponseOf<'variantCategoriesVariantsDelete'>;
export type CustomFieldsListInput = InputOf<'customFieldsList'>;
export type CustomFieldsListResponse = ResponseOf<'customFieldsList'>;
export type CustomFieldsCreateInput = InputOf<'customFieldsCreate'>;
export type CustomFieldsCreateResponse = ResponseOf<'customFieldsCreate'>;
export type CustomFieldsUpdateInput = InputOf<'customFieldsUpdate'>;
export type CustomFieldsUpdateResponse = ResponseOf<'customFieldsUpdate'>;
export type CustomFieldsDeleteInput = InputOf<'customFieldsDelete'>;
export type CustomFieldsDeleteResponse = ResponseOf<'customFieldsDelete'>;
export type UserGetInput = InputOf<'userGet'>;
export type UserGetResponse = ResponseOf<'userGet'>;
export type UserCustomHtmlGetInput = InputOf<'userCustomHtmlGet'>;
export type UserCustomHtmlGetResponse = ResponseOf<'userCustomHtmlGet'>;
export type UserCustomHtmlUpdateInput = InputOf<'userCustomHtmlUpdate'>;
export type UserCustomHtmlUpdateResponse = ResponseOf<'userCustomHtmlUpdate'>;
export type UserCustomHtmlPreviewInput = InputOf<'userCustomHtmlPreview'>;
export type UserCustomHtmlPreviewResponse = ResponseOf<'userCustomHtmlPreview'>;
export type UserRefundPolicyGetInput = InputOf<'userRefundPolicyGet'>;
export type UserRefundPolicyGetResponse = ResponseOf<'userRefundPolicyGet'>;
export type UserRefundPolicyUpdateInput = InputOf<'userRefundPolicyUpdate'>;
export type UserRefundPolicyUpdateResponse =
	ResponseOf<'userRefundPolicyUpdate'>;
export type PublicProductInput = InputOf<'publicProduct'>;
export type PublicProductResponse = ResponseOf<'publicProduct'>;
export type PublicProfileInput = InputOf<'publicProfile'>;
export type PublicProfileResponse = ResponseOf<'publicProfile'>;
export type MediaListInput = InputOf<'mediaList'>;
export type MediaListResponse = ResponseOf<'mediaList'>;
export type MediaCreateInput = InputOf<'mediaCreate'>;
export type MediaCreateResponse = ResponseOf<'mediaCreate'>;
export type MediaDeleteInput = InputOf<'mediaDelete'>;
export type MediaDeleteResponse = ResponseOf<'mediaDelete'>;
export type FilesPresignInput = InputOf<'filesPresign'>;
export type FilesPresignResponse = ResponseOf<'filesPresign'>;
export type FilesCompleteInput = InputOf<'filesComplete'>;
export type FilesCompleteResponse = ResponseOf<'filesComplete'>;
export type FilesAbortInput = InputOf<'filesAbort'>;
export type FilesAbortResponse = ResponseOf<'filesAbort'>;
export type EmailsListInput = InputOf<'emailsList'>;
export type EmailsListResponse = ResponseOf<'emailsList'>;
export type EmailsGetInput = InputOf<'emailsGet'>;
export type EmailsGetResponse = ResponseOf<'emailsGet'>;
export type EmailsCreateInput = InputOf<'emailsCreate'>;
export type EmailsCreateResponse = ResponseOf<'emailsCreate'>;
export type EmailsPreviewInput = InputOf<'emailsPreview'>;
export type EmailsPreviewResponse = ResponseOf<'emailsPreview'>;
export type EmailsSendInput = InputOf<'emailsSend'>;
export type EmailsSendResponse = ResponseOf<'emailsSend'>;
export type EmailsScheduleInput = InputOf<'emailsSchedule'>;
export type EmailsScheduleResponse = ResponseOf<'emailsSchedule'>;
export type EmailsUnscheduleInput = InputOf<'emailsUnschedule'>;
export type EmailsUnscheduleResponse = ResponseOf<'emailsUnschedule'>;
export type EmailsDeleteInput = InputOf<'emailsDelete'>;
export type EmailsDeleteResponse = ResponseOf<'emailsDelete'>;
export type WorkflowsListInput = InputOf<'workflowsList'>;
export type WorkflowsListResponse = ResponseOf<'workflowsList'>;
export type WorkflowsGetInput = InputOf<'workflowsGet'>;
export type WorkflowsGetResponse = ResponseOf<'workflowsGet'>;
export type WorkflowsEmailsAddInput = InputOf<'workflowsEmailsAdd'>;
export type WorkflowsEmailsAddResponse = ResponseOf<'workflowsEmailsAdd'>;
export type WorkflowsEmailsUpdateInput = InputOf<'workflowsEmailsUpdate'>;
export type WorkflowsEmailsUpdateResponse = ResponseOf<'workflowsEmailsUpdate'>;
export type ResourceSubscriptionsSubscribeInput =
	InputOf<'resourceSubscriptionsSubscribe'>;
export type ResourceSubscriptionsSubscribeResponse =
	ResponseOf<'resourceSubscriptionsSubscribe'>;
export type ResourceSubscriptionsListInput =
	InputOf<'resourceSubscriptionsList'>;
export type ResourceSubscriptionsListResponse =
	ResponseOf<'resourceSubscriptionsList'>;
export type ResourceSubscriptionsTestEventInput =
	InputOf<'resourceSubscriptionsTestEvent'>;
export type ResourceSubscriptionsTestEventResponse =
	ResponseOf<'resourceSubscriptionsTestEvent'>;
export type ResourceSubscriptionsUnsubscribeInput =
	InputOf<'resourceSubscriptionsUnsubscribe'>;
export type ResourceSubscriptionsUnsubscribeResponse =
	ResponseOf<'resourceSubscriptionsUnsubscribe'>;
export type SalesListInput = InputOf<'salesList'>;
export type SalesListResponse = ResponseOf<'salesList'>;
export type SalesGetInput = InputOf<'salesGet'>;
export type SalesGetResponse = ResponseOf<'salesGet'>;
export type SalesMarkAsShippedInput = InputOf<'salesMarkAsShipped'>;
export type SalesMarkAsShippedResponse = ResponseOf<'salesMarkAsShipped'>;
export type SalesRefundInput = InputOf<'salesRefund'>;
export type SalesRefundResponse = ResponseOf<'salesRefund'>;
export type SalesRevokeAccessInput = InputOf<'salesRevokeAccess'>;
export type SalesRevokeAccessResponse = ResponseOf<'salesRevokeAccess'>;
export type SalesUndoRevokeAccessInput = InputOf<'salesUndoRevokeAccess'>;
export type SalesUndoRevokeAccessResponse = ResponseOf<'salesUndoRevokeAccess'>;
export type SalesResendReceiptInput = InputOf<'salesResendReceipt'>;
export type SalesResendReceiptResponse = ResponseOf<'salesResendReceipt'>;
export type SubscribersListInput = InputOf<'subscribersList'>;
export type SubscribersListResponse = ResponseOf<'subscribersList'>;
export type SubscribersGetInput = InputOf<'subscribersGet'>;
export type SubscribersGetResponse = ResponseOf<'subscribersGet'>;
export type LicensesVerifyInput = InputOf<'licensesVerify'>;
export type LicensesVerifyResponse = ResponseOf<'licensesVerify'>;
export type LicensesEnableInput = InputOf<'licensesEnable'>;
export type LicensesEnableResponse = ResponseOf<'licensesEnable'>;
export type LicensesDisableInput = InputOf<'licensesDisable'>;
export type LicensesDisableResponse = ResponseOf<'licensesDisable'>;
export type LicensesDecrementUsesCountInput =
	InputOf<'licensesDecrementUsesCount'>;
export type LicensesDecrementUsesCountResponse =
	ResponseOf<'licensesDecrementUsesCount'>;
export type LicensesRotateInput = InputOf<'licensesRotate'>;
export type LicensesRotateResponse = ResponseOf<'licensesRotate'>;
export type PayoutsListInput = InputOf<'payoutsList'>;
export type PayoutsListResponse = ResponseOf<'payoutsList'>;
export type PayoutsGetInput = InputOf<'payoutsGet'>;
export type PayoutsGetResponse = ResponseOf<'payoutsGet'>;
export type PayoutsUpcomingInput = InputOf<'payoutsUpcoming'>;
export type PayoutsUpcomingResponse = ResponseOf<'payoutsUpcoming'>;
export type TaxFormsListInput = InputOf<'taxFormsList'>;
export type TaxFormsListResponse = ResponseOf<'taxFormsList'>;
export type TaxFormsDownloadInput = InputOf<'taxFormsDownload'>;
export type TaxFormsDownloadResponse = ResponseOf<'taxFormsDownload'>;
export type EarningsGetInput = InputOf<'earningsGet'>;
export type EarningsGetResponse = ResponseOf<'earningsGet'>;

export type GumroadProduct = z.infer<typeof GumroadProductSchema>;
export type GumroadSale = z.infer<typeof GumroadSaleSchema>;
export type GumroadSubscriber = z.infer<typeof GumroadSubscriberSchema>;
export type GumroadPurchase = z.infer<typeof GumroadPurchaseSchema>;
export type GumroadOfferCode = z.infer<typeof GumroadOfferCodeSchema>;
export type GumroadVariantCategory = z.infer<
	typeof GumroadVariantCategorySchema
>;
export type GumroadVariant = z.infer<typeof GumroadVariantSchema>;
export type GumroadCustomField = z.infer<typeof GumroadCustomFieldSchema>;
export type GumroadEmail = z.infer<typeof GumroadEmailSchema>;
export type GumroadWorkflowEmail = z.infer<typeof GumroadWorkflowEmailSchema>;
export type GumroadWorkflow = z.infer<typeof GumroadWorkflowSchema>;
export type GumroadMediaFile = z.infer<typeof GumroadMediaFileSchema>;
export type GumroadResourceSubscription = z.infer<
	typeof GumroadResourceSubscriptionSchema
>;
export type GumroadPayout = z.infer<typeof GumroadPayoutSchema>;
export type GumroadTaxForm = z.infer<typeof GumroadTaxFormSchema>;
export type GumroadCategory = z.infer<typeof GumroadCategorySchema>;
export type GumroadReview = z.infer<typeof GumroadReviewSchema>;
export type GumroadUser = z.infer<typeof GumroadUserSchema>;
export type GumroadRefundPolicy = z.infer<typeof GumroadRefundPolicySchema>;
export type GumroadCover = z.infer<typeof GumroadCoverSchema>;
export type GumroadDownload = {
	filename?: string;
	contentType: string;
	contentBase64: string;
};
