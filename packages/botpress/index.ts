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
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	Billing,
	Bots,
	Chat,
	Files,
	Hub,
	Integrations,
	KnowledgeBases,
	Plugins,
	Tools,
	Workspaces,
} from './endpoints';
import type {
	BotpressEndpointInputs,
	BotpressEndpointOutputs,
} from './endpoints/types';
import {
	BotpressEndpointInputSchemas,
	BotpressEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BotpressSchema } from './schema';
import { resolveBotpressOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBotpressTenantWebhook } from './webhooks/tenant-matcher';

export type BotpressPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The Botpress workspace the token should act against.
	 *
	 * A Personal Access Token can reach several workspaces, so the workspace is
	 * a second credential rather than something the token implies. When it is
	 * omitted the plugin falls back to the stored `workspace_id` key, and
	 * finally to workspace discovery, which only resolves when the token can
	 * reach exactly one workspace.
	 */
	workspaceId?: string;
	hooks?: InternalBotpressPlugin['hooks'];
	webhookHooks?: InternalBotpressPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof botpressEndpointsNested>;
};

export const botpressAuthConfig = {
	api_key: {
		account: ['workspace_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BotpressContext = CorsairPluginContext<
	typeof BotpressSchema,
	BotpressPluginOptions,
	undefined,
	typeof botpressAuthConfig
>;

export type BotpressKeyBuilderContext =
	KeyBuilderContext<BotpressPluginOptions>;

export type BotpressBoundEndpoints = BindEndpoints<
	typeof botpressEndpointsNested
>;

type BotpressEndpoint<K extends keyof BotpressEndpointOutputs> =
	CorsairEndpoint<
		BotpressContext,
		BotpressEndpointInputs[K],
		BotpressEndpointOutputs[K]
	>;

export type BotpressEndpoints = {
	accountGet: BotpressEndpoint<'accountGet'>;
	accountUpdate: BotpressEndpoint<'accountUpdate'>;
	accountGetPreference: BotpressEndpoint<'accountGetPreference'>;
	accountSetPreference: BotpressEndpoint<'accountSetPreference'>;
	workspacesCreate: BotpressEndpoint<'workspacesCreate'>;
	workspacesGet: BotpressEndpoint<'workspacesGet'>;
	workspacesUpdate: BotpressEndpoint<'workspacesUpdate'>;
	workspacesDelete: BotpressEndpoint<'workspacesDelete'>;
	workspacesList: BotpressEndpoint<'workspacesList'>;
	workspacesListPublic: BotpressEndpoint<'workspacesListPublic'>;
	workspacesCheckHandleAvailability: BotpressEndpoint<'workspacesCheckHandleAvailability'>;
	workspacesSetPreference: BotpressEndpoint<'workspacesSetPreference'>;
	workspacesGetQuota: BotpressEndpoint<'workspacesGetQuota'>;
	workspacesGetAllQuotaCompletion: BotpressEndpoint<'workspacesGetAllQuotaCompletion'>;
	workspacesBreakDownUsageByBot: BotpressEndpoint<'workspacesBreakDownUsageByBot'>;
	billingListInvoices: BotpressEndpoint<'billingListInvoices'>;
	billingGetUpcomingInvoice: BotpressEndpoint<'billingGetUpcomingInvoice'>;
	billingChargeUnpaidInvoices: BotpressEndpoint<'billingChargeUnpaidInvoices'>;
	billingListUsageHistory: BotpressEndpoint<'billingListUsageHistory'>;
	botsCreate: BotpressEndpoint<'botsCreate'>;
	botsUpdate: BotpressEndpoint<'botsUpdate'>;
	botsListActionRuns: BotpressEndpoint<'botsListActionRuns'>;
	botsListIssues: BotpressEndpoint<'botsListIssues'>;
	chatCreateConversation: BotpressEndpoint<'chatCreateConversation'>;
	chatListConversations: BotpressEndpoint<'chatListConversations'>;
	chatSendMessage: BotpressEndpoint<'chatSendMessage'>;
	chatUpdateWorkflow: BotpressEndpoint<'chatUpdateWorkflow'>;
	integrationsCreate: BotpressEndpoint<'integrationsCreate'>;
	integrationsGet: BotpressEndpoint<'integrationsGet'>;
	integrationsList: BotpressEndpoint<'integrationsList'>;
	integrationsValidateUpdate: BotpressEndpoint<'integrationsValidateUpdate'>;
	integrationsRequestVerification: BotpressEndpoint<'integrationsRequestVerification'>;
	integrationsListApiKeys: BotpressEndpoint<'integrationsListApiKeys'>;
	integrationsDeleteShareableId: BotpressEndpoint<'integrationsDeleteShareableId'>;
	hubListIntegrations: BotpressEndpoint<'hubListIntegrations'>;
	hubGetIntegration: BotpressEndpoint<'hubGetIntegration'>;
	hubGetIntegrationById: BotpressEndpoint<'hubGetIntegrationById'>;
	hubListInterfaces: BotpressEndpoint<'hubListInterfaces'>;
	hubGetInterface: BotpressEndpoint<'hubGetInterface'>;
	hubGetInterfaceById: BotpressEndpoint<'hubGetInterfaceById'>;
	hubListPlugins: BotpressEndpoint<'hubListPlugins'>;
	hubGetPlugin: BotpressEndpoint<'hubGetPlugin'>;
	hubGetPluginById: BotpressEndpoint<'hubGetPluginById'>;
	hubGetPluginCode: BotpressEndpoint<'hubGetPluginCode'>;
	hubGetDereferencedPluginById: BotpressEndpoint<'hubGetDereferencedPluginById'>;
	pluginsList: BotpressEndpoint<'pluginsList'>;
	filesDelete: BotpressEndpoint<'filesDelete'>;
	filesListTags: BotpressEndpoint<'filesListTags'>;
	filesListTagValues: BotpressEndpoint<'filesListTagValues'>;
	knowledgeBasesList: BotpressEndpoint<'knowledgeBasesList'>;
	knowledgeBasesDelete: BotpressEndpoint<'knowledgeBasesDelete'>;
	toolsRunVrl: BotpressEndpoint<'toolsRunVrl'>;
	toolsGetTableRow: BotpressEndpoint<'toolsGetTableRow'>;
};

export type BotpressWebhooks = Record<string, never>;

export type BotpressBoundWebhooks = BindWebhooks<BotpressWebhooks>;

const botpressEndpointsNested = {
	account: {
		get: Account.get,
		update: Account.update,
		getPreference: Account.getPreference,
		setPreference: Account.setPreference,
	},
	workspaces: {
		create: Workspaces.create,
		get: Workspaces.get,
		update: Workspaces.update,
		delete: Workspaces.delete,
		list: Workspaces.list,
		listPublic: Workspaces.listPublic,
		checkHandleAvailability: Workspaces.checkHandleAvailability,
		setPreference: Workspaces.setPreference,
		getQuota: Workspaces.getQuota,
		getAllQuotaCompletion: Workspaces.getAllQuotaCompletion,
		breakDownUsageByBot: Workspaces.breakDownUsageByBot,
	},
	billing: {
		listInvoices: Billing.listInvoices,
		getUpcomingInvoice: Billing.getUpcomingInvoice,
		chargeUnpaidInvoices: Billing.chargeUnpaidInvoices,
		listUsageHistory: Billing.listUsageHistory,
	},
	bots: {
		create: Bots.create,
		update: Bots.update,
		listActionRuns: Bots.listActionRuns,
		listIssues: Bots.listIssues,
	},
	chat: {
		createConversation: Chat.createConversation,
		listConversations: Chat.listConversations,
		sendMessage: Chat.sendMessage,
		updateWorkflow: Chat.updateWorkflow,
	},
	integrations: {
		create: Integrations.create,
		get: Integrations.get,
		list: Integrations.list,
		validateUpdate: Integrations.validateUpdate,
		requestVerification: Integrations.requestVerification,
		listApiKeys: Integrations.listApiKeys,
		deleteShareableId: Integrations.deleteShareableId,
	},
	hub: {
		listIntegrations: Hub.listIntegrations,
		getIntegration: Hub.getIntegration,
		getIntegrationById: Hub.getIntegrationById,
		listInterfaces: Hub.listInterfaces,
		getInterface: Hub.getInterface,
		getInterfaceById: Hub.getInterfaceById,
		listPlugins: Hub.listPlugins,
		getPlugin: Hub.getPlugin,
		getPluginById: Hub.getPluginById,
		getPluginCode: Hub.getPluginCode,
		getDereferencedPluginById: Hub.getDereferencedPluginById,
	},
	plugins: {
		list: Plugins.list,
	},
	files: {
		delete: Files.delete,
		listTags: Files.listTags,
		listTagValues: Files.listTagValues,
	},
	knowledgeBases: {
		list: KnowledgeBases.list,
		delete: KnowledgeBases.delete,
	},
	tools: {
		runVrl: Tools.runVrl,
		getTableRow: Tools.getTableRow,
	},
} as const;

/**
 * The OSS catalog for this integration lists zero triggers/webhooks — every
 * operation covered here is a direct REST call, not a webhook subscription.
 */
const botpressWebhooksNested = {} as const;

export const botpressEndpointSchemas = {
	'account.get': {
		input: BotpressEndpointInputSchemas.accountGet,
		output: BotpressEndpointOutputSchemas.accountGet,
	},
	'account.update': {
		input: BotpressEndpointInputSchemas.accountUpdate,
		output: BotpressEndpointOutputSchemas.accountUpdate,
	},
	'account.getPreference': {
		input: BotpressEndpointInputSchemas.accountGetPreference,
		output: BotpressEndpointOutputSchemas.accountGetPreference,
	},
	'account.setPreference': {
		input: BotpressEndpointInputSchemas.accountSetPreference,
		output: BotpressEndpointOutputSchemas.accountSetPreference,
	},
	'workspaces.create': {
		input: BotpressEndpointInputSchemas.workspacesCreate,
		output: BotpressEndpointOutputSchemas.workspacesCreate,
	},
	'workspaces.get': {
		input: BotpressEndpointInputSchemas.workspacesGet,
		output: BotpressEndpointOutputSchemas.workspacesGet,
	},
	'workspaces.update': {
		input: BotpressEndpointInputSchemas.workspacesUpdate,
		output: BotpressEndpointOutputSchemas.workspacesUpdate,
	},
	'workspaces.delete': {
		input: BotpressEndpointInputSchemas.workspacesDelete,
		output: BotpressEndpointOutputSchemas.workspacesDelete,
	},
	'workspaces.list': {
		input: BotpressEndpointInputSchemas.workspacesList,
		output: BotpressEndpointOutputSchemas.workspacesList,
	},
	'workspaces.listPublic': {
		input: BotpressEndpointInputSchemas.workspacesListPublic,
		output: BotpressEndpointOutputSchemas.workspacesListPublic,
	},
	'workspaces.checkHandleAvailability': {
		input: BotpressEndpointInputSchemas.workspacesCheckHandleAvailability,
		output: BotpressEndpointOutputSchemas.workspacesCheckHandleAvailability,
	},
	'workspaces.setPreference': {
		input: BotpressEndpointInputSchemas.workspacesSetPreference,
		output: BotpressEndpointOutputSchemas.workspacesSetPreference,
	},
	'workspaces.getQuota': {
		input: BotpressEndpointInputSchemas.workspacesGetQuota,
		output: BotpressEndpointOutputSchemas.workspacesGetQuota,
	},
	'workspaces.getAllQuotaCompletion': {
		input: BotpressEndpointInputSchemas.workspacesGetAllQuotaCompletion,
		output: BotpressEndpointOutputSchemas.workspacesGetAllQuotaCompletion,
	},
	'workspaces.breakDownUsageByBot': {
		input: BotpressEndpointInputSchemas.workspacesBreakDownUsageByBot,
		output: BotpressEndpointOutputSchemas.workspacesBreakDownUsageByBot,
	},
	'billing.listInvoices': {
		input: BotpressEndpointInputSchemas.billingListInvoices,
		output: BotpressEndpointOutputSchemas.billingListInvoices,
	},
	'billing.getUpcomingInvoice': {
		input: BotpressEndpointInputSchemas.billingGetUpcomingInvoice,
		output: BotpressEndpointOutputSchemas.billingGetUpcomingInvoice,
	},
	'billing.chargeUnpaidInvoices': {
		input: BotpressEndpointInputSchemas.billingChargeUnpaidInvoices,
		output: BotpressEndpointOutputSchemas.billingChargeUnpaidInvoices,
	},
	'billing.listUsageHistory': {
		input: BotpressEndpointInputSchemas.billingListUsageHistory,
		output: BotpressEndpointOutputSchemas.billingListUsageHistory,
	},
	'bots.create': {
		input: BotpressEndpointInputSchemas.botsCreate,
		output: BotpressEndpointOutputSchemas.botsCreate,
	},
	'bots.update': {
		input: BotpressEndpointInputSchemas.botsUpdate,
		output: BotpressEndpointOutputSchemas.botsUpdate,
	},
	'bots.listActionRuns': {
		input: BotpressEndpointInputSchemas.botsListActionRuns,
		output: BotpressEndpointOutputSchemas.botsListActionRuns,
	},
	'bots.listIssues': {
		input: BotpressEndpointInputSchemas.botsListIssues,
		output: BotpressEndpointOutputSchemas.botsListIssues,
	},
	'chat.createConversation': {
		input: BotpressEndpointInputSchemas.chatCreateConversation,
		output: BotpressEndpointOutputSchemas.chatCreateConversation,
	},
	'chat.listConversations': {
		input: BotpressEndpointInputSchemas.chatListConversations,
		output: BotpressEndpointOutputSchemas.chatListConversations,
	},
	'chat.sendMessage': {
		input: BotpressEndpointInputSchemas.chatSendMessage,
		output: BotpressEndpointOutputSchemas.chatSendMessage,
	},
	'chat.updateWorkflow': {
		input: BotpressEndpointInputSchemas.chatUpdateWorkflow,
		output: BotpressEndpointOutputSchemas.chatUpdateWorkflow,
	},
	'integrations.create': {
		input: BotpressEndpointInputSchemas.integrationsCreate,
		output: BotpressEndpointOutputSchemas.integrationsCreate,
	},
	'integrations.get': {
		input: BotpressEndpointInputSchemas.integrationsGet,
		output: BotpressEndpointOutputSchemas.integrationsGet,
	},
	'integrations.list': {
		input: BotpressEndpointInputSchemas.integrationsList,
		output: BotpressEndpointOutputSchemas.integrationsList,
	},
	'integrations.validateUpdate': {
		input: BotpressEndpointInputSchemas.integrationsValidateUpdate,
		output: BotpressEndpointOutputSchemas.integrationsValidateUpdate,
	},
	'integrations.requestVerification': {
		input: BotpressEndpointInputSchemas.integrationsRequestVerification,
		output: BotpressEndpointOutputSchemas.integrationsRequestVerification,
	},
	'integrations.listApiKeys': {
		input: BotpressEndpointInputSchemas.integrationsListApiKeys,
		output: BotpressEndpointOutputSchemas.integrationsListApiKeys,
	},
	'integrations.deleteShareableId': {
		input: BotpressEndpointInputSchemas.integrationsDeleteShareableId,
		output: BotpressEndpointOutputSchemas.integrationsDeleteShareableId,
	},
	'hub.listIntegrations': {
		input: BotpressEndpointInputSchemas.hubListIntegrations,
		output: BotpressEndpointOutputSchemas.hubListIntegrations,
	},
	'hub.getIntegration': {
		input: BotpressEndpointInputSchemas.hubGetIntegration,
		output: BotpressEndpointOutputSchemas.hubGetIntegration,
	},
	'hub.getIntegrationById': {
		input: BotpressEndpointInputSchemas.hubGetIntegrationById,
		output: BotpressEndpointOutputSchemas.hubGetIntegrationById,
	},
	'hub.listInterfaces': {
		input: BotpressEndpointInputSchemas.hubListInterfaces,
		output: BotpressEndpointOutputSchemas.hubListInterfaces,
	},
	'hub.getInterface': {
		input: BotpressEndpointInputSchemas.hubGetInterface,
		output: BotpressEndpointOutputSchemas.hubGetInterface,
	},
	'hub.getInterfaceById': {
		input: BotpressEndpointInputSchemas.hubGetInterfaceById,
		output: BotpressEndpointOutputSchemas.hubGetInterfaceById,
	},
	'hub.listPlugins': {
		input: BotpressEndpointInputSchemas.hubListPlugins,
		output: BotpressEndpointOutputSchemas.hubListPlugins,
	},
	'hub.getPlugin': {
		input: BotpressEndpointInputSchemas.hubGetPlugin,
		output: BotpressEndpointOutputSchemas.hubGetPlugin,
	},
	'hub.getPluginById': {
		input: BotpressEndpointInputSchemas.hubGetPluginById,
		output: BotpressEndpointOutputSchemas.hubGetPluginById,
	},
	'hub.getPluginCode': {
		input: BotpressEndpointInputSchemas.hubGetPluginCode,
		output: BotpressEndpointOutputSchemas.hubGetPluginCode,
	},
	'hub.getDereferencedPluginById': {
		input: BotpressEndpointInputSchemas.hubGetDereferencedPluginById,
		output: BotpressEndpointOutputSchemas.hubGetDereferencedPluginById,
	},
	'plugins.list': {
		input: BotpressEndpointInputSchemas.pluginsList,
		output: BotpressEndpointOutputSchemas.pluginsList,
	},
	'files.delete': {
		input: BotpressEndpointInputSchemas.filesDelete,
		output: BotpressEndpointOutputSchemas.filesDelete,
	},
	'files.listTags': {
		input: BotpressEndpointInputSchemas.filesListTags,
		output: BotpressEndpointOutputSchemas.filesListTags,
	},
	'files.listTagValues': {
		input: BotpressEndpointInputSchemas.filesListTagValues,
		output: BotpressEndpointOutputSchemas.filesListTagValues,
	},
	'knowledgeBases.list': {
		input: BotpressEndpointInputSchemas.knowledgeBasesList,
		output: BotpressEndpointOutputSchemas.knowledgeBasesList,
	},
	'knowledgeBases.delete': {
		input: BotpressEndpointInputSchemas.knowledgeBasesDelete,
		output: BotpressEndpointOutputSchemas.knowledgeBasesDelete,
	},
	'tools.runVrl': {
		input: BotpressEndpointInputSchemas.toolsRunVrl,
		output: BotpressEndpointOutputSchemas.toolsRunVrl,
	},
	'tools.getTableRow': {
		input: BotpressEndpointInputSchemas.toolsGetTableRow,
		output: BotpressEndpointOutputSchemas.toolsGetTableRow,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof botpressEndpointsNested
>;

const botpressWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof botpressWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const botpressEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get the authenticated account',
	},
	'account.update': {
		riskLevel: 'write',
		description: 'Update the authenticated account profile',
	},
	'account.getPreference': {
		riskLevel: 'read',
		description: 'Get an account preference by key',
	},
	'account.setPreference': {
		riskLevel: 'write',
		description: 'Set an account preference by key',
	},
	'workspaces.create': {
		riskLevel: 'write',
		description: 'Create a workspace',
	},
	'workspaces.get': { riskLevel: 'read', description: 'Get a workspace by id' },
	'workspaces.update': {
		riskLevel: 'write',
		description: 'Update workspace settings',
	},
	'workspaces.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a workspace',
	},
	'workspaces.list': {
		riskLevel: 'read',
		description: 'List workspaces owned by the account',
	},
	'workspaces.listPublic': {
		riskLevel: 'read',
		description: 'List public workspaces',
	},
	'workspaces.checkHandleAvailability': {
		riskLevel: 'read',
		description: 'Check whether a workspace handle is available',
	},
	'workspaces.setPreference': {
		riskLevel: 'write',
		description: 'Set a workspace preference by key',
	},
	'workspaces.getQuota': {
		riskLevel: 'read',
		description: "Get a workspace's usage against a quota type",
	},
	'workspaces.getAllQuotaCompletion': {
		riskLevel: 'read',
		description: 'Get the highest quota completion rate for every workspace',
	},
	'workspaces.breakDownUsageByBot': {
		riskLevel: 'read',
		description: "Break down a workspace's usage of a quota type by bot",
	},
	'billing.listInvoices': {
		riskLevel: 'read',
		description: 'List invoices billed to a workspace',
	},
	'billing.getUpcomingInvoice': {
		riskLevel: 'read',
		description: 'Preview the upcoming invoice for a workspace',
	},
	'billing.chargeUnpaidInvoices': {
		riskLevel: 'destructive',
		description:
			'Charge outstanding invoices for a workspace [DESTRUCTIVE - real financial action]',
	},
	'billing.listUsageHistory': {
		riskLevel: 'read',
		description: 'List usage history for a workspace or bot',
	},
	'bots.create': {
		riskLevel: 'write',
		description: 'Create a bot in a workspace',
	},
	'bots.update': { riskLevel: 'write', description: 'Update a bot' },
	'bots.listActionRuns': {
		riskLevel: 'read',
		description: "List a bot's action-run history",
	},
	'bots.listIssues': {
		riskLevel: 'read',
		description: 'List configuration and runtime issues for a bot',
	},
	'chat.createConversation': {
		riskLevel: 'write',
		description: 'Create a conversation on a channel',
	},
	'chat.listConversations': {
		riskLevel: 'read',
		description: "List a bot's conversations",
	},
	'chat.sendMessage': {
		riskLevel: 'write',
		description: 'Send a message into a conversation',
	},
	'chat.updateWorkflow': {
		riskLevel: 'write',
		description: "Update a workflow's status, output or failure reason",
	},
	'integrations.create': {
		riskLevel: 'write',
		description: 'Create an integration in a workspace',
	},
	'integrations.get': {
		riskLevel: 'read',
		description: 'Get an integration by id',
	},
	'integrations.list': {
		riskLevel: 'read',
		description: 'List integrations owned by the workspace',
	},
	'integrations.validateUpdate': {
		riskLevel: 'read',
		description: 'Validate that an integration update would succeed',
	},
	'integrations.requestVerification': {
		riskLevel: 'write',
		description: 'Submit an integration for verification',
	},
	'integrations.listApiKeys': {
		riskLevel: 'read',
		description: 'List Integration API Keys (IAKs) for an integration',
	},
	'integrations.deleteShareableId': {
		riskLevel: 'destructive',
		description: 'Delete the shareable id for a bot-integration pair',
	},
	'hub.listIntegrations': {
		riskLevel: 'read',
		description: 'List public integrations in the hub',
	},
	'hub.getIntegration': {
		riskLevel: 'read',
		description: 'Get a public integration by name and version',
	},
	'hub.getIntegrationById': {
		riskLevel: 'read',
		description: 'Get a public integration by id',
	},
	'hub.listInterfaces': {
		riskLevel: 'read',
		description: 'List public interfaces in the hub',
	},
	'hub.getInterface': {
		riskLevel: 'read',
		description: 'Get a public interface by name and version',
	},
	'hub.getInterfaceById': {
		riskLevel: 'read',
		description: 'Get a public interface by id',
	},
	'hub.listPlugins': {
		riskLevel: 'read',
		description: 'List public plugins in the hub',
	},
	'hub.getPlugin': {
		riskLevel: 'read',
		description: 'Get a public plugin by name and version',
	},
	'hub.getPluginById': {
		riskLevel: 'read',
		description: 'Get a public plugin by id',
	},
	'hub.getPluginCode': {
		riskLevel: 'read',
		description: "Get a public plugin's source code for a platform",
	},
	'hub.getDereferencedPluginById': {
		riskLevel: 'read',
		description:
			'Get a public plugin with interface entity references resolved',
	},
	'plugins.list': {
		riskLevel: 'read',
		description: 'List plugins installed in the workspace',
	},
	'files.delete': {
		riskLevel: 'destructive',
		description: "Delete a file from a bot's storage",
	},
	'files.listTags': {
		riskLevel: 'read',
		description: "List tags used across a bot's files",
	},
	'files.listTagValues': {
		riskLevel: 'read',
		description: 'List all values seen for a given file tag',
	},
	'knowledgeBases.list': {
		riskLevel: 'read',
		description: "List a bot's knowledge bases",
	},
	'knowledgeBases.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a knowledge base',
	},
	'tools.runVrl': {
		riskLevel: 'write',
		description: 'Execute a VRL script against input data',
	},
	'tools.getTableRow': {
		riskLevel: 'read',
		description: 'Fetch a single row from a table by id',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof botpressEndpointsNested>;

export type BaseBotpressPlugin<T extends BotpressPluginOptions> = CorsairPlugin<
	'botpress',
	typeof BotpressSchema,
	typeof botpressEndpointsNested,
	typeof botpressWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBotpressPlugin = BaseBotpressPlugin<BotpressPluginOptions>;

export type ExternalBotpressPlugin<T extends BotpressPluginOptions> =
	BaseBotpressPlugin<T>;

/**
 * Builds the Botpress plugin.
 *
 * Botpress authenticates with a Personal Access Token and has no OAuth flow
 * for this catalog's admin-level operations, so only `api_key` auth is
 * offered — confirmed live (`GET /v1/admin/account/me` with a bare Bearer
 * token returned real account data).
 */
export function botpress<const T extends BotpressPluginOptions>(
	incomingOptions: BotpressPluginOptions & T = {} as BotpressPluginOptions & T,
): ExternalBotpressPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'botpress',
		authConfig: botpressAuthConfig,
		schema: BotpressSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: botpressEndpointsNested,
		webhooks: botpressWebhooksNested,
		endpointMeta: botpressEndpointMeta,
		endpointSchemas: botpressEndpointSchemas,
		webhookSchemas: botpressWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchBotpressTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBotpressOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BotpressKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) {
				return options.key.trim();
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res?.trim()) return res.trim();
			}

			throw new AuthMissingError('botpress', 'api_key');
		},
	} satisfies InternalBotpressPlugin;
}

export type {
	BotpressAccount,
	BotpressActionRun,
	BotpressBot,
	BotpressBotIssue,
	BotpressConversation,
	BotpressEndpointInputs,
	BotpressEndpointOutputs,
	BotpressIntegration,
	BotpressIntegrationApiKey,
	BotpressInvoice,
	BotpressKnowledgeBase,
	BotpressMessage,
	BotpressPublicIntegration,
	BotpressPublicInterface,
	BotpressPublicPlugin,
	BotpressQuota,
	BotpressTableRow,
	BotpressWorkflow,
	BotpressWorkspace,
} from './endpoints/types';
export type { BotpressWebhookOutputs } from './webhooks/types';
