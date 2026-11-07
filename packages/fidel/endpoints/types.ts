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
