import { z } from 'zod';
import {
	DodoCustomerSchema,
	DodoPaymentSchema,
	DodoRefundSchema,
	DodoSubscriptionSchema,
} from '../schema/database';

const PaymentsCreateInputSchema = z.object({
	amount: z.number().int().positive(),
	currency: z.string().min(1),
	customer_id: z.string().optional(),
	payment_method: z.string().optional(),
	metadata: z.record(z.any()).optional(),
});

const PaymentsGetInputSchema = z.object({
	id: z.string(),
});

const PaymentsListInputSchema = z.object({
	limit: z.number().int().positive().max(100).optional(),
	starting_after: z.string().optional(),
	ending_before: z.string().optional(),
});

const RefundsCreateInputSchema = z.object({
	payment_id: z.string(),
	amount: z.number().int().positive().optional(),
	reason: z.string().optional(),
});

const CustomersCreateInputSchema = z.object({
	name: z.string(),
	email: z.string().email(),
	phone_number: z.string().optional(),
});

const CustomersGetInputSchema = z.object({
	id: z.string(),
});

const SubscriptionsCreateInputSchema = z.object({
	customer_id: z.string(),
	plan_id: z.string(),
	quantity: z.number().int().positive().optional(),
});

const SubscriptionsGetInputSchema = z.object({
	id: z.string(),
});

const SubscriptionsCancelInputSchema = z.object({
	id: z.string(),
});

const PaymentsCreateResponseSchema = DodoPaymentSchema;
const PaymentsGetResponseSchema = DodoPaymentSchema;
const PaymentsListResponseSchema = z
	.object({
		data: z.array(DodoPaymentSchema),
		has_more: z.boolean().optional(),
	})
	.passthrough();

const RefundsCreateResponseSchema = DodoRefundSchema;
const CustomersCreateResponseSchema = DodoCustomerSchema;
const CustomersGetResponseSchema = DodoCustomerSchema;
const SubscriptionsCreateResponseSchema = DodoSubscriptionSchema;
const SubscriptionsGetResponseSchema = DodoSubscriptionSchema;
const SubscriptionsCancelResponseSchema = DodoSubscriptionSchema;

export type PaymentsCreateInput = z.infer<typeof PaymentsCreateInputSchema>;
export type PaymentsGetInput = z.infer<typeof PaymentsGetInputSchema>;
export type PaymentsListInput = z.infer<typeof PaymentsListInputSchema>;
export type RefundsCreateInput = z.infer<typeof RefundsCreateInputSchema>;
export type CustomersCreateInput = z.infer<typeof CustomersCreateInputSchema>;
export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;
export type SubscriptionsCreateInput = z.infer<
	typeof SubscriptionsCreateInputSchema
>;
export type SubscriptionsGetInput = z.infer<typeof SubscriptionsGetInputSchema>;
export type SubscriptionsCancelInput = z.infer<
	typeof SubscriptionsCancelInputSchema
>;

export type PaymentsCreateResponse = z.infer<
	typeof PaymentsCreateResponseSchema
>;
export type PaymentsGetResponse = z.infer<typeof PaymentsGetResponseSchema>;
export type PaymentsListResponse = z.infer<typeof PaymentsListResponseSchema>;
export type RefundsCreateResponse = z.infer<typeof RefundsCreateResponseSchema>;
export type CustomersCreateResponse = z.infer<
	typeof CustomersCreateResponseSchema
>;
export type CustomersGetResponse = z.infer<typeof CustomersGetResponseSchema>;
export type SubscriptionsCreateResponse = z.infer<
	typeof SubscriptionsCreateResponseSchema
>;
export type SubscriptionsGetResponse = z.infer<
	typeof SubscriptionsGetResponseSchema
>;
export type SubscriptionsCancelResponse = z.infer<
	typeof SubscriptionsCancelResponseSchema
>;

export type DodoPaymentsEndpointInputs = {
	paymentsCreate: PaymentsCreateInput;
	paymentsGet: PaymentsGetInput;
	paymentsList: PaymentsListInput;
	refundsCreate: RefundsCreateInput;
	customersCreate: CustomersCreateInput;
	customersGet: CustomersGetInput;
	subscriptionsCreate: SubscriptionsCreateInput;
	subscriptionsGet: SubscriptionsGetInput;
	subscriptionsCancel: SubscriptionsCancelInput;
};

export type DodoPaymentsEndpointOutputs = {
	paymentsCreate: PaymentsCreateResponse;
	paymentsGet: PaymentsGetResponse;
	paymentsList: PaymentsListResponse;
	refundsCreate: RefundsCreateResponse;
	customersCreate: CustomersCreateResponse;
	customersGet: CustomersGetResponse;
	subscriptionsCreate: SubscriptionsCreateResponse;
	subscriptionsGet: SubscriptionsGetResponse;
	subscriptionsCancel: SubscriptionsCancelResponse;
};

export const DodoPaymentsEndpointInputSchemas = {
	paymentsCreate: PaymentsCreateInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	paymentsList: PaymentsListInputSchema,
	refundsCreate: RefundsCreateInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersGet: CustomersGetInputSchema,
	subscriptionsCreate: SubscriptionsCreateInputSchema,
	subscriptionsGet: SubscriptionsGetInputSchema,
	subscriptionsCancel: SubscriptionsCancelInputSchema,
} as const;

export const DodoPaymentsEndpointOutputSchemas = {
	paymentsCreate: PaymentsCreateResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	refundsCreate: RefundsCreateResponseSchema,
	customersCreate: CustomersCreateResponseSchema,
	customersGet: CustomersGetResponseSchema,
	subscriptionsCreate: SubscriptionsCreateResponseSchema,
	subscriptionsGet: SubscriptionsGetResponseSchema,
	subscriptionsCancel: SubscriptionsCancelResponseSchema,
} as const;
