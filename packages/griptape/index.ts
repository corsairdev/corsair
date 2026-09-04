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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';

import {
	Assistant,
	AssistantRun,
	Billing,
	Bucket,
	Config,
	Connection,
	Credits,
	DataConnector,
	DataJob,
	ExportJob,
	Function,
	ImportJob,
	Integration,
	KnowledgeBase,
	Library,
	Message,
	Model,
	Organization,
	Retriever,
	RetrieverComponent,
	Rule,
	Ruleset,
	Secret,
	Structure,
	Thread,
	ThreadMessage,
	Tool,
	Usage,
	User,
} from './endpoints';
import type {
	GriptapeEndpointInputs,
	GriptapeEndpointOutputs,
} from './endpoints/types';
import {
	GriptapeEndpointInputSchemas,
	GriptapeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GriptapeSchema } from './schema';

export type GriptapePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGriptapePlugin['hooks'];
	webhookHooks?: InternalGriptapePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof griptapeEndpointsNested>;
};

export type GriptapeContext = CorsairPluginContext<
	typeof GriptapeSchema,
	GriptapePluginOptions
>;

export type GriptapeKeyBuilderContext =
	KeyBuilderContext<GriptapePluginOptions>;

export type GriptapeBoundEndpoints = BindEndpoints<
	typeof griptapeEndpointsNested
>;

type GriptapeEndpoint<K extends keyof GriptapeEndpointOutputs> =
	CorsairEndpoint<
		GriptapeContext,
		GriptapeEndpointInputs[K],
		GriptapeEndpointOutputs[K]
	>;

export type GriptapeEndpoints = {
	assistantList: GriptapeEndpoint<'assistantList'>;
	assistantGet: GriptapeEndpoint<'assistantGet'>;
	assistantCreate: GriptapeEndpoint<'assistantCreate'>;
	assistantUpdate: GriptapeEndpoint<'assistantUpdate'>;
	assistantDelete: GriptapeEndpoint<'assistantDelete'>;
	assistantRunCreate: GriptapeEndpoint<'assistantRunCreate'>;
	assistantRunList: GriptapeEndpoint<'assistantRunList'>;
	assistantRunGet: GriptapeEndpoint<'assistantRunGet'>;
	assistantRunCancel: GriptapeEndpoint<'assistantRunCancel'>;
	assistantRunEvents: GriptapeEndpoint<'assistantRunEvents'>;
	threadList: GriptapeEndpoint<'threadList'>;
	threadCreate: GriptapeEndpoint<'threadCreate'>;
	threadGet: GriptapeEndpoint<'threadGet'>;
	threadUpdate: GriptapeEndpoint<'threadUpdate'>;
	threadDelete: GriptapeEndpoint<'threadDelete'>;
	threadMessageList: GriptapeEndpoint<'threadMessageList'>;
	threadMessageCreate: GriptapeEndpoint<'threadMessageCreate'>;
	messageGet: GriptapeEndpoint<'messageGet'>;
	messageUpdate: GriptapeEndpoint<'messageUpdate'>;
	messageDelete: GriptapeEndpoint<'messageDelete'>;
	knowledgeBaseList: GriptapeEndpoint<'knowledgeBaseList'>;
	knowledgeBaseCreate: GriptapeEndpoint<'knowledgeBaseCreate'>;
	knowledgeBaseGet: GriptapeEndpoint<'knowledgeBaseGet'>;
	knowledgeBaseUpdate: GriptapeEndpoint<'knowledgeBaseUpdate'>;
	knowledgeBaseDelete: GriptapeEndpoint<'knowledgeBaseDelete'>;
	knowledgeBaseQuery: GriptapeEndpoint<'knowledgeBaseQuery'>;
	knowledgeBaseSearch: GriptapeEndpoint<'knowledgeBaseSearch'>;
	knowledgeBaseListQueries: GriptapeEndpoint<'knowledgeBaseListQueries'>;
	knowledgeBaseListSearches: GriptapeEndpoint<'knowledgeBaseListSearches'>;
	knowledgeBaseGetSearch: GriptapeEndpoint<'knowledgeBaseGetSearch'>;
	knowledgeBaseCreateJob: GriptapeEndpoint<'knowledgeBaseCreateJob'>;
	knowledgeBaseListJobs: GriptapeEndpoint<'knowledgeBaseListJobs'>;
	knowledgeBaseGetJob: GriptapeEndpoint<'knowledgeBaseGetJob'>;
	dataConnectorList: GriptapeEndpoint<'dataConnectorList'>;
	dataConnectorCreate: GriptapeEndpoint<'dataConnectorCreate'>;
	dataConnectorGet: GriptapeEndpoint<'dataConnectorGet'>;
	dataConnectorUpdate: GriptapeEndpoint<'dataConnectorUpdate'>;
	dataConnectorDelete: GriptapeEndpoint<'dataConnectorDelete'>;
	dataConnectorCreateJob: GriptapeEndpoint<'dataConnectorCreateJob'>;
	dataJobGet: GriptapeEndpoint<'dataJobGet'>;
	dataJobCancel: GriptapeEndpoint<'dataJobCancel'>;
	structureList: GriptapeEndpoint<'structureList'>;
	structureCreate: GriptapeEndpoint<'structureCreate'>;
	structureGet: GriptapeEndpoint<'structureGet'>;
	structureUpdate: GriptapeEndpoint<'structureUpdate'>;
	structureDelete: GriptapeEndpoint<'structureDelete'>;
	structureDashboard: GriptapeEndpoint<'structureDashboard'>;
	structureListRuns: GriptapeEndpoint<'structureListRuns'>;
	structureListDeployments: GriptapeEndpoint<'structureListDeployments'>;
	structureCreateDeployment: GriptapeEndpoint<'structureCreateDeployment'>;
	toolList: GriptapeEndpoint<'toolList'>;
	toolCreate: GriptapeEndpoint<'toolCreate'>;
	toolGet: GriptapeEndpoint<'toolGet'>;
	toolUpdate: GriptapeEndpoint<'toolUpdate'>;
	toolDelete: GriptapeEndpoint<'toolDelete'>;
	toolListRuns: GriptapeEndpoint<'toolListRuns'>;
	toolListDeployments: GriptapeEndpoint<'toolListDeployments'>;
	toolCreateDeployment: GriptapeEndpoint<'toolCreateDeployment'>;
	toolDeploymentStatus: GriptapeEndpoint<'toolDeploymentStatus'>;
	functionList: GriptapeEndpoint<'functionList'>;
	functionCreate: GriptapeEndpoint<'functionCreate'>;
	functionGet: GriptapeEndpoint<'functionGet'>;
	functionUpdate: GriptapeEndpoint<'functionUpdate'>;
	functionDelete: GriptapeEndpoint<'functionDelete'>;
	functionListDeployments: GriptapeEndpoint<'functionListDeployments'>;
	functionCreateDeployment: GriptapeEndpoint<'functionCreateDeployment'>;
	ruleList: GriptapeEndpoint<'ruleList'>;
	ruleCreate: GriptapeEndpoint<'ruleCreate'>;
	ruleGet: GriptapeEndpoint<'ruleGet'>;
	ruleUpdate: GriptapeEndpoint<'ruleUpdate'>;
	ruleDelete: GriptapeEndpoint<'ruleDelete'>;
	rulesetCreate: GriptapeEndpoint<'rulesetCreate'>;
	rulesetGet: GriptapeEndpoint<'rulesetGet'>;
	rulesetGetByAlias: GriptapeEndpoint<'rulesetGetByAlias'>;
	rulesetUpdate: GriptapeEndpoint<'rulesetUpdate'>;
	rulesetDelete: GriptapeEndpoint<'rulesetDelete'>;
	retrieverList: GriptapeEndpoint<'retrieverList'>;
	retrieverCreate: GriptapeEndpoint<'retrieverCreate'>;
	retrieverGet: GriptapeEndpoint<'retrieverGet'>;
	retrieverUpdate: GriptapeEndpoint<'retrieverUpdate'>;
	retrieverQuery: GriptapeEndpoint<'retrieverQuery'>;
	retrieverComponentList: GriptapeEndpoint<'retrieverComponentList'>;
	retrieverComponentCreate: GriptapeEndpoint<'retrieverComponentCreate'>;
	retrieverComponentGet: GriptapeEndpoint<'retrieverComponentGet'>;
	retrieverComponentUpdate: GriptapeEndpoint<'retrieverComponentUpdate'>;
	libraryList: GriptapeEndpoint<'libraryList'>;
	libraryCreate: GriptapeEndpoint<'libraryCreate'>;
	libraryGet: GriptapeEndpoint<'libraryGet'>;
	libraryUpdate: GriptapeEndpoint<'libraryUpdate'>;
	libraryDelete: GriptapeEndpoint<'libraryDelete'>;
	integrationList: GriptapeEndpoint<'integrationList'>;
	integrationCreate: GriptapeEndpoint<'integrationCreate'>;
	integrationGet: GriptapeEndpoint<'integrationGet'>;
	integrationUpdate: GriptapeEndpoint<'integrationUpdate'>;
	integrationDelete: GriptapeEndpoint<'integrationDelete'>;
	bucketList: GriptapeEndpoint<'bucketList'>;
	bucketCreate: GriptapeEndpoint<'bucketCreate'>;
	bucketGet: GriptapeEndpoint<'bucketGet'>;
	bucketUpdate: GriptapeEndpoint<'bucketUpdate'>;
	bucketDelete: GriptapeEndpoint<'bucketDelete'>;
	bucketListAssets: GriptapeEndpoint<'bucketListAssets'>;
	bucketGetAsset: GriptapeEndpoint<'bucketGetAsset'>;
	bucketCreateAsset: GriptapeEndpoint<'bucketCreateAsset'>;
	bucketDeleteAsset: GriptapeEndpoint<'bucketDeleteAsset'>;
	bucketAssetUrl: GriptapeEndpoint<'bucketAssetUrl'>;
	secretList: GriptapeEndpoint<'secretList'>;
	secretCreate: GriptapeEndpoint<'secretCreate'>;
	secretGet: GriptapeEndpoint<'secretGet'>;
	secretUpdate: GriptapeEndpoint<'secretUpdate'>;
	secretDelete: GriptapeEndpoint<'secretDelete'>;
	modelList: GriptapeEndpoint<'modelList'>;
	modelCreate: GriptapeEndpoint<'modelCreate'>;
	modelGet: GriptapeEndpoint<'modelGet'>;
	modelUpdate: GriptapeEndpoint<'modelUpdate'>;
	modelDelete: GriptapeEndpoint<'modelDelete'>;
	modelListAuthConfigs: GriptapeEndpoint<'modelListAuthConfigs'>;
	modelCreateAuthConfig: GriptapeEndpoint<'modelCreateAuthConfig'>;
	modelGetAuthConfig: GriptapeEndpoint<'modelGetAuthConfig'>;
	modelUpdateAuthConfig: GriptapeEndpoint<'modelUpdateAuthConfig'>;
	modelDeleteAuthConfig: GriptapeEndpoint<'modelDeleteAuthConfig'>;
	organizationList: GriptapeEndpoint<'organizationList'>;
	organizationGet: GriptapeEndpoint<'organizationGet'>;
	organizationUpdate: GriptapeEndpoint<'organizationUpdate'>;
	organizationListApiKeys: GriptapeEndpoint<'organizationListApiKeys'>;
	organizationCreateApiKey: GriptapeEndpoint<'organizationCreateApiKey'>;
	userList: GriptapeEndpoint<'userList'>;
	userGet: GriptapeEndpoint<'userGet'>;
	userGetApiKey: GriptapeEndpoint<'userGetApiKey'>;
	userDeleteApiKey: GriptapeEndpoint<'userDeleteApiKey'>;
	billingManagementUrl: GriptapeEndpoint<'billingManagementUrl'>;
	creditsBalance: GriptapeEndpoint<'creditsBalance'>;
	usageGet: GriptapeEndpoint<'usageGet'>;
	configGet: GriptapeEndpoint<'configGet'>;
	connectionList: GriptapeEndpoint<'connectionList'>;
	exportJobList: GriptapeEndpoint<'exportJobList'>;
	exportJobCreate: GriptapeEndpoint<'exportJobCreate'>;
	exportJobGet: GriptapeEndpoint<'exportJobGet'>;
	importJobList: GriptapeEndpoint<'importJobList'>;
	importJobCreate: GriptapeEndpoint<'importJobCreate'>;
	importJobGet: GriptapeEndpoint<'importJobGet'>;
};

export type GriptapeWebhooks = Record<string, never>;

export type GriptapeBoundWebhooks = Record<string, never>;

const griptapeEndpointsNested = {
	assistant: Assistant,
	assistantRun: AssistantRun,
	thread: Thread,
	threadMessage: ThreadMessage,
	message: Message,
	knowledgeBase: KnowledgeBase,
	dataConnector: DataConnector,
	dataJob: DataJob,
	structure: Structure,
	tool: Tool,
	function: Function,
	rule: Rule,
	ruleset: Ruleset,
	retriever: Retriever,
	retrieverComponent: RetrieverComponent,
	library: Library,
	integration: Integration,
	bucket: Bucket,
	secret: Secret,
	model: Model,
	organization: Organization,
	user: User,
	billing: Billing,
	credits: Credits,
	usage: Usage,
	config: Config,
	connection: Connection,
	exportJob: ExportJob,
	importJob: ImportJob,
} as const;

const griptapeWebhooksNested = {} as const;

export const griptapeEndpointSchemas = {
	'assistant.list': {
		input: GriptapeEndpointInputSchemas.assistantList,
		output: GriptapeEndpointOutputSchemas.assistantList,
	},
	'assistant.get': {
		input: GriptapeEndpointInputSchemas.assistantGet,
		output: GriptapeEndpointOutputSchemas.assistantGet,
	},
	'assistant.create': {
		input: GriptapeEndpointInputSchemas.assistantCreate,
		output: GriptapeEndpointOutputSchemas.assistantCreate,
	},
	'assistant.update': {
		input: GriptapeEndpointInputSchemas.assistantUpdate,
		output: GriptapeEndpointOutputSchemas.assistantUpdate,
	},
	'assistant.delete': {
		input: GriptapeEndpointInputSchemas.assistantDelete,
		output: GriptapeEndpointOutputSchemas.assistantDelete,
	},
	'assistantRun.create': {
		input: GriptapeEndpointInputSchemas.assistantRunCreate,
		output: GriptapeEndpointOutputSchemas.assistantRunCreate,
	},
	'assistantRun.list': {
		input: GriptapeEndpointInputSchemas.assistantRunList,
		output: GriptapeEndpointOutputSchemas.assistantRunList,
	},
	'assistantRun.get': {
		input: GriptapeEndpointInputSchemas.assistantRunGet,
		output: GriptapeEndpointOutputSchemas.assistantRunGet,
	},
	'assistantRun.cancel': {
		input: GriptapeEndpointInputSchemas.assistantRunCancel,
		output: GriptapeEndpointOutputSchemas.assistantRunCancel,
	},
	'assistantRun.events': {
		input: GriptapeEndpointInputSchemas.assistantRunEvents,
		output: GriptapeEndpointOutputSchemas.assistantRunEvents,
	},
	'thread.list': {
		input: GriptapeEndpointInputSchemas.threadList,
		output: GriptapeEndpointOutputSchemas.threadList,
	},
	'thread.create': {
		input: GriptapeEndpointInputSchemas.threadCreate,
		output: GriptapeEndpointOutputSchemas.threadCreate,
	},
	'thread.get': {
		input: GriptapeEndpointInputSchemas.threadGet,
		output: GriptapeEndpointOutputSchemas.threadGet,
	},
	'thread.update': {
		input: GriptapeEndpointInputSchemas.threadUpdate,
		output: GriptapeEndpointOutputSchemas.threadUpdate,
	},
	'thread.delete': {
		input: GriptapeEndpointInputSchemas.threadDelete,
		output: GriptapeEndpointOutputSchemas.threadDelete,
	},
	'threadMessage.list': {
		input: GriptapeEndpointInputSchemas.threadMessageList,
		output: GriptapeEndpointOutputSchemas.threadMessageList,
	},
	'threadMessage.create': {
		input: GriptapeEndpointInputSchemas.threadMessageCreate,
		output: GriptapeEndpointOutputSchemas.threadMessageCreate,
	},
	'message.get': {
		input: GriptapeEndpointInputSchemas.messageGet,
		output: GriptapeEndpointOutputSchemas.messageGet,
	},
	'message.update': {
		input: GriptapeEndpointInputSchemas.messageUpdate,
		output: GriptapeEndpointOutputSchemas.messageUpdate,
	},
	'message.delete': {
		input: GriptapeEndpointInputSchemas.messageDelete,
		output: GriptapeEndpointOutputSchemas.messageDelete,
	},
	'knowledgeBase.list': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseList,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseList,
	},
	'knowledgeBase.create': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseCreate,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseCreate,
	},
	'knowledgeBase.get': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseGet,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseGet,
	},
	'knowledgeBase.update': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseUpdate,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseUpdate,
	},
	'knowledgeBase.delete': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseDelete,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseDelete,
	},
	'knowledgeBase.query': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseQuery,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseQuery,
	},
	'knowledgeBase.search': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseSearch,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseSearch,
	},
	'knowledgeBase.listQueries': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseListQueries,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseListQueries,
	},
	'knowledgeBase.listSearches': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseListSearches,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseListSearches,
	},
	'knowledgeBase.getSearch': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseGetSearch,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseGetSearch,
	},
	'knowledgeBase.createJob': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseCreateJob,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseCreateJob,
	},
	'knowledgeBase.listJobs': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseListJobs,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseListJobs,
	},
	'knowledgeBase.getJob': {
		input: GriptapeEndpointInputSchemas.knowledgeBaseGetJob,
		output: GriptapeEndpointOutputSchemas.knowledgeBaseGetJob,
	},
	'dataConnector.list': {
		input: GriptapeEndpointInputSchemas.dataConnectorList,
		output: GriptapeEndpointOutputSchemas.dataConnectorList,
	},
	'dataConnector.create': {
		input: GriptapeEndpointInputSchemas.dataConnectorCreate,
		output: GriptapeEndpointOutputSchemas.dataConnectorCreate,
	},
	'dataConnector.get': {
		input: GriptapeEndpointInputSchemas.dataConnectorGet,
		output: GriptapeEndpointOutputSchemas.dataConnectorGet,
	},
	'dataConnector.update': {
		input: GriptapeEndpointInputSchemas.dataConnectorUpdate,
		output: GriptapeEndpointOutputSchemas.dataConnectorUpdate,
	},
	'dataConnector.delete': {
		input: GriptapeEndpointInputSchemas.dataConnectorDelete,
		output: GriptapeEndpointOutputSchemas.dataConnectorDelete,
	},
	'dataConnector.createJob': {
		input: GriptapeEndpointInputSchemas.dataConnectorCreateJob,
		output: GriptapeEndpointOutputSchemas.dataConnectorCreateJob,
	},
	'dataJob.get': {
		input: GriptapeEndpointInputSchemas.dataJobGet,
		output: GriptapeEndpointOutputSchemas.dataJobGet,
	},
	'dataJob.cancel': {
		input: GriptapeEndpointInputSchemas.dataJobCancel,
		output: GriptapeEndpointOutputSchemas.dataJobCancel,
	},
	'structure.list': {
		input: GriptapeEndpointInputSchemas.structureList,
		output: GriptapeEndpointOutputSchemas.structureList,
	},
	'structure.create': {
		input: GriptapeEndpointInputSchemas.structureCreate,
		output: GriptapeEndpointOutputSchemas.structureCreate,
	},
	'structure.get': {
		input: GriptapeEndpointInputSchemas.structureGet,
		output: GriptapeEndpointOutputSchemas.structureGet,
	},
	'structure.update': {
		input: GriptapeEndpointInputSchemas.structureUpdate,
		output: GriptapeEndpointOutputSchemas.structureUpdate,
	},
	'structure.delete': {
		input: GriptapeEndpointInputSchemas.structureDelete,
		output: GriptapeEndpointOutputSchemas.structureDelete,
	},
	'structure.dashboard': {
		input: GriptapeEndpointInputSchemas.structureDashboard,
		output: GriptapeEndpointOutputSchemas.structureDashboard,
	},
	'structure.listRuns': {
		input: GriptapeEndpointInputSchemas.structureListRuns,
		output: GriptapeEndpointOutputSchemas.structureListRuns,
	},
	'structure.listDeployments': {
		input: GriptapeEndpointInputSchemas.structureListDeployments,
		output: GriptapeEndpointOutputSchemas.structureListDeployments,
	},
	'structure.createDeployment': {
		input: GriptapeEndpointInputSchemas.structureCreateDeployment,
		output: GriptapeEndpointOutputSchemas.structureCreateDeployment,
	},
	'tool.list': {
		input: GriptapeEndpointInputSchemas.toolList,
		output: GriptapeEndpointOutputSchemas.toolList,
	},
	'tool.create': {
		input: GriptapeEndpointInputSchemas.toolCreate,
		output: GriptapeEndpointOutputSchemas.toolCreate,
	},
	'tool.get': {
		input: GriptapeEndpointInputSchemas.toolGet,
		output: GriptapeEndpointOutputSchemas.toolGet,
	},
	'tool.update': {
		input: GriptapeEndpointInputSchemas.toolUpdate,
		output: GriptapeEndpointOutputSchemas.toolUpdate,
	},
	'tool.delete': {
		input: GriptapeEndpointInputSchemas.toolDelete,
		output: GriptapeEndpointOutputSchemas.toolDelete,
	},
	'tool.listRuns': {
		input: GriptapeEndpointInputSchemas.toolListRuns,
		output: GriptapeEndpointOutputSchemas.toolListRuns,
	},
	'tool.listDeployments': {
		input: GriptapeEndpointInputSchemas.toolListDeployments,
		output: GriptapeEndpointOutputSchemas.toolListDeployments,
	},
	'tool.createDeployment': {
		input: GriptapeEndpointInputSchemas.toolCreateDeployment,
		output: GriptapeEndpointOutputSchemas.toolCreateDeployment,
	},
	'tool.deploymentStatus': {
		input: GriptapeEndpointInputSchemas.toolDeploymentStatus,
		output: GriptapeEndpointOutputSchemas.toolDeploymentStatus,
	},
	'function.list': {
		input: GriptapeEndpointInputSchemas.functionList,
		output: GriptapeEndpointOutputSchemas.functionList,
	},
	'function.create': {
		input: GriptapeEndpointInputSchemas.functionCreate,
		output: GriptapeEndpointOutputSchemas.functionCreate,
	},
	'function.get': {
		input: GriptapeEndpointInputSchemas.functionGet,
		output: GriptapeEndpointOutputSchemas.functionGet,
	},
	'function.update': {
		input: GriptapeEndpointInputSchemas.functionUpdate,
		output: GriptapeEndpointOutputSchemas.functionUpdate,
	},
	'function.delete': {
		input: GriptapeEndpointInputSchemas.functionDelete,
		output: GriptapeEndpointOutputSchemas.functionDelete,
	},
	'function.listDeployments': {
		input: GriptapeEndpointInputSchemas.functionListDeployments,
		output: GriptapeEndpointOutputSchemas.functionListDeployments,
	},
	'function.createDeployment': {
		input: GriptapeEndpointInputSchemas.functionCreateDeployment,
		output: GriptapeEndpointOutputSchemas.functionCreateDeployment,
	},
	'rule.list': {
		input: GriptapeEndpointInputSchemas.ruleList,
		output: GriptapeEndpointOutputSchemas.ruleList,
	},
	'rule.create': {
		input: GriptapeEndpointInputSchemas.ruleCreate,
		output: GriptapeEndpointOutputSchemas.ruleCreate,
	},
	'rule.get': {
		input: GriptapeEndpointInputSchemas.ruleGet,
		output: GriptapeEndpointOutputSchemas.ruleGet,
	},
	'rule.update': {
		input: GriptapeEndpointInputSchemas.ruleUpdate,
		output: GriptapeEndpointOutputSchemas.ruleUpdate,
	},
	'rule.delete': {
		input: GriptapeEndpointInputSchemas.ruleDelete,
		output: GriptapeEndpointOutputSchemas.ruleDelete,
	},
	'ruleset.create': {
		input: GriptapeEndpointInputSchemas.rulesetCreate,
		output: GriptapeEndpointOutputSchemas.rulesetCreate,
	},
	'ruleset.get': {
		input: GriptapeEndpointInputSchemas.rulesetGet,
		output: GriptapeEndpointOutputSchemas.rulesetGet,
	},
	'ruleset.getByAlias': {
		input: GriptapeEndpointInputSchemas.rulesetGetByAlias,
		output: GriptapeEndpointOutputSchemas.rulesetGetByAlias,
	},
	'ruleset.update': {
		input: GriptapeEndpointInputSchemas.rulesetUpdate,
		output: GriptapeEndpointOutputSchemas.rulesetUpdate,
	},
	'ruleset.delete': {
		input: GriptapeEndpointInputSchemas.rulesetDelete,
		output: GriptapeEndpointOutputSchemas.rulesetDelete,
	},
	'retriever.list': {
		input: GriptapeEndpointInputSchemas.retrieverList,
		output: GriptapeEndpointOutputSchemas.retrieverList,
	},
	'retriever.create': {
		input: GriptapeEndpointInputSchemas.retrieverCreate,
		output: GriptapeEndpointOutputSchemas.retrieverCreate,
	},
	'retriever.get': {
		input: GriptapeEndpointInputSchemas.retrieverGet,
		output: GriptapeEndpointOutputSchemas.retrieverGet,
	},
	'retriever.update': {
		input: GriptapeEndpointInputSchemas.retrieverUpdate,
		output: GriptapeEndpointOutputSchemas.retrieverUpdate,
	},
	'retriever.query': {
		input: GriptapeEndpointInputSchemas.retrieverQuery,
		output: GriptapeEndpointOutputSchemas.retrieverQuery,
	},
	'retrieverComponent.list': {
		input: GriptapeEndpointInputSchemas.retrieverComponentList,
		output: GriptapeEndpointOutputSchemas.retrieverComponentList,
	},
	'retrieverComponent.create': {
		input: GriptapeEndpointInputSchemas.retrieverComponentCreate,
		output: GriptapeEndpointOutputSchemas.retrieverComponentCreate,
	},
	'retrieverComponent.get': {
		input: GriptapeEndpointInputSchemas.retrieverComponentGet,
		output: GriptapeEndpointOutputSchemas.retrieverComponentGet,
	},
	'retrieverComponent.update': {
		input: GriptapeEndpointInputSchemas.retrieverComponentUpdate,
		output: GriptapeEndpointOutputSchemas.retrieverComponentUpdate,
	},
	'library.list': {
		input: GriptapeEndpointInputSchemas.libraryList,
		output: GriptapeEndpointOutputSchemas.libraryList,
	},
	'library.create': {
		input: GriptapeEndpointInputSchemas.libraryCreate,
		output: GriptapeEndpointOutputSchemas.libraryCreate,
	},
	'library.get': {
		input: GriptapeEndpointInputSchemas.libraryGet,
		output: GriptapeEndpointOutputSchemas.libraryGet,
	},
	'library.update': {
		input: GriptapeEndpointInputSchemas.libraryUpdate,
		output: GriptapeEndpointOutputSchemas.libraryUpdate,
	},
	'library.delete': {
		input: GriptapeEndpointInputSchemas.libraryDelete,
		output: GriptapeEndpointOutputSchemas.libraryDelete,
	},
	'integration.list': {
		input: GriptapeEndpointInputSchemas.integrationList,
		output: GriptapeEndpointOutputSchemas.integrationList,
	},
	'integration.create': {
		input: GriptapeEndpointInputSchemas.integrationCreate,
		output: GriptapeEndpointOutputSchemas.integrationCreate,
	},
	'integration.get': {
		input: GriptapeEndpointInputSchemas.integrationGet,
		output: GriptapeEndpointOutputSchemas.integrationGet,
	},
	'integration.update': {
		input: GriptapeEndpointInputSchemas.integrationUpdate,
		output: GriptapeEndpointOutputSchemas.integrationUpdate,
	},
	'integration.delete': {
		input: GriptapeEndpointInputSchemas.integrationDelete,
		output: GriptapeEndpointOutputSchemas.integrationDelete,
	},
	'bucket.list': {
		input: GriptapeEndpointInputSchemas.bucketList,
		output: GriptapeEndpointOutputSchemas.bucketList,
	},
	'bucket.create': {
		input: GriptapeEndpointInputSchemas.bucketCreate,
		output: GriptapeEndpointOutputSchemas.bucketCreate,
	},
	'bucket.get': {
		input: GriptapeEndpointInputSchemas.bucketGet,
		output: GriptapeEndpointOutputSchemas.bucketGet,
	},
	'bucket.update': {
		input: GriptapeEndpointInputSchemas.bucketUpdate,
		output: GriptapeEndpointOutputSchemas.bucketUpdate,
	},
	'bucket.delete': {
		input: GriptapeEndpointInputSchemas.bucketDelete,
		output: GriptapeEndpointOutputSchemas.bucketDelete,
	},
	'bucket.listAssets': {
		input: GriptapeEndpointInputSchemas.bucketListAssets,
		output: GriptapeEndpointOutputSchemas.bucketListAssets,
	},
	'bucket.getAsset': {
		input: GriptapeEndpointInputSchemas.bucketGetAsset,
		output: GriptapeEndpointOutputSchemas.bucketGetAsset,
	},
	'bucket.createAsset': {
		input: GriptapeEndpointInputSchemas.bucketCreateAsset,
		output: GriptapeEndpointOutputSchemas.bucketCreateAsset,
	},
	'bucket.deleteAsset': {
		input: GriptapeEndpointInputSchemas.bucketDeleteAsset,
		output: GriptapeEndpointOutputSchemas.bucketDeleteAsset,
	},
	'bucket.assetUrl': {
		input: GriptapeEndpointInputSchemas.bucketAssetUrl,
		output: GriptapeEndpointOutputSchemas.bucketAssetUrl,
	},
	'secret.list': {
		input: GriptapeEndpointInputSchemas.secretList,
		output: GriptapeEndpointOutputSchemas.secretList,
	},
	'secret.create': {
		input: GriptapeEndpointInputSchemas.secretCreate,
		output: GriptapeEndpointOutputSchemas.secretCreate,
	},
	'secret.get': {
		input: GriptapeEndpointInputSchemas.secretGet,
		output: GriptapeEndpointOutputSchemas.secretGet,
	},
	'secret.update': {
		input: GriptapeEndpointInputSchemas.secretUpdate,
		output: GriptapeEndpointOutputSchemas.secretUpdate,
	},
	'secret.delete': {
		input: GriptapeEndpointInputSchemas.secretDelete,
		output: GriptapeEndpointOutputSchemas.secretDelete,
	},
	'model.list': {
		input: GriptapeEndpointInputSchemas.modelList,
		output: GriptapeEndpointOutputSchemas.modelList,
	},
	'model.create': {
		input: GriptapeEndpointInputSchemas.modelCreate,
		output: GriptapeEndpointOutputSchemas.modelCreate,
	},
	'model.get': {
		input: GriptapeEndpointInputSchemas.modelGet,
		output: GriptapeEndpointOutputSchemas.modelGet,
	},
	'model.update': {
		input: GriptapeEndpointInputSchemas.modelUpdate,
		output: GriptapeEndpointOutputSchemas.modelUpdate,
	},
	'model.delete': {
		input: GriptapeEndpointInputSchemas.modelDelete,
		output: GriptapeEndpointOutputSchemas.modelDelete,
	},
	'model.listAuthConfigs': {
		input: GriptapeEndpointInputSchemas.modelListAuthConfigs,
		output: GriptapeEndpointOutputSchemas.modelListAuthConfigs,
	},
	'model.createAuthConfig': {
		input: GriptapeEndpointInputSchemas.modelCreateAuthConfig,
		output: GriptapeEndpointOutputSchemas.modelCreateAuthConfig,
	},
	'model.getAuthConfig': {
		input: GriptapeEndpointInputSchemas.modelGetAuthConfig,
		output: GriptapeEndpointOutputSchemas.modelGetAuthConfig,
	},
	'model.updateAuthConfig': {
		input: GriptapeEndpointInputSchemas.modelUpdateAuthConfig,
		output: GriptapeEndpointOutputSchemas.modelUpdateAuthConfig,
	},
	'model.deleteAuthConfig': {
		input: GriptapeEndpointInputSchemas.modelDeleteAuthConfig,
		output: GriptapeEndpointOutputSchemas.modelDeleteAuthConfig,
	},
	'organization.list': {
		input: GriptapeEndpointInputSchemas.organizationList,
		output: GriptapeEndpointOutputSchemas.organizationList,
	},
	'organization.get': {
		input: GriptapeEndpointInputSchemas.organizationGet,
		output: GriptapeEndpointOutputSchemas.organizationGet,
	},
	'organization.update': {
		input: GriptapeEndpointInputSchemas.organizationUpdate,
		output: GriptapeEndpointOutputSchemas.organizationUpdate,
	},
	'organization.listApiKeys': {
		input: GriptapeEndpointInputSchemas.organizationListApiKeys,
		output: GriptapeEndpointOutputSchemas.organizationListApiKeys,
	},
	'organization.createApiKey': {
		input: GriptapeEndpointInputSchemas.organizationCreateApiKey,
		output: GriptapeEndpointOutputSchemas.organizationCreateApiKey,
	},
	'user.list': {
		input: GriptapeEndpointInputSchemas.userList,
		output: GriptapeEndpointOutputSchemas.userList,
	},
	'user.get': {
		input: GriptapeEndpointInputSchemas.userGet,
		output: GriptapeEndpointOutputSchemas.userGet,
	},
	'user.getApiKey': {
		input: GriptapeEndpointInputSchemas.userGetApiKey,
		output: GriptapeEndpointOutputSchemas.userGetApiKey,
	},
	'user.deleteApiKey': {
		input: GriptapeEndpointInputSchemas.userDeleteApiKey,
		output: GriptapeEndpointOutputSchemas.userDeleteApiKey,
	},
	'billing.managementUrl': {
		input: GriptapeEndpointInputSchemas.billingManagementUrl,
		output: GriptapeEndpointOutputSchemas.billingManagementUrl,
	},
	'credits.balance': {
		input: GriptapeEndpointInputSchemas.creditsBalance,
		output: GriptapeEndpointOutputSchemas.creditsBalance,
	},
	'usage.get': {
		input: GriptapeEndpointInputSchemas.usageGet,
		output: GriptapeEndpointOutputSchemas.usageGet,
	},
	'config.get': {
		input: GriptapeEndpointInputSchemas.configGet,
		output: GriptapeEndpointOutputSchemas.configGet,
	},
	'connection.list': {
		input: GriptapeEndpointInputSchemas.connectionList,
		output: GriptapeEndpointOutputSchemas.connectionList,
	},
	'exportJob.list': {
		input: GriptapeEndpointInputSchemas.exportJobList,
		output: GriptapeEndpointOutputSchemas.exportJobList,
	},
	'exportJob.create': {
		input: GriptapeEndpointInputSchemas.exportJobCreate,
		output: GriptapeEndpointOutputSchemas.exportJobCreate,
	},
	'exportJob.get': {
		input: GriptapeEndpointInputSchemas.exportJobGet,
		output: GriptapeEndpointOutputSchemas.exportJobGet,
	},
	'importJob.list': {
		input: GriptapeEndpointInputSchemas.importJobList,
		output: GriptapeEndpointOutputSchemas.importJobList,
	},
	'importJob.create': {
		input: GriptapeEndpointInputSchemas.importJobCreate,
		output: GriptapeEndpointOutputSchemas.importJobCreate,
	},
	'importJob.get': {
		input: GriptapeEndpointInputSchemas.importJobGet,
		output: GriptapeEndpointOutputSchemas.importJobGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof griptapeEndpointsNested
>;

const griptapeWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof griptapeWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const griptapeEndpointMeta = {
	'assistant.list': { riskLevel: 'read', description: 'List assistants' },
	'assistant.get': { riskLevel: 'read', description: 'Get an assistant' },
	'assistant.create': {
		riskLevel: 'write',
		description: 'Create an assistant',
	},
	'assistant.update': {
		riskLevel: 'write',
		description: 'Update an assistant',
	},
	'assistant.delete': {
		riskLevel: 'destructive',
		description: 'Delete an assistant',
	},
	'assistantRun.create': {
		riskLevel: 'write',
		description: 'Create an assistant run',
	},
	'assistantRun.list': {
		riskLevel: 'read',
		description: 'List runs for an assistant',
	},
	'assistantRun.get': {
		riskLevel: 'read',
		description: 'Retrieve an assistant run',
	},
	'assistantRun.cancel': {
		riskLevel: 'write',
		description: 'Cancel an assistant run',
	},
	'assistantRun.events': {
		riskLevel: 'read',
		description: 'List events for an assistant run',
	},
	'thread.list': { riskLevel: 'read', description: 'List threads' },
	'thread.create': { riskLevel: 'write', description: 'Create a thread' },
	'thread.get': { riskLevel: 'read', description: 'Get a thread' },
	'thread.update': { riskLevel: 'write', description: 'Update a thread' },
	'thread.delete': { riskLevel: 'destructive', description: 'Delete a thread' },
	'threadMessage.list': {
		riskLevel: 'read',
		description: 'List messages in a thread',
	},
	'threadMessage.create': {
		riskLevel: 'write',
		description: 'Create a message in a thread',
	},
	'message.get': { riskLevel: 'read', description: 'Get a message' },
	'message.update': { riskLevel: 'write', description: 'Update a message' },
	'message.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message',
	},
	'knowledgeBase.list': {
		riskLevel: 'read',
		description: 'List knowledge bases',
	},
	'knowledgeBase.create': {
		riskLevel: 'write',
		description: 'Create a knowledge base',
	},
	'knowledgeBase.get': {
		riskLevel: 'read',
		description: 'Get a knowledge base',
	},
	'knowledgeBase.update': {
		riskLevel: 'write',
		description: 'Update a knowledge base',
	},
	'knowledgeBase.delete': {
		riskLevel: 'destructive',
		description: 'Delete a knowledge base',
	},
	'knowledgeBase.query': {
		riskLevel: 'read',
		description: 'Semantic search against a knowledge base',
	},
	'knowledgeBase.search': {
		riskLevel: 'read',
		description: 'Search a knowledge base with a synthesized answer',
	},
	'knowledgeBase.listQueries': {
		riskLevel: 'read',
		description: 'List queries for a knowledge base',
	},
	'knowledgeBase.listSearches': {
		riskLevel: 'read',
		description: 'List searches for a knowledge base',
	},
	'knowledgeBase.getSearch': {
		riskLevel: 'read',
		description: 'Get a knowledge base search',
	},
	'knowledgeBase.createJob': {
		riskLevel: 'write',
		description: 'Create a knowledge base ingestion job',
	},
	'knowledgeBase.listJobs': {
		riskLevel: 'read',
		description: 'List knowledge base jobs',
	},
	'knowledgeBase.getJob': {
		riskLevel: 'read',
		description: 'Get a knowledge base job',
	},
	'dataConnector.list': {
		riskLevel: 'read',
		description: 'List data connectors',
	},
	'dataConnector.create': {
		riskLevel: 'write',
		description: 'Create a data connector',
	},
	'dataConnector.get': {
		riskLevel: 'read',
		description: 'Get a data connector',
	},
	'dataConnector.update': {
		riskLevel: 'write',
		description: 'Update a data connector',
	},
	'dataConnector.delete': {
		riskLevel: 'destructive',
		description: 'Delete a data connector',
	},
	'dataConnector.createJob': {
		riskLevel: 'write',
		description: 'Create a data connector job',
	},
	'dataJob.get': { riskLevel: 'read', description: 'Get a data job' },
	'dataJob.cancel': { riskLevel: 'write', description: 'Cancel a data job' },
	'structure.list': { riskLevel: 'read', description: 'List structures' },
	'structure.create': {
		riskLevel: 'write',
		description: 'Create a structure',
	},
	'structure.get': { riskLevel: 'read', description: 'Get a structure' },
	'structure.update': {
		riskLevel: 'write',
		description: 'Update a structure',
	},
	'structure.delete': {
		riskLevel: 'destructive',
		description: 'Delete a structure',
	},
	'structure.dashboard': {
		riskLevel: 'read',
		description: 'Get structure dashboard metrics',
	},
	'structure.listRuns': {
		riskLevel: 'read',
		description: 'List runs for a structure',
	},
	'structure.listDeployments': {
		riskLevel: 'read',
		description: 'List deployments for a structure',
	},
	'structure.createDeployment': {
		riskLevel: 'write',
		description: 'Create a structure deployment',
	},
	'tool.list': { riskLevel: 'read', description: 'List tools' },
	'tool.create': { riskLevel: 'write', description: 'Create a tool' },
	'tool.get': { riskLevel: 'read', description: 'Get a tool' },
	'tool.update': { riskLevel: 'write', description: 'Update a tool' },
	'tool.delete': { riskLevel: 'destructive', description: 'Delete a tool' },
	'tool.listRuns': { riskLevel: 'read', description: 'List runs for a tool' },
	'tool.listDeployments': {
		riskLevel: 'read',
		description: 'List deployments for a tool',
	},
	'tool.createDeployment': {
		riskLevel: 'write',
		description: 'Create a tool deployment',
	},
	'tool.deploymentStatus': {
		riskLevel: 'read',
		description: 'Get a tool deployment status',
	},
	'function.list': { riskLevel: 'read', description: 'List functions' },
	'function.create': { riskLevel: 'write', description: 'Create a function' },
	'function.get': { riskLevel: 'read', description: 'Get a function' },
	'function.update': { riskLevel: 'write', description: 'Update a function' },
	'function.delete': {
		riskLevel: 'destructive',
		description: 'Delete a function',
	},
	'function.listDeployments': {
		riskLevel: 'read',
		description: 'List deployments for a function',
	},
	'function.createDeployment': {
		riskLevel: 'write',
		description: 'Create a function deployment',
	},
	'rule.list': { riskLevel: 'read', description: 'List rules' },
	'rule.create': { riskLevel: 'write', description: 'Create a rule' },
	'rule.get': { riskLevel: 'read', description: 'Get a rule' },
	'rule.update': { riskLevel: 'write', description: 'Update a rule' },
	'rule.delete': { riskLevel: 'destructive', description: 'Delete a rule' },
	'ruleset.create': { riskLevel: 'write', description: 'Create a ruleset' },
	'ruleset.get': { riskLevel: 'read', description: 'Get a ruleset' },
	'ruleset.getByAlias': {
		riskLevel: 'read',
		description: 'Get a ruleset by alias',
	},
	'ruleset.update': { riskLevel: 'write', description: 'Update a ruleset' },
	'ruleset.delete': {
		riskLevel: 'destructive',
		description: 'Delete a ruleset',
	},
	'retriever.list': { riskLevel: 'read', description: 'List retrievers' },
	'retriever.create': { riskLevel: 'write', description: 'Create a retriever' },
	'retriever.get': { riskLevel: 'read', description: 'Get a retriever' },
	'retriever.update': {
		riskLevel: 'write',
		description: 'Update a retriever',
	},
	'retriever.query': { riskLevel: 'read', description: 'Query a retriever' },
	'retrieverComponent.list': {
		riskLevel: 'read',
		description: 'List retriever components',
	},
	'retrieverComponent.create': {
		riskLevel: 'write',
		description: 'Create a retriever component',
	},
	'retrieverComponent.get': {
		riskLevel: 'read',
		description: 'Get a retriever component',
	},
	'retrieverComponent.update': {
		riskLevel: 'write',
		description: 'Update a retriever component',
	},
	'library.list': { riskLevel: 'read', description: 'List libraries' },
	'library.create': { riskLevel: 'write', description: 'Create a library' },
	'library.get': { riskLevel: 'read', description: 'Get a library' },
	'library.update': { riskLevel: 'write', description: 'Update a library' },
	'library.delete': {
		riskLevel: 'destructive',
		description: 'Delete a library',
	},
	'integration.list': {
		riskLevel: 'read',
		description: 'List integrations',
	},
	'integration.create': {
		riskLevel: 'write',
		description: 'Create an integration',
	},
	'integration.get': { riskLevel: 'read', description: 'Get an integration' },
	'integration.update': {
		riskLevel: 'write',
		description: 'Update an integration',
	},
	'integration.delete': {
		riskLevel: 'destructive',
		description: 'Delete an integration',
	},
	'bucket.list': { riskLevel: 'read', description: 'List buckets' },
	'bucket.create': { riskLevel: 'write', description: 'Create a bucket' },
	'bucket.get': { riskLevel: 'read', description: 'Get a bucket' },
	'bucket.update': { riskLevel: 'write', description: 'Update a bucket' },
	'bucket.delete': {
		riskLevel: 'destructive',
		description: 'Delete a bucket',
	},
	'bucket.listAssets': {
		riskLevel: 'read',
		description: 'List assets in a bucket',
	},
	'bucket.getAsset': { riskLevel: 'read', description: 'Get a bucket asset' },
	'bucket.createAsset': {
		riskLevel: 'write',
		description: 'Create a bucket asset',
	},
	'bucket.deleteAsset': {
		riskLevel: 'destructive',
		description: 'Delete a bucket asset',
	},
	'bucket.assetUrl': {
		riskLevel: 'read',
		description: 'Get a signed bucket asset URL',
	},
	'secret.list': { riskLevel: 'read', description: 'List secrets' },
	'secret.create': { riskLevel: 'write', description: 'Create a secret' },
	'secret.get': { riskLevel: 'read', description: 'Get a secret' },
	'secret.update': { riskLevel: 'write', description: 'Update a secret' },
	'secret.delete': {
		riskLevel: 'destructive',
		description: 'Delete a secret',
	},
	'model.list': { riskLevel: 'read', description: 'List models' },
	'model.create': {
		riskLevel: 'write',
		description: 'Create a model configuration',
	},
	'model.get': { riskLevel: 'read', description: 'Get a model configuration' },
	'model.update': {
		riskLevel: 'write',
		description: 'Update a model configuration',
	},
	'model.delete': {
		riskLevel: 'destructive',
		description: 'Delete a model configuration',
	},
	'model.listAuthConfigs': {
		riskLevel: 'read',
		description: 'List model auth configs',
	},
	'model.createAuthConfig': {
		riskLevel: 'write',
		description: 'Create a model auth config',
	},
	'model.getAuthConfig': {
		riskLevel: 'read',
		description: 'Get a model auth config',
	},
	'model.updateAuthConfig': {
		riskLevel: 'write',
		description: 'Update a model auth config',
	},
	'model.deleteAuthConfig': {
		riskLevel: 'destructive',
		description: 'Delete a model auth config',
	},
	'organization.list': {
		riskLevel: 'read',
		description: 'List organizations',
	},
	'organization.get': {
		riskLevel: 'read',
		description: 'Get an organization',
	},
	'organization.update': {
		riskLevel: 'write',
		description: 'Update an organization',
	},
	'organization.listApiKeys': {
		riskLevel: 'read',
		description: 'List API keys for an organization',
	},
	'organization.createApiKey': {
		riskLevel: 'write',
		description: 'Create an organization API key',
	},
	'user.list': { riskLevel: 'read', description: 'List users' },
	'user.get': { riskLevel: 'read', description: 'Get a user' },
	'user.getApiKey': { riskLevel: 'read', description: 'Get an API key' },
	'user.deleteApiKey': {
		riskLevel: 'destructive',
		description: 'Delete an API key',
	},
	'billing.managementUrl': {
		riskLevel: 'read',
		description: 'Get the billing management URL',
	},
	'credits.balance': {
		riskLevel: 'read',
		description: 'Get the credits balance',
	},
	'usage.get': { riskLevel: 'read', description: 'Get usage statistics' },
	'config.get': { riskLevel: 'read', description: 'Get Cloud configuration' },
	'connection.list': {
		riskLevel: 'read',
		description: 'List connections',
	},
	'exportJob.list': { riskLevel: 'read', description: 'List export jobs' },
	'exportJob.create': {
		riskLevel: 'write',
		description: 'Create an export job',
	},
	'exportJob.get': { riskLevel: 'read', description: 'Get an export job' },
	'importJob.list': { riskLevel: 'read', description: 'List import jobs' },
	'importJob.create': {
		riskLevel: 'write',
		description: 'Create an import job',
	},
	'importJob.get': { riskLevel: 'read', description: 'Get an import job' },
} as const satisfies RequiredPluginEndpointMeta<typeof griptapeEndpointsNested>;

export const griptapeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGriptapePlugin<T extends GriptapePluginOptions> = CorsairPlugin<
	'griptape',
	typeof GriptapeSchema,
	typeof griptapeEndpointsNested,
	typeof griptapeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGriptapePlugin = BaseGriptapePlugin<GriptapePluginOptions>;

export type ExternalGriptapePlugin<T extends GriptapePluginOptions> =
	BaseGriptapePlugin<T>;

export function griptape<const T extends GriptapePluginOptions>(
	incomingOptions: GriptapePluginOptions & T = {} as GriptapePluginOptions & T,
): ExternalGriptapePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'griptape',
		authConfig: griptapeAuthConfig,
		schema: GriptapeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: griptapeEndpointsNested,
		webhooks: griptapeWebhooksNested,
		endpointMeta: griptapeEndpointMeta,
		endpointSchemas: griptapeEndpointSchemas,
		pluginWebhookMatcher: () => false,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: GriptapeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('griptape', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('griptape', 'api_key');
		},
	} satisfies InternalGriptapePlugin;
}

export type {
	AssistantListInput,
	AssistantListResponse,
	GriptapeEndpointInputs,
	GriptapeEndpointOutputs,
} from './endpoints/types';
