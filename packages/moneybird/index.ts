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
import {
	Administrations,
	Contacts,
	Products,
	Projects,
	SalesInvoices,
	TimeEntries,
} from './endpoints';
import type {
	MoneybirdEndpointInputs,
	MoneybirdEndpointOutputs,
} from './endpoints/types';
import {
	MoneybirdEndpointInputSchemas,
	MoneybirdEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MoneybirdSchema } from './schema';

export type MoneybirdPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The personal API token (or OAuth access token) as a Bearer credential. */
	key?: string;
	/** The administration id the token should act on. */
	administrationId?: string;
	hooks?: InternalMoneybirdPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof moneybirdEndpointsNested>;
};

export type MoneybirdContext = CorsairPluginContext<
	typeof MoneybirdSchema,
	MoneybirdPluginOptions,
	undefined,
	typeof moneybirdAuthConfig
>;

export type MoneybirdKeyBuilderContext = KeyBuilderContext<
	MoneybirdPluginOptions,
	typeof moneybirdAuthConfig
>;

export type MoneybirdBoundEndpoints = BindEndpoints<
	typeof moneybirdEndpointsNested
>;

type MoneybirdEndpoint<K extends keyof MoneybirdEndpointOutputs> =
	CorsairEndpoint<
		MoneybirdContext,
		MoneybirdEndpointInputs[K],
		MoneybirdEndpointOutputs[K]
	>;

export type MoneybirdEndpoints = {
	administrationsList: MoneybirdEndpoint<'administrationsList'>;
	contactsList: MoneybirdEndpoint<'contactsList'>;
	contactsGet: MoneybirdEndpoint<'contactsGet'>;
	contactsCreate: MoneybirdEndpoint<'contactsCreate'>;
	contactsUpdate: MoneybirdEndpoint<'contactsUpdate'>;
	contactsDelete: MoneybirdEndpoint<'contactsDelete'>;
	salesInvoicesList: MoneybirdEndpoint<'salesInvoicesList'>;
	salesInvoicesGet: MoneybirdEndpoint<'salesInvoicesGet'>;
	salesInvoicesCreate: MoneybirdEndpoint<'salesInvoicesCreate'>;
	salesInvoicesUpdate: MoneybirdEndpoint<'salesInvoicesUpdate'>;
	salesInvoicesDelete: MoneybirdEndpoint<'salesInvoicesDelete'>;
	salesInvoicesSend: MoneybirdEndpoint<'salesInvoicesSend'>;
	timeEntriesList: MoneybirdEndpoint<'timeEntriesList'>;
	timeEntriesGet: MoneybirdEndpoint<'timeEntriesGet'>;
	timeEntriesCreate: MoneybirdEndpoint<'timeEntriesCreate'>;
	timeEntriesUpdate: MoneybirdEndpoint<'timeEntriesUpdate'>;
	timeEntriesDelete: MoneybirdEndpoint<'timeEntriesDelete'>;
	productsList: MoneybirdEndpoint<'productsList'>;
	productsGet: MoneybirdEndpoint<'productsGet'>;
	productsCreate: MoneybirdEndpoint<'productsCreate'>;
	productsUpdate: MoneybirdEndpoint<'productsUpdate'>;
	productsDelete: MoneybirdEndpoint<'productsDelete'>;
	projectsList: MoneybirdEndpoint<'projectsList'>;
	projectsGet: MoneybirdEndpoint<'projectsGet'>;
	projectsCreate: MoneybirdEndpoint<'projectsCreate'>;
	projectsUpdate: MoneybirdEndpoint<'projectsUpdate'>;
	projectsDelete: MoneybirdEndpoint<'projectsDelete'>;
};

const moneybirdEndpointsNested = {
	administrations: {
		list: Administrations.list,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
	},
	salesInvoices: {
		list: SalesInvoices.list,
		get: SalesInvoices.get,
		create: SalesInvoices.create,
		update: SalesInvoices.update,
		send: SalesInvoices.send,
		delete: SalesInvoices.remove,
	},
	timeEntries: {
		list: TimeEntries.list,
		get: TimeEntries.get,
		create: TimeEntries.create,
		update: TimeEntries.update,
		delete: TimeEntries.remove,
	},
	products: {
		list: Products.list,
		get: Products.get,
		create: Products.create,
		update: Products.update,
		delete: Products.remove,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
	},
} as const;

export const moneybirdEndpointSchemas = {
	'administrations.list': {
		input: MoneybirdEndpointInputSchemas.administrationsList,
		output: MoneybirdEndpointOutputSchemas.administrationsList,
	},
	'contacts.list': {
		input: MoneybirdEndpointInputSchemas.contactsList,
		output: MoneybirdEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: MoneybirdEndpointInputSchemas.contactsGet,
		output: MoneybirdEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: MoneybirdEndpointInputSchemas.contactsCreate,
		output: MoneybirdEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: MoneybirdEndpointInputSchemas.contactsUpdate,
		output: MoneybirdEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: MoneybirdEndpointInputSchemas.contactsDelete,
		output: MoneybirdEndpointOutputSchemas.contactsDelete,
	},
	'salesInvoices.list': {
		input: MoneybirdEndpointInputSchemas.salesInvoicesList,
		output: MoneybirdEndpointOutputSchemas.salesInvoicesList,
	},
	'salesInvoices.get': {
		input: MoneybirdEndpointInputSchemas.salesInvoicesGet,
		output: MoneybirdEndpointOutputSchemas.salesInvoicesGet,
	},
	'salesInvoices.create': {
		input: MoneybirdEndpointInputSchemas.salesInvoicesCreate,
		output: MoneybirdEndpointOutputSchemas.salesInvoicesCreate,
	},
	'salesInvoices.update': {
		input: MoneybirdEndpointInputSchemas.salesInvoicesUpdate,
		output: MoneybirdEndpointOutputSchemas.salesInvoicesUpdate,
	},
	'salesInvoices.send': {
		input: MoneybirdEndpointInputSchemas.salesInvoicesSend,
		output: MoneybirdEndpointOutputSchemas.salesInvoicesSend,
	},
	'salesInvoices.delete': {
		input: MoneybirdEndpointInputSchemas.salesInvoicesDelete,
		output: MoneybirdEndpointOutputSchemas.salesInvoicesDelete,
	},
	'timeEntries.list': {
		input: MoneybirdEndpointInputSchemas.timeEntriesList,
		output: MoneybirdEndpointOutputSchemas.timeEntriesList,
	},
	'timeEntries.get': {
		input: MoneybirdEndpointInputSchemas.timeEntriesGet,
		output: MoneybirdEndpointOutputSchemas.timeEntriesGet,
	},
	'timeEntries.create': {
		input: MoneybirdEndpointInputSchemas.timeEntriesCreate,
		output: MoneybirdEndpointOutputSchemas.timeEntriesCreate,
	},
	'timeEntries.update': {
		input: MoneybirdEndpointInputSchemas.timeEntriesUpdate,
		output: MoneybirdEndpointOutputSchemas.timeEntriesUpdate,
	},
	'timeEntries.delete': {
		input: MoneybirdEndpointInputSchemas.timeEntriesDelete,
		output: MoneybirdEndpointOutputSchemas.timeEntriesDelete,
	},
	'products.list': {
		input: MoneybirdEndpointInputSchemas.productsList,
		output: MoneybirdEndpointOutputSchemas.productsList,
	},
	'products.get': {
		input: MoneybirdEndpointInputSchemas.productsGet,
		output: MoneybirdEndpointOutputSchemas.productsGet,
	},
	'products.create': {
		input: MoneybirdEndpointInputSchemas.productsCreate,
		output: MoneybirdEndpointOutputSchemas.productsCreate,
	},
	'products.update': {
		input: MoneybirdEndpointInputSchemas.productsUpdate,
		output: MoneybirdEndpointOutputSchemas.productsUpdate,
	},
	'products.delete': {
		input: MoneybirdEndpointInputSchemas.productsDelete,
		output: MoneybirdEndpointOutputSchemas.productsDelete,
	},
	'projects.list': {
		input: MoneybirdEndpointInputSchemas.projectsList,
		output: MoneybirdEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: MoneybirdEndpointInputSchemas.projectsGet,
		output: MoneybirdEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: MoneybirdEndpointInputSchemas.projectsCreate,
		output: MoneybirdEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: MoneybirdEndpointInputSchemas.projectsUpdate,
		output: MoneybirdEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: MoneybirdEndpointInputSchemas.projectsDelete,
		output: MoneybirdEndpointOutputSchemas.projectsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof moneybirdEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const moneybirdEndpointMeta = {
	'administrations.list': {
		riskLevel: 'read',
		description:
			'List the administrations the token can access, with id, name, currency and access level',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts, one page at a time',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact and its linked invoices history access',
	},
	'salesInvoices.list': {
		riskLevel: 'read',
		description:
			"List sales invoices with a filter string such as 'state:open|paid' or 'period:this_year', one page at a time",
	},
	'salesInvoices.get': {
		riskLevel: 'read',
		description: 'Read one sales invoice with its lines',
	},
	'salesInvoices.create': {
		riskLevel: 'write',
		description: 'Create a sales invoice for a contact, with line items',
	},
	'salesInvoices.update': {
		riskLevel: 'write',
		description: 'Update a sales invoice; sent invoices may refuse changes',
	},
	'salesInvoices.send': {
		riskLevel: 'destructive',
		description:
			'Send the invoice to the customer now or schedule it for a date; defaults come from the contact and workflow',
	},
	'salesInvoices.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a sales invoice; only drafts and unsent states allow it',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description: 'List time entries, one page at a time',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Read one time entry',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description:
			'Create a time entry from started_at to ended_at; Moneybird rounds to full minutes',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description: 'Update a time entry',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		description: 'Delete a time entry',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'List products, one page at a time',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Read one product',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create a product',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update a product',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects, one page at a time',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project; the name must be unique within the administration',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update a project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof moneybirdEndpointsNested
>;

/** The token travels in the Authorization header; the administration id selects the books. */
export const moneybirdAuthConfig = {
	api_key: {
		account: ['administration_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMoneybirdPlugin<T extends MoneybirdPluginOptions> =
	CorsairPlugin<
		'moneybird',
		typeof MoneybirdSchema,
		typeof moneybirdEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof moneybirdAuthConfig
	>;

export type InternalMoneybirdPlugin =
	BaseMoneybirdPlugin<MoneybirdPluginOptions>;

export type ExternalMoneybirdPlugin<T extends MoneybirdPluginOptions> =
	BaseMoneybirdPlugin<T>;

export function moneybird<const T extends MoneybirdPluginOptions>(
	incomingOptions: MoneybirdPluginOptions & T = {} as MoneybirdPluginOptions &
		T,
): ExternalMoneybirdPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'moneybird',
		schema: MoneybirdSchema,
		options: options,
		hooks: options.hooks,
		endpoints: moneybirdEndpointsNested,
		webhooks: {},
		authConfig: moneybirdAuthConfig,
		endpointMeta: moneybirdEndpointMeta,
		endpointSchemas: moneybirdEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MoneybirdKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('moneybird', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMoneybirdPlugin;
}

export { MoneybirdAPIError } from './client';

export type {
	Administration,
	AdministrationsListResponse,
	Contact,
	ContactsListInput,
	ContactUpsertInput,
	DeleteResponse,
	IdInput,
	MoneybirdEndpointInputs,
	MoneybirdEndpointOutputs,
	Product,
	ProductsListInput,
	ProductUpsertInput,
	Project,
	ProjectsListInput,
	ProjectUpsertInput,
	SalesInvoice,
	SalesInvoiceSendInput,
	SalesInvoicesListInput,
	SalesInvoiceUpsertInput,
	TimeEntriesListInput,
	TimeEntry,
	TimeEntryUpsertInput,
} from './endpoints/types';
