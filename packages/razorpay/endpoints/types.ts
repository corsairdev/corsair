import { z } from 'zod';
import {
	RazorpayCustomerSchema,
	RazorpayNotesSchema,
	RazorpayOrderSchema,
	RazorpayPaymentSchema,
	RazorpayRefundSchema,
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

export type OrdersCreateInput = z.infer<typeof OrdersCreateInputSchema>;
export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;
export type PaymentsGetInput = z.infer<typeof PaymentsGetInputSchema>;
export type PaymentsListInput = z.infer<typeof PaymentsListInputSchema>;
export type RefundsCreateInput = z.infer<typeof RefundsCreateInputSchema>;
export type CustomersCreateInput = z.infer<typeof CustomersCreateInputSchema>;
export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;

export type OrdersCreateResponse = z.infer<typeof OrdersCreateResponseSchema>;
export type OrdersGetResponse = z.infer<typeof OrdersGetResponseSchema>;
export type PaymentsGetResponse = z.infer<typeof PaymentsGetResponseSchema>;
export type PaymentsListResponse = z.infer<typeof PaymentsListResponseSchema>;
export type RefundsCreateResponse = z.infer<typeof RefundsCreateResponseSchema>;
export type CustomersCreateResponse = z.infer<
	typeof CustomersCreateResponseSchema
>;
export type CustomersGetResponse = z.infer<typeof CustomersGetResponseSchema>;

export type RazorpayEndpointInputs = {
	ordersCreate: OrdersCreateInput;
	ordersGet: OrdersGetInput;
	paymentsGet: PaymentsGetInput;
	paymentsList: PaymentsListInput;
	refundsCreate: RefundsCreateInput;
	customersCreate: CustomersCreateInput;
	customersGet: CustomersGetInput;
};

export type RazorpayEndpointOutputs = {
	ordersCreate: OrdersCreateResponse;
	ordersGet: OrdersGetResponse;
	paymentsGet: PaymentsGetResponse;
	paymentsList: PaymentsListResponse;
	refundsCreate: RefundsCreateResponse;
	customersCreate: CustomersCreateResponse;
	customersGet: CustomersGetResponse;
};

export const RazorpayEndpointInputSchemas = {
	ordersCreate: OrdersCreateInputSchema,
	ordersGet: OrdersGetInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	paymentsList: PaymentsListInputSchema,
	refundsCreate: RefundsCreateInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersGet: CustomersGetInputSchema,
} as const;

export const RazorpayEndpointOutputSchemas = {
	ordersCreate: OrdersCreateResponseSchema,
	ordersGet: OrdersGetResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	refundsCreate: RefundsCreateResponseSchema,
	customersCreate: CustomersCreateResponseSchema,
	customersGet: CustomersGetResponseSchema,
} as const;
