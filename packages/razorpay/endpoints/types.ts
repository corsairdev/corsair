import { z } from 'zod';
import {
	RazorpayCustomerSchema,
	RazorpayNotesSchema,
	RazorpayOrderSchema,
	RazorpayPaymentSchema,
	RazorpayRefundSchema,
	RazorpaySettlementSchema,
	RazorpaySubscriptionSchema,
	RazorpayPayoutSchema,
} from '../schema/database';

// ── Orders ──────────────────────────────────────────────────────────────

const OrdersCreateInputSchema = z.object({
	amount: z.number().int().positive(),
	currency: z.string().min(1),
	receipt: z.string().optional(),
	notes: RazorpayNotesSchema.optional(),
});

const OrdersGetInputSchema = z.object({
	id: z.string(),
});

const OrdersListInputSchema = z.object({
	from: z.number().int().optional(),
	to: z.number().int().optional(),
	count: z.number().int().positive().max(100).optional(),
	skip: z.number().int().min(0).optional(),
	authorized: z.enum(['0', '1']).optional(),
	receipt: z.string().optional(),
});

// ── Payments ────────────────────────────────────────────────────────────

const PaymentsGetInputSchema = z.object({
	id: z.string(),
});

const PaymentsListInputSchema = z.object({
	from: z.number().int().optional(),
	to: z.number().int().optional(),
	count: z.number().int().positive().max(100).optional(),
	skip: z.number().int().min(0).optional(),
});

const PaymentsCaptureInputSchema = z.object({
	id: z.string(),
	amount: z.number().int().positive(),
	currency: z.string().min(1),
});

// ── Payouts ─────────────────────────────────────────────────────────────

const PayoutsListInputSchema = z.object({
    account_number: z.string(),
    contact_id: z.string().optional(),
    fund_account_id: z.string().optional(),
    mode: z.string().optional(),
    reference_id: z.string().optional(),
    status: z.string().optional(),
    from: z.number().optional(),
    to: z.number().optional(),
    count: z.number().optional(),
    skip: z.number().optional(),
})

const PayoutsGetInputSchema = z.object({
    id: z.string(),
})

const PayoutsCreateInputSchema = z.object({
    account_number: z.string(),
    fund_account_id: z.string(),
    amount: z.number().int().positive().min(100),
    currency: z.string(),
    mode: z.string(),
    purpose: z.string(),
    queue_if_low_balance: z.boolean().optional(),
    reference_id: z.string().optional(),
    narration: z.string().optional(),
	notes: RazorpayNotesSchema.optional(),
})

// ── Refunds ─────────────────────────────────────────────────────────────

const RefundsCreateInputSchema = z.object({
	paymentId: z.string(),
	amount: z.number().int().positive().optional(),
	speed: z.enum(['normal', 'optimum']).optional(),
	receipt: z.string().optional(),
	notes: RazorpayNotesSchema.optional(),
});

const RefundsGetInputSchema = z.object({
	paymentId: z.string(),
	refundId: z.string(),
});

const RefundsListInputSchema = z.object({
	paymentId: z.string(),
	from: z.number().int().optional(),
	to: z.number().int().optional(),
	count: z.number().int().positive().max(100).optional(),
	skip: z.number().int().min(0).optional(),
});

// ── Customers ───────────────────────────────────────────────────────────

const CustomersCreateInputSchema = z.object({
	name: z.string().min(1),
	email: z.string().email().optional(),
	contact: z.string().optional(),
	gstin: z.string().optional(),
	notes: RazorpayNotesSchema.optional(),
	fail_existing: z.enum(['0', '1']).optional(),
});

const CustomersGetInputSchema = z.object({
	id: z.string(),
});

const CustomersListInputSchema = z.object({
	count: z.number().int().positive().max(100).optional(),
	skip: z.number().int().min(0).optional(),
});

const CustomersUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().min(1).optional(),
	email: z.string().email().optional(),
	contact: z.string().optional(),
	gstin: z.string().optional(),
	notes: RazorpayNotesSchema.optional(),
});

// ── Settlements ─────────────────────────────────────────────────────────

const SettlementsListInputSchema = z.object({
	from: z.number().optional(),
	to: z.number().optional(),
	count: z.number().optional(),
	skip: z.number().optional(),
});

const SettlementGetInputSchema = z.object({
	id: z.string(),
});

// ── Subscriptions ───────────────────────────────────────────────────────

const SubscriptionsListInputSchema = z.object({
	from: z.number().optional(),
	to: z.number().optional(),
	count: z.number().optional(),
	skip: z.number().optional(),
	plan_id: z.string().optional(),
});

const SubscriptionsGetInputSchema = z.object({
	id: z.string(),
});

const SubscriptionsCreateInputSchema = z.object({
	plan_id: z.string(),
	total_count: z.number().int().positive(),
	quantity: z.number().int().positive().optional(),
	start_at: z.number().int().optional(),
	expire_by: z.number().int().optional(),
	customer_notify: z.union([z.literal(0), z.literal(1)]).optional(),
	notes: RazorpayNotesSchema.optional(),
	offer_id: z.string().optional(),
	customer_id: z.string().optional(),
});

const SubscriptionsUpdateInputSchema = z.object({
	id: z.string(),
	plan_id: z.string().optional(),
	quantity: z.number().int().positive().optional(),
	remaining_count: z.number().int().optional(),
	offer_id: z.string().optional(),
	schedule_change_at: z.enum(['now', 'cycle_end']).optional(),
	customer_notify: z.union([z.literal(0), z.literal(1)]).optional(),
});

const SubscriptionsCancelInputSchema = z.object({
	id: z.string(),
	cancel_at_cycle_end: z.boolean().optional(),
});

const SubscriptionsPauseInputSchema = z.object({
	id: z.string(),
	pause_initiated_by: z.enum(['customer', 'bank']).optional(),
});

const SubscriptionsResumeInputSchema = z.object({
	id: z.string(),
	resume_at: z.enum(['now']).optional(),
});

// ── Response schemas ────────────────────────────────────────────────────

const OrdersCreateResponseSchema = RazorpayOrderSchema;
const OrdersGetResponseSchema = RazorpayOrderSchema;
const OrdersListResponseSchema = z
	.object({
		entity: z.literal('collection').optional(),
		count: z.number(),
		items: z.array(RazorpayOrderSchema),
	})
	.passthrough();

const PaymentsGetResponseSchema = RazorpayPaymentSchema;
const PaymentsListResponseSchema = z
	.object({
		entity: z.literal('collection').optional(),
		count: z.number(),
		items: z.array(RazorpayPaymentSchema),
	})
	.passthrough();
const PaymentsCaptureResponseSchema = RazorpayPaymentSchema;

const PayoutsGetResponseSchema = RazorpayPayoutSchema;
const PayoutsListResponseSchema = z
	.object({
		entity: z.literal('collection').optional(),
		count: z.number(),
		items: z.array(RazorpayPayoutSchema),
	})
	.passthrough();
const PayoutsCreateResponseSchema = RazorpayPayoutSchema;

const RefundsCreateResponseSchema = RazorpayRefundSchema;
const RefundsGetResponseSchema = RazorpayRefundSchema;
const RefundsListResponseSchema = z
	.object({
		entity: z.literal('collection').optional(),
		count: z.number(),
		items: z.array(RazorpayRefundSchema),
	})
	.passthrough();

const CustomersCreateResponseSchema = RazorpayCustomerSchema;
const CustomersGetResponseSchema = RazorpayCustomerSchema;
const CustomersListResponseSchema = z
	.object({
		entity: z.literal('collection').optional(),
		count: z.number(),
		items: z.array(RazorpayCustomerSchema),
	})
	.passthrough();
const CustomersUpdateResponseSchema = RazorpayCustomerSchema;

const SettlementsListResponseSchema = RazorpaySettlementSchema;
const SettlementsGetResponseSchema = RazorpaySettlementSchema;

const SubscriptionsListResponseSchema = z
	.object({
		entity: z.literal('collection').optional(),
		count: z.number(),
		items: z.array(RazorpaySubscriptionSchema),
	})
	.passthrough();
const SubscriptionsGetResponseSchema = RazorpaySubscriptionSchema;
const SubscriptionsCreateResponseSchema = RazorpaySubscriptionSchema;
const SubscriptionsUpdateResponseSchema = RazorpaySubscriptionSchema;
const SubscriptionsCancelResponseSchema = RazorpaySubscriptionSchema;
const SubscriptionsPauseResponseSchema = RazorpaySubscriptionSchema;
const SubscriptionsResumeResponseSchema = RazorpaySubscriptionSchema;

// ── Input types ─────────────────────────────────────────────────────────

export type OrdersCreateInput = z.infer<typeof OrdersCreateInputSchema>;
export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;
export type OrdersListInput = z.infer<typeof OrdersListInputSchema>;
export type PaymentsGetInput = z.infer<typeof PaymentsGetInputSchema>;
export type PaymentsListInput = z.infer<typeof PaymentsListInputSchema>;
export type PaymentsCaptureInput = z.infer<typeof PaymentsCaptureInputSchema>;
export type PayoutsGetInput = z.infer<typeof PayoutsGetInputSchema>;
export type PayoutsListInput = z.infer<typeof PayoutsListInputSchema>;
export type PayoutsCreateInput = z.infer<typeof PayoutsCreateInputSchema>;
export type RefundsCreateInput = z.infer<typeof RefundsCreateInputSchema>;
export type RefundsGetInput = z.infer<typeof RefundsGetInputSchema>;
export type RefundsListInput = z.infer<typeof RefundsListInputSchema>;
export type CustomersCreateInput = z.infer<typeof CustomersCreateInputSchema>;
export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;
export type CustomersListInput = z.infer<typeof CustomersListInputSchema>;
export type CustomersUpdateInput = z.infer<typeof CustomersUpdateInputSchema>;
export type SettlementsListInput = z.infer<typeof SettlementsListInputSchema>;
export type SettlementGetInput = z.infer<typeof SettlementGetInputSchema>;
export type SubscriptionsListInput = z.infer<
	typeof SubscriptionsListInputSchema
>;
export type SubscriptionsGetInput = z.infer<typeof SubscriptionsGetInputSchema>;
export type SubscriptionsCreateInput = z.infer<
	typeof SubscriptionsCreateInputSchema
>;
export type SubscriptionsUpdateInput = z.infer<
	typeof SubscriptionsUpdateInputSchema
>;
export type SubscriptionsCancelInput = z.infer<
	typeof SubscriptionsCancelInputSchema
>;
export type SubscriptionsPauseInput = z.infer<
	typeof SubscriptionsPauseInputSchema
>;
export type SubscriptionsResumeInput = z.infer<
	typeof SubscriptionsResumeInputSchema
>;

// ── Output types ────────────────────────────────────────────────────────

export type OrdersCreateResponse = z.infer<typeof OrdersCreateResponseSchema>;
export type OrdersGetResponse = z.infer<typeof OrdersGetResponseSchema>;
export type OrdersListResponse = z.infer<typeof OrdersListResponseSchema>;
export type PaymentsGetResponse = z.infer<typeof PaymentsGetResponseSchema>;
export type PaymentsListResponse = z.infer<typeof PaymentsListResponseSchema>;
export type PaymentsCaptureResponse = z.infer<
	typeof PaymentsCaptureResponseSchema
>;
export type PayoutsGetResponse = z.infer<typeof PayoutsGetResponseSchema>;
export type PayoutsListResponse = z.infer<typeof PayoutsListResponseSchema>;
export type PayoutsCreateResponse = z.infer<
	typeof PayoutsCreateResponseSchema
>;
export type RefundsCreateResponse = z.infer<typeof RefundsCreateResponseSchema>;
export type RefundsGetResponse = z.infer<typeof RefundsGetResponseSchema>;
export type RefundsListResponse = z.infer<typeof RefundsListResponseSchema>;
export type CustomersCreateResponse = z.infer<
	typeof CustomersCreateResponseSchema
>;
export type CustomersGetResponse = z.infer<typeof CustomersGetResponseSchema>;
export type CustomersListResponse = z.infer<typeof CustomersListResponseSchema>;
export type CustomersUpdateResponse = z.infer<
	typeof CustomersUpdateResponseSchema
>;
export type SettlementsListResponse = z.infer<
	typeof SettlementsListResponseSchema
>;
export type SettlementsGetResponse = z.infer<
	typeof SettlementsGetResponseSchema
>;
export type SubscriptionsListResponse = z.infer<
	typeof SubscriptionsListResponseSchema
>;
export type SubscriptionsGetResponse = z.infer<
	typeof SubscriptionsGetResponseSchema
>;
export type SubscriptionsCreateResponse = z.infer<
	typeof SubscriptionsCreateResponseSchema
>;
export type SubscriptionsUpdateResponse = z.infer<
	typeof SubscriptionsUpdateResponseSchema
>;
export type SubscriptionsCancelResponse = z.infer<
	typeof SubscriptionsCancelResponseSchema
>;
export type SubscriptionsPauseResponse = z.infer<
	typeof SubscriptionsPauseResponseSchema
>;
export type SubscriptionsResumeResponse = z.infer<
	typeof SubscriptionsResumeResponseSchema
>;

// ── Aggregate maps ──────────────────────────────────────────────────────

export type RazorpayEndpointInputs = {
	ordersCreate: OrdersCreateInput;
	ordersGet: OrdersGetInput;
	ordersList: OrdersListInput;
	paymentsGet: PaymentsGetInput;
	paymentsList: PaymentsListInput;
	paymentsCapture: PaymentsCaptureInput;
	payoutsGet: PayoutsGetInput;
	payoutsList: PayoutsListInput;
	payoutsCreate: PayoutsCreateInput;
	refundsCreate: RefundsCreateInput;
	refundsGet: RefundsGetInput;
	refundsList: RefundsListInput;
	customersCreate: CustomersCreateInput;
	customersGet: CustomersGetInput;
	customersList: CustomersListInput;
	customersUpdate: CustomersUpdateInput;
	settlementsList: SettlementsListInput;
	settlementsGet: SettlementGetInput;
	subscriptionsList: SubscriptionsListInput;
	subscriptionsGet: SubscriptionsGetInput;
	subscriptionsCreate: SubscriptionsCreateInput;
	subscriptionsUpdate: SubscriptionsUpdateInput;
	subscriptionsCancel: SubscriptionsCancelInput;
	subscriptionsPause: SubscriptionsPauseInput;
	subscriptionsResume: SubscriptionsResumeInput;
};

export type RazorpayEndpointOutputs = {
	ordersCreate: OrdersCreateResponse;
	ordersGet: OrdersGetResponse;
	ordersList: OrdersListResponse;
	paymentsGet: PaymentsGetResponse;
	paymentsList: PaymentsListResponse;
	paymentsCapture: PaymentsCaptureResponse;
	payoutsGet: PayoutsGetResponse;
	payoutsList: PayoutsListResponse;
	payoutsCreate: PayoutsCreateResponse;
	refundsCreate: RefundsCreateResponse;
	refundsGet: RefundsGetResponse;
	refundsList: RefundsListResponse;
	customersCreate: CustomersCreateResponse;
	customersGet: CustomersGetResponse;
	customersList: CustomersListResponse;
	customersUpdate: CustomersUpdateResponse;
	settlementsList: SettlementsListResponse;
	settlementsGet: SettlementsGetResponse;
	subscriptionsList: SubscriptionsListResponse;
	subscriptionsGet: SubscriptionsGetResponse;
	subscriptionsCreate: SubscriptionsCreateResponse;
	subscriptionsUpdate: SubscriptionsUpdateResponse;
	subscriptionsCancel: SubscriptionsCancelResponse;
	subscriptionsPause: SubscriptionsPauseResponse;
	subscriptionsResume: SubscriptionsResumeResponse;
};

export const RazorpayEndpointInputSchemas = {
	ordersCreate: OrdersCreateInputSchema,
	ordersGet: OrdersGetInputSchema,
	ordersList: OrdersListInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	paymentsList: PaymentsListInputSchema,
	paymentsCapture: PaymentsCaptureInputSchema,
	payoutsGet: PayoutsGetInputSchema,
	payoutsList: PayoutsListInputSchema,
	payoutsCreate: PayoutsCreateInputSchema,
	refundsCreate: RefundsCreateInputSchema,
	refundsGet: RefundsGetInputSchema,
	refundsList: RefundsListInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersGet: CustomersGetInputSchema,
	customersList: CustomersListInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	settlementsList: SettlementsListInputSchema,
	settlementsGet: SettlementGetInputSchema,
	subscriptionsList: SubscriptionsListInputSchema,
	subscriptionsGet: SubscriptionsGetInputSchema,
	subscriptionsCreate: SubscriptionsCreateInputSchema,
	subscriptionsUpdate: SubscriptionsUpdateInputSchema,
	subscriptionsCancel: SubscriptionsCancelInputSchema,
	subscriptionsPause: SubscriptionsPauseInputSchema,
	subscriptionsResume: SubscriptionsResumeInputSchema,
} as const;

export const RazorpayEndpointOutputSchemas = {
	ordersCreate: OrdersCreateResponseSchema,
	ordersGet: OrdersGetResponseSchema,
	ordersList: OrdersListResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	paymentsCapture: PaymentsCaptureResponseSchema,
	payoutsGet: PayoutsGetResponseSchema,
	payoutsList: PayoutsListResponseSchema,
	payoutsCreate: PayoutsCreateResponseSchema,
	refundsCreate: RefundsCreateResponseSchema,
	refundsGet: RefundsGetResponseSchema,
	refundsList: RefundsListResponseSchema,
	customersCreate: CustomersCreateResponseSchema,
	customersGet: CustomersGetResponseSchema,
	customersList: CustomersListResponseSchema,
	customersUpdate: CustomersUpdateResponseSchema,
	settlementsList: SettlementsListResponseSchema,
	settlementsGet: SettlementsGetResponseSchema,
	subscriptionsList: SubscriptionsListResponseSchema,
	subscriptionsGet: SubscriptionsGetResponseSchema,
	subscriptionsCreate: SubscriptionsCreateResponseSchema,
	subscriptionsUpdate: SubscriptionsUpdateResponseSchema,
	subscriptionsCancel: SubscriptionsCancelResponseSchema,
	subscriptionsPause: SubscriptionsPauseResponseSchema,
	subscriptionsResume: SubscriptionsResumeResponseSchema,
} as const;
