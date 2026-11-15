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
import { Companies, Contacts, Marketing, Projects, Worlds } from './endpoints';
import type {
	SuitedashEndpointInputs,
	SuitedashEndpointOutputs,
} from './endpoints/types';
import {
	SuitedashEndpointInputSchemas,
	SuitedashEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SuitedashSchema } from './schema';

/**
 * SuiteDash has no single-token form: every call carries a Public ID and a
 * Secret Key in two headers. The key is the Public ID and the secret lives on
 * the account, so both are available to the client.
 */
export const suitedashAuthConfig = {
	api_key: {
		account: ['secret_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type SuitedashPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** The Secret Key from Integrations, Secure API. Read from the account when omitted. */
	secretKey?: string;
	hooks?: InternalSuitedashPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof suitedashEndpointsNested>;
};

export type SuitedashContext = CorsairPluginContext<
	typeof SuitedashSchema,
	SuitedashPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SuitedashEndpoint, and passing them back would make the type circular.
	undefined,
	typeof suitedashAuthConfig
>;

export type SuitedashKeyBuilderContext = KeyBuilderContext<
	SuitedashPluginOptions,
	typeof suitedashAuthConfig
>;

export type SuitedashBoundEndpoints = BindEndpoints<
	typeof suitedashEndpointsNested
>;

type SuitedashEndpoint<K extends keyof SuitedashEndpointOutputs> =
	CorsairEndpoint<
		SuitedashContext,
		SuitedashEndpointInputs[K],
		SuitedashEndpointOutputs[K]
	>;

export type SuitedashEndpoints = {
	companiesList: SuitedashEndpoint<'companiesList'>;
	companiesGet: SuitedashEndpoint<'companiesGet'>;
	companiesCreate: SuitedashEndpoint<'companiesCreate'>;
	companiesUpdate: SuitedashEndpoint<'companiesUpdate'>;
	companiesMeta: SuitedashEndpoint<'companiesMeta'>;
	contactsList: SuitedashEndpoint<'contactsList'>;
	contactsGet: SuitedashEndpoint<'contactsGet'>;
	contactsCreate: SuitedashEndpoint<'contactsCreate'>;
	contactsUpdate: SuitedashEndpoint<'contactsUpdate'>;
	contactsMeta: SuitedashEndpoint<'contactsMeta'>;
	projectsList: SuitedashEndpoint<'projectsList'>;
	projectsGet: SuitedashEndpoint<'projectsGet'>;
	projectsUpdate: SuitedashEndpoint<'projectsUpdate'>;
	projectsMeta: SuitedashEndpoint<'projectsMeta'>;
	worldsList: SuitedashEndpoint<'worldsList'>;
	marketingSubscribe: SuitedashEndpoint<'marketingSubscribe'>;
};

const suitedashEndpointsNested = {
	companies: {
		list: Companies.list,
		get: Companies.get,
		create: Companies.create,
		update: Companies.update,
		meta: Companies.meta,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		meta: Contacts.meta,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		update: Projects.update,
		meta: Projects.meta,
	},
	worlds: {
		list: Worlds.list,
	},
	marketing: {
		subscribe: Marketing.subscribe,
	},
} as const;

export const suitedashEndpointSchemas = {
	'companies.list': {
		input: SuitedashEndpointInputSchemas.companiesList,
		output: SuitedashEndpointOutputSchemas.companiesList,
	},
	'companies.get': {
		input: SuitedashEndpointInputSchemas.companiesGet,
		output: SuitedashEndpointOutputSchemas.companiesGet,
	},
	'companies.create': {
		input: SuitedashEndpointInputSchemas.companiesCreate,
		output: SuitedashEndpointOutputSchemas.companiesCreate,
	},
	'companies.update': {
		input: SuitedashEndpointInputSchemas.companiesUpdate,
		output: SuitedashEndpointOutputSchemas.companiesUpdate,
	},
	'companies.meta': {
		input: SuitedashEndpointInputSchemas.companiesMeta,
		output: SuitedashEndpointOutputSchemas.companiesMeta,
	},
	'contacts.list': {
		input: SuitedashEndpointInputSchemas.contactsList,
		output: SuitedashEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: SuitedashEndpointInputSchemas.contactsGet,
		output: SuitedashEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: SuitedashEndpointInputSchemas.contactsCreate,
		output: SuitedashEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: SuitedashEndpointInputSchemas.contactsUpdate,
		output: SuitedashEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.meta': {
		input: SuitedashEndpointInputSchemas.contactsMeta,
		output: SuitedashEndpointOutputSchemas.contactsMeta,
	},
	'projects.list': {
		input: SuitedashEndpointInputSchemas.projectsList,
		output: SuitedashEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: SuitedashEndpointInputSchemas.projectsGet,
		output: SuitedashEndpointOutputSchemas.projectsGet,
	},
	'projects.update': {
		input: SuitedashEndpointInputSchemas.projectsUpdate,
		output: SuitedashEndpointOutputSchemas.projectsUpdate,
	},
	'projects.meta': {
		input: SuitedashEndpointInputSchemas.projectsMeta,
		output: SuitedashEndpointOutputSchemas.projectsMeta,
	},
	'worlds.list': {
		input: SuitedashEndpointInputSchemas.worldsList,
		output: SuitedashEndpointOutputSchemas.worldsList,
	},
	'marketing.subscribe': {
		input: SuitedashEndpointInputSchemas.marketingSubscribe,
		output: SuitedashEndpointOutputSchemas.marketingSubscribe,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof suitedashEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const suitedashEndpointMeta = {
	'companies.list': {
		riskLevel: 'read',
		description:
			'List companies with filters for when they were created, an order, and whether to include the paging and custom field meta',
	},
	'companies.get': {
		riskLevel: 'read',
		description:
			'Read one company by uid or exact name, with its category, address, primary contact and custom fields',
	},
	'companies.create': {
		riskLevel: 'write',
		description:
			'Create a company, optionally with its first contact in the same call. The role decides what the client portal shows it',
	},
	'companies.update': {
		riskLevel: 'write',
		description:
			"Change a company's details, tags, category, custom fields, communities or worlds. Only the fields sent change",
	},
	'companies.meta': {
		riskLevel: 'read',
		description:
			'Read the meta attributes of the company custom fields, which is where the uuid keys a write uses come from',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts with filters for when they were created, an order, and whether to include the meta block',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Read one contact by uid or email, with their roles, phones, addresses and custom fields',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a contact. First name, last name, email and role are required, and the role decides portal access',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			"Change a contact's details, addresses, tags or custom fields, optionally sending the portal welcome email",
	},
	'contacts.meta': {
		riskLevel: 'read',
		description:
			'Read the meta attributes of the contact custom fields, which is where the uuid keys a write uses come from',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List projects with filters for when they were created, an order, and whether to include the meta block',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Find one project by uid, exact name, a name fragment, or the most recent one, with its clients, team and custom fields',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			"Change a project's name, status, dates, information text or custom fields. SuiteDash's update schema is open, so only the documented fields are typed",
	},
	'projects.meta': {
		riskLevel: 'read',
		description: 'Read the meta attributes of the project custom fields',
	},
	'worlds.list': {
		riskLevel: 'read',
		description:
			'List the worlds on the account, which is a Power-up and answers a bare array rather than the CRM list envelope',
	},
	'marketing.subscribe': {
		riskLevel: 'write',
		description:
			'Subscribe contacts to marketing audiences. The answer carries one result per subscriber, and a partial failure is reported there',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof suitedashEndpointsNested
>;

export type BaseSuitedashPlugin<T extends SuitedashPluginOptions> =
	CorsairPlugin<
		'suitedash',
		typeof SuitedashSchema,
		typeof suitedashEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof suitedashAuthConfig
	>;

export type InternalSuitedashPlugin =
	BaseSuitedashPlugin<SuitedashPluginOptions>;

export type ExternalSuitedashPlugin<T extends SuitedashPluginOptions> =
	BaseSuitedashPlugin<T>;

export function suitedash<const T extends SuitedashPluginOptions>(
	incomingOptions: SuitedashPluginOptions & T = {} as SuitedashPluginOptions &
		T,
): ExternalSuitedashPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'suitedash',
		authConfig: suitedashAuthConfig,
		schema: SuitedashSchema,
		options: options,
		hooks: options.hooks,
		endpoints: suitedashEndpointsNested,
		webhooks: {},
		endpointMeta: suitedashEndpointMeta,
		endpointSchemas: suitedashEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SuitedashKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('suitedash', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSuitedashPlugin;
}

export { SuitedashAPIError } from './client';

export type {
	CompaniesCreateInput,
	CompaniesListInput,
	ContactsCreateInput,
	MarketingSubscribeInput,
	MarketingSubscribeResponse,
	ProjectsGetInput,
	SuitedashAddress,
	SuitedashCompany,
	SuitedashContact,
	SuitedashEndpointInputs,
	SuitedashEndpointOutputs,
	SuitedashMetaAttribute,
	SuitedashPagination,
	SuitedashProject,
	SuitedashWorld,
} from './endpoints/types';
