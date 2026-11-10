import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Addresses,
	Batches,
	CarrierAccounts,
	Customs,
	Orders,
	Parcels,
	ParcelTemplates,
	Pickups,
	Rates,
	Refunds,
	Shipments,
	Tracks,
	Transactions,
	Webhooks,
} from './endpoints';
import type {
	ShippoEndpointInputs,
	ShippoEndpointOutputs,
} from './endpoints/types';
import {
	ShippoEndpointInputSchemas,
	ShippoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ShippoSchema } from './schema';
import type { ShippoWebhookOutputs, ShippoWebhookPayload } from './webhooks';
import {
	createNotificationHandler,
	isShippoDelivery,
	matchShippoTenantWebhook,
	ShippoWebhookPayloadSchema,
} from './webhooks';

export type ShippoPluginOptions = {
	/**
	 * Shippo authenticates with a token in an `Authorization: ShippoToken …`
	 * header — not Bearer. The plugin treats it as an API key: one credential
	 * per account, no refresh.
	 */
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Shippo's HMAC secret for webhook verification. Shippo issues it through
	 * support (it is not a field on `POST /webhooks`), and verification is only
	 * performed when one is set — either this option or the account's stored
	 * `webhook_signature`. Without it, deliveries are accepted unsigned and the
	 * handler reports `signatureVerified: false`.
	 */
	webhookSecret?: string;
	hooks?: InternalShippoPlugin['hooks'];
	webhookHooks?: InternalShippoPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof shippoEndpointsNested>;
};

export type ShippoContext = CorsairPluginContext<
	typeof ShippoSchema,
	ShippoPluginOptions
>;

export type ShippoKeyBuilderContext = KeyBuilderContext<ShippoPluginOptions>;

export type ShippoBoundEndpoints = BindEndpoints<typeof shippoEndpointsNested>;

type ShippoEndpoint<K extends keyof ShippoEndpointOutputs> = CorsairEndpoint<
	ShippoContext,
	ShippoEndpointInputs[K],
	ShippoEndpointOutputs[K]
>;

export type ShippoEndpoints = {
	addressesList: ShippoEndpoint<'addressesList'>;
	addressesGet: ShippoEndpoint<'addressesGet'>;
	addressesCreate: ShippoEndpoint<'addressesCreate'>;
	addressesValidate: ShippoEndpoint<'addressesValidate'>;
	parcelsList: ShippoEndpoint<'parcelsList'>;
	parcelsGet: ShippoEndpoint<'parcelsGet'>;
	parcelsCreate: ShippoEndpoint<'parcelsCreate'>;
	shipmentsList: ShippoEndpoint<'shipmentsList'>;
	shipmentsGet: ShippoEndpoint<'shipmentsGet'>;
	shipmentsCreate: ShippoEndpoint<'shipmentsCreate'>;
	shipmentsRates: ShippoEndpoint<'shipmentsRates'>;
	shipmentsRatesInCurrency: ShippoEndpoint<'shipmentsRatesInCurrency'>;
	ratesGet: ShippoEndpoint<'ratesGet'>;
	transactionsList: ShippoEndpoint<'transactionsList'>;
	transactionsGet: ShippoEndpoint<'transactionsGet'>;
	transactionsCreate: ShippoEndpoint<'transactionsCreate'>;
	refundsList: ShippoEndpoint<'refundsList'>;
	refundsGet: ShippoEndpoint<'refundsGet'>;
	refundsCreate: ShippoEndpoint<'refundsCreate'>;
	tracksGet: ShippoEndpoint<'tracksGet'>;
	tracksRegister: ShippoEndpoint<'tracksRegister'>;
	customsItemsList: ShippoEndpoint<'customsItemsList'>;
	customsItemsGet: ShippoEndpoint<'customsItemsGet'>;
	customsItemsCreate: ShippoEndpoint<'customsItemsCreate'>;
	customsDeclarationsList: ShippoEndpoint<'customsDeclarationsList'>;
	customsDeclarationsGet: ShippoEndpoint<'customsDeclarationsGet'>;
	customsDeclarationsCreate: ShippoEndpoint<'customsDeclarationsCreate'>;
	batchesCreate: ShippoEndpoint<'batchesCreate'>;
	batchesGet: ShippoEndpoint<'batchesGet'>;
	batchesAddShipments: ShippoEndpoint<'batchesAddShipments'>;
	batchesRemoveShipments: ShippoEndpoint<'batchesRemoveShipments'>;
	batchesPurchase: ShippoEndpoint<'batchesPurchase'>;
	ordersList: ShippoEndpoint<'ordersList'>;
	ordersGet: ShippoEndpoint<'ordersGet'>;
	ordersCreate: ShippoEndpoint<'ordersCreate'>;
	pickupsCreate: ShippoEndpoint<'pickupsCreate'>;
	manifestsList: ShippoEndpoint<'manifestsList'>;
	manifestsGet: ShippoEndpoint<'manifestsGet'>;
	manifestsCreate: ShippoEndpoint<'manifestsCreate'>;
	carrierAccountsList: ShippoEndpoint<'carrierAccountsList'>;
	carrierAccountsGet: ShippoEndpoint<'carrierAccountsGet'>;
	carrierAccountsCreate: ShippoEndpoint<'carrierAccountsCreate'>;
	carrierAccountsUpdate: ShippoEndpoint<'carrierAccountsUpdate'>;
	carrierAccountsRegister: ShippoEndpoint<'carrierAccountsRegister'>;
	carrierAccountsRegistrationStatus: ShippoEndpoint<'carrierAccountsRegistrationStatus'>;
	carrierParcelTemplatesList: ShippoEndpoint<'carrierParcelTemplatesList'>;
	carrierParcelTemplatesGet: ShippoEndpoint<'carrierParcelTemplatesGet'>;
	userParcelTemplatesList: ShippoEndpoint<'userParcelTemplatesList'>;
	userParcelTemplatesGet: ShippoEndpoint<'userParcelTemplatesGet'>;
	userParcelTemplatesCreate: ShippoEndpoint<'userParcelTemplatesCreate'>;
	userParcelTemplatesUpdate: ShippoEndpoint<'userParcelTemplatesUpdate'>;
	userParcelTemplatesDelete: ShippoEndpoint<'userParcelTemplatesDelete'>;
	webhooksList: ShippoEndpoint<'webhooksList'>;
	webhooksGet: ShippoEndpoint<'webhooksGet'>;
	webhooksCreate: ShippoEndpoint<'webhooksCreate'>;
	webhooksUpdate: ShippoEndpoint<'webhooksUpdate'>;
	webhooksDelete: ShippoEndpoint<'webhooksDelete'>;
};

type ShippoWebhook<
	K extends keyof ShippoWebhookOutputs,
	TEvent,
> = CorsairWebhook<ShippoContext, TEvent, ShippoWebhookOutputs[K]>;

export type ShippoWebhooks = {
	notifications: {
		delivery: ShippoWebhook<'notification', ShippoWebhookPayload>;
	};
};

/**
 * One nested key per resource, matching the API reference's groups. The three
 * delete actions are registered under `delete`, which is reserved in
 * TypeScript, so the functions themselves are named `remove`.
 */
const shippoEndpointsNested = {
	addresses: {
		list: Addresses.list,
		get: Addresses.get,
		create: Addresses.create,
		validate: Addresses.validate,
	},
	parcels: {
		list: Parcels.list,
		get: Parcels.get,
		create: Parcels.create,
	},
	shipments: {
		list: Shipments.list,
		get: Shipments.get,
		create: Shipments.create,
		rates: Shipments.rates,
		ratesInCurrency: Shipments.ratesInCurrency,
	},
	rates: {
		get: Rates.get,
	},
	transactions: {
		list: Transactions.list,
		get: Transactions.get,
		create: Transactions.create,
	},
	refunds: {
		list: Refunds.list,
		get: Refunds.get,
		create: Refunds.create,
	},
	tracks: {
		get: Tracks.get,
		register: Tracks.register,
	},
	customsItems: {
		list: Customs.listItems,
		get: Customs.getItem,
		create: Customs.createItem,
	},
	customsDeclarations: {
		list: Customs.listDeclarations,
		get: Customs.getDeclaration,
		create: Customs.createDeclaration,
	},
	batches: {
		create: Batches.create,
		get: Batches.get,
		addShipments: Batches.addShipments,
		removeShipments: Batches.removeShipments,
		purchase: Batches.purchase,
	},
	orders: {
		list: Orders.list,
		get: Orders.get,
		create: Orders.create,
	},
	pickups: {
		create: Pickups.create,
	},
	manifests: {
		list: Pickups.listManifests,
		get: Pickups.getManifest,
		create: Pickups.createManifest,
	},
	carrierAccounts: {
		list: CarrierAccounts.list,
		get: CarrierAccounts.get,
		create: CarrierAccounts.create,
		update: CarrierAccounts.update,
		register: CarrierAccounts.register,
		registrationStatus: CarrierAccounts.registrationStatus,
	},
	parcelTemplates: {
		listCarrier: ParcelTemplates.listCarrierTemplates,
		getCarrier: ParcelTemplates.getCarrierTemplate,
		list: ParcelTemplates.list,
		get: ParcelTemplates.get,
		create: ParcelTemplates.create,
		update: ParcelTemplates.update,
		delete: ParcelTemplates.remove,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
} as const;

export const shippoEndpointSchemas = {
	'addresses.list': {
		input: ShippoEndpointInputSchemas.addressesList,
		output: ShippoEndpointOutputSchemas.addressesList,
	},
	'addresses.get': {
		input: ShippoEndpointInputSchemas.addressesGet,
		output: ShippoEndpointOutputSchemas.addressesGet,
	},
	'addresses.create': {
		input: ShippoEndpointInputSchemas.addressesCreate,
		output: ShippoEndpointOutputSchemas.addressesCreate,
	},
	'addresses.validate': {
		input: ShippoEndpointInputSchemas.addressesValidate,
		output: ShippoEndpointOutputSchemas.addressesValidate,
	},
	'parcels.list': {
		input: ShippoEndpointInputSchemas.parcelsList,
		output: ShippoEndpointOutputSchemas.parcelsList,
	},
	'parcels.get': {
		input: ShippoEndpointInputSchemas.parcelsGet,
		output: ShippoEndpointOutputSchemas.parcelsGet,
	},
	'parcels.create': {
		input: ShippoEndpointInputSchemas.parcelsCreate,
		output: ShippoEndpointOutputSchemas.parcelsCreate,
	},
	'shipments.list': {
		input: ShippoEndpointInputSchemas.shipmentsList,
		output: ShippoEndpointOutputSchemas.shipmentsList,
	},
	'shipments.get': {
		input: ShippoEndpointInputSchemas.shipmentsGet,
		output: ShippoEndpointOutputSchemas.shipmentsGet,
	},
	'shipments.create': {
		input: ShippoEndpointInputSchemas.shipmentsCreate,
		output: ShippoEndpointOutputSchemas.shipmentsCreate,
	},
	'shipments.rates': {
		input: ShippoEndpointInputSchemas.shipmentsRates,
		output: ShippoEndpointOutputSchemas.shipmentsRates,
	},
	'shipments.ratesInCurrency': {
		input: ShippoEndpointInputSchemas.shipmentsRatesInCurrency,
		output: ShippoEndpointOutputSchemas.shipmentsRatesInCurrency,
	},
	'rates.get': {
		input: ShippoEndpointInputSchemas.ratesGet,
		output: ShippoEndpointOutputSchemas.ratesGet,
	},
	'transactions.list': {
		input: ShippoEndpointInputSchemas.transactionsList,
		output: ShippoEndpointOutputSchemas.transactionsList,
	},
	'transactions.get': {
		input: ShippoEndpointInputSchemas.transactionsGet,
		output: ShippoEndpointOutputSchemas.transactionsGet,
	},
	'transactions.create': {
		input: ShippoEndpointInputSchemas.transactionsCreate,
		output: ShippoEndpointOutputSchemas.transactionsCreate,
	},
	'refunds.list': {
		input: ShippoEndpointInputSchemas.refundsList,
		output: ShippoEndpointOutputSchemas.refundsList,
	},
	'refunds.get': {
		input: ShippoEndpointInputSchemas.refundsGet,
		output: ShippoEndpointOutputSchemas.refundsGet,
	},
	'refunds.create': {
		input: ShippoEndpointInputSchemas.refundsCreate,
		output: ShippoEndpointOutputSchemas.refundsCreate,
	},
	'tracks.get': {
		input: ShippoEndpointInputSchemas.tracksGet,
		output: ShippoEndpointOutputSchemas.tracksGet,
	},
	'tracks.register': {
		input: ShippoEndpointInputSchemas.tracksRegister,
		output: ShippoEndpointOutputSchemas.tracksRegister,
	},
	'customsItems.list': {
		input: ShippoEndpointInputSchemas.customsItemsList,
		output: ShippoEndpointOutputSchemas.customsItemsList,
	},
	'customsItems.get': {
		input: ShippoEndpointInputSchemas.customsItemsGet,
		output: ShippoEndpointOutputSchemas.customsItemsGet,
	},
	'customsItems.create': {
		input: ShippoEndpointInputSchemas.customsItemsCreate,
		output: ShippoEndpointOutputSchemas.customsItemsCreate,
	},
	'customsDeclarations.list': {
		input: ShippoEndpointInputSchemas.customsDeclarationsList,
		output: ShippoEndpointOutputSchemas.customsDeclarationsList,
	},
	'customsDeclarations.get': {
		input: ShippoEndpointInputSchemas.customsDeclarationsGet,
		output: ShippoEndpointOutputSchemas.customsDeclarationsGet,
	},
	'customsDeclarations.create': {
		input: ShippoEndpointInputSchemas.customsDeclarationsCreate,
		output: ShippoEndpointOutputSchemas.customsDeclarationsCreate,
	},
	'batches.create': {
		input: ShippoEndpointInputSchemas.batchesCreate,
		output: ShippoEndpointOutputSchemas.batchesCreate,
	},
	'batches.get': {
		input: ShippoEndpointInputSchemas.batchesGet,
		output: ShippoEndpointOutputSchemas.batchesGet,
	},
	'batches.addShipments': {
		input: ShippoEndpointInputSchemas.batchesAddShipments,
		output: ShippoEndpointOutputSchemas.batchesAddShipments,
	},
	'batches.removeShipments': {
		input: ShippoEndpointInputSchemas.batchesRemoveShipments,
		output: ShippoEndpointOutputSchemas.batchesRemoveShipments,
	},
	'batches.purchase': {
		input: ShippoEndpointInputSchemas.batchesPurchase,
		output: ShippoEndpointOutputSchemas.batchesPurchase,
	},
	'orders.list': {
		input: ShippoEndpointInputSchemas.ordersList,
		output: ShippoEndpointOutputSchemas.ordersList,
	},
	'orders.get': {
		input: ShippoEndpointInputSchemas.ordersGet,
		output: ShippoEndpointOutputSchemas.ordersGet,
	},
	'orders.create': {
		input: ShippoEndpointInputSchemas.ordersCreate,
		output: ShippoEndpointOutputSchemas.ordersCreate,
	},
	'pickups.create': {
		input: ShippoEndpointInputSchemas.pickupsCreate,
		output: ShippoEndpointOutputSchemas.pickupsCreate,
	},
	'manifests.list': {
		input: ShippoEndpointInputSchemas.manifestsList,
		output: ShippoEndpointOutputSchemas.manifestsList,
	},
	'manifests.get': {
		input: ShippoEndpointInputSchemas.manifestsGet,
		output: ShippoEndpointOutputSchemas.manifestsGet,
	},
	'manifests.create': {
		input: ShippoEndpointInputSchemas.manifestsCreate,
		output: ShippoEndpointOutputSchemas.manifestsCreate,
	},
	'carrierAccounts.list': {
		input: ShippoEndpointInputSchemas.carrierAccountsList,
		output: ShippoEndpointOutputSchemas.carrierAccountsList,
	},
	'carrierAccounts.get': {
		input: ShippoEndpointInputSchemas.carrierAccountsGet,
		output: ShippoEndpointOutputSchemas.carrierAccountsGet,
	},
	'carrierAccounts.create': {
		input: ShippoEndpointInputSchemas.carrierAccountsCreate,
		output: ShippoEndpointOutputSchemas.carrierAccountsCreate,
	},
	'carrierAccounts.update': {
		input: ShippoEndpointInputSchemas.carrierAccountsUpdate,
		output: ShippoEndpointOutputSchemas.carrierAccountsUpdate,
	},
	'carrierAccounts.register': {
		input: ShippoEndpointInputSchemas.carrierAccountsRegister,
		output: ShippoEndpointOutputSchemas.carrierAccountsRegister,
	},
	'carrierAccounts.registrationStatus': {
		input: ShippoEndpointInputSchemas.carrierAccountsRegistrationStatus,
		output: ShippoEndpointOutputSchemas.carrierAccountsRegistrationStatus,
	},
	'parcelTemplates.listCarrier': {
		input: ShippoEndpointInputSchemas.carrierParcelTemplatesList,
		output: ShippoEndpointOutputSchemas.carrierParcelTemplatesList,
	},
	'parcelTemplates.getCarrier': {
		input: ShippoEndpointInputSchemas.carrierParcelTemplatesGet,
		output: ShippoEndpointOutputSchemas.carrierParcelTemplatesGet,
	},
	'parcelTemplates.list': {
		input: ShippoEndpointInputSchemas.userParcelTemplatesList,
		output: ShippoEndpointOutputSchemas.userParcelTemplatesList,
	},
	'parcelTemplates.get': {
		input: ShippoEndpointInputSchemas.userParcelTemplatesGet,
		output: ShippoEndpointOutputSchemas.userParcelTemplatesGet,
	},
	'parcelTemplates.create': {
		input: ShippoEndpointInputSchemas.userParcelTemplatesCreate,
		output: ShippoEndpointOutputSchemas.userParcelTemplatesCreate,
	},
	'parcelTemplates.update': {
		input: ShippoEndpointInputSchemas.userParcelTemplatesUpdate,
		output: ShippoEndpointOutputSchemas.userParcelTemplatesUpdate,
	},
	'parcelTemplates.delete': {
		input: ShippoEndpointInputSchemas.userParcelTemplatesDelete,
		output: ShippoEndpointOutputSchemas.userParcelTemplatesDelete,
	},
	'webhooks.list': {
		input: ShippoEndpointInputSchemas.webhooksList,
		output: ShippoEndpointOutputSchemas.webhooksList,
	},
	'webhooks.get': {
		input: ShippoEndpointInputSchemas.webhooksGet,
		output: ShippoEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.create': {
		input: ShippoEndpointInputSchemas.webhooksCreate,
		output: ShippoEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: ShippoEndpointInputSchemas.webhooksUpdate,
		output: ShippoEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: ShippoEndpointInputSchemas.webhooksDelete,
		output: ShippoEndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof shippoEndpointsNested
>;

const shippoWebhookSchemas = {
	'notifications.delivery': {
		description:
			'A Shippo webhook delivery: the `{ event, test, data }` envelope whose `data` is the full track, transaction or batch object',
		payload: ShippoWebhookPayloadSchema,
		response: ShippoWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof shippoWebhooksNested>;

const defaultAuthType = 'api_key' as const;

export const shippoEndpointMeta = {
	'addresses.list': {
		riskLevel: 'read',
		description: 'List the account’s saved addresses, most recent first',
	},
	'addresses.get': {
		riskLevel: 'read',
		description: 'Read one saved address by `object_id`',
	},
	'addresses.create': {
		riskLevel: 'write',
		description:
			'Create a reusable address. Only `country` is required, but buying a label needs a name and a street line',
	},
	'addresses.validate': {
		riskLevel: 'read',
		description:
			'Re-run validation on a saved address and read `validation_results`: whether it is valid, and what was corrected or could not be matched',
	},
	'parcels.list': {
		riskLevel: 'read',
		description: 'List the account’s saved parcels',
	},
	'parcels.get': {
		riskLevel: 'read',
		description: 'Read one saved parcel by `object_id`',
	},
	'parcels.create': {
		riskLevel: 'write',
		description:
			'Create a reusable parcel with its dimensions and weight, both as decimal strings',
	},
	'shipments.list': {
		riskLevel: 'read',
		description: 'List shipments, optionally limited to a creation-date window',
	},
	'shipments.get': {
		riskLevel: 'read',
		description: 'Read one shipment, including any rates already computed',
	},
	'shipments.create': {
		riskLevel: 'write',
		description:
			'Create a shipment from an origin, destination and one or more parcels; Shippo starts computing carrier rates. Pass `async: false` to get them back in the response',
	},
	'shipments.rates': {
		riskLevel: 'read',
		description:
			'List the rates computed for a shipment. This is what you call after an async create returned no rates',
	},
	'shipments.ratesInCurrency': {
		riskLevel: 'read',
		description: 'List a shipment’s rates expressed in a chosen currency',
	},
	'rates.get': {
		riskLevel: 'read',
		description:
			'Read one rate by `object_id`. Rates older than 390 days are gone',
	},
	'transactions.list': {
		riskLevel: 'read',
		description:
			'List bought labels, filterable by rate, object status or tracking status',
	},
	'transactions.get': {
		riskLevel: 'read',
		description:
			'Read one bought label. Re-read this rather than reusing a `label_url`, which expires',
	},
	'transactions.create': {
		riskLevel: 'write',
		description:
			'Buy a label from a rate: spends money on the account’s carrier and cannot be undone except by a refund',
	},
	'refunds.list': {
		riskLevel: 'read',
		description: 'List refund requests and their outcomes',
	},
	'refunds.get': {
		riskLevel: 'read',
		description: 'Read one refund request',
	},
	'refunds.create': {
		riskLevel: 'write',
		description:
			'Ask the carrier to void a bought label and refund it. The carrier may refuse, so the outcome arrives as a status',
	},
	'tracks.get': {
		riskLevel: 'read',
		description:
			'Read a tracking status and history for a carrier and tracking number',
	},
	'tracks.register': {
		riskLevel: 'write',
		description:
			'Register a tracking number Shippo has not seen, usually from a label bought elsewhere. From then on `track_updated` webhooks fire for it',
	},
	'customsItems.list': {
		riskLevel: 'read',
		description: 'List customs items used in international declarations',
	},
	'customsItems.get': {
		riskLevel: 'read',
		description: 'Read one customs item',
	},
	'customsItems.create': {
		riskLevel: 'write',
		description:
			'Create a customs item: what it is, how many, its weight and declared value',
	},
	'customsDeclarations.list': {
		riskLevel: 'read',
		description: 'List customs declarations',
	},
	'customsDeclarations.get': {
		riskLevel: 'read',
		description: 'Read one customs declaration',
	},
	'customsDeclarations.create': {
		riskLevel: 'write',
		description:
			'Create a customs declaration for an international shipment, certifying its contents and naming what to do if it cannot be delivered',
	},
	'batches.create': {
		riskLevel: 'write',
		description:
			'Create a batch of shipments to buy labels for together. Validation runs asynchronously',
	},
	'batches.get': {
		riskLevel: 'read',
		description:
			'Read a batch: its status, per-shipment results and the merged label URLs once purchased',
	},
	'batches.addShipments': {
		riskLevel: 'write',
		description: 'Add shipments to a batch that is still validating or valid',
	},
	'batches.removeShipments': {
		riskLevel: 'write',
		description: 'Remove shipments from a batch before it is purchased',
	},
	'batches.purchase': {
		riskLevel: 'write',
		description:
			'Buy every label in a batch: spends money per shipment and answers 202, so the labels arrive through `batches.get`',
	},
	'orders.list': {
		riskLevel: 'read',
		description:
			'List orders, filterable by status, shop app or when they were placed',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Read one order with its line items and buyer address',
	},
	'orders.create': {
		riskLevel: 'write',
		description:
			'Create an order so Shippo can group the labels bought to fulfil it',
	},
	'pickups.create': {
		riskLevel: 'write',
		description:
			'Ask a carrier to collect parcels, naming the transactions it covers and a pickup window',
	},
	'manifests.list': {
		riskLevel: 'read',
		description: 'List manifests, the end-of-day paperwork a carrier requires',
	},
	'manifests.get': {
		riskLevel: 'read',
		description: 'Read one manifest and its document URLs',
	},
	'manifests.create': {
		riskLevel: 'write',
		description:
			'Close out a carrier’s day with a manifest covering transactions not yet manifested',
	},
	'carrierAccounts.list': {
		riskLevel: 'read',
		description:
			'List the carrier accounts on the account. Every call that asks for rates depends on one of these being active',
	},
	'carrierAccounts.get': {
		riskLevel: 'read',
		description: 'Read one carrier account',
	},
	'carrierAccounts.create': {
		riskLevel: 'write',
		description:
			'Connect the caller’s own carrier account, with that carrier’s credential set',
	},
	'carrierAccounts.update': {
		riskLevel: 'write',
		description:
			'Change a carrier account’s credentials or switch it on or off',
	},
	'carrierAccounts.register': {
		riskLevel: 'write',
		description:
			'Enrol a Shippo-supplied carrier account rather than the caller’s own',
	},
	'carrierAccounts.registrationStatus': {
		riskLevel: 'read',
		description:
			'Check whether a carrier has approved the account for live rates',
	},
	'parcelTemplates.listCarrier': {
		riskLevel: 'read',
		description:
			'List the carrier’s predefined parcel templates, whose tokens can be reused instead of dimensions',
	},
	'parcelTemplates.getCarrier': {
		riskLevel: 'read',
		description: 'Read one carrier parcel template by its token',
	},
	'parcelTemplates.list': {
		riskLevel: 'read',
		description: 'List the account’s own parcel templates',
	},
	'parcelTemplates.get': {
		riskLevel: 'read',
		description: 'Read one of the account’s parcel templates',
	},
	'parcelTemplates.create': {
		riskLevel: 'write',
		description:
			'Save a reusable parcel template, optionally based on a carrier template token',
	},
	'parcelTemplates.update': {
		riskLevel: 'write',
		description: 'Change one of the account’s parcel templates',
	},
	'parcelTemplates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one of the account’s parcel templates. Anything still referring to its token stops resolving',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List the webhook subscriptions on the account',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook subscription',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Subscribe one URL to tracking, transaction or batch events, or to all of them',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Change a subscription’s URL or event, or switch it on or off',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook subscription. Shippo keeps creating tracking webhooks for labels it sells, so this only removes the one named',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof shippoEndpointsNested>;

export const shippoAuthConfig = {
	api_key: {
		// The Shippo account email is the stable id a webhook could be routed
		// on; the token itself carries no account id.
		account: ['shippo_account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseShippoPlugin<T extends ShippoPluginOptions> = CorsairPlugin<
	'shippo',
	typeof ShippoSchema,
	typeof shippoEndpointsNested,
	typeof shippoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalShippoPlugin = BaseShippoPlugin<ShippoPluginOptions>;

export type ExternalShippoPlugin<T extends ShippoPluginOptions> =
	BaseShippoPlugin<T>;

/**
 * The webhook tree, built per plugin instance because the HMAC secret is an
 * option. The path (`notifications.delivery`) is fixed, so `webhookSchemas`
 * and `pluginWebhookMatcher` stay valid whatever the secret is.
 */
function shippoWebhooksNestedFor(secret: string | undefined) {
	return {
		notifications: {
			delivery: createNotificationHandler(secret),
		},
	} as const;
}

/** The no-secret tree, for the type and the schemas. */
const shippoWebhooksNested = shippoWebhooksNestedFor(undefined);

export function shippo<const T extends ShippoPluginOptions>(
	incomingOptions: ShippoPluginOptions & T = {} as ShippoPluginOptions & T,
): ExternalShippoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'shippo',
		authConfig: shippoAuthConfig,
		schema: ShippoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: shippoEndpointsNested,
		webhooks: shippoWebhooksNestedFor(options.webhookSecret),
		endpointMeta: shippoEndpointMeta,
		endpointSchemas: shippoEndpointSchemas,
		webhookSchemas: shippoWebhookSchemas,
		// A Shippo delivery is the bare object envelope, and nothing else this
		// plugin emits looks like it, so `event` is the whole signal.
		pluginWebhookMatcher: (request) => isShippoDelivery(request),
		pluginTenantWebhookMatcher: matchShippoTenantWebhook,
		oauthWebhookTenantLinkResolver: undefined,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ShippoKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// The HMAC secret, when one is configured: the inline option wins
				// over the account's stored value. Empty when neither exists,
				// which the handler reads as "accept unsigned and report
				// signatureVerified: false" rather than failing every delivery.
				if (options.webhookSecret) return options.webhookSecret;
				try {
					return (await ctx.keys.get_webhook_signature()) ?? '';
				} catch {
					// Reading a stored secret needs the account DEK. An account
					// that was never initialised has none, and that must not turn
					// into a refused delivery: no secret is configured, so the
					// handler accepts it as unverified.
					return '';
				}
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('shippo', ctx.authType ?? 'api_key');
		},
	} satisfies InternalShippoPlugin;
}

export { ShippoAPIError } from './client';

export type {
	AddressCreateInput,
	AddressesListInput,
	AddressesListResponse,
	AddressGetInput,
	BatchCreateInput,
	BatchGetInput,
	CarrierAccountCreateInput,
	CarrierAccountGetInput,
	CarrierAccountsListInput,
	CarrierAccountUpdateInput,
	CustomsDeclarationCreateInput,
	CustomsDeclarationGetInput,
	CustomsDeclarationsListInput,
	CustomsItemCreateInput,
	CustomsItemGetInput,
	CustomsItemsListInput,
	ManifestCreateInput,
	ManifestGetInput,
	ManifestsListInput,
	OrderCreateInput,
	OrderGetInput,
	OrdersListInput,
	ParcelCreateInput,
	ParcelGetInput,
	ParcelsListInput,
	PickupCreateInput,
	RateGetInput,
	RefundCreateInput,
	RefundGetInput,
	RefundsListInput,
	ShipmentCreateInput,
	ShipmentGetInput,
	ShipmentRatesInCurrencyInput,
	ShipmentRatesInput,
	ShipmentsListInput,
	ShippoAddress,
	ShippoBatch,
	ShippoCarrierAccount,
	ShippoCustomsDeclaration,
	ShippoCustomsItem,
	ShippoEndpointInputs,
	ShippoEndpointOutputs,
	ShippoManifest,
	ShippoOperation,
	ShippoOrder,
	ShippoParcel,
	ShippoPickup,
	ShippoRate,
	ShippoRefund,
	ShippoShipment,
	ShippoTrack,
	ShippoTransaction,
	ShippoWebhook,
	TrackGetInput,
	TrackRegisterInput,
	TransactionCreateInput,
	TransactionGetInput,
	TransactionsListInput,
	UserParcelTemplateCreateInput,
	UserParcelTemplateGetInput,
	UserParcelTemplatesListInput,
	UserParcelTemplateUpdateInput,
	WebhookCreateInput,
	WebhookDeleteInput,
	WebhookGetInput,
	WebhooksListInput,
	WebhookUpdateInput,
} from './endpoints/types';

export type { ShippoWebhookOutputs, ShippoWebhookPayload } from './webhooks';
