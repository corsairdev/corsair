import {
	create as assistantCreate,
	get as assistantGet,
	list as assistantList,
	remove as assistantRemove,
	cancelRun as assistantRunCancel,
	createRun as assistantRunCreate,
	getErrorDetails as assistantRunErrorDetails,
	listEvents as assistantRunEvents,
	getRun as assistantRunGet,
	listRuns as assistantRunList,
	listLogs as assistantRunLogs,
	getResult as assistantRunResult,
	retryRun as assistantRunRetry,
	update as assistantUpdate,
} from './assistants';
import {
	managementUrl as billingManagementUrl,
	config as configGet,
	creditBalance as creditsBalance,
	usage as usageGet,
} from './billing';
import {
	assetUrl as bucketAssetUrl,
	create as bucketCreate,
	createAsset as bucketCreateAsset,
	deleteAsset as bucketDeleteAsset,
	get as bucketGet,
	getAsset as bucketGetAsset,
	list as bucketList,
	listAssets as bucketListAssets,
	remove as bucketRemove,
	update as bucketUpdate,
} from './buckets';
import {
	create as dataConnectorCreate,
	createJob as dataConnectorCreateJob,
	get as dataConnectorGet,
	list as dataConnectorList,
	remove as dataConnectorRemove,
	update as dataConnectorUpdate,
	cancelDataJob as dataJobCancel,
	getDataJob as dataJobGet,
} from './data-connectors';
import {
	create as functionCreate,
	createDeployment as functionCreateDeployment,
	get as functionGet,
	list as functionList,
	listDeployments as functionListDeployments,
	remove as functionRemove,
	update as functionUpdate,
} from './functions';
import {
	create as integrationCreate,
	get as integrationGet,
	list as integrationList,
	remove as integrationRemove,
	update as integrationUpdate,
} from './integrations';
import {
	create as knowledgeBaseCreate,
	createJob as knowledgeBaseCreateJob,
	get as knowledgeBaseGet,
	getJob as knowledgeBaseGetJob,
	getSearch as knowledgeBaseGetSearch,
	list as knowledgeBaseList,
	listJobs as knowledgeBaseListJobs,
	listQueries as knowledgeBaseListQueries,
	listSearches as knowledgeBaseListSearches,
	query as knowledgeBaseQuery,
	remove as knowledgeBaseRemove,
	search as knowledgeBaseSearch,
	update as knowledgeBaseUpdate,
} from './knowledge-bases';
import {
	create as libraryCreate,
	get as libraryGet,
	list as libraryList,
	remove as libraryRemove,
	update as libraryUpdate,
} from './libraries';
import {
	get as messageGet,
	remove as messageRemove,
	update as messageUpdate,
} from './messages';
import {
	listConnections as connectionList,
	createExportJob as exportJobCreate,
	getExportJob as exportJobGet,
	listExportJobs as exportJobList,
	createImportJob as importJobCreate,
	getImportJob as importJobGet,
	listImportJobs as importJobList,
} from './misc';
import {
	createModel as modelCreate,
	createAuthConfig as modelCreateAuthConfig,
	getModel as modelGet,
	getAuthConfig as modelGetAuthConfig,
	listModels as modelList,
	listAuthConfigs as modelListAuthConfigs,
	removeModel as modelRemove,
	removeAuthConfig as modelRemoveAuthConfig,
	updateModel as modelUpdate,
	updateAuthConfig as modelUpdateAuthConfig,
} from './models';
import {
	createApiKey as organizationCreateApiKey,
	get as organizationGet,
	list as organizationList,
	listApiKeys as organizationListApiKeys,
	update as organizationUpdate,
} from './organizations';
import {
	createComponent as retrieverComponentCreate,
	getComponent as retrieverComponentGet,
	listComponents as retrieverComponentList,
	updateComponent as retrieverComponentUpdate,
	createRetriever as retrieverCreate,
	getRetriever as retrieverGet,
	listRetrievers as retrieverList,
	queryRetriever as retrieverQuery,
	updateRetriever as retrieverUpdate,
} from './retrievers';
import {
	createRule as ruleCreate,
	getRule as ruleGet,
	listRules as ruleList,
	removeRule as ruleRemove,
	createRuleset as rulesetCreate,
	getRuleset as rulesetGet,
	getRulesetByAlias as rulesetGetByAlias,
	removeRuleset as rulesetRemove,
	updateRuleset as rulesetUpdate,
	updateRule as ruleUpdate,
} from './rules';
import {
	create as secretCreate,
	get as secretGet,
	list as secretList,
	remove as secretRemove,
	update as secretUpdate,
} from './secrets';
import {
	create as structureCreate,
	createDeployment as structureCreateDeployment,
	dashboard as structureDashboard,
	get as structureGet,
	list as structureList,
	listDeployments as structureListDeployments,
	listRuns as structureListRuns,
	remove as structureRemove,
	update as structureUpdate,
} from './structures';
import {
	create as threadCreate,
	get as threadGet,
	list as threadList,
	createMessage as threadMessageCreate,
	listMessages as threadMessageList,
	remove as threadRemove,
	update as threadUpdate,
} from './threads';
import {
	create as toolCreate,
	createDeployment as toolCreateDeployment,
	deploymentStatus as toolDeploymentStatus,
	get as toolGet,
	list as toolList,
	listDeployments as toolListDeployments,
	listRuns as toolListRuns,
	remove as toolRemove,
	update as toolUpdate,
} from './tools';
import {
	deleteApiKey as userDeleteApiKey,
	get as userGet,
	getApiKey as userGetApiKey,
	list as userList,
} from './users';

export const Assistant = {
	list: assistantList,
	get: assistantGet,
	create: assistantCreate,
	update: assistantUpdate,
	delete: assistantRemove,
};

export const AssistantRun = {
	create: assistantRunCreate,
	list: assistantRunList,
	get: assistantRunGet,
	cancel: assistantRunCancel,
	result: assistantRunResult,
	retry: assistantRunRetry,
	errorDetails: assistantRunErrorDetails,
	logs: assistantRunLogs,
	events: assistantRunEvents,
};

export const Thread = {
	list: threadList,
	create: threadCreate,
	get: threadGet,
	update: threadUpdate,
	delete: threadRemove,
};

export const ThreadMessage = {
	list: threadMessageList,
	create: threadMessageCreate,
};

export const Message = {
	get: messageGet,
	update: messageUpdate,
	delete: messageRemove,
};

export const KnowledgeBase = {
	list: knowledgeBaseList,
	create: knowledgeBaseCreate,
	get: knowledgeBaseGet,
	update: knowledgeBaseUpdate,
	delete: knowledgeBaseRemove,
	query: knowledgeBaseQuery,
	search: knowledgeBaseSearch,
	listQueries: knowledgeBaseListQueries,
	listSearches: knowledgeBaseListSearches,
	getSearch: knowledgeBaseGetSearch,
	createJob: knowledgeBaseCreateJob,
	listJobs: knowledgeBaseListJobs,
	getJob: knowledgeBaseGetJob,
};

export const DataConnector = {
	list: dataConnectorList,
	create: dataConnectorCreate,
	get: dataConnectorGet,
	update: dataConnectorUpdate,
	delete: dataConnectorRemove,
	createJob: dataConnectorCreateJob,
};

export const DataJob = {
	get: dataJobGet,
	cancel: dataJobCancel,
};

export const Structure = {
	list: structureList,
	create: structureCreate,
	get: structureGet,
	update: structureUpdate,
	delete: structureRemove,
	dashboard: structureDashboard,
	listRuns: structureListRuns,
	listDeployments: structureListDeployments,
	createDeployment: structureCreateDeployment,
};

export const Tool = {
	list: toolList,
	create: toolCreate,
	get: toolGet,
	update: toolUpdate,
	delete: toolRemove,
	listRuns: toolListRuns,
	listDeployments: toolListDeployments,
	createDeployment: toolCreateDeployment,
	deploymentStatus: toolDeploymentStatus,
};

export const Function = {
	list: functionList,
	create: functionCreate,
	get: functionGet,
	update: functionUpdate,
	delete: functionRemove,
	listDeployments: functionListDeployments,
	createDeployment: functionCreateDeployment,
};

export const Rule = {
	list: ruleList,
	create: ruleCreate,
	get: ruleGet,
	update: ruleUpdate,
	delete: ruleRemove,
};

export const Ruleset = {
	create: rulesetCreate,
	get: rulesetGet,
	getByAlias: rulesetGetByAlias,
	update: rulesetUpdate,
	delete: rulesetRemove,
};

export const Retriever = {
	list: retrieverList,
	create: retrieverCreate,
	get: retrieverGet,
	update: retrieverUpdate,
	query: retrieverQuery,
};

export const RetrieverComponent = {
	list: retrieverComponentList,
	create: retrieverComponentCreate,
	get: retrieverComponentGet,
	update: retrieverComponentUpdate,
};

export const Library = {
	list: libraryList,
	create: libraryCreate,
	get: libraryGet,
	update: libraryUpdate,
	delete: libraryRemove,
};

export const Integration = {
	list: integrationList,
	create: integrationCreate,
	get: integrationGet,
	update: integrationUpdate,
	delete: integrationRemove,
};

export const Bucket = {
	list: bucketList,
	create: bucketCreate,
	get: bucketGet,
	update: bucketUpdate,
	delete: bucketRemove,
	listAssets: bucketListAssets,
	getAsset: bucketGetAsset,
	createAsset: bucketCreateAsset,
	deleteAsset: bucketDeleteAsset,
	assetUrl: bucketAssetUrl,
};

export const Secret = {
	list: secretList,
	create: secretCreate,
	get: secretGet,
	update: secretUpdate,
	delete: secretRemove,
};

export const Model = {
	list: modelList,
	create: modelCreate,
	get: modelGet,
	update: modelUpdate,
	delete: modelRemove,
	listAuthConfigs: modelListAuthConfigs,
	createAuthConfig: modelCreateAuthConfig,
	getAuthConfig: modelGetAuthConfig,
	updateAuthConfig: modelUpdateAuthConfig,
	deleteAuthConfig: modelRemoveAuthConfig,
};

export const Organization = {
	list: organizationList,
	get: organizationGet,
	update: organizationUpdate,
	listApiKeys: organizationListApiKeys,
	createApiKey: organizationCreateApiKey,
};

export const User = {
	list: userList,
	get: userGet,
	getApiKey: userGetApiKey,
	deleteApiKey: userDeleteApiKey,
};

export const Billing = {
	managementUrl: billingManagementUrl,
};

export const Credits = {
	balance: creditsBalance,
};

export const Usage = {
	get: usageGet,
};

export const Config = {
	get: configGet,
};

export const Connection = {
	list: connectionList,
};

export const ExportJob = {
	list: exportJobList,
	create: exportJobCreate,
	get: exportJobGet,
};

export const ImportJob = {
	list: importJobList,
	create: importJobCreate,
	get: importJobGet,
};

export * from './types';
