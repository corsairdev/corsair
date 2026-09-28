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
import {
	Account,
	ContactFields,
	ContactLists,
	Contacts,
	EmailTemplates,
	Inboxes,
	Messages,
	Projects,
	SendingDomains,
	Stats,
	Suppressions,
} from './endpoints';
import type {
	MailtrapEndpointInputs,
	MailtrapEndpointOutputs,
} from './endpoints/types';
import {
	MailtrapEndpointInputSchemas,
	MailtrapEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MailtrapSchema } from './schema';
import { resolveMailtrapOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchMailtrapTenantWebhook } from './webhooks/tenant-matcher';

export type MailtrapPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The Mailtrap account the token should act against.
	 *
	 * A Personal Access Token can reach several accounts, so the account is a
	 * second credential rather than something the token implies — and, unlike
	 * Harvest/Botpress's header-scoped second credential, it is path-scoped
	 * (`/api/accounts/{accountId}/...`). When omitted the plugin falls back to
	 * the stored `account_id` key, and finally to account discovery, which
	 * only resolves when the token can reach exactly one account.
	 */
	accountId?: string;
	hooks?: InternalMailtrapPlugin['hooks'];
	webhookHooks?: InternalMailtrapPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mailtrapEndpointsNested>;
};

export const mailtrapAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type MailtrapContext = CorsairPluginContext<
	typeof MailtrapSchema,
	MailtrapPluginOptions,
	undefined,
	typeof mailtrapAuthConfig
>;

export type MailtrapKeyBuilderContext =
	KeyBuilderContext<MailtrapPluginOptions>;

export type MailtrapBoundEndpoints = BindEndpoints<
	typeof mailtrapEndpointsNested
>;

type MailtrapEndpoint<K extends keyof MailtrapEndpointOutputs> =
	CorsairEndpoint<
		MailtrapContext,
		MailtrapEndpointInputs[K],
		MailtrapEndpointOutputs[K]
	>;

export type MailtrapEndpoints = {
	accountListAccounts: MailtrapEndpoint<'accountListAccounts'>;
	accountGetPermissionResources: MailtrapEndpoint<'accountGetPermissionResources'>;
	accountGetBillingUsage: MailtrapEndpoint<'accountGetBillingUsage'>;
	contactsCreate: MailtrapEndpoint<'contactsCreate'>;
	contactsGet: MailtrapEndpoint<'contactsGet'>;
	contactsUpdate: MailtrapEndpoint<'contactsUpdate'>;
	contactsDelete: MailtrapEndpoint<'contactsDelete'>;
	contactsCreateEvent: MailtrapEndpoint<'contactsCreateEvent'>;
	contactsCreateExport: MailtrapEndpoint<'contactsCreateExport'>;
	contactsGetExport: MailtrapEndpoint<'contactsGetExport'>;
	contactsImport: MailtrapEndpoint<'contactsImport'>;
	contactsGetImport: MailtrapEndpoint<'contactsGetImport'>;
	contactListsList: MailtrapEndpoint<'contactListsList'>;
	contactListsCreate: MailtrapEndpoint<'contactListsCreate'>;
	contactListsGet: MailtrapEndpoint<'contactListsGet'>;
	contactListsUpdate: MailtrapEndpoint<'contactListsUpdate'>;
	contactListsDelete: MailtrapEndpoint<'contactListsDelete'>;
	contactFieldsList: MailtrapEndpoint<'contactFieldsList'>;
	contactFieldsCreate: MailtrapEndpoint<'contactFieldsCreate'>;
	contactFieldsGet: MailtrapEndpoint<'contactFieldsGet'>;
	contactFieldsUpdate: MailtrapEndpoint<'contactFieldsUpdate'>;
	contactFieldsDelete: MailtrapEndpoint<'contactFieldsDelete'>;
	suppressionsList: MailtrapEndpoint<'suppressionsList'>;
	emailTemplatesList: MailtrapEndpoint<'emailTemplatesList'>;
	emailTemplatesCreate: MailtrapEndpoint<'emailTemplatesCreate'>;
	emailTemplatesGet: MailtrapEndpoint<'emailTemplatesGet'>;
	emailTemplatesUpdate: MailtrapEndpoint<'emailTemplatesUpdate'>;
	emailTemplatesDelete: MailtrapEndpoint<'emailTemplatesDelete'>;
	sendingDomainsList: MailtrapEndpoint<'sendingDomainsList'>;
	sendingDomainsCreate: MailtrapEndpoint<'sendingDomainsCreate'>;
	sendingDomainsGet: MailtrapEndpoint<'sendingDomainsGet'>;
	sendingDomainsDelete: MailtrapEndpoint<'sendingDomainsDelete'>;
	statsGet: MailtrapEndpoint<'statsGet'>;
	statsByDate: MailtrapEndpoint<'statsByDate'>;
	statsByDomains: MailtrapEndpoint<'statsByDomains'>;
	statsByCategories: MailtrapEndpoint<'statsByCategories'>;
	statsByEsp: MailtrapEndpoint<'statsByEsp'>;
	projectsList: MailtrapEndpoint<'projectsList'>;
	projectsGet: MailtrapEndpoint<'projectsGet'>;
	projectsUpdate: MailtrapEndpoint<'projectsUpdate'>;
	projectsDelete: MailtrapEndpoint<'projectsDelete'>;
	inboxesList: MailtrapEndpoint<'inboxesList'>;
	inboxesGet: MailtrapEndpoint<'inboxesGet'>;
	inboxesUpdate: MailtrapEndpoint<'inboxesUpdate'>;
	inboxesClean: MailtrapEndpoint<'inboxesClean'>;
	inboxesMarkAsRead: MailtrapEndpoint<'inboxesMarkAsRead'>;
	inboxesResetCredentials: MailtrapEndpoint<'inboxesResetCredentials'>;
	messagesList: MailtrapEndpoint<'messagesList'>;
	messagesGetHtml: MailtrapEndpoint<'messagesGetHtml'>;
};

export type MailtrapWebhooks = Record<string, never>;

export type MailtrapBoundWebhooks = BindWebhooks<MailtrapWebhooks>;

const mailtrapEndpointsNested = {
	account: {
		listAccounts: Account.listAccounts,
		getPermissionResources: Account.getPermissionResources,
		getBillingUsage: Account.getBillingUsage,
	},
	contacts: {
		create: Contacts.create,
		get: Contacts.get,
		update: Contacts.update,
		delete: Contacts.delete,
		createEvent: Contacts.createEvent,
		createExport: Contacts.createExport,
		getExport: Contacts.getExport,
		import: Contacts.import,
		getImport: Contacts.getImport,
	},
	contactLists: {
		list: ContactLists.list,
		create: ContactLists.create,
		get: ContactLists.get,
		update: ContactLists.update,
		delete: ContactLists.delete,
	},
	contactFields: {
		list: ContactFields.list,
		create: ContactFields.create,
		get: ContactFields.get,
		update: ContactFields.update,
		delete: ContactFields.delete,
	},
	suppressions: {
		list: Suppressions.list,
	},
	emailTemplates: {
		list: EmailTemplates.list,
		create: EmailTemplates.create,
		get: EmailTemplates.get,
		update: EmailTemplates.update,
		delete: EmailTemplates.delete,
	},
	sendingDomains: {
		list: SendingDomains.list,
		create: SendingDomains.create,
		get: SendingDomains.get,
		delete: SendingDomains.delete,
	},
	stats: {
		get: Stats.get,
		byDate: Stats.byDate,
		byDomains: Stats.byDomains,
		byCategories: Stats.byCategories,
		byEsp: Stats.byEsp,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		update: Projects.update,
		delete: Projects.delete,
	},
	inboxes: {
		list: Inboxes.list,
		get: Inboxes.get,
		update: Inboxes.update,
		clean: Inboxes.clean,
		markAsRead: Inboxes.markAsRead,
		resetCredentials: Inboxes.resetCredentials,
	},
	messages: {
		list: Messages.list,
		getHtml: Messages.getHtml,
	},
} as const;

/**
 * The OSS catalog for this integration lists zero triggers/webhooks. The SDK
 * exports a full `WebhooksApi`, but none of its operations are in this
 * catalog (see `MAILTRAP-PLAN.md`), so no webhook handlers are registered.
 */
const mailtrapWebhooksNested = {} as const;

export const mailtrapEndpointSchemas = {
	'account.listAccounts': {
		input: MailtrapEndpointInputSchemas.accountListAccounts,
		output: MailtrapEndpointOutputSchemas.accountListAccounts,
	},
	'account.getPermissionResources': {
		input: MailtrapEndpointInputSchemas.accountGetPermissionResources,
		output: MailtrapEndpointOutputSchemas.accountGetPermissionResources,
	},
	'account.getBillingUsage': {
		input: MailtrapEndpointInputSchemas.accountGetBillingUsage,
		output: MailtrapEndpointOutputSchemas.accountGetBillingUsage,
	},
	'contacts.create': {
		input: MailtrapEndpointInputSchemas.contactsCreate,
		output: MailtrapEndpointOutputSchemas.contactsCreate,
	},
	'contacts.get': {
		input: MailtrapEndpointInputSchemas.contactsGet,
		output: MailtrapEndpointOutputSchemas.contactsGet,
	},
	'contacts.update': {
		input: MailtrapEndpointInputSchemas.contactsUpdate,
		output: MailtrapEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: MailtrapEndpointInputSchemas.contactsDelete,
		output: MailtrapEndpointOutputSchemas.contactsDelete,
	},
	'contacts.createEvent': {
		input: MailtrapEndpointInputSchemas.contactsCreateEvent,
		output: MailtrapEndpointOutputSchemas.contactsCreateEvent,
	},
	'contacts.createExport': {
		input: MailtrapEndpointInputSchemas.contactsCreateExport,
		output: MailtrapEndpointOutputSchemas.contactsCreateExport,
	},
	'contacts.getExport': {
		input: MailtrapEndpointInputSchemas.contactsGetExport,
		output: MailtrapEndpointOutputSchemas.contactsGetExport,
	},
	'contacts.import': {
		input: MailtrapEndpointInputSchemas.contactsImport,
		output: MailtrapEndpointOutputSchemas.contactsImport,
	},
	'contacts.getImport': {
		input: MailtrapEndpointInputSchemas.contactsGetImport,
		output: MailtrapEndpointOutputSchemas.contactsGetImport,
	},
	'contactLists.list': {
		input: MailtrapEndpointInputSchemas.contactListsList,
		output: MailtrapEndpointOutputSchemas.contactListsList,
	},
	'contactLists.create': {
		input: MailtrapEndpointInputSchemas.contactListsCreate,
		output: MailtrapEndpointOutputSchemas.contactListsCreate,
	},
	'contactLists.get': {
		input: MailtrapEndpointInputSchemas.contactListsGet,
		output: MailtrapEndpointOutputSchemas.contactListsGet,
	},
	'contactLists.update': {
		input: MailtrapEndpointInputSchemas.contactListsUpdate,
		output: MailtrapEndpointOutputSchemas.contactListsUpdate,
	},
	'contactLists.delete': {
		input: MailtrapEndpointInputSchemas.contactListsDelete,
		output: MailtrapEndpointOutputSchemas.contactListsDelete,
	},
	'contactFields.list': {
		input: MailtrapEndpointInputSchemas.contactFieldsList,
		output: MailtrapEndpointOutputSchemas.contactFieldsList,
	},
	'contactFields.create': {
		input: MailtrapEndpointInputSchemas.contactFieldsCreate,
		output: MailtrapEndpointOutputSchemas.contactFieldsCreate,
	},
	'contactFields.get': {
		input: MailtrapEndpointInputSchemas.contactFieldsGet,
		output: MailtrapEndpointOutputSchemas.contactFieldsGet,
	},
	'contactFields.update': {
		input: MailtrapEndpointInputSchemas.contactFieldsUpdate,
		output: MailtrapEndpointOutputSchemas.contactFieldsUpdate,
	},
	'contactFields.delete': {
		input: MailtrapEndpointInputSchemas.contactFieldsDelete,
		output: MailtrapEndpointOutputSchemas.contactFieldsDelete,
	},
	'suppressions.list': {
		input: MailtrapEndpointInputSchemas.suppressionsList,
		output: MailtrapEndpointOutputSchemas.suppressionsList,
	},
	'emailTemplates.list': {
		input: MailtrapEndpointInputSchemas.emailTemplatesList,
		output: MailtrapEndpointOutputSchemas.emailTemplatesList,
	},
	'emailTemplates.create': {
		input: MailtrapEndpointInputSchemas.emailTemplatesCreate,
		output: MailtrapEndpointOutputSchemas.emailTemplatesCreate,
	},
	'emailTemplates.get': {
		input: MailtrapEndpointInputSchemas.emailTemplatesGet,
		output: MailtrapEndpointOutputSchemas.emailTemplatesGet,
	},
	'emailTemplates.update': {
		input: MailtrapEndpointInputSchemas.emailTemplatesUpdate,
		output: MailtrapEndpointOutputSchemas.emailTemplatesUpdate,
	},
	'emailTemplates.delete': {
		input: MailtrapEndpointInputSchemas.emailTemplatesDelete,
		output: MailtrapEndpointOutputSchemas.emailTemplatesDelete,
	},
	'sendingDomains.list': {
		input: MailtrapEndpointInputSchemas.sendingDomainsList,
		output: MailtrapEndpointOutputSchemas.sendingDomainsList,
	},
	'sendingDomains.create': {
		input: MailtrapEndpointInputSchemas.sendingDomainsCreate,
		output: MailtrapEndpointOutputSchemas.sendingDomainsCreate,
	},
	'sendingDomains.get': {
		input: MailtrapEndpointInputSchemas.sendingDomainsGet,
		output: MailtrapEndpointOutputSchemas.sendingDomainsGet,
	},
	'sendingDomains.delete': {
		input: MailtrapEndpointInputSchemas.sendingDomainsDelete,
		output: MailtrapEndpointOutputSchemas.sendingDomainsDelete,
	},
	'stats.get': {
		input: MailtrapEndpointInputSchemas.statsGet,
		output: MailtrapEndpointOutputSchemas.statsGet,
	},
	'stats.byDate': {
		input: MailtrapEndpointInputSchemas.statsByDate,
		output: MailtrapEndpointOutputSchemas.statsByDate,
	},
	'stats.byDomains': {
		input: MailtrapEndpointInputSchemas.statsByDomains,
		output: MailtrapEndpointOutputSchemas.statsByDomains,
	},
	'stats.byCategories': {
		input: MailtrapEndpointInputSchemas.statsByCategories,
		output: MailtrapEndpointOutputSchemas.statsByCategories,
	},
	'stats.byEsp': {
		input: MailtrapEndpointInputSchemas.statsByEsp,
		output: MailtrapEndpointOutputSchemas.statsByEsp,
	},
	'projects.list': {
		input: MailtrapEndpointInputSchemas.projectsList,
		output: MailtrapEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: MailtrapEndpointInputSchemas.projectsGet,
		output: MailtrapEndpointOutputSchemas.projectsGet,
	},
	'projects.update': {
		input: MailtrapEndpointInputSchemas.projectsUpdate,
		output: MailtrapEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: MailtrapEndpointInputSchemas.projectsDelete,
		output: MailtrapEndpointOutputSchemas.projectsDelete,
	},
	'inboxes.list': {
		input: MailtrapEndpointInputSchemas.inboxesList,
		output: MailtrapEndpointOutputSchemas.inboxesList,
	},
	'inboxes.get': {
		input: MailtrapEndpointInputSchemas.inboxesGet,
		output: MailtrapEndpointOutputSchemas.inboxesGet,
	},
	'inboxes.update': {
		input: MailtrapEndpointInputSchemas.inboxesUpdate,
		output: MailtrapEndpointOutputSchemas.inboxesUpdate,
	},
	'inboxes.clean': {
		input: MailtrapEndpointInputSchemas.inboxesClean,
		output: MailtrapEndpointOutputSchemas.inboxesClean,
	},
	'inboxes.markAsRead': {
		input: MailtrapEndpointInputSchemas.inboxesMarkAsRead,
		output: MailtrapEndpointOutputSchemas.inboxesMarkAsRead,
	},
	'inboxes.resetCredentials': {
		input: MailtrapEndpointInputSchemas.inboxesResetCredentials,
		output: MailtrapEndpointOutputSchemas.inboxesResetCredentials,
	},
	'messages.list': {
		input: MailtrapEndpointInputSchemas.messagesList,
		output: MailtrapEndpointOutputSchemas.messagesList,
	},
	'messages.getHtml': {
		input: MailtrapEndpointInputSchemas.messagesGetHtml,
		output: MailtrapEndpointOutputSchemas.messagesGetHtml,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mailtrapEndpointsNested
>;

const mailtrapWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof mailtrapWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const mailtrapEndpointMeta = {
	'account.listAccounts': {
		riskLevel: 'read',
		description: 'List Mailtrap accounts the token can access',
	},
	'account.getPermissionResources': {
		riskLevel: 'read',
		description:
			'Get every resource (inboxes, projects, domains, billing, account) the token has admin access to, nested by hierarchy',
	},
	'account.getBillingUsage': {
		riskLevel: 'read',
		description:
			"Get billing usage against the account's testing/sending/marketing plan limits",
	},
	'contacts.create': { riskLevel: 'write', description: 'Create a contact' },
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a contact by id or email',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update a contact by id or email',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a contact',
	},
	'contacts.createEvent': {
		riskLevel: 'write',
		description: 'Record a custom event against a contact',
	},
	'contacts.createExport': {
		riskLevel: 'write',
		description: 'Start an async export of contacts matching a filter',
	},
	'contacts.getExport': {
		riskLevel: 'read',
		description: 'Get the status/download URL of a contact export job',
	},
	'contacts.import': {
		riskLevel: 'write',
		description: 'Bulk-import contacts, upserting by email',
	},
	'contacts.getImport': {
		riskLevel: 'read',
		description: 'Get the status of a contact import job',
	},
	'contactLists.list': {
		riskLevel: 'read',
		description: 'List contact lists',
	},
	'contactLists.create': {
		riskLevel: 'write',
		description: 'Create a contact list',
	},
	'contactLists.get': {
		riskLevel: 'read',
		description: 'Get a contact list by id',
	},
	'contactLists.update': {
		riskLevel: 'write',
		description: 'Rename a contact list',
	},
	'contactLists.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a contact list',
	},
	'contactFields.list': {
		riskLevel: 'read',
		description: 'List custom contact fields',
	},
	'contactFields.create': {
		riskLevel: 'write',
		description: 'Create a custom contact field',
	},
	'contactFields.get': {
		riskLevel: 'read',
		description: 'Get a custom contact field by id',
	},
	'contactFields.update': {
		riskLevel: 'write',
		description: 'Update a custom contact field',
	},
	'contactFields.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a custom contact field, dropping its stored values off every contact',
	},
	'suppressions.list': {
		riskLevel: 'read',
		description: 'List (and optionally search) suppressed email addresses',
	},
	'emailTemplates.list': {
		riskLevel: 'read',
		description: 'List email templates',
	},
	'emailTemplates.create': {
		riskLevel: 'write',
		description: 'Create an email template',
	},
	'emailTemplates.get': {
		riskLevel: 'read',
		description: 'Get an email template by id',
	},
	'emailTemplates.update': {
		riskLevel: 'write',
		description: 'Update an email template',
	},
	'emailTemplates.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete an email template',
	},
	'sendingDomains.list': {
		riskLevel: 'read',
		description: 'List sending domains',
	},
	'sendingDomains.create': {
		riskLevel: 'write',
		description: 'Register a sending domain for DNS verification',
	},
	'sendingDomains.get': {
		riskLevel: 'read',
		description: 'Get a sending domain by id, including its DNS records',
	},
	'sendingDomains.delete': {
		riskLevel: 'destructive',
		description: 'Permanently remove a sending domain',
	},
	'stats.get': {
		riskLevel: 'read',
		description: 'Get aggregated sending stats for a date range',
	},
	'stats.byDate': {
		riskLevel: 'read',
		description: 'Get sending stats broken down by day',
	},
	'stats.byDomains': {
		riskLevel: 'read',
		description: 'Get sending stats broken down by sending domain',
	},
	'stats.byCategories': {
		riskLevel: 'read',
		description: 'Get sending stats broken down by category',
	},
	'stats.byEsp': {
		riskLevel: 'read',
		description:
			'Get sending stats broken down by recipient email service provider',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects and their sandbox inboxes',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project and its inboxes by id',
	},
	'projects.update': { riskLevel: 'write', description: 'Rename a project' },
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a project and every inbox in it',
	},
	'inboxes.list': { riskLevel: 'read', description: 'List sandbox inboxes' },
	'inboxes.get': {
		riskLevel: 'read',
		description: "Get an inbox's attributes, including its SMTP credentials",
	},
	'inboxes.update': {
		riskLevel: 'write',
		description: "Update an inbox's name and/or email username",
	},
	'inboxes.clean': {
		riskLevel: 'destructive',
		description: 'Delete every message in a sandbox inbox',
	},
	'inboxes.markAsRead': {
		riskLevel: 'write',
		description: 'Mark every message in a sandbox inbox as read',
	},
	'inboxes.resetCredentials': {
		riskLevel: 'destructive',
		description:
			"Reset an inbox's SMTP credentials, invalidating the previous ones",
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages in a sandbox inbox',
	},
	'messages.getHtml': {
		riskLevel: 'read',
		description: 'Get the formatted HTML body of a message',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mailtrapEndpointsNested>;

export type BaseMailtrapPlugin<T extends MailtrapPluginOptions> = CorsairPlugin<
	'mailtrap',
	typeof MailtrapSchema,
	typeof mailtrapEndpointsNested,
	typeof mailtrapWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMailtrapPlugin = BaseMailtrapPlugin<MailtrapPluginOptions>;

export type ExternalMailtrapPlugin<T extends MailtrapPluginOptions> =
	BaseMailtrapPlugin<T>;

/**
 * Builds the Mailtrap plugin.
 *
 * Mailtrap authenticates with a Personal Access Token and has no OAuth flow
 * for this catalog's account-level operations, so only `api_key` auth is
 * offered — confirmed live (`GET /api/accounts` with a bare Bearer token
 * returned real account data).
 */
export function mailtrap<const T extends MailtrapPluginOptions>(
	incomingOptions: MailtrapPluginOptions & T = {} as MailtrapPluginOptions & T,
): ExternalMailtrapPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mailtrap',
		authConfig: mailtrapAuthConfig,
		schema: MailtrapSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: mailtrapEndpointsNested,
		webhooks: mailtrapWebhooksNested,
		endpointMeta: mailtrapEndpointMeta,
		endpointSchemas: mailtrapEndpointSchemas,
		webhookSchemas: mailtrapWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchMailtrapTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMailtrapOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MailtrapKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalMailtrapPlugin;
}

export type {
	MailtrapBillingUsage,
	MailtrapContact,
	MailtrapContactEventResult,
	MailtrapContactExport,
	MailtrapContactField,
	MailtrapContactImport,
	MailtrapContactList,
	MailtrapDnsRecord,
	MailtrapEmailTemplate,
	MailtrapEndpointInputs,
	MailtrapEndpointOutputs,
	MailtrapInbox,
	MailtrapMessage,
	MailtrapPermissionResource,
	MailtrapProject,
	MailtrapSendingDomain,
	MailtrapSendingStats,
	MailtrapStatsByCategoryItem,
	MailtrapStatsByDateItem,
	MailtrapStatsByDomainItem,
	MailtrapStatsByEspItem,
	MailtrapSuppression,
	MailtrapUser,
} from './endpoints/types';
export type { MailtrapWebhookOutputs } from './webhooks/types';
