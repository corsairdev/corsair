import { z } from 'zod';

/**
 * RepairShopr pages by number and reports `meta.total_pages`. There is no page
 * size parameter on most collections; `invoices` is the exception with
 * `per_page`.
 */
const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('1-based page number.');

/**
 * The account's own custom fields, keyed by the names set in RepairShopr. The
 * UI offers text, number and checkbox fields, so a value is one of those or
 * unset; a map rather than a fixed object because the names are the account's.
 */
export const CustomFieldMapSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean()]).nullish(),
);

/** The `meta` block a collection carries. */
export const MetaSchema = z
	.object({
		total_pages: z.number().nullish(),
		total_entries: z.number().nullish(),
		per_page: z.number().nullish(),
		page: z.number().nullish(),
	})
	.loose();

export type RepairshoprMeta = z.infer<typeof MetaSchema>;

/**
 * `next_page` is derived from `meta.total_pages` and the page the caller asked
 * for. It is declared rather than added by a transform, because the docs
 * generator reads a transform's input side and would omit the field.
 */
const pagingFields = {
	meta: MetaSchema.nullish(),
	next_page: z
		.number()
		.nullable()
		.describe('The page to request next, or null on the last page.'),
	total_pages: z.number().nullable(),
	total_entries: z.number().nullable(),
};

// ── customers ─────────────────────────────────────────────────────────────

const CustomersListInputSchema = z.object({
	page: PageSchema,
	query: z.string().optional().describe('A free-text search.'),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	business_name: z.string().optional(),
	email: z.string().optional(),
	id: z.number().int().optional().describe('Only this customer id.'),
	id_not: z.number().int().optional().describe('Every customer but this id.'),
	include_disabled: z
		.boolean()
		.optional()
		.describe('Include disabled customers.'),
	sort: z
		.string()
		.optional()
		.describe(
			'A column and direction, such as `firstname ASC` or `city DESC`.',
		),
});

export type CustomersListInput = z.input<typeof CustomersListInputSchema>;

const CustomerSchema = z
	.object({
		id: z.number().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		fullname: z.string().nullish(),
		business_name: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		mobile: z.string().nullish(),
		address: z.string().nullish(),
		address_2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		// The spec types a customer's coordinates as strings, a contact's as numbers.
		latitude: z.union([z.number(), z.string()]).nullish(),
		longitude: z.union([z.number(), z.string()]).nullish(),
		notes: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		pdf_url: z.string().nullish(),
		location_name: z.string().nullish(),
		get_sms: z.boolean().nullish(),
		opt_out: z.boolean().nullish(),
		no_email: z.boolean().nullish(),
		get_billing: z.boolean().nullish(),
		get_marketing: z.boolean().nullish(),
		get_reports: z.boolean().nullish(),
		disabled: z.boolean().nullish(),
		// The account's own custom fields, each a scalar value.
		properties: CustomFieldMapSchema.nullish(),
	})
	.loose();

export type RepairshoprCustomer = z.infer<typeof CustomerSchema>;

const CustomersListResponseSchema = z.object({
	customers: z.array(CustomerSchema),
	...pagingFields,
});

export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;

const CustomersGetInputSchema = z.object({
	customer_id: z.number().int().positive(),
});

export type CustomersGetInput = z.input<typeof CustomersGetInputSchema>;

const CustomersGetResponseSchema = z.object({ customer: CustomerSchema });
export type CustomersGetResponse = z.infer<typeof CustomersGetResponseSchema>;

const CustomersWriteInputSchema = z.object({
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	business_name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	mobile: z.string().optional(),
	address: z.string().optional(),
	address_2: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zip: z.string().optional(),
	notes: z.string().optional(),
	get_sms: z.boolean().optional(),
	opt_out: z.boolean().optional(),
	no_email: z.boolean().optional(),
	get_billing: z.boolean().optional(),
	get_marketing: z.boolean().optional(),
	get_reports: z.boolean().optional(),
	tax_rate_id: z.number().int().optional(),
	notification_email: z.string().optional(),
	invoice_cc_emails: z.string().optional(),
	invoice_term_id: z.number().int().optional(),
	referred_by: z.string().optional(),
	properties: CustomFieldMapSchema.optional(),
});

export type CustomersCreateInput = z.input<typeof CustomersWriteInputSchema>;

const CustomersCreateResponseSchema = z.object({ customer: CustomerSchema });
export type CustomersCreateResponse = z.infer<
	typeof CustomersCreateResponseSchema
>;

const CustomersUpdateInputSchema = CustomersWriteInputSchema.partial().extend({
	customer_id: z.number().int().positive(),
});

export type CustomersUpdateInput = z.input<typeof CustomersUpdateInputSchema>;

const CustomersUpdateResponseSchema = z.object({ customer: CustomerSchema });
export type CustomersUpdateResponse = z.infer<
	typeof CustomersUpdateResponseSchema
>;

const CustomersDeleteInputSchema = z.object({
	customer_id: z.number().int().positive(),
});

export type CustomersDeleteInput = z.input<typeof CustomersDeleteInputSchema>;

const CustomersDeleteResponseSchema = z.object({
	success: z.boolean(),
	customer_id: z.number(),
});

export type CustomersDeleteResponse = z.infer<
	typeof CustomersDeleteResponseSchema
>;

// ── tickets ───────────────────────────────────────────────────────────────

const TicketsListInputSchema = z.object({
	page: PageSchema,
	customer_id: z.number().int().optional(),
	contact_id: z.number().int().optional(),
	number: z.string().optional(),
	status: z
		.string()
		.optional()
		.describe('The ticket status, such as `New` or `Resolved`.'),
	query: z.string().optional(),
	user_id: z.number().int().optional(),
	mine: z.boolean().optional().describe('Only the calling user’s tickets.'),
	resolved_after: z.string().optional().describe('An ISO timestamp.'),
	created_after: z.string().optional().describe('An ISO timestamp.'),
	since_updated_at: z.string().optional().describe('An ISO timestamp.'),
	parent_id: z.number().int().optional(),
});

export type TicketsListInput = z.input<typeof TicketsListInputSchema>;

const TicketSchema = z
	.object({
		id: z.number().nullish(),
		number: z.number().nullish(),
		subject: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		customer_id: z.number().nullish(),
		customer_business_then_name: z.string().nullish(),
		due_date: z.string().nullish(),
		resolved_at: z.string().nullish(),
		start_at: z.string().nullish(),
		end_at: z.string().nullish(),
		location_id: z.number().nullish(),
		location_name: z.string().nullish(),
		problem_type: z.string().nullish(),
		status: z.string().nullish(),
		ticket_type_id: z.number().nullish(),
		ticket_type_name: z.string().nullish(),
		user_id: z.number().nullish(),
		pdf_url: z.string().nullish(),
		priority: z.string().nullish(),
		billing_status: z.string().nullish(),
		tag_list: z.array(z.string()).nullish(),
		sla_name: z.string().nullish(),
		contact_id: z.number().nullish(),
		parent_id: z.number().nullish(),
		properties: CustomFieldMapSchema.nullish(),
	})
	.loose();

export type RepairshoprTicket = z.infer<typeof TicketSchema>;

const TicketsListResponseSchema = z.object({
	tickets: z.array(TicketSchema),
	...pagingFields,
});

export type TicketsListResponse = z.infer<typeof TicketsListResponseSchema>;

const TicketsGetInputSchema = z.object({
	ticket_id: z.number().int().positive(),
});

export type TicketsGetInput = z.input<typeof TicketsGetInputSchema>;

const TicketsGetResponseSchema = z.object({ ticket: TicketSchema });
export type TicketsGetResponse = z.infer<typeof TicketsGetResponseSchema>;

/**
 * Each account edits its own ticket status list, so any name the account uses is
 * accepted. RepairShopr's defaults are `New`, `In Progress`, `Resolved`,
 * `Invoiced`, `Waiting for Parts`, `Waiting on Customer`, `Scheduled` and
 * `Customer Reply`.
 */
const TicketStatusSchema = z
	.string()
	.min(1)
	.describe(
		'A status name from the account, such as `New`, `In Progress`, `Waiting for Parts` or `Resolved`.',
	);

const TicketsWriteInputSchema = z.object({
	customer_id: z
		.number()
		.int()
		.positive()
		.describe('The customer the ticket belongs to.'),
	subject: z.string().min(1).describe('The ticket subject.'),
	number: z.string().optional(),
	ticket_type_id: z.number().int().optional(),
	status: TicketStatusSchema.optional(),
	priority: z
		.enum(['Urgent', 'High', 'Medium', 'Low'])
		.optional()
		.describe("RepairShopr's four priority values."),
	problem_type: z.string().optional(),
	due_date: z.string().optional().describe('A date, as `YYYY-MM-DD`.'),
	start_at: z.string().optional(),
	end_at: z.string().optional(),
	location_id: z.number().int().optional(),
	user_id: z.number().int().optional().describe('The assigned user.'),
	contact_id: z.number().int().optional(),
	parent_id: z.number().int().optional(),
	sla_id: z.number().int().optional(),
	asset_ids: z.array(z.number().int()).optional(),
	properties: CustomFieldMapSchema.optional(),
});

export type TicketsCreateInput = z.input<typeof TicketsWriteInputSchema>;

const TicketsCreateResponseSchema = z.object({ ticket: TicketSchema });
export type TicketsCreateResponse = z.infer<typeof TicketsCreateResponseSchema>;

const TicketsUpdateInputSchema = TicketsWriteInputSchema.partial().extend({
	ticket_id: z.number().int().positive(),
});

export type TicketsUpdateInput = z.input<typeof TicketsUpdateInputSchema>;

const TicketsUpdateResponseSchema = z.object({ ticket: TicketSchema });
export type TicketsUpdateResponse = z.infer<typeof TicketsUpdateResponseSchema>;

const TicketsDeleteInputSchema = z.object({
	ticket_id: z.number().int().positive(),
});

export type TicketsDeleteInput = z.input<typeof TicketsDeleteInputSchema>;

const TicketsDeleteResponseSchema = z.object({
	success: z.boolean(),
	ticket_id: z.number().int(),
});

export type TicketsDeleteResponse = z.infer<typeof TicketsDeleteResponseSchema>;

// ── invoices ──────────────────────────────────────────────────────────────

const InvoicesListInputSchema = z.object({
	page: PageSchema,
	per_page: z
		.number()
		.int()
		.min(1)
		.max(25)
		.optional()
		.describe(
			'Invoices per page, at most 25; the one collection that accepts it.',
		),
	ticket_id: z.number().int().optional(),
	paid: z.boolean().optional(),
	unpaid: z.boolean().optional(),
	since_updated_at: z.string().optional().describe('An ISO timestamp.'),
});

export type InvoicesListInput = z.input<typeof InvoicesListInputSchema>;

const InvoiceSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		number: z.string().nullish(),
		// The spec types this as an integer; a string is accepted too.
		external_id: z.union([z.number(), z.string()]).nullish(),
		schedule_id: z.number().nullish(),
		qbsdk_external_id: z.string().nullish(),
		xero_id: z.string().nullish(),
		customer_id: z.number().nullish(),
		customer_business_then_name: z.string().nullish(),
		ticket_id: z.number().nullish(),
		location_id: z.number().nullish(),
		contact_id: z.number().nullish(),
		po_number: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		date: z.string().nullish(),
		due_date: z.string().nullish(),
		subtotal: z.string().nullish(),
		total: z.string().nullish(),
		tax: z.string().nullish(),
		verified_paid: z.boolean().nullish(),
		tech_marked_paid: z.boolean().nullish(),
		is_paid: z.boolean().nullish(),
		pdf_url: z.string().nullish(),
	})
	.loose();

export type RepairshoprInvoice = z.infer<typeof InvoiceSchema>;

const InvoicesListResponseSchema = z.object({
	invoices: z.array(InvoiceSchema),
	...pagingFields,
});

export type InvoicesListResponse = z.infer<typeof InvoicesListResponseSchema>;

const InvoicesGetInputSchema = z.object({
	invoice_id: z.number().int().positive(),
});

export type InvoicesGetInput = z.input<typeof InvoicesGetInputSchema>;

const InvoicesGetResponseSchema = z.object({ invoice: InvoiceSchema });
export type InvoicesGetResponse = z.infer<typeof InvoicesGetResponseSchema>;

// ── products ──────────────────────────────────────────────────────────────

const ProductsListInputSchema = z.object({
	page: PageSchema,
	query: z.string().optional(),
	sku: z.string().optional(),
	name: z.string().optional(),
	upc_code: z.string().optional(),
	category_id: z.number().int().optional(),
	id: z.number().int().optional(),
	id_not: z.number().int().optional(),
	sort: z
		.string()
		.optional()
		.describe('A column and direction, such as `name ASC`.'),
});

export type ProductsListInput = z.input<typeof ProductsListInputSchema>;

const ProductSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		condition: z.string().nullish(),
		price_cost: z.number().nullish(),
		price_retail: z.number().nullish(),
		price_wholesale: z.number().nullish(),
		maintain_stock: z.boolean().nullish(),
		quantity: z.number().nullish(),
		warranty: z.string().nullish(),
		sort_order: z.number().nullish(),
		reorder_at: z.number().nullish(),
		disabled: z.boolean().nullish(),
		taxable: z.boolean().nullish(),
		product_category: z.string().nullish(),
		category_path: z.string().nullish(),
		upc_code: z.string().nullish(),
		discount_percent: z.number().nullish(),
		warranty_template_id: z.number().nullish(),
		qb_item_id: z.number().nullish(),
		desired_stock_level: z.number().nullish(),
		notes: z.string().nullish(),
		tax_rate_id: z.number().nullish(),
		physical_location: z.string().nullish(),
		serialized: z.boolean().nullish(),
	})
	.loose();

export type RepairshoprProduct = z.infer<typeof ProductSchema>;

/** This collection has no `meta` block in RepairShopr's own example. */
const ProductsListResponseSchema = z.object({
	products: z.array(ProductSchema),
	meta: MetaSchema.nullish(),
	next_page: z
		.number()
		.nullable()
		.describe('The page to request next, or null on the last page.'),
	total_pages: z.number().nullable(),
});

export type ProductsListResponse = z.infer<typeof ProductsListResponseSchema>;

const ProductsGetInputSchema = z.object({
	product_id: z.number().int().positive(),
});

export type ProductsGetInput = z.input<typeof ProductsGetInputSchema>;

const ProductsGetResponseSchema = z.object({ product: ProductSchema });
export type ProductsGetResponse = z.infer<typeof ProductsGetResponseSchema>;

const ProductsWriteInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1).describe('Required when creating a product.'),
	price_cost: z.number().min(0).optional(),
	price_retail: z.number().min(0).optional(),
	price_wholesale: z.number().min(0).optional(),
	condition: z.string().optional(),
	maintain_stock: z.boolean().optional(),
	quantity: z.number().int().min(0).optional(),
	warranty: z.string().optional(),
	reorder_at: z.number().int().min(0).optional(),
	desired_stock_level: z.number().int().min(0).optional(),
	disabled: z.boolean().optional(),
	taxable: z.boolean().optional(),
	upc_code: z.string().optional(),
	tax_rate_id: z.number().int().optional(),
	notes: z.string().optional(),
	serialized: z.boolean().optional(),
	category_ids: z.array(z.number().int()).optional(),
	vendor_ids: z.array(z.number().int()).optional(),
});

export type ProductsCreateInput = z.input<typeof ProductsWriteInputSchema>;

const ProductsCreateResponseSchema = z.object({ product: ProductSchema });
export type ProductsCreateResponse = z.infer<
	typeof ProductsCreateResponseSchema
>;

const ProductsUpdateInputSchema = ProductsWriteInputSchema.partial().extend({
	product_id: z.number().int().positive(),
});

export type ProductsUpdateInput = z.input<typeof ProductsUpdateInputSchema>;

const ProductsUpdateResponseSchema = z.object({ product: ProductSchema });
export type ProductsUpdateResponse = z.infer<
	typeof ProductsUpdateResponseSchema
>;

// ── contacts and vendors ──────────────────────────────────────────────────

const ContactsListInputSchema = z.object({
	page: PageSchema,
	customer_id: z.number().int().optional(),
});

export type ContactsListInput = z.input<typeof ContactsListInputSchema>;

/**
 * A contact is a person or vendor record. RepairShopr spells the addresses
 * `address1`/`address2` here, not `address`/`address_2` as on a customer, and
 * carries `vendor_id` alongside `customer_id`.
 */
const ContactPersonSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		address1: z.string().nullish(),
		address2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		mobile: z.string().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		customer_id: z.number().nullish(),
		vendor_id: z.number().nullish(),
		account_id: z.number().nullish(),
		notes: z.string().nullish(),
		opt_out: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		properties: CustomFieldMapSchema.nullish(),
	})
	.loose();

export type RepairshoprContact = z.infer<typeof ContactPersonSchema>;

const ContactsListResponseSchema = z.object({
	contacts: z.array(ContactPersonSchema),
	...pagingFields,
});

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const VendorsListInputSchema = z.object({ page: PageSchema });

export type VendorsListInput = z.input<typeof VendorsListInputSchema>;

const VendorSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		rep_first_name: z.string().nullish(),
		rep_last_name: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		account_number: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		website: z.string().nullish(),
		notes: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type RepairshoprVendor = z.infer<typeof VendorSchema>;

const VendorsListResponseSchema = z.object({
	vendors: z.array(VendorSchema),
	...pagingFields,
});

export type VendorsListResponse = z.infer<typeof VendorsListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RepairshoprEndpointInputs = {
	customersList: CustomersListInput;
	customersGet: CustomersGetInput;
	customersCreate: CustomersCreateInput;
	customersUpdate: CustomersUpdateInput;
	customersDelete: CustomersDeleteInput;
	ticketsList: TicketsListInput;
	ticketsGet: TicketsGetInput;
	ticketsCreate: TicketsCreateInput;
	ticketsUpdate: TicketsUpdateInput;
	ticketsDelete: TicketsDeleteInput;
	invoicesList: InvoicesListInput;
	invoicesGet: InvoicesGetInput;
	productsList: ProductsListInput;
	productsGet: ProductsGetInput;
	productsCreate: ProductsCreateInput;
	productsUpdate: ProductsUpdateInput;
	contactsList: ContactsListInput;
	vendorsList: VendorsListInput;
};

export type RepairshoprEndpointOutputs = {
	customersList: CustomersListResponse;
	customersGet: CustomersGetResponse;
	customersCreate: CustomersCreateResponse;
	customersUpdate: CustomersUpdateResponse;
	customersDelete: CustomersDeleteResponse;
	ticketsList: TicketsListResponse;
	ticketsGet: TicketsGetResponse;
	ticketsCreate: TicketsCreateResponse;
	ticketsUpdate: TicketsUpdateResponse;
	ticketsDelete: TicketsDeleteResponse;
	invoicesList: InvoicesListResponse;
	invoicesGet: InvoicesGetResponse;
	productsList: ProductsListResponse;
	productsGet: ProductsGetResponse;
	productsCreate: ProductsCreateResponse;
	productsUpdate: ProductsUpdateResponse;
	contactsList: ContactsListResponse;
	vendorsList: VendorsListResponse;
};

export const RepairshoprEndpointInputSchemas = {
	customersList: CustomersListInputSchema,
	customersGet: CustomersGetInputSchema,
	customersCreate: CustomersWriteInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	customersDelete: CustomersDeleteInputSchema,
	ticketsList: TicketsListInputSchema,
	ticketsGet: TicketsGetInputSchema,
	ticketsCreate: TicketsWriteInputSchema,
	ticketsUpdate: TicketsUpdateInputSchema,
	ticketsDelete: TicketsDeleteInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesGet: InvoicesGetInputSchema,
	productsList: ProductsListInputSchema,
	productsGet: ProductsGetInputSchema,
	productsCreate: ProductsWriteInputSchema,
	productsUpdate: ProductsUpdateInputSchema,
	contactsList: ContactsListInputSchema,
	vendorsList: VendorsListInputSchema,
} as const;

export const RepairshoprEndpointOutputSchemas = {
	customersList: CustomersListResponseSchema,
	customersGet: CustomersGetResponseSchema,
	customersCreate: CustomersCreateResponseSchema,
	customersUpdate: CustomersUpdateResponseSchema,
	customersDelete: CustomersDeleteResponseSchema,
	ticketsList: TicketsListResponseSchema,
	ticketsGet: TicketsGetResponseSchema,
	ticketsCreate: TicketsCreateResponseSchema,
	ticketsUpdate: TicketsUpdateResponseSchema,
	ticketsDelete: TicketsDeleteResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesGet: InvoicesGetResponseSchema,
	productsList: ProductsListResponseSchema,
	productsGet: ProductsGetResponseSchema,
	productsCreate: ProductsCreateResponseSchema,
	productsUpdate: ProductsUpdateResponseSchema,
	contactsList: ContactsListResponseSchema,
	vendorsList: VendorsListResponseSchema,
} as const;
