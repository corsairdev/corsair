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
	addAccountContacts,
	addAccountUsers,
	createAccount,
	createCall,
	createContact,
	createCustomFieldSub,
	createMeeting,
	createMessage,
	createMessageFeedback,
	createOpportunity,
	createTag,
	createTask,
	createWorkflow,
	deleteAccount,
	deleteContact,
	deleteCustomField,
	deleteMeeting,
	deleteMessage,
	deleteOpportunity,
	deleteTag,
	deleteTask,
	listAccountFeed,
	listAccountMessages,
	listAccounts,
	listCampaignMergeFields,
	listContacts,
	listCurrencies,
	listCustomFieldOptions,
	listCustomFields,
	listCustomFieldTypes,
	listEmailDataSources,
	listFilterFields,
	listGroups,
	listMyContacts,
	listOpportunities,
	listPersons,
	listPipelines,
	listStages,
	listTags,
	listTagUsage,
	listTasks,
	listUsers,
	listWorkflows,
	retrieveAccount,
	retrieveAiSettings,
	retrieveContact,
	retrieveCurrentUser,
	retrieveCustomField,
	retrieveGroup,
	retrieveMeeting,
	retrieveOpportunity,
	retrieveStage,
	retrieveTag,
	retrieveUser,
	retrieveWorkflow,
	updateAccount,
	updateAccountContacts,
	updateAccountUsers,
	updateAiSettings,
	updateCall,
	updateContact,
	updateCustomField,
	updateEmailDataSource,
	updateMeeting,
	updateMessage,
	updateOpportunity,
	updateTag,
	updateTask,
	updateWorkflow,
	updateWorkflowAudience,
} from './endpoints';
import type {
	SalesflareEndpointInputs,
	SalesflareEndpointOutputs,
} from './endpoints/types';
import {
	SalesflareEndpointInputSchemas,
	SalesflareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SalesflareSchema } from './schema';

export type SalesflarePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSalesflarePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof salesflareEndpointsNested>;
};

export type SalesflareContext = CorsairPluginContext<
	typeof SalesflareSchema,
	SalesflarePluginOptions
>;

export type SalesflareKeyBuilderContext =
	KeyBuilderContext<SalesflarePluginOptions>;

export type SalesflareBoundEndpoints = BindEndpoints<
	typeof salesflareEndpointsNested
>;

type SalesflareEndpoint<K extends keyof SalesflareEndpointOutputs> =
	CorsairEndpoint<
		SalesflareContext,
		SalesflareEndpointInputs[K],
		SalesflareEndpointOutputs[K]
	>;

export type SalesflareEndpoints = {
	listAccounts: SalesflareEndpoint<'listAccounts'>;
	createAccount: SalesflareEndpoint<'createAccount'>;
	listContacts: SalesflareEndpoint<'listContacts'>;
	createContact: SalesflareEndpoint<'createContact'>;
	listCurrencies: SalesflareEndpoint<'listCurrencies'>;
	listGroups: SalesflareEndpoint<'listGroups'>;
	retrieveCurrentUser: SalesflareEndpoint<'retrieveCurrentUser'>;
	listOpportunities: SalesflareEndpoint<'listOpportunities'>;
	createOpportunity: SalesflareEndpoint<'createOpportunity'>;
	listPersons: SalesflareEndpoint<'listPersons'>;
	listPipelines: SalesflareEndpoint<'listPipelines'>;
	listStages: SalesflareEndpoint<'listStages'>;
	listTags: SalesflareEndpoint<'listTags'>;
	createTag: SalesflareEndpoint<'createTag'>;
	listTasks: SalesflareEndpoint<'listTasks'>;
	createTask: SalesflareEndpoint<'createTask'>;
	listUsers: SalesflareEndpoint<'listUsers'>;
	listWorkflows: SalesflareEndpoint<'listWorkflows'>;
	createWorkflow: SalesflareEndpoint<'createWorkflow'>;
	retrieveAccount: SalesflareEndpoint<'retrieveAccount'>;
	updateAccount: SalesflareEndpoint<'updateAccount'>;
	deleteAccount: SalesflareEndpoint<'deleteAccount'>;
	listCampaignMergeFields: SalesflareEndpoint<'listCampaignMergeFields'>;
	retrieveContact: SalesflareEndpoint<'retrieveContact'>;
	updateContact: SalesflareEndpoint<'updateContact'>;
	deleteContact: SalesflareEndpoint<'deleteContact'>;
	listCustomFieldTypes: SalesflareEndpoint<'listCustomFieldTypes'>;
	listCustomFields: SalesflareEndpoint<'listCustomFields'>;
	createCustomFieldSub: SalesflareEndpoint<'createCustomFieldSub'>;
	listEmailDataSources: SalesflareEndpoint<'listEmailDataSources'>;
	listFilterFields: SalesflareEndpoint<'listFilterFields'>;
	retrieveGroup: SalesflareEndpoint<'retrieveGroup'>;
	listMyContacts: SalesflareEndpoint<'listMyContacts'>;
	retrieveMeeting: SalesflareEndpoint<'retrieveMeeting'>;
	updateMeeting: SalesflareEndpoint<'updateMeeting'>;
	deleteMeeting: SalesflareEndpoint<'deleteMeeting'>;
	retrieveOpportunity: SalesflareEndpoint<'retrieveOpportunity'>;
	updateOpportunity: SalesflareEndpoint<'updateOpportunity'>;
	deleteOpportunity: SalesflareEndpoint<'deleteOpportunity'>;
	retrieveAiSettings: SalesflareEndpoint<'retrieveAiSettings'>;
	updateAiSettings: SalesflareEndpoint<'updateAiSettings'>;
	retrieveStage: SalesflareEndpoint<'retrieveStage'>;
	retrieveTag: SalesflareEndpoint<'retrieveTag'>;
	updateTag: SalesflareEndpoint<'updateTag'>;
	deleteTag: SalesflareEndpoint<'deleteTag'>;
	retrieveUser: SalesflareEndpoint<'retrieveUser'>;
	retrieveWorkflow: SalesflareEndpoint<'retrieveWorkflow'>;
	updateWorkflow: SalesflareEndpoint<'updateWorkflow'>;
	listAccountMessages: SalesflareEndpoint<'listAccountMessages'>;
	listAccountFeed: SalesflareEndpoint<'listAccountFeed'>;
	retrieveCustomField: SalesflareEndpoint<'retrieveCustomField'>;
	updateCustomField: SalesflareEndpoint<'updateCustomField'>;
	deleteCustomField: SalesflareEndpoint<'deleteCustomField'>;
	listTagUsage: SalesflareEndpoint<'listTagUsage'>;
	listCustomFieldOptions: SalesflareEndpoint<'listCustomFieldOptions'>;
	createCall: SalesflareEndpoint<'createCall'>;
	createMeeting: SalesflareEndpoint<'createMeeting'>;
	createMessage: SalesflareEndpoint<'createMessage'>;
	addAccountUsers: SalesflareEndpoint<'addAccountUsers'>;
	updateAccountUsers: SalesflareEndpoint<'updateAccountUsers'>;
	addAccountContacts: SalesflareEndpoint<'addAccountContacts'>;
	updateAccountContacts: SalesflareEndpoint<'updateAccountContacts'>;
	createMessageFeedback: SalesflareEndpoint<'createMessageFeedback'>;
	updateCall: SalesflareEndpoint<'updateCall'>;
	updateMessage: SalesflareEndpoint<'updateMessage'>;
	deleteMessage: SalesflareEndpoint<'deleteMessage'>;
	updateTask: SalesflareEndpoint<'updateTask'>;
	deleteTask: SalesflareEndpoint<'deleteTask'>;
	updateEmailDataSource: SalesflareEndpoint<'updateEmailDataSource'>;
	updateWorkflowAudience: SalesflareEndpoint<'updateWorkflowAudience'>;
};

const salesflareEndpointsNested = {
	accounts: {
		listAccounts: listAccounts,
		createAccount: createAccount,
		retrieveAccount: retrieveAccount,
		updateAccount: updateAccount,
		deleteAccount: deleteAccount,
		listAccountMessages: listAccountMessages,
		listAccountFeed: listAccountFeed,
		addAccountUsers: addAccountUsers,
		updateAccountUsers: updateAccountUsers,
		addAccountContacts: addAccountContacts,
		updateAccountContacts: updateAccountContacts,
	},
	contacts: {
		listContacts: listContacts,
		createContact: createContact,
		retrieveContact: retrieveContact,
		updateContact: updateContact,
		deleteContact: deleteContact,
	},
	currencies: {
		listCurrencies: listCurrencies,
	},
	groups: {
		listGroups: listGroups,
		retrieveGroup: retrieveGroup,
	},
	me: {
		retrieveCurrentUser: retrieveCurrentUser,
		listMyContacts: listMyContacts,
	},
	opportunities: {
		listOpportunities: listOpportunities,
		createOpportunity: createOpportunity,
		retrieveOpportunity: retrieveOpportunity,
		updateOpportunity: updateOpportunity,
		deleteOpportunity: deleteOpportunity,
	},
	persons: {
		listPersons: listPersons,
	},
	pipelines: {
		listPipelines: listPipelines,
	},
	stages: {
		listStages: listStages,
		retrieveStage: retrieveStage,
	},
	tags: {
		listTags: listTags,
		createTag: createTag,
		retrieveTag: retrieveTag,
		updateTag: updateTag,
		deleteTag: deleteTag,
		listTagUsage: listTagUsage,
	},
	tasks: {
		listTasks: listTasks,
		createTask: createTask,
		updateTask: updateTask,
		deleteTask: deleteTask,
	},
	users: {
		listUsers: listUsers,
		retrieveUser: retrieveUser,
	},
	workflows: {
		listWorkflows: listWorkflows,
		createWorkflow: createWorkflow,
		retrieveWorkflow: retrieveWorkflow,
		updateWorkflow: updateWorkflow,
		updateWorkflowAudience: updateWorkflowAudience,
	},
	campaigns: {
		listCampaignMergeFields: listCampaignMergeFields,
	},
	customfields: {
		listCustomFieldTypes: listCustomFieldTypes,
		listCustomFields: listCustomFields,
		createCustomFieldSub: createCustomFieldSub,
		retrieveCustomField: retrieveCustomField,
		updateCustomField: updateCustomField,
		deleteCustomField: deleteCustomField,
		listCustomFieldOptions: listCustomFieldOptions,
	},
	datasources: {
		listEmailDataSources: listEmailDataSources,
		updateEmailDataSource: updateEmailDataSource,
	},
	filterfields: {
		listFilterFields: listFilterFields,
	},
	meetings: {
		retrieveMeeting: retrieveMeeting,
		updateMeeting: updateMeeting,
		deleteMeeting: deleteMeeting,
		createMeeting: createMeeting,
	},
	settings: {
		retrieveAiSettings: retrieveAiSettings,
		updateAiSettings: updateAiSettings,
	},
	calls: {
		createCall: createCall,
		updateCall: updateCall,
	},
	messages: {
		createMessage: createMessage,
		createMessageFeedback: createMessageFeedback,
		updateMessage: updateMessage,
		deleteMessage: deleteMessage,
	},
} as const;

export const salesflareEndpointSchemas = {
	'accounts.listAccounts': {
		input: SalesflareEndpointInputSchemas.listAccounts,
		output: SalesflareEndpointOutputSchemas.listAccounts,
	},
	'accounts.createAccount': {
		input: SalesflareEndpointInputSchemas.createAccount,
		output: SalesflareEndpointOutputSchemas.createAccount,
	},
	'contacts.listContacts': {
		input: SalesflareEndpointInputSchemas.listContacts,
		output: SalesflareEndpointOutputSchemas.listContacts,
	},
	'contacts.createContact': {
		input: SalesflareEndpointInputSchemas.createContact,
		output: SalesflareEndpointOutputSchemas.createContact,
	},
	'currencies.listCurrencies': {
		input: SalesflareEndpointInputSchemas.listCurrencies,
		output: SalesflareEndpointOutputSchemas.listCurrencies,
	},
	'groups.listGroups': {
		input: SalesflareEndpointInputSchemas.listGroups,
		output: SalesflareEndpointOutputSchemas.listGroups,
	},
	'me.retrieveCurrentUser': {
		input: SalesflareEndpointInputSchemas.retrieveCurrentUser,
		output: SalesflareEndpointOutputSchemas.retrieveCurrentUser,
	},
	'opportunities.listOpportunities': {
		input: SalesflareEndpointInputSchemas.listOpportunities,
		output: SalesflareEndpointOutputSchemas.listOpportunities,
	},
	'opportunities.createOpportunity': {
		input: SalesflareEndpointInputSchemas.createOpportunity,
		output: SalesflareEndpointOutputSchemas.createOpportunity,
	},
	'persons.listPersons': {
		input: SalesflareEndpointInputSchemas.listPersons,
		output: SalesflareEndpointOutputSchemas.listPersons,
	},
	'pipelines.listPipelines': {
		input: SalesflareEndpointInputSchemas.listPipelines,
		output: SalesflareEndpointOutputSchemas.listPipelines,
	},
	'stages.listStages': {
		input: SalesflareEndpointInputSchemas.listStages,
		output: SalesflareEndpointOutputSchemas.listStages,
	},
	'tags.listTags': {
		input: SalesflareEndpointInputSchemas.listTags,
		output: SalesflareEndpointOutputSchemas.listTags,
	},
	'tags.createTag': {
		input: SalesflareEndpointInputSchemas.createTag,
		output: SalesflareEndpointOutputSchemas.createTag,
	},
	'tasks.listTasks': {
		input: SalesflareEndpointInputSchemas.listTasks,
		output: SalesflareEndpointOutputSchemas.listTasks,
	},
	'tasks.createTask': {
		input: SalesflareEndpointInputSchemas.createTask,
		output: SalesflareEndpointOutputSchemas.createTask,
	},
	'users.listUsers': {
		input: SalesflareEndpointInputSchemas.listUsers,
		output: SalesflareEndpointOutputSchemas.listUsers,
	},
	'workflows.listWorkflows': {
		input: SalesflareEndpointInputSchemas.listWorkflows,
		output: SalesflareEndpointOutputSchemas.listWorkflows,
	},
	'workflows.createWorkflow': {
		input: SalesflareEndpointInputSchemas.createWorkflow,
		output: SalesflareEndpointOutputSchemas.createWorkflow,
	},
	'accounts.retrieveAccount': {
		input: SalesflareEndpointInputSchemas.retrieveAccount,
		output: SalesflareEndpointOutputSchemas.retrieveAccount,
	},
	'accounts.updateAccount': {
		input: SalesflareEndpointInputSchemas.updateAccount,
		output: SalesflareEndpointOutputSchemas.updateAccount,
	},
	'accounts.deleteAccount': {
		input: SalesflareEndpointInputSchemas.deleteAccount,
		output: SalesflareEndpointOutputSchemas.deleteAccount,
	},
	'campaigns.listCampaignMergeFields': {
		input: SalesflareEndpointInputSchemas.listCampaignMergeFields,
		output: SalesflareEndpointOutputSchemas.listCampaignMergeFields,
	},
	'contacts.retrieveContact': {
		input: SalesflareEndpointInputSchemas.retrieveContact,
		output: SalesflareEndpointOutputSchemas.retrieveContact,
	},
	'contacts.updateContact': {
		input: SalesflareEndpointInputSchemas.updateContact,
		output: SalesflareEndpointOutputSchemas.updateContact,
	},
	'contacts.deleteContact': {
		input: SalesflareEndpointInputSchemas.deleteContact,
		output: SalesflareEndpointOutputSchemas.deleteContact,
	},
	'customfields.listCustomFieldTypes': {
		input: SalesflareEndpointInputSchemas.listCustomFieldTypes,
		output: SalesflareEndpointOutputSchemas.listCustomFieldTypes,
	},
	'customfields.listCustomFields': {
		input: SalesflareEndpointInputSchemas.listCustomFields,
		output: SalesflareEndpointOutputSchemas.listCustomFields,
	},
	'customfields.createCustomFieldSub': {
		input: SalesflareEndpointInputSchemas.createCustomFieldSub,
		output: SalesflareEndpointOutputSchemas.createCustomFieldSub,
	},
	'datasources.listEmailDataSources': {
		input: SalesflareEndpointInputSchemas.listEmailDataSources,
		output: SalesflareEndpointOutputSchemas.listEmailDataSources,
	},
	'filterfields.listFilterFields': {
		input: SalesflareEndpointInputSchemas.listFilterFields,
		output: SalesflareEndpointOutputSchemas.listFilterFields,
	},
	'groups.retrieveGroup': {
		input: SalesflareEndpointInputSchemas.retrieveGroup,
		output: SalesflareEndpointOutputSchemas.retrieveGroup,
	},
	'me.listMyContacts': {
		input: SalesflareEndpointInputSchemas.listMyContacts,
		output: SalesflareEndpointOutputSchemas.listMyContacts,
	},
	'meetings.retrieveMeeting': {
		input: SalesflareEndpointInputSchemas.retrieveMeeting,
		output: SalesflareEndpointOutputSchemas.retrieveMeeting,
	},
	'meetings.updateMeeting': {
		input: SalesflareEndpointInputSchemas.updateMeeting,
		output: SalesflareEndpointOutputSchemas.updateMeeting,
	},
	'meetings.deleteMeeting': {
		input: SalesflareEndpointInputSchemas.deleteMeeting,
		output: SalesflareEndpointOutputSchemas.deleteMeeting,
	},
	'opportunities.retrieveOpportunity': {
		input: SalesflareEndpointInputSchemas.retrieveOpportunity,
		output: SalesflareEndpointOutputSchemas.retrieveOpportunity,
	},
	'opportunities.updateOpportunity': {
		input: SalesflareEndpointInputSchemas.updateOpportunity,
		output: SalesflareEndpointOutputSchemas.updateOpportunity,
	},
	'opportunities.deleteOpportunity': {
		input: SalesflareEndpointInputSchemas.deleteOpportunity,
		output: SalesflareEndpointOutputSchemas.deleteOpportunity,
	},
	'settings.retrieveAiSettings': {
		input: SalesflareEndpointInputSchemas.retrieveAiSettings,
		output: SalesflareEndpointOutputSchemas.retrieveAiSettings,
	},
	'settings.updateAiSettings': {
		input: SalesflareEndpointInputSchemas.updateAiSettings,
		output: SalesflareEndpointOutputSchemas.updateAiSettings,
	},
	'stages.retrieveStage': {
		input: SalesflareEndpointInputSchemas.retrieveStage,
		output: SalesflareEndpointOutputSchemas.retrieveStage,
	},
	'tags.retrieveTag': {
		input: SalesflareEndpointInputSchemas.retrieveTag,
		output: SalesflareEndpointOutputSchemas.retrieveTag,
	},
	'tags.updateTag': {
		input: SalesflareEndpointInputSchemas.updateTag,
		output: SalesflareEndpointOutputSchemas.updateTag,
	},
	'tags.deleteTag': {
		input: SalesflareEndpointInputSchemas.deleteTag,
		output: SalesflareEndpointOutputSchemas.deleteTag,
	},
	'users.retrieveUser': {
		input: SalesflareEndpointInputSchemas.retrieveUser,
		output: SalesflareEndpointOutputSchemas.retrieveUser,
	},
	'workflows.retrieveWorkflow': {
		input: SalesflareEndpointInputSchemas.retrieveWorkflow,
		output: SalesflareEndpointOutputSchemas.retrieveWorkflow,
	},
	'workflows.updateWorkflow': {
		input: SalesflareEndpointInputSchemas.updateWorkflow,
		output: SalesflareEndpointOutputSchemas.updateWorkflow,
	},
	'accounts.listAccountMessages': {
		input: SalesflareEndpointInputSchemas.listAccountMessages,
		output: SalesflareEndpointOutputSchemas.listAccountMessages,
	},
	'accounts.listAccountFeed': {
		input: SalesflareEndpointInputSchemas.listAccountFeed,
		output: SalesflareEndpointOutputSchemas.listAccountFeed,
	},
	'customfields.retrieveCustomField': {
		input: SalesflareEndpointInputSchemas.retrieveCustomField,
		output: SalesflareEndpointOutputSchemas.retrieveCustomField,
	},
	'customfields.updateCustomField': {
		input: SalesflareEndpointInputSchemas.updateCustomField,
		output: SalesflareEndpointOutputSchemas.updateCustomField,
	},
	'customfields.deleteCustomField': {
		input: SalesflareEndpointInputSchemas.deleteCustomField,
		output: SalesflareEndpointOutputSchemas.deleteCustomField,
	},
	'tags.listTagUsage': {
		input: SalesflareEndpointInputSchemas.listTagUsage,
		output: SalesflareEndpointOutputSchemas.listTagUsage,
	},
	'customfields.listCustomFieldOptions': {
		input: SalesflareEndpointInputSchemas.listCustomFieldOptions,
		output: SalesflareEndpointOutputSchemas.listCustomFieldOptions,
	},
	'calls.createCall': {
		input: SalesflareEndpointInputSchemas.createCall,
		output: SalesflareEndpointOutputSchemas.createCall,
	},
	'meetings.createMeeting': {
		input: SalesflareEndpointInputSchemas.createMeeting,
		output: SalesflareEndpointOutputSchemas.createMeeting,
	},
	'messages.createMessage': {
		input: SalesflareEndpointInputSchemas.createMessage,
		output: SalesflareEndpointOutputSchemas.createMessage,
	},
	'accounts.addAccountUsers': {
		input: SalesflareEndpointInputSchemas.addAccountUsers,
		output: SalesflareEndpointOutputSchemas.addAccountUsers,
	},
	'accounts.updateAccountUsers': {
		input: SalesflareEndpointInputSchemas.updateAccountUsers,
		output: SalesflareEndpointOutputSchemas.updateAccountUsers,
	},
	'accounts.addAccountContacts': {
		input: SalesflareEndpointInputSchemas.addAccountContacts,
		output: SalesflareEndpointOutputSchemas.addAccountContacts,
	},
	'accounts.updateAccountContacts': {
		input: SalesflareEndpointInputSchemas.updateAccountContacts,
		output: SalesflareEndpointOutputSchemas.updateAccountContacts,
	},
	'messages.createMessageFeedback': {
		input: SalesflareEndpointInputSchemas.createMessageFeedback,
		output: SalesflareEndpointOutputSchemas.createMessageFeedback,
	},
	'calls.updateCall': {
		input: SalesflareEndpointInputSchemas.updateCall,
		output: SalesflareEndpointOutputSchemas.updateCall,
	},
	'messages.updateMessage': {
		input: SalesflareEndpointInputSchemas.updateMessage,
		output: SalesflareEndpointOutputSchemas.updateMessage,
	},
	'messages.deleteMessage': {
		input: SalesflareEndpointInputSchemas.deleteMessage,
		output: SalesflareEndpointOutputSchemas.deleteMessage,
	},
	'tasks.updateTask': {
		input: SalesflareEndpointInputSchemas.updateTask,
		output: SalesflareEndpointOutputSchemas.updateTask,
	},
	'tasks.deleteTask': {
		input: SalesflareEndpointInputSchemas.deleteTask,
		output: SalesflareEndpointOutputSchemas.deleteTask,
	},
	'datasources.updateEmailDataSource': {
		input: SalesflareEndpointInputSchemas.updateEmailDataSource,
		output: SalesflareEndpointOutputSchemas.updateEmailDataSource,
	},
	'workflows.updateWorkflowAudience': {
		input: SalesflareEndpointInputSchemas.updateWorkflowAudience,
		output: SalesflareEndpointOutputSchemas.updateWorkflowAudience,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof salesflareEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const salesflareEndpointMeta = {
	'accounts.listAccounts': {
		riskLevel: 'read',
		description: 'List Accounts',
	},
	'accounts.createAccount': {
		riskLevel: 'write',
		description: 'Create a new account',
	},
	'contacts.listContacts': {
		riskLevel: 'read',
		description: 'List Contacts',
	},
	'contacts.createContact': {
		riskLevel: 'write',
		description: 'Create a new contact',
	},
	'currencies.listCurrencies': {
		riskLevel: 'read',
		description: 'List Currencies',
	},
	'groups.listGroups': {
		riskLevel: 'read',
		description: 'List Groups',
	},
	'me.retrieveCurrentUser': {
		riskLevel: 'read',
		description: 'Retrieve the currently authenticated user',
	},
	'opportunities.listOpportunities': {
		riskLevel: 'read',
		description: 'List Opportunities',
	},
	'opportunities.createOpportunity': {
		riskLevel: 'write',
		description: 'Create a new opportunity',
	},
	'persons.listPersons': {
		riskLevel: 'read',
		description: 'List persons resolved from email addresses',
	},
	'pipelines.listPipelines': {
		riskLevel: 'read',
		description: 'List Pipelines',
	},
	'stages.listStages': {
		riskLevel: 'read',
		description: 'List Stages',
	},
	'tags.listTags': {
		riskLevel: 'read',
		description: 'List Tags',
	},
	'tags.createTag': {
		riskLevel: 'write',
		description: 'Create a new tag',
	},
	'tasks.listTasks': {
		riskLevel: 'read',
		description: 'List Tasks',
	},
	'tasks.createTask': {
		riskLevel: 'write',
		description: 'Create a new task',
	},
	'users.listUsers': {
		riskLevel: 'read',
		description: 'List Users',
	},
	'workflows.listWorkflows': {
		riskLevel: 'read',
		description: 'List Workflows',
	},
	'workflows.createWorkflow': {
		riskLevel: 'write',
		description: 'Create a new workflow',
	},
	'accounts.retrieveAccount': {
		riskLevel: 'read',
		description: 'Retrieve a single account by ID',
	},
	'accounts.updateAccount': {
		riskLevel: 'write',
		description: 'Update a account',
	},
	'accounts.deleteAccount': {
		riskLevel: 'destructive',
		description: 'Delete a account',
	},
	'campaigns.listCampaignMergeFields': {
		riskLevel: 'read',
		description: 'List the merge fields available for campaigns',
	},
	'contacts.retrieveContact': {
		riskLevel: 'read',
		description: 'Retrieve a single contact by ID',
	},
	'contacts.updateContact': {
		riskLevel: 'write',
		description: 'Update a contact',
	},
	'contacts.deleteContact': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
	},
	'customfields.listCustomFieldTypes': {
		riskLevel: 'read',
		description: 'List the custom field types supported by Salesflare',
	},
	'customfields.listCustomFields': {
		riskLevel: 'read',
		description: 'List the custom fields of an item class',
	},
	'customfields.createCustomFieldSub': {
		riskLevel: 'write',
		description: 'Create a new customField sub-resource',
	},
	'datasources.listEmailDataSources': {
		riskLevel: 'read',
		description: 'List the connected email data sources',
	},
	'filterfields.listFilterFields': {
		riskLevel: 'read',
		description: 'List the filter fields available for an entity',
	},
	'groups.retrieveGroup': {
		riskLevel: 'read',
		description: 'Retrieve a single group by ID',
	},
	'me.listMyContacts': {
		riskLevel: 'read',
		description: 'List contacts assigned to the current user',
	},
	'meetings.retrieveMeeting': {
		riskLevel: 'read',
		description: 'Retrieve a single meeting by ID',
	},
	'meetings.updateMeeting': {
		riskLevel: 'write',
		description: 'Update a meeting',
	},
	'meetings.deleteMeeting': {
		riskLevel: 'destructive',
		description: 'Delete a meeting',
	},
	'opportunities.retrieveOpportunity': {
		riskLevel: 'read',
		description: 'Retrieve a single opportunity by ID',
	},
	'opportunities.updateOpportunity': {
		riskLevel: 'write',
		description: 'Update a opportunity',
	},
	'opportunities.deleteOpportunity': {
		riskLevel: 'destructive',
		description: 'Delete a opportunity',
	},
	'settings.retrieveAiSettings': {
		riskLevel: 'read',
		description: "Retrieve the workspace's AI settings",
	},
	'settings.updateAiSettings': {
		riskLevel: 'write',
		description: "Update the workspace's AI settings",
	},
	'stages.retrieveStage': {
		riskLevel: 'read',
		description: 'Retrieve a single stage by ID',
	},
	'tags.retrieveTag': {
		riskLevel: 'read',
		description: 'Retrieve a single tag by ID',
	},
	'tags.updateTag': {
		riskLevel: 'write',
		description: 'Update a tag',
	},
	'tags.deleteTag': {
		riskLevel: 'destructive',
		description: 'Delete a tag',
	},
	'users.retrieveUser': {
		riskLevel: 'read',
		description: 'Retrieve a single user by ID',
	},
	'workflows.retrieveWorkflow': {
		riskLevel: 'read',
		description: 'Retrieve a single workflow by ID',
	},
	'workflows.updateWorkflow': {
		riskLevel: 'write',
		description: 'Update a workflow',
	},
	'accounts.listAccountMessages': {
		riskLevel: 'read',
		description: 'List messages on an account',
	},
	'accounts.listAccountFeed': {
		riskLevel: 'read',
		description: 'List the activity feed of an account',
	},
	'customfields.retrieveCustomField': {
		riskLevel: 'read',
		description: 'Retrieve a single customField by ID',
	},
	'customfields.updateCustomField': {
		riskLevel: 'write',
		description: 'Update a customField',
	},
	'customfields.deleteCustomField': {
		riskLevel: 'destructive',
		description: 'Delete a customField',
	},
	'tags.listTagUsage': {
		riskLevel: 'read',
		description: 'List the usage statistics of a tag',
	},
	'customfields.listCustomFieldOptions': {
		riskLevel: 'read',
		description: 'List the options of a custom field',
	},
	'calls.createCall': {
		riskLevel: 'write',
		description: 'Create a new call',
	},
	'meetings.createMeeting': {
		riskLevel: 'write',
		description: 'Create a new meeting',
	},
	'messages.createMessage': {
		riskLevel: 'write',
		description: 'Create a new message',
	},
	'accounts.addAccountUsers': {
		riskLevel: 'write',
		description: 'Add users to an account',
	},
	'accounts.updateAccountUsers': {
		riskLevel: 'write',
		description: 'Update the users assigned to an account',
	},
	'accounts.addAccountContacts': {
		riskLevel: 'write',
		description: 'Link contacts to an account',
	},
	'accounts.updateAccountContacts': {
		riskLevel: 'write',
		description: 'Update the contact links of an account',
	},
	'messages.createMessageFeedback': {
		riskLevel: 'write',
		description: 'Submit feedback for a message',
	},
	'calls.updateCall': {
		riskLevel: 'write',
		description: 'Update a logged call',
	},
	'messages.updateMessage': {
		riskLevel: 'write',
		description: 'Update a message',
	},
	'messages.deleteMessage': {
		riskLevel: 'destructive',
		description: 'Delete a message',
	},
	'tasks.updateTask': {
		riskLevel: 'write',
		description: 'Update a task',
	},
	'tasks.deleteTask': {
		riskLevel: 'destructive',
		description: 'Delete a task',
	},
	'datasources.updateEmailDataSource': {
		riskLevel: 'write',
		description: 'Update a connected email data source',
	},
	'workflows.updateWorkflowAudience': {
		riskLevel: 'destructive',
		description: 'Update the audience record of a workflow',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof salesflareEndpointsNested
>;

export const salesflareAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSalesflarePlugin<T extends SalesflarePluginOptions> =
	CorsairPlugin<
		'salesflare',
		typeof SalesflareSchema,
		typeof salesflareEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalSalesflarePlugin =
	BaseSalesflarePlugin<SalesflarePluginOptions>;

export type ExternalSalesflarePlugin<T extends SalesflarePluginOptions> =
	BaseSalesflarePlugin<T>;

// Binds every Salesflare endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata. The runtime context and per-operation shapes are
// intentional opacity: each unknown below carries its own justification.
function withSalesflareSchemas<
	T extends Record<string, unknown>, // unknown: the tree mixes endpoint functions with family objects at any depth
>(tree: T, prefix = ''): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				salesflareEndpointSchemas[
					operation as keyof typeof salesflareEndpointSchemas
				];
			if (!schema) {
				throw new Error(`Missing Salesflare endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown, // unknown: the Corsair runtime context varies by deployment; passed through untouched
				input: unknown, // unknown: parsed by schema.input.parse before the call
			) => Promise<unknown>; // unknown: each operation returns its own documented shape, parsed by schema.output.parse
			const validated = async (
				ctx: unknown, // unknown: same runtime context as above; only the schema boundary wraps the call
				input: unknown, // unknown: caller-supplied payload, parsed before transport
			) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				// unknown: family group nodes are plain objects at arbitrary
				// depth; the wrapper recurses so every nested leaf gets a
				// contract from the registry.
				withSalesflareSchemas(
					value as Record<string, unknown>, // unknown: a family group object, recursed one level deeper
					operation,
				),
			];
		}
		return [key, value];
	});
	// unknown: the rebuilt tree keeps the caller's shape while each leaf is
	// replaced by its schema-validated wrapper; the endpoint schemas registry
	// and the satisfies-checked tree definition keep this honest.
	// unknown: the rebuild keeps the caller's tree shape while every leaf is
	// replaced by its schema-validated wrapper; TypeScript cannot express the
	// mixed function/object remap structurally, and the satisfies-checked
	// tree definition plus the endpoint schemas registry keep it honest.
	return Object.fromEntries(validatedEntries) as T; // unknown: same tree shape, leaves wrapped by their contracts
}

const validatedSalesflareEndpointsNested = withSalesflareSchemas(
	salesflareEndpointsNested,
);

export function salesflare<const T extends SalesflarePluginOptions>(
	incomingOptions: SalesflarePluginOptions & T = {} as SalesflarePluginOptions &
		T,
): ExternalSalesflarePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'salesflare',
		authConfig: salesflareAuthConfig,
		schema: SalesflareSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedSalesflareEndpointsNested,
		webhooks: {},
		endpointMeta: salesflareEndpointMeta,
		endpointSchemas: salesflareEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SalesflareKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('salesflare', 'api_key');
		},
	} satisfies InternalSalesflarePlugin;
}

export type {
	SalesflareEndpointInputs,
	SalesflareEndpointOutputs,
} from './endpoints/types';
