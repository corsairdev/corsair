import { z } from 'zod';

const PostalAddressSchema = z.object({
	// Google's PostalAddress.revision must be 0 (the only supported schema
	// revision) — anything else is rejected remotely with INVALID_ARGUMENT.
	revision: z.literal(0).optional(),
	regionCode: z.string().optional(),
	languageCode: z.string().optional(),
	postalCode: z.string().optional(),
	sortingCode: z.string().optional(),
	administrativeArea: z.string().optional(),
	locality: z.string().optional(),
	sublocality: z.string().optional(),
	addressLines: z.array(z.string()).optional(),
	recipients: z.array(z.string()).optional(),
	organization: z.string().optional(),
});

const PostalAddressInputSchema = PostalAddressSchema.extend({
	addressLines: z.array(z.string().min(1)).min(1),
});

const GranularitySchema = z.enum([
	'GRANULARITY_UNSPECIFIED',
	'SUB_PREMISE',
	'PREMISE',
	'PREMISE_PROXIMITY',
	'BLOCK',
	'ROUTE',
	'OTHER',
]);

const ConfirmationLevelSchema = z.enum([
	'CONFIRMATION_LEVEL_UNSPECIFIED',
	'CONFIRMED',
	'UNCONFIRMED_BUT_PLAUSIBLE',
	'UNCONFIRMED_AND_SUSPICIOUS',
]);

const PossibleNextActionSchema = z.enum([
	'POSSIBLE_NEXT_ACTION_UNSPECIFIED',
	'FIX',
	'CONFIRM_ADD_SUBPREMISES',
	'CONFIRM',
	'ACCEPT',
]);

const AddressComponentSchema = z
	.object({
		componentName: z
			.object({
				text: z.string().optional(),
				languageCode: z.string().optional(),
			})
			.optional(),
		componentType: z.string().optional(),
		confirmationLevel: ConfirmationLevelSchema.optional(),
		inferred: z.boolean().optional(),
		spellCorrected: z.boolean().optional(),
		replaced: z.boolean().optional(),
		unexpected: z.boolean().optional(),
	})
	.passthrough();

// Both fields are optional: proto3 JSON serialization omits fields left at
// their zero value, so a location exactly on the equator/prime meridian
// would otherwise fail to parse.
const LatLngSchema = z
	.object({
		latitude: z.number().optional(),
		longitude: z.number().optional(),
	})
	.passthrough();

const AddressResultSchema = z
	.object({
		formattedAddress: z.string().optional(),
		postalAddress: PostalAddressSchema.optional(),
		addressComponents: z.array(AddressComponentSchema).optional(),
		missingComponentTypes: z.array(z.string()).optional(),
		unconfirmedComponentTypes: z.array(z.string()).optional(),
		unresolvedTokens: z.array(z.string()).optional(),
	})
	.passthrough();

const UspsDataSchema = z
	.object({
		standardizedAddress: z
			.object({
				firstAddressLine: z.string().optional(),
				firm: z.string().optional(),
				secondAddressLine: z.string().optional(),
				urbanization: z.string().optional(),
				cityStateZipAddressLine: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				zipCode: z.string().optional(),
				zipCodeExtension: z.string().optional(),
			})
			.optional(),
		deliveryPointCode: z.string().optional(),
		deliveryPointCheckDigit: z.string().optional(),
		dpvConfirmation: z.string().optional(),
		dpvFootnote: z.string().optional(),
		dpvCmra: z.string().optional(),
		dpvVacant: z.string().optional(),
		dpvNoStat: z.string().optional(),
		dpvNoStatReasonCode: z.number().optional(),
		dpvDrop: z.string().optional(),
		dpvThrowback: z.string().optional(),
		dpvNonDeliveryDays: z.string().optional(),
		dpvNonDeliveryDaysValues: z.number().optional(),
		dpvNoSecureLocation: z.string().optional(),
		dpvPbsa: z.string().optional(),
		dpvDoorNotAccessible: z.string().optional(),
		dpvEnhancedDeliveryCode: z.string().optional(),
		carrierRoute: z.string().optional(),
		carrierRouteIndicator: z.string().optional(),
		ewsNoMatch: z.boolean().optional(),
		postOfficeCity: z.string().optional(),
		postOfficeState: z.string().optional(),
		abbreviatedCity: z.string().optional(),
		fipsCountyCode: z.string().optional(),
		county: z.string().optional(),
		elotNumber: z.string().optional(),
		elotFlag: z.string().optional(),
		lacsLinkReturnCode: z.string().optional(),
		lacsLinkIndicator: z.string().optional(),
		poBoxOnlyPostalCode: z.boolean().optional(),
		suitelinkFootnote: z.string().optional(),
		pmbDesignator: z.string().optional(),
		pmbNumber: z.string().optional(),
		addressRecordType: z.string().optional(),
		defaultAddress: z.boolean().optional(),
		errorMessage: z.string().optional(),
		cassProcessed: z.boolean().optional(),
	})
	.passthrough();

const ValidateAddressInputSchema = z.object({
	address: PostalAddressInputSchema,
	previousResponseId: z.string().optional(),
	enableUspsCass: z.boolean().optional(),
	languageOptions: z
		.object({
			returnEnglishLatinAddress: z.boolean().optional(),
		})
		.optional(),
	sessionToken: z
		.string()
		.regex(/^[A-Za-z0-9_-]{1,36}$/)
		.optional(),
});

export type ValidateAddressInput = z.infer<typeof ValidateAddressInputSchema>;

const ValidateAddressResponseSchema = z
	.object({
		result: z
			.object({
				verdict: z
					.object({
						inputGranularity: GranularitySchema.optional(),
						validationGranularity: GranularitySchema.optional(),
						geocodeGranularity: GranularitySchema.optional(),
						addressComplete: z.boolean().optional(),
						hasUnconfirmedComponents: z.boolean().optional(),
						hasInferredComponents: z.boolean().optional(),
						hasReplacedComponents: z.boolean().optional(),
						hasSpellCorrectedComponents: z.boolean().optional(),
						possibleNextAction: PossibleNextActionSchema.optional(),
					})
					.passthrough()
					.optional(),
				address: AddressResultSchema.optional(),
				geocode: z
					.object({
						location: LatLngSchema.optional(),
						plusCode: z
							.object({
								globalCode: z.string().optional(),
								compoundCode: z.string().optional(),
							})
							.passthrough()
							.optional(),
						bounds: z
							.object({
								low: LatLngSchema.optional(),
								high: LatLngSchema.optional(),
							})
							.passthrough()
							.optional(),
						featureSizeMeters: z.number().optional(),
						placeId: z.string().optional(),
						placeTypes: z.array(z.string()).optional(),
					})
					.passthrough()
					.optional(),
				metadata: z
					.object({
						business: z.boolean().optional(),
						poBox: z.boolean().optional(),
						residential: z.boolean().optional(),
					})
					.passthrough()
					.optional(),
				uspsData: UspsDataSchema.optional(),
				englishLatinAddress: AddressResultSchema.optional(),
			})
			.passthrough(),
		responseId: z.string(),
	})
	.passthrough();

export type ValidateAddressResponse = z.infer<
	typeof ValidateAddressResponseSchema
>;

const ProvideValidationFeedbackInputSchema = z.object({
	conclusion: z.enum([
		'VALIDATED_VERSION_USED',
		'USER_VERSION_USED',
		'UNVALIDATED_VERSION_USED',
		'UNUSED',
	]),
	responseId: z.string().min(1),
});

export type ProvideValidationFeedbackInput = z.infer<
	typeof ProvideValidationFeedbackInputSchema
>;

const ProvideValidationFeedbackResponseSchema = z.object({}).passthrough();

export type ProvideValidationFeedbackResponse = z.infer<
	typeof ProvideValidationFeedbackResponseSchema
>;

export type GoogleAddressValidationEndpointInputs = {
	validateAddress: ValidateAddressInput;
	provideValidationFeedback: ProvideValidationFeedbackInput;
};

export type GoogleAddressValidationEndpointOutputs = {
	validateAddress: ValidateAddressResponse;
	provideValidationFeedback: ProvideValidationFeedbackResponse;
};

export const GoogleAddressValidationEndpointInputSchemas = {
	validateAddress: ValidateAddressInputSchema,
	provideValidationFeedback: ProvideValidationFeedbackInputSchema,
} as const;

export const GoogleAddressValidationEndpointOutputSchemas = {
	validateAddress: ValidateAddressResponseSchema,
	provideValidationFeedback: ProvideValidationFeedbackResponseSchema,
} as const;
