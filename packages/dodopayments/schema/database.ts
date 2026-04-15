import { z } from 'zod';

export const DodoPaymentSchema = z
	.object({
		id: z.string(),
		amount: z.number(),
		currency: z.string(),
		status: z.string(),
		customer_id: z.string().nullable().optional(),
		subscription_id: z.string().nullable().optional(),
		billing: z.record(z.any()).nullable().optional(),
		payment_link: z.string().nullable().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const DodoRefundSchema = z
	.object({
		id: z.string(),
		payment_id: z.string(),
		amount: z.number(),
		status: z.string(),
		reason: z.string().nullable().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const DodoCustomerSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const DodoSubscriptionSchema = z
	.object({
		id: z.string(),
		customer_id: z.string(),
		plan_id: z.string().nullable().optional(),
		status: z.string(),
		billing_cycle: z.record(z.any()).nullable().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

// Database schemas (extend base schemas with createdAt for DB storage)
export const DodoPayment = DodoPaymentSchema.extend({
	createdAt: z.coerce.date().nullable().optional(),
});

export const DodoRefund = DodoRefundSchema.extend({
	createdAt: z.coerce.date().nullable().optional(),
});

export const DodoCustomer = DodoCustomerSchema.extend({
	createdAt: z.coerce.date().nullable().optional(),
});

export const DodoSubscription = DodoSubscriptionSchema.extend({
	createdAt: z.coerce.date().nullable().optional(),
});

// Type exports
export type DodoPaymentData = z.infer<typeof DodoPaymentSchema>;
export type DodoRefundData = z.infer<typeof DodoRefundSchema>;
export type DodoCustomerData = z.infer<typeof DodoCustomerSchema>;
export type DodoSubscriptionData = z.infer<typeof DodoSubscriptionSchema>;

export type DodoPayment = z.infer<typeof DodoPayment>;
export type DodoRefund = z.infer<typeof DodoRefund>;
export type DodoCustomer = z.infer<typeof DodoCustomer>;
export type DodoSubscription = z.infer<typeof DodoSubscription>;
