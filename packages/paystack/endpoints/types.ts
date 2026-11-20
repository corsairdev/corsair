import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

const LIST_META_SCHEMA = z
	.object({
		total: z.number().nullish().describe('Total records across pages'),
		page: z.number().nullish().describe('Page returned'),
		perPage: z.number().nullish().describe('Records per page'),
		pageCount: z.number().nullish().describe('Total number of pages'),
		next: z
			.string()
			.nullish()
			.describe('URL of the next page, when one exists'),
		previous: z
			.string()
			.nullish()
			.describe('URL of the previous page, when one exists'),
	})
	.loose();

/** Wraps a paged result in the documented { status, message, data, meta } envelope. */
function pagedOutput(item: z.ZodTypeAny, label: string) {
	return z
		.object({
			status: z.boolean().describe('Whether the request succeeded'),
			message: z.string().describe('Response summary'),
			data: z.array(item).describe(`${label} on this page`),
			meta: LIST_META_SCHEMA,
		})
		.loose();
}

const pagingParams = {
	perPage: z
		.number()
		.int()
		.min(1)
		.max(500)
		.optional()
		.describe('Records per page; default 50'),
	page: z.number().int().min(1).optional().describe('Page number'),
};

/** A transaction as Paystack returns it. */
export const TransactionSchema = z
	.object({
		id: z.number().describe('Transaction id'),
		reference: z.string().nullish().describe('Unique transaction reference'),
		amount: z.number().nullish().describe('Amount in the currency subunit'),
		currency: z.string().nullish().describe('Transaction currency'),
		status: z
			.string()
			.nullish()
			.describe('Transaction status, e.g. success, failed, abandoned'),
		gateway_response: z.string().nullish().describe('Gateway response message'),
		channel: z.string().nullish().describe('Payment channel, e.g. card, bank'),
		customer: z
			.object({
				id: z.number().nullish().describe('Customer id'),
				email: z.string().nullish().describe('Customer email'),
			})
			.loose()
			.nullish()
			.describe('The customer the transaction belongs to'),
		authorization: z
			.object({
				authorization_code: z
					.string()
					.nullish()
					.describe('Code to charge this authorization again'),
			})
			.loose()
			.nullish()
			.describe('The card or bank authorization used'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A Paystack transaction');
export type Transaction = z.infer<typeof TransactionSchema>;

export const CustomerSchema = z
	.object({
		id: z.number().describe('Customer id'),
		email: z.string().describe('Customer email address'),
		customer_code: z
			.string()
			.nullish()
			.describe('Customer code, e.g.CUS_xxxxxx'),
		first_name: z.string().nullish().describe('First name'),
		last_name: z.string().nullish().describe('Last name'),
		phone: z.string().nullish().describe('Phone number'),
		risk_action: z
			.string()
			.nullish()
			.describe('Risk action, e.g. default, allow, deny'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A Paystack customer');
export type Customer = z.infer<typeof CustomerSchema>;

export const PlanSchema = z
	.object({
		id: z.number().describe('Plan id'),
		plan_code: z.string().nullish().describe('Plan code, e.g. PLN_xxxxxx'),
		name: z.string().nullish().describe('Plan name'),
		amount: z.number().nullish().describe('Amount in the currency subunit'),
		interval: z.string().nullish().describe('Billing interval, e.g. monthly'),
		description: z.string().nullish().describe('Plan description'),
		currency: z.string().nullish().describe('Plan currency'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A Paystack plan');
export type Plan = z.infer<typeof PlanSchema>;

export const SubscriptionSchema = z
	.object({
		id: z.number().describe('Subscription id'),
		subscription_code: z
			.string()
			.nullish()
			.describe('Subscription code, e.g. SUB_xxxxxx'),
		status: z
			.string()
			.nullish()
			.describe('Subscription status, e.g. active, cancelled'),
		next_payment_date: z
			.string()
			.nullish()
			.describe('When the next debit runs'),
		email_token: z
			.string()
			.nullish()
			.describe('Token used to manage the subscription'),
		customer: z
			.object({
				id: z.number().nullish().describe('Customer id'),
				email: z.string().nullish().describe('Customer email'),
			})
			.loose()
			.nullish()
			.describe('The subscriber'),
		plan: PlanSchema.nullish().describe('The plan the subscription is on'),
	})
	.loose()
	.describe('A Paystack subscription');
export type Subscription = z.infer<typeof SubscriptionSchema>;

export const RefundSchema = z
	.object({
		id: z.number().describe('Refund id'),
		transaction_reference: z
			.string()
			.nullish()
			.describe('Reference of the refunded transaction'),
		amount: z
			.number()
			.nullish()
			.describe('Refunded amount in the currency subunit'),
		currency: z.string().nullish().describe('Refund currency'),
		status: z
			.string()
			.nullish()
			.describe('Refund status, e.g. pending, processing, completed'),
		customer_note: z.string().nullish().describe('Note shown to the customer'),
		merchant_note: z
			.string()
			.nullish()
			.describe('Note recorded for the merchant'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A Paystack refund');
export type Refund = z.infer<typeof RefundSchema>;

const DATETIME_REGEX =
	/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const isoDatetime = z
	.string()
	.regex(
		DATETIME_REGEX,
		'Expected an ISO 8601 datetime like 2025-06-01T00:30:13+01:00',
	);

// ── transactions ───────────────────────────────────────────────────────────

export const InitializeTransactionInputSchema = z
	.object({
		amount: z.string().min(1).describe('Amount in the currency subunit'),
		email: z.string().email().describe('Customer email address'),
		channels: z
			.array(
				z.enum([
					'card',
					'bank',
					'apple_pay',
					'ussd',
					'qr',
					'mobile_money',
					'bank_transfer',
					'eft',
					'capitec_pay',
					'payattitude',
				]),
			)
			.optional()
			.describe('Payment channels to allow'),
		currency: z
			.string()
			.optional()
			.describe('Currency the transaction is charged in'),
		reference: z
			.string()
			.optional()
			.describe('Your unique transaction reference'),
		callback_url: z
			.string()
			.url()
			.optional()
			.describe('Where the checkout redirects after payment'),
		plan: z
			.string()
			.optional()
			.describe('Plan code to charge the customer for'),
		metadata: z
			// unknown: metadata is caller-defined key/value data, so the record
			// cannot be stricter.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom data returned with the transaction'),
	})
	.describe(
		'Start a checkout: the answer carries the authorization_url to redirect to',
	);
export type InitializeTransactionInput = z.infer<
	typeof InitializeTransactionInputSchema
>;

export const InitializeTransactionOutputSchema = z
	.object({
		status: z.boolean(),
		message: z.string(),
		data: z
			.object({
				authorization_url: z
					.string()
					.describe('URL to redirect the customer to'),
				access_code: z
					.string()
					.describe('Code used with the inline JS library'),
				reference: z.string().describe('Transaction reference'),
			})
			.loose(),
	})
	.loose()
	.describe('The started checkout');
export type InitializeTransactionOutput = z.infer<
	typeof InitializeTransactionOutputSchema
>;

export const VerifyTransactionInputSchema = z
	.object({
		reference: z.string().min(1).describe('Transaction reference to verify'),
	})
	.describe('Verify a transaction by its reference');
export type VerifyTransactionInput = z.infer<
	typeof VerifyTransactionInputSchema
>;

export const VerifyTransactionOutputSchema = z
	.object({
		status: z.boolean(),
		message: z.string(),
		data: TransactionSchema,
	})
	.loose()
	.describe('The verified transaction');
export type VerifyTransactionOutput = z.infer<
	typeof VerifyTransactionOutputSchema
>;

export const ListTransactionsInputSchema = z
	.object({
		...pagingParams,
		customer: z.number().int().optional().describe('Filter by customer id'),
		status: z
			.enum(['failed', 'success', 'abandoned'])
			.optional()
			.describe('Filter by transaction status'),
		from: isoDatetime.optional().describe('Transactions from this datetime'),
		to: isoDatetime.optional().describe('Transactions to this datetime'),
		amount: z
			.number()
			.int()
			.optional()
			.describe('Filter by amount in the currency subunit'),
	})
	.describe('Query parameters for listing transactions');
export type ListTransactionsInput = z.infer<typeof ListTransactionsInputSchema>;

export const ListTransactionsOutputSchema = pagedOutput(
	TransactionSchema,
	'Transactions',
).describe('A page of transactions');
export type ListTransactionsOutput = z.infer<
	typeof ListTransactionsOutputSchema
>;

export const GetTransactionInputSchema = z
	.object({ transactionId: z.number().int().describe('Transaction id') })
	.describe('Input for reading one transaction by id');
export type GetTransactionInput = z.infer<typeof GetTransactionInputSchema>;

export const GetTransactionOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: TransactionSchema })
	.loose()
	.describe('The transaction');
export type GetTransactionOutput = z.infer<typeof GetTransactionOutputSchema>;

// ── customers ──────────────────────────────────────────────────────────────

export const CreateCustomerInputSchema = z
	.object({
		email: z.string().email().describe('Customer email address'),
		first_name: z.string().describe('Customer first name'),
		last_name: z.string().describe('Customer last name'),
		phone: z.string().optional().describe('Customer phone number'),
		metadata: z
			// unknown: metadata is caller-defined, so the record cannot be
			// stricter.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom data stored with the customer'),
	})
	.describe('Create a customer');
export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;

export const CreateCustomerOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: CustomerSchema })
	.loose()
	.describe('The customer as created');
export type CreateCustomerOutput = z.infer<typeof CreateCustomerOutputSchema>;

export const ListCustomersInputSchema = z
	.object({
		...pagingParams,
		from: isoDatetime
			.optional()
			.describe('Customers created from this datetime'),
		to: isoDatetime.optional().describe('Customers created to this datetime'),
	})
	.describe('Query parameters for listing customers');
export type ListCustomersInput = z.infer<typeof ListCustomersInputSchema>;

export const ListCustomersOutputSchema = pagedOutput(
	CustomerSchema,
	'Customers',
).describe('A page of customers');
export type ListCustomersOutput = z.infer<typeof ListCustomersOutputSchema>;

export const GetCustomerInputSchema = z
	.object({
		emailOrCode: z
			.string()
			.min(1)
			.describe('Customer email address or code (sent in the path)'),
	})
	.describe('Input for reading one customer');
export type GetCustomerInput = z.infer<typeof GetCustomerInputSchema>;

export const GetCustomerOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: CustomerSchema })
	.loose()
	.describe('The customer');
export type GetCustomerOutput = z.infer<typeof GetCustomerOutputSchema>;

export const UpdateCustomerInputSchema = z
	.object({
		code: z.string().min(1).describe('Customer code'),
		first_name: z.string().describe('Customer first name'),
		last_name: z.string().describe('Customer last name'),
		phone: z.string().optional().describe('Customer phone number'),
		metadata: z
			// unknown: metadata is caller-defined.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Custom data stored with the customer'),
	})
	.describe('Update a customer');
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;

export const UpdateCustomerOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: CustomerSchema })
	.loose()
	.describe('The customer as updated');
export type UpdateCustomerOutput = z.infer<typeof UpdateCustomerOutputSchema>;

export const SetRiskActionInputSchema = z
	.object({
		customer: z.string().min(1).describe('Customer code or email address'),
		risk_action: z
			.enum(['default', 'allow', 'deny'])
			.optional()
			.describe('allow whitelists, deny blacklists, default resets'),
	})
	.describe('Whitelist, blacklist or reset a customer');
export type SetRiskActionInput = z.infer<typeof SetRiskActionInputSchema>;

export const SetRiskActionOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: CustomerSchema })
	.loose()
	.describe('The customer with its new risk action');
export type SetRiskActionOutput = z.infer<typeof SetRiskActionOutputSchema>;

// ── plans ──────────────────────────────────────────────────────────────────

const PLAN_INTERVALS = [
	'daily',
	'weekly',
	'monthly',
	'quarterly',
	'biannually',
	'annually',
] as const;

export const CreatePlanInputSchema = z
	.object({
		name: z.string().min(1).describe('Plan name'),
		amount: z.number().int().describe('Amount in the currency subunit'),
		interval: z.enum(PLAN_INTERVALS).describe('Billing interval'),
		description: z.string().optional().describe('Plan description'),
		currency: z.string().optional().describe('Plan currency'),
		send_invoices: z
			.boolean()
			.optional()
			.describe('Email invoices to customers'),
		send_sms: z.boolean().optional().describe('Send SMS receipts to customers'),
		invoice_limit: z
			.number()
			.int()
			.optional()
			.describe('Number of invoices to send during subscription'),
	})
	.describe('Create a payment plan');
export type CreatePlanInput = z.infer<typeof CreatePlanInputSchema>;

export const CreatePlanOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: PlanSchema })
	.loose()
	.describe('The plan as created');
export type CreatePlanOutput = z.infer<typeof CreatePlanOutputSchema>;

export const ListPlansInputSchema = z
	.object({
		...pagingParams,
		status: z.string().optional().describe('Filter by plan status'),
		interval: z
			.enum(PLAN_INTERVALS)
			.optional()
			.describe('Filter by billing interval'),
		amount: z
			.number()
			.int()
			.optional()
			.describe('Filter by amount in the currency subunit'),
	})
	.describe('Query parameters for listing plans');
export type ListPlansInput = z.infer<typeof ListPlansInputSchema>;

export const ListPlansOutputSchema = pagedOutput(PlanSchema, 'Plans').describe(
	'A page of plans',
);
export type ListPlansOutput = z.infer<typeof ListPlansOutputSchema>;

export const GetPlanInputSchema = z
	.object({ idOrCode: z.string().min(1).describe('Plan id or code') })
	.describe('Input for reading one plan');
export type GetPlanInput = z.infer<typeof GetPlanInputSchema>;

export const GetPlanOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: PlanSchema })
	.loose()
	.describe('The plan');
export type GetPlanOutput = z.infer<typeof GetPlanOutputSchema>;

export const UpdatePlanInputSchema = z
	.object({
		idOrCode: z.string().min(1).describe('Plan id or code'),
		name: z.string().min(1).describe('Plan name'),
		amount: z.number().int().describe('Amount in the currency subunit'),
		interval: z.enum(PLAN_INTERVALS).describe('Billing interval'),
		description: z.string().optional().describe('Plan description'),
		currency: z.string().optional().describe('Plan currency'),
		send_invoices: z
			.boolean()
			.optional()
			.describe('Email invoices to customers'),
		invoice_limit: z
			.number()
			.int()
			.optional()
			.describe('Number of invoices to send'),
		update_existing_subscriptions: z
			.boolean()
			.optional()
			.describe(
				'Apply the changes to existing subscriptions (defaults to true)',
			),
	})
	.describe('Update a plan');
export type UpdatePlanInput = z.infer<typeof UpdatePlanInputSchema>;

export const UpdatePlanOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: PlanSchema })
	.loose()
	.describe('The plan as updated');
export type UpdatePlanOutput = z.infer<typeof UpdatePlanOutputSchema>;

// ── subscriptions ──────────────────────────────────────────────────────────

export const CreateSubscriptionInputSchema = z
	.object({
		customer: z.string().min(1).describe('Customer email address or code'),
		plan: z.string().min(1).describe('Plan code'),
		authorization: z
			.string()
			.optional()
			.describe(
				'Authorization to charge; defaults to the customer most recent',
			),
		start_date: isoDatetime.optional().describe('First debit date, ISO 8601'),
	})
	.describe('Create a subscription');
export type CreateSubscriptionInput = z.infer<
	typeof CreateSubscriptionInputSchema
>;

export const CreateSubscriptionOutputSchema = z
	.object({
		status: z.boolean(),
		message: z.string(),
		data: z
			.object({
				email_token: z
					.string()
					.nullish()
					.describe('Token used to manage the subscription'),
				subscription_code: z.string().nullish().describe('Subscription code'),
			})
			.loose(),
	})
	.loose()
	.describe('The subscription as created');
export type CreateSubscriptionOutput = z.infer<
	typeof CreateSubscriptionOutputSchema
>;

export const ListSubscriptionsInputSchema = z
	.object({
		...pagingParams,
		customer: z.number().int().optional().describe('Filter by customer id'),
		plan: z.number().int().optional().describe('Filter by plan id'),
	})
	.describe('Query parameters for listing subscriptions');
export type ListSubscriptionsInput = z.infer<
	typeof ListSubscriptionsInputSchema
>;

export const ListSubscriptionsOutputSchema = pagedOutput(
	SubscriptionSchema,
	'Subscriptions',
).describe('A page of subscriptions');
export type ListSubscriptionsOutput = z.infer<
	typeof ListSubscriptionsOutputSchema
>;

export const GetSubscriptionInputSchema = z
	.object({ idOrCode: z.string().min(1).describe('Subscription id or code') })
	.describe('Input for reading one subscription');
export type GetSubscriptionInput = z.infer<typeof GetSubscriptionInputSchema>;

export const GetSubscriptionOutputSchema = z
	.object({
		status: z.boolean(),
		message: z.string(),
		data: SubscriptionSchema,
	})
	.loose()
	.describe('The subscription');
export type GetSubscriptionOutput = z.infer<typeof GetSubscriptionOutputSchema>;

export const SetSubscriptionStatusInputSchema = z
	.object({
		code: z.string().min(1).describe('Subscription code'),
		token: z.string().min(1).describe('Email token of the subscription'),
	})
	.describe('Input for enabling or disabling a subscription');
export type SetSubscriptionStatusInput = z.infer<
	typeof SetSubscriptionStatusInputSchema
>;

export const EnableSubscriptionOutputSchema = z
	.object({ status: z.boolean(), message: z.string() })
	.loose()
	.describe('The subscription was enabled');
export type EnableSubscriptionOutput = z.infer<
	typeof EnableSubscriptionOutputSchema
>;

export const DisableSubscriptionOutputSchema = z
	.object({ status: z.boolean(), message: z.string() })
	.loose()
	.describe('The subscription was disabled');
export type DisableSubscriptionOutput = z.infer<
	typeof DisableSubscriptionOutputSchema
>;

// ── refunds ────────────────────────────────────────────────────────────────

export const CreateRefundInputSchema = z
	.object({
		transaction: z
			.string()
			.min(1)
			.describe('Transaction reference or id to refund'),
		amount: z
			.number()
			.int()
			.optional()
			.describe('Amount in the currency subunit; defaults to the full amount'),
		currency: z.string().optional().describe('Refund currency'),
		customer_note: z.string().optional().describe('Note shown to the customer'),
		merchant_note: z
			.string()
			.optional()
			.describe('Note recorded for the merchant'),
		reference: z
			.string()
			.regex(
				/^[A-Za-z0-9_-]{8,64}$/,
				'Expected 8-64 characters of letters, digits, underscores or hyphens',
			)
			.optional()
			.describe('Your reference for the refund'),
	})
	.describe('Refund a transaction, fully or partially');
export type CreateRefundInput = z.infer<typeof CreateRefundInputSchema>;

export const CreateRefundOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: RefundSchema })
	.loose()
	.describe('The refund as created');
export type CreateRefundOutput = z.infer<typeof CreateRefundOutputSchema>;

export const ListRefundsInputSchema = z
	.object({
		transaction: z.string().optional().describe('Filter by transaction id'),
		currency: z.string().optional().describe('Filter by currency'),
		reference: z.string().optional().describe('Filter by refund reference'),
		from: z
			.string()
			.optional()
			.describe('Refunds from this date, e.g. 2016-09-21'),
		to: z.string().optional().describe('Refunds to this date'),
		...pagingParams,
	})
	.describe('Query parameters for listing refunds');
export type ListRefundsInput = z.infer<typeof ListRefundsInputSchema>;

export const ListRefundsOutputSchema = pagedOutput(
	RefundSchema,
	'Refunds',
).describe('A page of refunds');
export type ListRefundsOutput = z.infer<typeof ListRefundsOutputSchema>;

export const GetRefundInputSchema = z
	.object({ refundId: z.number().int().describe('Refund id') })
	.describe('Input for reading one refund');
export type GetRefundInput = z.infer<typeof GetRefundInputSchema>;

export const GetRefundOutputSchema = z
	.object({ status: z.boolean(), message: z.string(), data: RefundSchema })
	.loose()
	.describe('The refund');
export type GetRefundOutput = z.infer<typeof GetRefundOutputSchema>;

// ── Operation registry ─────────────────────────────────────────────────────

export const PaystackEndpointInputSchemas = {
	transactionsInitialize: InitializeTransactionInputSchema,
	transactionsVerify: VerifyTransactionInputSchema,
	transactionsList: ListTransactionsInputSchema,
	transactionsGet: GetTransactionInputSchema,
	customersCreate: CreateCustomerInputSchema,
	customersList: ListCustomersInputSchema,
	customersGet: GetCustomerInputSchema,
	customersUpdate: UpdateCustomerInputSchema,
	customersSetRiskAction: SetRiskActionInputSchema,
	plansCreate: CreatePlanInputSchema,
	plansList: ListPlansInputSchema,
	plansGet: GetPlanInputSchema,
	plansUpdate: UpdatePlanInputSchema,
	subscriptionsCreate: CreateSubscriptionInputSchema,
	subscriptionsList: ListSubscriptionsInputSchema,
	subscriptionsGet: GetSubscriptionInputSchema,
	subscriptionsEnable: SetSubscriptionStatusInputSchema,
	subscriptionsDisable: SetSubscriptionStatusInputSchema,
	refundsCreate: CreateRefundInputSchema,
	refundsList: ListRefundsInputSchema,
	refundsGet: GetRefundInputSchema,
};

export const PaystackEndpointOutputSchemas = {
	transactionsInitialize: InitializeTransactionOutputSchema,
	transactionsVerify: VerifyTransactionOutputSchema,
	transactionsList: ListTransactionsOutputSchema,
	transactionsGet: GetTransactionOutputSchema,
	customersCreate: CreateCustomerOutputSchema,
	customersList: ListCustomersOutputSchema,
	customersGet: GetCustomerOutputSchema,
	customersUpdate: UpdateCustomerOutputSchema,
	customersSetRiskAction: SetRiskActionOutputSchema,
	plansCreate: CreatePlanOutputSchema,
	plansList: ListPlansOutputSchema,
	plansGet: GetPlanOutputSchema,
	plansUpdate: UpdatePlanOutputSchema,
	subscriptionsCreate: CreateSubscriptionOutputSchema,
	subscriptionsList: ListSubscriptionsOutputSchema,
	subscriptionsGet: GetSubscriptionOutputSchema,
	subscriptionsEnable: EnableSubscriptionOutputSchema,
	subscriptionsDisable: DisableSubscriptionOutputSchema,
	refundsCreate: CreateRefundOutputSchema,
	refundsList: ListRefundsOutputSchema,
	refundsGet: GetRefundOutputSchema,
};

export type PaystackEndpointInputs = {
	[K in keyof typeof PaystackEndpointInputSchemas]: z.input<
		(typeof PaystackEndpointInputSchemas)[K]
	>;
};

export type PaystackEndpointOutputs = {
	[K in keyof typeof PaystackEndpointOutputSchemas]: z.infer<
		(typeof PaystackEndpointOutputSchemas)[K]
	>;
};
