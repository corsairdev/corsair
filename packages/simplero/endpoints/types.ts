import { z } from 'zod';

/**
 * Simplero's own names are used throughout. Outputs are `.loose()` and their
 * optional fields `.nullish()` so a field Simplero adds or omits cannot fail a
 * read that already succeeded.
 *
 * Every route answers one of three envelopes: `{ data: T }` for one record,
 * `{ data: T[], pagination }` for a list, and `{ data: { success, message } }`
 * for an action. The output schemas model those, not the bare record.
 *
 * Contract: https://simplero.com/api/v2/reference/openapi.json
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

const RecordId = z.number().int().describe('A Simplero integer id.');

const Timestamp = z.string().describe('ISO 8601.');

/**
 * List paging. `page` and `per_page` are documented as the way in, and `after`
 * is the cursor form: it takes the last id of the previous page and makes
 * `page`, `total` and `total_pages` null, because counting is skipped.
 */
const paging = {
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number, from 1. Ignored when `after` is set.'),
	per_page: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page, 1 to 100. Defaults to 20.'),
	after: z
		.number()
		.int()
		.optional()
		.describe(
			'Cursor paging: pass the last id of the previous page to get the next one. `total` and `total_pages` are null when this is used.',
		),
	q: z
		.string()
		.optional()
		.describe('Search, matching the fields the route documents.'),
};

const PaginationSchema = z
	.object({
		page: z.number().nullish().describe('Null when paginating by `after`.'),
		per_page: z.number().nullish(),
		total: z
			.number()
			.nullish()
			.describe(
				'Null when paginating by `after`, because counting is skipped.',
			),
		total_pages: z.number().nullish(),
		next_after: z
			.number()
			.nullish()
			.describe(
				'The id to pass as `after` for the next page; null on the last.',
			),
	})
	.loose();

export type SimpleroPagination = z.infer<typeof PaginationSchema>;

/** The `{ success, message }` body every action route answers. */
const ActionResultSchema = z
	.object({
		success: z.boolean(),
		message: z.string().nullish(),
	})
	.loose();

export type SimpleroActionResult = z.infer<typeof ActionResultSchema>;

const ActionResponseSchema = z.object({ data: ActionResultSchema }).loose();

export type SimpleroActionResponse = z.infer<typeof ActionResponseSchema>;

// ── Record schemas ────────────────────────────────────────────────────────

/** A label reference, as the list and detail routes return it. */
const LabelSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		color: z.string().nullish(),
	})
	.loose();

const CustomerSchema = z
	.object({
		id: RecordId.nullish(),
		first_names: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		alternative_emails: z.array(z.string()).nullish(),
		phone_number: z.string().nullish(),
		do_not_contact: z.boolean().nullish(),
		do_not_sms: z.boolean().nullish(),
		locale: z.string().nullish(),
		gdpr_consent: z.boolean().nullish(),
		lead_score: z.number().nullish(),
		lifetime_value_cents_excl_tax: z.number().nullish(),
		lead_acquisition_cost_cents_excl_tax: z.number().nullish(),
		customer_acquisition_cost_cents_excl_tax: z.number().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimpleroCustomer = z.infer<typeof CustomerSchema>;

const ListSchema = z
	.object({
		token: z.string().nullish(),
		name: z.string().nullish(),
		internal_name: z.string().nullish(),
		handle: z.string().nullish(),
		labels: z.array(LabelSchema).nullish(),
		show_in_admin: z.boolean().nullish(),
		require_confirmation: z.boolean().nullish(),
		sender_name: z.string().nullish(),
		sender_email: z.string().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimpleroList = z.infer<typeof ListSchema>;

const TagSchema = z
	.object({
		token: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		color: z.string().nullish(),
		labels: z.array(LabelSchema).nullish(),
		show_in_admin: z.boolean().nullish(),
		undeleted_customers_count: z.number().nullish(),
		last_tagging_at: Timestamp.nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimpleroTag = z.infer<typeof TagSchema>;

const ProductSchema = z
	.object({
		token: z.string().nullish(),
		name: z.string().nullish(),
		internal_name: z.string().nullish(),
		subtitle: z.string().nullish(),
		summary: z.string().nullish(),
		short_description: z.string().nullish(),
		long_description: z.string().nullish(),
		listing_type: z.string().nullish(),
		product_type: z.string().nullish(),
		labels: z.array(LabelSchema).nullish(),
		show_in_admin: z.boolean().nullish(),
		recurring: z.boolean().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimpleroProduct = z.infer<typeof ProductSchema>;

const PurchaseSchema = z
	.object({
		token: z.string().nullish(),
		customer_id: z.number().nullish(),
		product_id: z.number().nullish(),
		price_id: z.number().nullish(),
		state: z.string().nullish(),
		email: z.string().nullish(),
		first_names: z.string().nullish(),
		last_name: z.string().nullish(),
		currency_code: z.string().nullish(),
		country_code: z.string().nullish(),
		received_price_cents: z.number().nullish(),
		purchased_at: Timestamp.nullish(),
		canceled_at: Timestamp.nullish(),
		refunded_at: Timestamp.nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimpleroPurchase = z.infer<typeof PurchaseSchema>;

const SubscriptionSchema = z
	.object({
		token: z.string().nullish(),
		list_id: z.number().nullish(),
		customer_id: z.number().nullish(),
		active: z.boolean().nullish(),
		confirmed: z.boolean().nullish(),
		first_activated_at: Timestamp.nullish(),
		unsubscribed_at: Timestamp.nullish(),
		suspended_at: Timestamp.nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimpleroSubscription = z.infer<typeof SubscriptionSchema>;

// ── Writable bodies ───────────────────────────────────────────────────────

/**
 * A customer's `email` and `lead_score` are the spec's required pair, so a
 * create sends both. `lead_score` replaces the score, which is why it stays
 * required here rather than being silently defaulted to 0.
 */
const customerBody = {
	first_names: z.string().nullish(),
	last_name: z.string().nullish(),
	email: z.string().describe('The address Simplero matches the contact on.'),
	alternative_emails: z.array(z.string()).nullish(),
	phone_number: z.string().nullish(),
	do_not_contact: z.boolean().optional(),
	do_not_sms: z.boolean().optional(),
	locale: z.string().nullish(),
	gdpr_consent: z.boolean().optional(),
	lead_score: z
		.number()
		.describe(
			'Setting it replaces the score. Use customers.adjustLeadScore to add to it instead.',
		),
	field_value_ids: z.array(z.number().int()).optional(),
};

const CustomerCreateInputSchema = z.object(customerBody);

export type CustomerCreateInput = z.infer<typeof CustomerCreateInputSchema>;

/** Every field optional: a PATCH only changes what it sends. */
const CustomerUpdateInputSchema = z.object({
	id: RecordId,
	...customerBody,
	email: customerBody.email.optional(),
	lead_score: customerBody.lead_score.optional(),
});

export type CustomerUpdateInput = z.infer<typeof CustomerUpdateInputSchema>;

const listBody = {
	name: z.string().nullish(),
	internal_name: z.string().nullish(),
	handle: z.string().nullish(),
	show_in_admin: z.boolean().optional(),
	require_confirmation: z.boolean().optional(),
	sender_name: z.string().nullish(),
	sender_email: z.string().nullish(),
	label_ids: z.array(z.number().int()).optional(),
};

const ListCreateInputSchema = z.object({
	...listBody,
	name: z.string().min(1),
	internal_name: z.string().min(1),
});

export type ListCreateInput = z.infer<typeof ListCreateInputSchema>;

const ListUpdateInputSchema = z.object({ id: RecordId, ...listBody });

export type ListUpdateInput = z.infer<typeof ListUpdateInputSchema>;

const tagBody = {
	name: z.string().nullish(),
	description: z.string().nullish(),
	color: z.string().nullish(),
	show_in_admin: z.boolean().optional(),
	label_ids: z.array(z.number().int()).optional(),
};

const TagCreateInputSchema = z.object({ ...tagBody, name: z.string().min(1) });

export type TagCreateInput = z.infer<typeof TagCreateInputSchema>;

const TagUpdateInputSchema = z.object({ id: RecordId, ...tagBody });

export type TagUpdateInput = z.infer<typeof TagUpdateInputSchema>;

const productBody = {
	name: z.string().nullish(),
	internal_name: z.string().nullish(),
	subtitle: z.string().nullish(),
	summary: z.string().nullish(),
	short_description: z.string().nullish(),
	long_description: z.string().nullish(),
	listing_type: z.string().nullish(),
	product_type: z.string().nullish(),
	show_in_admin: z.boolean().optional(),
	label_ids: z.array(z.number().int()).optional(),
};

const ProductCreateInputSchema = z.object({
	...productBody,
	name: z.string().min(1),
	internal_name: z.string().min(1),
});

export type ProductCreateInput = z.infer<typeof ProductCreateInputSchema>;

const ProductUpdateInputSchema = z.object({ id: RecordId, ...productBody });

export type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;

const PurchaseUpdateInputSchema = z.object({
	id: RecordId,
	email: z.string().nullish(),
	first_names: z.string().nullish(),
	last_name: z.string().nullish(),
	country_code: z.string().nullish(),
	company_name: z.string().nullish(),
	vat_no: z.string().nullish(),
	address: z.string().nullish(),
	address_2: z.string().nullish(),
	postal_code: z.string().nullish(),
	city: z.string().nullish(),
	region_code: z.string().nullish(),
	wants_marketing: z.boolean().optional(),
	wants_notifications: z.boolean().optional(),
	utm_source: z.string().nullish(),
	utm_medium: z.string().nullish(),
	utm_campaign: z.string().nullish(),
});

export type PurchaseUpdateInput = z.infer<typeof PurchaseUpdateInputSchema>;

const SubscriptionUpdateInputSchema = z.object({
	id: RecordId,
	track: z.string().nullish(),
	utm_source: z.string().nullish(),
	utm_medium: z.string().nullish(),
	utm_campaign: z.string().nullish(),
	utm_content: z.string().nullish(),
	utm_term: z.string().nullish(),
});

export type SubscriptionUpdateInput = z.infer<
	typeof SubscriptionUpdateInputSchema
>;

// ── Customer tag actions ──────────────────────────────────────────────────

/**
 * The action takes either one `tag_id` or a `tag_ids` list. Sending both is
 * ambiguous, and sending neither changes nothing, so both are rejected before
 * the request.
 */
const CustomerTagActionInputSchema = z
	.object({
		id: RecordId,
		tag_id: z.number().int().optional().describe('One tag to add or remove.'),
		tag_ids: z
			.array(z.number().int())
			.optional()
			.describe('Several tags to add or remove.'),
	})
	.superRefine((value, ctx) => {
		const given = [value.tag_id, value.tag_ids].filter(
			(entry) => entry !== undefined,
		);
		if (given.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['tag_id'],
				message: 'Send exactly one of tag_id or tag_ids.',
			});
		}
	});

export type CustomerTagActionInput = z.infer<
	typeof CustomerTagActionInputSchema
>;

const CustomerAdjustLeadScoreInputSchema = z.object({
	id: RecordId,
	value: z
		.number()
		.describe(
			'Added to the stored score, unlike customers.update which replaces it.',
		),
});

export type CustomerAdjustLeadScoreInput = z.infer<
	typeof CustomerAdjustLeadScoreInputSchema
>;

// ── Envelopes ─────────────────────────────────────────────────────────────

/** One record: `{ data: T }`. */
function oneOf<T extends z.ZodType>(schema: T) {
	return z.object({ data: schema }).loose();
}

/** A list: `{ data: T[], pagination }`. */
function pageOf<T extends z.ZodType>(schema: T) {
	return z
		.object({
			data: z.array(schema),
			pagination: PaginationSchema.nullish(),
		})
		.loose();
}

const RecordIdInputSchema = z.object({ id: RecordId });

export type RecordIdInput = z.infer<typeof RecordIdInputSchema>;

// ── Per-resource list filters ─────────────────────────────────────────────

const CustomersListInputSchema = z.object({
	...paging,
	created_at: z
		.string()
		.optional()
		.describe('A date filter such as 2026-01-01..2026-01-31.'),
	updated_at: z.string().optional(),
	first_names: z.string().optional().describe('Matches the first names.'),
	last_name: z.string().optional(),
	email: z.string().optional(),
	tag_id: z.number().int().optional(),
	segment_id: z.number().int().optional(),
	status: z
		.enum(['customers', 'leads', 'clients'])
		.optional()
		.describe('Only contacts at this stage.'),
	active: z.boolean().optional(),
	list_id: z.number().int().optional(),
	product_id: z.number().int().optional(),
});

export type CustomersListInput = z.infer<typeof CustomersListInputSchema>;

const ListsListInputSchema = z.object({ ...paging });

export type ListsListInput = z.infer<typeof ListsListInputSchema>;

const TagsListInputSchema = z.object({
	...paging,
	owner_id: z.number().int().optional(),
});

export type TagsListInput = z.infer<typeof TagsListInputSchema>;

const ProductsListInputSchema = z.object({
	...paging,
	name: z.string().optional(),
	listing_type: z.string().optional(),
	recurring: z.boolean().optional(),
});

export type ProductsListInput = z.infer<typeof ProductsListInputSchema>;

const PurchasesListInputSchema = z.object({
	...paging,
	state: z.string().optional(),
	customer_id: z.number().int().optional(),
	product_id: z.number().int().optional(),
	price_id: z.number().int().optional(),
	purchased_at: z.string().optional(),
	canceled_at: z.string().optional(),
	refunded_at: z.string().optional(),
	subscription: z.boolean().optional(),
});

export type PurchasesListInput = z.infer<typeof PurchasesListInputSchema>;

const SubscriptionsListInputSchema = z.object({
	...paging,
	state: z.string().optional(),
	list_id: z.number().int().optional(),
	tag_id: z.number().int().optional(),
	email: z.string().optional(),
	first_names: z.string().optional(),
	last_name: z.string().optional(),
	unsubscribed_at: z.string().optional(),
});

export type SubscriptionsListInput = z.infer<
	typeof SubscriptionsListInputSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SimpleroEndpointInputs = {
	customersList: CustomersListInput;
	customersGet: RecordIdInput;
	customersCreate: CustomerCreateInput;
	customersUpdate: CustomerUpdateInput;
	customersAddTag: CustomerTagActionInput;
	customersRemoveTag: CustomerTagActionInput;
	customersAdjustLeadScore: CustomerAdjustLeadScoreInput;
	listsList: ListsListInput;
	listsGet: RecordIdInput;
	listsCreate: ListCreateInput;
	listsUpdate: ListUpdateInput;
	tagsList: TagsListInput;
	tagsGet: RecordIdInput;
	tagsCreate: TagCreateInput;
	tagsUpdate: TagUpdateInput;
	productsList: ProductsListInput;
	productsGet: RecordIdInput;
	productsCreate: ProductCreateInput;
	productsUpdate: ProductUpdateInput;
	purchasesList: PurchasesListInput;
	purchasesGet: RecordIdInput;
	purchasesUpdate: PurchaseUpdateInput;
	subscriptionsList: SubscriptionsListInput;
	subscriptionsGet: RecordIdInput;
	subscriptionsUpdate: SubscriptionUpdateInput;
	subscriptionsUnsubscribe: RecordIdInput;
	subscriptionsResubscribe: RecordIdInput;
};

export type SimpleroEndpointOutputs = {
	customersList: z.infer<ReturnType<typeof pageOf<typeof CustomerSchema>>>;
	customersGet: z.infer<ReturnType<typeof oneOf<typeof CustomerSchema>>>;
	customersCreate: z.infer<ReturnType<typeof oneOf<typeof CustomerSchema>>>;
	customersUpdate: z.infer<ReturnType<typeof oneOf<typeof CustomerSchema>>>;
	customersAddTag: SimpleroActionResponse;
	customersRemoveTag: SimpleroActionResponse;
	customersAdjustLeadScore: SimpleroActionResponse;
	listsList: z.infer<ReturnType<typeof pageOf<typeof ListSchema>>>;
	listsGet: z.infer<ReturnType<typeof oneOf<typeof ListSchema>>>;
	listsCreate: z.infer<ReturnType<typeof oneOf<typeof ListSchema>>>;
	listsUpdate: z.infer<ReturnType<typeof oneOf<typeof ListSchema>>>;
	tagsList: z.infer<ReturnType<typeof pageOf<typeof TagSchema>>>;
	tagsGet: z.infer<ReturnType<typeof oneOf<typeof TagSchema>>>;
	tagsCreate: z.infer<ReturnType<typeof oneOf<typeof TagSchema>>>;
	tagsUpdate: z.infer<ReturnType<typeof oneOf<typeof TagSchema>>>;
	productsList: z.infer<ReturnType<typeof pageOf<typeof ProductSchema>>>;
	productsGet: z.infer<ReturnType<typeof oneOf<typeof ProductSchema>>>;
	productsCreate: z.infer<ReturnType<typeof oneOf<typeof ProductSchema>>>;
	productsUpdate: z.infer<ReturnType<typeof oneOf<typeof ProductSchema>>>;
	purchasesList: z.infer<ReturnType<typeof pageOf<typeof PurchaseSchema>>>;
	purchasesGet: z.infer<ReturnType<typeof oneOf<typeof PurchaseSchema>>>;
	purchasesUpdate: z.infer<ReturnType<typeof oneOf<typeof PurchaseSchema>>>;
	subscriptionsList: z.infer<
		ReturnType<typeof pageOf<typeof SubscriptionSchema>>
	>;
	subscriptionsGet: z.infer<
		ReturnType<typeof oneOf<typeof SubscriptionSchema>>
	>;
	subscriptionsUpdate: z.infer<
		ReturnType<typeof oneOf<typeof SubscriptionSchema>>
	>;
	subscriptionsUnsubscribe: SimpleroActionResponse;
	subscriptionsResubscribe: SimpleroActionResponse;
};

export const SimpleroEndpointInputSchemas = {
	customersList: CustomersListInputSchema,
	customersGet: RecordIdInputSchema,
	customersCreate: CustomerCreateInputSchema,
	customersUpdate: CustomerUpdateInputSchema,
	customersAddTag: CustomerTagActionInputSchema,
	customersRemoveTag: CustomerTagActionInputSchema,
	customersAdjustLeadScore: CustomerAdjustLeadScoreInputSchema,
	listsList: ListsListInputSchema,
	listsGet: RecordIdInputSchema,
	listsCreate: ListCreateInputSchema,
	listsUpdate: ListUpdateInputSchema,
	tagsList: TagsListInputSchema,
	tagsGet: RecordIdInputSchema,
	tagsCreate: TagCreateInputSchema,
	tagsUpdate: TagUpdateInputSchema,
	productsList: ProductsListInputSchema,
	productsGet: RecordIdInputSchema,
	productsCreate: ProductCreateInputSchema,
	productsUpdate: ProductUpdateInputSchema,
	purchasesList: PurchasesListInputSchema,
	purchasesGet: RecordIdInputSchema,
	purchasesUpdate: PurchaseUpdateInputSchema,
	subscriptionsList: SubscriptionsListInputSchema,
	subscriptionsGet: RecordIdInputSchema,
	subscriptionsUpdate: SubscriptionUpdateInputSchema,
	subscriptionsUnsubscribe: RecordIdInputSchema,
	subscriptionsResubscribe: RecordIdInputSchema,
} as const;

export const SimpleroEndpointOutputSchemas = {
	customersList: pageOf(CustomerSchema),
	customersGet: oneOf(CustomerSchema),
	customersCreate: oneOf(CustomerSchema),
	customersUpdate: oneOf(CustomerSchema),
	customersAddTag: ActionResponseSchema,
	customersRemoveTag: ActionResponseSchema,
	customersAdjustLeadScore: ActionResponseSchema,
	listsList: pageOf(ListSchema),
	listsGet: oneOf(ListSchema),
	listsCreate: oneOf(ListSchema),
	listsUpdate: oneOf(ListSchema),
	tagsList: pageOf(TagSchema),
	tagsGet: oneOf(TagSchema),
	tagsCreate: oneOf(TagSchema),
	tagsUpdate: oneOf(TagSchema),
	productsList: pageOf(ProductSchema),
	productsGet: oneOf(ProductSchema),
	productsCreate: oneOf(ProductSchema),
	productsUpdate: oneOf(ProductSchema),
	purchasesList: pageOf(PurchaseSchema),
	purchasesGet: oneOf(PurchaseSchema),
	purchasesUpdate: oneOf(PurchaseSchema),
	subscriptionsList: pageOf(SubscriptionSchema),
	subscriptionsGet: oneOf(SubscriptionSchema),
	subscriptionsUpdate: oneOf(SubscriptionSchema),
	subscriptionsUnsubscribe: ActionResponseSchema,
	subscriptionsResubscribe: ActionResponseSchema,
} as const;
