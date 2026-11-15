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
import { Company, Contacts, Invoices, Projects } from './endpoints';
import type {
	FreeAgentEndpointInputs,
	FreeAgentEndpointOutputs,
} from './endpoints/types';
import {
	FreeAgentEndpointInputSchemas,
	FreeAgentEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FreeAgentSchema } from './schema';

export type FreeAgentPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	hooks?: InternalFreeAgentPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof freeAgentEndpointsNested>;
};

export type FreeAgentContext = CorsairPluginContext<
	typeof FreeAgentSchema,
	FreeAgentPluginOptions
>;
export type FreeAgentKeyBuilderContext =
	KeyBuilderContext<FreeAgentPluginOptions>;
export type FreeAgentBoundEndpoints = BindEndpoints<
	typeof freeAgentEndpointsNested
>;

type Endpoint<K extends keyof FreeAgentEndpointOutputs> = CorsairEndpoint<
	FreeAgentContext,
	FreeAgentEndpointInputs[K],
	FreeAgentEndpointOutputs[K]
>;

export type FreeAgentEndpoints = {
	companyGet: Endpoint<'companyGet'>;
	contactsList: Endpoint<'contactsList'>;
	contactsGet: Endpoint<'contactsGet'>;
	contactsCreate: Endpoint<'contactsCreate'>;
	contactsUpdate: Endpoint<'contactsUpdate'>;
	contactsDelete: Endpoint<'contactsDelete'>;
	projectsList: Endpoint<'projectsList'>;
	projectsGet: Endpoint<'projectsGet'>;
	projectsCreate: Endpoint<'projectsCreate'>;
	projectsUpdate: Endpoint<'projectsUpdate'>;
	projectsDelete: Endpoint<'projectsDelete'>;
	invoicesList: Endpoint<'invoicesList'>;
	invoicesGet: Endpoint<'invoicesGet'>;
	invoicesCreate: Endpoint<'invoicesCreate'>;
	invoicesUpdate: Endpoint<'invoicesUpdate'>;
	invoicesDelete: Endpoint<'invoicesDelete'>;
	invoicesMarkSent: Endpoint<'invoicesMarkSent'>;
	invoicesSendEmail: Endpoint<'invoicesSendEmail'>;
};

const freeAgentEndpointsNested = {
	company: { get: Company.get },
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
	},
	invoices: {
		list: Invoices.list,
		get: Invoices.get,
		create: Invoices.create,
		update: Invoices.update,
		delete: Invoices.remove,
		markSent: Invoices.markSent,
		sendEmail: Invoices.sendEmail,
	},
} as const;

export const freeAgentEndpointSchemas = {
	'company.get': {
		input: FreeAgentEndpointInputSchemas.companyGet,
		output: FreeAgentEndpointOutputSchemas.companyGet,
	},
	'contacts.list': {
		input: FreeAgentEndpointInputSchemas.contactsList,
		output: FreeAgentEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: FreeAgentEndpointInputSchemas.contactsGet,
		output: FreeAgentEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: FreeAgentEndpointInputSchemas.contactsCreate,
		output: FreeAgentEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: FreeAgentEndpointInputSchemas.contactsUpdate,
		output: FreeAgentEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: FreeAgentEndpointInputSchemas.contactsDelete,
		output: FreeAgentEndpointOutputSchemas.contactsDelete,
	},
	'projects.list': {
		input: FreeAgentEndpointInputSchemas.projectsList,
		output: FreeAgentEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: FreeAgentEndpointInputSchemas.projectsGet,
		output: FreeAgentEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: FreeAgentEndpointInputSchemas.projectsCreate,
		output: FreeAgentEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: FreeAgentEndpointInputSchemas.projectsUpdate,
		output: FreeAgentEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: FreeAgentEndpointInputSchemas.projectsDelete,
		output: FreeAgentEndpointOutputSchemas.projectsDelete,
	},
	'invoices.list': {
		input: FreeAgentEndpointInputSchemas.invoicesList,
		output: FreeAgentEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: FreeAgentEndpointInputSchemas.invoicesGet,
		output: FreeAgentEndpointOutputSchemas.invoicesGet,
	},
	'invoices.create': {
		input: FreeAgentEndpointInputSchemas.invoicesCreate,
		output: FreeAgentEndpointOutputSchemas.invoicesCreate,
	},
	'invoices.update': {
		input: FreeAgentEndpointInputSchemas.invoicesUpdate,
		output: FreeAgentEndpointOutputSchemas.invoicesUpdate,
	},
	'invoices.delete': {
		input: FreeAgentEndpointInputSchemas.invoicesDelete,
		output: FreeAgentEndpointOutputSchemas.invoicesDelete,
	},
	'invoices.markSent': {
		input: FreeAgentEndpointInputSchemas.invoicesMarkSent,
		output: FreeAgentEndpointOutputSchemas.invoicesMarkSent,
	},
	'invoices.sendEmail': {
		input: FreeAgentEndpointInputSchemas.invoicesSendEmail,
		output: FreeAgentEndpointOutputSchemas.invoicesSendEmail,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof freeAgentEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2';

const freeAgentEndpointMeta = {
	'company.get': {
		riskLevel: 'read',
		description: 'Get the authenticated company profile',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with documented filters and pagination',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a contact by its FreeAgent ID',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact using documented contact fields',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update documented fields on a contact',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects with documented filters and pagination',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project by its FreeAgent ID',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project with documented project fields',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update documented fields on a project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List invoices with documented filters and pagination',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Get an invoice by its FreeAgent ID',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create an invoice in Draft status',
	},
	'invoices.update': {
		riskLevel: 'write',
		description: 'Update an invoice without changing its status',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		description: 'Delete an invoice',
	},
	'invoices.markSent': {
		riskLevel: 'destructive',
		description: 'Mark an invoice as sent or reopen a cancelled invoice',
	},
	'invoices.sendEmail': {
		riskLevel: 'destructive',
		description: 'Send an invoice email to its recipient',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof freeAgentEndpointsNested
>;

export const freeAgentAuthConfig = {
	oauth_2: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;

export type BaseFreeAgentPlugin<T extends FreeAgentPluginOptions> =
	CorsairPlugin<
		'freeagent',
		typeof FreeAgentSchema,
		typeof freeAgentEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;
export type InternalFreeAgentPlugin =
	BaseFreeAgentPlugin<FreeAgentPluginOptions>;
export type ExternalFreeAgentPlugin<T extends FreeAgentPluginOptions> =
	BaseFreeAgentPlugin<T>;

export function freeagent<const T extends FreeAgentPluginOptions>(
	incomingOptions: FreeAgentPluginOptions & T = {} as FreeAgentPluginOptions &
		T,
): ExternalFreeAgentPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'freeagent',
		authConfig: freeAgentAuthConfig,
		schema: FreeAgentSchema,
		options,
		hooks: options.hooks,
		endpoints: freeAgentEndpointsNested,
		webhooks: {},
		endpointMeta: freeAgentEndpointMeta,
		endpointSchemas: freeAgentEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: FreeAgentKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (!ctx.keys) throw new AuthMissingError('freeagent', 'oauth_2');
			const accessToken = await ctx.keys.get_access_token();
			if (!accessToken) throw new AuthMissingError('freeagent', 'oauth_2');
			return accessToken;
		},
	} satisfies InternalFreeAgentPlugin;
}

export type {
	FreeAgentEndpointInputs,
	FreeAgentEndpointOutputs,
} from './endpoints/types';
