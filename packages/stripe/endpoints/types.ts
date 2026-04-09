import { z } from 'zod';

// ── Input Schemas ─────────────────────────────────────────────────────────────

const BalanceGetInputSchema = z.object({});

const ChargesCreateInputSchema = z.object({
	amount: z.number(),
	currency: z.string(),
	source: z.string().optional(),
	customer: z.string().optional(),
	description: z.string().optional(),
	metadata: z.record(z.string()).optional(),
});

const ChargesGetInputSchema = z.object({
	id: z.string(),
});

const ChargesListInputSchema = z.object({
	customer: z.string().optional(),
	payment_intent: z.string().optional(),
	limit: z.number().optional(),
	starting_after: z.string().optional(),
	ending_before: z.string().optional(),
});

const ChargesUpdateInputSchema = z.object({
	id: z.string(),
	description: z.string().optional(),
	metadata: z.record(z.string()).optional(),
	receipt_email: z.string().optional(),
	// unknown: shipping is a freeform Stripe object (address, tracking, etc.) with no fixed schema
	shipping: z.record(z.unknown()).optional(),
});

const CouponsCreateInputSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	amount_off: z.number().optional(),
	percent_off: z.number().optional(),
	currency: z.string().optional(),
	duration: z.enum(['forever', 'once', 'repeating']).optional(),
	duration_in_months: z.number().optional(),
	max_redemptions: z.number().optional(),
	metadata: z.record(z.string()).optional(),
});

const CouponsListInputSchema = z.object({
	limit: z.number().optional(),
	starting_after: z.string().optional(),
	ending_before: z.string().optional(),
});

const CustomersCreateInputSchema = z.object({
	email: z.string().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
	description: z.string().optional(),
	metadata: z.record(z.string()).optional(),
});

const CustomersDeleteInputSchema = z.object({
	id: z.string(),
});

const CustomersGetInputSchema = z.object({
	id: z.string(),
});

const CustomersListInputSchema = z.object({
	email: z.string().optional(),
	limit: z.number().optional(),
	starting_after: z.string().optional(),
	ending_before: z.string().optional(),
});

const PaymentIntentsCreateInputSchema = z.object({
	amount: z.number(),
	currency: z.string(),
	customer: z.string().optional(),
	description: z.string().optional(),
	payment_method: z.string().optional(),
	confirm: z.boolean().optional(),
	metadata: z.record(z.string()).optional(),
});

const PaymentIntentsGetInputSchema = z.object({
	id: z.string(),
});

const PaymentIntentsListInputSchema = z.object({
	customer: z.string().optional(),
	limit: z.number().optional(),
	starting_after: z.string().optional(),
	ending_before: z.string().optional(),
});

const PaymentIntentsUpdateInputSchema = z.object({
	id: z.string(),
	amount: z.number().optional(),
	currency: z.string().optional(),
	customer: z.string().optional(),
	description: z.string().optional(),
	payment_method: z.string().optional(),
	metadata: z.record(z.string()).optional(),
});

const PricesCreateInputSchema = z.object({
	currency: z.string(),
	unit_amount: z.number().optional(),
	product: z.string().optional(),
	product_data: z.object({ name: z.string() }).passthrough().optional(),
	nickname: z.string().optional(),
	recurring: z
		.object({
			interval: z.enum(['day', 'week', 'month', 'year']),
			interval_count: z.number().optional(),
		})
		.optional(),
	metadata: z.record(z.string()).optional(),
});

const PricesListInputSchema = z.object({
	active: z.boolean().optional(),
	currency: z.string().optional(),
	product: z.string().optional(),
	type: z.enum(['one_time', 'recurring']).optional(),
	limit: z.number().optional(),
	starting_after: z.string().optional(),
	ending_before: z.string().optional(),
});

const SourcesCreateInputSchema = z.object({
	type: z.string(),
	amount: z.number().optional(),
	currency: z.string().optional(),
	flow: z.string().optional(),
	// unknown: owner is a freeform address/contact object whose fields vary by source type
	owner: z.record(z.unknown()).optional(),
	// unknown: redirect params (return_url, etc.) vary by source type and payment flow
	redirect: z.record(z.unknown()).optional(),
	metadata: z.record(z.string()).optional(),
	token: z.string().optional(),
});

const SourcesGetInputSchema = z.object({
	id: z.string(),
});

const TokensCreateInputSchema = z.object({
	// card details are sensitive — passthrough allows arbitrary card token data
	card: z.object({}).passthrough().optional(),
	// unknown: bank account token fields vary by country and account type (routing/account numbers, etc.)
	bank_account: z.record(z.unknown()).optional(),
	// unknown: PII token data has no fixed shape in the Stripe API
	pii: z.record(z.unknown()).optional(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const StripeBalanceSchema = z
	.object({
		object: z.literal('balance'),
		livemode: z.boolean().optional(),
		available: z
			.array(
				z.object({ amount: z.number(), currency: z.string() }).passthrough(),
			)
			.optional(),
		pending: z
			.array(
				z.object({ amount: z.number(), currency: z.string() }).passthrough(),
			)
			.optional(),
	})
	.passthrough();

const StripeChargeSchema = z
	.object({
		id: z.string(),
		object: z.literal('charge'),
		amount: z.number(),
		currency: z.string(),
		status: z.string(),
		customer: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		paid: z.boolean().optional(),
		refunded: z.boolean().optional(),
		created: z.number().optional(),
		payment_intent: z.string().nullable().optional(),
		failure_code: z.string().nullable().optional(),
		failure_message: z.string().nullable().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();

const StripeCouponSchema = z
	.object({
		id: z.string(),
		object: z.literal('coupon'),
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
		livemode: z.boolean().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();

const StripeCustomerSchema = z
	.object({
		id: z.string(),
		object: z.literal('customer'),
		email: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		balance: z.number().optional(),
		created: z.number().optional(),
		livemode: z.boolean().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();

const StripePaymentIntentSchema = z
	.object({
		id: z.string(),
		object: z.literal('payment_intent'),
		amount: z.number(),
		currency: z.string(),
		status: z.string(),
		customer: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		created: z.number().optional(),
		payment_method: z.string().nullable().optional(),
		client_secret: z.string().nullable().optional(),
		canceled_at: z.number().nullable().optional(),
		cancellation_reason: z.string().nullable().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();

const StripePriceSchema = z
	.object({
		id: z.string(),
		object: z.literal('price'),
		active: z.boolean().optional(),
		currency: z.string().optional(),
		unit_amount: z.number().nullable().optional(),
		nickname: z.string().nullable().optional(),
		product: z.string().optional(),
		type: z.string().optional(),
		recurring: z
			.object({ interval: z.string(), interval_count: z.number() })
			.nullable()
			.optional(),
		created: z.number().optional(),
		livemode: z.boolean().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();

const StripeSourceSchema = z
	.object({
		id: z.string(),
		object: z.literal('source'),
		type: z.string().optional(),
		amount: z.number().nullable().optional(),
		currency: z.string().nullable().optional(),
		status: z.string().optional(),
		created: z.number().optional(),
		livemode: z.boolean().optional(),
		metadata: z.record(z.string()).optional(),
	})
	.passthrough();

const StripeTokenSchema = z
	.object({
		id: z.string(),
		object: z.literal('token'),
		type: z.string().optional(),
		created: z.number().optional(),
		livemode: z.boolean().optional(),
	})
	.passthrough();

const StripeDeleteResponseSchema = z
	.object({
		id: z.string(),
		object: z.literal('customer'),
		deleted: z.literal(true),
	})
	.passthrough();

const StripeListMetaSchema = z.object({
	object: z.literal('list'),
	url: z.string().optional(),
	has_more: z.boolean().optional(),
});

const ChargesListResponseSchema = StripeListMetaSchema.extend({
	data: z.array(StripeChargeSchema),
}).passthrough();

const CouponsListResponseSchema = StripeListMetaSchema.extend({
	data: z.array(StripeCouponSchema),
}).passthrough();

const CustomersListResponseSchema = StripeListMetaSchema.extend({
	data: z.array(StripeCustomerSchema),
}).passthrough();

const PaymentIntentsListResponseSchema = StripeListMetaSchema.extend({
	data: z.array(StripePaymentIntentSchema),
}).passthrough();

const PricesListResponseSchema = StripeListMetaSchema.extend({
	data: z.array(StripePriceSchema),
}).passthrough();

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export const StripeEndpointInputSchemas = {
	balanceGet: BalanceGetInputSchema,
	chargesCreate: ChargesCreateInputSchema,
	chargesGet: ChargesGetInputSchema,
	chargesList: ChargesListInputSchema,
	chargesUpdate: ChargesUpdateInputSchema,
	couponsCreate: CouponsCreateInputSchema,
	couponsList: CouponsListInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersDelete: CustomersDeleteInputSchema,
	customersGet: CustomersGetInputSchema,
	customersList: CustomersListInputSchema,
	paymentIntentsCreate: PaymentIntentsCreateInputSchema,
	paymentIntentsGet: PaymentIntentsGetInputSchema,
	paymentIntentsList: PaymentIntentsListInputSchema,
	paymentIntentsUpdate: PaymentIntentsUpdateInputSchema,
	pricesCreate: PricesCreateInputSchema,
	pricesList: PricesListInputSchema,
	sourcesCreate: SourcesCreateInputSchema,
	sourcesGet: SourcesGetInputSchema,
	tokensCreate: TokensCreateInputSchema,
} as const;

export type StripeEndpointInputs = {
	[K in keyof typeof StripeEndpointInputSchemas]: z.infer<
		(typeof StripeEndpointInputSchemas)[K]
	>;
};

export const StripeEndpointOutputSchemas = {
	balanceGet: StripeBalanceSchema,
	chargesCreate: StripeChargeSchema,
	chargesGet: StripeChargeSchema,
	chargesList: ChargesListResponseSchema,
	chargesUpdate: StripeChargeSchema,
	couponsCreate: StripeCouponSchema,
	couponsList: CouponsListResponseSchema,
	customersCreate: StripeCustomerSchema,
	customersDelete: StripeDeleteResponseSchema,
	customersGet: StripeCustomerSchema,
	customersList: CustomersListResponseSchema,
	paymentIntentsCreate: StripePaymentIntentSchema,
	paymentIntentsGet: StripePaymentIntentSchema,
	paymentIntentsList: PaymentIntentsListResponseSchema,
	paymentIntentsUpdate: StripePaymentIntentSchema,
	pricesCreate: StripePriceSchema,
	pricesList: PricesListResponseSchema,
	sourcesCreate: StripeSourceSchema,
	sourcesGet: StripeSourceSchema,
	tokensCreate: StripeTokenSchema,
} as const;

export type StripeEndpointOutputs = {
	[K in keyof typeof StripeEndpointOutputSchemas]: z.infer<
		(typeof StripeEndpointOutputSchemas)[K]
	>;
};

// ── Individual Input type aliases ─────────────────────────────────────────────

export type BalanceGetInput = StripeEndpointInputs['balanceGet'];
export type ChargesCreateInput = StripeEndpointInputs['chargesCreate'];
export type ChargesGetInput = StripeEndpointInputs['chargesGet'];
export type ChargesListInput = StripeEndpointInputs['chargesList'];
export type ChargesUpdateInput = StripeEndpointInputs['chargesUpdate'];
export type CouponsCreateInput = StripeEndpointInputs['couponsCreate'];
export type CouponsListInput = StripeEndpointInputs['couponsList'];
export type CustomersCreateInput = StripeEndpointInputs['customersCreate'];
export type CustomersDeleteInput = StripeEndpointInputs['customersDelete'];
export type CustomersGetInput = StripeEndpointInputs['customersGet'];
export type CustomersListInput = StripeEndpointInputs['customersList'];
export type PaymentIntentsCreateInput =
	StripeEndpointInputs['paymentIntentsCreate'];
export type PaymentIntentsGetInput = StripeEndpointInputs['paymentIntentsGet'];
export type PaymentIntentsListInput =
	StripeEndpointInputs['paymentIntentsList'];
export type PaymentIntentsUpdateInput =
	StripeEndpointInputs['paymentIntentsUpdate'];
export type PricesCreateInput = StripeEndpointInputs['pricesCreate'];
export type PricesListInput = StripeEndpointInputs['pricesList'];
export type SourcesCreateInput = StripeEndpointInputs['sourcesCreate'];
export type SourcesGetInput = StripeEndpointInputs['sourcesGet'];
export type TokensCreateInput = StripeEndpointInputs['tokensCreate'];

// ── Individual Response type aliases ─────────────────────────────────────────

export type BalanceGetResponse = StripeEndpointOutputs['balanceGet'];
export type ChargesCreateResponse = StripeEndpointOutputs['chargesCreate'];
export type ChargesGetResponse = StripeEndpointOutputs['chargesGet'];
export type ChargesListResponse = StripeEndpointOutputs['chargesList'];
export type ChargesUpdateResponse = StripeEndpointOutputs['chargesUpdate'];
export type CouponsCreateResponse = StripeEndpointOutputs['couponsCreate'];
export type CouponsListResponse = StripeEndpointOutputs['couponsList'];
export type CustomersCreateResponse = StripeEndpointOutputs['customersCreate'];
export type CustomersDeleteResponse = StripeEndpointOutputs['customersDelete'];
export type CustomersGetResponse = StripeEndpointOutputs['customersGet'];
export type CustomersListResponse = StripeEndpointOutputs['customersList'];
export type PaymentIntentsCreateResponse =
	StripeEndpointOutputs['paymentIntentsCreate'];
export type PaymentIntentsGetResponse =
	StripeEndpointOutputs['paymentIntentsGet'];
export type PaymentIntentsListResponse =
	StripeEndpointOutputs['paymentIntentsList'];
export type PaymentIntentsUpdateResponse =
	StripeEndpointOutputs['paymentIntentsUpdate'];
export type PricesCreateResponse = StripeEndpointOutputs['pricesCreate'];
export type PricesListResponse = StripeEndpointOutputs['pricesList'];
export type SourcesCreateResponse = StripeEndpointOutputs['sourcesCreate'];
export type SourcesGetResponse = StripeEndpointOutputs['sourcesGet'];
export type TokensCreateResponse = StripeEndpointOutputs['tokensCreate'];
