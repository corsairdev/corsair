import { z } from 'zod';

const AddressFilterSchema = z
	.object({
		street1: z.string().min(1).optional().describe('Street line 1.'),
		street2: z.string().min(1).optional().describe('Street line 2.'),
		city: z.string().min(1).optional().describe('City name.'),
		state: z.string().min(1).optional().describe('Two-letter state code.'),
		postalCode: z.string().min(1).optional().describe('Postal code.'),
	})
	.refine((address) => Object.values(address).some(Boolean), {
		message: 'Provide at least one address field.',
	});

const MatchThresholdSchema = z
	.number()
	.min(0)
	.max(1)
	.optional()
	.describe('Confidence threshold between 0.0 and 1.0.');

const IdSchema = z.string().min(1).describe('Enigma entity ID.');

const EnigmaAddressSchema = z
	.object({
		fullAddress: z.string().nullish(),
		streetAddress1: z.string().nullish(),
		streetAddress2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		county: z.string().nullish(),
		country: z.string().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
	})
	.loose();

const EnigmaIndustrySchema = z
	.object({
		industryCode: z.string().nullish(),
		industryDesc: z.string().nullish(),
		industryType: z.string().nullish(),
	})
	.loose();

const EnigmaCardTransactionSchema = z
	.object({
		quantityType: z.string().nullish(),
		period: z.string().nullish(),
		projectedQuantity: z.number().nullish(),
		periodStartDate: z.string().nullish(),
		periodEndDate: z.string().nullish(),
	})
	.loose();

const PageInfoSchema = z
	.object({
		hasNextPage: z.boolean().nullish(),
		endCursor: z.string().nullish(),
	})
	.loose();

const BrandReferenceSchema = z
	.object({
		id: z.string(),
		enigmaId: z.string().nullish(),
		names: z.array(z.string()),
	})
	.loose();

const BrandSummarySchema = z
	.object({
		id: z.string(),
		enigmaId: z.string().nullish(),
		names: z.array(z.string()),
		websites: z.array(z.string()),
		industries: z.array(EnigmaIndustrySchema),
		operatingLocationCount: z.number().nullish(),
		cardRevenue12m: EnigmaCardTransactionSchema.nullish(),
	})
	.loose();

const OperatingLocationSummarySchema = z
	.object({
		id: z.string(),
		names: z.array(z.string()),
		address: EnigmaAddressSchema.nullish(),
		operatingStatus: z.string().nullish(),
		cardRevenue12m: EnigmaCardTransactionSchema.nullish(),
	})
	.loose();

const RegisteredEntitySchema = z
	.object({
		name: z.string().nullish(),
		registeredEntityType: z.string().nullish(),
		formationDate: z.string().nullish(),
	})
	.loose();

const LegalEntitySummarySchema = z
	.object({
		id: z.string(),
		enigmaId: z.string().nullish(),
		names: z.array(z.string()),
		legalEntityType: z.string().nullish(),
		registeredEntities: z.array(RegisteredEntitySchema).default([]),
	})
	.loose();

const LocationDetailSchema = z
	.object({
		id: z.string(),
		names: z.array(z.string()),
		address: EnigmaAddressSchema.nullish(),
		phoneNumbers: z.array(z.string()),
		websites: z.array(z.string()),
		operatingStatus: z.string().nullish(),
		brands: z.array(BrandReferenceSchema),
	})
	.loose();

const LegalEntityDetailSchema = z
	.object({
		id: z.string(),
		enigmaId: z.string().nullish(),
		names: z.array(z.string()),
		legalEntityType: z.string().nullish(),
		registeredEntities: z
			.object({
				items: z.array(RegisteredEntitySchema),
				pageInfo: PageInfoSchema,
			})
			.loose(),
		addresses: z
			.object({
				items: z.array(EnigmaAddressSchema),
				pageInfo: PageInfoSchema,
			})
			.loose(),
		brands: z
			.object({
				items: z.array(BrandReferenceSchema),
				pageInfo: PageInfoSchema,
			})
			.loose(),
	})
	.loose();

const BrandsMatchInputSchema = z
	.object({
		name: z.string().min(1).optional().describe('Business name to match.'),
		website: z
			.string()
			.min(1)
			.optional()
			.describe('Website to match, any format.'),
		phoneNumber: z
			.string()
			.min(1)
			.optional()
			.describe('Phone number to match, 10-digit US number.'),
		prompt: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Natural-language business description; cannot be combined with name, website, phoneNumber or address.',
			),
		address: AddressFilterSchema.optional().describe(
			'Address to narrow the match.',
		),
		matchThreshold: MatchThresholdSchema,
	})
	.refine(
		(input) =>
			Boolean(input.name ?? input.website ?? input.phoneNumber ?? input.prompt),
		{
			message: 'Provide at least one of name, website, phoneNumber or prompt.',
		},
	)
	.refine(
		(input) =>
			!input.prompt ||
			!(input.name ?? input.website ?? input.phoneNumber ?? input.address),
		{
			message:
				'prompt cannot be combined with name, website, phoneNumber or address.',
		},
	);

export type BrandsMatchInput = z.input<typeof BrandsMatchInputSchema>;

const BrandsMatchResponseSchema = z.object({
	brand: BrandSummarySchema.nullish().describe('`null` when nothing matched.'),
});

export type BrandsMatchResponse = z.infer<typeof BrandsMatchResponseSchema>;

const BrandsGetInputSchema = z.object({
	id: IdSchema.describe('The brand ID from a brands.match call.'),
	locationsFirst: z
		.number()
		.int()
		.min(1)
		.max(200)
		.default(10)
		.describe('Page size for the operating locations list.'),
	locationsAfter: z
		.string()
		.min(1)
		.optional()
		.describe('Cursor from a previous operating locations page.'),
	legalEntitiesFirst: z
		.number()
		.int()
		.min(1)
		.max(200)
		.default(5)
		.describe('Page size for the legal entities list.'),
});

export type BrandsGetInput = z.input<typeof BrandsGetInputSchema>;
export type BrandsGetResponse = z.infer<typeof BrandsGetResponseSchema>;

const BrandsGetResponseSchema = z.object({
	brand: z
		.object({
			id: z.string(),
			enigmaId: z.string().nullish(),
			names: z.array(z.string()),
			websites: z.array(z.string()),
			industries: z.array(EnigmaIndustrySchema),
			cardRevenue12m: EnigmaCardTransactionSchema.nullish(),
			operatingLocations: z
				.object({
					items: z.array(OperatingLocationSummarySchema),
					pageInfo: PageInfoSchema,
				})
				.loose(),
			legalEntities: z
				.object({
					items: z.array(LegalEntitySummarySchema),
					pageInfo: PageInfoSchema,
				})
				.loose(),
		})
		.loose()
		.nullish()
		.describe('`null` when nothing matched.'),
});

const LocationsMatchInputSchema = z
	.object({
		name: z.string().min(1).optional().describe('Business name to match.'),
		website: z.string().min(1).optional().describe('Website to match.'),
		phoneNumber: z
			.string()
			.min(1)
			.optional()
			.describe('Phone number to match, 10-digit US number.'),
		address: AddressFilterSchema.optional().describe('Address to match.'),
		matchThreshold: MatchThresholdSchema,
	})
	.refine(
		(input) =>
			Boolean(
				input.name ?? input.website ?? input.phoneNumber ?? input.address,
			),
		{
			message: 'Provide at least one of name, website, phoneNumber or address.',
		},
	);

export type LocationsMatchInput = z.input<typeof LocationsMatchInputSchema>;
export type LocationsMatchResponse = z.infer<
	typeof LocationsMatchResponseSchema
>;

const LocationsMatchResponseSchema = z.object({
	location: LocationDetailSchema.nullish().describe(
		'`null` when nothing matched.',
	),
});

const LegalEntitiesGetInputSchema = z
	.object({
		id: IdSchema.optional().describe('The legal entity ID.'),
		name: z
			.string()
			.min(1)
			.optional()
			.describe('Legal entity name to match instead of an ID.'),
	})
	.refine((input) => Boolean(input.id ?? input.name), {
		message: 'Provide id or name.',
	});

export type LegalEntitiesGetInput = z.input<typeof LegalEntitiesGetInputSchema>;
export type LegalEntitiesGetResponse = z.infer<
	typeof LegalEntitiesGetResponseSchema
>;

const LegalEntitiesGetResponseSchema = z.object({
	legalEntity: LegalEntityDetailSchema.nullish().describe(
		'`null` when nothing matched.',
	),
});

export type EnigmaEndpointInputs = {
	brandsMatch: BrandsMatchInput;
	brandsGet: BrandsGetInput;
	locationsMatch: LocationsMatchInput;
	legalEntitiesGet: LegalEntitiesGetInput;
};

export type EnigmaEndpointOutputs = {
	brandsMatch: BrandsMatchResponse;
	brandsGet: BrandsGetResponse;
	locationsMatch: LocationsMatchResponse;
	legalEntitiesGet: LegalEntitiesGetResponse;
};

export const EnigmaEndpointInputSchemas = {
	brandsMatch: BrandsMatchInputSchema,
	brandsGet: BrandsGetInputSchema,
	locationsMatch: LocationsMatchInputSchema,
	legalEntitiesGet: LegalEntitiesGetInputSchema,
} as const;

export const EnigmaEndpointOutputSchemas = {
	brandsMatch: BrandsMatchResponseSchema,
	brandsGet: BrandsGetResponseSchema,
	locationsMatch: LocationsMatchResponseSchema,
	legalEntitiesGet: LegalEntitiesGetResponseSchema,
} as const;
