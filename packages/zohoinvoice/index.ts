import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import { getOAuthAccessToken } from 'corsair/core';
import type { ZohoInvoiceRegion } from './client';
import { zohoInvoiceOAuthAuthUrl, zohoInvoiceOAuthTokenUrl } from './client';
import { Customers, Estimates, Invoices, Items, Payments } from './endpoints';
import type {
	ZohoInvoiceEndpointInputs,
	ZohoInvoiceEndpointOutputs,
} from './endpoints/types';
import {
	ZohoInvoiceEndpointInputSchemas,
	ZohoInvoiceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ZohoInvoiceSchema } from './schema';
import { resolveZohoInvoiceOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchZohoInvoiceTenantWebhook } from './webhooks/tenant-matcher';

export type ZohoInvoicePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	region?: ZohoInvoiceRegion;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalZohoInvoicePlugin['hooks'];
	webhookHooks?: InternalZohoInvoicePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zohoInvoiceEndpointsNested>;
};

export type ZohoInvoiceContext = CorsairPluginContext<
	typeof ZohoInvoiceSchema,
	ZohoInvoicePluginOptions
>;

export type ZohoInvoiceKeyBuilderContext =
	KeyBuilderContext<ZohoInvoicePluginOptions>;

export type ZohoInvoiceBoundEndpoints = BindEndpoints<
	typeof zohoInvoiceEndpointsNested
>;

type ZohoInvoiceEndpoint<K extends keyof ZohoInvoiceEndpointOutputs> =
	CorsairEndpoint<
		ZohoInvoiceContext,
		ZohoInvoiceEndpointInputs[K],
		ZohoInvoiceEndpointOutputs[K]
	>;

export type ZohoInvoiceEndpoints = {
	customersList: ZohoInvoiceEndpoint<'customersList'>;
	customersGet: ZohoInvoiceEndpoint<'customersGet'>;
	customersCreate: ZohoInvoiceEndpoint<'customersCreate'>;
	customersUpdate: ZohoInvoiceEndpoint<'customersUpdate'>;
	invoicesList: ZohoInvoiceEndpoint<'invoicesList'>;
	invoicesGet: ZohoInvoiceEndpoint<'invoicesGet'>;
	invoicesCreate: ZohoInvoiceEndpoint<'invoicesCreate'>;
	invoicesUpdate: ZohoInvoiceEndpoint<'invoicesUpdate'>;
	invoicesDelete: ZohoInvoiceEndpoint<'invoicesDelete'>;
	itemsList: ZohoInvoiceEndpoint<'itemsList'>;
	itemsGet: ZohoInvoiceEndpoint<'itemsGet'>;
	itemsCreate: ZohoInvoiceEndpoint<'itemsCreate'>;
	itemsUpdate: ZohoInvoiceEndpoint<'itemsUpdate'>;
	paymentsList: ZohoInvoiceEndpoint<'paymentsList'>;
	paymentsGet: ZohoInvoiceEndpoint<'paymentsGet'>;
	estimatesList: ZohoInvoiceEndpoint<'estimatesList'>;
	estimatesGet: ZohoInvoiceEndpoint<'estimatesGet'>;
	estimatesCreate: ZohoInvoiceEndpoint<'estimatesCreate'>;
	estimatesUpdate: ZohoInvoiceEndpoint<'estimatesUpdate'>;
};

export type ZohoInvoiceWebhooks = {};

export type ZohoInvoiceBoundWebhooks = BindWebhooks<ZohoInvoiceWebhooks>;

const zohoInvoiceEndpointsNested = {
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		create: Invoices.create,
		update: Invoices.update,
		delete: Invoices.delete,
	},
	items: {
		list: Items.list,
		get: Items.get,
		create: Items.create,
		update: Items.update,
	},
	payments: {
		list: Payments.list,
		get: Payments.get,
	},
	estimates: {
		list: Estimates.list,
		get: Estimates.get,
		create: Estimates.create,
		update: Estimates.update,
	},
} as const;

const zohoInvoiceWebhooksNested = {} as const;

export const zohoInvoiceEndpointSchemas = {
	'customers.list': {
		input: ZohoInvoiceEndpointInputSchemas.customersList,
		output: ZohoInvoiceEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: ZohoInvoiceEndpointInputSchemas.customersGet,
		output: ZohoInvoiceEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: ZohoInvoiceEndpointInputSchemas.customersCreate,
		output: ZohoInvoiceEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: ZohoInvoiceEndpointInputSchemas.customersUpdate,
		output: ZohoInvoiceEndpointOutputSchemas.customersUpdate,
	},
	'invoices.list': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesList,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesGet,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesGet,
	},
	'invoices.create': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesCreate,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.update': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesUpdate,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesUpdate,
	},
	'invoices.delete': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesDelete,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesDelete,
	},
	'items.list': {
		input: ZohoInvoiceEndpointInputSchemas.itemsList,
		output: ZohoInvoiceEndpointOutputSchemas.itemsList,
	},
	'items.get': {
		input: ZohoInvoiceEndpointInputSchemas.itemsGet,
		output: ZohoInvoiceEndpointOutputSchemas.itemsGet,
	},
	'items.create': {
		input: ZohoInvoiceEndpointInputSchemas.itemsCreate,
		output: ZohoInvoiceEndpointOutputSchemas.itemsCreate,
	},
	'items.update': {
		input: ZohoInvoiceEndpointInputSchemas.itemsUpdate,
		output: ZohoInvoiceEndpointOutputSchemas.itemsUpdate,
	},
	'payments.list': {
		input: ZohoInvoiceEndpointInputSchemas.paymentsList,
		output: ZohoInvoiceEndpointOutputSchemas.paymentsList,
	},
	'payments.get': {
		input: ZohoInvoiceEndpointInputSchemas.paymentsGet,
		output: ZohoInvoiceEndpointOutputSchemas.paymentsGet,
	},
	'estimates.list': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesList,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesList,
	},
	'estimates.get': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesGet,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesGet,
	},
	'estimates.create': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesCreate,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesCreate,
	},
	'estimates.update': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesUpdate,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesUpdate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zohoInvoiceEndpointsNested
>;

const zohoInvoiceWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof zohoInvoiceWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const zohoInvoiceEndpointMeta = {
	'customers.list': {
		riskLevel: 'read',
		description: 'List Zoho Invoice customers',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Get a Zoho Invoice customer',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a Zoho Invoice customer',
	},
	'customers.update': {
		riskLevel: 'write',
		description: 'Update a Zoho Invoice customer',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List Zoho Invoice invoices',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Get a Zoho Invoice invoice',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create a Zoho Invoice invoice',
	},
	'invoices.update': {
		riskLevel: 'write',
		description: 'Update a Zoho Invoice invoice',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Zoho Invoice invoice',
	},
	'items.list': { riskLevel: 'read', description: 'List Zoho Invoice items' },
	'items.get': { riskLevel: 'read', description: 'Get a Zoho Invoice item' },
	'items.create': {
		riskLevel: 'write',
		description: 'Create a Zoho Invoice item',
	},
	'items.update': {
		riskLevel: 'write',
		description: 'Update a Zoho Invoice item',
	},
	'payments.list': {
		riskLevel: 'read',
		description: 'List Zoho Invoice customer payments',
	},
	'payments.get': {
		riskLevel: 'read',
		description: 'Get a Zoho Invoice customer payment',
	},
	'estimates.list': {
		riskLevel: 'read',
		description: 'List Zoho Invoice estimates',
	},
	'estimates.get': {
		riskLevel: 'read',
		description: 'Get a Zoho Invoice estimate',
	},
	'estimates.create': {
		riskLevel: 'write',
		description: 'Create a Zoho Invoice estimate',
	},
	'estimates.update': {
		riskLevel: 'write',
		description: 'Update a Zoho Invoice estimate',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof zohoInvoiceEndpointsNested
>;

export const zohoInvoiceAuthConfig = {
	api_key: {
		account: ['organization_id'] as const,
	},
	oauth_2: {
		account: ['organization_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseZohoInvoicePlugin<T extends ZohoInvoicePluginOptions> =
	CorsairPlugin<
		'zohoinvoice',
		typeof ZohoInvoiceSchema,
		typeof zohoInvoiceEndpointsNested,
		typeof zohoInvoiceWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalZohoInvoicePlugin =
	BaseZohoInvoicePlugin<ZohoInvoicePluginOptions>;

export type ExternalZohoInvoicePlugin<T extends ZohoInvoicePluginOptions> =
	BaseZohoInvoicePlugin<T>;

export function zohoinvoice<const T extends ZohoInvoicePluginOptions>(
	incomingOptions: ZohoInvoicePluginOptions &
		T = {} as ZohoInvoicePluginOptions & T,
): ExternalZohoInvoicePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'zohoinvoice',
		authConfig: zohoInvoiceAuthConfig,
		oauthConfig: {
			providerName: 'Zoho Invoice',
			authUrl: zohoInvoiceOAuthAuthUrl(options.region),
			tokenUrl: zohoInvoiceOAuthTokenUrl(options.region),
			scopes: [
				'ZohoInvoice.contacts.READ',
				'ZohoInvoice.contacts.CREATE',
				'ZohoInvoice.contacts.UPDATE',
				'ZohoInvoice.invoices.READ',
				'ZohoInvoice.invoices.CREATE',
				'ZohoInvoice.invoices.UPDATE',
				'ZohoInvoice.invoices.DELETE',
				'ZohoInvoice.items.READ',
				'ZohoInvoice.items.CREATE',
				'ZohoInvoice.items.UPDATE',
				'ZohoInvoice.customerpayments.READ',
				'ZohoInvoice.estimates.READ',
				'ZohoInvoice.estimates.CREATE',
				'ZohoInvoice.estimates.UPDATE',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
			tokenAuthMethod: 'body',
		},
		schema: ZohoInvoiceSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: zohoInvoiceEndpointsNested,
		webhooks: zohoInvoiceWebhooksNested,
		endpointMeta: zohoInvoiceEndpointMeta,
		endpointSchemas: zohoInvoiceEndpointSchemas,
		webhookSchemas: zohoInvoiceWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchZohoInvoiceTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveZohoInvoiceOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZohoInvoiceKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				return await getOAuthAccessToken(ctx, {
					plugin: 'zohoinvoice',
					tokenUrl: zohoInvoiceOAuthTokenUrl(ctx.options.region),
					tokenAuthMethod: 'body',
				});
			}

			return '';
		},
	} satisfies InternalZohoInvoicePlugin;
}

export type {
	ZohoInvoiceEndpointInputs,
	ZohoInvoiceEndpointOutputs,
} from './endpoints/types';
