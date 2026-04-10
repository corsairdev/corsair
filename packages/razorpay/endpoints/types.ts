import { z } from 'zod';
import {
	RazorpayCustomerSchema,
	RazorpayNotesSchema,
	RazorpayOrderSchema,
	RazorpayPaymentSchema,
	RazorpayRefundSchema,
	RazorpaySettlementSchema,
	RazorpaySubscriptionSchema,
} from '../schema/database';

const OrdersCreateInputSchema = z.object({
	amount: z.number().int().positive(),
	currency: z.string().min(1),
	receipt: z.string().optional(),
	notes: RazorpayNotesSchema.optional(),
});

const OrdersGetInputSchema = z.object({
	id: z.string(),
});

const PaymentsGetInputSchema = z.object({
	id: z.string(),
});

const PaymentsListInputSchema = z.object({
	from: z.number().int().optional(),
	to: z.number().int().optional(),
	count: z.number().int().positive().max(100).optional(),
	skip: z.number().int().min(0).optional(),
});

const RefundsCreateInputSchema = z.object({
	paymentId: z.string(),
	amount: z.number().int().positive().optional(),
	speed: z.enum(['normal', 'optimum']).optional(),
	receipt: z.string().optional(),
	notes: RazorpayNotesSchema.optional(),
});

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

const SettlementsListInputSchema = z.object({
	from: z.number().optional(),
	to: z.number().optional(),
	count: z.number().optional(),
	skip: z.number().optional(),
});

const SettlementGetInputSchema = z.object({
	id: z.string(),
})

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

const OrdersCreateResponseSchema = RazorpayOrderSchema;
const OrdersGetResponseSchema = RazorpayOrderSchema;
const PaymentsGetResponseSchema = RazorpayPaymentSchema;
const PaymentsListResponseSchema = z
	.object({
		entity: z.literal('collection').optional(),
		count: z.number(),
		items: z.array(RazorpayPaymentSchema),
	})
	.passthrough();
const RefundsCreateResponseSchema = RazorpayRefundSchema;
const CustomersCreateResponseSchema = RazorpayCustomerSchema;
const CustomersGetResponseSchema = RazorpayCustomerSchema;
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

export type OrdersCreateInput = z.infer<typeof OrdersCreateInputSchema>;
export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;
export type PaymentsGetInput = z.infer<typeof PaymentsGetInputSchema>;
export type PaymentsListInput = z.infer<typeof PaymentsListInputSchema>;
export type RefundsCreateInput = z.infer<typeof RefundsCreateInputSchema>;
export type CustomersCreateInput = z.infer<typeof CustomersCreateInputSchema>;
export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;
export type SettlementsListInput = z.infer<typeof SettlementsListInputSchema>;
export type SettlementGetInput = z.infer<typeof SettlementGetInputSchema>;
export type SubscriptionsListInput = z.infer<typeof SubscriptionsListInputSchema>;
export type SubscriptionsGetInput = z.infer<typeof SubscriptionsGetInputSchema>;

export type OrdersCreateResponse = z.infer<typeof OrdersCreateResponseSchema>;
export type OrdersGetResponse = z.infer<typeof OrdersGetResponseSchema>;
export type PaymentsGetResponse = z.infer<typeof PaymentsGetResponseSchema>;
export type PaymentsListResponse = z.infer<typeof PaymentsListResponseSchema>;
export type RefundsCreateResponse = z.infer<typeof RefundsCreateResponseSchema>;
export type CustomersCreateResponse = z.infer<typeof CustomersCreateResponseSchema>;
export type CustomersGetResponse = z.infer<typeof CustomersGetResponseSchema>;
export type SettlementsListResponse = z.infer<typeof SettlementsListResponseSchema>;
export type SettlementsGetResponse = z.infer<typeof SettlementsGetResponseSchema>;
export type SubscriptionsListResponse = z.infer<typeof SubscriptionsListResponseSchema>;
export type SubscriptionsGetResponse = z.infer<typeof SubscriptionsGetResponseSchema>;

export type RazorpayEndpointInputs = {
	ordersCreate: OrdersCreateInput;
	ordersGet: OrdersGetInput;
	paymentsGet: PaymentsGetInput;
	paymentsList: PaymentsListInput;
	refundsCreate: RefundsCreateInput;
	customersCreate: CustomersCreateInput;
	customersGet: CustomersGetInput;
	settlementsList: SettlementsListInput;
	settlementsGet: SettlementGetInput;
	subscriptionsList: SubscriptionsListInput;
	subscriptionsGet: SubscriptionsGetInput;
};

export type RazorpayEndpointOutputs = {
	ordersCreate: OrdersCreateResponse;
	ordersGet: OrdersGetResponse;
	paymentsGet: PaymentsGetResponse;
	paymentsList: PaymentsListResponse;
	refundsCreate: RefundsCreateResponse;
	customersCreate: CustomersCreateResponse;
	customersGet: CustomersGetResponse;
	settlementsList: SettlementsListResponse;
	settlementsGet: SettlementsGetResponse;
	subscriptionsList: SubscriptionsListResponse;
	subscriptionsGet: SubscriptionsGetResponse;
};

export const RazorpayEndpointInputSchemas = {
	ordersCreate: OrdersCreateInputSchema,
	ordersGet: OrdersGetInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	paymentsList: PaymentsListInputSchema,
	refundsCreate: RefundsCreateInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersGet: CustomersGetInputSchema,
	settlementsList: SettlementsListInputSchema,
	settlementsGet: SettlementGetInputSchema,
	subscriptionsList: SubscriptionsListInputSchema,
	subscriptionsGet: SubscriptionsGetInputSchema,
} as const;

export const RazorpayEndpointOutputSchemas = {
	ordersCreate: OrdersCreateResponseSchema,
	ordersGet: OrdersGetResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	refundsCreate: RefundsCreateResponseSchema,
	customersCreate: CustomersCreateResponseSchema,
	customersGet: CustomersGetResponseSchema,
	settlementsList: SettlementsListResponseSchema,
	settlementsGet: SettlementsGetResponseSchema,
	subscriptionsList: SubscriptionsListResponseSchema,
	subscriptionsGet: SubscriptionsGetResponseSchema,
} as const;
