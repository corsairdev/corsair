import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

const LIST_META_SCHEMA = z
	.object({
		current_page: z.number().nullish().describe('Page returned'),
		next_page: z
			.number()
			.nullish()
			.describe('Next page number; null when this is the last page'),
		prev_page: z
			.number()
			.nullish()
			.describe('Previous page number; null on the first page'),
		total_pages: z.number().nullish().describe('Total number of pages'),
		total_count: z
			.number()
			.nullish()
			.describe('Total number of records across pages'),
	})
	.loose();

/** Wraps a paged result list in the documented { data, meta } envelope. */
function pagedOutput<Item extends z.ZodType>(item: Item, label: string) {
	return z
		.object({
			data: z.array(item).describe(`${label} on this page`),
			meta: LIST_META_SCHEMA,
		})
		.loose();
}

const pagingParams = {
	page: z.number().int().min(1).optional().describe('Page number'),
	per_page: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Records per page; default 20, maximum 100'),
};

// ── user ───────────────────────────────────────────────────────────────────

export const UserSchema = z
	.object({
		id: z.number().describe('User id'),
		display_name: z.string().nullish().describe('Display name'),
		email: z.string().nullish().describe('Email address'),
	})
	.loose()
	.describe('The authenticated Payhere user');
export type User = z.infer<typeof UserSchema>;

export const GetUserInputSchema = z
	.object({})
	.describe('Input for reading the authenticated user (none)');
export type GetUserInput = z.infer<typeof GetUserInputSchema>;

export const GetUserOutputSchema = z
	.object({ data: UserSchema })
	.loose()
	.describe('The authenticated user');
export type GetUserOutput = z.infer<typeof GetUserOutputSchema>;

// ── company ────────────────────────────────────────────────────────────────

export const CompanySchema = z
	.object({
		id: z.number().describe('Company id'),
		name: z.string().nullish().describe('Company name'),
		legal_name: z.string().nullish().describe('Legal company name'),
		slug: z.string().nullish().describe('Company slug used in payment links'),
		country_code: z.string().nullish().describe('Two-letter country code'),
		currency: z.string().nullish().describe('Default currency'),
		stripe_connected: z
			.boolean()
			.nullish()
			.describe('Whether Stripe is connected'),
		gocardless_connected: z
			.boolean()
			.nullish()
			.describe('Whether GoCardless is connected'),
	})
	.loose()
	.describe('The Payhere company of the authenticated user');
export type Company = z.infer<typeof CompanySchema>;

export const GetCompanyInputSchema = z
	.object({})
	.describe('Input for reading the current company (none)');
export type GetCompanyInput = z.infer<typeof GetCompanyInputSchema>;

export const GetCompanyOutputSchema = z
	.object({ data: CompanySchema })
	.loose()
	.describe('The company of the authenticated user');
export type GetCompanyOutput = z.infer<typeof GetCompanyOutputSchema>;

export const GetCompanyStatsInputSchema = z
	.object({})
	.describe('Input for reading the company stats (none)');
export type GetCompanyStatsInput = z.infer<typeof GetCompanyStatsInputSchema>;

export const CompanyStatsSchema = z
	.object({
		currency: z.string().describe('Currency the stats are reported in'),
		payments_last_30: z.number().describe('Payment volume of the last 30 days'),
		payments_comparison: z
			.number()
			.describe('Payment volume of the 30-60 days before, for comparison'),
		subscribers_last_30: z
			.number()
			.describe('New subscribers of the last 30 days'),
		subscribers_comparison: z
			.number()
			.describe('New subscribers of the 30-60 days before, for comparison'),
		payments_all_time: z.number().describe('Payment volume across all time'),
	})
	.loose()
	.describe('Payment stats for the last 30 days');
export type CompanyStats = z.infer<typeof CompanyStatsSchema>;

export const GetCompanyStatsOutputSchema = CompanyStatsSchema;
export type GetCompanyStatsOutput = z.infer<typeof GetCompanyStatsOutputSchema>;

// ── customers ──────────────────────────────────────────────────────────────

export const CustomerSchema = z
	.object({
		id: z.number().describe('Customer id'),
		name: z.string().nullish().describe('Customer name'),
		email: z.string().nullish().describe('Customer email address'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		updated_at: z.string().nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('A Payhere customer');
export type Customer = z.infer<typeof CustomerSchema>;

export const ListCustomersInputSchema = z
	.object({ ...pagingParams })
	.describe('Query parameters for listing customers');
export type ListCustomersInput = z.infer<typeof ListCustomersInputSchema>;

export const ListCustomersOutputSchema = pagedOutput(
	CustomerSchema,
	'Customers',
).describe('A page of customers, most recent first');
export type ListCustomersOutput = z.infer<typeof ListCustomersOutputSchema>;

export const GetCustomerInputSchema = z
	.object({ customerId: z.number().int().describe('Customer id') })
	.describe('Input for reading one customer');
export type GetCustomerInput = z.infer<typeof GetCustomerInputSchema>;

export const GetCustomerOutputSchema = z
	.object({
		data: CustomerSchema.extend({
			subscriptions: z
				.array(z.object({}).loose())
				.nullish()
				.describe('The customer subscriptions'),
			payments: z
				.array(z.object({}).loose())
				.nullish()
				.describe('The customer payment history'),
		}),
	})
	.loose()
	.describe('The customer with their subscriptions and payment history');
export type GetCustomerOutput = z.infer<typeof GetCustomerOutputSchema>;

// ── payments ───────────────────────────────────────────────────────────────

export const PaymentSchema = z
	.object({
		id: z.number().describe('Payment id'),
		hashid: z.string().nullish().describe('Public payment hash id'),
		reference: z.string().nullish().describe('Payment reference'),
		amount: z
			.number()
			.nullish()
			.describe('Payment amount in the payment currency'),
		currency: z.string().nullish().describe('Payment currency'),
		refund_amount: z.number().nullish().describe('Amount refunded so far'),
		card_brand: z.string().nullish().describe('Card brand, e.g. visa'),
		status: z
			.string()
			.nullish()
			.describe('Payment status, e.g. paid, part_refund, refunded'),
		success: z.boolean().nullish().describe('Whether the payment succeeded'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A Payhere payment');
export type Payment = z.infer<typeof PaymentSchema>;

export const ListPaymentsInputSchema = z
	.object({ ...pagingParams })
	.describe('Query parameters for listing payments');
export type ListPaymentsInput = z.infer<typeof ListPaymentsInputSchema>;

export const ListPaymentsOutputSchema = pagedOutput(
	PaymentSchema,
	'Payments',
).describe('A page of payments, most recent first');
export type ListPaymentsOutput = z.infer<typeof ListPaymentsOutputSchema>;

// ── plans ──────────────────────────────────────────────────────────────────

export const PlanSchema = z
	.object({
		id: z.number().describe('Plan id'),
		payment_type: z
			.string()
			.nullish()
			.describe('recurring, donation or one-time payment type'),
		name: z.string().nullish().describe('Plan name'),
		description: z.string().nullish().describe('Plan description'),
		price: z.number().nullish().describe('Plan price'),
		price_in_cents: z.number().nullish().describe('Plan price in cents'),
		currency: z.string().nullish().describe('Plan currency'),
		slug: z.string().nullish().describe('Plan slug used in its payment link'),
		billing_interval: z
			.string()
			.nullish()
			.describe('Billing interval, e.g. month'),
		hidden: z.boolean().nullish().describe('Whether the plan is hidden'),
	})
	.loose()
	.describe('A Payhere payment plan');
export type Plan = z.infer<typeof PlanSchema>;

export const ListPlansInputSchema = z
	.object({ ...pagingParams })
	.describe('Query parameters for listing plans');
export type ListPlansInput = z.infer<typeof ListPlansInputSchema>;

export const ListPlansOutputSchema = pagedOutput(PlanSchema, 'Plans').describe(
	'A page of payment plans',
);
export type ListPlansOutput = z.infer<typeof ListPlansOutputSchema>;

// ── subscriptions ──────────────────────────────────────────────────────────

export const SubscriptionSchema = z
	.object({
		id: z.number().describe('Subscription id'),
		customer_id: z
			.number()
			.nullish()
			.describe('Customer the subscription belongs to'),
		last_charged: z
			.string()
			.nullish()
			.describe('When the customer was last charged'),
		next_charge_at: z.string().nullish().describe('When the next charge runs'),
		status: z
			.string()
			.nullish()
			.describe('Subscription status, e.g. active, cancelled'),
		billing_interval: z
			.string()
			.nullish()
			.describe('Billing interval, e.g. month'),
		membership_plan_id: z
			.number()
			.nullish()
			.describe('Plan the subscription is on'),
		provider: z
			.string()
			.nullish()
			.describe('Payment provider, e.g. stripe, gocardless'),
	})
	.loose()
	.describe('A Payhere subscription');
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const ListSubscriptionsInputSchema = z
	.object({ ...pagingParams })
	.describe('Query parameters for listing subscriptions');
export type ListSubscriptionsInput = z.infer<
	typeof ListSubscriptionsInputSchema
>;

export const ListSubscriptionsOutputSchema = pagedOutput(
	SubscriptionSchema,
	'Subscriptions',
).describe('A page of subscriptions, most recent payment first');
export type ListSubscriptionsOutput = z.infer<
	typeof ListSubscriptionsOutputSchema
>;

// ── refunds ────────────────────────────────────────────────────────────────

export const CreateRefundInputSchema = z
	.object({
		payment_id: z.number().int().describe('Id of the payment to refund'),
		amount: z
			.number()
			.positive()
			.describe(
				'Amount to refund, in the payment currency; decimals allowed (1.5 is $1.50 USD)',
			),
		reason: z
			.enum(['requested_by_customer', 'duplicate', 'fraudulent'])
			.describe('Reason for the refund'),
	})
	.describe('Refund a payment, fully or partially');
export type CreateRefundInput = z.infer<typeof CreateRefundInputSchema>;

export const CreateRefundOutputSchema = z
	.object({
		paymentId: z.number().describe('Refunded payment id'),
		amount: z.number().describe('Refunded amount'),
		success: z.boolean().describe('Whether the refund succeeded'),
	})
	.describe('The refund was issued (the API answers 204 with no body)');
export type CreateRefundOutput = z.infer<typeof CreateRefundOutputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PayhereEndpointInputSchemas = {
	userGet: GetUserInputSchema,
	companyGet: GetCompanyInputSchema,
	companyStats: GetCompanyStatsInputSchema,
	customersList: ListCustomersInputSchema,
	customersGet: GetCustomerInputSchema,
	paymentsList: ListPaymentsInputSchema,
	plansList: ListPlansInputSchema,
	subscriptionsList: ListSubscriptionsInputSchema,
	refundsCreate: CreateRefundInputSchema,
};

export const PayhereEndpointOutputSchemas = {
	userGet: GetUserOutputSchema,
	companyGet: GetCompanyOutputSchema,
	companyStats: GetCompanyStatsOutputSchema,
	customersList: ListCustomersOutputSchema,
	customersGet: GetCustomerOutputSchema,
	paymentsList: ListPaymentsOutputSchema,
	plansList: ListPlansOutputSchema,
	subscriptionsList: ListSubscriptionsOutputSchema,
	refundsCreate: CreateRefundOutputSchema,
};

export type PayhereEndpointInputs = {
	[K in keyof typeof PayhereEndpointInputSchemas]: z.input<
		(typeof PayhereEndpointInputSchemas)[K]
	>;
};

export type PayhereEndpointOutputs = {
	[K in keyof typeof PayhereEndpointOutputSchemas]: z.infer<
		(typeof PayhereEndpointOutputSchemas)[K]
	>;
};
