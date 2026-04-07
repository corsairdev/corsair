import { z } from 'zod';

export const RazorpayOrder = z.object({
	id: z.string(),
	amount: z.number(),
	amount_paid: z.number().optional(),
	amount_due: z.number().optional(),
	currency: z.string(),
	receipt: z.string().nullable().optional(),
	offer_id: z.string().nullable().optional(),
	status: z.string(),
	attempts: z.number().optional(),
	notes: z.union([z.record(z.string()), z.array(z.unknown())]).optional(),
	created_at: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const RazorpayPayment = z.object({
	id: z.string(),
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
	notes: z.union([z.record(z.string()), z.array(z.unknown())]).optional(),
	created_at: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const RazorpayRefund = z.object({
	id: z.string(),
	payment_id: z.string(),
	amount: z.number(),
	currency: z.string().nullable().optional(),
	receipt: z.string().nullable().optional(),
	speed_processed: z.string().nullable().optional(),
	speed_requested: z.string().nullable().optional(),
	status: z.string(),
	notes: z.union([z.record(z.string()), z.array(z.unknown())]).optional(),
	created_at: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type RazorpayOrder = z.infer<typeof RazorpayOrder>;
export type RazorpayPayment = z.infer<typeof RazorpayPayment>;
export type RazorpayRefund = z.infer<typeof RazorpayRefund>;
