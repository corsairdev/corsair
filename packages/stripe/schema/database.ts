import { z } from 'zod';

export const StripeBalance = z.object({
	id: z.string(), // fixed as 'balance' since there's only one per account
	object: z.literal('balance').optional(),
	livemode: z.boolean().optional(),
	available: z
		.array(z.object({ amount: z.number(), currency: z.string() }).passthrough())
		.optional(),
	pending: z
		.array(z.object({ amount: z.number(), currency: z.string() }).passthrough())
		.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const StripeCharge = z.object({
	id: z.string(),
	amount: z.number(),
	currency: z.string(),
	status: z.string(),
	customer: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	paid: z.boolean().optional(),
	refunded: z.boolean().optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	payment_intent: z.string().nullable().optional(),
	failure_code: z.string().nullable().optional(),
	failure_message: z.string().nullable().optional(),
	metadata: z.record(z.string()).optional(),
});

export const StripeCoupon = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	amount_off: z.number().nullable().optional(),
	percent_off: z.number().nullable().optional(),
	currency: z.string().nullable().optional(),
	duration: z.string().optional(),
	duration_in_months: z.number().nullable().optional(),
	max_redemptions: z.number().nullable().optional(),
	times_redeemed: z.number().optional(),
	valid: z.boolean().optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	livemode: z.boolean().optional(),
	metadata: z.record(z.string()).optional(),
});

export const StripeCustomer = z.object({
	id: z.string(),
	email: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	currency: z.string().nullable().optional(),
	balance: z.number().optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	livemode: z.boolean().optional(),
	metadata: z.record(z.string()).optional(),
});

export const StripePaymentIntent = z.object({
	id: z.string(),
	amount: z.number(),
	currency: z.string(),
	status: z.string(),
	customer: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	payment_method: z.string().nullable().optional(),
	client_secret: z.string().nullable().optional(),
	canceled_at: z.number().nullable().optional(),
	cancellation_reason: z.string().nullable().optional(),
	metadata: z.record(z.string()).optional(),
});

export const StripePrice = z.object({
	id: z.string(),
	active: z.boolean().optional(),
	currency: z.string().optional(),
	unit_amount: z.number().nullable().optional(),
	nickname: z.string().nullable().optional(),
	product: z.string().optional(),
	type: z.string().optional(),
	recurring: z
		.object({
			interval: z.string(),
			interval_count: z.number(),
		})
		.nullable()
		.optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	livemode: z.boolean().optional(),
	metadata: z.record(z.string()).optional(),
});

export const StripeSource = z.object({
	id: z.string(),
	type: z.string().optional(),
	amount: z.number().nullable().optional(),
	currency: z.string().nullable().optional(),
	status: z.string().optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	livemode: z.boolean().optional(),
	metadata: z.record(z.string()).optional(),
});

export type StripeBalance = z.infer<typeof StripeBalance>;
export type StripeCharge = z.infer<typeof StripeCharge>;
export type StripeCoupon = z.infer<typeof StripeCoupon>;
export type StripeCustomer = z.infer<typeof StripeCustomer>;
export type StripePaymentIntent = z.infer<typeof StripePaymentIntent>;
export type StripePrice = z.infer<typeof StripePrice>;
export type StripeSource = z.infer<typeof StripeSource>;
