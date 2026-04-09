import { z } from 'zod';

// Shared notes schema used across all entities.
// z.unknown() is used for array items because the Razorpay API does not
// document a fixed element type for array-style notes; elements can be
// arbitrary values.
export const RazorpayNotesSchema = z.union([
	z.record(z.string()),
	z.array(z.unknown()),
]);

// Base order schema for API responses
export const RazorpayOrderSchema = z
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

// Base payment schema for API responses
export const RazorpayPaymentSchema = z
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

// Base refund schema for API responses
export const RazorpayRefundSchema = z
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

export const RazorpayCustomerSchema = z
	.object({
		id: z.string(),
		entity: z.literal('customer'),
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		contact: z.string().nullable().optional(),
		gstin: z.string().nullable().optional(),
		notes: RazorpayNotesSchema.optional(),
		created_at: z.number().optional(),
	})
	.passthrough();

// Database schemas (extend base schemas with createdAt for DB storage)
export const RazorpayOrder = RazorpayOrderSchema.extend({
	createdAt: z.coerce.date().nullable().optional(),
});

export const RazorpayPayment = RazorpayPaymentSchema.extend({
	createdAt: z.coerce.date().nullable().optional(),
});

export const RazorpayRefund = RazorpayRefundSchema.extend({
	createdAt: z.coerce.date().nullable().optional(),
});

export const RazorpayCustomer = RazorpayCustomerSchema.extend({
	createdAt: z.coerce.date().nullable().optional(),
});
// Type exports
export type RazorpayOrderData = z.infer<typeof RazorpayOrderSchema>;
export type RazorpayPaymentData = z.infer<typeof RazorpayPaymentSchema>;
export type RazorpayRefundData = z.infer<typeof RazorpayRefundSchema>;
export type RazorpayCustomerData = z.infer<typeof RazorpayCustomerSchema>;

export type RazorpayOrder = z.infer<typeof RazorpayOrder>;
export type RazorpayPayment = z.infer<typeof RazorpayPayment>;
export type RazorpayRefund = z.infer<typeof RazorpayRefund>;
export type RazorpayCustomer = z.infer<typeof RazorpayCustomer>;
