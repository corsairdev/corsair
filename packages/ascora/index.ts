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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	createEnquiry,
	createNote,
	getContact,
	getCustomer,
	getJob,
	getLabourRoles,
	getStandardSections,
	getStandardStages,
	getSupplier,
	listCategories,
	listCustomers,
	listJobs,
	listKits,
	listQuotes,
	listSupplierInvoices,
	listSuppliers,
	listSupplies,
	searchJobs,
	uploadAttachment,
	upsertContact,
	upsertCustomer,
	upsertSupplier,
} from './endpoints';
import type {
	AscoraEndpointInputs,
	AscoraEndpointOutputs,
} from './endpoints/types';
import {
	AscoraEndpointInputSchemas,
	AscoraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AscoraSchema } from './schema';

export type AscoraPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAscoraPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ascoraEndpointsNested>;
};

export const ascoraAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type AscoraContext = CorsairPluginContext<
	typeof AscoraSchema,
	AscoraPluginOptions,
	undefined,
	typeof ascoraAuthConfig
>;

export type AscoraKeyBuilderContext = KeyBuilderContext<
	AscoraPluginOptions,
	typeof ascoraAuthConfig
>;

export type AscoraBoundEndpoints = BindEndpoints<typeof ascoraEndpointsNested>;

type AscoraEndpoint<K extends keyof AscoraEndpointOutputs> = CorsairEndpoint<
	AscoraContext,
	AscoraEndpointInputs[K],
	AscoraEndpointOutputs[K]
>;

export type AscoraEndpoints = {
	listCustomers: AscoraEndpoint<'listCustomers'>;
	getCustomer: AscoraEndpoint<'getCustomer'>;
	upsertCustomer: AscoraEndpoint<'upsertCustomer'>;
	getContact: AscoraEndpoint<'getContact'>;
	upsertContact: AscoraEndpoint<'upsertContact'>;
	createEnquiry: AscoraEndpoint<'createEnquiry'>;
	listQuotes: AscoraEndpoint<'listQuotes'>;
	getLabourRoles: AscoraEndpoint<'getLabourRoles'>;
	getStandardSections: AscoraEndpoint<'getStandardSections'>;
	getStandardStages: AscoraEndpoint<'getStandardStages'>;
	listSupplies: AscoraEndpoint<'listSupplies'>;
	listKits: AscoraEndpoint<'listKits'>;
	listCategories: AscoraEndpoint<'listCategories'>;
	getJob: AscoraEndpoint<'getJob'>;
	listJobs: AscoraEndpoint<'listJobs'>;
	searchJobs: AscoraEndpoint<'searchJobs'>;
	listSuppliers: AscoraEndpoint<'listSuppliers'>;
	getSupplier: AscoraEndpoint<'getSupplier'>;
	upsertSupplier: AscoraEndpoint<'upsertSupplier'>;
	listSupplierInvoices: AscoraEndpoint<'listSupplierInvoices'>;
	createNote: AscoraEndpoint<'createNote'>;
	uploadAttachment: AscoraEndpoint<'uploadAttachment'>;
};

const ascoraEndpointsNested = {
	customers: {
		list: listCustomers,
		get: getCustomer,
		upsert: upsertCustomer,
	},
	contacts: {
		get: getContact,
		upsert: upsertContact,
	},
	enquiries: {
		create: createEnquiry,
	},
	quotes: {
		list: listQuotes,
		labourRoles: getLabourRoles,
		standardSections: getStandardSections,
		standardStages: getStandardStages,
	},
	inventory: {
		supplies: listSupplies,
		kits: listKits,
		categories: listCategories,
	},
	jobs: {
		get: getJob,
		list: listJobs,
		search: searchJobs,
	},
	suppliers: {
		list: listSuppliers,
		get: getSupplier,
		upsert: upsertSupplier,
	},
	supplierInvoices: {
		list: listSupplierInvoices,
	},
	notes: {
		create: createNote,
	},
	attachments: {
		upload: uploadAttachment,
	},
} as const;

const ascoraWebhooksNested = {} as const;

export const ascoraEndpointSchemas = {
	'customers.list': {
		input: AscoraEndpointInputSchemas.listCustomers,
		output: AscoraEndpointOutputSchemas.listCustomers,
	},
	'customers.get': {
		input: AscoraEndpointInputSchemas.getCustomer,
		output: AscoraEndpointOutputSchemas.getCustomer,
	},
	'customers.upsert': {
		input: AscoraEndpointInputSchemas.upsertCustomer,
		output: AscoraEndpointOutputSchemas.upsertCustomer,
	},
	'contacts.get': {
		input: AscoraEndpointInputSchemas.getContact,
		output: AscoraEndpointOutputSchemas.getContact,
	},
	'contacts.upsert': {
		input: AscoraEndpointInputSchemas.upsertContact,
		output: AscoraEndpointOutputSchemas.upsertContact,
	},
	'enquiries.create': {
		input: AscoraEndpointInputSchemas.createEnquiry,
		output: AscoraEndpointOutputSchemas.createEnquiry,
	},
	'quotes.list': {
		input: AscoraEndpointInputSchemas.listQuotes,
		output: AscoraEndpointOutputSchemas.listQuotes,
	},
	'quotes.labourRoles': {
		input: AscoraEndpointInputSchemas.getLabourRoles,
		output: AscoraEndpointOutputSchemas.getLabourRoles,
	},
	'quotes.standardSections': {
		input: AscoraEndpointInputSchemas.getStandardSections,
		output: AscoraEndpointOutputSchemas.getStandardSections,
	},
	'quotes.standardStages': {
		input: AscoraEndpointInputSchemas.getStandardStages,
		output: AscoraEndpointOutputSchemas.getStandardStages,
	},
	'inventory.supplies': {
		input: AscoraEndpointInputSchemas.listSupplies,
		output: AscoraEndpointOutputSchemas.listSupplies,
	},
	'inventory.kits': {
		input: AscoraEndpointInputSchemas.listKits,
		output: AscoraEndpointOutputSchemas.listKits,
	},
	'inventory.categories': {
		input: AscoraEndpointInputSchemas.listCategories,
		output: AscoraEndpointOutputSchemas.listCategories,
	},
	'jobs.get': {
		input: AscoraEndpointInputSchemas.getJob,
		output: AscoraEndpointOutputSchemas.getJob,
	},
	'jobs.list': {
		input: AscoraEndpointInputSchemas.listJobs,
		output: AscoraEndpointOutputSchemas.listJobs,
	},
	'jobs.search': {
		input: AscoraEndpointInputSchemas.searchJobs,
		output: AscoraEndpointOutputSchemas.searchJobs,
	},
	'suppliers.list': {
		input: AscoraEndpointInputSchemas.listSuppliers,
		output: AscoraEndpointOutputSchemas.listSuppliers,
	},
	'suppliers.get': {
		input: AscoraEndpointInputSchemas.getSupplier,
		output: AscoraEndpointOutputSchemas.getSupplier,
	},
	'suppliers.upsert': {
		input: AscoraEndpointInputSchemas.upsertSupplier,
		output: AscoraEndpointOutputSchemas.upsertSupplier,
	},
	'supplierInvoices.list': {
		input: AscoraEndpointInputSchemas.listSupplierInvoices,
		output: AscoraEndpointOutputSchemas.listSupplierInvoices,
	},
	'notes.create': {
		input: AscoraEndpointInputSchemas.createNote,
		output: AscoraEndpointOutputSchemas.createNote,
	},
	'attachments.upload': {
		input: AscoraEndpointInputSchemas.uploadAttachment,
		output: AscoraEndpointOutputSchemas.uploadAttachment,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ascoraEndpointsNested
>;

const ascoraEndpointMeta = {
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers with optional filters (FilterText, type, assigned user, pagination)',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Get a customer by GUID',
	},
	'customers.upsert': {
		riskLevel: 'write',
		description: 'Create a customer or update one when customerId is provided',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a contact by GUID',
	},
	'contacts.upsert': {
		riskLevel: 'write',
		description: 'Create or update a contact on a customer',
	},
	'enquiries.create': {
		riskLevel: 'write',
		description: 'Create a quotation/enquiry (POST /Enquiry)',
	},
	'quotes.list': {
		riskLevel: 'read',
		description: 'List quotes with optional status, date, and customer filters',
	},
	'quotes.labourRoles': {
		riskLevel: 'read',
		description: 'List labour roles and hourly rates for quotes',
	},
	'quotes.standardSections': {
		riskLevel: 'read',
		description: 'List standard quote sections',
	},
	'quotes.standardStages': {
		riskLevel: 'read',
		description: 'List standard quote stages',
	},
	'inventory.supplies': {
		riskLevel: 'read',
		description: 'List inventory supplies with pricing',
	},
	'inventory.kits': {
		riskLevel: 'read',
		description: 'List inventory kits',
	},
	'inventory.categories': {
		riskLevel: 'read',
		description: 'List inventory categories',
	},
	'jobs.get': {
		riskLevel: 'read',
		description: 'Get a job by full job number (e.g. J1)',
	},
	'jobs.list': {
		riskLevel: 'read',
		description: 'List jobs filtered by status, type, dates, and assignment',
	},
	'jobs.search': {
		riskLevel: 'read',
		description: 'Search jobs by number, name, address, or customer name',
	},
	'suppliers.list': {
		riskLevel: 'read',
		description: 'List suppliers by name, number, or ABN',
	},
	'suppliers.get': {
		riskLevel: 'read',
		description: 'Get a supplier by GUID',
	},
	'suppliers.upsert': {
		riskLevel: 'write',
		description: 'Create a supplier or update one when supplierId is provided',
	},
	'supplierInvoices.list': {
		riskLevel: 'read',
		description: 'List supplier invoices with optional pagination and filters',
	},
	'notes.create': {
		riskLevel: 'write',
		description:
			'Create a note on an enquiry, job, quotation, invoice, or customer',
	},
	'attachments.upload': {
		riskLevel: 'write',
		description: 'Upload a file attachment to an Ascora entity',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ascoraEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseAscoraPlugin<T extends AscoraPluginOptions> = CorsairPlugin<
	'ascora',
	typeof AscoraSchema,
	typeof ascoraEndpointsNested,
	typeof ascoraWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof ascoraAuthConfig
>;

export type InternalAscoraPlugin = BaseAscoraPlugin<AscoraPluginOptions>;

export type ExternalAscoraPlugin<T extends AscoraPluginOptions> =
	BaseAscoraPlugin<T>;

export function ascora<const T extends AscoraPluginOptions>(
	incomingOptions: AscoraPluginOptions & T = {} as AscoraPluginOptions & T,
): ExternalAscoraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ascora',
		authConfig: ascoraAuthConfig,
		schema: AscoraSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: ascoraEndpointsNested,
		webhooks: ascoraWebhooksNested,
		endpointMeta: ascoraEndpointMeta,
		endpointSchemas: ascoraEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AscoraKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('ascora', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('ascora', 'api_key');
		},
	} satisfies InternalAscoraPlugin;
}

export type {
	AscoraEndpointInputs,
	AscoraEndpointOutputs,
} from './endpoints/types';
export {
	AscoraEndpointInputSchemas,
	AscoraEndpointOutputSchemas,
} from './endpoints/types';
export { AscoraSchema } from './schema';
