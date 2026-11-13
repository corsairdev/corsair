import type {
	AuthTypes,
	BindEndpoints,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import type { SquareEnvironment } from './client';
import { SQUARE_BASE_URLS } from './client';
import {
	Bookings,
	Cards,
	Catalog,
	Channels,
	Checkout,
	CustomAttributeDefinitions,
	CustomAttributes,
	CustomerGroups,
	CustomerSegments,
	Customers,
	Disputes,
	Inventory,
	Invoices,
	Locations,
	Merchants,
	Oauth,
	Orders,
	PaymentLinks,
	Payments,
	Refunds,
	WebhookEventTypes,
	WebhookSubscriptions,
} from './endpoints';
import type {
	SquareEndpointInputs,
	SquareEndpointOutputs,
	SquareOperation,
} from './endpoints/types';
import {
	SquareEndpointInputSchemas as In,
	SquareEndpointOutputSchemas as Out,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SquareSchema } from './schema';

export type SquarePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	// Which Square host to call. Sandbox tokens only work on sandbox and
	// production tokens only on production. Defaults to production.
	environment?: SquareEnvironment;
	hooks?: InternalSquarePlugin['hooks'];
	webhookHooks?: InternalSquarePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof squareEndpointsNested>;
};

export type SquareContext = CorsairPluginContext<
	typeof SquareSchema,
	SquarePluginOptions
>;

export type SquareKeyBuilderContext = KeyBuilderContext<SquarePluginOptions>;

export type SquareBoundEndpoints = BindEndpoints<typeof squareEndpointsNested>;

type SquareEndpoint<K extends SquareOperation> = CorsairEndpoint<
	SquareContext,
	SquareEndpointInputs[K],
	SquareEndpointOutputs[K]
>;

export type SquareEndpoints = {
	disputesAccept: SquareEndpoint<'disputesAccept'>;
	customersAddGroup: SquareEndpoint<'customersAddGroup'>;
	customAttributesCustomerBulkUpsert: SquareEndpoint<'customAttributesCustomerBulkUpsert'>;
	customAttributesLocationBulkUpsert: SquareEndpoint<'customAttributesLocationBulkUpsert'>;
	customAttributesMerchantBulkUpsert: SquareEndpoint<'customAttributesMerchantBulkUpsert'>;
	customersBulkDelete: SquareEndpoint<'customersBulkDelete'>;
	channelsBulkGet: SquareEndpoint<'channelsBulkGet'>;
	customersBulkUpdate: SquareEndpoint<'customersBulkUpdate'>;
	ordersCalculate: SquareEndpoint<'ordersCalculate'>;
	invoicesCancel: SquareEndpoint<'invoicesCancel'>;
	paymentsCancel: SquareEndpoint<'paymentsCancel'>;
	customersBulkCreate: SquareEndpoint<'customersBulkCreate'>;
	cardsCreate: SquareEndpoint<'cardsCreate'>;
	customersCreate: SquareEndpoint<'customersCreate'>;
	customAttributeDefinitionsCustomerCreate: SquareEndpoint<'customAttributeDefinitionsCustomerCreate'>;
	customerGroupsCreate: SquareEndpoint<'customerGroupsCreate'>;
	disputesCreateEvidenceFile: SquareEndpoint<'disputesCreateEvidenceFile'>;
	disputesCreateEvidenceText: SquareEndpoint<'disputesCreateEvidenceText'>;
	invoicesCreateAttachment: SquareEndpoint<'invoicesCreateAttachment'>;
	locationsCreate: SquareEndpoint<'locationsCreate'>;
	customAttributeDefinitionsLocationCreate: SquareEndpoint<'customAttributeDefinitionsLocationCreate'>;
	customersDelete: SquareEndpoint<'customersDelete'>;
	customAttributesCustomerDelete: SquareEndpoint<'customAttributesCustomerDelete'>;
	customAttributeDefinitionsCustomerDelete: SquareEndpoint<'customAttributeDefinitionsCustomerDelete'>;
	customerGroupsDelete: SquareEndpoint<'customerGroupsDelete'>;
	disputesDeleteEvidence: SquareEndpoint<'disputesDeleteEvidence'>;
	invoicesDelete: SquareEndpoint<'invoicesDelete'>;
	invoicesDeleteAttachment: SquareEndpoint<'invoicesDeleteAttachment'>;
	customAttributesLocationDelete: SquareEndpoint<'customAttributesLocationDelete'>;
	customAttributeDefinitionsLocationDelete: SquareEndpoint<'customAttributeDefinitionsLocationDelete'>;
	customAttributesLocationBulkDelete: SquareEndpoint<'customAttributesLocationBulkDelete'>;
	customAttributesMerchantDelete: SquareEndpoint<'customAttributesMerchantDelete'>;
	customAttributeDefinitionsMerchantDelete: SquareEndpoint<'customAttributeDefinitionsMerchantDelete'>;
	customAttributesMerchantBulkDelete: SquareEndpoint<'customAttributesMerchantBulkDelete'>;
	webhookSubscriptionsDelete: SquareEndpoint<'webhookSubscriptionsDelete'>;
	bookingsGetBusinessProfile: SquareEndpoint<'bookingsGetBusinessProfile'>;
	merchantsGet: SquareEndpoint<'merchantsGet'>;
	customAttributesCustomerGet: SquareEndpoint<'customAttributesCustomerGet'>;
	customAttributeDefinitionsCustomerGet: SquareEndpoint<'customAttributeDefinitionsCustomerGet'>;
	disputesGetEvidence: SquareEndpoint<'disputesGetEvidence'>;
	invoicesGet: SquareEndpoint<'invoicesGet'>;
	checkoutGetLocationSettings: SquareEndpoint<'checkoutGetLocationSettings'>;
	channelsList: SquareEndpoint<'channelsList'>;
	customAttributeDefinitionsCustomerList: SquareEndpoint<'customAttributeDefinitionsCustomerList'>;
	customAttributesCustomerList: SquareEndpoint<'customAttributesCustomerList'>;
	customerGroupsList: SquareEndpoint<'customerGroupsList'>;
	customerSegmentsList: SquareEndpoint<'customerSegmentsList'>;
	customersList: SquareEndpoint<'customersList'>;
	disputesListEvidence: SquareEndpoint<'disputesListEvidence'>;
	invoicesList: SquareEndpoint<'invoicesList'>;
	customAttributeDefinitionsLocationList: SquareEndpoint<'customAttributeDefinitionsLocationList'>;
	locationsList: SquareEndpoint<'locationsList'>;
	customAttributesLocationList: SquareEndpoint<'customAttributesLocationList'>;
	customAttributeDefinitionsMerchantList: SquareEndpoint<'customAttributeDefinitionsMerchantList'>;
	merchantsList: SquareEndpoint<'merchantsList'>;
	customAttributesMerchantList: SquareEndpoint<'customAttributesMerchantList'>;
	paymentsList: SquareEndpoint<'paymentsList'>;
	webhookEventTypesList: SquareEndpoint<'webhookEventTypesList'>;
	webhookSubscriptionsList: SquareEndpoint<'webhookSubscriptionsList'>;
	customersRemoveGroup: SquareEndpoint<'customersRemoveGroup'>;
	customersBulkGet: SquareEndpoint<'customersBulkGet'>;
	channelsGet: SquareEndpoint<'channelsGet'>;
	customersGet: SquareEndpoint<'customersGet'>;
	customerGroupsGet: SquareEndpoint<'customerGroupsGet'>;
	customerSegmentsGet: SquareEndpoint<'customerSegmentsGet'>;
	disputesGet: SquareEndpoint<'disputesGet'>;
	locationsGet: SquareEndpoint<'locationsGet'>;
	customAttributesLocationGet: SquareEndpoint<'customAttributesLocationGet'>;
	customAttributeDefinitionsLocationGet: SquareEndpoint<'customAttributeDefinitionsLocationGet'>;
	customAttributesMerchantGet: SquareEndpoint<'customAttributesMerchantGet'>;
	customAttributeDefinitionsMerchantGet: SquareEndpoint<'customAttributeDefinitionsMerchantGet'>;
	ordersGet: SquareEndpoint<'ordersGet'>;
	paymentLinksGet: SquareEndpoint<'paymentLinksGet'>;
	oauthGetTokenStatus: SquareEndpoint<'oauthGetTokenStatus'>;
	webhookSubscriptionsGet: SquareEndpoint<'webhookSubscriptionsGet'>;
	customersSearch: SquareEndpoint<'customersSearch'>;
	ordersSearch: SquareEndpoint<'ordersSearch'>;
	disputesSubmitEvidence: SquareEndpoint<'disputesSubmitEvidence'>;
	webhookSubscriptionsTest: SquareEndpoint<'webhookSubscriptionsTest'>;
	customersUpdate: SquareEndpoint<'customersUpdate'>;
	customAttributeDefinitionsCustomerUpdate: SquareEndpoint<'customAttributeDefinitionsCustomerUpdate'>;
	customerGroupsUpdate: SquareEndpoint<'customerGroupsUpdate'>;
	locationsUpdate: SquareEndpoint<'locationsUpdate'>;
	customAttributeDefinitionsLocationUpdate: SquareEndpoint<'customAttributeDefinitionsLocationUpdate'>;
	customAttributeDefinitionsMerchantUpdate: SquareEndpoint<'customAttributeDefinitionsMerchantUpdate'>;
	checkoutUpdateLocationSettings: SquareEndpoint<'checkoutUpdateLocationSettings'>;
	ordersUpdate: SquareEndpoint<'ordersUpdate'>;
	webhookSubscriptionsUpdate: SquareEndpoint<'webhookSubscriptionsUpdate'>;
	webhookSubscriptionsUpdateSignatureKey: SquareEndpoint<'webhookSubscriptionsUpdateSignatureKey'>;
	customAttributesCustomerUpsert: SquareEndpoint<'customAttributesCustomerUpsert'>;
	customAttributesLocationUpsert: SquareEndpoint<'customAttributesLocationUpsert'>;
	customAttributesMerchantUpsert: SquareEndpoint<'customAttributesMerchantUpsert'>;
	paymentsCreate: SquareEndpoint<'paymentsCreate'>;
	paymentsGet: SquareEndpoint<'paymentsGet'>;
	paymentsUpdate: SquareEndpoint<'paymentsUpdate'>;
	paymentsComplete: SquareEndpoint<'paymentsComplete'>;
	paymentsRefund: SquareEndpoint<'paymentsRefund'>;
	refundsGet: SquareEndpoint<'refundsGet'>;
	refundsList: SquareEndpoint<'refundsList'>;
	ordersCreate: SquareEndpoint<'ordersCreate'>;
	ordersPay: SquareEndpoint<'ordersPay'>;
	paymentLinksCreate: SquareEndpoint<'paymentLinksCreate'>;
	paymentLinksList: SquareEndpoint<'paymentLinksList'>;
	paymentLinksDelete: SquareEndpoint<'paymentLinksDelete'>;
	invoicesCreate: SquareEndpoint<'invoicesCreate'>;
	invoicesPublish: SquareEndpoint<'invoicesPublish'>;
	invoicesUpdate: SquareEndpoint<'invoicesUpdate'>;
	invoicesSearch: SquareEndpoint<'invoicesSearch'>;
	disputesList: SquareEndpoint<'disputesList'>;
	cardsList: SquareEndpoint<'cardsList'>;
	cardsGet: SquareEndpoint<'cardsGet'>;
	cardsDisable: SquareEndpoint<'cardsDisable'>;
	webhookSubscriptionsCreate: SquareEndpoint<'webhookSubscriptionsCreate'>;
	catalogList: SquareEndpoint<'catalogList'>;
	catalogSearch: SquareEndpoint<'catalogSearch'>;
	catalogGet: SquareEndpoint<'catalogGet'>;
	catalogUpsert: SquareEndpoint<'catalogUpsert'>;
	catalogDelete: SquareEndpoint<'catalogDelete'>;
	inventoryBatchGet: SquareEndpoint<'inventoryBatchGet'>;
	inventoryGet: SquareEndpoint<'inventoryGet'>;
	paymentsCancelByIdempotencyKey: SquareEndpoint<'paymentsCancelByIdempotencyKey'>;
	paymentLinksUpdate: SquareEndpoint<'paymentLinksUpdate'>;
	customAttributeDefinitionsMerchantCreate: SquareEndpoint<'customAttributeDefinitionsMerchantCreate'>;
};

export type SquareWebhooks = Record<string, never>;

export type SquareBoundWebhooks = Record<string, never>;

const squareEndpointsNested = {
	disputes: Disputes,
	customers: Customers,
	customAttributes: CustomAttributes,
	channels: Channels,
	orders: Orders,
	invoices: Invoices,
	payments: Payments,
	cards: Cards,
	customAttributeDefinitions: CustomAttributeDefinitions,
	customerGroups: CustomerGroups,
	locations: Locations,
	webhookSubscriptions: WebhookSubscriptions,
	bookings: Bookings,
	merchants: Merchants,
	checkout: Checkout,
	customerSegments: CustomerSegments,
	webhookEventTypes: WebhookEventTypes,
	paymentLinks: PaymentLinks,
	oauth: Oauth,
	refunds: Refunds,
	catalog: Catalog,
	inventory: Inventory,
} as const;

const squareWebhooksNested = {} as const;

export const squareEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof squareEndpointsNested
> = {
	'disputes.accept': { input: In.disputesAccept, output: Out.disputesAccept },
	'customers.addGroup': {
		input: In.customersAddGroup,
		output: Out.customersAddGroup,
	},
	'customAttributes.customer.bulkUpsert': {
		input: In.customAttributesCustomerBulkUpsert,
		output: Out.customAttributesCustomerBulkUpsert,
	},
	'customAttributes.location.bulkUpsert': {
		input: In.customAttributesLocationBulkUpsert,
		output: Out.customAttributesLocationBulkUpsert,
	},
	'customAttributes.merchant.bulkUpsert': {
		input: In.customAttributesMerchantBulkUpsert,
		output: Out.customAttributesMerchantBulkUpsert,
	},
	'customers.bulkDelete': {
		input: In.customersBulkDelete,
		output: Out.customersBulkDelete,
	},
	'channels.bulkGet': {
		input: In.channelsBulkGet,
		output: Out.channelsBulkGet,
	},
	'customers.bulkUpdate': {
		input: In.customersBulkUpdate,
		output: Out.customersBulkUpdate,
	},
	'orders.calculate': {
		input: In.ordersCalculate,
		output: Out.ordersCalculate,
	},
	'invoices.cancel': { input: In.invoicesCancel, output: Out.invoicesCancel },
	'payments.cancel': { input: In.paymentsCancel, output: Out.paymentsCancel },
	'customers.bulkCreate': {
		input: In.customersBulkCreate,
		output: Out.customersBulkCreate,
	},
	'cards.create': { input: In.cardsCreate, output: Out.cardsCreate },
	'customers.create': {
		input: In.customersCreate,
		output: Out.customersCreate,
	},
	'customAttributeDefinitions.customer.create': {
		input: In.customAttributeDefinitionsCustomerCreate,
		output: Out.customAttributeDefinitionsCustomerCreate,
	},
	'customerGroups.create': {
		input: In.customerGroupsCreate,
		output: Out.customerGroupsCreate,
	},
	'disputes.createEvidenceFile': {
		input: In.disputesCreateEvidenceFile,
		output: Out.disputesCreateEvidenceFile,
	},
	'disputes.createEvidenceText': {
		input: In.disputesCreateEvidenceText,
		output: Out.disputesCreateEvidenceText,
	},
	'invoices.createAttachment': {
		input: In.invoicesCreateAttachment,
		output: Out.invoicesCreateAttachment,
	},
	'locations.create': {
		input: In.locationsCreate,
		output: Out.locationsCreate,
	},
	'customAttributeDefinitions.location.create': {
		input: In.customAttributeDefinitionsLocationCreate,
		output: Out.customAttributeDefinitionsLocationCreate,
	},
	'customers.delete': {
		input: In.customersDelete,
		output: Out.customersDelete,
	},
	'customAttributes.customer.delete': {
		input: In.customAttributesCustomerDelete,
		output: Out.customAttributesCustomerDelete,
	},
	'customAttributeDefinitions.customer.delete': {
		input: In.customAttributeDefinitionsCustomerDelete,
		output: Out.customAttributeDefinitionsCustomerDelete,
	},
	'customerGroups.delete': {
		input: In.customerGroupsDelete,
		output: Out.customerGroupsDelete,
	},
	'disputes.deleteEvidence': {
		input: In.disputesDeleteEvidence,
		output: Out.disputesDeleteEvidence,
	},
	'invoices.delete': { input: In.invoicesDelete, output: Out.invoicesDelete },
	'invoices.deleteAttachment': {
		input: In.invoicesDeleteAttachment,
		output: Out.invoicesDeleteAttachment,
	},
	'customAttributes.location.delete': {
		input: In.customAttributesLocationDelete,
		output: Out.customAttributesLocationDelete,
	},
	'customAttributeDefinitions.location.delete': {
		input: In.customAttributeDefinitionsLocationDelete,
		output: Out.customAttributeDefinitionsLocationDelete,
	},
	'customAttributes.location.bulkDelete': {
		input: In.customAttributesLocationBulkDelete,
		output: Out.customAttributesLocationBulkDelete,
	},
	'customAttributes.merchant.delete': {
		input: In.customAttributesMerchantDelete,
		output: Out.customAttributesMerchantDelete,
	},
	'customAttributeDefinitions.merchant.delete': {
		input: In.customAttributeDefinitionsMerchantDelete,
		output: Out.customAttributeDefinitionsMerchantDelete,
	},
	'customAttributes.merchant.bulkDelete': {
		input: In.customAttributesMerchantBulkDelete,
		output: Out.customAttributesMerchantBulkDelete,
	},
	'webhookSubscriptions.delete': {
		input: In.webhookSubscriptionsDelete,
		output: Out.webhookSubscriptionsDelete,
	},
	'bookings.getBusinessProfile': {
		input: In.bookingsGetBusinessProfile,
		output: Out.bookingsGetBusinessProfile,
	},
	'merchants.get': { input: In.merchantsGet, output: Out.merchantsGet },
	'customAttributes.customer.get': {
		input: In.customAttributesCustomerGet,
		output: Out.customAttributesCustomerGet,
	},
	'customAttributeDefinitions.customer.get': {
		input: In.customAttributeDefinitionsCustomerGet,
		output: Out.customAttributeDefinitionsCustomerGet,
	},
	'disputes.getEvidence': {
		input: In.disputesGetEvidence,
		output: Out.disputesGetEvidence,
	},
	'invoices.get': { input: In.invoicesGet, output: Out.invoicesGet },
	'checkout.getLocationSettings': {
		input: In.checkoutGetLocationSettings,
		output: Out.checkoutGetLocationSettings,
	},
	'channels.list': { input: In.channelsList, output: Out.channelsList },
	'customAttributeDefinitions.customer.list': {
		input: In.customAttributeDefinitionsCustomerList,
		output: Out.customAttributeDefinitionsCustomerList,
	},
	'customAttributes.customer.list': {
		input: In.customAttributesCustomerList,
		output: Out.customAttributesCustomerList,
	},
	'customerGroups.list': {
		input: In.customerGroupsList,
		output: Out.customerGroupsList,
	},
	'customerSegments.list': {
		input: In.customerSegmentsList,
		output: Out.customerSegmentsList,
	},
	'customers.list': { input: In.customersList, output: Out.customersList },
	'disputes.listEvidence': {
		input: In.disputesListEvidence,
		output: Out.disputesListEvidence,
	},
	'invoices.list': { input: In.invoicesList, output: Out.invoicesList },
	'customAttributeDefinitions.location.list': {
		input: In.customAttributeDefinitionsLocationList,
		output: Out.customAttributeDefinitionsLocationList,
	},
	'locations.list': { input: In.locationsList, output: Out.locationsList },
	'customAttributes.location.list': {
		input: In.customAttributesLocationList,
		output: Out.customAttributesLocationList,
	},
	'customAttributeDefinitions.merchant.list': {
		input: In.customAttributeDefinitionsMerchantList,
		output: Out.customAttributeDefinitionsMerchantList,
	},
	'merchants.list': { input: In.merchantsList, output: Out.merchantsList },
	'customAttributes.merchant.list': {
		input: In.customAttributesMerchantList,
		output: Out.customAttributesMerchantList,
	},
	'payments.list': { input: In.paymentsList, output: Out.paymentsList },
	'webhookEventTypes.list': {
		input: In.webhookEventTypesList,
		output: Out.webhookEventTypesList,
	},
	'webhookSubscriptions.list': {
		input: In.webhookSubscriptionsList,
		output: Out.webhookSubscriptionsList,
	},
	'customers.removeGroup': {
		input: In.customersRemoveGroup,
		output: Out.customersRemoveGroup,
	},
	'customers.bulkGet': {
		input: In.customersBulkGet,
		output: Out.customersBulkGet,
	},
	'channels.get': { input: In.channelsGet, output: Out.channelsGet },
	'customers.get': { input: In.customersGet, output: Out.customersGet },
	'customerGroups.get': {
		input: In.customerGroupsGet,
		output: Out.customerGroupsGet,
	},
	'customerSegments.get': {
		input: In.customerSegmentsGet,
		output: Out.customerSegmentsGet,
	},
	'disputes.get': { input: In.disputesGet, output: Out.disputesGet },
	'locations.get': { input: In.locationsGet, output: Out.locationsGet },
	'customAttributes.location.get': {
		input: In.customAttributesLocationGet,
		output: Out.customAttributesLocationGet,
	},
	'customAttributeDefinitions.location.get': {
		input: In.customAttributeDefinitionsLocationGet,
		output: Out.customAttributeDefinitionsLocationGet,
	},
	'customAttributes.merchant.get': {
		input: In.customAttributesMerchantGet,
		output: Out.customAttributesMerchantGet,
	},
	'customAttributeDefinitions.merchant.get': {
		input: In.customAttributeDefinitionsMerchantGet,
		output: Out.customAttributeDefinitionsMerchantGet,
	},
	'orders.get': { input: In.ordersGet, output: Out.ordersGet },
	'paymentLinks.get': {
		input: In.paymentLinksGet,
		output: Out.paymentLinksGet,
	},
	'oauth.getTokenStatus': {
		input: In.oauthGetTokenStatus,
		output: Out.oauthGetTokenStatus,
	},
	'webhookSubscriptions.get': {
		input: In.webhookSubscriptionsGet,
		output: Out.webhookSubscriptionsGet,
	},
	'customers.search': {
		input: In.customersSearch,
		output: Out.customersSearch,
	},
	'orders.search': { input: In.ordersSearch, output: Out.ordersSearch },
	'disputes.submitEvidence': {
		input: In.disputesSubmitEvidence,
		output: Out.disputesSubmitEvidence,
	},
	'webhookSubscriptions.test': {
		input: In.webhookSubscriptionsTest,
		output: Out.webhookSubscriptionsTest,
	},
	'customers.update': {
		input: In.customersUpdate,
		output: Out.customersUpdate,
	},
	'customAttributeDefinitions.customer.update': {
		input: In.customAttributeDefinitionsCustomerUpdate,
		output: Out.customAttributeDefinitionsCustomerUpdate,
	},
	'customerGroups.update': {
		input: In.customerGroupsUpdate,
		output: Out.customerGroupsUpdate,
	},
	'locations.update': {
		input: In.locationsUpdate,
		output: Out.locationsUpdate,
	},
	'customAttributeDefinitions.location.update': {
		input: In.customAttributeDefinitionsLocationUpdate,
		output: Out.customAttributeDefinitionsLocationUpdate,
	},
	'customAttributeDefinitions.merchant.update': {
		input: In.customAttributeDefinitionsMerchantUpdate,
		output: Out.customAttributeDefinitionsMerchantUpdate,
	},
	'checkout.updateLocationSettings': {
		input: In.checkoutUpdateLocationSettings,
		output: Out.checkoutUpdateLocationSettings,
	},
	'orders.update': { input: In.ordersUpdate, output: Out.ordersUpdate },
	'webhookSubscriptions.update': {
		input: In.webhookSubscriptionsUpdate,
		output: Out.webhookSubscriptionsUpdate,
	},
	'webhookSubscriptions.updateSignatureKey': {
		input: In.webhookSubscriptionsUpdateSignatureKey,
		output: Out.webhookSubscriptionsUpdateSignatureKey,
	},
	'customAttributes.customer.upsert': {
		input: In.customAttributesCustomerUpsert,
		output: Out.customAttributesCustomerUpsert,
	},
	'customAttributes.location.upsert': {
		input: In.customAttributesLocationUpsert,
		output: Out.customAttributesLocationUpsert,
	},
	'customAttributes.merchant.upsert': {
		input: In.customAttributesMerchantUpsert,
		output: Out.customAttributesMerchantUpsert,
	},
	'payments.create': { input: In.paymentsCreate, output: Out.paymentsCreate },
	'payments.get': { input: In.paymentsGet, output: Out.paymentsGet },
	'payments.update': { input: In.paymentsUpdate, output: Out.paymentsUpdate },
	'payments.complete': {
		input: In.paymentsComplete,
		output: Out.paymentsComplete,
	},
	'payments.refund': { input: In.paymentsRefund, output: Out.paymentsRefund },
	'refunds.get': { input: In.refundsGet, output: Out.refundsGet },
	'refunds.list': { input: In.refundsList, output: Out.refundsList },
	'orders.create': { input: In.ordersCreate, output: Out.ordersCreate },
	'orders.pay': { input: In.ordersPay, output: Out.ordersPay },
	'paymentLinks.create': {
		input: In.paymentLinksCreate,
		output: Out.paymentLinksCreate,
	},
	'paymentLinks.list': {
		input: In.paymentLinksList,
		output: Out.paymentLinksList,
	},
	'paymentLinks.delete': {
		input: In.paymentLinksDelete,
		output: Out.paymentLinksDelete,
	},
	'invoices.create': { input: In.invoicesCreate, output: Out.invoicesCreate },
	'invoices.publish': {
		input: In.invoicesPublish,
		output: Out.invoicesPublish,
	},
	'invoices.update': { input: In.invoicesUpdate, output: Out.invoicesUpdate },
	'invoices.search': { input: In.invoicesSearch, output: Out.invoicesSearch },
	'disputes.list': { input: In.disputesList, output: Out.disputesList },
	'cards.list': { input: In.cardsList, output: Out.cardsList },
	'cards.get': { input: In.cardsGet, output: Out.cardsGet },
	'cards.disable': { input: In.cardsDisable, output: Out.cardsDisable },
	'webhookSubscriptions.create': {
		input: In.webhookSubscriptionsCreate,
		output: Out.webhookSubscriptionsCreate,
	},
	'catalog.list': { input: In.catalogList, output: Out.catalogList },
	'catalog.search': { input: In.catalogSearch, output: Out.catalogSearch },
	'catalog.get': { input: In.catalogGet, output: Out.catalogGet },
	'catalog.upsert': { input: In.catalogUpsert, output: Out.catalogUpsert },
	'catalog.delete': { input: In.catalogDelete, output: Out.catalogDelete },
	'inventory.batchGet': {
		input: In.inventoryBatchGet,
		output: Out.inventoryBatchGet,
	},
	'inventory.get': { input: In.inventoryGet, output: Out.inventoryGet },
	'payments.cancelByIdempotencyKey': {
		input: In.paymentsCancelByIdempotencyKey,
		output: Out.paymentsCancelByIdempotencyKey,
	},
	'paymentLinks.update': {
		input: In.paymentLinksUpdate,
		output: Out.paymentLinksUpdate,
	},
	'customAttributeDefinitions.merchant.create': {
		input: In.customAttributeDefinitionsMerchantCreate,
		output: Out.customAttributeDefinitionsMerchantCreate,
	},
};

const squareWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof squareWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const squareEndpointMeta = {
	'disputes.accept': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Accepts the loss on a dispute. Square returns the disputed amount to the cardholder and updates the dispute state to ACCEPTED. Moves money. Square takes no idempotency_key here; disputes.get shows whether the dispute is already accepted before you repeat the call. Cannot be undone.',
	},
	'customers.addGroup': {
		riskLevel: 'write',
		description: 'Adds a group membership to a customer.',
	},
	'customAttributes.customer.bulkUpsert': {
		riskLevel: 'write',
		description:
			'Creates or updates custom attributes for customer profiles as a bulk operation.',
	},
	'customAttributes.location.bulkUpsert': {
		riskLevel: 'write',
		description:
			"Creates or updates custom attributes for locations as a bulk operation. Use this endpoint to set the value of one or more custom attributes for one or more locations. Beta in Square's API; it may change.",
	},
	'customAttributes.merchant.bulkUpsert': {
		riskLevel: 'write',
		description:
			"Creates or updates custom attributes for a merchant as a bulk operation. Use this endpoint to set the value of one or more custom attributes for a merchant. Beta in Square's API; it may change.",
	},
	'customers.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes multiple customer profiles. Cannot be undone.',
	},
	'channels.bulkGet': {
		riskLevel: 'read',
		description: "BulkRetrieveChannels. Beta in Square's API; it may change.",
	},
	'customers.bulkUpdate': {
		riskLevel: 'write',
		description: 'Updates multiple customer profiles.',
	},
	'orders.calculate': {
		riskLevel: 'read',
		description:
			"Enables applications to preview order pricing without creating an order. A fulfillment's pickup_details, shipment_details or in_store_details is required when its type is PICKUP, SHIPMENT or IN_STORE. A line item modifier's base_price_money is required for ad hoc modifiers. Beta in Square's API; it may change.",
	},
	'invoices.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Cancels an invoice. The seller cannot collect payments for the canceled invoice. Pass the invoice's current version; every committed change, including adding or removing an attachment, increments it. Read it with invoices.get. Cannot be undone.",
	},
	'payments.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancels (voids) a payment. You can use this endpoint to cancel a payment with the APPROVED `status`. Moves money. Square takes no idempotency_key here; payments.get shows whether the payment is already canceled before you repeat the call. Cannot be undone.',
	},
	'customers.bulkCreate': {
		riskLevel: 'write',
		description: 'Creates multiple customer profiles for a business.',
	},
	'cards.create': {
		riskLevel: 'write',
		description:
			'Adds a card on file to an existing merchant. Requires idempotency_key; pass the same key to retry safely.',
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Creates a new customer for a business. Pass the same idempotency_key to retry safely.',
	},
	'customAttributeDefinitions.customer.create': {
		riskLevel: 'write',
		description:
			'Creates a customer-related custom attribute definition for a Square seller account. Use this endpoint to define a custom attribute that can be associated with customer profiles. The definition name is required if visibility is VISIBILITY_READ_ONLY or VISIBILITY_READ_WRITE_VALUES. Pass the same idempotency_key to retry safely.',
	},
	'customerGroups.create': {
		riskLevel: 'write',
		description:
			'Creates a new customer group for a business. Pass the same idempotency_key to retry safely.',
	},
	'disputes.createEvidenceFile': {
		riskLevel: 'write',
		description:
			'Uploads a file to use as evidence in a dispute challenge. The endpoint accepts HTTP multipart/form-data file uploads in HEIC, HEIF, JPEG, PDF, PNG, and TIFF formats.',
	},
	'disputes.createEvidenceText': {
		riskLevel: 'write',
		description:
			'Uploads text to use as evidence for a dispute challenge. Requires idempotency_key; pass the same key to retry safely.',
	},
	'invoices.createAttachment': {
		riskLevel: 'write',
		description:
			'Uploads a file and attaches it to an invoice. This endpoint accepts HTTP multipart/form-data file uploads with a JSON `request` part and a `file` part.',
	},
	'locations.create': {
		riskLevel: 'write',
		description:
			"Creates a location. Creating new locations allows for separate configuration of receipt layouts, item prices, and sales reports. Locations can't be deleted; deactivate with locations.update.",
	},
	'customAttributeDefinitions.location.create': {
		riskLevel: 'write',
		description:
			"Creates a location-related custom attribute definition for a Square seller account. Use this endpoint to define a custom attribute that can be associated with locations. The definition name is required if visibility is VISIBILITY_READ_ONLY or VISIBILITY_READ_WRITE_VALUES. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change.",
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a customer profile from a business. Cannot be undone.',
	},
	'customAttributes.customer.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a custom attribute associated with a customer profile. Cannot be undone.',
	},
	'customAttributeDefinitions.customer.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a customer-related custom attribute definition from a Square seller account. Cannot be undone.',
	},
	'customerGroups.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a customer group as identified by the `group_id` value. Cannot be undone.',
	},
	'disputes.deleteEvidence': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes specified evidence from a dispute. Square does not send the bank any evidence that is removed. Cannot be undone.',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes the specified invoice. When an invoice is deleted, the associated order status changes to CANCELED. If you pass version, it must be the current one; every committed change, including adding or removing an attachment, increments it. Read it with invoices.get. Cannot be undone.',
	},
	'invoices.deleteAttachment': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Removes an attachment from an invoice and permanently deletes the file. Attachments can be removed only from invoices in the `DRAFT`, `SCHEDULED`, `UNPAID`, or `PARTIALLY_PAID` state. Cannot be undone.',
	},
	'customAttributes.location.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a custom attribute associated with a location. To delete a custom attribute owned by another application, the `visibility` setting must be `VISIBILITY_READ_WRITE_VALUES`. Cannot be undone. Beta in Square's API; it may change.",
	},
	'customAttributeDefinitions.location.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a location-related custom attribute definition from a Square seller account. Deleting a custom attribute definition also deletes the corresponding custom attribute from all locations. Cannot be undone. Beta in Square's API; it may change.",
	},
	'customAttributes.location.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes custom attributes for locations as a bulk operation. To delete a custom attribute owned by another application, the `visibility` setting must be `VISIBILITY_READ_WRITE_VALUES`. Cannot be undone. Beta in Square's API; it may change.",
	},
	'customAttributes.merchant.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a custom attribute associated with a merchant. To delete a custom attribute owned by another application, the `visibility` setting must be `VISIBILITY_READ_WRITE_VALUES`. Cannot be undone. Beta in Square's API; it may change.",
	},
	'customAttributeDefinitions.merchant.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a merchant-related custom attribute definition from a Square seller account. Deleting a custom attribute definition also deletes the corresponding custom attribute from the merchant. Cannot be undone. Beta in Square's API; it may change.",
	},
	'customAttributes.merchant.bulkDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes custom attributes for a merchant as a bulk operation. To delete a custom attribute owned by another application, the `visibility` setting must be `VISIBILITY_READ_WRITE_VALUES`. Cannot be undone. Beta in Square's API; it may change.",
	},
	'webhookSubscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a webhook subscription. Cannot be undone.',
	},
	'bookings.getBusinessProfile': {
		riskLevel: 'read',
		description: "Retrieves a seller's booking profile.",
	},
	'merchants.get': {
		riskLevel: 'read',
		description: 'Retrieves the `Merchant` object for the given `merchant_id`.',
	},
	'customAttributes.customer.get': {
		riskLevel: 'read',
		description:
			'Retrieves a custom attribute associated with a customer profile.',
	},
	'customAttributeDefinitions.customer.get': {
		riskLevel: 'read',
		description:
			'Retrieves a customer-related custom attribute definition from a Square seller account.',
	},
	'disputes.getEvidence': {
		riskLevel: 'read',
		description:
			'Returns the metadata for the evidence specified in the request URL path.',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Retrieves an invoice by invoice ID.',
	},
	'checkout.getLocationSettings': {
		riskLevel: 'read',
		description:
			"Retrieves the location-level settings for a Square-hosted checkout page. Beta in Square's API; it may change.",
	},
	'channels.list': {
		riskLevel: 'read',
		description: "ListChannels. Beta in Square's API; it may change.",
	},
	'customAttributeDefinitions.customer.list': {
		riskLevel: 'read',
		description:
			'Lists the customer-related custom attribute definitions that belong to a Square seller account.',
	},
	'customAttributes.customer.list': {
		riskLevel: 'read',
		description:
			'Lists the custom attributes associated with a customer profile.',
	},
	'customerGroups.list': {
		riskLevel: 'read',
		description: 'Retrieves the list of customer groups of a business.',
	},
	'customerSegments.list': {
		riskLevel: 'read',
		description: 'Retrieves the list of customer segments of a business.',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'Lists customer profiles associated with a Square account.',
	},
	'disputes.listEvidence': {
		riskLevel: 'read',
		description: 'Returns a list of evidence associated with a dispute.',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'Returns a list of invoices for a given location. The response is paginated. If truncated, the response includes a `cursor` that you use in a subsequent request to retrieve the next set of invoices.',
	},
	'customAttributeDefinitions.location.list': {
		riskLevel: 'read',
		description:
			"Lists the location-related custom attribute definitions that belong to a Square seller account. Beta in Square's API; it may change.",
	},
	'locations.list': {
		riskLevel: 'read',
		description:
			"Provides details about all of the seller's locations, including those with an inactive status. Locations are listed alphabetically by `name`.",
	},
	'customAttributes.location.list': {
		riskLevel: 'read',
		description:
			"Lists the custom attributes associated with a location. You can use the `with_definitions` query parameter to also retrieve custom attribute definitions in the same call. Beta in Square's API; it may change.",
	},
	'customAttributeDefinitions.merchant.list': {
		riskLevel: 'read',
		description:
			"Lists the merchant-related custom attribute definitions that belong to a Square seller account. Beta in Square's API; it may change.",
	},
	'merchants.list': {
		riskLevel: 'read',
		description:
			'Provides details about the merchant associated with a given access token.',
	},
	'customAttributes.merchant.list': {
		riskLevel: 'read',
		description:
			"Lists the custom attributes associated with a merchant. You can use the `with_definitions` query parameter to also retrieve custom attribute definitions in the same call. Beta in Square's API; it may change.",
	},
	'payments.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of payments taken by the account making the request.',
	},
	'webhookEventTypes.list': {
		riskLevel: 'read',
		description: 'Lists all webhook event types that can be subscribed to.',
	},
	'webhookSubscriptions.list': {
		riskLevel: 'read',
		description: 'Lists all webhook subscriptions owned by your application.',
	},
	'customers.removeGroup': {
		riskLevel: 'write',
		description: 'Removes a group membership from a customer.',
	},
	'customers.bulkGet': {
		riskLevel: 'read',
		description: 'Retrieves multiple customer profiles.',
	},
	'channels.get': {
		riskLevel: 'read',
		description: "RetrieveChannel. Beta in Square's API; it may change.",
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Returns details for a single customer.',
	},
	'customerGroups.get': {
		riskLevel: 'read',
		description:
			'Retrieves a specific customer group as identified by the `group_id` value.',
	},
	'customerSegments.get': {
		riskLevel: 'read',
		description:
			'Retrieves a specific customer segment as identified by the `segment_id` value.',
	},
	'disputes.get': {
		riskLevel: 'read',
		description: 'Returns details about a specific dispute.',
	},
	'locations.get': {
		riskLevel: 'read',
		description:
			'Retrieves details of a single location. Specify "main" as the location ID to retrieve details of the main location.',
	},
	'customAttributes.location.get': {
		riskLevel: 'read',
		description:
			"Retrieves a custom attribute associated with a location. You can use the `with_definition` query parameter to also retrieve the custom attribute definition in the same call. Beta in Square's API; it may change.",
	},
	'customAttributeDefinitions.location.get': {
		riskLevel: 'read',
		description:
			"Retrieves a location-related custom attribute definition from a Square seller account. Beta in Square's API; it may change.",
	},
	'customAttributes.merchant.get': {
		riskLevel: 'read',
		description:
			"Retrieves a custom attribute associated with a merchant. You can use the `with_definition` query parameter to also retrieve the custom attribute definition in the same call. Beta in Square's API; it may change.",
	},
	'customAttributeDefinitions.merchant.get': {
		riskLevel: 'read',
		description:
			"Retrieves a merchant-related custom attribute definition from a Square seller account. Beta in Square's API; it may change.",
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Retrieves an Order by ID.',
	},
	'paymentLinks.get': {
		riskLevel: 'read',
		description: 'Retrieves a payment link.',
	},
	'oauth.getTokenStatus': {
		riskLevel: 'read',
		description:
			'Returns information about an OAuth access token or an application’s personal access token.',
	},
	'webhookSubscriptions.get': {
		riskLevel: 'read',
		description: 'Retrieves a webhook subscription identified by its ID.',
	},
	'customers.search': {
		riskLevel: 'read',
		description:
			'Searches the customer profiles associated with a Square account using one or more supported query filters.',
	},
	'orders.search': {
		riskLevel: 'read',
		description:
			'Search all orders for one or more locations. Orders include all sales, returns, and exchanges regardless of how or when they entered the Square ecosystem (such as Point of Sale, Invoices, and Connect APIs).',
	},
	'disputes.submitEvidence': {
		riskLevel: 'destructive',
		irreversible: true,
		description: "Submits evidence to the cardholder's bank. Cannot be undone.",
	},
	'webhookSubscriptions.test': {
		riskLevel: 'write',
		description:
			'Tests a webhook subscription by sending a test event to the notification URL.',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Updates a customer profile. This endpoint supports sparse updates, so only new or changed fields are required in the request. To add or update a field, specify the new value. To remove a field, specify `null`.',
	},
	'customAttributeDefinitions.customer.update': {
		riskLevel: 'write',
		description:
			'Updates a customer-related custom attribute definition for a Square seller account. Pass the same idempotency_key to retry safely.',
	},
	'customerGroups.update': {
		riskLevel: 'write',
		description:
			'Updates a customer group as identified by the `group_id` value.',
	},
	'locations.update': {
		riskLevel: 'write',
		description: 'Updates a location.',
	},
	'customAttributeDefinitions.location.update': {
		riskLevel: 'write',
		description:
			"Updates a location-related custom attribute definition for a Square seller account. Use this endpoint to update the following fields: `name`, `description`, `visibility`, or the `schema` for a `Selection` data type. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change.",
	},
	'customAttributeDefinitions.merchant.update': {
		riskLevel: 'write',
		description:
			"Updates a merchant-related custom attribute definition for a Square seller account. Use this endpoint to update the following fields: `name`, `description`, `visibility`, or the `schema` for a `Selection` data type. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change.",
	},
	'checkout.updateLocationSettings': {
		riskLevel: 'write',
		description:
			"Updates the location-level settings for a Square-hosted checkout page. A policy's title is required when setting its description. Beta in Square's API; it may change.",
	},
	'orders.update': {
		riskLevel: 'write',
		description:
			"Updates an open order by adding, replacing, or deleting fields. Orders with a `COMPLETED` or `CANCELED` state cannot be updated. A fulfillment's pickup_details, shipment_details or in_store_details is required when its type is PICKUP, SHIPMENT or IN_STORE. A line item modifier's base_price_money is required for ad hoc modifiers. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change.",
	},
	'webhookSubscriptions.update': {
		riskLevel: 'write',
		description: 'Updates a webhook subscription.',
	},
	'webhookSubscriptions.updateSignatureKey': {
		riskLevel: 'write',
		description:
			'Updates a webhook subscription by replacing the existing signature key with a new one. The old signature key stops verifying as soon as the new one is issued. Pass the same idempotency_key to retry safely.',
	},
	'customAttributes.customer.upsert': {
		riskLevel: 'write',
		description:
			'Creates or updates a custom attribute for a customer profile. Pass the same idempotency_key to retry safely.',
	},
	'customAttributes.location.upsert': {
		riskLevel: 'write',
		description:
			"Creates or updates a custom attribute for a location. Use this endpoint to set the value of a custom attribute for a specified location. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change.",
	},
	'customAttributes.merchant.upsert': {
		riskLevel: 'write',
		description:
			"Creates or updates a custom attribute for a merchant. Use this endpoint to set the value of a custom attribute for a specified merchant. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change.",
	},
	'payments.create': {
		riskLevel: 'write',
		description:
			'Creates a payment using the provided source. customer_id is required if source_id is a card on file created with the Cards API. Moves money. Pass the same idempotency_key to retry safely.',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Retrieves details for a specific payment.',
	},
	'payments.update': {
		riskLevel: 'write',
		description:
			'Updates a payment with the APPROVED status. You can update the `amount_money` and `tip_money` using this endpoint. Moves money. Pass the same idempotency_key to retry safely.',
	},
	'payments.complete': {
		riskLevel: 'write',
		description:
			'Completes (captures) a payment. By default, payments are set to complete immediately after they are created. Moves money. Square takes no idempotency_key here; payments.get shows whether the payment is already completed before you repeat the call.',
	},
	'payments.refund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Refunds a payment. You can refund the entire payment amount or a portion of it. You can use this endpoint to refund a card payment or record a refund of a cash or external payment. customer_id is required if destination_id is a card on file created with the Cards API, and is only allowed when unlinked=true. Moves money. Pass the same idempotency_key to retry safely. Cannot be undone.',
	},
	'refunds.get': {
		riskLevel: 'read',
		description: 'Retrieves a specific refund using the `refund_id`.',
	},
	'refunds.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of refunds for the account making the request.',
	},
	'orders.create': {
		riskLevel: 'write',
		description:
			"Creates a new order that can include information about products for purchase and settings to apply to the purchase. A fulfillment's pickup_details, shipment_details or in_store_details is required when its type is PICKUP, SHIPMENT or IN_STORE. A line item modifier's base_price_money is required for ad hoc modifiers. Pass the same idempotency_key to retry safely.",
	},
	'orders.pay': {
		riskLevel: 'write',
		description:
			"Pay for an order using one or more approved payments or settle an order with a total of `0`. Approved payments for the same order_id that are not listed in payment_ids are canceled. Moves money. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change.",
	},
	'paymentLinks.create': {
		riskLevel: 'write',
		description:
			"Creates a Square-hosted checkout page. Applications can share the resulting payment link with their buyer to pay for goods and services. A fulfillment's pickup_details, shipment_details or in_store_details is required when its type is PICKUP, SHIPMENT or IN_STORE. A line item modifier's base_price_money is required for ad hoc modifiers. Pass the same idempotency_key to retry safely.",
	},
	'paymentLinks.list': {
		riskLevel: 'read',
		description: 'Lists all payment links.',
	},
	'paymentLinks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes a payment link. Cannot be undone.',
	},
	'invoices.create': {
		riskLevel: 'write',
		description:
			'Creates a draft invoice for an order created using the Orders API. Give delivery_method (recommended) or the deprecated request_method on each payment request; the schema does not require delivery_method for that reason. Pass the same idempotency_key to retry safely.',
	},
	'invoices.publish': {
		riskLevel: 'write',
		description:
			"Publishes the specified draft invoice. Sends the invoice to the customer and may charge the card on file; cancel with invoices.cancel. Pass the invoice's current version; every committed change, including adding or removing an attachment, increments it. Read it with invoices.get. Moves money. Pass the same idempotency_key to retry safely.",
	},
	'invoices.update': {
		riskLevel: 'write',
		description:
			"Updates an invoice. This endpoint supports sparse updates, so you only need to specify the fields you want to change along with the required `version` field. Some restrictions apply to updating invoices. Pass the invoice's current version; every committed change, including adding or removing an attachment, increments it. Read it with invoices.get. Pass the same idempotency_key to retry safely.",
	},
	'invoices.search': {
		riskLevel: 'read',
		description:
			'Searches for invoices from a location specified in the filter. You can optionally specify customers in the filter for whom to retrieve invoices.',
	},
	'disputes.list': {
		riskLevel: 'read',
		description:
			'Returns a list of disputes associated with a particular account.',
	},
	'cards.list': {
		riskLevel: 'read',
		description:
			'Retrieves a list of cards owned by the account making the request. A max of 25 cards will be returned.',
	},
	'cards.get': {
		riskLevel: 'read',
		description: 'Retrieves details for a specific Card.',
	},
	'cards.disable': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Disables the card, preventing any further updates or charges. Disabling an already disabled card is allowed but has no effect. Cannot be undone.',
	},
	'webhookSubscriptions.create': {
		riskLevel: 'write',
		description:
			'Creates a webhook subscription. Pass the same idempotency_key to retry safely.',
	},
	'catalog.list': {
		riskLevel: 'read',
		description:
			'Returns a list of all CatalogObjects of the specified types in the catalog.',
	},
	'catalog.search': {
		riskLevel: 'read',
		description:
			'Searches for CatalogObject of any type by matching supported search attribute values, excluding custom attribute values on items or item variations, against one or more of the specified query filters.',
	},
	'catalog.get': {
		riskLevel: 'read',
		description:
			'Returns a single CatalogItem as a CatalogObject based on the provided ID.',
	},
	'catalog.upsert': {
		riskLevel: 'write',
		description:
			'Creates a new or updates the specified CatalogObject. Replaces the whole object: any field left out of the request is cleared, nested variations included. Requires idempotency_key; pass the same key to retry safely.',
	},
	'catalog.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Deletes a single CatalogObject based on the provided ID and returns the set of successfully deleted IDs in the response. Deletion is a cascading event such that all children of the targeted object are also deleted. Cannot be undone.',
	},
	'inventory.batchGet': {
		riskLevel: 'read',
		description:
			'Returns current counts for the provided CatalogObjects at the requested Locations.',
	},
	'inventory.get': {
		riskLevel: 'read',
		description:
			'Retrieves the current calculated stock count for a given CatalogObject at a given set of Locations. Responses are paginated and unsorted. For more sophisticated queries, use a batch endpoint.',
	},
	'payments.cancelByIdempotencyKey': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Voids a payment by the idempotency_key of the payments.create call that made it; use when that call's response was lost. Moves money. Its idempotency_key names the payment to cancel; it does not make this call repeatable. Cannot be undone.",
	},
	'paymentLinks.update': {
		riskLevel: 'write',
		description:
			'Updates a payment link. You can update the `payment_link` fields such as `description`, `checkout_options`, and `pre_populated_data`.',
	},
	'customAttributeDefinitions.merchant.create': {
		riskLevel: 'write',
		description:
			"Creates a merchant-related custom attribute definition for a Square seller account. Use this endpoint to define a custom attribute that can be associated with a merchant connecting to your application. The definition name is required if visibility is VISIBILITY_READ_ONLY or VISIBILITY_READ_WRITE_VALUES. Pass the same idempotency_key to retry safely. Beta in Square's API; it may change.",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof squareEndpointsNested>;

export const squareAuthConfig = {
	api_key: {
		account: [] as const,
	},
	oauth_2: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSquarePlugin<T extends SquarePluginOptions> = CorsairPlugin<
	'square',
	typeof SquareSchema,
	typeof squareEndpointsNested,
	typeof squareWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSquarePlugin = BaseSquarePlugin<SquarePluginOptions>;

export type ExternalSquarePlugin<T extends SquarePluginOptions> =
	BaseSquarePlugin<T>;

/**
 * Built-in handlers first, then the caller's, then DEFAULT last: core takes the
 * first handler that matches and DEFAULT matches everything. A caller may
 * replace DEFAULT itself.
 */
function mergeErrorHandlers(
	custom: CorsairErrorHandler | undefined,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtIn } = errorHandlers;
	const { DEFAULT: customDefault, ...customSpecific } = custom ?? {};
	return {
		...builtIn,
		...customSpecific,
		DEFAULT: customDefault ?? builtInDefault,
	};
}

/** The Square plugin: pass the options (key, environment, hooks, error handlers) to `createCorsair`. */
export function square<const T extends SquarePluginOptions>(
	incomingOptions: SquarePluginOptions & T = {} as SquarePluginOptions & T,
): ExternalSquarePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'square',
		authConfig: squareAuthConfig,
		schema: SquareSchema,
		options: options,
		oauthConfig: {
			providerName: 'Square',
			authUrl: 'https://connect.squareup.com/oauth2/authorize',
			tokenUrl: 'https://connect.squareup.com/oauth2/token',
			// The scopes Square's spec lists for the operations in this plugin.
			scopes: [
				'APPOINTMENTS_BUSINESS_SETTINGS_READ',
				'CHANNELS_READ',
				'CUSTOMERS_READ',
				'CUSTOMERS_WRITE',
				'DISPUTES_READ',
				'DISPUTES_WRITE',
				'INVENTORY_READ',
				'INVOICES_READ',
				'INVOICES_WRITE',
				'ITEMS_READ',
				'ITEMS_WRITE',
				'MERCHANT_PROFILE_READ',
				'MERCHANT_PROFILE_WRITE',
				'ORDERS_READ',
				'ORDERS_WRITE',
				'PAYMENTS_READ',
				'PAYMENTS_WRITE',
			],
			requiresRegisteredRedirect: true,
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: squareEndpointsNested,
		webhooks: squareWebhooksNested,
		endpointMeta: squareEndpointMeta,
		endpointSchemas: squareEndpointSchemas,
		webhookSchemas: squareWebhookSchemas,
		// This plugin declares no webhooks yet.
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: SquareKeyBuilderContext, source) => {
			// No webhooks are declared yet, so there is no signature key to build.
			if (source !== 'endpoint') return '';

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					throw new AuthMissingError('square', 'api_key');
				}

				return res;
			}

			if (ctx.authType === 'oauth_2') {
				// Refreshes an expired token and sets ctx._refreshAuth, which
				// client.ts calls once after a 401. Square's ObtainToken takes the
				// client id and secret in a JSON body, on the same host as the API.
				return getOAuthAccessToken(ctx, {
					plugin: 'square',
					tokenUrl: `${SQUARE_BASE_URLS[options.environment ?? 'production']}/oauth2/token`,
					tokenAuthMethod: 'body',
					bodyFormat: 'json',
				});
			}

			throw new AuthMissingError('square', 'oauth_2');
		},
	} satisfies InternalSquarePlugin;
}

export type { SquareEnvironment } from './client';
export { SQUARE_API_VERSION, SquareAPIError } from './client';
export type {
	SquareEndpointInputs,
	SquareEndpointOutputs,
	SquareOperation,
} from './endpoints/types';
export {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './endpoints/types';
