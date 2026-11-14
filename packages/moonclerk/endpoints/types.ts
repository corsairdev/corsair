import { z } from 'zod';

const integer = z.number().int();
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
		id: integer.optional(),
		type: z.string().optional(),
		response: z
			.union([z.string(), z.number(), z.boolean(), z.null(), address])
			.optional(),
	})
	.passthrough();
const customFields = z.record(z.string(), customField);
const paymentMethod = z
	.object({
		type: z.string().optional(),
		last4: z.string().optional(),
		exp_month: nullableInteger,
		exp_year: nullableInteger,
		brand: z.string().optional(),
	})
	.passthrough();
const coupon = z
	.object({
		code: z.string().optional(),
		duration: z.string().optional(),
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
		coupon: coupon.optional(),
		starts_at: nullableString,
		ends_at: nullableString,
	})
	.passthrough();
const checkout = z
	.object({
		amount_due: integer.optional(),
		coupon_amount: nullableInteger,
		coupon_code: nullableString,
		date: z.string().optional(),
		fee: integer.optional(),
		subtotal: integer.optional(),
		token: z.string().optional(),
		total: integer.optional(),
		trial_period_days: nullableInteger,
		upfront_amount: nullableInteger,
	})
	.passthrough();
const plan = z
	.object({
		id: integer.optional(),
		plan_reference: nullableString,
		amount: integer.optional(),
		amount_description: nullableString,
		currency: z.string().optional(),
		interval: z.string().optional(),
		interval_count: integer.optional(),
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
		id: integer.optional(),
		subscription_reference: nullableString,
		status: subscriptionStatus.optional(),
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
		plan: plan.optional(),
	})
	.passthrough();
export const MoonClerkFormSchema = z
	.object({
		id: integer.optional(),
		title: z.string().optional(),
		access_token: z.string().optional(),
		currency: z.string().optional(),
		payment_volume: integer.optional(),
		successful_checkout_count: integer.optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
export const MoonClerkCustomerSchema = z
	.object({
		id: integer.optional(),
		account_balance: integer.optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		payment_method: paymentMethod.optional(),
		custom_id: nullableString,
		customer_reference: nullableString,
		discount: discount.nullable().optional(),
		delinquent: z.boolean().optional(),
		management_url: z.string().optional(),
		custom_fields: customFields.optional(),
		form_id: integer.optional(),
		checkout: checkout.optional(),
		subscription: subscription.optional(),
	})
	.passthrough();
export const MoonClerkPaymentSchema = z
	.object({
		id: integer.optional(),
		date: z.string().optional(),
		status: paymentStatus.optional(),
		currency: z.string().optional(),
		amount: integer.optional(),
		fee: integer.optional(),
		amount_refunded: integer.optional(),
		amount_description: nullableString,
		name: z.string().optional(),
		email: z.string().optional(),
		payment_method: paymentMethod.optional(),
		charge_reference: nullableString,
		customer_id: nullableInteger,
		customer_reference: nullableString,
		invoice_reference: nullableString,
		custom_fields: customFields.optional(),
		form_id: integer.optional(),
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
