import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Billing, Catalog, Subscriptions } from './endpoints';
import type {
	LemonSqueezyEndpointInputs,
	LemonSqueezyEndpointOutputs,
} from './endpoints/types';
import {
	LemonSqueezyEndpointInputSchemas,
	LemonSqueezyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LemonSqueezySchema } from './schema';

export type LemonSqueezyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLemonSqueezyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lemonSqueezyEndpointsNested>;
};

export type LemonSqueezyContext = CorsairPluginContext<
	typeof LemonSqueezySchema,
	LemonSqueezyPluginOptions
>;

export type LemonSqueezyKeyBuilderContext =
	KeyBuilderContext<LemonSqueezyPluginOptions>;

export type LemonSqueezyBoundEndpoints = BindEndpoints<
	typeof lemonSqueezyEndpointsNested
>;

type LemonSqueezyEndpoint<K extends keyof LemonSqueezyEndpointOutputs> =
	CorsairEndpoint<
		LemonSqueezyContext,
		LemonSqueezyEndpointInputs[K],
		LemonSqueezyEndpointOutputs[K]
	>;

export type LemonSqueezyEndpoints = {
	usersGet: LemonSqueezyEndpoint<'usersGet'>;
	storesList: LemonSqueezyEndpoint<'storesList'>;
	storesGet: LemonSqueezyEndpoint<'storesGet'>;
	productsList: LemonSqueezyEndpoint<'productsList'>;
	productsGet: LemonSqueezyEndpoint<'productsGet'>;
	variantsList: LemonSqueezyEndpoint<'variantsList'>;
	variantsGet: LemonSqueezyEndpoint<'variantsGet'>;
	pricesList: LemonSqueezyEndpoint<'pricesList'>;
	pricesGet: LemonSqueezyEndpoint<'pricesGet'>;
	filesList: LemonSqueezyEndpoint<'filesList'>;
	filesGet: LemonSqueezyEndpoint<'filesGet'>;
	ordersList: LemonSqueezyEndpoint<'ordersList'>;
	ordersGet: LemonSqueezyEndpoint<'ordersGet'>;
	ordersGenerateInvoice: LemonSqueezyEndpoint<'ordersGenerateInvoice'>;
	ordersRefund: LemonSqueezyEndpoint<'ordersRefund'>;
	orderItemsList: LemonSqueezyEndpoint<'orderItemsList'>;
	orderItemsGet: LemonSqueezyEndpoint<'orderItemsGet'>;
	subscriptionsList: LemonSqueezyEndpoint<'subscriptionsList'>;
	subscriptionsGet: LemonSqueezyEndpoint<'subscriptionsGet'>;
	subscriptionsUpdate: LemonSqueezyEndpoint<'subscriptionsUpdate'>;
	subscriptionsCancel: LemonSqueezyEndpoint<'subscriptionsCancel'>;
	subscriptionItemsList: LemonSqueezyEndpoint<'subscriptionItemsList'>;
	subscriptionItemsGet: LemonSqueezyEndpoint<'subscriptionItemsGet'>;
	subscriptionItemsUsage: LemonSqueezyEndpoint<'subscriptionItemsUsage'>;
	subscriptionItemsUpdate: LemonSqueezyEndpoint<'subscriptionItemsUpdate'>;
	subscriptionInvoicesList: LemonSqueezyEndpoint<'subscriptionInvoicesList'>;
	subscriptionInvoicesGet: LemonSqueezyEndpoint<'subscriptionInvoicesGet'>;
	subscriptionInvoicesGenerate: LemonSqueezyEndpoint<'subscriptionInvoicesGenerate'>;
	subscriptionInvoicesRefund: LemonSqueezyEndpoint<'subscriptionInvoicesRefund'>;
	usageRecordsList: LemonSqueezyEndpoint<'usageRecordsList'>;
	usageRecordsGet: LemonSqueezyEndpoint<'usageRecordsGet'>;
	usageRecordsCreate: LemonSqueezyEndpoint<'usageRecordsCreate'>;
	customersList: LemonSqueezyEndpoint<'customersList'>;
	customersGet: LemonSqueezyEndpoint<'customersGet'>;
	customersCreate: LemonSqueezyEndpoint<'customersCreate'>;
	customersUpdate: LemonSqueezyEndpoint<'customersUpdate'>;
	discountsList: LemonSqueezyEndpoint<'discountsList'>;
	discountsGet: LemonSqueezyEndpoint<'discountsGet'>;
	discountsCreate: LemonSqueezyEndpoint<'discountsCreate'>;
	discountsDelete: LemonSqueezyEndpoint<'discountsDelete'>;
	discountRedemptionsList: LemonSqueezyEndpoint<'discountRedemptionsList'>;
	discountRedemptionsGet: LemonSqueezyEndpoint<'discountRedemptionsGet'>;
	licenseKeysList: LemonSqueezyEndpoint<'licenseKeysList'>;
	licenseKeysGet: LemonSqueezyEndpoint<'licenseKeysGet'>;
	licenseKeysUpdate: LemonSqueezyEndpoint<'licenseKeysUpdate'>;
	licenseKeyInstancesList: LemonSqueezyEndpoint<'licenseKeyInstancesList'>;
	licenseKeyInstancesGet: LemonSqueezyEndpoint<'licenseKeyInstancesGet'>;
	checkoutsList: LemonSqueezyEndpoint<'checkoutsList'>;
	checkoutsGet: LemonSqueezyEndpoint<'checkoutsGet'>;
	checkoutsCreate: LemonSqueezyEndpoint<'checkoutsCreate'>;
	webhooksList: LemonSqueezyEndpoint<'webhooksList'>;
	webhooksGet: LemonSqueezyEndpoint<'webhooksGet'>;
	webhooksCreate: LemonSqueezyEndpoint<'webhooksCreate'>;
	webhooksUpdate: LemonSqueezyEndpoint<'webhooksUpdate'>;
	webhooksDelete: LemonSqueezyEndpoint<'webhooksDelete'>;
	affiliatesList: LemonSqueezyEndpoint<'affiliatesList'>;
	affiliatesGet: LemonSqueezyEndpoint<'affiliatesGet'>;
};

const lemonSqueezyEndpointsNested = {
	users: {
		get: Catalog.usersGet,
	},
	stores: {
		list: Catalog.storesList,
		get: Catalog.storesGet,
	},
	products: {
		list: Catalog.productsList,
		get: Catalog.productsGet,
	},
	variants: {
		list: Catalog.variantsList,
		get: Catalog.variantsGet,
	},
	prices: {
		list: Catalog.pricesList,
		get: Catalog.pricesGet,
	},
	files: {
		list: Catalog.filesList,
		get: Catalog.filesGet,
	},
	orders: {
		list: Catalog.ordersList,
		get: Catalog.ordersGet,
		generateInvoice: Catalog.ordersGenerateInvoice,
		refund: Catalog.ordersRefund,
	},
	orderItems: {
		list: Catalog.orderItemsList,
		get: Catalog.orderItemsGet,
	},
	subscriptions: {
		list: Subscriptions.subscriptionsList,
		get: Subscriptions.subscriptionsGet,
		update: Subscriptions.subscriptionsUpdate,
		cancel: Subscriptions.subscriptionsCancel,
	},
	subscriptionItems: {
		list: Subscriptions.subscriptionItemsList,
		get: Subscriptions.subscriptionItemsGet,
		usage: Subscriptions.subscriptionItemsUsage,
		update: Subscriptions.subscriptionItemsUpdate,
	},
	subscriptionInvoices: {
		list: Subscriptions.subscriptionInvoicesList,
		get: Subscriptions.subscriptionInvoicesGet,
		generate: Subscriptions.subscriptionInvoicesGenerate,
		refund: Subscriptions.subscriptionInvoicesRefund,
	},
	usageRecords: {
		list: Subscriptions.usageRecordsList,
		get: Subscriptions.usageRecordsGet,
		create: Subscriptions.usageRecordsCreate,
	},
	customers: {
		list: Billing.customersList,
		get: Billing.customersGet,
		create: Billing.customersCreate,
		update: Billing.customersUpdate,
	},
	discounts: {
		list: Billing.discountsList,
		get: Billing.discountsGet,
		create: Billing.discountsCreate,
		delete: Billing.discountsDelete,
	},
	discountRedemptions: {
		list: Billing.discountRedemptionsList,
		get: Billing.discountRedemptionsGet,
	},
	licenseKeys: {
		list: Billing.licenseKeysList,
		get: Billing.licenseKeysGet,
		update: Billing.licenseKeysUpdate,
	},
	licenseKeyInstances: {
		list: Billing.licenseKeyInstancesList,
		get: Billing.licenseKeyInstancesGet,
	},
	checkouts: {
		list: Billing.checkoutsList,
		get: Billing.checkoutsGet,
		create: Billing.checkoutsCreate,
	},
	webhooks: {
		list: Billing.webhooksList,
		get: Billing.webhooksGet,
		create: Billing.webhooksCreate,
		update: Billing.webhooksUpdate,
		delete: Billing.webhooksDelete,
	},
	affiliates: {
		list: Catalog.affiliatesList,
		get: Catalog.affiliatesGet,
	},
} as const;

const operationPaths = {
	'users.get': { input: 'usersGet', output: 'usersGet' },
	'stores.list': { input: 'storesList', output: 'storesList' },
	'stores.get': { input: 'storesGet', output: 'storesGet' },
	'products.list': { input: 'productsList', output: 'productsList' },
	'products.get': { input: 'productsGet', output: 'productsGet' },
	'variants.list': { input: 'variantsList', output: 'variantsList' },
	'variants.get': { input: 'variantsGet', output: 'variantsGet' },
	'prices.list': { input: 'pricesList', output: 'pricesList' },
	'prices.get': { input: 'pricesGet', output: 'pricesGet' },
	'files.list': { input: 'filesList', output: 'filesList' },
	'files.get': { input: 'filesGet', output: 'filesGet' },
	'orders.list': { input: 'ordersList', output: 'ordersList' },
	'orders.get': { input: 'ordersGet', output: 'ordersGet' },
	'orders.generateInvoice': {
		input: 'ordersGenerateInvoice',
		output: 'ordersGenerateInvoice',
	},
	'orders.refund': { input: 'ordersRefund', output: 'ordersRefund' },
	'orderItems.list': { input: 'orderItemsList', output: 'orderItemsList' },
	'orderItems.get': { input: 'orderItemsGet', output: 'orderItemsGet' },
	'subscriptions.list': {
		input: 'subscriptionsList',
		output: 'subscriptionsList',
	},
	'subscriptions.get': {
		input: 'subscriptionsGet',
		output: 'subscriptionsGet',
	},
	'subscriptions.update': {
		input: 'subscriptionsUpdate',
		output: 'subscriptionsUpdate',
	},
	'subscriptions.cancel': {
		input: 'subscriptionsCancel',
		output: 'subscriptionsCancel',
	},
	'subscriptionItems.list': {
		input: 'subscriptionItemsList',
		output: 'subscriptionItemsList',
	},
	'subscriptionItems.get': {
		input: 'subscriptionItemsGet',
		output: 'subscriptionItemsGet',
	},
	'subscriptionItems.usage': {
		input: 'subscriptionItemsUsage',
		output: 'subscriptionItemsUsage',
	},
	'subscriptionItems.update': {
		input: 'subscriptionItemsUpdate',
		output: 'subscriptionItemsUpdate',
	},
	'subscriptionInvoices.list': {
		input: 'subscriptionInvoicesList',
		output: 'subscriptionInvoicesList',
	},
	'subscriptionInvoices.get': {
		input: 'subscriptionInvoicesGet',
		output: 'subscriptionInvoicesGet',
	},
	'subscriptionInvoices.generate': {
		input: 'subscriptionInvoicesGenerate',
		output: 'subscriptionInvoicesGenerate',
	},
	'subscriptionInvoices.refund': {
		input: 'subscriptionInvoicesRefund',
		output: 'subscriptionInvoicesRefund',
	},
	'usageRecords.list': {
		input: 'usageRecordsList',
		output: 'usageRecordsList',
	},
	'usageRecords.get': { input: 'usageRecordsGet', output: 'usageRecordsGet' },
	'usageRecords.create': {
		input: 'usageRecordsCreate',
		output: 'usageRecordsCreate',
	},
	'customers.list': { input: 'customersList', output: 'customersList' },
	'customers.get': { input: 'customersGet', output: 'customersGet' },
	'customers.create': { input: 'customersCreate', output: 'customersCreate' },
	'customers.update': { input: 'customersUpdate', output: 'customersUpdate' },
	'discounts.list': { input: 'discountsList', output: 'discountsList' },
	'discounts.get': { input: 'discountsGet', output: 'discountsGet' },
	'discounts.create': { input: 'discountsCreate', output: 'discountsCreate' },
	'discounts.delete': { input: 'discountsDelete', output: 'discountsDelete' },
	'discountRedemptions.list': {
		input: 'discountRedemptionsList',
		output: 'discountRedemptionsList',
	},
	'discountRedemptions.get': {
		input: 'discountRedemptionsGet',
		output: 'discountRedemptionsGet',
	},
	'licenseKeys.list': { input: 'licenseKeysList', output: 'licenseKeysList' },
	'licenseKeys.get': { input: 'licenseKeysGet', output: 'licenseKeysGet' },
	'licenseKeys.update': {
		input: 'licenseKeysUpdate',
		output: 'licenseKeysUpdate',
	},
	'licenseKeyInstances.list': {
		input: 'licenseKeyInstancesList',
		output: 'licenseKeyInstancesList',
	},
	'licenseKeyInstances.get': {
		input: 'licenseKeyInstancesGet',
		output: 'licenseKeyInstancesGet',
	},
	'checkouts.list': { input: 'checkoutsList', output: 'checkoutsList' },
	'checkouts.get': { input: 'checkoutsGet', output: 'checkoutsGet' },
	'checkouts.create': { input: 'checkoutsCreate', output: 'checkoutsCreate' },
	'webhooks.list': { input: 'webhooksList', output: 'webhooksList' },
	'webhooks.get': { input: 'webhooksGet', output: 'webhooksGet' },
	'webhooks.create': { input: 'webhooksCreate', output: 'webhooksCreate' },
	'webhooks.update': { input: 'webhooksUpdate', output: 'webhooksUpdate' },
	'webhooks.delete': { input: 'webhooksDelete', output: 'webhooksDelete' },
	'affiliates.list': { input: 'affiliatesList', output: 'affiliatesList' },
	'affiliates.get': { input: 'affiliatesGet', output: 'affiliatesGet' },
} as const satisfies Record<
	string,
	{
		input: keyof typeof LemonSqueezyEndpointInputSchemas;
		output: keyof typeof LemonSqueezyEndpointOutputSchemas;
	}
>;

export const lemonSqueezyEndpointSchemas = Object.fromEntries(
	Object.entries(operationPaths).map(([op, keys]) => [
		op,
		{
			input: LemonSqueezyEndpointInputSchemas[keys.input],
			output: LemonSqueezyEndpointOutputSchemas[keys.output],
		},
	]),
) as {
	[K in keyof typeof operationPaths]: {
		input: (typeof LemonSqueezyEndpointInputSchemas)[(typeof operationPaths)[K]['input']];
		output: (typeof LemonSqueezyEndpointOutputSchemas)[(typeof operationPaths)[K]['output']];
	};
} satisfies RequiredPluginEndpointSchemas<typeof lemonSqueezyEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const lemonSqueezyEndpointMeta = {
	'users.get': {
		riskLevel: 'read',
		description: 'Read the account that owns the API key',
	},
	'stores.list': {
		riskLevel: 'read',
		description:
			'List the stores the key can reach, with their plan and sales totals',
	},
	'stores.get': {
		riskLevel: 'read',
		description: 'Read one store, with its plan, currency and sales totals',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'List products, optionally for one store',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Read one product, with its price range and buy-now URL',
	},
	'variants.list': {
		riskLevel: 'read',
		description: 'List variants, optionally for one product or status',
	},
	'variants.get': {
		riskLevel: 'read',
		description:
			'Read one variant, with its license settings and checkout links',
	},
	'prices.list': {
		riskLevel: 'read',
		description: 'List prices, optionally for one variant',
	},
	'prices.get': {
		riskLevel: 'read',
		description: 'Read one price, with its scheme, tiers and renewal interval',
	},
	'files.list': {
		riskLevel: 'read',
		description: 'List downloadable files, optionally for one variant',
	},
	'files.get': {
		riskLevel: 'read',
		description: 'Read one file and its download URL',
	},
	'orders.list': {
		riskLevel: 'read',
		description: 'List orders, filtered by store, email or order number',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Read one order, with its totals, tax and refund state',
	},
	'orders.generateInvoice': {
		riskLevel: 'write',
		description:
			'Generate the PDF invoice for an order and return its URL. No money moves',
	},
	'orders.refund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Refund an order in full, or partially by amount in cents. A refund cannot be undone through the API',
	},
	'orderItems.list': {
		riskLevel: 'read',
		description: 'List order line items, filtered by order, product or variant',
	},
	'orderItems.get': {
		riskLevel: 'read',
		description: 'Read one order line item, with its price and quantity',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description:
			'List subscriptions, filtered by store, order, product, variant, email or status',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description:
			'Read one subscription, with its status, renewal date and pause state',
	},
	'subscriptions.update': {
		riskLevel: 'write',
		description:
			'Move a subscription to another variant, pause or resume it, or change its billing date. A plan change prorates the next charge',
	},
	'subscriptions.cancel': {
		riskLevel: 'destructive',
		description:
			'Cancel an active subscription. It stays readable but stops renewing',
	},
	'subscriptionItems.list': {
		riskLevel: 'read',
		description:
			"List a subscription's items, filtered by subscription or price",
	},
	'subscriptionItems.get': {
		riskLevel: 'read',
		description:
			'Read one subscription item, with its price, quantity and usage flag',
	},
	'subscriptionItems.usage': {
		riskLevel: 'read',
		description:
			"Read a usage-based item's metered usage for the current period",
	},
	'subscriptionItems.update': {
		riskLevel: 'write',
		description: "Change a subscription item's quantity",
	},
	'subscriptionInvoices.list': {
		riskLevel: 'read',
		description:
			'List subscription invoices, filtered by store, status, refund state or subscription',
	},
	'subscriptionInvoices.get': {
		riskLevel: 'read',
		description:
			'Read one subscription invoice, with its totals and refund state',
	},
	'subscriptionInvoices.generate': {
		riskLevel: 'write',
		description:
			'Generate the PDF invoice for a subscription invoice and return its URL. No money moves',
	},
	'subscriptionInvoices.refund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Refund a subscription invoice in full, or partially by amount in cents. A refund cannot be undone through the API',
	},
	'usageRecords.list': {
		riskLevel: 'read',
		description:
			'List metered usage records, optionally for one subscription item',
	},
	'usageRecords.get': {
		riskLevel: 'read',
		description: 'Read one usage record, with its quantity and action',
	},
	'usageRecords.create': {
		riskLevel: 'write',
		description:
			'Record metered usage against a subscription item: add to the period total, or replace it',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List customers, filtered by store or email',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Read one customer, with their status, country and revenue',
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create a customer record. This does not send an invitation to the customer',
	},
	'customers.update': {
		riskLevel: 'write',
		description: "Change a customer's name or email address",
	},
	'discounts.list': {
		riskLevel: 'read',
		description: 'List discount codes, optionally for one store',
	},
	'discounts.get': {
		riskLevel: 'read',
		description: 'Read one discount code, with its amount, duration and status',
	},
	'discounts.create': {
		riskLevel: 'write',
		description:
			'Create a discount code, either a percentage or a fixed amount in cents, lasting once, a number of months or forever',
	},
	'discounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a discount code. A deleted code cannot be restored',
	},
	'discountRedemptions.list': {
		riskLevel: 'read',
		description: 'List discount redemptions, filtered by discount or order',
	},
	'discountRedemptions.get': {
		riskLevel: 'read',
		description: 'Read one discount redemption, with the amount it took off',
	},
	'licenseKeys.list': {
		riskLevel: 'read',
		description:
			'List license keys, filtered by store, order, product or status',
	},
	'licenseKeys.get': {
		riskLevel: 'read',
		description: 'Read one license key, including the full key string',
	},
	'licenseKeys.update': {
		riskLevel: 'write',
		description:
			"Change a license key's activation limit, expiry or disabled state",
	},
	'licenseKeyInstances.list': {
		riskLevel: 'read',
		description: 'List the instances a license key has been activated on',
	},
	'licenseKeyInstances.get': {
		riskLevel: 'read',
		description: 'Read one license key instance, with its identifier and name',
	},
	'checkouts.list': {
		riskLevel: 'read',
		description: 'List checkouts, filtered by store or variant',
	},
	'checkouts.get': {
		riskLevel: 'read',
		description: 'Read one checkout, with its options and prefilled data',
	},
	'checkouts.create': {
		riskLevel: 'write',
		description:
			'Create a checkout link for a variant and return its URL, with optional prefilled data, custom pricing and appearance',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhooks, optionally for one store',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description:
			'Read one webhook, with its URL, events and last delivery time',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a webhook URL with its signing secret and the events to send',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: "Change a webhook's URL, event list or signing secret",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook. Deliveries to it stop immediately',
	},
	'affiliates.list': {
		riskLevel: 'read',
		description: 'List affiliates, filtered by store or email',
	},
	'affiliates.get': {
		riskLevel: 'read',
		description: 'Read one affiliate, with their status and earnings',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof lemonSqueezyEndpointsNested
>;

export type BaseLemonSqueezyPlugin<T extends LemonSqueezyPluginOptions> =
	CorsairPlugin<
		'lemonsqueezy',
		typeof LemonSqueezySchema,
		typeof lemonSqueezyEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalLemonSqueezyPlugin =
	BaseLemonSqueezyPlugin<LemonSqueezyPluginOptions>;

export type ExternalLemonSqueezyPlugin<T extends LemonSqueezyPluginOptions> =
	BaseLemonSqueezyPlugin<T>;

export function lemonsqueezy<const T extends LemonSqueezyPluginOptions>(
	incomingOptions: LemonSqueezyPluginOptions &
		T = {} as LemonSqueezyPluginOptions & T,
): ExternalLemonSqueezyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lemonsqueezy',
		schema: LemonSqueezySchema,
		options: options,
		hooks: options.hooks,
		endpoints: lemonSqueezyEndpointsNested,
		// Lemon Squeezy posts webhook events, but a webhook is registered per
		// store through this plugin's own `webhooks.create`, and deliveries are
		// verified with the secret given there rather than a plugin-wide one.
		webhooks: {},
		endpointMeta: lemonSqueezyEndpointMeta,
		endpointSchemas: lemonSqueezyEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LemonSqueezyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('lemonsqueezy', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLemonSqueezyPlugin;
}

export { LemonSqueezyAPIError } from './client';

export type {
	AffiliateSchema as LemonSqueezyAffiliateResource,
	CreateCheckoutInput,
	CreateCustomerInput,
	CreateDiscountInput,
	CreateUsageRecordInput,
	LemonSqueezyAffiliate,
	LemonSqueezyCheckout,
	LemonSqueezyCustomer,
	LemonSqueezyDiscount,
	LemonSqueezyDiscountRedemption,
	LemonSqueezyEndpointInputs,
	LemonSqueezyEndpointOutputs,
	LemonSqueezyErrorSchema,
	LemonSqueezyFile,
	LemonSqueezyLicenseKey,
	LemonSqueezyLicenseKeyInstance,
	LemonSqueezyOrder,
	LemonSqueezyOrderItem,
	LemonSqueezyPageMeta,
	LemonSqueezyPrice,
	LemonSqueezyProduct,
	LemonSqueezyStore,
	LemonSqueezySubscription,
	LemonSqueezySubscriptionInvoice,
	LemonSqueezySubscriptionItem,
	LemonSqueezySubscriptionItemUsage,
	LemonSqueezyUsageRecord,
	LemonSqueezyUser,
	LemonSqueezyVariant,
	LemonSqueezyWebhook,
	UpdateCustomerInput,
	UpdateLicenseKeyInput,
	UpdateSubscriptionInput,
	UpdateSubscriptionItemInput,
	UpdateWebhookInput,
} from './endpoints/types';
