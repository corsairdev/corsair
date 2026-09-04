import { z } from 'zod';

const GiftAmountSchema = z
	.object({
		value: z.number(),
		currency: z.string().optional(),
	})
	.passthrough();

const GiftSplitSchema = z.record(z.string(), z.unknown());

const GiftEntrySchema = z
	.object({
		constituent_id: z.string().min(1),
		amount: GiftAmountSchema.optional(),
		payment_method: z.string().optional(),
		date: z.string().optional(),
		gift_type: z.string().optional(),
		post_date: z.string().optional(),
		reference: z.string().optional(),
		splits: z.array(GiftSplitSchema).optional(),
		custom_fields: z.array(GiftSplitSchema).optional(),
	})
	.passthrough();

const AddGiftsToBatchInputSchema = z.object({
	batch_id: z.string().min(1),
	gifts: z.array(GiftEntrySchema).min(1),
});

export type AddGiftsToBatchInput = z.infer<typeof AddGiftsToBatchInputSchema>;

const AddGiftsToBatchResponseSchema = z
	.object({
		status_code: z.number(),
		response_details: z.unknown().optional(),
	})
	.passthrough();

export type AddGiftsToBatchResponse = z.infer<
	typeof AddGiftsToBatchResponseSchema
>;

const GetGiftByIdInputSchema = z.object({
	gift_id: z.string().min(1),
});

export type GetGiftByIdInput = z.infer<typeof GetGiftByIdInputSchema>;

// Raiser's Edge NXT gift record. Core fields are optional because the SKY API
// returns different shapes per gift type; unknown fields pass through.
// Ref: https://developer.blackbaud.com/skyapi/products/renxt/gift-v2
const GetGiftByIdResponseSchema = z
	.object({
		id: z.string().optional(),
		constituent_id: z.string().optional(),
		amount: GiftAmountSchema.optional(),
		date: z.string().optional(),
		type: z.string().optional(),
		subtype: z.string().optional(),
		post_status: z.string().optional(),
	})
	.passthrough();

export type GetGiftByIdResponse = z.infer<typeof GetGiftByIdResponseSchema>;

const GetMembershipDetailsInputSchema = z.object({
	member_junction_id: z.string().min(1),
});

export type GetMembershipDetailsInput = z.infer<
	typeof GetMembershipDetailsInputSchema
>;

// Raiser's Edge NXT membership record served under membership/v1/memberships.
// Ref: https://api.sky.blackbaud.com/membership/v1/memberships (SKY API)
const GetMembershipDetailsResponseSchema = z
	.object({
		id: z.string().optional(),
		member_id: z.string().optional(),
		membership_level: z.string().optional(),
		status: z.string().optional(),
		join_date: z.string().optional(),
		expiry_date: z.string().optional(),
	})
	.passthrough();

export type GetMembershipDetailsResponse = z.infer<
	typeof GetMembershipDetailsResponseSchema
>;

const GetPaymentTransactionInputSchema = z.object({
	transaction_id: z.string().min(1),
});

export type GetPaymentTransactionInput = z.infer<
	typeof GetPaymentTransactionInputSchema
>;

// SKY Payments transaction record served under payments/v1/transactions.
// Ref: https://developer.blackbaud.com/skyapi/products/bbms/payments
const GetPaymentTransactionResponseSchema = z
	.object({
		id: z.string().optional(),
		transaction_id: z.string().optional(),
		amount: GiftAmountSchema.optional(),
		status: z.string().optional(),
		transaction_date: z.string().optional(),
	})
	.passthrough();

export type GetPaymentTransactionResponse = z.infer<
	typeof GetPaymentTransactionResponseSchema
>;

// OneRoster OAuth2 discovery metadata only (openid-configuration, publickeys).
// Token issuance uses the client-credentials grant with HTTP Basic auth plus a
// scope (ref: https://developer.blackbaud.com/skyapi/products/bbem/oneroster/authorization)
// and runs through the OAuth flow, not through an authenticated endpoint, so it
// is intentionally not exposed here.
const OneRosterOAuth2BaseApiInputSchema = z.object({
	operation: z.enum(['openid-configuration', 'publickeys']),
});

export type OneRosterOAuth2BaseApiInput = z.infer<
	typeof OneRosterOAuth2BaseApiInputSchema
>;

const OneRosterOAuth2BaseApiResponseSchema = z
	.object({
		issuer: z.string().optional(),
		authorization_endpoint: z.string().optional(),
		token_endpoint: z.string().optional(),
		jwks_uri: z.string().optional(),
		keys: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

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
