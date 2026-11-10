import { z } from 'zod';

// unknown: Fidel returns open-ended records whose nested fields the
// provider does not fully document; the documented envelope is validated
// and items stay extensible.
const FidelRecordSchema = z.object({}).passthrough();
// unknown: every documented success body reports `execution` as a number
// of milliseconds; the record form is kept so an object never fails a call
// that already succeeded.
const FidelExecutionSchema = z.union([
	z.number(),
	z.record(z.string(), z.unknown()),
]);
// Fidel success envelope for item-bearing responses. It passes unlisted
// envelope fields through: output parsing runs after the provider has
// already applied the call, so it must not drop or reject documented data.
const FidelItemsOutputSchema = z
	.object({
		items: z.array(FidelRecordSchema).optional(),
		count: z.number().optional(),
		// unknown: the pagination cursor is an object on most lists and a
		// base64 string on MID insights. Pass it back as `start` (JSON
		// stringified when it is an object) to read the next page.
		last: z
			.unknown()
			.optional()
			.describe(
				'Cursor for the next page. Pass JSON.stringify(last) as start; on MID insights pass the string unchanged.',
			),
		// Set by the active-offer check: whether the offer is active on the card.
		exists: z
			.boolean()
			.optional()
			.describe('Active-offer check only: whether the offer is active.'),
		resource: z.string().optional(),
		// unknown: the envelope status is documented without a fixed type;
		// both numeric and string forms appear in provider examples.
		status: z.union([z.string(), z.number()]).optional(),
		execution: FidelExecutionSchema.optional(),
	})
	.passthrough();
// Fidel 202 acknowledgement for asynchronous linking and marketplace
// offer creation.
const FidelAckOutputSchema = z
	.object({
		status: z.union([z.string(), z.number()]).optional(),
		message: z.string().optional(),
		resource: z.string().optional(),
		execution: FidelExecutionSchema.optional(),
	})
	.passthrough();
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
	// unknown: the provider documents searchBy as an open shape ({ merchantIds: { visa, mastercard, amex } }); values pass through as-is
	searchBy: z.record(z.string(), z.unknown()).optional(),
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
	// unknown: the metadata object is the whole request body and replaces the
	// card's metadata; its keys are caller-defined. Send {} to clear it.
	metadata: z.record(z.string(), z.unknown()),
});

const CreateBrandWebhookInputSchema = z.object({
	event: z.enum(['brand.consent']),
	url: z.string(),
	// unknown: the provider documents headers as an open shape; values pass through as-is
	headers: z.record(z.string(), z.unknown()).optional(),
});

const CreateProgramWebhookInputSchema = z.object({
	programId: z.string().min(1),
	event: z.enum([
		'card.linked',
		'card.failed',
		'program.status',
		'transaction.auth',
		'transaction.auth.qualified',
		'transaction.clearing',
		'transaction.clearing.qualified',
		'transaction.refund',
		'transaction.refund.qualified',
		'credits.balance.low',
		'marketplace.offer.live',
		'marketplace.offer.updated',
	]),
	url: z.string(),
	offerId: z.string().optional(),
	// unknown: the provider documents headers as an open shape; values pass through as-is
	headers: z.record(z.string(), z.unknown()).optional(),
});

const RetrieveWebhookInputSchema = z.object({
	hookId: z.string().min(1),
});

const UpdateWebhookInputSchema = z.object({
	hookId: z.string().min(1),
	event: z.string(),
	url: z.string(),
	programId: z.string().optional(),
	offerId: z.string().optional(),
	// unknown: the provider documents headers as an open shape; values pass through as-is
	headers: z.record(z.string(), z.unknown()).optional(),
});

const ListWebhooksInputSchema = z.object({
	programId: z.string().min(1),
	limit: z.string().optional(),
	event: z.string().optional(),
});

const DeleteWebhookInputSchema = z.object({
	hookId: z.string().min(1),
});

const CreateOfferInputSchema = z.object({
	brandId: z.string(),
	countryCode: z.string(),
	name: z.string(),
	startDate: z.string(),
	// unknown: the provider documents type as an open shape; values pass through as-is
	type: z.record(z.string(), z.unknown()).optional(),
	// Days the offer runs, 0 (Sunday) to 6 (Saturday).
	daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
	endDate: z.string().optional(),
	minTransactionAmount: z.number().optional(),
	returnPeriod: z.number().optional(),
	schemes: z.array(z.enum(['visa', 'mastercard', 'amex'])).optional(),
	// unknown: the provider documents activation as an open shape; values pass through as-is
	activation: z.record(z.string(), z.unknown()).optional(),
	// unknown: the provider documents metadata as an open shape; values pass through as-is
	metadata: z.record(z.string(), z.unknown()).optional(),
	feeSplit: z.number().optional(),
	channels: z.array(z.enum(['in-store', 'online'])).optional(),
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
	// Days the offer runs, 0 (Sunday) to 6 (Saturday).
	daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
	minTransactionAmount: z.number().optional(),
	returnPeriod: z.number().optional(),
	schemes: z.array(z.enum(['visa', 'mastercard', 'amex'])).optional(),
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

const CreateTransactionTestInputSchema = z.object({
	amount: z.number(),
	cardId: z.string(),
	locationId: z.string(),
});

const RetrieveTransactionInputSchema = z.object({
	transactionId: z.string().min(1),
});

const ListTransactionsInputSchema = z.object({
	programId: z.string().min(1),
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
});

const ListTransactionsByCardInputSchema = z.object({
	cardId: z.string().min(1),
	limit: z.string().optional(),
	start: z.string().optional(),
	order: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
});

const ListMidsInputSchema = z.object({
	programId: z.string().min(1),
	locationId: z.string().optional(),
	brandId: z.string().optional(),
	scheme: z.string().optional(),
	seNumber: z.string().optional(),
	mcAcquiringMid: z.string().optional(),
	visaAcquiringMid: z.string().optional(),
	vmid: z.string().optional(),
	limit: z.string().optional(),
	start: z.string().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
});

const RetrieveMidInputSchema = z.object({
	programId: z.string().min(1),
	midId: z.string().min(1),
});

const RetrieveMidRequestInputSchema = z.object({
	programId: z.string().min(1),
	midRequestId: z.string().min(1),
});

const ListMidRequestsInputSchema = z.object({
	programId: z.string().min(1),
	locationId: z.string().optional(),
	brandId: z.string().optional(),
	midId: z.string().optional(),
	status: z.string().optional(),
	scheme: z.string().optional(),
	seNumber: z.string().optional(),
	mcAcquiringMid: z.string().optional(),
	vmid: z.string().optional(),
	limit: z.string().optional(),
	start: z.string().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
});

const CreateMidRequestInputSchema = z.object({
	programId: z.string().min(1),
	action: z.enum(['onboard', 'offboard', 'reassign']),
	scheme: z.enum(['amex', 'mastercard', 'visa']).optional(),
	locationId: z.string().optional(),
	midId: z.string().optional(),
	origin: z
		.enum([
			'missing-transaction-lookup',
			'brand-provided-mid',
			'processor-provided-mid',
			'third-party-provided-mid',
			'manual-mid-lookup',
		])
		.optional(),
	reason: z
		.enum([
			'wrong-mid',
			'undesired-mid',
			'invalid-mid',
			'duplicated-location',
			'wrong-location',
		])
		.optional(),
	seNumber: z.string().optional(),
	mcAcquiringMid: z.string().optional(),
	mcLocationId: z.string().optional(),
	vmid: z.string().optional(),
	vsid: z.string().optional(),
	visaBin: z.string().optional(),
	visaAcquiringMid: z.string().optional(),
});

const ListMarketplaceOffersInputSchema = z.object({
	limit: z.string().optional(),
	start: z.string().optional(),
	select: z.string().optional(),
	order: z.string().optional(),
	sort: z.string().optional(),
	status: z.string().optional(),
	activation: z.string().optional(),
	approval: z.string().optional(),
	brandId: z.array(z.string()).optional(),
	channel: z.string().optional(),
	supplierId: z.string().optional(),
	countryCode: z.string().optional(),
	network: z.string().optional(),
	returnPeriod: z.string().optional(),
});

const CreateOfferFromMarketplaceOfferInputSchema = z.object({
	marketplaceOfferId: z.string().min(1),
	programIds: z.array(z.string().min(1)).min(1),
});

const CreateMissingTransactionRequestInputSchema = z.object({
	cardId: z.string().min(1),
	locationId: z.string(),
	amount: z.number(),
	transactionDate: z.string(),
});

const RetrieveMissingTransactionRequestInputSchema = z.object({
	missingTransactionRequestId: z.string().min(1),
});

const ListMissingTransactionRequestsInputSchema = z.object({
	programId: z.string().min(1),
	brandId: z.string().optional(),
	locationId: z.string().optional(),
	cardId: z.string().optional(),
	amount: z.string().optional(),
	transactionDate: z.string().optional(),
	scheme: z.string().optional(),
	status: z.string().optional(),
	limit: z.string().optional(),
	start: z.string().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
});

const ListMidInsightsInputSchema = z.object({
	programId: z.string().min(1),
	origin: z.array(z.string()).optional(),
	id: z.array(z.string()).optional(),
	status: z.string().optional(),
	brandId: z.string().optional(),
	locationId: z.string().optional(),
	midId: z.string().optional(),
	scheme: z.string().optional(),
	seNumber: z.string().optional(),
	mcAcquiringMid: z.string().optional(),
	mcLocationId: z.string().optional(),
	visaAcquiringMid: z.string().optional(),
	visaBin: z.string().optional(),
	vmid: z.string().optional(),
	vsid: z.string().optional(),
	lastSeenTransactionDateFrom: z.string().optional(),
	lastSeenTransactionDateTo: z.string().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	limit: z.number().optional(),
	start: z.string().optional(),
	select: z.string().optional(),
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
	retrieveCard: RetrieveCardInputSchema,
	listCards: ListCardsInputSchema,
	listCardsFromMetadataId: ListCardsFromMetadataIdInputSchema,
	deleteCard: DeleteCardInputSchema,
	updateCardMetadata: UpdateCardMetadataInputSchema,
	createBrandWebhook: CreateBrandWebhookInputSchema,
	createProgramWebhook: CreateProgramWebhookInputSchema,
	retrieveWebhook: RetrieveWebhookInputSchema,
	updateWebhook: UpdateWebhookInputSchema,
	listWebhooks: ListWebhooksInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
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
	createTransactionTest: CreateTransactionTestInputSchema,
	retrieveTransaction: RetrieveTransactionInputSchema,
	listTransactions: ListTransactionsInputSchema,
	listTransactionsByCard: ListTransactionsByCardInputSchema,
	listMids: ListMidsInputSchema,
	retrieveMid: RetrieveMidInputSchema,
	retrieveMidRequest: RetrieveMidRequestInputSchema,
	listMidRequests: ListMidRequestsInputSchema,
	createMidRequest: CreateMidRequestInputSchema,
	listMarketplaceOffers: ListMarketplaceOffersInputSchema,
	createOfferFromMarketplaceOffer: CreateOfferFromMarketplaceOfferInputSchema,
	createMissingTransactionRequest: CreateMissingTransactionRequestInputSchema,
	retrieveMissingTransactionRequest:
		RetrieveMissingTransactionRequestInputSchema,
	listMissingTransactionRequests: ListMissingTransactionRequestsInputSchema,
	listMidInsights: ListMidInsightsInputSchema,
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
	retrieveCard: FidelItemsOutputSchema,
	listCards: FidelItemsOutputSchema,
	listCardsFromMetadataId: FidelItemsOutputSchema,
	deleteCard: FidelEmptyOutputSchema,
	updateCardMetadata: FidelItemsOutputSchema,
	createBrandWebhook: FidelItemsOutputSchema,
	createProgramWebhook: FidelItemsOutputSchema,
	retrieveWebhook: FidelItemsOutputSchema,
	updateWebhook: FidelItemsOutputSchema,
	listWebhooks: FidelItemsOutputSchema,
	deleteWebhook: FidelEmptyOutputSchema,
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
	createTransactionTest: FidelItemsOutputSchema,
	retrieveTransaction: FidelItemsOutputSchema,
	listTransactions: FidelItemsOutputSchema,
	listTransactionsByCard: FidelItemsOutputSchema,
	listMids: FidelItemsOutputSchema,
	retrieveMid: FidelItemsOutputSchema,
	retrieveMidRequest: FidelItemsOutputSchema,
	listMidRequests: FidelItemsOutputSchema,
	createMidRequest: FidelItemsOutputSchema,
	listMarketplaceOffers: FidelItemsOutputSchema,
	createOfferFromMarketplaceOffer: FidelAckOutputSchema,
	createMissingTransactionRequest: FidelItemsOutputSchema,
	retrieveMissingTransactionRequest: FidelItemsOutputSchema,
	listMissingTransactionRequests: FidelItemsOutputSchema,
	listMidInsights: FidelItemsOutputSchema,
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
