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
import {
	Automations,
	Campaigns,
	Contacts,
	Fields,
	Lists,
	Tags,
} from './endpoints';
import type {
	EmailOctopusEndpointInputs,
	EmailOctopusEndpointOutputs,
} from './endpoints/types';
import {
	EmailOctopusEndpointInputSchemas,
	EmailOctopusEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { EmailOctopusSchema } from './schema';

export type EmailOctopusPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEmailOctopusPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof emailOctopusEndpointsNested>;
};

export type EmailOctopusContext = CorsairPluginContext<
	typeof EmailOctopusSchema,
	EmailOctopusPluginOptions
>;

export type EmailOctopusKeyBuilderContext =
	KeyBuilderContext<EmailOctopusPluginOptions>;

export type EmailOctopusBoundEndpoints = BindEndpoints<
	typeof emailOctopusEndpointsNested
>;

type EmailOctopusEndpoint<K extends keyof EmailOctopusEndpointOutputs> =
	CorsairEndpoint<
		EmailOctopusContext,
		EmailOctopusEndpointInputs[K],
		EmailOctopusEndpointOutputs[K]
	>;

export type EmailOctopusEndpoints = {
	listsList: EmailOctopusEndpoint<'listsList'>;
	listsGet: EmailOctopusEndpoint<'listsGet'>;
	listsCreate: EmailOctopusEndpoint<'listsCreate'>;
	listsUpdate: EmailOctopusEndpoint<'listsUpdate'>;
	listsDelete: EmailOctopusEndpoint<'listsDelete'>;
	contactsList: EmailOctopusEndpoint<'contactsList'>;
	contactsGet: EmailOctopusEndpoint<'contactsGet'>;
	contactsCreate: EmailOctopusEndpoint<'contactsCreate'>;
	contactsUpsert: EmailOctopusEndpoint<'contactsUpsert'>;
	contactsUpdate: EmailOctopusEndpoint<'contactsUpdate'>;
	contactsDelete: EmailOctopusEndpoint<'contactsDelete'>;
	contactsBatch: EmailOctopusEndpoint<'contactsBatch'>;
	fieldsCreate: EmailOctopusEndpoint<'fieldsCreate'>;
	fieldsUpdate: EmailOctopusEndpoint<'fieldsUpdate'>;
	fieldsDelete: EmailOctopusEndpoint<'fieldsDelete'>;
	tagsList: EmailOctopusEndpoint<'tagsList'>;
	tagsCreate: EmailOctopusEndpoint<'tagsCreate'>;
	tagsUpdate: EmailOctopusEndpoint<'tagsUpdate'>;
	tagsDelete: EmailOctopusEndpoint<'tagsDelete'>;
	campaignsList: EmailOctopusEndpoint<'campaignsList'>;
	campaignsGet: EmailOctopusEndpoint<'campaignsGet'>;
	campaignsReportContacts: EmailOctopusEndpoint<'campaignsReportContacts'>;
	campaignsReportLinks: EmailOctopusEndpoint<'campaignsReportLinks'>;
	campaignsReportSummary: EmailOctopusEndpoint<'campaignsReportSummary'>;
	automationsStart: EmailOctopusEndpoint<'automationsStart'>;
};

const emailOctopusEndpointsNested = {
	lists: {
		list: Lists.list,
		get: Lists.get,
		create: Lists.create,
		update: Lists.update,
		delete: Lists.remove,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		upsert: Contacts.upsert,
		update: Contacts.update,
		delete: Contacts.remove,
		batch: Contacts.batch,
	},
	fields: {
		create: Fields.create,
		update: Fields.update,
		delete: Fields.remove,
	},
	tags: {
		list: Tags.list,
		create: Tags.create,
		update: Tags.update,
		delete: Tags.remove,
	},
	campaigns: {
		list: Campaigns.list,
		get: Campaigns.get,
		reportContacts: Campaigns.reportContacts,
		reportLinks: Campaigns.reportLinks,
		reportSummary: Campaigns.reportSummary,
	},
	automations: {
		start: Automations.start,
	},
} as const;

export const emailOctopusEndpointSchemas = {
	'lists.list': {
		input: EmailOctopusEndpointInputSchemas.listsList,
		output: EmailOctopusEndpointOutputSchemas.listsList,
	},
	'lists.get': {
		input: EmailOctopusEndpointInputSchemas.listsGet,
		output: EmailOctopusEndpointOutputSchemas.listsGet,
	},
	'lists.create': {
		input: EmailOctopusEndpointInputSchemas.listsCreate,
		output: EmailOctopusEndpointOutputSchemas.listsCreate,
	},
	'lists.update': {
		input: EmailOctopusEndpointInputSchemas.listsUpdate,
		output: EmailOctopusEndpointOutputSchemas.listsUpdate,
	},
	'lists.delete': {
		input: EmailOctopusEndpointInputSchemas.listsDelete,
		output: EmailOctopusEndpointOutputSchemas.listsDelete,
	},
	'contacts.list': {
		input: EmailOctopusEndpointInputSchemas.contactsList,
		output: EmailOctopusEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: EmailOctopusEndpointInputSchemas.contactsGet,
		output: EmailOctopusEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: EmailOctopusEndpointInputSchemas.contactsCreate,
		output: EmailOctopusEndpointOutputSchemas.contactsCreate,
	},
	'contacts.upsert': {
		input: EmailOctopusEndpointInputSchemas.contactsUpsert,
		output: EmailOctopusEndpointOutputSchemas.contactsUpsert,
	},
	'contacts.update': {
		input: EmailOctopusEndpointInputSchemas.contactsUpdate,
		output: EmailOctopusEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: EmailOctopusEndpointInputSchemas.contactsDelete,
		output: EmailOctopusEndpointOutputSchemas.contactsDelete,
	},
	'contacts.batch': {
		input: EmailOctopusEndpointInputSchemas.contactsBatch,
		output: EmailOctopusEndpointOutputSchemas.contactsBatch,
	},
	'fields.create': {
		input: EmailOctopusEndpointInputSchemas.fieldsCreate,
		output: EmailOctopusEndpointOutputSchemas.fieldsCreate,
	},
	'fields.update': {
		input: EmailOctopusEndpointInputSchemas.fieldsUpdate,
		output: EmailOctopusEndpointOutputSchemas.fieldsUpdate,
	},
	'fields.delete': {
		input: EmailOctopusEndpointInputSchemas.fieldsDelete,
		output: EmailOctopusEndpointOutputSchemas.fieldsDelete,
	},
	'tags.list': {
		input: EmailOctopusEndpointInputSchemas.tagsList,
		output: EmailOctopusEndpointOutputSchemas.tagsList,
	},
	'tags.create': {
		input: EmailOctopusEndpointInputSchemas.tagsCreate,
		output: EmailOctopusEndpointOutputSchemas.tagsCreate,
	},
	'tags.update': {
		input: EmailOctopusEndpointInputSchemas.tagsUpdate,
		output: EmailOctopusEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: EmailOctopusEndpointInputSchemas.tagsDelete,
		output: EmailOctopusEndpointOutputSchemas.tagsDelete,
	},
	'campaigns.list': {
		input: EmailOctopusEndpointInputSchemas.campaignsList,
		output: EmailOctopusEndpointOutputSchemas.campaignsList,
	},
	'campaigns.get': {
		input: EmailOctopusEndpointInputSchemas.campaignsGet,
		output: EmailOctopusEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.reportContacts': {
		input: EmailOctopusEndpointInputSchemas.campaignsReportContacts,
		output: EmailOctopusEndpointOutputSchemas.campaignsReportContacts,
	},
	'campaigns.reportLinks': {
		input: EmailOctopusEndpointInputSchemas.campaignsReportLinks,
		output: EmailOctopusEndpointOutputSchemas.campaignsReportLinks,
	},
	'campaigns.reportSummary': {
		input: EmailOctopusEndpointInputSchemas.campaignsReportSummary,
		output: EmailOctopusEndpointOutputSchemas.campaignsReportSummary,
	},
	'automations.start': {
		input: EmailOctopusEndpointInputSchemas.automationsStart,
		output: EmailOctopusEndpointOutputSchemas.automationsStart,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof emailOctopusEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const emailOctopusEndpointMeta = {
	'lists.list': {
		riskLevel: 'read',
		description: 'List every list in the account, one page at a time',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Get one list, including its fields, tags and contact counts',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a list',
	},
	'lists.update': {
		riskLevel: 'write',
		description: 'Rename a list',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a list and its contacts',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts on a list, optionally filtered by status, tag or time, with cursor paging',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get one contact on a list',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Add a contact to a list. Fails if that email is already on it',
	},
	'contacts.upsert': {
		riskLevel: 'write',
		description:
			'Create a contact or update the existing one with the same email address',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact by id',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a contact from a list',
	},
	'contacts.batch': {
		riskLevel: 'write',
		description:
			'Update many contacts on a list. Each entry is reported under success or errors',
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Add a custom field to a list',
	},
	'fields.update': {
		riskLevel: 'write',
		description: 'Update a text, number or date field on a list',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a custom field from a list',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List the tags on a list',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a tag on a list',
	},
	'tags.update': {
		riskLevel: 'write',
		description:
			'Rename a tag. The current name is the URL; the new name is the body',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a tag from a list',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List campaigns, one page at a time',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Get one campaign, including its subject and HTML content',
	},
	'campaigns.reportContacts': {
		riskLevel: 'read',
		description:
			'List contacts for one campaign event, such as opened or bounced',
	},
	'campaigns.reportLinks': {
		riskLevel: 'read',
		description: 'Get click totals for each link in a campaign',
	},
	'campaigns.reportSummary': {
		riskLevel: 'read',
		description:
			'Get sent, bounce, open, click, complaint and unsubscribe totals',
	},
	'automations.start': {
		riskLevel: 'write',
		description: 'Queue a contact into an automation',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof emailOctopusEndpointsNested
>;

export type BaseEmailOctopusPlugin<T extends EmailOctopusPluginOptions> =
	CorsairPlugin<
		'emailoctopus',
		typeof EmailOctopusSchema,
		typeof emailOctopusEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalEmailOctopusPlugin =
	BaseEmailOctopusPlugin<EmailOctopusPluginOptions>;

export type ExternalEmailOctopusPlugin<T extends EmailOctopusPluginOptions> =
	BaseEmailOctopusPlugin<T>;

export function emailoctopus<const T extends EmailOctopusPluginOptions>(
	incomingOptions: EmailOctopusPluginOptions &
		T = {} as EmailOctopusPluginOptions & T,
): ExternalEmailOctopusPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'emailoctopus',
		schema: EmailOctopusSchema,
		options: options,
		hooks: options.hooks,
		endpoints: emailOctopusEndpointsNested,
		webhooks: {},
		endpointMeta: emailOctopusEndpointMeta,
		endpointSchemas: emailOctopusEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: EmailOctopusKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('emailoctopus', ctx.authType ?? 'api_key');
		},
	} satisfies InternalEmailOctopusPlugin;
}

export { EmailOctopusAPIError } from './client';
