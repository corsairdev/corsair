import { z } from 'zod';

// Shapes follow the SKY API OpenAPI definitions published on
// https://developer.sky.blackbaud.com (Gift, Membership and Payments APIs).

const CurrencySchema = z.object({
	value: z.number(),
});

const FuzzyDateSchema = z.object({
	d: z.number().int().optional(),
	m: z.number().int().optional(),
	y: z.number().int().optional(),
});

const GiftSplitAddSchema = z.object({
	amount: CurrencySchema,
	fund_id: z.string().min(1),
	appeal_id: z.string().optional(),
	campaign_id: z.string().optional(),
	package_id: z.string().optional(),
});

const PaymentAddSchema = z.object({
	payment_method: z
		.string()
		.optional()
		.describe('For example Cash, PersonalCheck, CreditCard, Other.'),
	account_token: z.string().optional(),
	bbps_configuration_id: z.string().optional(),
	bbps_transaction_id: z.string().optional(),
	check_date: FuzzyDateSchema.optional(),
	check_number: z.string().optional(),
	checkout_transaction_id: z.string().optional(),
	charge_transaction: z.boolean().optional(),
	reason: z.string().optional(),
	reference: z.string().optional(),
	reference_date: FuzzyDateSchema.optional(),
	rejection_details: z.string().optional(),
});

const ConstituentCreditSchema = z.object({
	amount: CurrencySchema,
	constituent_id: z.string().min(1),
});

const CustomFieldAddSchema = z.object({
	category: z.string().min(1),
	value: z.union([z.string(), z.number(), z.boolean()]).optional(),
	comment: z.string().optional(),
	date: z.string().optional(),
	parent_id: z.string().optional(),
});

// GiftBatchGiftAdd from the Gift API: amount, constituent_id, gift_splits,
// type and payments are required by Blackbaud.
const GiftBatchGiftAddSchema = z.object({
	amount: CurrencySchema,
	constituent_id: z.string().min(1),
	gift_splits: z.array(GiftSplitAddSchema).min(1),
	type: z
		.string()
		.min(1)
		.describe('Gift type, for example Donation, Pledge or PledgePayment.'),
	payments: z.array(PaymentAddSchema).min(1),
	date: z.string().optional(),
	post_date: z.string().optional(),
	post_status: z.string().optional(),
	gift_status: z.string().optional(),
	subtype: z.string().optional(),
	constituency: z.string().optional(),
	gift_code: z.string().optional(),
	is_anonymous: z.boolean().optional(),
	lookup_id: z.string().optional(),
	origin: z.string().optional(),
	reference: z.string().optional(),
	batch_number: z.string().optional(),
	batch_prefix: z.string().optional(),
	linked_gifts: z.array(z.string()).optional(),
	fundraisers: z.array(ConstituentCreditSchema).optional(),
	soft_credits: z.array(ConstituentCreditSchema).optional(),
	default_fundraiser_credits: z.boolean().optional(),
	default_soft_credits: z.boolean().optional(),
	custom_fields: z.array(CustomFieldAddSchema).optional(),
});

const AddGiftsToBatchInputSchema = z.object({
	batch_id: z.string().min(1),
	gifts: z.array(GiftBatchGiftAddSchema).min(1),
});

export type AddGiftsToBatchInput = z.infer<typeof AddGiftsToBatchInputSchema>;

const GiftSplitReadSchema = z.object({
	id: z.string().optional(),
	amount: CurrencySchema.optional(),
	appeal_id: z.string().optional(),
	campaign_id: z.string().optional(),
	fund_id: z.string().optional(),
	package_id: z.string().optional(),
});

const PaymentReadSchema = z.object({
	payment_method: z.string().optional(),
	account_token: z.string().optional(),
	bbps_configuration_id: z.string().optional(),
	bbps_transaction_id: z.string().optional(),
	check_date: FuzzyDateSchema.optional(),
	check_number: z.string().optional(),
	checkout_transaction_id: z.string().optional(),
	reference: z.string().optional(),
	reference_date: FuzzyDateSchema.optional(),
});

export const GiftReadShape = {
	id: z.string().optional(),
	constituent_id: z.string().optional(),
	amount: CurrencySchema.optional(),
	balance: CurrencySchema.optional(),
	batch_number: z.string().optional(),
	constituency: z.string().optional(),
	date: z.string().optional(),
	date_added: z.string().optional(),
	date_modified: z.string().optional(),
	gift_code: z.string().optional(),
	gift_status: z.string().optional(),
	is_anonymous: z.boolean().optional(),
	lookup_id: z.string().optional(),
	origin: z.string().optional(),
	post_date: z.string().optional(),
	post_status: z.string().optional(),
	reference: z.string().optional(),
	subtype: z.string().optional(),
	type: z.string().optional(),
	linked_gifts: z.array(z.string()).optional(),
	gift_splits: z.array(GiftSplitReadSchema).optional(),
	payments: z.array(PaymentReadSchema).optional(),
	fundraisers: z
		.array(
			z.object({
				amount: CurrencySchema.optional(),
				constituent_id: z.string().optional(),
			}),
		)
		.optional(),
	soft_credits: z
		.array(
			z.object({
				id: z.string().optional(),
				amount: CurrencySchema.optional(),
				constituent_id: z.string().optional(),
				gift_id: z.string().optional(),
			}),
		)
		.optional(),
	receipts: z
		.array(
			z.object({
				amount: CurrencySchema.optional(),
				date: z.string().optional(),
				number: z.number().int().optional(),
				status: z.string().optional(),
			}),
		)
		.optional(),
	acknowledgements: z
		.array(
			z.object({
				date: z.string().optional(),
				letter: z.string().optional(),
				status: z.string().optional(),
			}),
		)
		.optional(),
};

const GiftBatchGiftErrorSchema = z.object({
	affected_field: z.string().optional(),
	batch_id: z.string().optional(),
	exception_error_code: z.number().int().optional(),
	exception_error_message: z.string().optional(),
	exception_error_name: z.string().optional(),
	gift_id: z.string().optional(),
	lookup_id: z.string().optional(),
});

// BatchGiftAddResults: the gifts Blackbaud added plus per-gift errors.
const AddGiftsToBatchResponseSchema = z.object({
	gifts: z
		.array(
			z.object({
				...GiftReadShape,
				batch_id: z.string().optional(),
				approved_gift_id: z.string().optional(),
				errors: z.array(GiftBatchGiftErrorSchema).optional(),
			}),
		)
		.optional(),
	errors: z.array(GiftBatchGiftErrorSchema).optional(),
});

export type AddGiftsToBatchResponse = z.infer<
	typeof AddGiftsToBatchResponseSchema
>;

const GetGiftByIdInputSchema = z.object({
	gift_id: z.string().min(1),
});

export type GetGiftByIdInput = z.infer<typeof GetGiftByIdInputSchema>;

const GetGiftByIdResponseSchema = z.object(GiftReadShape);

export type GetGiftByIdResponse = z.infer<typeof GetGiftByIdResponseSchema>;

const GetMembershipDetailsInputSchema = z.object({
	member_junction_id: z
		.string()
		.min(1)
		.describe(
			'Membership record ID for the constituent (the "id" returned by the constituent memberships list).',
		),
});

export type GetMembershipDetailsInput = z.infer<
	typeof GetMembershipDetailsInputSchema
>;

// MembershipDetails from the Membership API.
export const GetMembershipDetailsResponseSchema = z.object({
	dues: z.number().nullable().optional(),
	category_name: z.string().nullable().optional(),
	program_name: z.string().nullable().optional(),
	sub_category_name: z.string().nullable().optional(),
	last_renewed_date: z.string().nullable().optional(),
	last_dropped_date: z.string().nullable().optional(),
	next_renewal_date: z.string().nullable().optional(),
	joined_date: z.string().optional(),
	total_years: z.number().int().nullable().optional(),
	times_renewed: z.number().int().nullable().optional(),
	consec_years: z.number().int().nullable().optional(),
	constituent_id: z.string().nullable().optional(),
	notes: z.string().nullable().optional(),
	type: z
		.enum(['Joined', 'Renewal', 'Rejoined', 'Upgrade', 'Downgrade', 'Dropped'])
		.optional(),
});

export type GetMembershipDetailsResponse = z.infer<
	typeof GetMembershipDetailsResponseSchema
>;

const GetPaymentTransactionInputSchema = z.object({
	transaction_id: z.string().min(1),
});

export type GetPaymentTransactionInput = z.infer<
	typeof GetPaymentTransactionInputSchema
>;

// TransactionRead from the Payments API. Amounts are integers in the
// smallest currency unit.
export const GetPaymentTransactionResponseSchema = z.object({
	id: z.string().optional(),
	amount: z.number().int().optional(),
	net_amount: z.number().int().optional(),
	additional_fee: z.number().int().optional(),
	application_fee: z.number().int().optional(),
	total_fees: z.number().int().optional(),
	currency: z.string().optional(),
	state: z
		.enum([
			'Unknown',
			'Processed',
			'Failed',
			'Refunded',
			'Pending',
			'Authorized',
			'Voided',
			'Created',
		])
		.optional(),
	transaction_date: z.string().optional(),
	pending_date: z.string().optional(),
	transaction_type: z.string().optional(),
	transaction_category: z.string().optional(),
	account_type: z.string().optional(),
	application: z.string().optional(),
	authorization_code: z.string().optional(),
	check_number: z.string().optional(),
	comment: z.string().optional(),
	disbursement_status: z.string().optional(),
	donor_ip_address: z.string().optional(),
	email_address: z.string().optional(),
	phone_number: z.string().optional(),
	is_live: z.boolean().optional(),
	token: z.string().optional(),
	reference_transaction_id: z.string().optional(),
	billing_info: z
		.object({
			city: z.string().nullable().optional(),
			country: z.string().nullable().optional(),
			post_code: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			street: z.string().nullable().optional(),
		})
		.optional(),
	credit_card: z
		.object({
			card_type: z.string().nullable().optional(),
			exp_month: z.number().int().optional(),
			exp_year: z.number().int().optional(),
			last_four: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
		})
		.optional(),
	related_transactions: z
		.array(
			z.object({
				id: z.string().nullable().optional(),
				transaction_type: z.string().nullable().optional(),
			}),
		)
		.optional(),
});

export type GetPaymentTransactionResponse = z.infer<
	typeof GetPaymentTransactionResponseSchema
>;

// OneRoster OAuth2 discovery metadata served by oauth2.sky.blackbaud.com.
// Token issuance (client-credentials grant with the app secret) belongs to
// the auth flow, not to a tool input, so it is intentionally not exposed.
const OneRosterOAuth2BaseApiInputSchema = z.object({
	operation: z.enum(['openid-configuration', 'publickeys']),
});

export type OneRosterOAuth2BaseApiInput = z.infer<
	typeof OneRosterOAuth2BaseApiInputSchema
>;

export const JsonWebKeySchema = z.object({
	kty: z.string(),
	alg: z.string().optional(),
	use: z.string().optional(),
	kid: z.string().optional(),
	x5t: z.string().optional(),
	x5c: z.array(z.string()).optional(),
	e: z.string().optional(),
	n: z.string().optional(),
});

const OneRosterOAuth2BaseApiResponseSchema = z.object({
	issuer: z.string().optional(),
	authorization_endpoint: z.string().optional(),
	token_endpoint: z.string().optional(),
	jwks_uri: z.string().optional(),
	response_types_supported: z.array(z.string()).optional(),
	subject_types_supported: z.array(z.string()).optional(),
	id_token_signing_alg_values_supported: z.array(z.string()).optional(),
	code_challenge_methods_supported: z.array(z.string()).optional(),
	keys: z.array(JsonWebKeySchema).optional(),
});

export type OneRosterOAuth2BaseApiResponse = z.infer<
	typeof OneRosterOAuth2BaseApiResponseSchema
>;

export type BlackbaudEndpointInputs = {
	addGiftsToBatch: AddGiftsToBatchInput;
	getGiftById: GetGiftByIdInput;
	getMembershipDetails: GetMembershipDetailsInput;
	getPaymentTransaction: GetPaymentTransactionInput;
	oneRosterOAuth2BaseApi: OneRosterOAuth2BaseApiInput;
};

export type BlackbaudEndpointOutputs = {
	addGiftsToBatch: AddGiftsToBatchResponse;
	getGiftById: GetGiftByIdResponse;
	getMembershipDetails: GetMembershipDetailsResponse;
	getPaymentTransaction: GetPaymentTransactionResponse;
	oneRosterOAuth2BaseApi: OneRosterOAuth2BaseApiResponse;
};

export const BlackbaudEndpointInputSchemas = {
	addGiftsToBatch: AddGiftsToBatchInputSchema,
	getGiftById: GetGiftByIdInputSchema,
	getMembershipDetails: GetMembershipDetailsInputSchema,
	getPaymentTransaction: GetPaymentTransactionInputSchema,
	oneRosterOAuth2BaseApi: OneRosterOAuth2BaseApiInputSchema,
} as const;

export const BlackbaudEndpointOutputSchemas = {
	addGiftsToBatch: AddGiftsToBatchResponseSchema,
	getGiftById: GetGiftByIdResponseSchema,
	getMembershipDetails: GetMembershipDetailsResponseSchema,
	getPaymentTransaction: GetPaymentTransactionResponseSchema,
	oneRosterOAuth2BaseApi: OneRosterOAuth2BaseApiResponseSchema,
} as const;
