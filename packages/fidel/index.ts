import type {
	AuthTypes,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	createBrand,
	deleteBrand,
	listBrands,
	retrieveBrand,
	updateBrand,
} from './endpoints/brands';
import {
	deleteCard,
	listCards,
	listCardsFromMetadataId,
	retrieveCard,
	updateCardMetadata,
} from './endpoints/cards';
import {
	createLocation,
	deleteLocation,
	listLocations,
	listLocationsByBrand,
	listLocationsByOffer,
	retrieveLocation,
	updateLocation,
} from './endpoints/locations';
import {
	createOfferFromMarketplaceOffer,
	listMarketplaceOffers,
} from './endpoints/marketplace';
import { listMidInsights } from './endpoints/mid-insights';
import {
	createMidRequest,
	listMidRequests,
	retrieveMidRequest,
} from './endpoints/mid-requests';
import { listMids, retrieveMid } from './endpoints/mids';
import {
	createMissingTransactionRequest,
	listMissingTransactionRequests,
	retrieveMissingTransactionRequest,
} from './endpoints/missing-transaction-requests';
import {
	activateOfferOnCard,
	createOffer,
	deleteOffer,
	linkAllBrandLocationsToOffer,
	linkLocationToOffer,
	listCardsWithActiveOffer,
	listOffers,
	retrieveActiveOfferOnCard,
	retrieveOffer,
	sendOfferToBrand,
	unlinkCardFromOffer,
	unlinkLocationToOffer,
	updateOffer,
} from './endpoints/offers';
import {
	createProgram,
	listPrograms,
	retrieveProgram,
	updateProgram,
} from './endpoints/programs';
import {
	createTransactionTest,
	listTransactions,
	listTransactionsByCard,
	retrieveTransaction,
} from './endpoints/transactions';
import type {
	FidelEndpointInputs,
	FidelEndpointOutputs,
} from './endpoints/types';
import {
	FidelEndpointInputSchemas,
	FidelEndpointOutputSchemas,
} from './endpoints/types';
import {
	createBrandWebhook,
	createProgramWebhook,
	deleteWebhook,
	listWebhooks,
	retrieveWebhook,
	updateWebhook,
} from './endpoints/webhooks';
import { errorHandlers } from './error-handlers';
import { FidelSchema } from './schema';

export type FidelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFidelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof fidelEndpointsNested>;
};

const defaultAuthType: AuthTypes = 'api_key';

export const fidelAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseFidelPlugin<T extends FidelPluginOptions> = CorsairPlugin<
	'fidel',
	typeof FidelSchema,
	typeof fidelEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalFidelPlugin = BaseFidelPlugin<FidelPluginOptions>;

export type ExternalFidelPlugin<T extends FidelPluginOptions> =
	BaseFidelPlugin<T>;

export type FidelContext = CorsairPluginContext<
	typeof FidelSchema,
	FidelPluginOptions
>;

export type FidelKeyBuilderContext = KeyBuilderContext<FidelPluginOptions>;

export type FidelEndpoints = {
	[K in keyof FidelEndpointInputs]: CorsairEndpoint<
		FidelContext,
		FidelEndpointInputs[K],
		FidelEndpointOutputs[K]
	>;
};

// Binds every Fidel endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata. The runtime context and per-operation shapes are
// intentional opacity: each unknown below carries its own justification.
function withFidelSchemas<
	T extends Record<string, unknown>, // unknown: the tree mixes endpoint functions with family objects at any depth
>(tree: T, prefix = ''): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				fidelEndpointSchemas[operation as keyof typeof fidelEndpointSchemas];
			if (!schema) {
				throw new Error(`Missing Fidel endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown, // unknown: the Corsair runtime context varies by deployment; passed through untouched
				input: unknown, // unknown: parsed by schema.input.parse before the call
			) => Promise<unknown>; // unknown: each operation returns its own documented shape, parsed by schema.output.parse
			const validated = async (
				ctx: unknown, // unknown: same runtime context as above; only the schema boundary wraps the call
				input: unknown, // unknown: caller-supplied payload, parsed before transport
			) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				// unknown: family group nodes are plain objects at arbitrary
				// depth; the wrapper recurses so every nested leaf gets a
				// contract from the registry.
				withFidelSchemas(
					value as Record<string, unknown>, // unknown: a family group object, recursed one level deeper
					operation,
				),
			];
		}
		return [key, value];
	});
	// unknown: the rebuild keeps the caller's tree shape while every leaf is
	// replaced by its schema-validated wrapper; TypeScript cannot express the
	// mixed function/object remap structurally, and the satisfies-checked
	// tree definition plus the endpoint schemas registry keep it honest.
	return Object.fromEntries(validatedEntries) as T; // unknown: same tree shape, leaves wrapped by their contracts
}

const fidelEndpointsNested = {
	brands: {
		createBrand: createBrand,
		retrieveBrand: retrieveBrand,
		listBrands: listBrands,
		updateBrand: updateBrand,
		deleteBrand: deleteBrand,
	},
	programs: {
		listPrograms: listPrograms,
		createProgram: createProgram,
		updateProgram: updateProgram,
		retrieveProgram: retrieveProgram,
	},
	locations: {
		createLocation: createLocation,
		retrieveLocation: retrieveLocation,
		updateLocation: updateLocation,
		listLocations: listLocations,
		listLocationsByBrand: listLocationsByBrand,
		listLocationsByOffer: listLocationsByOffer,
		deleteLocation: deleteLocation,
	},
	cards: {
		retrieveCard: retrieveCard,
		listCards: listCards,
		listCardsFromMetadataId: listCardsFromMetadataId,
		deleteCard: deleteCard,
		updateCardMetadata: updateCardMetadata,
	},
	webhooks: {
		createBrandWebhook: createBrandWebhook,
		createProgramWebhook: createProgramWebhook,
		retrieveWebhook: retrieveWebhook,
		updateWebhook: updateWebhook,
		listWebhooks: listWebhooks,
		deleteWebhook: deleteWebhook,
	},
	offers: {
		createOffer: createOffer,
		updateOffer: updateOffer,
		retrieveOffer: retrieveOffer,
		listOffers: listOffers,
		deleteOffer: deleteOffer,
		linkLocationToOffer: linkLocationToOffer,
		linkAllBrandLocationsToOffer: linkAllBrandLocationsToOffer,
		unlinkLocationToOffer: unlinkLocationToOffer,
		sendOfferToBrand: sendOfferToBrand,
		activateOfferOnCard: activateOfferOnCard,
		unlinkCardFromOffer: unlinkCardFromOffer,
		retrieveActiveOfferOnCard: retrieveActiveOfferOnCard,
		listCardsWithActiveOffer: listCardsWithActiveOffer,
	},
	transactions: {
		createTransactionTest: createTransactionTest,
		retrieveTransaction: retrieveTransaction,
		listTransactions: listTransactions,
		listTransactionsByCard: listTransactionsByCard,
	},
	mids: {
		listMids: listMids,
		retrieveMid: retrieveMid,
	},
	'mid-requests': {
		retrieveMidRequest: retrieveMidRequest,
		listMidRequests: listMidRequests,
		createMidRequest: createMidRequest,
	},
	marketplace: {
		listMarketplaceOffers: listMarketplaceOffers,
		createOfferFromMarketplaceOffer: createOfferFromMarketplaceOffer,
	},
	'missing-transaction-requests': {
		createMissingTransactionRequest: createMissingTransactionRequest,
		retrieveMissingTransactionRequest: retrieveMissingTransactionRequest,
		listMissingTransactionRequests: listMissingTransactionRequests,
	},
	'mid-insights': {
		listMidInsights: listMidInsights,
	},
} as const;

export const fidelEndpointMeta = {
	'brands.createBrand': {
		riskLevel: 'write',
		description: 'Create a brand on Fidel',
	},
	'brands.retrieveBrand': {
		riskLevel: 'read',
		description: 'Retrieve a brand by ID',
	},
	'brands.listBrands': {
		riskLevel: 'read',
		description: 'List the brands on the Fidel account',
	},
	'brands.updateBrand': {
		riskLevel: 'write',
		description: 'Update the details of a brand',
	},
	'brands.deleteBrand': {
		riskLevel: 'destructive',
		description: 'Delete a brand from the Fidel account',
	},
	'programs.listPrograms': {
		riskLevel: 'read',
		description: 'List the programs on the Fidel account',
	},
	'programs.createProgram': {
		riskLevel: 'write',
		description: 'Create a program on Fidel',
	},
	'programs.updateProgram': {
		riskLevel: 'write',
		description: 'Update the details of a program',
	},
	'programs.retrieveProgram': {
		riskLevel: 'read',
		description: 'Retrieve a program by ID',
	},
	'locations.createLocation': {
		riskLevel: 'write',
		description: 'Create a location under a program and brand',
	},
	'locations.retrieveLocation': {
		riskLevel: 'read',
		description: 'Retrieve a location by ID',
	},
	'locations.updateLocation': {
		riskLevel: 'write',
		description: 'Update the details of a location',
	},
	'locations.listLocations': {
		riskLevel: 'read',
		description: 'List the locations of a program',
	},
	'locations.listLocationsByBrand': {
		riskLevel: 'read',
		description: 'List the locations of a brand within a program',
	},
	'locations.listLocationsByOffer': {
		riskLevel: 'read',
		description: 'List the locations linked to an offer',
	},
	'locations.deleteLocation': {
		riskLevel: 'destructive',
		description: 'Delete a location from a program',
	},
	'cards.retrieveCard': {
		riskLevel: 'read',
		description: 'Retrieve a linked card by ID',
	},
	'cards.listCards': {
		riskLevel: 'read',
		description: 'List the linked cards of a program',
	},
	'cards.listCardsFromMetadataId': {
		riskLevel: 'read',
		description: 'List the linked cards matching a metadata identifier',
	},
	'cards.deleteCard': {
		riskLevel: 'destructive',
		description: 'Remove a linked card from a program',
	},
	'cards.updateCardMetadata': {
		riskLevel: 'write',
		description: 'Replace the metadata of a linked card',
	},
	'webhooks.createBrandWebhook': {
		riskLevel: 'write',
		description: 'Create a webhook for brand events on Fidel',
	},
	'webhooks.createProgramWebhook': {
		riskLevel: 'write',
		description: 'Create a webhook for program events on Fidel',
	},
	'webhooks.retrieveWebhook': {
		riskLevel: 'read',
		description: 'Retrieve a webhook by ID',
	},
	'webhooks.updateWebhook': {
		riskLevel: 'write',
		description: 'Update the details of a webhook',
	},
	'webhooks.listWebhooks': {
		riskLevel: 'read',
		description: 'List the webhooks of a program',
	},
	'webhooks.deleteWebhook': {
		riskLevel: 'destructive',
		description: 'Delete a webhook from a program',
	},
	'offers.createOffer': {
		riskLevel: 'write',
		description: 'Create an offer on Fidel',
	},
	'offers.updateOffer': {
		riskLevel: 'write',
		description: 'Update the details of an offer',
	},
	'offers.retrieveOffer': {
		riskLevel: 'read',
		description: 'Retrieve an offer by ID',
	},
	'offers.listOffers': {
		riskLevel: 'read',
		description: 'List the offers of a program',
	},
	'offers.deleteOffer': {
		riskLevel: 'destructive',
		description: 'Delete an offer from Fidel',
	},
	'offers.linkLocationToOffer': {
		riskLevel: 'write',
		description: 'Link a location to an offer',
	},
	'offers.linkAllBrandLocationsToOffer': {
		riskLevel: 'write',
		description: 'Link every location of a brand in a program to an offer',
	},
	'offers.unlinkLocationToOffer': {
		riskLevel: 'destructive',
		description: 'Unlink a location from an offer',
	},
	'offers.sendOfferToBrand': {
		riskLevel: 'write',
		description:
			'Send an offer to its brand for approval; this notifies the brand and works only in the live environment',
	},
	'offers.activateOfferOnCard': {
		riskLevel: 'write',
		description: 'Activate an offer on a linked card',
	},
	'offers.unlinkCardFromOffer': {
		riskLevel: 'destructive',
		description: 'Deactivate an offer on a linked card and reset its usage',
	},
	'offers.retrieveActiveOfferOnCard': {
		riskLevel: 'read',
		description: 'Check whether an offer is active on a linked card',
	},
	'offers.listCardsWithActiveOffer': {
		riskLevel: 'read',
		description: 'List the linked cards with an active offer',
	},
	'transactions.createTransactionTest': {
		riskLevel: 'write',
		description: 'Create a test transaction in the test environment',
	},
	'transactions.retrieveTransaction': {
		riskLevel: 'read',
		description: 'Retrieve a transaction by ID',
	},
	'transactions.listTransactions': {
		riskLevel: 'read',
		description: 'List the transactions of a program',
	},
	'transactions.listTransactionsByCard': {
		riskLevel: 'read',
		description: 'List the transactions of a linked card',
	},
	'mids.listMids': {
		riskLevel: 'read',
		description: 'List the merchant IDs of a program',
	},
	'mids.retrieveMid': {
		riskLevel: 'read',
		description: 'Retrieve a merchant ID of a program by ID',
	},
	'mid-requests.retrieveMidRequest': {
		riskLevel: 'read',
		description: 'Retrieve a MID request by ID',
	},
	'mid-requests.listMidRequests': {
		riskLevel: 'read',
		description: 'List the MID requests of a program',
	},
	'mid-requests.createMidRequest': {
		riskLevel: 'write',
		description:
			'Create a MID request to onboard, offboard or reassign a merchant ID; offboarding stops transaction tracking for that MID',
	},
	'marketplace.listMarketplaceOffers': {
		riskLevel: 'read',
		description: 'List the offers available in the Fidel marketplace',
	},
	'marketplace.createOfferFromMarketplaceOffer': {
		riskLevel: 'write',
		description: 'Create an offer from a marketplace offer',
	},
	'missing-transaction-requests.createMissingTransactionRequest': {
		riskLevel: 'write',
		description: 'Create a missing transaction request for a linked card',
	},
	'missing-transaction-requests.retrieveMissingTransactionRequest': {
		riskLevel: 'read',
		description: 'Retrieve a missing transaction request by ID',
	},
	'missing-transaction-requests.listMissingTransactionRequests': {
		riskLevel: 'read',
		description: 'List the missing transaction requests of a program',
	},
	'mid-insights.listMidInsights': {
		riskLevel: 'read',
		description: 'List the MID insights of a program',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof fidelEndpointsNested>;

export const fidelEndpointSchemas = {
	'brands.createBrand': {
		input: FidelEndpointInputSchemas.createBrand,
		output: FidelEndpointOutputSchemas.createBrand,
	},
	'brands.retrieveBrand': {
		input: FidelEndpointInputSchemas.retrieveBrand,
		output: FidelEndpointOutputSchemas.retrieveBrand,
	},
	'brands.listBrands': {
		input: FidelEndpointInputSchemas.listBrands,
		output: FidelEndpointOutputSchemas.listBrands,
	},
	'brands.updateBrand': {
		input: FidelEndpointInputSchemas.updateBrand,
		output: FidelEndpointOutputSchemas.updateBrand,
	},
	'brands.deleteBrand': {
		input: FidelEndpointInputSchemas.deleteBrand,
		output: FidelEndpointOutputSchemas.deleteBrand,
	},
	'programs.listPrograms': {
		input: FidelEndpointInputSchemas.listPrograms,
		output: FidelEndpointOutputSchemas.listPrograms,
	},
	'programs.createProgram': {
		input: FidelEndpointInputSchemas.createProgram,
		output: FidelEndpointOutputSchemas.createProgram,
	},
	'programs.updateProgram': {
		input: FidelEndpointInputSchemas.updateProgram,
		output: FidelEndpointOutputSchemas.updateProgram,
	},
	'programs.retrieveProgram': {
		input: FidelEndpointInputSchemas.retrieveProgram,
		output: FidelEndpointOutputSchemas.retrieveProgram,
	},
	'locations.createLocation': {
		input: FidelEndpointInputSchemas.createLocation,
		output: FidelEndpointOutputSchemas.createLocation,
	},
	'locations.retrieveLocation': {
		input: FidelEndpointInputSchemas.retrieveLocation,
		output: FidelEndpointOutputSchemas.retrieveLocation,
	},
	'locations.updateLocation': {
		input: FidelEndpointInputSchemas.updateLocation,
		output: FidelEndpointOutputSchemas.updateLocation,
	},
	'locations.listLocations': {
		input: FidelEndpointInputSchemas.listLocations,
		output: FidelEndpointOutputSchemas.listLocations,
	},
	'locations.listLocationsByBrand': {
		input: FidelEndpointInputSchemas.listLocationsByBrand,
		output: FidelEndpointOutputSchemas.listLocationsByBrand,
	},
	'locations.listLocationsByOffer': {
		input: FidelEndpointInputSchemas.listLocationsByOffer,
		output: FidelEndpointOutputSchemas.listLocationsByOffer,
	},
	'locations.deleteLocation': {
		input: FidelEndpointInputSchemas.deleteLocation,
		output: FidelEndpointOutputSchemas.deleteLocation,
	},
	'cards.retrieveCard': {
		input: FidelEndpointInputSchemas.retrieveCard,
		output: FidelEndpointOutputSchemas.retrieveCard,
	},
	'cards.listCards': {
		input: FidelEndpointInputSchemas.listCards,
		output: FidelEndpointOutputSchemas.listCards,
	},
	'cards.listCardsFromMetadataId': {
		input: FidelEndpointInputSchemas.listCardsFromMetadataId,
		output: FidelEndpointOutputSchemas.listCardsFromMetadataId,
	},
	'cards.deleteCard': {
		input: FidelEndpointInputSchemas.deleteCard,
		output: FidelEndpointOutputSchemas.deleteCard,
	},
	'cards.updateCardMetadata': {
		input: FidelEndpointInputSchemas.updateCardMetadata,
		output: FidelEndpointOutputSchemas.updateCardMetadata,
	},
	'webhooks.createBrandWebhook': {
		input: FidelEndpointInputSchemas.createBrandWebhook,
		output: FidelEndpointOutputSchemas.createBrandWebhook,
	},
	'webhooks.createProgramWebhook': {
		input: FidelEndpointInputSchemas.createProgramWebhook,
		output: FidelEndpointOutputSchemas.createProgramWebhook,
	},
	'webhooks.retrieveWebhook': {
		input: FidelEndpointInputSchemas.retrieveWebhook,
		output: FidelEndpointOutputSchemas.retrieveWebhook,
	},
	'webhooks.updateWebhook': {
		input: FidelEndpointInputSchemas.updateWebhook,
		output: FidelEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.listWebhooks': {
		input: FidelEndpointInputSchemas.listWebhooks,
		output: FidelEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.deleteWebhook': {
		input: FidelEndpointInputSchemas.deleteWebhook,
		output: FidelEndpointOutputSchemas.deleteWebhook,
	},
	'offers.createOffer': {
		input: FidelEndpointInputSchemas.createOffer,
		output: FidelEndpointOutputSchemas.createOffer,
	},
	'offers.updateOffer': {
		input: FidelEndpointInputSchemas.updateOffer,
		output: FidelEndpointOutputSchemas.updateOffer,
	},
	'offers.retrieveOffer': {
		input: FidelEndpointInputSchemas.retrieveOffer,
		output: FidelEndpointOutputSchemas.retrieveOffer,
	},
	'offers.listOffers': {
		input: FidelEndpointInputSchemas.listOffers,
		output: FidelEndpointOutputSchemas.listOffers,
	},
	'offers.deleteOffer': {
		input: FidelEndpointInputSchemas.deleteOffer,
		output: FidelEndpointOutputSchemas.deleteOffer,
	},
	'offers.linkLocationToOffer': {
		input: FidelEndpointInputSchemas.linkLocationToOffer,
		output: FidelEndpointOutputSchemas.linkLocationToOffer,
	},
	'offers.linkAllBrandLocationsToOffer': {
		input: FidelEndpointInputSchemas.linkAllBrandLocationsToOffer,
		output: FidelEndpointOutputSchemas.linkAllBrandLocationsToOffer,
	},
	'offers.unlinkLocationToOffer': {
		input: FidelEndpointInputSchemas.unlinkLocationToOffer,
		output: FidelEndpointOutputSchemas.unlinkLocationToOffer,
	},
	'offers.sendOfferToBrand': {
		input: FidelEndpointInputSchemas.sendOfferToBrand,
		output: FidelEndpointOutputSchemas.sendOfferToBrand,
	},
	'offers.activateOfferOnCard': {
		input: FidelEndpointInputSchemas.activateOfferOnCard,
		output: FidelEndpointOutputSchemas.activateOfferOnCard,
	},
	'offers.unlinkCardFromOffer': {
		input: FidelEndpointInputSchemas.unlinkCardFromOffer,
		output: FidelEndpointOutputSchemas.unlinkCardFromOffer,
	},
	'offers.retrieveActiveOfferOnCard': {
		input: FidelEndpointInputSchemas.retrieveActiveOfferOnCard,
		output: FidelEndpointOutputSchemas.retrieveActiveOfferOnCard,
	},
	'offers.listCardsWithActiveOffer': {
		input: FidelEndpointInputSchemas.listCardsWithActiveOffer,
		output: FidelEndpointOutputSchemas.listCardsWithActiveOffer,
	},
	'transactions.createTransactionTest': {
		input: FidelEndpointInputSchemas.createTransactionTest,
		output: FidelEndpointOutputSchemas.createTransactionTest,
	},
	'transactions.retrieveTransaction': {
		input: FidelEndpointInputSchemas.retrieveTransaction,
		output: FidelEndpointOutputSchemas.retrieveTransaction,
	},
	'transactions.listTransactions': {
		input: FidelEndpointInputSchemas.listTransactions,
		output: FidelEndpointOutputSchemas.listTransactions,
	},
	'transactions.listTransactionsByCard': {
		input: FidelEndpointInputSchemas.listTransactionsByCard,
		output: FidelEndpointOutputSchemas.listTransactionsByCard,
	},
	'mids.listMids': {
		input: FidelEndpointInputSchemas.listMids,
		output: FidelEndpointOutputSchemas.listMids,
	},
	'mids.retrieveMid': {
		input: FidelEndpointInputSchemas.retrieveMid,
		output: FidelEndpointOutputSchemas.retrieveMid,
	},
	'mid-requests.retrieveMidRequest': {
		input: FidelEndpointInputSchemas.retrieveMidRequest,
		output: FidelEndpointOutputSchemas.retrieveMidRequest,
	},
	'mid-requests.listMidRequests': {
		input: FidelEndpointInputSchemas.listMidRequests,
		output: FidelEndpointOutputSchemas.listMidRequests,
	},
	'mid-requests.createMidRequest': {
		input: FidelEndpointInputSchemas.createMidRequest,
		output: FidelEndpointOutputSchemas.createMidRequest,
	},
	'marketplace.listMarketplaceOffers': {
		input: FidelEndpointInputSchemas.listMarketplaceOffers,
		output: FidelEndpointOutputSchemas.listMarketplaceOffers,
	},
	'marketplace.createOfferFromMarketplaceOffer': {
		input: FidelEndpointInputSchemas.createOfferFromMarketplaceOffer,
		output: FidelEndpointOutputSchemas.createOfferFromMarketplaceOffer,
	},
	'missing-transaction-requests.createMissingTransactionRequest': {
		input: FidelEndpointInputSchemas.createMissingTransactionRequest,
		output: FidelEndpointOutputSchemas.createMissingTransactionRequest,
	},
	'missing-transaction-requests.retrieveMissingTransactionRequest': {
		input: FidelEndpointInputSchemas.retrieveMissingTransactionRequest,
		output: FidelEndpointOutputSchemas.retrieveMissingTransactionRequest,
	},
	'missing-transaction-requests.listMissingTransactionRequests': {
		input: FidelEndpointInputSchemas.listMissingTransactionRequests,
		output: FidelEndpointOutputSchemas.listMissingTransactionRequests,
	},
	'mid-insights.listMidInsights': {
		input: FidelEndpointInputSchemas.listMidInsights,
		output: FidelEndpointOutputSchemas.listMidInsights,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof fidelEndpointsNested>;

const validatedFidelEndpointsNested = withFidelSchemas(fidelEndpointsNested);

export function fidel<const T extends FidelPluginOptions>(
	incomingOptions: FidelPluginOptions & T = {} as FidelPluginOptions & T,
): ExternalFidelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'fidel',
		authConfig: fidelAuthConfig,
		schema: FidelSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedFidelEndpointsNested,
		webhooks: {},
		endpointMeta: fidelEndpointMeta,
		endpointSchemas: fidelEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FidelKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('fidel', 'api_key');
		},
	} satisfies InternalFidelPlugin;
}
