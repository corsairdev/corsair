import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import type { ZohoInvoiceRegion } from './client';
import { zohoInvoiceOAuthAuthUrl, zohoInvoiceOAuthTokenUrl } from './client';
import {
	Customers,
	Estimates,
	Invoices,
	Items,
	Organizations,
	Payments,
} from './endpoints';
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

export type ZohoInvoicePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	region?: ZohoInvoiceRegion;
	key?: string;
	hooks?: InternalZohoInvoicePlugin['hooks'];
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
	organizationsList: ZohoInvoiceEndpoint<'organizationsList'>;
	customersDelete: ZohoInvoiceEndpoint<'customersDelete'>;
	invoicesMarkSent: ZohoInvoiceEndpoint<'invoicesMarkSent'>;
	invoicesVoid: ZohoInvoiceEndpoint<'invoicesVoid'>;
	invoicesEmail: ZohoInvoiceEndpoint<'invoicesEmail'>;
	invoicesRemind: ZohoInvoiceEndpoint<'invoicesRemind'>;
	invoicesListPayments: ZohoInvoiceEndpoint<'invoicesListPayments'>;
	itemsDelete: ZohoInvoiceEndpoint<'itemsDelete'>;
	paymentsCreate: ZohoInvoiceEndpoint<'paymentsCreate'>;
	paymentsDelete: ZohoInvoiceEndpoint<'paymentsDelete'>;
	estimatesDelete: ZohoInvoiceEndpoint<'estimatesDelete'>;
	estimatesMarkSent: ZohoInvoiceEndpoint<'estimatesMarkSent'>;
	estimatesMarkAccepted: ZohoInvoiceEndpoint<'estimatesMarkAccepted'>;
	estimatesMarkDeclined: ZohoInvoiceEndpoint<'estimatesMarkDeclined'>;
	estimatesEmail: ZohoInvoiceEndpoint<'estimatesEmail'>;
};

export type ZohoInvoiceWebhooks = {};

export type ZohoInvoiceBoundWebhooks = BindWebhooks<ZohoInvoiceWebhooks>;

const zohoInvoiceEndpointsNested = {
	organizations: {
		list: Organizations.list,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
		delete: Customers.delete,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		create: Invoices.create,
		update: Invoices.update,
		delete: Invoices.delete,
		markSent: Invoices.markSent,
		void: Invoices.void,
		email: Invoices.email,
		remind: Invoices.remind,
		listPayments: Invoices.listPayments,
	},
	items: {
		list: Items.list,
		get: Items.get,
		create: Items.create,
		update: Items.update,
		delete: Items.delete,
	},
	payments: {
		list: Payments.list,
		get: Payments.get,
		create: Payments.create,
		delete: Payments.delete,
	},
	estimates: {
		list: Estimates.list,
		get: Estimates.get,
		create: Estimates.create,
		update: Estimates.update,
		delete: Estimates.delete,
		markSent: Estimates.markSent,
		markAccepted: Estimates.markAccepted,
		markDeclined: Estimates.markDeclined,
		email: Estimates.email,
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
	'organizations.list': {
		input: ZohoInvoiceEndpointInputSchemas.organizationsList,
		output: ZohoInvoiceEndpointOutputSchemas.organizationsList,
	},
	'customers.delete': {
		input: ZohoInvoiceEndpointInputSchemas.customersDelete,
		output: ZohoInvoiceEndpointOutputSchemas.customersDelete,
	},
	'invoices.markSent': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesMarkSent,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesMarkSent,
	},
	'invoices.void': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesVoid,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesVoid,
	},
	'invoices.email': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesEmail,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesEmail,
	},
	'invoices.remind': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesRemind,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesRemind,
	},
	'invoices.listPayments': {
		input: ZohoInvoiceEndpointInputSchemas.invoicesListPayments,
		output: ZohoInvoiceEndpointOutputSchemas.invoicesListPayments,
	},
	'items.delete': {
		input: ZohoInvoiceEndpointInputSchemas.itemsDelete,
		output: ZohoInvoiceEndpointOutputSchemas.itemsDelete,
	},
	'payments.create': {
		input: ZohoInvoiceEndpointInputSchemas.paymentsCreate,
		output: ZohoInvoiceEndpointOutputSchemas.paymentsCreate,
	},
	'payments.delete': {
		input: ZohoInvoiceEndpointInputSchemas.paymentsDelete,
		output: ZohoInvoiceEndpointOutputSchemas.paymentsDelete,
	},
	'estimates.delete': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesDelete,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesDelete,
	},
	'estimates.markSent': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesMarkSent,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesMarkSent,
	},
	'estimates.markAccepted': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesMarkAccepted,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesMarkAccepted,
	},
	'estimates.markDeclined': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesMarkDeclined,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesMarkDeclined,
	},
	'estimates.email': {
		input: ZohoInvoiceEndpointInputSchemas.estimatesEmail,
		output: ZohoInvoiceEndpointOutputSchemas.estimatesEmail,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zohoInvoiceEndpointsNested
>;

const zohoInvoiceWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof zohoInvoiceWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export const zohoInvoiceOAuthScopes = [
	'ZohoInvoice.contacts.CREATE',
	'ZohoInvoice.contacts.READ',
	'ZohoInvoice.contacts.UPDATE',
	'ZohoInvoice.contacts.DELETE',
	'ZohoInvoice.invoices.CREATE',
	'ZohoInvoice.invoices.READ',
	'ZohoInvoice.invoices.UPDATE',
	'ZohoInvoice.invoices.DELETE',
	'ZohoInvoice.settings.CREATE',
	'ZohoInvoice.settings.READ',
	'ZohoInvoice.settings.UPDATE',
	'ZohoInvoice.settings.DELETE',
	'ZohoInvoice.customerpayments.CREATE',
	'ZohoInvoice.customerpayments.READ',
	'ZohoInvoice.customerpayments.DELETE',
	'ZohoInvoice.estimates.CREATE',
	'ZohoInvoice.estimates.READ',
	'ZohoInvoice.estimates.UPDATE',
	'ZohoInvoice.estimates.DELETE',
] as const;

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
		description: 'Delete a Zoho Invoice invoice. Cannot be undone',
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
	'organizations.list': {
		riskLevel: 'read',
		description:
			'List the Zoho Invoice organizations the account can use, with their ids',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a customer. Cannot be undone',
	},
	'invoices.markSent': {
		riskLevel: 'write',
		description: 'Mark a draft invoice as sent without emailing it',
	},
	'invoices.void': {
		riskLevel: 'destructive',
		description: 'Void an invoice; it stops counting toward the balance',
	},
	'invoices.email': {
		riskLevel: 'destructive',
		description: 'Email an invoice to the customer',
	},
	'invoices.remind': {
		riskLevel: 'destructive',
		description: 'Email the customer a payment reminder for an invoice',
	},
	'invoices.listPayments': {
		riskLevel: 'read',
		description: 'List the payments recorded against an invoice',
	},
	'items.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an item. Cannot be undone',
	},
	'payments.create': {
		riskLevel: 'write',
		description: 'Record a customer payment, optionally applied to invoices',
	},
	'payments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a recorded customer payment. Cannot be undone',
	},
	'estimates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an estimate. Cannot be undone',
	},
	'estimates.markSent': {
		riskLevel: 'write',
		description: 'Mark a draft estimate as sent without emailing it',
	},
	'estimates.markAccepted': {
		riskLevel: 'write',
		description: 'Mark an estimate as accepted by the customer',
	},
	'estimates.markDeclined': {
		riskLevel: 'write',
		description: 'Mark an estimate as declined by the customer',
	},
	'estimates.email': {
		riskLevel: 'destructive',
		description: 'Email an estimate to the customer',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof zohoInvoiceEndpointsNested
>;

export const zohoInvoiceAuthConfig = {
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
			// One entry on purpose: core joins this array with spaces, and Zoho
			// documents scopes as comma-separated. Items and organizations use
			// the settings scopes.
			scopes: [zohoInvoiceOAuthScopes.join(',')],
			authParams: { access_type: 'offline', prompt: 'consent' },
			tokenAuthMethod: 'body',
		},
		schema: ZohoInvoiceSchema,
		options: options,
		hooks: options.hooks,
		endpoints: zohoInvoiceEndpointsNested,
		webhooks: zohoInvoiceWebhooksNested,
		endpointMeta: zohoInvoiceEndpointMeta,
		endpointSchemas: zohoInvoiceEndpointSchemas,
		webhookSchemas: zohoInvoiceWebhookSchemas,
		pluginWebhookMatcher: () => false,
		oauthWebhookTenantLinkResolver: (tokens) =>
			resolveZohoInvoiceOAuthWebhookTenantLink(tokens, options.region),
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: ZohoInvoiceKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'zohoinvoice',
					tokenUrl: zohoInvoiceOAuthTokenUrl(ctx.options.region),
					tokenAuthMethod: 'body',
				});
			}
			throw new AuthMissingError('zohoinvoice', defaultAuthType);
		},
	} satisfies InternalZohoInvoicePlugin;
}

export type {
	ZohoInvoiceEndpointInputs,
	ZohoInvoiceEndpointOutputs,
} from './endpoints/types';
