import { z } from 'zod';

const RazorpayNotesSchema = z.union([
	z.record(z.string()),
	z.array(z.unknown()),
]);

const RazorpayOrderSchema = z
	.object({
		id: z.string(),
		entity: z.literal('order'),
		amount: z.number(),
		amount_paid: z.number().optional(),
		amount_due: z.number().optional(),
		currency: z.string(),
		receipt: z.string().nullable().optional(),
		offer_id: z.string().nullable().optional(),
		status: z.string(),
		attempts: z.number().optional(),
		notes: RazorpayNotesSchema.optional(),
		created_at: z.number().optional(),
	})
	.passthrough();

const RazorpayPaymentSchema = z
	.object({
		id: z.string(),
		entity: z.literal('payment'),
		amount: z.number(),
		currency: z.string(),
		status: z.string(),
		order_id: z.string().nullable().optional(),
		invoice_id: z.string().nullable().optional(),
		method: z.string().nullable().optional(),
		captured: z.boolean().optional(),
		description: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		contact: z.string().nullable().optional(),
		notes: RazorpayNotesSchema.optional(),
		created_at: z.number().optional(),
	})
	.passthrough();

const RazorpayRefundSchema = z
	.object({
		id: z.string(),
		entity: z.literal('refund'),
		payment_id: z.string(),
		amount: z.number(),
		currency: z.string().nullable().optional(),
		notes: RazorpayNotesSchema.optional(),
		receipt: z.string().nullable().optional(),
		speed_processed: z.string().nullable().optional(),
		speed_requested: z.string().nullable().optional(),
		status: z.string(),
		created_at: z.number().optional(),
	})
	.passthrough();

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

export type OrdersCreateInput = z.infer<typeof OrdersCreateInputSchema>;
export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;
export type PaymentsGetInput = z.infer<typeof PaymentsGetInputSchema>;
export type PaymentsListInput = z.infer<typeof PaymentsListInputSchema>;
export type RefundsCreateInput = z.infer<typeof RefundsCreateInputSchema>;

export type OrdersCreateResponse = z.infer<typeof OrdersCreateResponseSchema>;
export type OrdersGetResponse = z.infer<typeof OrdersGetResponseSchema>;
export type PaymentsGetResponse = z.infer<typeof PaymentsGetResponseSchema>;
export type PaymentsListResponse = z.infer<typeof PaymentsListResponseSchema>;
export type RefundsCreateResponse = z.infer<typeof RefundsCreateResponseSchema>;

export type RazorpayEndpointInputs = {
	ordersCreate: OrdersCreateInput;
	ordersGet: OrdersGetInput;
	paymentsGet: PaymentsGetInput;
	paymentsList: PaymentsListInput;
	refundsCreate: RefundsCreateInput;
};

export type RazorpayEndpointOutputs = {
	ordersCreate: OrdersCreateResponse;
	ordersGet: OrdersGetResponse;
	paymentsGet: PaymentsGetResponse;
	paymentsList: PaymentsListResponse;
	refundsCreate: RefundsCreateResponse;
};

export const RazorpayEndpointInputSchemas = {
	ordersCreate: OrdersCreateInputSchema,
	ordersGet: OrdersGetInputSchema,
	paymentsGet: PaymentsGetInputSchema,
	paymentsList: PaymentsListInputSchema,
	refundsCreate: RefundsCreateInputSchema,
} as const;

export const RazorpayEndpointOutputSchemas = {
	ordersCreate: OrdersCreateResponseSchema,
	ordersGet: OrdersGetResponseSchema,
	paymentsGet: PaymentsGetResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	refundsCreate: RefundsCreateResponseSchema,
} as const;
