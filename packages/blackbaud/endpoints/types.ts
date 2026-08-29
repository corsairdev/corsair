import { z } from 'zod';

const AddGiftsToBatchInputSchema = z.object({
	batch_id: z.string(),
	gifts: z.array(
		z
			.object({
				constituent_id: z.string(),
				amount: z
					.object({
						value: z.number(),
						currency: z.string().optional(),
					})
					.optional(),
				payment_method: z.string().optional(),
				date: z.string().optional(),
				gift_type: z.string().optional(),
				post_date: z.string().optional(),
				reference: z.string().optional(),
				splits: z.array(z.any()).optional(),
				custom_fields: z.array(z.any()).optional(),
			})
			.passthrough(),
	),
});

export type AddGiftsToBatchInput = z.infer<typeof AddGiftsToBatchInputSchema>;

const AddGiftsToBatchResponseSchema = z
	.object({
		status_code: z.number(),
		response_details: z.any().optional(),
	})
	.passthrough();

export type AddGiftsToBatchResponse = z.infer<
	typeof AddGiftsToBatchResponseSchema
>;

const GetGiftByIdInputSchema = z.object({
	gift_id: z.string(),
});

export type GetGiftByIdInput = z.infer<typeof GetGiftByIdInputSchema>;

const GetGiftByIdResponseSchema = z.any();

export type GetGiftByIdResponse = z.infer<typeof GetGiftByIdResponseSchema>;

const GetMembershipDetailsInputSchema = z.object({
	member_junction_id: z.string(),
});

export type GetMembershipDetailsInput = z.infer<
	typeof GetMembershipDetailsInputSchema
>;

const GetMembershipDetailsResponseSchema = z.any();

export type GetMembershipDetailsResponse = z.infer<
	typeof GetMembershipDetailsResponseSchema
>;

const GetPaymentTransactionInputSchema = z.object({
	transaction_id: z.string(),
});

export type GetPaymentTransactionInput = z.infer<
	typeof GetPaymentTransactionInputSchema
>;

const GetPaymentTransactionResponseSchema = z.any();

export type GetPaymentTransactionResponse = z.infer<
	typeof GetPaymentTransactionResponseSchema
>;

const OneRosterOAuth2BaseApiInputSchema = z.object({
	operation: z.enum(['openid-configuration', 'publickeys', 'token']),
	clientId: z.string().optional(),
	clientSecret: z.string().optional(),
});

export type OneRosterOAuth2BaseApiInput = z.infer<
	typeof OneRosterOAuth2BaseApiInputSchema
>;

const OneRosterOAuth2BaseApiResponseSchema = z.any();

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
