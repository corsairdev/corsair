import {
	get as accountGet,
	update as accountUpdate,
	getPreference,
	setPreference,
} from './account';
import {
	chargeUnpaidInvoices,
	getUpcomingInvoice,
	listInvoices,
	listUsageHistory,
} from './billing';
import {
	create as botsCreate,
	update as botsUpdate,
	listActionRuns,
	listIssues,
} from './bots';
import {
	createConversation,
	listConversations,
	sendMessage,
	updateWorkflow,
} from './chat';
import { remove as filesDelete, listTags, listTagValues } from './files';
import {
	getDereferencedPluginById,
	getIntegrationById,
	getInterface,
	getInterfaceById,
	getPlugin,
	getPluginById,
	getPluginCode,
	getIntegration as hubGetIntegration,
	listIntegrations as hubListIntegrations,
	listPlugins as hubListPlugins,
	listInterfaces,
} from './hub';
import {
	deleteShareableId,
	create as integrationsCreate,
	get as integrationsGet,
	list as integrationsList,
	listApiKeys,
	requestVerification,
	validateUpdate,
} from './integrations';
import {
	remove as knowledgeBasesDelete,
	list as knowledgeBasesList,
} from './knowledge-bases';
import { list as pluginsList } from './plugins';
import { getTableRow, runVrl } from './tools';
import {
	breakDownUsageByBot,
	checkHandleAvailability,
	getAllQuotaCompletion,
	getQuota,
	create as workspacesCreate,
	remove as workspacesDelete,
	get as workspacesGet,
	list as workspacesList,
	listPublic as workspacesListPublic,
	setPreference as workspacesSetPreference,
	update as workspacesUpdate,
} from './workspaces';

export const Account = {
	get: accountGet,
	update: accountUpdate,
	getPreference,
	setPreference,
};

export const Workspaces = {
	create: workspacesCreate,
	get: workspacesGet,
	update: workspacesUpdate,
	delete: workspacesDelete,
	list: workspacesList,
	listPublic: workspacesListPublic,
	checkHandleAvailability,
	setPreference: workspacesSetPreference,
	getQuota,
	getAllQuotaCompletion,
	breakDownUsageByBot,
};

export const Billing = {
	listInvoices,
	getUpcomingInvoice,
	chargeUnpaidInvoices,
	listUsageHistory,
};

export const Bots = {
	create: botsCreate,
	update: botsUpdate,
	listActionRuns,
	listIssues,
};

export const Chat = {
	createConversation,
	listConversations,
	sendMessage,
	updateWorkflow,
};

export const Integrations = {
	create: integrationsCreate,
	get: integrationsGet,
	list: integrationsList,
	validateUpdate,
	requestVerification,
	listApiKeys,
	deleteShareableId,
};

export const Hub = {
	listIntegrations: hubListIntegrations,
	getIntegration: hubGetIntegration,
	getIntegrationById,
	listInterfaces,
	getInterface,
	getInterfaceById,
	listPlugins: hubListPlugins,
	getPlugin,
	getPluginById,
	getPluginCode,
	getDereferencedPluginById,
};

export const Plugins = {
	list: pluginsList,
};

export const Files = {
	delete: filesDelete,
	listTags,
	listTagValues,
};

export const KnowledgeBases = {
	list: knowledgeBasesList,
	delete: knowledgeBasesDelete,
};

export const Tools = {
	runVrl,
	getTableRow,
};

export * from './types';
