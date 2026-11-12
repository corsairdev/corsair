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
import * as Api from './endpoints';
import type {
	UnisenderEndpointInputs,
	UnisenderEndpointOutputs,
} from './endpoints/types';
import {
	UnisenderEndpointInputSchemas,
	UnisenderEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { UnisenderSchema } from './schema';

export type UnisenderPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalUnisenderPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof unisenderEndpointsNested>;
};

export type UnisenderContext = CorsairPluginContext<
	typeof UnisenderSchema,
	UnisenderPluginOptions
>;

export type UnisenderKeyBuilderContext =
	KeyBuilderContext<UnisenderPluginOptions>;

export type UnisenderBoundEndpoints = BindEndpoints<
	typeof unisenderEndpointsNested
>;

type UnisenderEndpoint<K extends keyof UnisenderEndpointOutputs> =
	CorsairEndpoint<
		UnisenderContext,
		UnisenderEndpointInputs[K],
		UnisenderEndpointOutputs[K]
	>;

export type UnisenderEndpoints = {
	listsList: UnisenderEndpoint<'listsList'>;
	listsCreate: UnisenderEndpoint<'listsCreate'>;
	listsDelete: UnisenderEndpoint<'listsDelete'>;
	contactsGet: UnisenderEndpoint<'contactsGet'>;
	contactsSubscribe: UnisenderEndpoint<'contactsSubscribe'>;
	contactsUnsubscribe: UnisenderEndpoint<'contactsUnsubscribe'>;
	contactsExclude: UnisenderEndpoint<'contactsExclude'>;
	contactsImport: UnisenderEndpoint<'contactsImport'>;
	contactsCount: UnisenderEndpoint<'contactsCount'>;
	contactsExport: UnisenderEndpoint<'contactsExport'>;
	fieldsList: UnisenderEndpoint<'fieldsList'>;
	fieldsCreate: UnisenderEndpoint<'fieldsCreate'>;
	fieldsDelete: UnisenderEndpoint<'fieldsDelete'>;
	tagsList: UnisenderEndpoint<'tagsList'>;
	messagesSendEmail: UnisenderEndpoint<'messagesSendEmail'>;
	messagesStatus: UnisenderEndpoint<'messagesStatus'>;
	messagesCreateEmail: UnisenderEndpoint<'messagesCreateEmail'>;
	campaignsCreate: UnisenderEndpoint<'campaignsCreate'>;
	campaignsList: UnisenderEndpoint<'campaignsList'>;
};

const unisenderEndpointsNested = {
	lists: {
		list: Api.list,
		create: Api.create,
		delete: Api.remove,
	},
	contacts: {
		get: Api.get,
		subscribe: Api.subscribe,
		unsubscribe: Api.unsubscribe,
		exclude: Api.exclude,
		import: Api.importContacts,
		count: Api.count,
		export: Api.exportContacts,
	},
	fields: {
		list: Api.fields,
		create: Api.createField,
		delete: Api.deleteField,
	},
	tags: {
		list: Api.tags,
	},
	messages: {
		sendEmail: Api.sendEmail,
		status: Api.status,
		createEmail: Api.createEmail,
	},
	campaigns: {
		create: Api.campaign,
		list: Api.campaigns,
	},
} as const;

export const unisenderEndpointSchemas = {
	'lists.list': {
		input: UnisenderEndpointInputSchemas.listsList,
		output: UnisenderEndpointOutputSchemas.listsList,
	},
	'lists.create': {
		input: UnisenderEndpointInputSchemas.listsCreate,
		output: UnisenderEndpointOutputSchemas.listsCreate,
	},
	'lists.delete': {
		input: UnisenderEndpointInputSchemas.listsDelete,
		output: UnisenderEndpointOutputSchemas.listsDelete,
	},
	'contacts.get': {
		input: UnisenderEndpointInputSchemas.contactsGet,
		output: UnisenderEndpointOutputSchemas.contactsGet,
	},
	'contacts.subscribe': {
		input: UnisenderEndpointInputSchemas.contactsSubscribe,
		output: UnisenderEndpointOutputSchemas.contactsSubscribe,
	},
	'contacts.unsubscribe': {
		input: UnisenderEndpointInputSchemas.contactsUnsubscribe,
		output: UnisenderEndpointOutputSchemas.contactsUnsubscribe,
	},
	'contacts.exclude': {
		input: UnisenderEndpointInputSchemas.contactsExclude,
		output: UnisenderEndpointOutputSchemas.contactsExclude,
	},
	'contacts.import': {
		input: UnisenderEndpointInputSchemas.contactsImport,
		output: UnisenderEndpointOutputSchemas.contactsImport,
	},
	'contacts.count': {
		input: UnisenderEndpointInputSchemas.contactsCount,
		output: UnisenderEndpointOutputSchemas.contactsCount,
	},
	'contacts.export': {
		input: UnisenderEndpointInputSchemas.contactsExport,
		output: UnisenderEndpointOutputSchemas.contactsExport,
	},
	'fields.list': {
		input: UnisenderEndpointInputSchemas.fieldsList,
		output: UnisenderEndpointOutputSchemas.fieldsList,
	},
	'fields.create': {
		input: UnisenderEndpointInputSchemas.fieldsCreate,
		output: UnisenderEndpointOutputSchemas.fieldsCreate,
	},
	'fields.delete': {
		input: UnisenderEndpointInputSchemas.fieldsDelete,
		output: UnisenderEndpointOutputSchemas.fieldsDelete,
	},
	'tags.list': {
		input: UnisenderEndpointInputSchemas.tagsList,
		output: UnisenderEndpointOutputSchemas.tagsList,
	},
	'messages.sendEmail': {
		input: UnisenderEndpointInputSchemas.messagesSendEmail,
		output: UnisenderEndpointOutputSchemas.messagesSendEmail,
	},
	'messages.status': {
		input: UnisenderEndpointInputSchemas.messagesStatus,
		output: UnisenderEndpointOutputSchemas.messagesStatus,
	},
	'messages.createEmail': {
		input: UnisenderEndpointInputSchemas.messagesCreateEmail,
		output: UnisenderEndpointOutputSchemas.messagesCreateEmail,
	},
	'campaigns.create': {
		input: UnisenderEndpointInputSchemas.campaignsCreate,
		output: UnisenderEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.list': {
		input: UnisenderEndpointInputSchemas.campaignsList,
		output: UnisenderEndpointOutputSchemas.campaignsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof unisenderEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const unisenderEndpointMeta = {
	'lists.list': {
		riskLevel: 'read',
		description:
			'List the contact lists in the account, with their ids and titles',
	},
	'lists.create': {
		riskLevel: 'write',
		description:
			'Create a contact list, which models a topic rather than a single send; the title must be unique',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact list by id',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			"Read one contact's address status, lists and custom fields by email",
	},
	'contacts.subscribe': {
		riskLevel: 'write',
		description:
			'Add or update a contact in one or more lists. By default (double_optin 0) Unisender emails the contact a confirmation request; pass double_optin 3 to add them with no email',
	},
	'contacts.unsubscribe': {
		riskLevel: 'write',
		description:
			'Unsubscribe a contact from lists, which only the contact can reverse through an activation link',
	},
	'contacts.exclude': {
		riskLevel: 'write',
		description:
			'Remove a contact from lists without marking them unsubscribed, so they can be re-added later',
	},
	'contacts.import': {
		// The documented `delete` column marks contacts for removal, so an import can
		// destroy data on a call a `cautious` caller would otherwise let through as a
		// write. Destructive, and not reversible by another import.
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Import up to 500 contacts from columnar data, with list membership in an email_list_ids column; role addresses such as sales@ are skipped on purpose, and a `delete` column removes contacts',
	},
	'contacts.count': {
		riskLevel: 'read',
		description:
			'Count the contacts in a list by kind (type address for email contacts, phone for SMS) or by tag; Unisender needs at least one of the two',
	},
	'contacts.export': {
		riskLevel: 'write',
		description:
			'Request an asynchronous export of the contact data, delivered to a notify URL',
	},
	'fields.list': {
		riskLevel: 'read',
		description: 'List the custom contact fields with their types',
	},
	'fields.create': {
		riskLevel: 'write',
		description: 'Create a custom contact field',
	},
	'fields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom contact field by id',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List the contact tags with their ids',
	},
	'messages.sendEmail': {
		riskLevel: 'write',
		description:
			'Send one transactional email to a single recipient, who is added to list_id if not already in it; capped at 60 calls a minute and with no field substitution beyond the unsubscribe URL',
	},
	'messages.status': {
		riskLevel: 'read',
		description:
			'Read delivery status for up to 500 sent emails; err_ is a failure and ok_ a success or still in progress',
	},
	'messages.createEmail': {
		riskLevel: 'write',
		description:
			'Create a campaign email without sending it, for campaigns.create to send',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Start or schedule a campaign from a message; omitting start_time sends it immediately',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'List campaigns whose start time falls in a window, up to 10,000 a page',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof unisenderEndpointsNested
>;

export type BaseUnisenderPlugin<T extends UnisenderPluginOptions> =
	CorsairPlugin<
		'unisender',
		typeof UnisenderSchema,
		typeof unisenderEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalUnisenderPlugin =
	BaseUnisenderPlugin<UnisenderPluginOptions>;

export type ExternalUnisenderPlugin<T extends UnisenderPluginOptions> =
	BaseUnisenderPlugin<T>;

export function unisender<const T extends UnisenderPluginOptions>(
	incomingOptions: UnisenderPluginOptions & T = {} as UnisenderPluginOptions &
		T,
): ExternalUnisenderPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'unisender',
		schema: UnisenderSchema,
		options: options,
		hooks: options.hooks,
		endpoints: unisenderEndpointsNested,
		webhooks: {},
		endpointMeta: unisenderEndpointMeta,
		endpointSchemas: unisenderEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: UnisenderKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('unisender', ctx.authType ?? 'api_key');
		},
	} satisfies InternalUnisenderPlugin;
}

export { UnisenderAPIError } from './client';

export type {
	CampaignsCreateInput,
	CampaignsCreateResponse,
	CampaignsListInput,
	CampaignsListResponse,
	ContactsCountInput,
	ContactsCountResponse,
	ContactsExcludeInput,
	ContactsExcludeResponse,
	ContactsExportInput,
	ContactsExportResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsImportInput,
	ContactsImportResponse,
	ContactsSubscribeInput,
	ContactsSubscribeResponse,
	ContactsUnsubscribeInput,
	ContactsUnsubscribeResponse,
	FieldsCreateInput,
	FieldsCreateResponse,
	FieldsDeleteInput,
	FieldsDeleteResponse,
	FieldsListResponse,
	ListsCreateInput,
	ListsCreateResponse,
	ListsDeleteInput,
	ListsDeleteResponse,
	ListsListResponse,
	MessagesCreateEmailInput,
	MessagesCreateEmailResponse,
	MessagesSendEmailInput,
	MessagesSendEmailResponse,
	MessagesStatusInput,
	MessagesStatusResponse,
	TagsListResponse,
	UnisenderCampaign,
	UnisenderEndpointInputs,
	UnisenderEndpointOutputs,
	UnisenderField,
	UnisenderList,
	UnisenderTag,
} from './endpoints/types';
