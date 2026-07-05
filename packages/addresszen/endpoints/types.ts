import { z } from 'zod';

const AddressSuggestionSchema = z
	.object({
		id: z.string(),
		suggestion: z.string(),
		// urls shape varies by country (US vs UK); provider may return null.
		urls: z.record(z.string(), z.unknown()).nullable().optional(),
		udprn: z.number().optional(),
	})
	.loose();

export type AddressSuggestion = z.infer<typeof AddressSuggestionSchema>;

export const AutocompleteAddressesInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.max(150)
		.describe('Partial address string to autocomplete'),
});

export type AutocompleteAddressesInput = z.infer<
	typeof AutocompleteAddressesInputSchema
>;

export const AutocompleteAddressesResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	result: z
		.object({
			hits: z.array(AddressSuggestionSchema),
		})
		.loose(),
});

export type AutocompleteAddressesResponse = z.infer<
	typeof AutocompleteAddressesResponseSchema
>;

export const VerifyAddressInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.describe(
			'Address to verify. Use a full free-form address, or only the first line when city/state or zip_code are provided separately.',
		),
	zip_code: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	context: z
		.string()
		.optional()
		.describe('Optional metadata tag stored with the lookup'),
});

export type VerifyAddressInput = z.infer<typeof VerifyAddressInputSchema>;

const VerifyResultSchema = z
	.object({
		query: z.string(),
		query_city: z.string().optional(),
		query_state: z.string().optional(),
		query_zip_code: z.string().optional(),
		// match is a oneOf across US/UK address object schemas in the OpenAPI spec.
		match: z.unknown().nullable().optional(),
		count: z.number().optional(),
		fit: z.number().optional(),
		confidence: z.number().optional(),
		// match_information structure depends on the matched address type.
		match_information: z.unknown().optional(),
		address_line_one: z.string().optional(),
		address_line_two: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		zip_code: z.string().optional(),
		country_iso_2: z.string().optional(),
	})
	.loose();

export const VerifyAddressResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	result: VerifyResultSchema,
});

export type VerifyAddressResponse = z.infer<typeof VerifyAddressResponseSchema>;

export type AddresszenEndpointInputs = {
	autocompleteAddresses: AutocompleteAddressesInput;
	verifyAddress: VerifyAddressInput;
};

export type AddresszenEndpointOutputs = {
	autocompleteAddresses: AutocompleteAddressesResponse;
	verifyAddress: VerifyAddressResponse;
};

export const AddresszenEndpointInputSchemas = {
	autocompleteAddresses: AutocompleteAddressesInputSchema,
	verifyAddress: VerifyAddressInputSchema,
} as const;

export const AddresszenEndpointOutputSchemas = {
	autocompleteAddresses: AutocompleteAddressesResponseSchema,
	verifyAddress: VerifyAddressResponseSchema,
} as const;
