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
	limit: z.number().int().positive().optional(),
	page: z.number().int().nonnegative().optional(),
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

export const KeyAvailabilityInputSchema = z.object({});

export type KeyAvailabilityInput = z.infer<typeof KeyAvailabilityInputSchema>;

export const KeyAvailabilityResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	result: z
		.object({
			available: z.boolean(),
			context: z.string().optional(),
			// Country/context catalog; large and varies by key entitlements.
			contexts: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.loose(),
});

export type KeyAvailabilityResponse = z.infer<
	typeof KeyAvailabilityResponseSchema
>;

export const ResolveAddressUsaInputSchema = z.object({
	addressId: z
		.string()
		.min(1)
		.describe(
			'Address suggestion ID from autocomplete (e.g. usps_X130125796|1600||1933)',
		),
});

export type ResolveAddressUsaInput = z.infer<
	typeof ResolveAddressUsaInputSchema
>;

export const ResolveAddressUsaResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	// US-format resolved address fields vary across datasets; keep loose.
	result: z
		.object({
			id: z.string().optional(),
			line_1: z.string().optional(),
			line_2: z.string().optional(),
			city: z.string().optional(),
			state: z.string().optional(),
			state_abbreviation: z.string().optional(),
			zip_code: z.string().optional(),
			country_iso_2: z.string().optional(),
		})
		.loose(),
});

export type ResolveAddressUsaResponse = z.infer<
	typeof ResolveAddressUsaResponseSchema
>;

export type AddresszenEndpointInputs = {
	autocompleteAddresses: AutocompleteAddressesInput;
	verifyAddress: VerifyAddressInput;
	keyAvailability: KeyAvailabilityInput;
	resolveAddressUsa: ResolveAddressUsaInput;
};

export type AddresszenEndpointOutputs = {
	autocompleteAddresses: AutocompleteAddressesResponse;
	verifyAddress: VerifyAddressResponse;
	keyAvailability: KeyAvailabilityResponse;
	resolveAddressUsa: ResolveAddressUsaResponse;
};

export const AddresszenEndpointInputSchemas = {
	autocompleteAddresses: AutocompleteAddressesInputSchema,
	verifyAddress: VerifyAddressInputSchema,
	keyAvailability: KeyAvailabilityInputSchema,
	resolveAddressUsa: ResolveAddressUsaInputSchema,
} as const;

export const AddresszenEndpointOutputSchemas = {
	autocompleteAddresses: AutocompleteAddressesResponseSchema,
	verifyAddress: VerifyAddressResponseSchema,
	keyAvailability: KeyAvailabilityResponseSchema,
	resolveAddressUsa: ResolveAddressUsaResponseSchema,
} as const;
