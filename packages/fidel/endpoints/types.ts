import { z } from 'zod';

// unknown: Fidel returns open-ended records whose nested fields the
// provider does not fully document; the documented envelope is validated
// and items stay extensible.
const FidelRecordSchema = z.object({}).passthrough();
// Fidel success envelope for item-bearing responses.
const FidelItemsOutputSchema = z.object({
	items: z.array(FidelRecordSchema).optional(),
	resource: z.string().optional(),
	// unknown: the envelope status is documented without a fixed type;
	// both numeric and string forms appear in provider examples.
	status: z.union([z.string(), z.number()]).optional(),
	// unknown: execution timing metadata is provider-defined.
	execution: z.record(z.string(), z.unknown()).optional(),
});
// Fidel 202 acknowledgement for asynchronous linking and marketplace
// offer creation.
const FidelAckOutputSchema = z.object({
	status: z.union([z.string(), z.number()]).optional(),
	message: z.string().optional(),
	// unknown: execution timing metadata is provider-defined.
	execution: z.record(z.string(), z.unknown()).optional(),
});
// unknown: delete acknowledgements arrive as an empty body, an empty
// object, or a provider echo; any of these is a success.
const FidelEmptyOutputSchema = z.union([
	z.object({}).passthrough(),
	z.undefined(),
]);

const CreateBrandInputSchema = z.object({
	name: z.string(),
	websiteURL: z.string().optional(),
	logoURL: z.string().optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
});

const RetrieveBrandInputSchema = z.object({
	brandId: z.string().min(1),
});

const ListBrandsInputSchema = z.object({
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
	name: z.string().optional(),
});

const UpdateBrandInputSchema = z.object({
	brandId: z.string().min(1),
	websiteURL: z.string().optional(),
	logoURL: z.string().optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
});

const DeleteBrandInputSchema = z.object({
	brandId: z.string().min(1),
});

const ListProgramsInputSchema = z.object({
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
});

const CreateProgramInputSchema = z.object({
	name: z.string(),
	icon: z.string().optional(),
	iconBackground: z.string().optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
});

const UpdateProgramInputSchema = z.object({
	programId: z.string().min(1),
	name: z.string().optional(),
	icon: z.string().optional(),
	iconBackground: z.string().optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
	status: z.string().optional(),
});

const RetrieveProgramInputSchema = z.object({
	programId: z.string().min(1),
});

const CreateLocationInputSchema = z.object({
	programId: z.string().min(1),
	address: z.string(),
	brandId: z.string(),
	city: z.string(),
	countryCode: z.enum([
		'CAN',
		'DNK',
		'FIN',
		'GBR',
		'IRL',
		'JPN',
		'NOR',
		'SWE',
		'USA',
	]),
	postcode: z.string(),
	stateCode: z.string().optional(),
	// unknown: the provider documents searchBy.merchantIds as an open shape; values pass through as-is
	'searchBy.merchantIds': z.record(z.string(), z.unknown()).optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
	status: z.string().optional(),
});

const RetrieveLocationInputSchema = z.object({
	locationId: z.string().min(1),
});

const UpdateLocationInputSchema = z.object({
	locationId: z.string().min(1),
	address: z.string(),
	city: z.string(),
	countryCode: z.string(),
	postcode: z.string(),
	stateCode: z.string().optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
	// unknown: the provider documents searchBy as an open shape; values pass through as-is
	searchBy: z.record(z.string(), z.unknown()).optional(),
});

const ListLocationsInputSchema = z.object({
	programId: z.string().min(1),
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
	postcode: z.string().optional(),
	status: z.string().optional(),
});

const ListLocationsByBrandInputSchema = z.object({
	brandId: z.string().min(1),
	programId: z.string().min(1),
	postcode: z.string().optional(),
	status: z.string().optional(),
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
});

const ListLocationsByOfferInputSchema = z.object({
	offerId: z.string().min(1),
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
});

const DeleteLocationInputSchema = z.object({
	locationId: z.string().min(1),
});

const CreateCardInputSchema = z.object({
	programId: z.string().min(1),
	countryCode: z.enum([
		'CAN',
		'DNK',
		'FIN',
		'GBR',
		'IRL',
		'JPN',
		'NOR',
		'SWE',
		'USA',
	]),
	expMonth: z.number(),
	expYear: z.number(),
	number: z.string(),
	termsOfUse: z.boolean(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
});

const RetrieveCardInputSchema = z.object({
	cardId: z.string().min(1),
});

const ListCardsInputSchema = z.object({
	programId: z.string().min(1),
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
});

const ListCardsFromMetadataIdInputSchema = z.object({
	metadataId: z.string().min(1),
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
});

const DeleteCardInputSchema = z.object({
	cardId: z.string().min(1),
});

const UpdateCardMetadataInputSchema = z.object({
	cardId: z.string().min(1),
	RAW_BODY: z.string(),
});

const CreateOfferInputSchema = z.object({
	brandId: z.string(),
	countryCode: z.string(),
	name: z.string(),
	startDate: z.string(),
	// unknown: the provider documents type as an open shape; values pass through as-is
	type: z.record(z.string(), z.unknown()).optional(),
	// unknown: the provider documents daysOfWeek as an open shape; values pass through as-is
	daysOfWeek: z.array(z.unknown()).optional(),
	endDate: z.string().optional(),
	minTransactionAmount: z.number().optional(),
	returnPeriod: z.number().optional(),
	schemes: z.enum(['visa', 'mastercard', 'amex']).optional(),
	// unknown: the provider documents activation as an open shape; values pass through as-is
	activation: z.record(z.string(), z.unknown()).optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
	feeSplit: z.number().optional(),
	channels: z.enum(['in-store', 'online']).optional(),
	shortDescription: z.string().optional(),
	longDescription: z.string().optional(),
	requiresApproval: z.boolean().optional(),
	// unknown: the provider documents customerRecency as an open shape; values pass through as-is
	customerRecency: z.record(z.string(), z.unknown()).optional(),
});

const UpdateOfferInputSchema = z.object({
	offerId: z.string().min(1),
	name: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	// unknown: the provider documents type as an open shape; values pass through as-is
	type: z.record(z.string(), z.unknown()).optional(),
	// unknown: the provider documents activation as an open shape; values pass through as-is
	activation: z.record(z.string(), z.unknown()).optional(),
	// unknown: the provider documents daysOfWeek as an open shape; values pass through as-is
	daysOfWeek: z.array(z.unknown()).optional(),
	minTransactionAmount: z.number().optional(),
	returnPeriod: z.number().optional(),
	schemes: z.enum(['visa', 'mastercard', 'amex']).optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
});

const RetrieveOfferInputSchema = z.object({
	offerId: z.string().min(1),
});

const ListOffersInputSchema = z.object({
	limit: z.string().optional(),
	start: z.string().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	status: z.string().optional(),
	activation: z.string().optional(),
	approval: z.string().optional(),
	brandId: z.string().optional(),
	contentProviderId: z.string().optional(),
	programId: z.string().optional(),
	countryCode: z.string().optional(),
	customerRecency: z.string().optional(),
	network: z.string().optional(),
	returnPeriod: z.string().optional(),
	channel: z.string().optional(),
	endDate: z.string().optional(),
});

const DeleteOfferInputSchema = z.object({
	offerId: z.string().min(1),
});

const LinkLocationToOfferInputSchema = z.object({
	offerId: z.string().min(1),
	locationId: z.string().min(1),
});

const LinkAllBrandLocationsToOfferInputSchema = z.object({
	offerId: z.string().min(1),
	programId: z.string().min(1),
});

const UnlinkLocationToOfferInputSchema = z.object({
	offerId: z.string().min(1),
	locationId: z.string().min(1),
});

const SendOfferToBrandInputSchema = z.object({
	offerId: z.string().min(1),
});

const ActivateOfferOnCardInputSchema = z.object({
	offerId: z.string().min(1),
	cardId: z.string().min(1),
});

const UnlinkCardFromOfferInputSchema = z.object({
	offerId: z.string().min(1),
	cardId: z.string().min(1),
});

const RetrieveActiveOfferOnCardInputSchema = z.object({
	offerId: z.string().min(1),
	cardId: z.string().min(1),
});

const ListCardsWithActiveOfferInputSchema = z.object({
	offerId: z.string().min(1),
	limit: z.string().optional(),
	order: z.string().optional(),
	start: z.string().optional(),
});

export const FidelEndpointInputSchemas = {
	createBrand: CreateBrandInputSchema,
	retrieveBrand: RetrieveBrandInputSchema,
	listBrands: ListBrandsInputSchema,
	updateBrand: UpdateBrandInputSchema,
	deleteBrand: DeleteBrandInputSchema,
	listPrograms: ListProgramsInputSchema,
	createProgram: CreateProgramInputSchema,
	updateProgram: UpdateProgramInputSchema,
	retrieveProgram: RetrieveProgramInputSchema,
	createLocation: CreateLocationInputSchema,
	retrieveLocation: RetrieveLocationInputSchema,
	updateLocation: UpdateLocationInputSchema,
	listLocations: ListLocationsInputSchema,
	listLocationsByBrand: ListLocationsByBrandInputSchema,
	listLocationsByOffer: ListLocationsByOfferInputSchema,
	deleteLocation: DeleteLocationInputSchema,
	createCard: CreateCardInputSchema,
	retrieveCard: RetrieveCardInputSchema,
	listCards: ListCardsInputSchema,
	listCardsFromMetadataId: ListCardsFromMetadataIdInputSchema,
	deleteCard: DeleteCardInputSchema,
	updateCardMetadata: UpdateCardMetadataInputSchema,
	createOffer: CreateOfferInputSchema,
	updateOffer: UpdateOfferInputSchema,
	retrieveOffer: RetrieveOfferInputSchema,
	listOffers: ListOffersInputSchema,
	deleteOffer: DeleteOfferInputSchema,
	linkLocationToOffer: LinkLocationToOfferInputSchema,
	linkAllBrandLocationsToOffer: LinkAllBrandLocationsToOfferInputSchema,
	unlinkLocationToOffer: UnlinkLocationToOfferInputSchema,
	sendOfferToBrand: SendOfferToBrandInputSchema,
	activateOfferOnCard: ActivateOfferOnCardInputSchema,
	unlinkCardFromOffer: UnlinkCardFromOfferInputSchema,
	retrieveActiveOfferOnCard: RetrieveActiveOfferOnCardInputSchema,
	listCardsWithActiveOffer: ListCardsWithActiveOfferInputSchema,
} as const;

export const FidelEndpointOutputSchemas = {
	createBrand: FidelItemsOutputSchema,
	retrieveBrand: FidelItemsOutputSchema,
	listBrands: FidelItemsOutputSchema,
	updateBrand: FidelItemsOutputSchema,
	deleteBrand: FidelEmptyOutputSchema,
	listPrograms: FidelItemsOutputSchema,
	createProgram: FidelItemsOutputSchema,
	updateProgram: FidelItemsOutputSchema,
	retrieveProgram: FidelItemsOutputSchema,
	createLocation: FidelItemsOutputSchema,
	retrieveLocation: FidelItemsOutputSchema,
	updateLocation: FidelItemsOutputSchema,
	listLocations: FidelItemsOutputSchema,
	listLocationsByBrand: FidelItemsOutputSchema,
	listLocationsByOffer: FidelItemsOutputSchema,
	deleteLocation: FidelEmptyOutputSchema,
	createCard: FidelItemsOutputSchema,
	retrieveCard: FidelItemsOutputSchema,
	listCards: FidelItemsOutputSchema,
	listCardsFromMetadataId: FidelItemsOutputSchema,
	deleteCard: FidelEmptyOutputSchema,
	updateCardMetadata: FidelItemsOutputSchema,
	createOffer: FidelItemsOutputSchema,
	updateOffer: FidelItemsOutputSchema,
	retrieveOffer: FidelItemsOutputSchema,
	listOffers: FidelItemsOutputSchema,
	deleteOffer: FidelEmptyOutputSchema,
	linkLocationToOffer: FidelItemsOutputSchema,
	linkAllBrandLocationsToOffer: FidelAckOutputSchema,
	unlinkLocationToOffer: FidelEmptyOutputSchema,
	sendOfferToBrand: FidelItemsOutputSchema,
	activateOfferOnCard: FidelItemsOutputSchema,
	unlinkCardFromOffer: FidelEmptyOutputSchema,
	retrieveActiveOfferOnCard: FidelItemsOutputSchema,
	listCardsWithActiveOffer: FidelItemsOutputSchema,
} as const;

export type FidelEndpointInputs = {
	[K in keyof typeof FidelEndpointInputSchemas]: z.infer<
		(typeof FidelEndpointInputSchemas)[K]
	>;
};

export type FidelEndpointOutputs = {
	[K in keyof typeof FidelEndpointOutputSchemas]: z.infer<
		(typeof FidelEndpointOutputSchemas)[K]
	>;
};
