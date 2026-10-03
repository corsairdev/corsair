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
	ActorEndpoints,
	AuthEndpoints,
	AiEndpoints,
	BillingEndpoints,
	ConnectionsEndpoints,
	DatatanksEndpoints,
	IdentitiesEndpoints,
	IntegrationsEndpoints,
	ModsEndpoints,
	NotifiersEndpoints,
	OrgsEndpoints,
	PipelinesEndpoints,
	QueryEndpoints,
	TenantsEndpoints,
	UsersEndpoints,
	WorkspacesEndpoints,
} from './endpoints';
import type {
	TurbotPipesEndpointInputs,
	TurbotPipesEndpointOutputs,
} from './endpoints/types';
import {
	TurbotPipesEndpointInputSchemas,
	TurbotPipesEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TurbotPipesSchema } from './schema';
import { matchTurbotPipesTenantWebhook } from './webhooks/tenant-matcher';
import { resolveTurbotPipesOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type TurbotPipesPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTurbotPipesPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof turbotpipesEndpointsNested>;
};

export type TurbotPipesContext = CorsairPluginContext<
	typeof TurbotPipesSchema,
	TurbotPipesPluginOptions
>;

export type TurbotPipesKeyBuilderContext = KeyBuilderContext<TurbotPipesPluginOptions>;

export type TurbotPipesBoundEndpoints = BindEndpoints<typeof turbotpipesEndpointsNested>;

type TurbotPipesEndpoint<
	K extends keyof TurbotPipesEndpointOutputs,
	Input,
> = CorsairEndpoint<TurbotPipesContext, Input, TurbotPipesEndpointOutputs[K]>;

export type TurbotPipesEndpoints = {
	actorGet: TurbotPipesEndpoint<'actorGet', TurbotPipesEndpointInputs['actorGet']>;
	actorListWorkspaces: TurbotPipesEndpoint<'actorListWorkspaces', TurbotPipesEndpointInputs['actorListWorkspaces']>;
	actorListOrgs: TurbotPipesEndpoint<'actorListOrgs', TurbotPipesEndpointInputs['actorListOrgs']>;
	actorListConnections: TurbotPipesEndpoint<'actorListConnections', TurbotPipesEndpointInputs['actorListConnections']>;
	actorListActivity: TurbotPipesEndpoint<'actorListActivity', TurbotPipesEndpointInputs['actorListActivity']>;
	getUser: TurbotPipesEndpoint<'getUser', TurbotPipesEndpointInputs['getUser']>;
	updateUser: TurbotPipesEndpoint<'updateUser', TurbotPipesEndpointInputs['updateUser']>;
	listUserWorkspaces: TurbotPipesEndpoint<'listUserWorkspaces', TurbotPipesEndpointInputs['listUserWorkspaces']>;
	getUserWorkspace: TurbotPipesEndpoint<'getUserWorkspace', TurbotPipesEndpointInputs['getUserWorkspace']>;
	updateUserWorkspace: TurbotPipesEndpoint<'updateUserWorkspace', TurbotPipesEndpointInputs['updateUserWorkspace']>;
	runUserWorkspaceCommand: TurbotPipesEndpoint<'runUserWorkspaceCommand', TurbotPipesEndpointInputs['runUserWorkspaceCommand']>;
	listUserProcesses: TurbotPipesEndpoint<'listUserProcesses', TurbotPipesEndpointInputs['listUserProcesses']>;
	getUserProcess: TurbotPipesEndpoint<'getUserProcess', TurbotPipesEndpointInputs['getUserProcess']>;
	listUserUsage: TurbotPipesEndpoint<'listUserUsage', TurbotPipesEndpointInputs['listUserUsage']>;
	listUserConstraints: TurbotPipesEndpoint<'listUserConstraints', TurbotPipesEndpointInputs['listUserConstraints']>;
	listUserAuditLogs: TurbotPipesEndpoint<'listUserAuditLogs', TurbotPipesEndpointInputs['listUserAuditLogs']>;
	getUserEmail: TurbotPipesEndpoint<'getUserEmail', TurbotPipesEndpointInputs['getUserEmail']>;
	listUserEmails: TurbotPipesEndpoint<'listUserEmails', TurbotPipesEndpointInputs['listUserEmails']>;
	getUserPreferences: TurbotPipesEndpoint<'getUserPreferences', TurbotPipesEndpointInputs['getUserPreferences']>;
	updateUserPreferences: TurbotPipesEndpoint<'updateUserPreferences', TurbotPipesEndpointInputs['updateUserPreferences']>;
	deleteUserAvatar: TurbotPipesEndpoint<'deleteUserAvatar', TurbotPipesEndpointInputs['deleteUserAvatar']>;
	getOrg: TurbotPipesEndpoint<'getOrg', TurbotPipesEndpointInputs['getOrg']>;
	deleteOrg: TurbotPipesEndpoint<'deleteOrg', TurbotPipesEndpointInputs['deleteOrg']>;
	listOrgWorkspaces: TurbotPipesEndpoint<'listOrgWorkspaces', TurbotPipesEndpointInputs['listOrgWorkspaces']>;
	deleteOrgWorkspace: TurbotPipesEndpoint<'deleteOrgWorkspace', TurbotPipesEndpointInputs['deleteOrgWorkspace']>;
	runOrgWorkspaceCommand: TurbotPipesEndpoint<'runOrgWorkspaceCommand', TurbotPipesEndpointInputs['runOrgWorkspaceCommand']>;
	listOrgProcesses: TurbotPipesEndpoint<'listOrgProcesses', TurbotPipesEndpointInputs['listOrgProcesses']>;
	listOrgServiceAccounts: TurbotPipesEndpoint<'listOrgServiceAccounts', TurbotPipesEndpointInputs['listOrgServiceAccounts']>;
	updateOrgServiceAccount: TurbotPipesEndpoint<'updateOrgServiceAccount', TurbotPipesEndpointInputs['updateOrgServiceAccount']>;
	updateOrgServiceAccountToken: TurbotPipesEndpoint<'updateOrgServiceAccountToken', TurbotPipesEndpointInputs['updateOrgServiceAccountToken']>;
	getOrgMember: TurbotPipesEndpoint<'getOrgMember', TurbotPipesEndpointInputs['getOrgMember']>;
	updateOrgMemberRole: TurbotPipesEndpoint<'updateOrgMemberRole', TurbotPipesEndpointInputs['updateOrgMemberRole']>;
	listOrgUsage: TurbotPipesEndpoint<'listOrgUsage', TurbotPipesEndpointInputs['listOrgUsage']>;
	createUserConnection: TurbotPipesEndpoint<'createUserConnection', TurbotPipesEndpointInputs['createUserConnection']>;
	getUserConnection: TurbotPipesEndpoint<'getUserConnection', TurbotPipesEndpointInputs['getUserConnection']>;
	listUserConnections: TurbotPipesEndpoint<'listUserConnections', TurbotPipesEndpointInputs['listUserConnections']>;
	updateUserConnection: TurbotPipesEndpoint<'updateUserConnection', TurbotPipesEndpointInputs['updateUserConnection']>;
	deleteUserConnectionDeprecated: TurbotPipesEndpoint<'deleteUserConnectionDeprecated', TurbotPipesEndpointInputs['deleteUserConnectionDeprecated']>;
	testUserConnection: TurbotPipesEndpoint<'testUserConnection', TurbotPipesEndpointInputs['testUserConnection']>;
	createOrgConnection: TurbotPipesEndpoint<'createOrgConnection', TurbotPipesEndpointInputs['createOrgConnection']>;
	updateOrgConnection: TurbotPipesEndpoint<'updateOrgConnection', TurbotPipesEndpointInputs['updateOrgConnection']>;
	getOrgConnectionPermission: TurbotPipesEndpoint<'getOrgConnectionPermission', TurbotPipesEndpointInputs['getOrgConnectionPermission']>;
	deleteOrgConnectionPermission: TurbotPipesEndpoint<'deleteOrgConnectionPermission', TurbotPipesEndpointInputs['deleteOrgConnectionPermission']>;
	createOrgConnectionFolder: TurbotPipesEndpoint<'createOrgConnectionFolder', TurbotPipesEndpointInputs['createOrgConnectionFolder']>;
	updateOrgConnectionFolder: TurbotPipesEndpoint<'updateOrgConnectionFolder', TurbotPipesEndpointInputs['updateOrgConnectionFolder']>;
	createUserWorkspaceConnection: TurbotPipesEndpoint<'createUserWorkspaceConnection', TurbotPipesEndpointInputs['createUserWorkspaceConnection']>;
	getUserWorkspaceConnection: TurbotPipesEndpoint<'getUserWorkspaceConnection', TurbotPipesEndpointInputs['getUserWorkspaceConnection']>;
	listUserWorkspaceConnections: TurbotPipesEndpoint<'listUserWorkspaceConnections', TurbotPipesEndpointInputs['listUserWorkspaceConnections']>;
	listUserWorkspaceConnectionAssociations: TurbotPipesEndpoint<'listUserWorkspaceConnectionAssociations', TurbotPipesEndpointInputs['listUserWorkspaceConnectionAssociations']>;
	listUserWorkspaceConnectionTree: TurbotPipesEndpoint<'listUserWorkspaceConnectionTree', TurbotPipesEndpointInputs['listUserWorkspaceConnectionTree']>;
	testUserWorkspaceConnection: TurbotPipesEndpoint<'testUserWorkspaceConnection', TurbotPipesEndpointInputs['testUserWorkspaceConnection']>;
	createUserWorkspaceConnectionFolder: TurbotPipesEndpoint<'createUserWorkspaceConnectionFolder', TurbotPipesEndpointInputs['createUserWorkspaceConnectionFolder']>;
	getUserWorkspaceConnectionFolder: TurbotPipesEndpoint<'getUserWorkspaceConnectionFolder', TurbotPipesEndpointInputs['getUserWorkspaceConnectionFolder']>;
	listUserWorkspaceConnectionFolders: TurbotPipesEndpoint<'listUserWorkspaceConnectionFolders', TurbotPipesEndpointInputs['listUserWorkspaceConnectionFolders']>;
	createOrgWorkspaceConnection: TurbotPipesEndpoint<'createOrgWorkspaceConnection', TurbotPipesEndpointInputs['createOrgWorkspaceConnection']>;
	getOrgWorkspaceConnection: TurbotPipesEndpoint<'getOrgWorkspaceConnection', TurbotPipesEndpointInputs['getOrgWorkspaceConnection']>;
	createOrgWorkspaceConnectionFolder: TurbotPipesEndpoint<'createOrgWorkspaceConnectionFolder', TurbotPipesEndpointInputs['createOrgWorkspaceConnectionFolder']>;
	getOrgWorkspaceConnectionFolder: TurbotPipesEndpoint<'getOrgWorkspaceConnectionFolder', TurbotPipesEndpointInputs['getOrgWorkspaceConnectionFolder']>;
	createOrgWorkspaceAggregator: TurbotPipesEndpoint<'createOrgWorkspaceAggregator', TurbotPipesEndpointInputs['createOrgWorkspaceAggregator']>;
	getUserWorkspaceAggregator: TurbotPipesEndpoint<'getUserWorkspaceAggregator', TurbotPipesEndpointInputs['getUserWorkspaceAggregator']>;
	listUserWorkspaceAggregators: TurbotPipesEndpoint<'listUserWorkspaceAggregators', TurbotPipesEndpointInputs['listUserWorkspaceAggregators']>;
	listUserWorkspaceAggregatorConnections: TurbotPipesEndpoint<'listUserWorkspaceAggregatorConnections', TurbotPipesEndpointInputs['listUserWorkspaceAggregatorConnections']>;
	listUserWorkspaceAuditLogs: TurbotPipesEndpoint<'listUserWorkspaceAuditLogs', TurbotPipesEndpointInputs['listUserWorkspaceAuditLogs']>;
	listUserWorkspaceDatabaseLogs: TurbotPipesEndpoint<'listUserWorkspaceDatabaseLogs', TurbotPipesEndpointInputs['listUserWorkspaceDatabaseLogs']>;
	listUserWorkspaceProcesses: TurbotPipesEndpoint<'listUserWorkspaceProcesses', TurbotPipesEndpointInputs['listUserWorkspaceProcesses']>;
	getUserWorkspaceProcess: TurbotPipesEndpoint<'getUserWorkspaceProcess', TurbotPipesEndpointInputs['getUserWorkspaceProcess']>;
	getUserWorkspaceProcessLog: TurbotPipesEndpoint<'getUserWorkspaceProcessLog', TurbotPipesEndpointInputs['getUserWorkspaceProcessLog']>;
	listOrgWorkspaceProcesses: TurbotPipesEndpoint<'listOrgWorkspaceProcesses', TurbotPipesEndpointInputs['listOrgWorkspaceProcesses']>;
	listUserWorkspaceUsage: TurbotPipesEndpoint<'listUserWorkspaceUsage', TurbotPipesEndpointInputs['listUserWorkspaceUsage']>;
	createOrgWorkspaceQuery: TurbotPipesEndpoint<'createOrgWorkspaceQuery', TurbotPipesEndpointInputs['createOrgWorkspaceQuery']>;
	getOrgWorkspaceQueryData: TurbotPipesEndpoint<'getOrgWorkspaceQueryData', TurbotPipesEndpointInputs['getOrgWorkspaceQueryData']>;
	createOrgWorkspaceSnapshot: TurbotPipesEndpoint<'createOrgWorkspaceSnapshot', TurbotPipesEndpointInputs['createOrgWorkspaceSnapshot']>;
	getUserWorkspaceQuery: TurbotPipesEndpoint<'getUserWorkspaceQuery', TurbotPipesEndpointInputs['getUserWorkspaceQuery']>;
	getUserWorkspaceQueryData: TurbotPipesEndpoint<'getUserWorkspaceQueryData', TurbotPipesEndpointInputs['getUserWorkspaceQueryData']>;
	postUserWorkspaceQuery: TurbotPipesEndpoint<'postUserWorkspaceQuery', TurbotPipesEndpointInputs['postUserWorkspaceQuery']>;
	runUserWorkspaceQuery: TurbotPipesEndpoint<'runUserWorkspaceQuery', TurbotPipesEndpointInputs['runUserWorkspaceQuery']>;
	listUserWorkspaceSnapshots: TurbotPipesEndpoint<'listUserWorkspaceSnapshots', TurbotPipesEndpointInputs['listUserWorkspaceSnapshots']>;
	createUserAiKey: TurbotPipesEndpoint<'createUserAiKey', TurbotPipesEndpointInputs['createUserAiKey']>;
	getUserAiKey: TurbotPipesEndpoint<'getUserAiKey', TurbotPipesEndpointInputs['getUserAiKey']>;
	listUserAiKeys: TurbotPipesEndpoint<'listUserAiKeys', TurbotPipesEndpointInputs['listUserAiKeys']>;
	updateUserAiKey: TurbotPipesEndpoint<'updateUserAiKey', TurbotPipesEndpointInputs['updateUserAiKey']>;
	testUserAiKey: TurbotPipesEndpoint<'testUserAiKey', TurbotPipesEndpointInputs['testUserAiKey']>;
	deleteOrgWorkspaceConversation: TurbotPipesEndpoint<'deleteOrgWorkspaceConversation', TurbotPipesEndpointInputs['deleteOrgWorkspaceConversation']>;
	getUserWorkspaceConversation: TurbotPipesEndpoint<'getUserWorkspaceConversation', TurbotPipesEndpointInputs['getUserWorkspaceConversation']>;
	updateUserWorkspaceConversation: TurbotPipesEndpoint<'updateUserWorkspaceConversation', TurbotPipesEndpointInputs['updateUserWorkspaceConversation']>;
	listUserWorkspaceConversations: TurbotPipesEndpoint<'listUserWorkspaceConversations', TurbotPipesEndpointInputs['listUserWorkspaceConversations']>;
	sendUserWorkspaceChatMessage: TurbotPipesEndpoint<'sendUserWorkspaceChatMessage', TurbotPipesEndpointInputs['sendUserWorkspaceChatMessage']>;
	createUserIntegration: TurbotPipesEndpoint<'createUserIntegration', TurbotPipesEndpointInputs['createUserIntegration']>;
	deleteUserIntegration: TurbotPipesEndpoint<'deleteUserIntegration', TurbotPipesEndpointInputs['deleteUserIntegration']>;
	getUserIntegration: TurbotPipesEndpoint<'getUserIntegration', TurbotPipesEndpointInputs['getUserIntegration']>;
	listUserIntegrations: TurbotPipesEndpoint<'listUserIntegrations', TurbotPipesEndpointInputs['listUserIntegrations']>;
	updateUserIntegration: TurbotPipesEndpoint<'updateUserIntegration', TurbotPipesEndpointInputs['updateUserIntegration']>;
	testUserIntegration: TurbotPipesEndpoint<'testUserIntegration', TurbotPipesEndpointInputs['testUserIntegration']>;
	getOrgWorkspaceIntegration: TurbotPipesEndpoint<'getOrgWorkspaceIntegration', TurbotPipesEndpointInputs['getOrgWorkspaceIntegration']>;
	getOrgIntegration: TurbotPipesEndpoint<'getOrgIntegration', TurbotPipesEndpointInputs['getOrgIntegration']>;
	getUserWorkspaceIntegration: TurbotPipesEndpoint<'getUserWorkspaceIntegration', TurbotPipesEndpointInputs['getUserWorkspaceIntegration']>;
	listUserWorkspaceIntegrations: TurbotPipesEndpoint<'listUserWorkspaceIntegrations', TurbotPipesEndpointInputs['listUserWorkspaceIntegrations']>;
	installUserSlackIntegration: TurbotPipesEndpoint<'installUserSlackIntegration', TurbotPipesEndpointInputs['installUserSlackIntegration']>;
	createUserNotifier: TurbotPipesEndpoint<'createUserNotifier', TurbotPipesEndpointInputs['createUserNotifier']>;
	listUserNotifiers: TurbotPipesEndpoint<'listUserNotifiers', TurbotPipesEndpointInputs['listUserNotifiers']>;
	getOrgWorkspaceNotifier: TurbotPipesEndpoint<'getOrgWorkspaceNotifier', TurbotPipesEndpointInputs['getOrgWorkspaceNotifier']>;
	createUserWorkspaceNotifier: TurbotPipesEndpoint<'createUserWorkspaceNotifier', TurbotPipesEndpointInputs['createUserWorkspaceNotifier']>;
	deleteUserWorkspaceNotifier: TurbotPipesEndpoint<'deleteUserWorkspaceNotifier', TurbotPipesEndpointInputs['deleteUserWorkspaceNotifier']>;
	getUserWorkspaceNotifier: TurbotPipesEndpoint<'getUserWorkspaceNotifier', TurbotPipesEndpointInputs['getUserWorkspaceNotifier']>;
	listUserWorkspaceNotifiers: TurbotPipesEndpoint<'listUserWorkspaceNotifiers', TurbotPipesEndpointInputs['listUserWorkspaceNotifiers']>;
	postUserWorkspaceNotifierCommand: TurbotPipesEndpoint<'postUserWorkspaceNotifierCommand', TurbotPipesEndpointInputs['postUserWorkspaceNotifierCommand']>;
	createUserWorkspaceDatatank: TurbotPipesEndpoint<'createUserWorkspaceDatatank', TurbotPipesEndpointInputs['createUserWorkspaceDatatank']>;
	getUserWorkspaceDatatank: TurbotPipesEndpoint<'getUserWorkspaceDatatank', TurbotPipesEndpointInputs['getUserWorkspaceDatatank']>;
	listUserWorkspaceDatatanks: TurbotPipesEndpoint<'listUserWorkspaceDatatanks', TurbotPipesEndpointInputs['listUserWorkspaceDatatanks']>;
	listOrgWorkspaceDatatanks: TurbotPipesEndpoint<'listOrgWorkspaceDatatanks', TurbotPipesEndpointInputs['listOrgWorkspaceDatatanks']>;
	createUserWorkspaceDatatankTable: TurbotPipesEndpoint<'createUserWorkspaceDatatankTable', TurbotPipesEndpointInputs['createUserWorkspaceDatatankTable']>;
	getDatatankTable: TurbotPipesEndpoint<'getDatatankTable', TurbotPipesEndpointInputs['getDatatankTable']>;
	listUserWorkspaceDatatankTables: TurbotPipesEndpoint<'listUserWorkspaceDatatankTables', TurbotPipesEndpointInputs['listUserWorkspaceDatatankTables']>;
	listUserWorkspaceDatatankPartitions: TurbotPipesEndpoint<'listUserWorkspaceDatatankPartitions', TurbotPipesEndpointInputs['listUserWorkspaceDatatankPartitions']>;
	getUserWorkspaceSchema: TurbotPipesEndpoint<'getUserWorkspaceSchema', TurbotPipesEndpointInputs['getUserWorkspaceSchema']>;
	listUserWorkspaceSchemas: TurbotPipesEndpoint<'listUserWorkspaceSchemas', TurbotPipesEndpointInputs['listUserWorkspaceSchemas']>;
	getUserWorkspaceSchemaTable: TurbotPipesEndpoint<'getUserWorkspaceSchemaTable', TurbotPipesEndpointInputs['getUserWorkspaceSchemaTable']>;
	listUserWorkspaceSchemaTables: TurbotPipesEndpoint<'listUserWorkspaceSchemaTables', TurbotPipesEndpointInputs['listUserWorkspaceSchemaTables']>;
	installUserWorkspaceMod: TurbotPipesEndpoint<'installUserWorkspaceMod', TurbotPipesEndpointInputs['installUserWorkspaceMod']>;
	getUserWorkspaceMod: TurbotPipesEndpoint<'getUserWorkspaceMod', TurbotPipesEndpointInputs['getUserWorkspaceMod']>;
	listUserWorkspaceMods: TurbotPipesEndpoint<'listUserWorkspaceMods', TurbotPipesEndpointInputs['listUserWorkspaceMods']>;
	listOrgWorkspaceMods: TurbotPipesEndpoint<'listOrgWorkspaceMods', TurbotPipesEndpointInputs['listOrgWorkspaceMods']>;
	createUserWorkspaceModVariableSetting: TurbotPipesEndpoint<'createUserWorkspaceModVariableSetting', TurbotPipesEndpointInputs['createUserWorkspaceModVariableSetting']>;
	deleteUserWorkspaceModVariableSetting: TurbotPipesEndpoint<'deleteUserWorkspaceModVariableSetting', TurbotPipesEndpointInputs['deleteUserWorkspaceModVariableSetting']>;
	getUserWorkspaceModVariableSetting: TurbotPipesEndpoint<'getUserWorkspaceModVariableSetting', TurbotPipesEndpointInputs['getUserWorkspaceModVariableSetting']>;
	listUserWorkspaceModVariables: TurbotPipesEndpoint<'listUserWorkspaceModVariables', TurbotPipesEndpointInputs['listUserWorkspaceModVariables']>;
	getOrgWorkspaceModVariableSetting: TurbotPipesEndpoint<'getOrgWorkspaceModVariableSetting', TurbotPipesEndpointInputs['getOrgWorkspaceModVariableSetting']>;
	deleteOrgWorkspaceModVariableSetting: TurbotPipesEndpoint<'deleteOrgWorkspaceModVariableSetting', TurbotPipesEndpointInputs['deleteOrgWorkspaceModVariableSetting']>;
	installUserWorkspaceFlowpipeMod: TurbotPipesEndpoint<'installUserWorkspaceFlowpipeMod', TurbotPipesEndpointInputs['installUserWorkspaceFlowpipeMod']>;
	getUserWorkspaceFlowpipeMod: TurbotPipesEndpoint<'getUserWorkspaceFlowpipeMod', TurbotPipesEndpointInputs['getUserWorkspaceFlowpipeMod']>;
	uninstallFlowpipeMod: TurbotPipesEndpoint<'uninstallFlowpipeMod', TurbotPipesEndpointInputs['uninstallFlowpipeMod']>;
	uninstallOrgWorkspaceFlowpipeMod: TurbotPipesEndpoint<'uninstallOrgWorkspaceFlowpipeMod', TurbotPipesEndpointInputs['uninstallOrgWorkspaceFlowpipeMod']>;
	listOrgWorkspaceFlowpipeModVariables: TurbotPipesEndpoint<'listOrgWorkspaceFlowpipeModVariables', TurbotPipesEndpointInputs['listOrgWorkspaceFlowpipeModVariables']>;
	listUserWorkspaceFlowpipeModVariables: TurbotPipesEndpoint<'listUserWorkspaceFlowpipeModVariables', TurbotPipesEndpointInputs['listUserWorkspaceFlowpipeModVariables']>;
	getUserWorkspaceFlowpipePipeline: TurbotPipesEndpoint<'getUserWorkspaceFlowpipePipeline', TurbotPipesEndpointInputs['getUserWorkspaceFlowpipePipeline']>;
	listUserWorkspaceFlowpipePipelines: TurbotPipesEndpoint<'listUserWorkspaceFlowpipePipelines', TurbotPipesEndpointInputs['listUserWorkspaceFlowpipePipelines']>;
	runUserWorkspaceFlowpipePipelineCommand: TurbotPipesEndpoint<'runUserWorkspaceFlowpipePipelineCommand', TurbotPipesEndpointInputs['runUserWorkspaceFlowpipePipelineCommand']>;
	getOrgWorkspaceFlowpipeTrigger: TurbotPipesEndpoint<'getOrgWorkspaceFlowpipeTrigger', TurbotPipesEndpointInputs['getOrgWorkspaceFlowpipeTrigger']>;
	listUserWorkspaceFlowpipeTriggers: TurbotPipesEndpoint<'listUserWorkspaceFlowpipeTriggers', TurbotPipesEndpointInputs['listUserWorkspaceFlowpipeTriggers']>;
	runUserWorkspaceFlowpipeTriggerCommand: TurbotPipesEndpoint<'runUserWorkspaceFlowpipeTriggerCommand', TurbotPipesEndpointInputs['runUserWorkspaceFlowpipeTriggerCommand']>;
	listUserWorkspaceFlowpipeInputs: TurbotPipesEndpoint<'listUserWorkspaceFlowpipeInputs', TurbotPipesEndpointInputs['listUserWorkspaceFlowpipeInputs']>;
	listUserWorkspacePipelineTriggers: TurbotPipesEndpoint<'listUserWorkspacePipelineTriggers', TurbotPipesEndpointInputs['listUserWorkspacePipelineTriggers']>;
	deleteUserWorkspacePipeline: TurbotPipesEndpoint<'deleteUserWorkspacePipeline', TurbotPipesEndpointInputs['deleteUserWorkspacePipeline']>;
	getUserWorkspacePipeline: TurbotPipesEndpoint<'getUserWorkspacePipeline', TurbotPipesEndpointInputs['getUserWorkspacePipeline']>;
	listUserWorkspacePipelines: TurbotPipesEndpoint<'listUserWorkspacePipelines', TurbotPipesEndpointInputs['listUserWorkspacePipelines']>;
	listOrgWorkspacePipelines: TurbotPipesEndpoint<'listOrgWorkspacePipelines', TurbotPipesEndpointInputs['listOrgWorkspacePipelines']>;
	deleteOrgBillingSubscription: TurbotPipesEndpoint<'deleteOrgBillingSubscription', TurbotPipesEndpointInputs['deleteOrgBillingSubscription']>;
	updateOrgBillingSubscription: TurbotPipesEndpoint<'updateOrgBillingSubscription', TurbotPipesEndpointInputs['updateOrgBillingSubscription']>;
	getOrgBillingInvoice: TurbotPipesEndpoint<'getOrgBillingInvoice', TurbotPipesEndpointInputs['getOrgBillingInvoice']>;
	getUserBillingPlan: TurbotPipesEndpoint<'getUserBillingPlan', TurbotPipesEndpointInputs['getUserBillingPlan']>;
	getUserBillingUpcomingInvoice: TurbotPipesEndpoint<'getUserBillingUpcomingInvoice', TurbotPipesEndpointInputs['getUserBillingUpcomingInvoice']>;
	listUserBillingInvoices: TurbotPipesEndpoint<'listUserBillingInvoices', TurbotPipesEndpointInputs['listUserBillingInvoices']>;
	listUserBillingPaymentMethods: TurbotPipesEndpoint<'listUserBillingPaymentMethods', TurbotPipesEndpointInputs['listUserBillingPaymentMethods']>;
	listUserBillingSubscriptions: TurbotPipesEndpoint<'listUserBillingSubscriptions', TurbotPipesEndpointInputs['listUserBillingSubscriptions']>;
	createUserPassword: TurbotPipesEndpoint<'createUserPassword', TurbotPipesEndpointInputs['createUserPassword']>;
	getUserPassword: TurbotPipesEndpoint<'getUserPassword', TurbotPipesEndpointInputs['getUserPassword']>;
	getUserToken: TurbotPipesEndpoint<'getUserToken', TurbotPipesEndpointInputs['getUserToken']>;
	deleteUserToken: TurbotPipesEndpoint<'deleteUserToken', TurbotPipesEndpointInputs['deleteUserToken']>;
	updateUserToken: TurbotPipesEndpoint<'updateUserToken', TurbotPipesEndpointInputs['updateUserToken']>;
	createSignup: TurbotPipesEndpoint<'createSignup', TurbotPipesEndpointInputs['createSignup']>;
	initiateLogin: TurbotPipesEndpoint<'initiateLogin', TurbotPipesEndpointInputs['initiateLogin']>;
	createLoginTokenEmail: TurbotPipesEndpoint<'createLoginTokenEmail', TurbotPipesEndpointInputs['createLoginTokenEmail']>;
	getAuthProvider: TurbotPipesEndpoint<'getAuthProvider', TurbotPipesEndpointInputs['getAuthProvider']>;
	getTenant: TurbotPipesEndpoint<'getTenant', TurbotPipesEndpointInputs['getTenant']>;
	getTenantAvatar: TurbotPipesEndpoint<'getTenantAvatar', TurbotPipesEndpointInputs['getTenantAvatar']>;
	getTenantSettings: TurbotPipesEndpoint<'getTenantSettings', TurbotPipesEndpointInputs['getTenantSettings']>;
	listTenants: TurbotPipesEndpoint<'listTenants', TurbotPipesEndpointInputs['listTenants']>;
	getIdentity: TurbotPipesEndpoint<'getIdentity', TurbotPipesEndpointInputs['getIdentity']>;
	getIdentityAvatar: TurbotPipesEndpoint<'getIdentityAvatar', TurbotPipesEndpointInputs['getIdentityAvatar']>;
	listIdentities: TurbotPipesEndpoint<'listIdentities', TurbotPipesEndpointInputs['listIdentities']>;
};

const turbotpipesEndpointsNested = {
	actor: {
		get: ActorEndpoints.getActor,
		listWorkspaces: ActorEndpoints.listActorWorkspaces,
		listOrgs: ActorEndpoints.listActorOrgs,
		listConnections: ActorEndpoints.listActorConnections,
		listActivity: ActorEndpoints.listActorActivity,
	},
	users: {
		get: UsersEndpoints.getUser,
		update: UsersEndpoints.updateUser,
		listWorkspaces: UsersEndpoints.listUserWorkspaces,
		getUserWorkspace: UsersEndpoints.getUserWorkspace,
		updateUserWorkspace: UsersEndpoints.updateUserWorkspace,
		runUserWorkspaceCommand: UsersEndpoints.runUserWorkspaceCommand,
		listProcesses: UsersEndpoints.listUserProcesses,
		getUserProcess: UsersEndpoints.getUserProcess,
		listUsage: UsersEndpoints.listUserUsage,
		listConstraints: UsersEndpoints.listUserConstraints,
		listAuditLogs: UsersEndpoints.listUserAuditLogs,
		getUserEmail: UsersEndpoints.getUserEmail,
		listUserEmails: UsersEndpoints.listUserEmails,
		getUserPreferences: UsersEndpoints.getUserPreferences,
		updateUserPreferences: UsersEndpoints.updateUserPreferences,
		deleteUserAvatar: UsersEndpoints.deleteUserAvatar,
	},
	orgs: {
		get: OrgsEndpoints.getOrg,
		delete: OrgsEndpoints.deleteOrg,
		listWorkspaces: OrgsEndpoints.listOrgWorkspaces,
		deleteWorkspace: OrgsEndpoints.deleteOrgWorkspace,
		runWorkspaceCommand: OrgsEndpoints.runOrgWorkspaceCommand,
		listProcesses: OrgsEndpoints.listOrgProcesses,
		listServiceAccounts: OrgsEndpoints.listOrgServiceAccounts,
		updateServiceAccount: OrgsEndpoints.updateOrgServiceAccount,
		updateServiceAccountToken: OrgsEndpoints.updateOrgServiceAccountToken,
		getMember: OrgsEndpoints.getOrgMember,
		updateMemberRole: OrgsEndpoints.updateOrgMemberRole,
		listUsage: OrgsEndpoints.listOrgUsage,
	},
	connections: {
		createUserConnection: ConnectionsEndpoints.createUserConnection,
		getUserConnection: ConnectionsEndpoints.getUserConnection,
		listUserConnections: ConnectionsEndpoints.listUserConnections,
		updateUserConnection: ConnectionsEndpoints.updateUserConnection,
		deleteUserConnectionDeprecated: ConnectionsEndpoints.deleteUserConnectionDeprecated,
		testUserConnection: ConnectionsEndpoints.testUserConnection,
		createOrgConnection: ConnectionsEndpoints.createOrgConnection,
		updateOrgConnection: ConnectionsEndpoints.updateOrgConnection,
		getOrgConnectionPermission: ConnectionsEndpoints.getOrgConnectionPermission,
		deleteOrgConnectionPermission: ConnectionsEndpoints.deleteOrgConnectionPermission,
		createOrgConnectionFolder: ConnectionsEndpoints.createOrgConnectionFolder,
		updateOrgConnectionFolder: ConnectionsEndpoints.updateOrgConnectionFolder,
	},
	workspaces: {
		createUserWorkspaceConnection: WorkspacesEndpoints.createUserWorkspaceConnection,
		getUserWorkspaceConnection: WorkspacesEndpoints.getUserWorkspaceConnection,
		listUserWorkspaceConnections: WorkspacesEndpoints.listUserWorkspaceConnections,
		listUserWorkspaceConnectionAssociations: WorkspacesEndpoints.listUserWorkspaceConnectionAssociations,
		listUserWorkspaceConnectionTree: WorkspacesEndpoints.listUserWorkspaceConnectionTree,
		testUserWorkspaceConnection: WorkspacesEndpoints.testUserWorkspaceConnection,
		createUserWorkspaceConnectionFolder: WorkspacesEndpoints.createUserWorkspaceConnectionFolder,
		getUserWorkspaceConnectionFolder: WorkspacesEndpoints.getUserWorkspaceConnectionFolder,
		listUserWorkspaceConnectionFolders: WorkspacesEndpoints.listUserWorkspaceConnectionFolders,
		createOrgWorkspaceConnection: WorkspacesEndpoints.createOrgWorkspaceConnection,
		getOrgWorkspaceConnection: WorkspacesEndpoints.getOrgWorkspaceConnection,
		createOrgWorkspaceConnectionFolder: WorkspacesEndpoints.createOrgWorkspaceConnectionFolder,
		getOrgWorkspaceConnectionFolder: WorkspacesEndpoints.getOrgWorkspaceConnectionFolder,
		createOrgWorkspaceAggregator: WorkspacesEndpoints.createOrgWorkspaceAggregator,
		getUserWorkspaceAggregator: WorkspacesEndpoints.getUserWorkspaceAggregator,
		listUserWorkspaceAggregators: WorkspacesEndpoints.listUserWorkspaceAggregators,
		listUserWorkspaceAggregatorConnections: WorkspacesEndpoints.listUserWorkspaceAggregatorConnections,
		listUserWorkspaceAuditLogs: WorkspacesEndpoints.listUserWorkspaceAuditLogs,
		listUserWorkspaceDatabaseLogs: WorkspacesEndpoints.listUserWorkspaceDatabaseLogs,
		listUserWorkspaceProcesses: WorkspacesEndpoints.listUserWorkspaceProcesses,
		getUserWorkspaceProcess: WorkspacesEndpoints.getUserWorkspaceProcess,
		getUserWorkspaceProcessLog: WorkspacesEndpoints.getUserWorkspaceProcessLog,
		listOrgWorkspaceProcesses: WorkspacesEndpoints.listOrgWorkspaceProcesses,
		listUserWorkspaceUsage: WorkspacesEndpoints.listUserWorkspaceUsage,
	},
	query: {
		createOrgWorkspaceQuery: QueryEndpoints.createOrgWorkspaceQuery,
		getOrgWorkspaceQueryData: QueryEndpoints.getOrgWorkspaceQueryData,
		createOrgWorkspaceSnapshot: QueryEndpoints.createOrgWorkspaceSnapshot,
		getUserWorkspaceQuery: QueryEndpoints.getUserWorkspaceQuery,
		getUserWorkspaceQueryData: QueryEndpoints.getUserWorkspaceQueryData,
		postUserWorkspaceQuery: QueryEndpoints.postUserWorkspaceQuery,
		runUserWorkspaceQuery: QueryEndpoints.runUserWorkspaceQuery,
		listUserWorkspaceSnapshots: QueryEndpoints.listUserWorkspaceSnapshots,
	},
	ai: {
		createUserAiKey: AiEndpoints.createUserAiKey,
		getUserAiKey: AiEndpoints.getUserAiKey,
		listUserAiKeys: AiEndpoints.listUserAiKeys,
		updateUserAiKey: AiEndpoints.updateUserAiKey,
		testUserAiKey: AiEndpoints.testUserAiKey,
		deleteOrgWorkspaceConversation: AiEndpoints.deleteOrgWorkspaceConversation,
		getUserWorkspaceConversation: AiEndpoints.getUserWorkspaceConversation,
		updateUserWorkspaceConversation: AiEndpoints.updateUserWorkspaceConversation,
		listUserWorkspaceConversations: AiEndpoints.listUserWorkspaceConversations,
		sendUserWorkspaceChatMessage: AiEndpoints.sendUserWorkspaceChatMessage,
	},
	integrations: {
		createUserIntegration: IntegrationsEndpoints.createUserIntegration,
		deleteUserIntegration: IntegrationsEndpoints.deleteUserIntegration,
		getUserIntegration: IntegrationsEndpoints.getUserIntegration,
		listUserIntegrations: IntegrationsEndpoints.listUserIntegrations,
		updateUserIntegration: IntegrationsEndpoints.updateUserIntegration,
		testUserIntegration: IntegrationsEndpoints.testUserIntegration,
		getOrgWorkspaceIntegration: IntegrationsEndpoints.getOrgWorkspaceIntegration,
		getOrgIntegration: IntegrationsEndpoints.getOrgIntegration,
		getUserWorkspaceIntegration: IntegrationsEndpoints.getUserWorkspaceIntegration,
		listUserWorkspaceIntegrations: IntegrationsEndpoints.listUserWorkspaceIntegrations,
		installUserSlackIntegration: IntegrationsEndpoints.installUserSlackIntegration,
	},
	notifiers: {
		createUserNotifier: NotifiersEndpoints.createUserNotifier,
		listUserNotifiers: NotifiersEndpoints.listUserNotifiers,
		getOrgWorkspaceNotifier: NotifiersEndpoints.getOrgWorkspaceNotifier,
		createUserWorkspaceNotifier: NotifiersEndpoints.createUserWorkspaceNotifier,
		deleteUserWorkspaceNotifier: NotifiersEndpoints.deleteUserWorkspaceNotifier,
		getUserWorkspaceNotifier: NotifiersEndpoints.getUserWorkspaceNotifier,
		listUserWorkspaceNotifiers: NotifiersEndpoints.listUserWorkspaceNotifiers,
		postUserWorkspaceNotifierCommand: NotifiersEndpoints.postUserWorkspaceNotifierCommand,
	},
	datatanks: {
		createUserWorkspaceDatatank: DatatanksEndpoints.createUserWorkspaceDatatank,
		getUserWorkspaceDatatank: DatatanksEndpoints.getUserWorkspaceDatatank,
		listUserWorkspaceDatatanks: DatatanksEndpoints.listUserWorkspaceDatatanks,
		listOrgWorkspaceDatatanks: DatatanksEndpoints.listOrgWorkspaceDatatanks,
		createUserWorkspaceDatatankTable: DatatanksEndpoints.createUserWorkspaceDatatankTable,
		getDatatankTable: DatatanksEndpoints.getDatatankTable,
		listUserWorkspaceDatatankTables: DatatanksEndpoints.listUserWorkspaceDatatankTables,
		listUserWorkspaceDatatankPartitions: DatatanksEndpoints.listUserWorkspaceDatatankPartitions,
		getUserWorkspaceSchema: DatatanksEndpoints.getUserWorkspaceSchema,
		listUserWorkspaceSchemas: DatatanksEndpoints.listUserWorkspaceSchemas,
		getUserWorkspaceSchemaTable: DatatanksEndpoints.getUserWorkspaceSchemaTable,
		listUserWorkspaceSchemaTables: DatatanksEndpoints.listUserWorkspaceSchemaTables,
	},
	mods: {
		installUserWorkspaceMod: ModsEndpoints.installUserWorkspaceMod,
		getUserWorkspaceMod: ModsEndpoints.getUserWorkspaceMod,
		listUserWorkspaceMods: ModsEndpoints.listUserWorkspaceMods,
		listOrgWorkspaceMods: ModsEndpoints.listOrgWorkspaceMods,
		createUserWorkspaceModVariableSetting: ModsEndpoints.createUserWorkspaceModVariableSetting,
		deleteUserWorkspaceModVariableSetting: ModsEndpoints.deleteUserWorkspaceModVariableSetting,
		getUserWorkspaceModVariableSetting: ModsEndpoints.getUserWorkspaceModVariableSetting,
		listUserWorkspaceModVariables: ModsEndpoints.listUserWorkspaceModVariables,
		getOrgWorkspaceModVariableSetting: ModsEndpoints.getOrgWorkspaceModVariableSetting,
		deleteOrgWorkspaceModVariableSetting: ModsEndpoints.deleteOrgWorkspaceModVariableSetting,
	},
	pipelines: {
		installUserWorkspaceFlowpipeMod: PipelinesEndpoints.installUserWorkspaceFlowpipeMod,
		getUserWorkspaceFlowpipeMod: PipelinesEndpoints.getUserWorkspaceFlowpipeMod,
		uninstallFlowpipeMod: PipelinesEndpoints.uninstallFlowpipeMod,
		uninstallOrgWorkspaceFlowpipeMod: PipelinesEndpoints.uninstallOrgWorkspaceFlowpipeMod,
		listOrgWorkspaceFlowpipeModVariables: PipelinesEndpoints.listOrgWorkspaceFlowpipeModVariables,
		listUserWorkspaceFlowpipeModVariables: PipelinesEndpoints.listUserWorkspaceFlowpipeModVariables,
		getUserWorkspaceFlowpipePipeline: PipelinesEndpoints.getUserWorkspaceFlowpipePipeline,
		listUserWorkspaceFlowpipePipelines: PipelinesEndpoints.listUserWorkspaceFlowpipePipelines,
		runUserWorkspaceFlowpipePipelineCommand: PipelinesEndpoints.runUserWorkspaceFlowpipePipelineCommand,
		getOrgWorkspaceFlowpipeTrigger: PipelinesEndpoints.getOrgWorkspaceFlowpipeTrigger,
		listUserWorkspaceFlowpipeTriggers: PipelinesEndpoints.listUserWorkspaceFlowpipeTriggers,
		runUserWorkspaceFlowpipeTriggerCommand: PipelinesEndpoints.runUserWorkspaceFlowpipeTriggerCommand,
		listUserWorkspaceFlowpipeInputs: PipelinesEndpoints.listUserWorkspaceFlowpipeInputs,
		listUserWorkspacePipelineTriggers: PipelinesEndpoints.listUserWorkspacePipelineTriggers,
		deleteUserWorkspacePipeline: PipelinesEndpoints.deleteUserWorkspacePipeline,
		getUserWorkspacePipeline: PipelinesEndpoints.getUserWorkspacePipeline,
		listUserWorkspacePipelines: PipelinesEndpoints.listUserWorkspacePipelines,
		listOrgWorkspacePipelines: PipelinesEndpoints.listOrgWorkspacePipelines,
	},
	billing: {
		deleteOrgBillingSubscription: BillingEndpoints.deleteOrgBillingSubscription,
		updateOrgBillingSubscription: BillingEndpoints.updateOrgBillingSubscription,
		getOrgBillingInvoice: BillingEndpoints.getOrgBillingInvoice,
		getUserBillingPlan: BillingEndpoints.getUserBillingPlan,
		getUserBillingUpcomingInvoice: BillingEndpoints.getUserBillingUpcomingInvoice,
		listUserBillingInvoices: BillingEndpoints.listUserBillingInvoices,
		listUserBillingPaymentMethods: BillingEndpoints.listUserBillingPaymentMethods,
		listUserBillingSubscriptions: BillingEndpoints.listUserBillingSubscriptions,
	},
	auth: {
		createUserPassword: AuthEndpoints.createUserPassword,
		getUserPassword: AuthEndpoints.getUserPassword,
		getUserToken: AuthEndpoints.getUserToken,
		deleteUserToken: AuthEndpoints.deleteUserToken,
		updateUserToken: AuthEndpoints.updateUserToken,
		createSignup: AuthEndpoints.createSignup,
		initiateLogin: AuthEndpoints.initiateLogin,
		createLoginTokenEmail: AuthEndpoints.createLoginTokenEmail,
		getAuthProvider: AuthEndpoints.getAuthProvider,
	},
	tenants: {
		getTenant: TenantsEndpoints.getTenant,
		getTenantAvatar: TenantsEndpoints.getTenantAvatar,
		getTenantSettings: TenantsEndpoints.getTenantSettings,
		listTenants: TenantsEndpoints.listTenants,
	},
	identities: {
		getIdentity: IdentitiesEndpoints.getIdentity,
		getIdentityAvatar: IdentitiesEndpoints.getIdentityAvatar,
		listIdentities: IdentitiesEndpoints.listIdentities,
	},
} as const;

export const turbotpipesEndpointSchemas = {
	'actor.get': {
		input: TurbotPipesEndpointInputSchemas.actorGet,
		output: TurbotPipesEndpointOutputSchemas.actorGet,
	},
	'actor.listWorkspaces': {
		input: TurbotPipesEndpointInputSchemas.actorListWorkspaces,
		output: TurbotPipesEndpointOutputSchemas.actorListWorkspaces,
	},
	'actor.listOrgs': {
		input: TurbotPipesEndpointInputSchemas.actorListOrgs,
		output: TurbotPipesEndpointOutputSchemas.actorListOrgs,
	},
	'actor.listConnections': {
		input: TurbotPipesEndpointInputSchemas.actorListConnections,
		output: TurbotPipesEndpointOutputSchemas.actorListConnections,
	},
	'actor.listActivity': {
		input: TurbotPipesEndpointInputSchemas.actorListActivity,
		output: TurbotPipesEndpointOutputSchemas.actorListActivity,
	},
	'users.get': {
		input: TurbotPipesEndpointInputSchemas.getUser,
		output: TurbotPipesEndpointOutputSchemas.getUser,
	},
	'users.update': {
		input: TurbotPipesEndpointInputSchemas.updateUser,
		output: TurbotPipesEndpointOutputSchemas.updateUser,
	},
	'users.listWorkspaces': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaces,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaces,
	},
	'users.getUserWorkspace': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspace,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspace,
	},
	'users.updateUserWorkspace': {
		input: TurbotPipesEndpointInputSchemas.updateUserWorkspace,
		output: TurbotPipesEndpointOutputSchemas.updateUserWorkspace,
	},
	'users.runUserWorkspaceCommand': {
		input: TurbotPipesEndpointInputSchemas.runUserWorkspaceCommand,
		output: TurbotPipesEndpointOutputSchemas.runUserWorkspaceCommand,
	},
	'users.listProcesses': {
		input: TurbotPipesEndpointInputSchemas.listUserProcesses,
		output: TurbotPipesEndpointOutputSchemas.listUserProcesses,
	},
	'users.getUserProcess': {
		input: TurbotPipesEndpointInputSchemas.getUserProcess,
		output: TurbotPipesEndpointOutputSchemas.getUserProcess,
	},
	'users.listUsage': {
		input: TurbotPipesEndpointInputSchemas.listUserUsage,
		output: TurbotPipesEndpointOutputSchemas.listUserUsage,
	},
	'users.listConstraints': {
		input: TurbotPipesEndpointInputSchemas.listUserConstraints,
		output: TurbotPipesEndpointOutputSchemas.listUserConstraints,
	},
	'users.listAuditLogs': {
		input: TurbotPipesEndpointInputSchemas.listUserAuditLogs,
		output: TurbotPipesEndpointOutputSchemas.listUserAuditLogs,
	},
	'users.getUserEmail': {
		input: TurbotPipesEndpointInputSchemas.getUserEmail,
		output: TurbotPipesEndpointOutputSchemas.getUserEmail,
	},
	'users.listUserEmails': {
		input: TurbotPipesEndpointInputSchemas.listUserEmails,
		output: TurbotPipesEndpointOutputSchemas.listUserEmails,
	},
	'users.getUserPreferences': {
		input: TurbotPipesEndpointInputSchemas.getUserPreferences,
		output: TurbotPipesEndpointOutputSchemas.getUserPreferences,
	},
	'users.updateUserPreferences': {
		input: TurbotPipesEndpointInputSchemas.updateUserPreferences,
		output: TurbotPipesEndpointOutputSchemas.updateUserPreferences,
	},
	'users.deleteUserAvatar': {
		input: TurbotPipesEndpointInputSchemas.deleteUserAvatar,
		output: TurbotPipesEndpointOutputSchemas.deleteUserAvatar,
	},
	'orgs.get': {
		input: TurbotPipesEndpointInputSchemas.getOrg,
		output: TurbotPipesEndpointOutputSchemas.getOrg,
	},
	'orgs.delete': {
		input: TurbotPipesEndpointInputSchemas.deleteOrg,
		output: TurbotPipesEndpointOutputSchemas.deleteOrg,
	},
	'orgs.listWorkspaces': {
		input: TurbotPipesEndpointInputSchemas.listOrgWorkspaces,
		output: TurbotPipesEndpointOutputSchemas.listOrgWorkspaces,
	},
	'orgs.deleteWorkspace': {
		input: TurbotPipesEndpointInputSchemas.deleteOrgWorkspace,
		output: TurbotPipesEndpointOutputSchemas.deleteOrgWorkspace,
	},
	'orgs.runWorkspaceCommand': {
		input: TurbotPipesEndpointInputSchemas.runOrgWorkspaceCommand,
		output: TurbotPipesEndpointOutputSchemas.runOrgWorkspaceCommand,
	},
	'orgs.listProcesses': {
		input: TurbotPipesEndpointInputSchemas.listOrgProcesses,
		output: TurbotPipesEndpointOutputSchemas.listOrgProcesses,
	},
	'orgs.listServiceAccounts': {
		input: TurbotPipesEndpointInputSchemas.listOrgServiceAccounts,
		output: TurbotPipesEndpointOutputSchemas.listOrgServiceAccounts,
	},
	'orgs.updateServiceAccount': {
		input: TurbotPipesEndpointInputSchemas.updateOrgServiceAccount,
		output: TurbotPipesEndpointOutputSchemas.updateOrgServiceAccount,
	},
	'orgs.updateServiceAccountToken': {
		input: TurbotPipesEndpointInputSchemas.updateOrgServiceAccountToken,
		output: TurbotPipesEndpointOutputSchemas.updateOrgServiceAccountToken,
	},
	'orgs.getMember': {
		input: TurbotPipesEndpointInputSchemas.getOrgMember,
		output: TurbotPipesEndpointOutputSchemas.getOrgMember,
	},
	'orgs.updateMemberRole': {
		input: TurbotPipesEndpointInputSchemas.updateOrgMemberRole,
		output: TurbotPipesEndpointOutputSchemas.updateOrgMemberRole,
	},
	'orgs.listUsage': {
		input: TurbotPipesEndpointInputSchemas.listOrgUsage,
		output: TurbotPipesEndpointOutputSchemas.listOrgUsage,
	},
	'connections.createUserConnection': {
		input: TurbotPipesEndpointInputSchemas.createUserConnection,
		output: TurbotPipesEndpointOutputSchemas.createUserConnection,
	},
	'connections.getUserConnection': {
		input: TurbotPipesEndpointInputSchemas.getUserConnection,
		output: TurbotPipesEndpointOutputSchemas.getUserConnection,
	},
	'connections.listUserConnections': {
		input: TurbotPipesEndpointInputSchemas.listUserConnections,
		output: TurbotPipesEndpointOutputSchemas.listUserConnections,
	},
	'connections.updateUserConnection': {
		input: TurbotPipesEndpointInputSchemas.updateUserConnection,
		output: TurbotPipesEndpointOutputSchemas.updateUserConnection,
	},
	'connections.deleteUserConnectionDeprecated': {
		input: TurbotPipesEndpointInputSchemas.deleteUserConnectionDeprecated,
		output: TurbotPipesEndpointOutputSchemas.deleteUserConnectionDeprecated,
	},
	'connections.testUserConnection': {
		input: TurbotPipesEndpointInputSchemas.testUserConnection,
		output: TurbotPipesEndpointOutputSchemas.testUserConnection,
	},
	'connections.createOrgConnection': {
		input: TurbotPipesEndpointInputSchemas.createOrgConnection,
		output: TurbotPipesEndpointOutputSchemas.createOrgConnection,
	},
	'connections.updateOrgConnection': {
		input: TurbotPipesEndpointInputSchemas.updateOrgConnection,
		output: TurbotPipesEndpointOutputSchemas.updateOrgConnection,
	},
	'connections.getOrgConnectionPermission': {
		input: TurbotPipesEndpointInputSchemas.getOrgConnectionPermission,
		output: TurbotPipesEndpointOutputSchemas.getOrgConnectionPermission,
	},
	'connections.deleteOrgConnectionPermission': {
		input: TurbotPipesEndpointInputSchemas.deleteOrgConnectionPermission,
		output: TurbotPipesEndpointOutputSchemas.deleteOrgConnectionPermission,
	},
	'connections.createOrgConnectionFolder': {
		input: TurbotPipesEndpointInputSchemas.createOrgConnectionFolder,
		output: TurbotPipesEndpointOutputSchemas.createOrgConnectionFolder,
	},
	'connections.updateOrgConnectionFolder': {
		input: TurbotPipesEndpointInputSchemas.updateOrgConnectionFolder,
		output: TurbotPipesEndpointOutputSchemas.updateOrgConnectionFolder,
	},
	'workspaces.createUserWorkspaceConnection': {
		input: TurbotPipesEndpointInputSchemas.createUserWorkspaceConnection,
		output: TurbotPipesEndpointOutputSchemas.createUserWorkspaceConnection,
	},
	'workspaces.getUserWorkspaceConnection': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceConnection,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceConnection,
	},
	'workspaces.listUserWorkspaceConnections': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceConnections,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceConnections,
	},
	'workspaces.listUserWorkspaceConnectionAssociations': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceConnectionAssociations,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceConnectionAssociations,
	},
	'workspaces.listUserWorkspaceConnectionTree': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceConnectionTree,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceConnectionTree,
	},
	'workspaces.testUserWorkspaceConnection': {
		input: TurbotPipesEndpointInputSchemas.testUserWorkspaceConnection,
		output: TurbotPipesEndpointOutputSchemas.testUserWorkspaceConnection,
	},
	'workspaces.createUserWorkspaceConnectionFolder': {
		input: TurbotPipesEndpointInputSchemas.createUserWorkspaceConnectionFolder,
		output: TurbotPipesEndpointOutputSchemas.createUserWorkspaceConnectionFolder,
	},
	'workspaces.getUserWorkspaceConnectionFolder': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceConnectionFolder,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceConnectionFolder,
	},
	'workspaces.listUserWorkspaceConnectionFolders': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceConnectionFolders,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceConnectionFolders,
	},
	'workspaces.createOrgWorkspaceConnection': {
		input: TurbotPipesEndpointInputSchemas.createOrgWorkspaceConnection,
		output: TurbotPipesEndpointOutputSchemas.createOrgWorkspaceConnection,
	},
	'workspaces.getOrgWorkspaceConnection': {
		input: TurbotPipesEndpointInputSchemas.getOrgWorkspaceConnection,
		output: TurbotPipesEndpointOutputSchemas.getOrgWorkspaceConnection,
	},
	'workspaces.createOrgWorkspaceConnectionFolder': {
		input: TurbotPipesEndpointInputSchemas.createOrgWorkspaceConnectionFolder,
		output: TurbotPipesEndpointOutputSchemas.createOrgWorkspaceConnectionFolder,
	},
	'workspaces.getOrgWorkspaceConnectionFolder': {
		input: TurbotPipesEndpointInputSchemas.getOrgWorkspaceConnectionFolder,
		output: TurbotPipesEndpointOutputSchemas.getOrgWorkspaceConnectionFolder,
	},
	'workspaces.createOrgWorkspaceAggregator': {
		input: TurbotPipesEndpointInputSchemas.createOrgWorkspaceAggregator,
		output: TurbotPipesEndpointOutputSchemas.createOrgWorkspaceAggregator,
	},
	'workspaces.getUserWorkspaceAggregator': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceAggregator,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceAggregator,
	},
	'workspaces.listUserWorkspaceAggregators': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceAggregators,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceAggregators,
	},
	'workspaces.listUserWorkspaceAggregatorConnections': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceAggregatorConnections,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceAggregatorConnections,
	},
	'workspaces.listUserWorkspaceAuditLogs': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceAuditLogs,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceAuditLogs,
	},
	'workspaces.listUserWorkspaceDatabaseLogs': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceDatabaseLogs,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceDatabaseLogs,
	},
	'workspaces.listUserWorkspaceProcesses': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceProcesses,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceProcesses,
	},
	'workspaces.getUserWorkspaceProcess': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceProcess,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceProcess,
	},
	'workspaces.getUserWorkspaceProcessLog': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceProcessLog,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceProcessLog,
	},
	'workspaces.listOrgWorkspaceProcesses': {
		input: TurbotPipesEndpointInputSchemas.listOrgWorkspaceProcesses,
		output: TurbotPipesEndpointOutputSchemas.listOrgWorkspaceProcesses,
	},
	'workspaces.listUserWorkspaceUsage': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceUsage,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceUsage,
	},
	'query.createOrgWorkspaceQuery': {
		input: TurbotPipesEndpointInputSchemas.createOrgWorkspaceQuery,
		output: TurbotPipesEndpointOutputSchemas.createOrgWorkspaceQuery,
	},
	'query.getOrgWorkspaceQueryData': {
		input: TurbotPipesEndpointInputSchemas.getOrgWorkspaceQueryData,
		output: TurbotPipesEndpointOutputSchemas.getOrgWorkspaceQueryData,
	},
	'query.createOrgWorkspaceSnapshot': {
		input: TurbotPipesEndpointInputSchemas.createOrgWorkspaceSnapshot,
		output: TurbotPipesEndpointOutputSchemas.createOrgWorkspaceSnapshot,
	},
	'query.getUserWorkspaceQuery': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceQuery,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceQuery,
	},
	'query.getUserWorkspaceQueryData': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceQueryData,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceQueryData,
	},
	'query.postUserWorkspaceQuery': {
		input: TurbotPipesEndpointInputSchemas.postUserWorkspaceQuery,
		output: TurbotPipesEndpointOutputSchemas.postUserWorkspaceQuery,
	},
	'query.runUserWorkspaceQuery': {
		input: TurbotPipesEndpointInputSchemas.runUserWorkspaceQuery,
		output: TurbotPipesEndpointOutputSchemas.runUserWorkspaceQuery,
	},
	'query.listUserWorkspaceSnapshots': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceSnapshots,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceSnapshots,
	},
	'ai.createUserAiKey': {
		input: TurbotPipesEndpointInputSchemas.createUserAiKey,
		output: TurbotPipesEndpointOutputSchemas.createUserAiKey,
	},
	'ai.getUserAiKey': {
		input: TurbotPipesEndpointInputSchemas.getUserAiKey,
		output: TurbotPipesEndpointOutputSchemas.getUserAiKey,
	},
	'ai.listUserAiKeys': {
		input: TurbotPipesEndpointInputSchemas.listUserAiKeys,
		output: TurbotPipesEndpointOutputSchemas.listUserAiKeys,
	},
	'ai.updateUserAiKey': {
		input: TurbotPipesEndpointInputSchemas.updateUserAiKey,
		output: TurbotPipesEndpointOutputSchemas.updateUserAiKey,
	},
	'ai.testUserAiKey': {
		input: TurbotPipesEndpointInputSchemas.testUserAiKey,
		output: TurbotPipesEndpointOutputSchemas.testUserAiKey,
	},
	'ai.deleteOrgWorkspaceConversation': {
		input: TurbotPipesEndpointInputSchemas.deleteOrgWorkspaceConversation,
		output: TurbotPipesEndpointOutputSchemas.deleteOrgWorkspaceConversation,
	},
	'ai.getUserWorkspaceConversation': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceConversation,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceConversation,
	},
	'ai.updateUserWorkspaceConversation': {
		input: TurbotPipesEndpointInputSchemas.updateUserWorkspaceConversation,
		output: TurbotPipesEndpointOutputSchemas.updateUserWorkspaceConversation,
	},
	'ai.listUserWorkspaceConversations': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceConversations,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceConversations,
	},
	'ai.sendUserWorkspaceChatMessage': {
		input: TurbotPipesEndpointInputSchemas.sendUserWorkspaceChatMessage,
		output: TurbotPipesEndpointOutputSchemas.sendUserWorkspaceChatMessage,
	},
	'integrations.createUserIntegration': {
		input: TurbotPipesEndpointInputSchemas.createUserIntegration,
		output: TurbotPipesEndpointOutputSchemas.createUserIntegration,
	},
	'integrations.deleteUserIntegration': {
		input: TurbotPipesEndpointInputSchemas.deleteUserIntegration,
		output: TurbotPipesEndpointOutputSchemas.deleteUserIntegration,
	},
	'integrations.getUserIntegration': {
		input: TurbotPipesEndpointInputSchemas.getUserIntegration,
		output: TurbotPipesEndpointOutputSchemas.getUserIntegration,
	},
	'integrations.listUserIntegrations': {
		input: TurbotPipesEndpointInputSchemas.listUserIntegrations,
		output: TurbotPipesEndpointOutputSchemas.listUserIntegrations,
	},
	'integrations.updateUserIntegration': {
		input: TurbotPipesEndpointInputSchemas.updateUserIntegration,
		output: TurbotPipesEndpointOutputSchemas.updateUserIntegration,
	},
	'integrations.testUserIntegration': {
		input: TurbotPipesEndpointInputSchemas.testUserIntegration,
		output: TurbotPipesEndpointOutputSchemas.testUserIntegration,
	},
	'integrations.getOrgWorkspaceIntegration': {
		input: TurbotPipesEndpointInputSchemas.getOrgWorkspaceIntegration,
		output: TurbotPipesEndpointOutputSchemas.getOrgWorkspaceIntegration,
	},
	'integrations.getOrgIntegration': {
		input: TurbotPipesEndpointInputSchemas.getOrgIntegration,
		output: TurbotPipesEndpointOutputSchemas.getOrgIntegration,
	},
	'integrations.getUserWorkspaceIntegration': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceIntegration,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceIntegration,
	},
	'integrations.listUserWorkspaceIntegrations': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceIntegrations,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceIntegrations,
	},
	'integrations.installUserSlackIntegration': {
		input: TurbotPipesEndpointInputSchemas.installUserSlackIntegration,
		output: TurbotPipesEndpointOutputSchemas.installUserSlackIntegration,
	},
	'notifiers.createUserNotifier': {
		input: TurbotPipesEndpointInputSchemas.createUserNotifier,
		output: TurbotPipesEndpointOutputSchemas.createUserNotifier,
	},
	'notifiers.listUserNotifiers': {
		input: TurbotPipesEndpointInputSchemas.listUserNotifiers,
		output: TurbotPipesEndpointOutputSchemas.listUserNotifiers,
	},
	'notifiers.getOrgWorkspaceNotifier': {
		input: TurbotPipesEndpointInputSchemas.getOrgWorkspaceNotifier,
		output: TurbotPipesEndpointOutputSchemas.getOrgWorkspaceNotifier,
	},
	'notifiers.createUserWorkspaceNotifier': {
		input: TurbotPipesEndpointInputSchemas.createUserWorkspaceNotifier,
		output: TurbotPipesEndpointOutputSchemas.createUserWorkspaceNotifier,
	},
	'notifiers.deleteUserWorkspaceNotifier': {
		input: TurbotPipesEndpointInputSchemas.deleteUserWorkspaceNotifier,
		output: TurbotPipesEndpointOutputSchemas.deleteUserWorkspaceNotifier,
	},
	'notifiers.getUserWorkspaceNotifier': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceNotifier,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceNotifier,
	},
	'notifiers.listUserWorkspaceNotifiers': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceNotifiers,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceNotifiers,
	},
	'notifiers.postUserWorkspaceNotifierCommand': {
		input: TurbotPipesEndpointInputSchemas.postUserWorkspaceNotifierCommand,
		output: TurbotPipesEndpointOutputSchemas.postUserWorkspaceNotifierCommand,
	},
	'datatanks.createUserWorkspaceDatatank': {
		input: TurbotPipesEndpointInputSchemas.createUserWorkspaceDatatank,
		output: TurbotPipesEndpointOutputSchemas.createUserWorkspaceDatatank,
	},
	'datatanks.getUserWorkspaceDatatank': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceDatatank,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceDatatank,
	},
	'datatanks.listUserWorkspaceDatatanks': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceDatatanks,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceDatatanks,
	},
	'datatanks.listOrgWorkspaceDatatanks': {
		input: TurbotPipesEndpointInputSchemas.listOrgWorkspaceDatatanks,
		output: TurbotPipesEndpointOutputSchemas.listOrgWorkspaceDatatanks,
	},
	'datatanks.createUserWorkspaceDatatankTable': {
		input: TurbotPipesEndpointInputSchemas.createUserWorkspaceDatatankTable,
		output: TurbotPipesEndpointOutputSchemas.createUserWorkspaceDatatankTable,
	},
	'datatanks.getDatatankTable': {
		input: TurbotPipesEndpointInputSchemas.getDatatankTable,
		output: TurbotPipesEndpointOutputSchemas.getDatatankTable,
	},
	'datatanks.listUserWorkspaceDatatankTables': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceDatatankTables,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceDatatankTables,
	},
	'datatanks.listUserWorkspaceDatatankPartitions': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceDatatankPartitions,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceDatatankPartitions,
	},
	'datatanks.getUserWorkspaceSchema': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceSchema,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceSchema,
	},
	'datatanks.listUserWorkspaceSchemas': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceSchemas,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceSchemas,
	},
	'datatanks.getUserWorkspaceSchemaTable': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceSchemaTable,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceSchemaTable,
	},
	'datatanks.listUserWorkspaceSchemaTables': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceSchemaTables,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceSchemaTables,
	},
	'mods.installUserWorkspaceMod': {
		input: TurbotPipesEndpointInputSchemas.installUserWorkspaceMod,
		output: TurbotPipesEndpointOutputSchemas.installUserWorkspaceMod,
	},
	'mods.getUserWorkspaceMod': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceMod,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceMod,
	},
	'mods.listUserWorkspaceMods': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceMods,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceMods,
	},
	'mods.listOrgWorkspaceMods': {
		input: TurbotPipesEndpointInputSchemas.listOrgWorkspaceMods,
		output: TurbotPipesEndpointOutputSchemas.listOrgWorkspaceMods,
	},
	'mods.createUserWorkspaceModVariableSetting': {
		input: TurbotPipesEndpointInputSchemas.createUserWorkspaceModVariableSetting,
		output: TurbotPipesEndpointOutputSchemas.createUserWorkspaceModVariableSetting,
	},
	'mods.deleteUserWorkspaceModVariableSetting': {
		input: TurbotPipesEndpointInputSchemas.deleteUserWorkspaceModVariableSetting,
		output: TurbotPipesEndpointOutputSchemas.deleteUserWorkspaceModVariableSetting,
	},
	'mods.getUserWorkspaceModVariableSetting': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceModVariableSetting,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceModVariableSetting,
	},
	'mods.listUserWorkspaceModVariables': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceModVariables,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceModVariables,
	},
	'mods.getOrgWorkspaceModVariableSetting': {
		input: TurbotPipesEndpointInputSchemas.getOrgWorkspaceModVariableSetting,
		output: TurbotPipesEndpointOutputSchemas.getOrgWorkspaceModVariableSetting,
	},
	'mods.deleteOrgWorkspaceModVariableSetting': {
		input: TurbotPipesEndpointInputSchemas.deleteOrgWorkspaceModVariableSetting,
		output: TurbotPipesEndpointOutputSchemas.deleteOrgWorkspaceModVariableSetting,
	},
	'pipelines.installUserWorkspaceFlowpipeMod': {
		input: TurbotPipesEndpointInputSchemas.installUserWorkspaceFlowpipeMod,
		output: TurbotPipesEndpointOutputSchemas.installUserWorkspaceFlowpipeMod,
	},
	'pipelines.getUserWorkspaceFlowpipeMod': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceFlowpipeMod,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceFlowpipeMod,
	},
	'pipelines.uninstallFlowpipeMod': {
		input: TurbotPipesEndpointInputSchemas.uninstallFlowpipeMod,
		output: TurbotPipesEndpointOutputSchemas.uninstallFlowpipeMod,
	},
	'pipelines.uninstallOrgWorkspaceFlowpipeMod': {
		input: TurbotPipesEndpointInputSchemas.uninstallOrgWorkspaceFlowpipeMod,
		output: TurbotPipesEndpointOutputSchemas.uninstallOrgWorkspaceFlowpipeMod,
	},
	'pipelines.listOrgWorkspaceFlowpipeModVariables': {
		input: TurbotPipesEndpointInputSchemas.listOrgWorkspaceFlowpipeModVariables,
		output: TurbotPipesEndpointOutputSchemas.listOrgWorkspaceFlowpipeModVariables,
	},
	'pipelines.listUserWorkspaceFlowpipeModVariables': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceFlowpipeModVariables,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceFlowpipeModVariables,
	},
	'pipelines.getUserWorkspaceFlowpipePipeline': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspaceFlowpipePipeline,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspaceFlowpipePipeline,
	},
	'pipelines.listUserWorkspaceFlowpipePipelines': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceFlowpipePipelines,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceFlowpipePipelines,
	},
	'pipelines.runUserWorkspaceFlowpipePipelineCommand': {
		input: TurbotPipesEndpointInputSchemas.runUserWorkspaceFlowpipePipelineCommand,
		output: TurbotPipesEndpointOutputSchemas.runUserWorkspaceFlowpipePipelineCommand,
	},
	'pipelines.getOrgWorkspaceFlowpipeTrigger': {
		input: TurbotPipesEndpointInputSchemas.getOrgWorkspaceFlowpipeTrigger,
		output: TurbotPipesEndpointOutputSchemas.getOrgWorkspaceFlowpipeTrigger,
	},
	'pipelines.listUserWorkspaceFlowpipeTriggers': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceFlowpipeTriggers,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceFlowpipeTriggers,
	},
	'pipelines.runUserWorkspaceFlowpipeTriggerCommand': {
		input: TurbotPipesEndpointInputSchemas.runUserWorkspaceFlowpipeTriggerCommand,
		output: TurbotPipesEndpointOutputSchemas.runUserWorkspaceFlowpipeTriggerCommand,
	},
	'pipelines.listUserWorkspaceFlowpipeInputs': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspaceFlowpipeInputs,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspaceFlowpipeInputs,
	},
	'pipelines.listUserWorkspacePipelineTriggers': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspacePipelineTriggers,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspacePipelineTriggers,
	},
	'pipelines.deleteUserWorkspacePipeline': {
		input: TurbotPipesEndpointInputSchemas.deleteUserWorkspacePipeline,
		output: TurbotPipesEndpointOutputSchemas.deleteUserWorkspacePipeline,
	},
	'pipelines.getUserWorkspacePipeline': {
		input: TurbotPipesEndpointInputSchemas.getUserWorkspacePipeline,
		output: TurbotPipesEndpointOutputSchemas.getUserWorkspacePipeline,
	},
	'pipelines.listUserWorkspacePipelines': {
		input: TurbotPipesEndpointInputSchemas.listUserWorkspacePipelines,
		output: TurbotPipesEndpointOutputSchemas.listUserWorkspacePipelines,
	},
	'pipelines.listOrgWorkspacePipelines': {
		input: TurbotPipesEndpointInputSchemas.listOrgWorkspacePipelines,
		output: TurbotPipesEndpointOutputSchemas.listOrgWorkspacePipelines,
	},
	'billing.deleteOrgBillingSubscription': {
		input: TurbotPipesEndpointInputSchemas.deleteOrgBillingSubscription,
		output: TurbotPipesEndpointOutputSchemas.deleteOrgBillingSubscription,
	},
	'billing.updateOrgBillingSubscription': {
		input: TurbotPipesEndpointInputSchemas.updateOrgBillingSubscription,
		output: TurbotPipesEndpointOutputSchemas.updateOrgBillingSubscription,
	},
	'billing.getOrgBillingInvoice': {
		input: TurbotPipesEndpointInputSchemas.getOrgBillingInvoice,
		output: TurbotPipesEndpointOutputSchemas.getOrgBillingInvoice,
	},
	'billing.getUserBillingPlan': {
		input: TurbotPipesEndpointInputSchemas.getUserBillingPlan,
		output: TurbotPipesEndpointOutputSchemas.getUserBillingPlan,
	},
	'billing.getUserBillingUpcomingInvoice': {
		input: TurbotPipesEndpointInputSchemas.getUserBillingUpcomingInvoice,
		output: TurbotPipesEndpointOutputSchemas.getUserBillingUpcomingInvoice,
	},
	'billing.listUserBillingInvoices': {
		input: TurbotPipesEndpointInputSchemas.listUserBillingInvoices,
		output: TurbotPipesEndpointOutputSchemas.listUserBillingInvoices,
	},
	'billing.listUserBillingPaymentMethods': {
		input: TurbotPipesEndpointInputSchemas.listUserBillingPaymentMethods,
		output: TurbotPipesEndpointOutputSchemas.listUserBillingPaymentMethods,
	},
	'billing.listUserBillingSubscriptions': {
		input: TurbotPipesEndpointInputSchemas.listUserBillingSubscriptions,
		output: TurbotPipesEndpointOutputSchemas.listUserBillingSubscriptions,
	},
	'auth.createUserPassword': {
		input: TurbotPipesEndpointInputSchemas.createUserPassword,
		output: TurbotPipesEndpointOutputSchemas.createUserPassword,
	},
	'auth.getUserPassword': {
		input: TurbotPipesEndpointInputSchemas.getUserPassword,
		output: TurbotPipesEndpointOutputSchemas.getUserPassword,
	},
	'auth.getUserToken': {
		input: TurbotPipesEndpointInputSchemas.getUserToken,
		output: TurbotPipesEndpointOutputSchemas.getUserToken,
	},
	'auth.deleteUserToken': {
		input: TurbotPipesEndpointInputSchemas.deleteUserToken,
		output: TurbotPipesEndpointOutputSchemas.deleteUserToken,
	},
	'auth.updateUserToken': {
		input: TurbotPipesEndpointInputSchemas.updateUserToken,
		output: TurbotPipesEndpointOutputSchemas.updateUserToken,
	},
	'auth.createSignup': {
		input: TurbotPipesEndpointInputSchemas.createSignup,
		output: TurbotPipesEndpointOutputSchemas.createSignup,
	},
	'auth.initiateLogin': {
		input: TurbotPipesEndpointInputSchemas.initiateLogin,
		output: TurbotPipesEndpointOutputSchemas.initiateLogin,
	},
	'auth.createLoginTokenEmail': {
		input: TurbotPipesEndpointInputSchemas.createLoginTokenEmail,
		output: TurbotPipesEndpointOutputSchemas.createLoginTokenEmail,
	},
	'auth.getAuthProvider': {
		input: TurbotPipesEndpointInputSchemas.getAuthProvider,
		output: TurbotPipesEndpointOutputSchemas.getAuthProvider,
	},
	'tenants.getTenant': {
		input: TurbotPipesEndpointInputSchemas.getTenant,
		output: TurbotPipesEndpointOutputSchemas.getTenant,
	},
	'tenants.getTenantAvatar': {
		input: TurbotPipesEndpointInputSchemas.getTenantAvatar,
		output: TurbotPipesEndpointOutputSchemas.getTenantAvatar,
	},
	'tenants.getTenantSettings': {
		input: TurbotPipesEndpointInputSchemas.getTenantSettings,
		output: TurbotPipesEndpointOutputSchemas.getTenantSettings,
	},
	'tenants.listTenants': {
		input: TurbotPipesEndpointInputSchemas.listTenants,
		output: TurbotPipesEndpointOutputSchemas.listTenants,
	},
	'identities.getIdentity': {
		input: TurbotPipesEndpointInputSchemas.getIdentity,
		output: TurbotPipesEndpointOutputSchemas.getIdentity,
	},
	'identities.getIdentityAvatar': {
		input: TurbotPipesEndpointInputSchemas.getIdentityAvatar,
		output: TurbotPipesEndpointOutputSchemas.getIdentityAvatar,
	},
	'identities.listIdentities': {
		input: TurbotPipesEndpointInputSchemas.listIdentities,
		output: TurbotPipesEndpointOutputSchemas.listIdentities,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof turbotpipesEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const turbotpipesEndpointMeta = {
	'actor.get': { riskLevel: 'read', description: 'Get authenticated actor' },
	'actor.listWorkspaces': { riskLevel: 'read', description: 'List workspaces accessible by actor' },
	'actor.listOrgs': { riskLevel: 'read', description: 'List organizations for actor' },
	'actor.listConnections': { riskLevel: 'read', description: 'List connections for actor' },
	'actor.listActivity': { riskLevel: 'read', description: 'List activity for actor' },
	'users.get': { riskLevel: 'read', description: 'Get user details by handle' },
	'users.update': { riskLevel: 'write', description: 'Update user information' },
	'users.listWorkspaces': { riskLevel: 'read', description: 'List workspaces for user' },
	'users.getUserWorkspace': { riskLevel: 'read', description: 'Get user workspace details' },
	'users.updateUserWorkspace': { riskLevel: 'write', description: 'Update user workspace' },
	'users.runUserWorkspaceCommand': { riskLevel: 'execute', description: 'Run command on user workspace' },
	'users.listProcesses': { riskLevel: 'read', description: 'List processes for user' },
	'users.getUserProcess': { riskLevel: 'read', description: 'Get user process details' },
	'users.listUsage': { riskLevel: 'read', description: 'List user usage metrics' },
	'users.listConstraints': { riskLevel: 'read', description: 'List user constraints' },
	'users.listAuditLogs': { riskLevel: 'read', description: 'List user audit logs' },
	'users.getUserEmail': { riskLevel: 'read', description: 'Get user email details' },
	'users.listUserEmails': { riskLevel: 'read', description: 'List user emails' },
	'users.getUserPreferences': { riskLevel: 'read', description: 'Get user preferences' },
	'users.updateUserPreferences': { riskLevel: 'write', description: 'Update user preferences' },
	'users.deleteUserAvatar': { riskLevel: 'write', description: 'Delete custom user avatar' },
	'orgs.get': { riskLevel: 'read', description: 'Get organization details' },
	'orgs.delete': { riskLevel: 'write', description: 'Delete an organization' },
	'orgs.listWorkspaces': { riskLevel: 'read', description: 'List organization workspaces' },
	'orgs.deleteWorkspace': { riskLevel: 'write', description: 'Delete organization workspace' },
	'orgs.runWorkspaceCommand': { riskLevel: 'execute', description: 'Run command on org workspace' },
	'orgs.listProcesses': { riskLevel: 'read', description: 'List organization processes' },
	'orgs.listServiceAccounts': { riskLevel: 'read', description: 'List organization service accounts' },
	'orgs.updateServiceAccount': { riskLevel: 'write', description: 'Update service account' },
	'orgs.updateServiceAccountToken': { riskLevel: 'write', description: 'Update service account token' },
	'orgs.getMember': { riskLevel: 'read', description: 'Get organization member details' },
	'orgs.updateMemberRole': { riskLevel: 'write', description: 'Update organization member role' },
	'orgs.listUsage': { riskLevel: 'read', description: 'List organization usage' },
	'connections.createUserConnection': { riskLevel: 'write', description: 'Create user connection' },
	'connections.getUserConnection': { riskLevel: 'read', description: 'Get user connection details' },
	'connections.listUserConnections': { riskLevel: 'read', description: 'List connections for user' },
	'connections.updateUserConnection': { riskLevel: 'write', description: 'Update user connection' },
	'connections.deleteUserConnectionDeprecated': { riskLevel: 'write', description: 'Delete user connection (deprecated)' },
	'connections.testUserConnection': { riskLevel: 'read', description: 'Test user connection credentials' },
	'connections.createOrgConnection': { riskLevel: 'write', description: 'Create org connection' },
	'connections.updateOrgConnection': { riskLevel: 'write', description: 'Update org connection' },
	'connections.getOrgConnectionPermission': { riskLevel: 'read', description: 'Get org connection permission' },
	'connections.deleteOrgConnectionPermission': { riskLevel: 'write', description: 'Delete org connection permission' },
	'connections.createOrgConnectionFolder': { riskLevel: 'write', description: 'Create org connection folder' },
	'connections.updateOrgConnectionFolder': { riskLevel: 'write', description: 'Update org connection folder' },
	'workspaces.createUserWorkspaceConnection': { riskLevel: 'write', description: 'Create user workspace connection' },
	'workspaces.getUserWorkspaceConnection': { riskLevel: 'read', description: 'Get user workspace connection' },
	'workspaces.listUserWorkspaceConnections': { riskLevel: 'read', description: 'List user workspace connections' },
	'workspaces.listUserWorkspaceConnectionAssociations': { riskLevel: 'read', description: 'List user workspace connection associations' },
	'workspaces.listUserWorkspaceConnectionTree': { riskLevel: 'read', description: 'List user workspace connection tree' },
	'workspaces.testUserWorkspaceConnection': { riskLevel: 'read', description: 'Test user workspace connection' },
	'workspaces.createUserWorkspaceConnectionFolder': { riskLevel: 'write', description: 'Create user workspace connection folder' },
	'workspaces.getUserWorkspaceConnectionFolder': { riskLevel: 'read', description: 'Get user workspace connection folder' },
	'workspaces.listUserWorkspaceConnectionFolders': { riskLevel: 'read', description: 'List user workspace connection folders' },
	'workspaces.createOrgWorkspaceConnection': { riskLevel: 'write', description: 'Create org workspace connection' },
	'workspaces.getOrgWorkspaceConnection': { riskLevel: 'read', description: 'Get org workspace connection' },
	'workspaces.createOrgWorkspaceConnectionFolder': { riskLevel: 'write', description: 'Create org workspace connection folder' },
	'workspaces.getOrgWorkspaceConnectionFolder': { riskLevel: 'read', description: 'Get org workspace connection folder' },
	'workspaces.createOrgWorkspaceAggregator': { riskLevel: 'write', description: 'Create org workspace aggregator' },
	'workspaces.getUserWorkspaceAggregator': { riskLevel: 'read', description: 'Get user workspace aggregator' },
	'workspaces.listUserWorkspaceAggregators': { riskLevel: 'read', description: 'List user workspace aggregators' },
	'workspaces.listUserWorkspaceAggregatorConnections': { riskLevel: 'read', description: 'List user workspace aggregator connections' },
	'workspaces.listUserWorkspaceAuditLogs': { riskLevel: 'read', description: 'List workspace audit logs' },
	'workspaces.listUserWorkspaceDatabaseLogs': { riskLevel: 'read', description: 'List workspace database logs' },
	'workspaces.listUserWorkspaceProcesses': { riskLevel: 'read', description: 'List workspace processes' },
	'workspaces.getUserWorkspaceProcess': { riskLevel: 'read', description: 'Get workspace process' },
	'workspaces.getUserWorkspaceProcessLog': { riskLevel: 'read', description: 'Get workspace process logs' },
	'workspaces.listOrgWorkspaceProcesses': { riskLevel: 'read', description: 'List org workspace processes' },
	'workspaces.listUserWorkspaceUsage': { riskLevel: 'read', description: 'List user workspace usage' },
	'query.createOrgWorkspaceQuery': { riskLevel: 'execute', description: 'Execute query in org workspace' },
	'query.getOrgWorkspaceQueryData': { riskLevel: 'read', description: 'Get query data from org workspace' },
	'query.createOrgWorkspaceSnapshot': { riskLevel: 'write', description: 'Create workspace snapshot' },
	'query.getUserWorkspaceQuery': { riskLevel: 'read', description: 'Execute query in user workspace (GET)' },
	'query.getUserWorkspaceQueryData': { riskLevel: 'read', description: 'Get query data from user workspace' },
	'query.postUserWorkspaceQuery': { riskLevel: 'execute', description: 'Execute query in user workspace (POST)' },
	'query.runUserWorkspaceQuery': { riskLevel: 'execute', description: 'Run query in user workspace' },
	'query.listUserWorkspaceSnapshots': { riskLevel: 'read', description: 'List workspace snapshots' },
	'ai.createUserAiKey': { riskLevel: 'write', description: 'Create user AI key' },
	'ai.getUserAiKey': { riskLevel: 'read', description: 'Get user AI key metadata' },
	'ai.listUserAiKeys': { riskLevel: 'read', description: 'List user AI keys' },
	'ai.updateUserAiKey': { riskLevel: 'write', description: 'Update user AI key' },
	'ai.testUserAiKey': { riskLevel: 'read', description: 'Test user AI key' },
	'ai.deleteOrgWorkspaceConversation': { riskLevel: 'write', description: 'Delete AI conversation in org workspace' },
	'ai.getUserWorkspaceConversation': { riskLevel: 'read', description: 'Get AI conversation details' },
	'ai.updateUserWorkspaceConversation': { riskLevel: 'write', description: 'Update AI conversation' },
	'ai.listUserWorkspaceConversations': { riskLevel: 'read', description: 'List AI conversations' },
	'ai.sendUserWorkspaceChatMessage': { riskLevel: 'write', description: 'Send chat message to workspace AI' },
	'integrations.createUserIntegration': { riskLevel: 'write', description: 'Create user integration' },
	'integrations.deleteUserIntegration': { riskLevel: 'write', description: 'Delete user integration' },
	'integrations.getUserIntegration': { riskLevel: 'read', description: 'Get user integration details' },
	'integrations.listUserIntegrations': { riskLevel: 'read', description: 'List integrations for user' },
	'integrations.updateUserIntegration': { riskLevel: 'write', description: 'Update user integration' },
	'integrations.testUserIntegration': { riskLevel: 'read', description: 'Test user integration' },
	'integrations.getOrgWorkspaceIntegration': { riskLevel: 'read', description: 'Get org workspace integration' },
	'integrations.getOrgIntegration': { riskLevel: 'read', description: 'Get org integration' },
	'integrations.getUserWorkspaceIntegration': { riskLevel: 'read', description: 'Get user workspace integration' },
	'integrations.listUserWorkspaceIntegrations': { riskLevel: 'read', description: 'List user workspace integrations' },
	'integrations.installUserSlackIntegration': { riskLevel: 'write', description: 'Install Slack integration for user' },
	'notifiers.createUserNotifier': { riskLevel: 'write', description: 'Create user notifier' },
	'notifiers.listUserNotifiers': { riskLevel: 'read', description: 'List user notifiers' },
	'notifiers.getOrgWorkspaceNotifier': { riskLevel: 'read', description: 'Get org workspace notifier' },
	'notifiers.createUserWorkspaceNotifier': { riskLevel: 'write', description: 'Create workspace notifier' },
	'notifiers.deleteUserWorkspaceNotifier': { riskLevel: 'write', description: 'Delete workspace notifier' },
	'notifiers.getUserWorkspaceNotifier': { riskLevel: 'read', description: 'Get workspace notifier' },
	'notifiers.listUserWorkspaceNotifiers': { riskLevel: 'read', description: 'List workspace notifiers' },
	'notifiers.postUserWorkspaceNotifierCommand': { riskLevel: 'execute', description: 'Post command to workspace notifier' },
	'datatanks.createUserWorkspaceDatatank': { riskLevel: 'write', description: 'Create user workspace Datatank' },
	'datatanks.getUserWorkspaceDatatank': { riskLevel: 'read', description: 'Get user workspace Datatank' },
	'datatanks.listUserWorkspaceDatatanks': { riskLevel: 'read', description: 'List user workspace Datatanks' },
	'datatanks.listOrgWorkspaceDatatanks': { riskLevel: 'read', description: 'List org workspace Datatanks' },
	'datatanks.createUserWorkspaceDatatankTable': { riskLevel: 'write', description: 'Create Datatank table' },
	'datatanks.getDatatankTable': { riskLevel: 'read', description: 'Get Datatank table details' },
	'datatanks.listUserWorkspaceDatatankTables': { riskLevel: 'read', description: 'List Datatank tables' },
	'datatanks.listUserWorkspaceDatatankPartitions': { riskLevel: 'read', description: 'List Datatank partitions' },
	'datatanks.getUserWorkspaceSchema': { riskLevel: 'read', description: 'Get user workspace schema' },
	'datatanks.listUserWorkspaceSchemas': { riskLevel: 'read', description: 'List user workspace schemas' },
	'datatanks.getUserWorkspaceSchemaTable': { riskLevel: 'read', description: 'Get schema table details' },
	'datatanks.listUserWorkspaceSchemaTables': { riskLevel: 'read', description: 'List schema tables' },
	'mods.installUserWorkspaceMod': { riskLevel: 'write', description: 'Install mod in user workspace' },
	'mods.getUserWorkspaceMod': { riskLevel: 'read', description: 'Get installed mod details' },
	'mods.listUserWorkspaceMods': { riskLevel: 'read', description: 'List installed mods in workspace' },
	'mods.listOrgWorkspaceMods': { riskLevel: 'read', description: 'List installed mods in org workspace' },
	'mods.createUserWorkspaceModVariableSetting': { riskLevel: 'write', description: 'Create mod variable setting' },
	'mods.deleteUserWorkspaceModVariableSetting': { riskLevel: 'write', description: 'Delete mod variable setting' },
	'mods.getUserWorkspaceModVariableSetting': { riskLevel: 'read', description: 'Get mod variable setting' },
	'mods.listUserWorkspaceModVariables': { riskLevel: 'read', description: 'List mod variables' },
	'mods.getOrgWorkspaceModVariableSetting': { riskLevel: 'read', description: 'Get org mod variable setting' },
	'mods.deleteOrgWorkspaceModVariableSetting': { riskLevel: 'write', description: 'Delete org mod variable setting' },
	'pipelines.installUserWorkspaceFlowpipeMod': { riskLevel: 'write', description: 'Install Flowpipe mod' },
	'pipelines.getUserWorkspaceFlowpipeMod': { riskLevel: 'read', description: 'Get Flowpipe mod details' },
	'pipelines.uninstallFlowpipeMod': { riskLevel: 'write', description: 'Uninstall Flowpipe mod' },
	'pipelines.uninstallOrgWorkspaceFlowpipeMod': { riskLevel: 'write', description: 'Uninstall org Flowpipe mod' },
	'pipelines.listOrgWorkspaceFlowpipeModVariables': { riskLevel: 'read', description: 'List org Flowpipe mod variables' },
	'pipelines.listUserWorkspaceFlowpipeModVariables': { riskLevel: 'read', description: 'List user Flowpipe mod variables' },
	'pipelines.getUserWorkspaceFlowpipePipeline': { riskLevel: 'read', description: 'Get Flowpipe pipeline details' },
	'pipelines.listUserWorkspaceFlowpipePipelines': { riskLevel: 'read', description: 'List Flowpipe pipelines' },
	'pipelines.runUserWorkspaceFlowpipePipelineCommand': { riskLevel: 'execute', description: 'Run Flowpipe pipeline command' },
	'pipelines.getOrgWorkspaceFlowpipeTrigger': { riskLevel: 'read', description: 'Get Flowpipe trigger details' },
	'pipelines.listUserWorkspaceFlowpipeTriggers': { riskLevel: 'read', description: 'List Flowpipe triggers' },
	'pipelines.runUserWorkspaceFlowpipeTriggerCommand': { riskLevel: 'execute', description: 'Run Flowpipe trigger command' },
	'pipelines.listUserWorkspaceFlowpipeInputs': { riskLevel: 'read', description: 'List Flowpipe inputs' },
	'pipelines.listUserWorkspacePipelineTriggers': { riskLevel: 'read', description: 'List triggers for pipeline' },
	'pipelines.deleteUserWorkspacePipeline': { riskLevel: 'write', description: 'Delete pipeline from workspace' },
	'pipelines.getUserWorkspacePipeline': { riskLevel: 'read', description: 'Get pipeline details' },
	'pipelines.listUserWorkspacePipelines': { riskLevel: 'read', description: 'List pipelines in workspace' },
	'pipelines.listOrgWorkspacePipelines': { riskLevel: 'read', description: 'List pipelines in org workspace' },
	'billing.deleteOrgBillingSubscription': { riskLevel: 'write', description: 'Delete org billing subscription' },
	'billing.updateOrgBillingSubscription': { riskLevel: 'write', description: 'Update org billing subscription' },
	'billing.getOrgBillingInvoice': { riskLevel: 'read', description: 'Get org billing invoice' },
	'billing.getUserBillingPlan': { riskLevel: 'read', description: 'Get user billing plan' },
	'billing.getUserBillingUpcomingInvoice': { riskLevel: 'read', description: 'Get user upcoming invoice' },
	'billing.listUserBillingInvoices': { riskLevel: 'read', description: 'List user billing invoices' },
	'billing.listUserBillingPaymentMethods': { riskLevel: 'read', description: 'List user payment methods' },
	'billing.listUserBillingSubscriptions': { riskLevel: 'read', description: 'List user billing subscriptions' },
	'auth.createUserPassword': { riskLevel: 'write', description: 'Create user password' },
	'auth.getUserPassword': { riskLevel: 'read', description: 'Get user password status' },
	'auth.getUserToken': { riskLevel: 'read', description: 'Get user token metadata' },
	'auth.deleteUserToken': { riskLevel: 'write', description: 'Delete user token' },
	'auth.updateUserToken': { riskLevel: 'write', description: 'Update user token status' },
	'auth.createSignup': { riskLevel: 'write', description: 'Create new user signup' },
	'auth.initiateLogin': { riskLevel: 'write', description: 'Initiate user login' },
	'auth.createLoginTokenEmail': { riskLevel: 'write', description: 'Send login token to email' },
	'auth.getAuthProvider': { riskLevel: 'read', description: 'Get OAuth provider details' },
	'tenants.getTenant': { riskLevel: 'read', description: 'Get tenant information' },
	'tenants.getTenantAvatar': { riskLevel: 'read', description: 'Get tenant avatar image' },
	'tenants.getTenantSettings': { riskLevel: 'read', description: 'Get tenant settings' },
	'tenants.listTenants': { riskLevel: 'read', description: 'List accessible tenants' },
	'identities.getIdentity': { riskLevel: 'read', description: 'Get identity details by handle' },
	'identities.getIdentityAvatar': { riskLevel: 'read', description: 'Get identity avatar' },
	'identities.listIdentities': { riskLevel: 'read', description: 'List identities' },
} satisfies RequiredPluginEndpointMeta<typeof turbotpipesEndpointsNested>;

export type BaseTurbotPipesPlugin<T extends TurbotPipesPluginOptions> = CorsairPlugin<
	'turbotpipes',
	typeof TurbotPipesSchema,
	typeof turbotpipesEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTurbotPipesPlugin = BaseTurbotPipesPlugin<TurbotPipesPluginOptions>;

export type ExternalTurbotPipesPlugin<T extends TurbotPipesPluginOptions> =
	BaseTurbotPipesPlugin<T>;

export function turbotpipes<const T extends TurbotPipesPluginOptions>(
	incomingOptions: TurbotPipesPluginOptions & T = {} as TurbotPipesPluginOptions & T,
): ExternalTurbotPipesPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'turbotpipes',
		schema: TurbotPipesSchema,
		options: options,
		hooks: options.hooks,
		endpoints: turbotpipesEndpointsNested,
		webhooks: {},
		endpointMeta: turbotpipesEndpointMeta,
		endpointSchemas: turbotpipesEndpointSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchTurbotPipesTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TurbotPipesKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			throw new AuthMissingError('turbotpipes', 'api_key');
		},
	} satisfies InternalTurbotPipesPlugin;
}

export type {
	TurbotPipesEndpointInputs,
	TurbotPipesEndpointOutputs,
} from './endpoints/types';
