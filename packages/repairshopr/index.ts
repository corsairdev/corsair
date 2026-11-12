import type {
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { isValidSubdomain } from './client';
import { Catalog, Customers, Tickets } from './endpoints';
import type {
	RepairshoprEndpointInputs,
	RepairshoprEndpointOutputs,
} from './endpoints/types';
import {
	RepairshoprEndpointInputSchemas,
	RepairshoprEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RepairshoprSchema } from './schema';

export type RepairshoprPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The account's subdomain, the part before `.repairshopr.com`. Every request
	 * is served from it, so it travels with the key.
	 */
	subdomain?: string;
	hooks?: InternalRepairshoprPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof repairshoprEndpointsNested>;
};

/**
 * RepairShopr is multi-tenant by subdomain, and the account stores both halves
 * of the credential: the key and the subdomain. Both are account-level fields,
 * because `get_integration_credentials` is only installed for `oauth_2`.
 */
export const repairshoprAuthConfig = {
	api_key: {
		account: ['subdomain'] as const,
	},
} as const satisfies PluginAuthConfig;

export type RepairshoprContext = CorsairPluginContext<
	typeof RepairshoprSchema,
	RepairshoprPluginOptions,
	undefined,
	typeof repairshoprAuthConfig
>;

export type RepairshoprKeyBuilderContext = KeyBuilderContext<
	RepairshoprPluginOptions,
	typeof repairshoprAuthConfig
>;

export type RepairshoprBoundEndpoints = BindEndpoints<
	typeof repairshoprEndpointsNested
>;

type RepairshoprEndpoint<K extends keyof RepairshoprEndpointOutputs> =
	CorsairEndpoint<
		RepairshoprContext,
		RepairshoprEndpointInputs[K],
		RepairshoprEndpointOutputs[K]
	>;

export type RepairshoprEndpoints = {
	customersList: RepairshoprEndpoint<'customersList'>;
	customersGet: RepairshoprEndpoint<'customersGet'>;
	customersCreate: RepairshoprEndpoint<'customersCreate'>;
	customersUpdate: RepairshoprEndpoint<'customersUpdate'>;
	customersDelete: RepairshoprEndpoint<'customersDelete'>;
	ticketsList: RepairshoprEndpoint<'ticketsList'>;
	ticketsGet: RepairshoprEndpoint<'ticketsGet'>;
	ticketsCreate: RepairshoprEndpoint<'ticketsCreate'>;
	ticketsUpdate: RepairshoprEndpoint<'ticketsUpdate'>;
	ticketsDelete: RepairshoprEndpoint<'ticketsDelete'>;
	invoicesList: RepairshoprEndpoint<'invoicesList'>;
	invoicesGet: RepairshoprEndpoint<'invoicesGet'>;
	productsList: RepairshoprEndpoint<'productsList'>;
	productsGet: RepairshoprEndpoint<'productsGet'>;
	productsCreate: RepairshoprEndpoint<'productsCreate'>;
	productsUpdate: RepairshoprEndpoint<'productsUpdate'>;
	contactsList: RepairshoprEndpoint<'contactsList'>;
	vendorsList: RepairshoprEndpoint<'vendorsList'>;
};

const repairshoprEndpointsNested = {
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
		delete: Customers.remove,
	},
	tickets: {
		list: Tickets.list,
		get: Tickets.get,
		create: Tickets.create,
		update: Tickets.update,
		delete: Tickets.remove,
	},
	invoices: {
		list: Catalog.invoicesList,
		get: Catalog.invoicesGet,
	},
	products: {
		list: Catalog.productsList,
		get: Catalog.productsGet,
		create: Catalog.productsCreate,
		update: Catalog.productsUpdate,
	},
	contacts: {
		list: Catalog.contactsList,
	},
	vendors: {
		list: Catalog.vendorsList,
	},
} as const;

export const repairshoprEndpointSchemas = {
	'customers.list': {
		input: RepairshoprEndpointInputSchemas.customersList,
		output: RepairshoprEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: RepairshoprEndpointInputSchemas.customersGet,
		output: RepairshoprEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: RepairshoprEndpointInputSchemas.customersCreate,
		output: RepairshoprEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: RepairshoprEndpointInputSchemas.customersUpdate,
		output: RepairshoprEndpointOutputSchemas.customersUpdate,
	},
	'customers.delete': {
		input: RepairshoprEndpointInputSchemas.customersDelete,
		output: RepairshoprEndpointOutputSchemas.customersDelete,
	},
	'tickets.list': {
		input: RepairshoprEndpointInputSchemas.ticketsList,
		output: RepairshoprEndpointOutputSchemas.ticketsList,
	},
	'tickets.get': {
		input: RepairshoprEndpointInputSchemas.ticketsGet,
		output: RepairshoprEndpointOutputSchemas.ticketsGet,
	},
	'tickets.create': {
		input: RepairshoprEndpointInputSchemas.ticketsCreate,
		output: RepairshoprEndpointOutputSchemas.ticketsCreate,
	},
	'tickets.update': {
		input: RepairshoprEndpointInputSchemas.ticketsUpdate,
		output: RepairshoprEndpointOutputSchemas.ticketsUpdate,
	},
	'tickets.delete': {
		input: RepairshoprEndpointInputSchemas.ticketsDelete,
		output: RepairshoprEndpointOutputSchemas.ticketsDelete,
	},
	'invoices.list': {
		input: RepairshoprEndpointInputSchemas.invoicesList,
		output: RepairshoprEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: RepairshoprEndpointInputSchemas.invoicesGet,
		output: RepairshoprEndpointOutputSchemas.invoicesGet,
	},
	'products.list': {
		input: RepairshoprEndpointInputSchemas.productsList,
		output: RepairshoprEndpointOutputSchemas.productsList,
	},
	'products.get': {
		input: RepairshoprEndpointInputSchemas.productsGet,
		output: RepairshoprEndpointOutputSchemas.productsGet,
	},
	'products.create': {
		input: RepairshoprEndpointInputSchemas.productsCreate,
		output: RepairshoprEndpointOutputSchemas.productsCreate,
	},
	'products.update': {
		input: RepairshoprEndpointInputSchemas.productsUpdate,
		output: RepairshoprEndpointOutputSchemas.productsUpdate,
	},
	'contacts.list': {
		input: RepairshoprEndpointInputSchemas.contactsList,
		output: RepairshoprEndpointOutputSchemas.contactsList,
	},
	'vendors.list': {
		input: RepairshoprEndpointInputSchemas.vendorsList,
		output: RepairshoprEndpointOutputSchemas.vendorsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof repairshoprEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const repairshoprEndpointMeta = {
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers with name, email and id filters, an optional sort, and page paging',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Fetch one customer with their contact details, addresses and custom fields',
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create a customer from a business name or a person name, with contact details and notification settings',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Update a customer: their name, addresses, contact details or notification settings',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a customer permanently',
	},
	'tickets.list': {
		riskLevel: 'read',
		description:
			'List tickets with customer, contact, status, assignee and date filters, plus page paging',
	},
	'tickets.get': {
		riskLevel: 'read',
		description:
			'Fetch one ticket with its customer, location, status, priority and custom fields',
	},
	'tickets.create': {
		riskLevel: 'write',
		description:
			'Create a ticket for a customer with its subject, status, priority, assignee and assets',
	},
	'tickets.update': {
		riskLevel: 'write',
		description:
			'Update a ticket: its subject, status, priority, assignee or due date',
	},
	'tickets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a ticket permanently',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'List invoices with ticket, paid-state and update filters, plus page and per_page paging',
	},
	'invoices.get': {
		riskLevel: 'read',
		description:
			'Fetch one invoice with its totals, tax, paid state and linked ticket',
	},
	'products.list': {
		riskLevel: 'read',
		description:
			'List products with sku, name, upc and category filters, plus an optional sort',
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Fetch one product with its pricing, stock level, warranty and category',
	},
	'products.create': {
		riskLevel: 'write',
		description:
			'Create a product; the name and description are both required by RepairShopr',
	},
	'products.update': {
		riskLevel: 'write',
		description:
			'Update a product: its name, description, pricing, stock settings or category',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contact people, optionally for one customer',
	},
	'vendors.list': {
		riskLevel: 'read',
		description: 'List vendors with their sales rep and contact details',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof repairshoprEndpointsNested
>;

export type BaseRepairshoprPlugin<T extends RepairshoprPluginOptions> =
	CorsairPlugin<
		'repairshopr',
		typeof RepairshoprSchema,
		typeof repairshoprEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof repairshoprAuthConfig
	>;

export type InternalRepairshoprPlugin =
	BaseRepairshoprPlugin<RepairshoprPluginOptions>;

export type ExternalRepairshoprPlugin<T extends RepairshoprPluginOptions> =
	BaseRepairshoprPlugin<T>;

export function repairshopr<const T extends RepairshoprPluginOptions>(
	incomingOptions: RepairshoprPluginOptions &
		T = {} as RepairshoprPluginOptions & T,
): ExternalRepairshoprPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'repairshopr',
		authConfig: repairshoprAuthConfig,
		schema: RepairshoprSchema,
		options: options,
		hooks: options.hooks,
		endpoints: repairshoprEndpointsNested,
		webhooks: {},
		endpointMeta: repairshoprEndpointMeta,
		endpointSchemas: repairshoprEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RepairshoprKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) {
					// The subdomain is half of the credential. Core adds a connect link
					// only to an AuthMissingError raised here, so a stored key without a
					// usable subdomain is reported here, not later in the endpoint.
					const subdomain = (
						options.subdomain ??
						(await ctx.keys.get_subdomain()) ??
						''
					).trim();
					if (!isValidSubdomain(subdomain)) {
						throw new AuthMissingError(
							'repairshopr',
							ctx.authType,
							'[auth-missing:repairshopr:subdomain]: RepairShopr needs the account subdomain (the part before .repairshopr.com)',
						);
					}
					return res;
				}
			}

			throw new AuthMissingError('repairshopr', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRepairshoprPlugin;
}

export { RepairshoprAPIError } from './client';

export type {
	ContactsListInput,
	ContactsListResponse,
	CustomersCreateInput,
	CustomersCreateResponse,
	CustomersDeleteInput,
	CustomersDeleteResponse,
	CustomersGetInput,
	CustomersGetResponse,
	CustomersListInput,
	CustomersListResponse,
	CustomersUpdateInput,
	CustomersUpdateResponse,
	InvoicesGetInput,
	InvoicesGetResponse,
	InvoicesListInput,
	InvoicesListResponse,
	ProductsCreateInput,
	ProductsCreateResponse,
	ProductsGetInput,
	ProductsGetResponse,
	ProductsListInput,
	ProductsListResponse,
	ProductsUpdateInput,
	ProductsUpdateResponse,
	RepairshoprContact,
	RepairshoprCustomer,
	RepairshoprEndpointInputs,
	RepairshoprEndpointOutputs,
	RepairshoprInvoice,
	RepairshoprProduct,
	RepairshoprTicket,
	RepairshoprVendor,
	TicketsCreateInput,
	TicketsCreateResponse,
	TicketsDeleteInput,
	TicketsDeleteResponse,
	TicketsGetInput,
	TicketsGetResponse,
	TicketsListInput,
	TicketsListResponse,
	TicketsUpdateInput,
	TicketsUpdateResponse,
	VendorsListInput,
	VendorsListResponse,
} from './endpoints/types';
