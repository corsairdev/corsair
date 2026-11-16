import { z } from 'zod';

// Inputs use TaxJar's own parameter names. Outputs are `.loose()` and their
// optional fields nullish. Two shapes are load-bearing here:
//
// - Money and tax rates arrive as **strings** on transactions and rates
//   (`"16.5"`, `"0.0625"`), but as numbers inside the `taxes` answer. Each
//   schema accepts the form that route actually sends.
// - `shipping` is required on order and refund transactions even when it is
//   zero, which the docs mark required in the parameter table.
//
// Field reference: https://developers.taxjar.com/api/reference/

/** A money amount: a number, or the decimal string transactions send. */
const MoneySchema = z.union([z.number(), z.string()]);
/** A tax rate: a number, or the decimal string the rates route sends. */
const RateSchema = z.union([z.number(), z.string()]);

const ZipSchema = z
	.string()
	.min(1)
	.describe('A postal code, 5 digits or ZIP+4.');

// Ids go into the path encoded; `.` and `..` survive encoding as dot
// segments, which would change the route.
const notDotSegment = (value: string) => value !== '.' && value !== '..';

const TransactionIdSchema = z
	.string()
	.min(1)
	.refine(notDotSegment, 'Not a valid transaction ID.')
	.describe('The unique transaction ID you assigned.');

const CustomerIdSchema = z
	.string()
	.min(1)
	.refine(notDotSegment, 'Not a valid customer ID.')
	.describe('The unique customer ID you assigned.');

const ProviderSchema = z
	.string()
	.optional()
	.describe(
		'The source the transaction came from, such as api or pos. Defaults to api; pass the one it was created with.',
	);

const IsoDateSchema = z
	.string()
	.min(1)
	.describe(
		'A date as "YYYY/MM/DD" or "YYYY-MM-DD". TaxJar documents both and accepts either.',
	);

/**
 * The address fields shared by rates, taxes, validate and transactions. TaxJar
 * marks `country`, `zip` and `state` required on a US address; the others are
 * optional and only improve accuracy.
 */
const AddressFields = {
	country: z.string().optional().describe('Two-letter ISO country code.'),
	zip: ZipSchema.optional(),
	state: z.string().optional().describe('Two-letter ISO state code.'),
	city: z.string().optional(),
	street: z.string().optional(),
} as const;

// ── categories ────────────────────────────────────────────────────────────

export const CategoriesInputSchema = z.object({});

export type CategoriesInput = z.infer<typeof CategoriesInputSchema>;

const CategorySchema = z
	.object({
		name: z.string().nullish(),
		product_tax_code: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();

/** `data.categories`, not a bare array. */
export const CategoriesResponseSchema = z
	.object({ categories: z.array(CategorySchema) })
	.loose();

export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

// ── rates ─────────────────────────────────────────────────────────────────

export const RatesGetInputSchema = z.object({
	zip: ZipSchema.describe('The postal code to read rates for.'),
	country: AddressFields.country,
	state: AddressFields.state,
	city: AddressFields.city,
	street: AddressFields.street.describe(
		'A street address, which improves rooftop accuracy.',
	),
});

export type RatesGetInput = z.infer<typeof RatesGetInputSchema>;

// Every rate is a decimal string, e.g. "0.0625".
const RateDetailSchema = z
	.object({
		zip: z.string().nullish(),
		country: z.string().nullish(),
		country_rate: RateSchema.nullish(),
		state: z.string().nullish(),
		state_rate: RateSchema.nullish(),
		county: z.string().nullish(),
		county_rate: RateSchema.nullish(),
		city: z.string().nullish(),
		city_rate: RateSchema.nullish(),
		combined_district_rate: RateSchema.nullish(),
		combined_rate: RateSchema.nullish(),
		freight_taxable: z.boolean().nullish(),
	})
	.loose();

export const RatesGetResponseSchema = z
	.object({ rate: RateDetailSchema })
	.loose();

export type RatesGetResponse = z.infer<typeof RatesGetResponseSchema>;

// ── nexus ─────────────────────────────────────────────────────────────────

export const NexusRegionsInputSchema = z.object({});

export type NexusRegionsInput = z.infer<typeof NexusRegionsInputSchema>;

const NexusRegionSchema = z
	.object({
		country_code: z.string().nullish(),
		country: z.string().nullish(),
		region_code: z.string().nullish(),
		region: z.string().nullish(),
	})
	.loose();

export const NexusRegionsResponseSchema = z
	.object({ regions: z.array(NexusRegionSchema) })
	.loose();

export type NexusRegionsResponse = z.infer<typeof NexusRegionsResponseSchema>;

// ── summary rates ─────────────────────────────────────────────────────────

export const SummaryRatesInputSchema = z.object({});

export type SummaryRatesInput = z.infer<typeof SummaryRatesInputSchema>;

const SummaryRateSchema = z
	.object({
		country_code: z.string().nullish(),
		country: z.string().nullish(),
		region_code: z.string().nullish(),
		region: z.string().nullish(),
		minimum_rate: z
			.object({ label: z.string().nullish(), rate: RateSchema.nullish() })
			.loose()
			.nullish(),
		average_rate: z
			.object({ label: z.string().nullish(), rate: RateSchema.nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export const SummaryRatesResponseSchema = z
	.object({ summary_rates: z.array(SummaryRateSchema) })
	.loose();

export type SummaryRatesResponse = z.infer<typeof SummaryRatesResponseSchema>;

// ── address validation ────────────────────────────────────────────────────

export const AddressesValidateInputSchema = z.object({
	country: z.string().min(1).describe('Two-letter ISO country code.'),
	state: z.string().optional().describe('Two-letter ISO state code.'),
	zip: ZipSchema.optional(),
	city: z.string().optional(),
	street: z
		.string()
		.optional()
		.describe('The street address, which is the part validation rewrites.'),
});

export type AddressesValidateInput = z.infer<
	typeof AddressesValidateInputSchema
>;

// TaxJar can answer with more than one match, so this is always an array.
const ValidatedAddressSchema = z
	.object({
		zip: z.string().nullish(),
		street: z.string().nullish(),
		state: z.string().nullish(),
		country: z.string().nullish(),
		city: z.string().nullish(),
	})
	.loose();

export const AddressesValidateResponseSchema = z
	.object({ addresses: z.array(ValidatedAddressSchema) })
	.loose();

export type AddressesValidateResponse = z.infer<
	typeof AddressesValidateResponseSchema
>;

// ── taxes ─────────────────────────────────────────────────────────────────

const NexusAddressSchema = z
	.object({
		id: z
			.string()
			.optional()
			.describe('An identifier for this nexus location.'),
		country: z.string(),
		zip: ZipSchema.optional(),
		state: z.string().optional(),
		city: z.string().optional(),
		street: z.string().optional(),
	})
	.loose();

const TaxLineItemSchema = z
	.object({
		id: z.string().optional().describe('A line item identifier.'),
		quantity: z.number().int().min(1).optional(),
		product_tax_code: z
			.string()
			.optional()
			.describe('A product tax code from `categories.list`.'),
		unit_price: z.number().optional(),
		discount: z.number().optional().describe('A total discount, not per unit.'),
		description: z.string().optional(),
	})
	.loose();

export const TaxesCalculateInputSchema = z.object({
	from_country: z.string().optional(),
	from_zip: ZipSchema.optional(),
	from_state: z.string().optional(),
	from_city: z.string().optional(),
	from_street: z.string().optional(),
	to_country: z.string().min(1).describe('The destination country.'),
	to_zip: ZipSchema.optional(),
	to_state: z.string().optional(),
	to_city: z.string().optional(),
	to_street: z.string().optional(),
	// The docs allow either a single amount or line items, and compute the
	// total from the line items when both are sent.
	amount: z
		.number()
		.optional()
		.describe('The order amount, excluding shipping.'),
	shipping: z.number().optional().describe('The shipping charge.'),
	customer_id: CustomerIdSchema.optional(),
	exemption_type: z
		.enum(['wholesale', 'government', 'marketplace', 'other', 'non_exempt'])
		.optional(),
	nexus_addresses: z.array(NexusAddressSchema).optional(),
	line_items: z.array(TaxLineItemSchema).optional(),
});

export type TaxesCalculateInput = z.input<typeof TaxesCalculateInputSchema>;

/**
 * The `taxes` answer sends its amounts as numbers, unlike the transaction
 * routes, so this schema is typed as numbers but still accepts a string in
 * case TaxJar serializes one of the nested breakdowns as text.
 */
const TaxJurisdictionsSchema = z
	.object({
		country: z.string().nullish(),
		state: z.string().nullish(),
		county: z.string().nullish(),
		city: z.string().nullish(),
	})
	.loose();

const TaxBreakdownItemSchema = z
	.object({
		// The sandbox and stored transactions answer numeric line item ids.
		id: z.union([z.string(), z.number()]).nullish(),
		taxable_amount: MoneySchema.nullish(),
		tax_collectable: MoneySchema.nullish(),
		combined_tax_rate: RateSchema.nullish(),
		state_taxable_amount: MoneySchema.nullish(),
		state_tax_rate: RateSchema.nullish(),
		state_tax_collectable: MoneySchema.nullish(),
		county_taxable_amount: MoneySchema.nullish(),
		county_tax_rate: RateSchema.nullish(),
		county_tax_collectable: MoneySchema.nullish(),
		city_taxable_amount: MoneySchema.nullish(),
		city_tax_rate: RateSchema.nullish(),
		city_tax_collectable: MoneySchema.nullish(),
		special_district_taxable_amount: MoneySchema.nullish(),
		special_tax_rate: RateSchema.nullish(),
		special_district_tax_collectable: MoneySchema.nullish(),
	})
	.loose();

const TaxBreakdownSchema = z
	.object({
		taxable_amount: MoneySchema.nullish(),
		tax_collectable: MoneySchema.nullish(),
		combined_tax_rate: RateSchema.nullish(),
		state_taxable_amount: MoneySchema.nullish(),
		state_tax_rate: RateSchema.nullish(),
		state_tax_collectable: MoneySchema.nullish(),
		county_taxable_amount: MoneySchema.nullish(),
		county_tax_rate: RateSchema.nullish(),
		county_tax_collectable: MoneySchema.nullish(),
		city_taxable_amount: MoneySchema.nullish(),
		city_tax_rate: RateSchema.nullish(),
		city_tax_collectable: MoneySchema.nullish(),
		special_district_taxable_amount: MoneySchema.nullish(),
		special_tax_rate: RateSchema.nullish(),
		special_district_tax_collectable: MoneySchema.nullish(),
		line_items: z.array(TaxBreakdownItemSchema).nullish(),
	})
	.loose();

const TaxSchema = z
	.object({
		order_total_amount: MoneySchema.nullish(),
		shipping: MoneySchema.nullish(),
		taxable_amount: MoneySchema.nullish(),
		amount_to_collect: MoneySchema.nullish(),
		rate: RateSchema.nullish(),
		has_nexus: z.boolean().nullish(),
		freight_taxable: z.boolean().nullish(),
		// `destination`, `origin` or `mixed`.
		tax_source: z.string().nullish(),
		jurisdictions: TaxJurisdictionsSchema.nullish(),
		breakdown: TaxBreakdownSchema.nullish(),
	})
	.loose();

export const TaxesCalculateResponseSchema = z
	.object({ tax: TaxSchema })
	.loose();

export type TaxesCalculateResponse = z.infer<
	typeof TaxesCalculateResponseSchema
>;

// ── order transactions ────────────────────────────────────────────────────

const LineItemInputSchema = z
	.object({
		id: z.string().optional().describe('The line item ID.'),
		quantity: z.number().int().min(1).optional(),
		product_identifier: z.string().optional(),
		product_tax_code: z
			.string()
			.optional()
			.describe('A product tax code from `categories.list`.'),
		description: z.string().optional(),
		unit_price: z.number().optional(),
		discount: z.number().optional(),
		sales_tax: z.number().optional(),
	})
	.loose();

/**
 * The fields an order or refund shares. On a **create** TaxJar requires
 * `to_country` and `shipping`; on an **update** only the fields being changed
 * are sent, so both are optional there. The create schemas tighten them.
 */
const TransactionBodyShape = {
	from_country: z.string().optional(),
	from_zip: ZipSchema.optional(),
	from_state: z.string().optional(),
	from_city: z.string().optional(),
	from_street: z.string().optional(),
	to_country: z.string().min(1).optional().describe('The destination country.'),
	to_zip: ZipSchema.optional(),
	to_state: z.string().optional(),
	to_city: z.string().optional(),
	to_street: z.string().optional(),
	amount: z
		.number()
		.optional()
		.describe(
			'The total amount of the order including shipping, excluding sales tax.',
		),
	// Required by TaxJar on a create even when it is 0.
	shipping: z
		.number()
		.optional()
		.describe(
			'The shipping charge. TaxJar requires this field on a create, even as 0.',
		),
	customer_id: CustomerIdSchema.optional(),
	exemption_type: z
		.enum(['wholesale', 'government', 'marketplace', 'other', 'non_exempt'])
		.optional(),
	line_items: z.array(LineItemInputSchema).optional(),
} as const;

/**
 * On a create, TaxJar refuses the request without these two, so they are
 * required here rather than left to a failed API call.
 */
const TransactionCreateShape = {
	...TransactionBodyShape,
	to_country: z.string().min(1).describe('The destination country.'),
	shipping: z
		.number()
		.describe('The shipping charge. TaxJar requires this field, even as 0.'),
} as const;

export const OrdersListInputSchema = z.object({
	transaction_date: IsoDateSchema.optional(),
	from_transaction_date: IsoDateSchema.optional(),
	to_transaction_date: IsoDateSchema.optional(),
	provider: z
		.string()
		.optional()
		.describe('Where the transactions were recorded. Defaults to "api".'),
});

export type OrdersListInput = z.infer<typeof OrdersListInputSchema>;

export const TransactionIdsResponseSchema = z
	.object({ orders: z.array(z.string()) })
	.loose();

export type OrdersListResponse = z.infer<typeof TransactionIdsResponseSchema>;

const TransactionLineItemOutputSchema = z
	.object({
		// A stored transaction answers numeric line item ids (seen live).
		id: z.union([z.string(), z.number()]).nullish(),
		quantity: z.number().nullish(),
		product_identifier: z.string().nullish(),
		product_tax_code: z.string().nullish(),
		description: z.string().nullish(),
		// Transaction amounts are decimal strings, e.g. "15.0".
		unit_price: MoneySchema.nullish(),
		discount: MoneySchema.nullish(),
		sales_tax: MoneySchema.nullish(),
	})
	.loose();

export const OrderTransactionSchema = z
	.object({
		transaction_id: z.string(),
		user_id: z.number().nullish(),
		transaction_date: z.string().nullish(),
		transaction_reference_id: z.string().nullish(),
		provider: z.string().nullish(),
		from_country: z.string().nullish(),
		from_zip: z.string().nullish(),
		from_state: z.string().nullish(),
		from_city: z.string().nullish(),
		from_street: z.string().nullish(),
		to_country: z.string().nullish(),
		to_zip: z.string().nullish(),
		to_state: z.string().nullish(),
		to_city: z.string().nullish(),
		to_street: z.string().nullish(),
		amount: MoneySchema.nullish(),
		shipping: MoneySchema.nullish(),
		sales_tax: MoneySchema.nullish(),
		customer_id: z.string().nullish(),
		exemption_type: z.string().nullish(),
		line_items: z.array(TransactionLineItemOutputSchema).nullish(),
	})
	.loose();

export type TaxJarOrderTransaction = z.infer<typeof OrderTransactionSchema>;

const OrderTransactionResponseSchema = z
	.object({ order: OrderTransactionSchema })
	.loose();

export type OrderTransactionResponse = z.infer<
	typeof OrderTransactionResponseSchema
>;

export const OrdersCreateInputSchema = z.object({
	...TransactionCreateShape,
	transaction_id: TransactionIdSchema,
	transaction_date: IsoDateSchema,
	provider: z.string().optional(),
	sales_tax: z.number().optional().describe('The sales tax collected.'),
});

export type OrdersCreateInput = z.input<typeof OrdersCreateInputSchema>;

export const OrdersGetInputSchema = z.object({
	transactionId: TransactionIdSchema,
	provider: ProviderSchema,
});

export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;

export const OrdersUpdateInputSchema = z.object({
	transactionId: TransactionIdSchema,
	provider: ProviderSchema,
	sales_tax: z.number().optional().describe('The sales tax collected.'),
	transaction_date: IsoDateSchema.optional(),
	...TransactionBodyShape,
});

export type OrdersUpdateInput = z.input<typeof OrdersUpdateInputSchema>;

export const OrdersRemoveInputSchema = z.object({
	transactionId: TransactionIdSchema,
	provider: ProviderSchema,
});

export type OrdersRemoveInput = z.infer<typeof OrdersRemoveInputSchema>;

// ── refund transactions ───────────────────────────────────────────────────

export const RefundsListInputSchema = z.object({
	transaction_date: IsoDateSchema.optional(),
	from_transaction_date: IsoDateSchema.optional(),
	to_transaction_date: IsoDateSchema.optional(),
	provider: z.string().optional(),
});

export type RefundsListInput = z.infer<typeof RefundsListInputSchema>;

export const RefundIdsResponseSchema = z
	.object({ refunds: z.array(z.string()) })
	.loose();

export type RefundsListResponse = z.infer<typeof RefundIdsResponseSchema>;

export const RefundTransactionSchema = z
	.object({
		transaction_id: z.string(),
		transaction_reference_id: z.string().nullish(),
		user_id: z.number().nullish(),
		transaction_date: z.string().nullish(),
		provider: z.string().nullish(),
		from_country: z.string().nullish(),
		from_zip: z.string().nullish(),
		from_state: z.string().nullish(),
		from_city: z.string().nullish(),
		from_street: z.string().nullish(),
		to_country: z.string().nullish(),
		to_zip: z.string().nullish(),
		to_state: z.string().nullish(),
		to_city: z.string().nullish(),
		to_street: z.string().nullish(),
		amount: MoneySchema.nullish(),
		shipping: MoneySchema.nullish(),
		sales_tax: MoneySchema.nullish(),
		line_items: z.array(TransactionLineItemOutputSchema).nullish(),
	})
	.loose();

export type TaxJarRefundTransaction = z.infer<typeof RefundTransactionSchema>;

const RefundTransactionResponseSchema = z
	.object({ refund: RefundTransactionSchema })
	.loose();

export type RefundTransactionResponse = z.infer<
	typeof RefundTransactionResponseSchema
>;

export const RefundsCreateInputSchema = z.object({
	...TransactionCreateShape,
	transaction_id: TransactionIdSchema,
	// A refund names the order it refunds, which the docs send and the
	// response returns.
	transaction_reference_id: z
		.string()
		.optional()
		.describe('The transaction_id of the order this refund applies to.'),
	transaction_date: IsoDateSchema,
	provider: z.string().optional(),
	sales_tax: z.number().optional(),
});

export type RefundsCreateInput = z.input<typeof RefundsCreateInputSchema>;

export const RefundsGetInputSchema = z.object({
	transactionId: TransactionIdSchema,
	provider: ProviderSchema,
});

export type RefundsGetInput = z.infer<typeof RefundsGetInputSchema>;

export const RefundsUpdateInputSchema = z.object({
	transactionId: TransactionIdSchema,
	provider: ProviderSchema,
	sales_tax: z.number().optional().describe('The sales tax collected.'),
	transaction_date: IsoDateSchema.optional(),
	transaction_reference_id: z.string().optional(),
	...TransactionBodyShape,
});

export type RefundsUpdateInput = z.input<typeof RefundsUpdateInputSchema>;

export const RefundsRemoveInputSchema = z.object({
	transactionId: TransactionIdSchema,
	provider: ProviderSchema,
});

export type RefundsRemoveInput = z.infer<typeof RefundsRemoveInputSchema>;

// ── customers ─────────────────────────────────────────────────────────────

export const CustomersListInputSchema = z.object({});

export type CustomersListInput = z.infer<typeof CustomersListInputSchema>;

export const CustomerIdsResponseSchema = z
	.object({ customers: z.array(z.string()) })
	.loose();

export type CustomersListResponse = z.infer<typeof CustomerIdsResponseSchema>;

const ExemptRegionSchema = z
	.object({ country: z.string().nullish(), state: z.string().nullish() })
	.loose();

export const CustomerSchema = z
	.object({
		customer_id: z.string(),
		exemption_type: z.string().nullish(),
		exempt_regions: z.array(ExemptRegionSchema).nullish(),
		name: z.string().nullish(),
		country: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		city: z.string().nullish(),
		street: z.string().nullish(),
	})
	.loose();

export type TaxJarCustomer = z.infer<typeof CustomerSchema>;

export const CustomerResponseSchema = z
	.object({ customer: CustomerSchema })
	.loose();

export type CustomerResponse = z.infer<typeof CustomerResponseSchema>;

const CustomerBodyShape = {
	exemption_type: z
		.enum(['wholesale', 'government', 'marketplace', 'other', 'non_exempt'])
		.describe('The exemption kind.'),
	exempt_regions: z
		.array(
			z.object({ country: z.string(), state: z.string().optional() }).loose(),
		)
		.optional()
		.describe(
			'The regions the exemption covers. Omit it to exempt every region.',
		),
	name: z.string().optional(),
	country: z.string().optional(),
	state: z.string().optional(),
	zip: ZipSchema.optional(),
	city: z.string().optional(),
	street: z.string().optional(),
} as const;

export const CustomersCreateInputSchema = z.object({
	...CustomerBodyShape,
	customer_id: CustomerIdSchema,
});

export type CustomersCreateInput = z.input<typeof CustomersCreateInputSchema>;

export const CustomersGetInputSchema = z.object({
	customerId: CustomerIdSchema,
});

export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;

export const CustomersUpdateInputSchema = z.object({
	customerId: CustomerIdSchema,
	...CustomerBodyShape,
});

export type CustomersUpdateInput = z.input<typeof CustomersUpdateInputSchema>;

export const CustomersRemoveInputSchema = z.object({
	customerId: CustomerIdSchema,
});

export type CustomersRemoveInput = z.infer<typeof CustomersRemoveInputSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type TaxJarEndpointInputs = {
	categoriesList: CategoriesInput;
	ratesGet: RatesGetInput;
	nexusRegionsList: NexusRegionsInput;
	summaryRatesList: SummaryRatesInput;
	addressesValidate: AddressesValidateInput;
	taxesCalculate: TaxesCalculateInput;
	ordersList: OrdersListInput;
	ordersCreate: OrdersCreateInput;
	ordersGet: OrdersGetInput;
	ordersUpdate: OrdersUpdateInput;
	ordersRemove: OrdersRemoveInput;
	refundsList: RefundsListInput;
	refundsCreate: RefundsCreateInput;
	refundsGet: RefundsGetInput;
	refundsUpdate: RefundsUpdateInput;
	refundsRemove: RefundsRemoveInput;
	customersList: CustomersListInput;
	customersCreate: CustomersCreateInput;
	customersGet: CustomersGetInput;
	customersUpdate: CustomersUpdateInput;
	customersRemove: CustomersRemoveInput;
};

export type TaxJarEndpointOutputs = {
	categoriesList: CategoriesResponse;
	ratesGet: RatesGetResponse;
	nexusRegionsList: NexusRegionsResponse;
	summaryRatesList: SummaryRatesResponse;
	addressesValidate: AddressesValidateResponse;
	taxesCalculate: TaxesCalculateResponse;
	ordersList: OrdersListResponse;
	ordersCreate: OrderTransactionResponse;
	ordersGet: OrderTransactionResponse;
	ordersUpdate: OrderTransactionResponse;
	ordersRemove: { success: true };
	refundsList: RefundsListResponse;
	refundsCreate: RefundTransactionResponse;
	refundsGet: RefundTransactionResponse;
	refundsUpdate: RefundTransactionResponse;
	refundsRemove: { success: true };
	customersList: CustomersListResponse;
	customersCreate: CustomerResponse;
	customersGet: CustomerResponse;
	customersUpdate: CustomerResponse;
	customersRemove: { success: true };
};

export const TaxJarEndpointInputSchemas = {
	categoriesList: CategoriesInputSchema,
	ratesGet: RatesGetInputSchema,
	nexusRegionsList: NexusRegionsInputSchema,
	summaryRatesList: SummaryRatesInputSchema,
	addressesValidate: AddressesValidateInputSchema,
	taxesCalculate: TaxesCalculateInputSchema,
	ordersList: OrdersListInputSchema,
	ordersCreate: OrdersCreateInputSchema,
	ordersGet: OrdersGetInputSchema,
	ordersUpdate: OrdersUpdateInputSchema,
	ordersRemove: OrdersRemoveInputSchema,
	refundsList: RefundsListInputSchema,
	refundsCreate: RefundsCreateInputSchema,
	refundsGet: RefundsGetInputSchema,
	refundsUpdate: RefundsUpdateInputSchema,
	refundsRemove: RefundsRemoveInputSchema,
	customersList: CustomersListInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersGet: CustomersGetInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	customersRemove: CustomersRemoveInputSchema,
} as const;

export { OrderTransactionResponseSchema, RefundTransactionResponseSchema };

export const TaxJarEndpointOutputSchemas = {
	categoriesList: CategoriesResponseSchema,
	ratesGet: RatesGetResponseSchema,
	nexusRegionsList: NexusRegionsResponseSchema,
	summaryRatesList: SummaryRatesResponseSchema,
	addressesValidate: AddressesValidateResponseSchema,
	taxesCalculate: TaxesCalculateResponseSchema,
	ordersList: TransactionIdsResponseSchema,
	ordersCreate: OrderTransactionResponseSchema,
	ordersGet: OrderTransactionResponseSchema,
	ordersUpdate: OrderTransactionResponseSchema,
	ordersRemove: z.object({ success: z.literal(true) }),
	refundsList: RefundIdsResponseSchema,
	refundsCreate: RefundTransactionResponseSchema,
	refundsGet: RefundTransactionResponseSchema,
	refundsUpdate: RefundTransactionResponseSchema,
	refundsRemove: z.object({ success: z.literal(true) }),
	customersList: CustomerIdsResponseSchema,
	customersCreate: CustomerResponseSchema,
	customersGet: CustomerResponseSchema,
	customersUpdate: CustomerResponseSchema,
	customersRemove: z.object({ success: z.literal(true) }),
} as const;

/**
 * A delete answers the record it removed, with most fields nulled, under the
 * resource's key. The plugin checks that the provider named the record before
 * reporting success.
 */
export const OrderDeletedSchema = z.object({
	order: z.object({ transaction_id: z.string() }).loose(),
});
export const RefundDeletedSchema = z.object({
	refund: z.object({ transaction_id: z.string() }).loose(),
});
export const CustomerDeletedSchema = z.object({
	customer: z.object({ customer_id: z.string() }).loose(),
});
