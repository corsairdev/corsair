import { z } from 'zod';

const integer = z.number().int();
// Responses are parsed leniently: MoonClerk serializes missing values as null
// and may add statuses later, so output fields are nullable and statuses open.
const nullableString = z.string().nullable().optional();
const nullableInteger = integer.nullable().optional();
const address = z
	.object({
		line1: nullableString,
		line2: nullableString,
		city: nullableString,
		state: nullableString,
		postal_code: nullableString,
		country: nullableString,
	})
	.passthrough();
const customField = z
	.object({
		id: integer.nullable().optional(),
		type: z.string().nullable().optional(),
		response: z
			.union([z.string(), z.number(), z.boolean(), z.null(), address])
			.nullable()
			.optional(),
	})
	.passthrough();
const customFields = z.record(z.string(), customField);
const paymentMethod = z
	.object({
		type: z.string().nullable().optional(),
		last4: z.string().nullable().optional(),
		exp_month: nullableInteger,
		exp_year: nullableInteger,
		brand: z.string().nullable().optional(),
	})
	.passthrough();
const coupon = z
	.object({
		code: z.string().nullable().optional(),
		duration: z.string().nullable().optional(),
		amount_off: nullableInteger,
		currency: nullableString,
		percent_off: z.number().nullable().optional(),
		duration_in_months: nullableInteger,
		max_redemptions: nullableInteger,
		redeem_by: nullableString,
	})
	.passthrough();
const discount = z
	.object({
		coupon: coupon.nullable().optional(),
		starts_at: nullableString,
		ends_at: nullableString,
	})
	.passthrough();
const checkout = z
	.object({
		amount_due: integer.nullable().optional(),
		coupon_amount: nullableInteger,
		coupon_code: nullableString,
		date: z.string().nullable().optional(),
		fee: integer.nullable().optional(),
		subtotal: integer.nullable().optional(),
		token: z.string().nullable().optional(),
		total: integer.nullable().optional(),
		trial_period_days: nullableInteger,
		upfront_amount: nullableInteger,
	})
	.passthrough();
const plan = z
	.object({
		id: integer.nullable().optional(),
		plan_reference: nullableString,
		amount: integer.nullable().optional(),
		amount_description: nullableString,
		currency: z.string().nullable().optional(),
		interval: z.string().nullable().optional(),
		interval_count: integer.nullable().optional(),
	})
	.passthrough();
const subscriptionStatus = z.enum([
	'active',
	'canceled',
	'expired',
	'past_due',
	'pending',
	'unpaid',
]);
const paymentStatus = z.enum(['successful', 'refunded', 'failed']);
const subscription = z
	.object({
		id: integer.nullable().optional(),
		subscription_reference: nullableString,
		status: subscriptionStatus.or(z.string()).nullable().optional(),
		start: nullableString,
		first_payment_attempt: nullableString,
		next_payment_attempt: nullableString,
		current_period_start: nullableString,
		current_period_end: nullableString,
		trial_start: nullableString,
		trial_end: nullableString,
		trial_period_days: nullableInteger,
		expires_at: nullableString,
		canceled_at: nullableString,
		ended_at: nullableString,
		plan: plan.nullable().optional(),
	})
	.passthrough();
export const MoonClerkFormSchema = z
	.object({
		id: integer.nullable().optional(),
		title: z.string().nullable().optional(),
		access_token: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		payment_volume: integer.nullable().optional(),
		successful_checkout_count: integer.nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
	})
	.passthrough();
export const MoonClerkCustomerSchema = z
	.object({
		id: integer.nullable().optional(),
		account_balance: integer.nullable().optional(),
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		payment_method: paymentMethod.nullable().optional(),
		custom_id: nullableString,
		customer_reference: nullableString,
		discount: discount.nullable().optional(),
		delinquent: z.boolean().nullable().optional(),
		management_url: z.string().nullable().optional(),
		custom_fields: customFields.nullable().optional(),
		form_id: integer.nullable().optional(),
		checkout: checkout.nullable().optional(),
		subscription: subscription.nullable().optional(),
	})
	.passthrough();
export const MoonClerkPaymentSchema = z
	.object({
		id: integer.nullable().optional(),
		date: z.string().nullable().optional(),
		status: paymentStatus.or(z.string()).nullable().optional(),
		currency: z.string().nullable().optional(),
		amount: integer.nullable().optional(),
		fee: integer.nullable().optional(),
		amount_refunded: integer.nullable().optional(),
		amount_description: nullableString,
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		payment_method: paymentMethod.nullable().optional(),
		charge_reference: nullableString,
		customer_id: nullableInteger,
		customer_reference: nullableString,
		invoice_reference: nullableString,
		custom_fields: customFields.nullable().optional(),
		form_id: integer.nullable().optional(),
		custom_id: nullableString,
		checkout: checkout.nullable().optional(),
		coupon: coupon.nullable().optional(),
	})
	.passthrough();
const paging = {
	count: integer.min(1).max(100).optional(),
	offset: integer.min(0).optional(),
};
const date = z.iso.date().optional();
const id = z.object({ id: integer });
export const MoonClerkEndpointInputSchemas = {
	listForms: z.object(paging),
	getForm: id,
	listCustomers: z.object({
		...paging,
		form_id: integer.optional(),
		checkout_from: date,
		checkout_to: date,
		next_payment_from: date,
		next_payment_to: date,
		status: subscriptionStatus.optional(),
	}),
	getCustomer: id,
	listPayments: z.object({
		...paging,
		form_id: integer.optional(),
		customer_id: integer.optional(),
		date_from: date,
		date_to: date,
		status: paymentStatus.optional(),
	}),
	getPayment: id,
} as const;
export const MoonClerkEndpointOutputSchemas = {
	listForms: z.object({ forms: z.array(MoonClerkFormSchema) }).passthrough(),
	getForm: z.object({ form: MoonClerkFormSchema }).passthrough(),
	listCustomers: z
		.object({ customers: z.array(MoonClerkCustomerSchema) })
		.passthrough(),
	getCustomer: z.object({ customer: MoonClerkCustomerSchema }).passthrough(),
	listPayments: z
		.object({ payments: z.array(MoonClerkPaymentSchema) })
		.passthrough(),
	getPayment: z.object({ payment: MoonClerkPaymentSchema }).passthrough(),
} as const;
export type MoonClerkOperationName = keyof typeof MoonClerkEndpointInputSchemas;
export type MoonClerkEndpointInputs = {
	[K in MoonClerkOperationName]: z.infer<
		(typeof MoonClerkEndpointInputSchemas)[K]
	>;
};
export type MoonClerkEndpointOutputs = {
	[K in MoonClerkOperationName]: z.infer<
		(typeof MoonClerkEndpointOutputSchemas)[K]
	>;
};
