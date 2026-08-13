import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { z } from 'zod';
import { SALESFORCE_LOGIN_HOST } from './client';
import {
	Accounts,
	AnalyticsReports,
	Campaigns,
	Composite,
	Contacts,
	Files,
	Jobs,
	Leads,
	Metadata,
	Notes,
	Opportunities,
	SoqlSosl,
	Tasks,
	UiApi,
} from './endpoints';
import type {
	SalesforceEndpointInputs,
	SalesforceEndpointOutputs,
} from './endpoints/types';
import {
	SalesforceEndpointInputSchemas,
	SalesforceEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SalesforceSchema } from './schema';
import { resolveSalesforceOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchSalesforceTenantWebhook } from './webhooks/tenant-matcher';
import {
	accountCreatedOrUpdated,
	contactUpdated,
	genericSObjectRecordUpdated,
	newContact,
	newLead,
	newOrUpdatedOpportunity,
	taskCreatedOrCompleted,
} from './webhooks/triggers';
import type {
	SalesforceWebhookOutputs,
	SalesforceWebhookPayload,
} from './webhooks/types';
import { SalesforceWebhookPayloadSchema } from './webhooks/types';

export type SalesforcePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	instanceUrl?: string;
	loginUrl?: string;
	webhookSecret?: string;
	hooks?: InternalSalesforcePlugin['hooks'];
	webhookHooks?: InternalSalesforcePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof salesforceEndpointsNested>;
};

export type SalesforceContext = CorsairPluginContext<
	typeof SalesforceSchema,
	SalesforcePluginOptions
>;

export type SalesforceKeyBuilderContext =
	KeyBuilderContext<SalesforcePluginOptions>;

export type SalesforceBoundEndpoints = BindEndpoints<
	typeof salesforceEndpointsNested
>;

type SalesforceEndpoint<K extends keyof SalesforceEndpointOutputs> =
	CorsairEndpoint<
		SalesforceContext,
		SalesforceEndpointInputs[K],
		SalesforceEndpointOutputs[K]
	>;

export type SalesforceEndpoints = {
	// Accounts
	createAccount: SalesforceEndpoint<'createAccount'>;
	getAccount: SalesforceEndpoint<'getAccount'>;
	listAccounts: SalesforceEndpoint<'listAccounts'>;
	searchAccounts: SalesforceEndpoint<'searchAccounts'>;
	updateAccount: SalesforceEndpoint<'updateAccount'>;
	updateAccountObjectById: SalesforceEndpoint<'updateAccountObjectById'>;
	deleteAccount: SalesforceEndpoint<'deleteAccount'>;
	accountCreationWithContentTypeOption: SalesforceEndpoint<'accountCreationWithContentTypeOption'>;
	fetchAccountByIdWithQuery: SalesforceEndpoint<'fetchAccountByIdWithQuery'>;
	removeAccountByUniqueIdentifier: SalesforceEndpoint<'removeAccountByUniqueIdentifier'>;
	retrieveAccountDataAndErrorResponses: SalesforceEndpoint<'retrieveAccountDataAndErrorResponses'>;

	// Contacts
	createContact: SalesforceEndpoint<'createContact'>;
	getContact: SalesforceEndpoint<'getContact'>;
	listContacts: SalesforceEndpoint<'listContacts'>;
	deleteContact: SalesforceEndpoint<'deleteContact'>;
	associateContactToAccount: SalesforceEndpoint<'associateContactToAccount'>;
	updateContact: SalesforceEndpoint<'updateContact'>;
	updateContactById: SalesforceEndpoint<'updateContactById'>;
	searchContacts: SalesforceEndpoint<'searchContacts'>;
	createNewContactWithJsonHeader: SalesforceEndpoint<'createNewContactWithJsonHeader'>;
	queryContactsByName: SalesforceEndpoint<'queryContactsByName'>;
	removeASpecificContactById: SalesforceEndpoint<'removeASpecificContactById'>;
	retrieveContactInfoWithStandardResponses: SalesforceEndpoint<'retrieveContactInfoWithStandardResponses'>;
	getContactById: SalesforceEndpoint<'getContactById'>;

	// Leads
	createLead: SalesforceEndpoint<'createLead'>;
	getLead: SalesforceEndpoint<'getLead'>;
	listLeads: SalesforceEndpoint<'listLeads'>;
	deleteLead: SalesforceEndpoint<'deleteLead'>;
	applyLeadAssignmentRules: SalesforceEndpoint<'applyLeadAssignmentRules'>;
	updateLead: SalesforceEndpoint<'updateLead'>;
	updateLeadByIdWithJsonPayload: SalesforceEndpoint<'updateLeadByIdWithJsonPayload'>;
	searchLeads: SalesforceEndpoint<'searchLeads'>;
	createLeadWithSpecifiedContentType: SalesforceEndpoint<'createLeadWithSpecifiedContentType'>;
	deleteALeadObjectByItsId: SalesforceEndpoint<'deleteALeadObjectByItsId'>;
	retrieveLeadById: SalesforceEndpoint<'retrieveLeadById'>;
	retrieveLeadDataWithVariousResponses: SalesforceEndpoint<'retrieveLeadDataWithVariousResponses'>;

	// Opportunities
	createOpportunity: SalesforceEndpoint<'createOpportunity'>;
	getOpportunity: SalesforceEndpoint<'getOpportunity'>;
	listOpportunities: SalesforceEndpoint<'listOpportunities'>;
	deleteOpportunity: SalesforceEndpoint<'deleteOpportunity'>;
	addOpportunityLineItem: SalesforceEndpoint<'addOpportunityLineItem'>;
	updateOpportunity: SalesforceEndpoint<'updateOpportunity'>;
	updateOpportunityById: SalesforceEndpoint<'updateOpportunityById'>;
	searchOpportunities: SalesforceEndpoint<'searchOpportunities'>;
	cloneOpportunityWithProducts: SalesforceEndpoint<'cloneOpportunityWithProducts'>;
	listPricebookEntries: SalesforceEndpoint<'listPricebookEntries'>;
	listPricebooks: SalesforceEndpoint<'listPricebooks'>;
	createOpportunityRecord: SalesforceEndpoint<'createOpportunityRecord'>;
	removeOpportunityById: SalesforceEndpoint<'removeOpportunityById'>;
	retrieveOpportunitiesData: SalesforceEndpoint<'retrieveOpportunitiesData'>;
	retrieveOpportunityByIdWithOptionalFields: SalesforceEndpoint<'retrieveOpportunityByIdWithOptionalFields'>;

	// Campaigns
	createCampaign: SalesforceEndpoint<'createCampaign'>;
	getCampaign: SalesforceEndpoint<'getCampaign'>;
	listCampaigns: SalesforceEndpoint<'listCampaigns'>;
	deleteCampaign: SalesforceEndpoint<'deleteCampaign'>;
	addContactToCampaign: SalesforceEndpoint<'addContactToCampaign'>;
	updateCampaign: SalesforceEndpoint<'updateCampaign'>;
	updateCampaignByIdWithJson: SalesforceEndpoint<'updateCampaignByIdWithJson'>;
	addLeadToCampaign: SalesforceEndpoint<'addLeadToCampaign'>;
	removeFromCampaign: SalesforceEndpoint<'removeFromCampaign'>;
	searchCampaigns: SalesforceEndpoint<'searchCampaigns'>;
	createCampaignRecordViaPost: SalesforceEndpoint<'createCampaignRecordViaPost'>;
	removeCampaignObjectById: SalesforceEndpoint<'removeCampaignObjectById'>;
	retrieveCampaignDataWithErrorHandling: SalesforceEndpoint<'retrieveCampaignDataWithErrorHandling'>;
	retrieveSpecificCampaignObjectDetails: SalesforceEndpoint<'retrieveSpecificCampaignObjectDetails'>;

	// Notes
	createNote: SalesforceEndpoint<'createNote'>;
	updateNote: SalesforceEndpoint<'updateNote'>;
	updateSpecificNoteById: SalesforceEndpoint<'updateSpecificNoteById'>;
	searchNotes: SalesforceEndpoint<'searchNotes'>;
	getNote: SalesforceEndpoint<'getNote'>;
	listNotes: SalesforceEndpoint<'listNotes'>;
	deleteNote: SalesforceEndpoint<'deleteNote'>;
	createNoteRecordWithContentTypeHeader: SalesforceEndpoint<'createNoteRecordWithContentTypeHeader'>;
	removeNoteObjectById: SalesforceEndpoint<'removeNoteObjectById'>;
	getNoteByIdWithFields: SalesforceEndpoint<'getNoteByIdWithFields'>;
	retrieveNoteObjectInformation: SalesforceEndpoint<'retrieveNoteObjectInformation'>;

	// Tasks
	createTask: SalesforceEndpoint<'createTask'>;
	completeTask: SalesforceEndpoint<'completeTask'>;
	logCall: SalesforceEndpoint<'logCall'>;
	logEmailActivity: SalesforceEndpoint<'logEmailActivity'>;
	updateTask: SalesforceEndpoint<'updateTask'>;
	searchTasks: SalesforceEndpoint<'searchTasks'>;
	sendEmail: SalesforceEndpoint<'sendEmail'>;
	sendEmailFromTemplate: SalesforceEndpoint<'sendEmailFromTemplate'>;
	sendMassEmail: SalesforceEndpoint<'sendMassEmail'>;

	// Jobs
	closeOrAbortJob: SalesforceEndpoint<'closeOrAbortJob'>;
	deleteJobQuery: SalesforceEndpoint<'deleteJobQuery'>;
	getJobFailedRecordResults: SalesforceEndpoint<'getJobFailedRecordResults'>;
	getQueryJobInfo: SalesforceEndpoint<'getQueryJobInfo'>;
	getQueryJobResults: SalesforceEndpoint<'getQueryJobResults'>;
	getJobSuccessfulRecordResults: SalesforceEndpoint<'getJobSuccessfulRecordResults'>;
	getJobUnprocessedRecordResults: SalesforceEndpoint<'getJobUnprocessedRecordResults'>;
	uploadJobData: SalesforceEndpoint<'uploadJobData'>;

	// SOQL / SOSL
	runSoqlQuery: SalesforceEndpoint<'runSoqlQuery'>;
	queryAll: SalesforceEndpoint<'queryAll'>;
	search: SalesforceEndpoint<'search'>;
	executeSoslSearch: SalesforceEndpoint<'executeSoslSearch'>;
	toolingQuery: SalesforceEndpoint<'toolingQuery'>;
	parameterizedSearch: SalesforceEndpoint<'parameterizedSearch'>;
	postParameterizedSearch: SalesforceEndpoint<'postParameterizedSearch'>;
	getSearchLayout: SalesforceEndpoint<'getSearchLayout'>;
	query: SalesforceEndpoint<'query'>;
	executeSoqlQuery: SalesforceEndpoint<'executeSoqlQuery'>;
	getSearchSuggestions: SalesforceEndpoint<'getSearchSuggestions'>;
	searchKnowledgeArticles: SalesforceEndpoint<'searchKnowledgeArticles'>;
	getParameterizedSearch: SalesforceEndpoint<'getParameterizedSearch'>;

	// Composite
	postCompositeSobjects: SalesforceEndpoint<'postCompositeSobjects'>;
	createSobjectTree: SalesforceEndpoint<'createSobjectTree'>;
	deleteSobjectCollections: SalesforceEndpoint<'deleteSobjectCollections'>;
	postCompositeGraph: SalesforceEndpoint<'postCompositeGraph'>;
	compositeGraphAction: SalesforceEndpoint<'compositeGraphAction'>;
	getABatchOfRecords: SalesforceEndpoint<'getABatchOfRecords'>;
	getCompositeResources: SalesforceEndpoint<'getCompositeResources'>;
	getCompositeSobjects: SalesforceEndpoint<'getCompositeSobjects'>;
	getSobjectCollections: SalesforceEndpoint<'getSobjectCollections'>;
	patchCompositeSobjects: SalesforceEndpoint<'patchCompositeSobjects'>;

	// Metadata
	createSObjectRecord: SalesforceEndpoint<'createSObjectRecord'>;
	cloneRecord: SalesforceEndpoint<'cloneRecord'>;
	createCustomField: SalesforceEndpoint<'createCustomField'>;
	createCustomObject: SalesforceEndpoint<'createCustomObject'>;
	deleteSobject: SalesforceEndpoint<'deleteSobject'>;
	deleteSobjectRows: SalesforceEndpoint<'deleteSobjectRows'>;
	getSobjects: SalesforceEndpoint<'getSobjects'>;
	executeSobjectQuickAction: SalesforceEndpoint<'executeSobjectQuickAction'>;
	getApi: SalesforceEndpoint<'getApi'>;
	getChatterResources: SalesforceEndpoint<'getChatterResources'>;
	getSobjectPlatformaction: SalesforceEndpoint<'getSobjectPlatformaction'>;
	headQuickActions: SalesforceEndpoint<'headQuickActions'>;
	headSobjectsUserPassword: SalesforceEndpoint<'headSobjectsUserPassword'>;
	getPicklistValuesByRecordType: SalesforceEndpoint<'getPicklistValuesByRecordType'>;
	getAllFieldsForObject: SalesforceEndpoint<'getAllFieldsForObject'>;
	getAllCustomObjects: SalesforceEndpoint<'getAllCustomObjects'>;
	getSobjectsSobjectDescribeApprovallayouts: SalesforceEndpoint<'getSobjectsSobjectDescribeApprovallayouts'>;
	getSobjectApprovalLayouts: SalesforceEndpoint<'getSobjectApprovalLayouts'>;
	getChildRecords: SalesforceEndpoint<'getChildRecords'>;
	getConsentAction: SalesforceEndpoint<'getConsentAction'>;
	headActionsCustom: SalesforceEndpoint<'headActionsCustom'>;
	listCustomInvocableActions: SalesforceEndpoint<'listCustomInvocableActions'>;
	getSupportedObjectsDirectory: SalesforceEndpoint<'getSupportedObjectsDirectory'>;
	getGlobalActions: SalesforceEndpoint<'getGlobalActions'>;
	headSobjectsGlobalDescribeLayouts: SalesforceEndpoint<'headSobjectsGlobalDescribeLayouts'>;
	getSObjectsDescribeLayoutsRecordTypeId: SalesforceEndpoint<'getSObjectsDescribeLayoutsRecordTypeId'>;
	getOrgLimits: SalesforceEndpoint<'getOrgLimits'>;
	headProcessRulesSObject: SalesforceEndpoint<'headProcessRulesSObject'>;
	headSobjectQuickActionDefaultValues: SalesforceEndpoint<'headSobjectQuickActionDefaultValues'>;
	getQuickActions: SalesforceEndpoint<'getQuickActions'>;
	getRecordCounts: SalesforceEndpoint<'getRecordCounts'>;
	getSobjectRelationship: SalesforceEndpoint<'getSobjectRelationship'>;
	getSobjectQuickActionDefaultValues: SalesforceEndpoint<'getSobjectQuickActionDefaultValues'>;
	getSObjectQuickActionDefaultValues: SalesforceEndpoint<'getSObjectQuickActionDefaultValues'>;
	getSobjectByExternalId: SalesforceEndpoint<'getSobjectByExternalId'>;
	headSobjectsQuickAction: SalesforceEndpoint<'headSobjectsQuickAction'>;
	getSObjectRecord: SalesforceEndpoint<'getSObjectRecord'>;
	headActionsStandard: SalesforceEndpoint<'headActionsStandard'>;
	listStandardInvocableActions: SalesforceEndpoint<'listStandardInvocableActions'>;
	getSupport: SalesforceEndpoint<'getSupport'>;
	getSupportKnowledgeArticles: SalesforceEndpoint<'getSupportKnowledgeArticles'>;
	getTheme: SalesforceEndpoint<'getTheme'>;
	getSObjectsUpdated: SalesforceEndpoint<'getSObjectsUpdated'>;
	getUserInfo: SalesforceEndpoint<'getUserInfo'>;
	sobjectUserPassword: SalesforceEndpoint<'sobjectUserPassword'>;
	massTransferOwnership: SalesforceEndpoint<'massTransferOwnership'>;
	updateSobject: SalesforceEndpoint<'updateSobject'>;
	sobjectRowsUpdate: SalesforceEndpoint<'sobjectRowsUpdate'>;
	upsertSobjectByExternalId: SalesforceEndpoint<'upsertSobjectByExternalId'>;
	setUserPassword: SalesforceEndpoint<'setUserPassword'>;

	// UI API
	createARecord: SalesforceEndpoint<'createARecord'>;
	createRecordUiApi: SalesforceEndpoint<'createRecordUiApi'>;
	getUiapiListInfoAccountAllAccounts: SalesforceEndpoint<'getUiapiListInfoAccountAllAccounts'>;
	getUiapiListInfoAccountSearchResult: SalesforceEndpoint<'getUiapiListInfoAccountSearchResult'>;
	headAppmenuSalesforce1: SalesforceEndpoint<'headAppmenuSalesforce1'>;
	getCompactLayouts: SalesforceEndpoint<'getCompactLayouts'>;
	getListViewActions: SalesforceEndpoint<'getListViewActions'>;
	getUiapiListInfoAccountRecent: SalesforceEndpoint<'getUiapiListInfoAccountRecent'>;
	getUiApiListInfoRecent: SalesforceEndpoint<'getUiApiListInfoRecent'>;
	getUiapimruListInfoAccount: SalesforceEndpoint<'getUiapimruListInfoAccount'>;
	getUiApiMruListRecordsAccount: SalesforceEndpoint<'getUiApiMruListRecordsAccount'>;
	getUiapiActionsMruListAccount: SalesforceEndpoint<'getUiapiActionsMruListAccount'>;
	getMruListViewMetadata: SalesforceEndpoint<'getMruListViewMetadata'>;
	getUiApiAppsUserNavItems: SalesforceEndpoint<'getUiApiAppsUserNavItems'>;
	getAllNavigationItems: SalesforceEndpoint<'getAllNavigationItems'>;
	getApp: SalesforceEndpoint<'getApp'>;
	getApps: SalesforceEndpoint<'getApps'>;
	getListViewMetadataBatch: SalesforceEndpoint<'getListViewMetadataBatch'>;
	getRelatedListPreferencesBatch: SalesforceEndpoint<'getRelatedListPreferencesBatch'>;
	getLastSelectedApp: SalesforceEndpoint<'getLastSelectedApp'>;
	getListViewMetadataByName: SalesforceEndpoint<'getListViewMetadataByName'>;
	getListViewRecordsByName: SalesforceEndpoint<'getListViewRecordsByName'>;
	getListViewRecordsById: SalesforceEndpoint<'getListViewRecordsById'>;
	listViewResults: SalesforceEndpoint<'listViewResults'>;
	getListViewResults: SalesforceEndpoint<'getListViewResults'>;
	getObjectListViews: SalesforceEndpoint<'getObjectListViews'>;
	getSobjectListViews: SalesforceEndpoint<'getSobjectListViews'>;
	getUiApiActionsLookupAccount: SalesforceEndpoint<'getUiApiActionsLookupAccount'>;
	getUiapiLookupsOpportunityAccountId: SalesforceEndpoint<'getUiapiLookupsOpportunityAccountId'>;
	getLookupFieldSuggestions: SalesforceEndpoint<'getLookupFieldSuggestions'>;
	getLookupSuggestionsOpportunityAccount: SalesforceEndpoint<'getLookupSuggestionsOpportunityAccount'>;
	getLookupSuggestionsCaseContact: SalesforceEndpoint<'getLookupSuggestionsCaseContact'>;
	getMruListViewRecords: SalesforceEndpoint<'getMruListViewRecords'>;
	getPhotoActions: SalesforceEndpoint<'getPhotoActions'>;
	getRecordUiDataAndMetadata: SalesforceEndpoint<'getRecordUiDataAndMetadata'>;
	getRecordEditPageActions: SalesforceEndpoint<'getRecordEditPageActions'>;
	getUiApiActionsRecordRelatedList: SalesforceEndpoint<'getUiApiActionsRecordRelatedList'>;
	getRelatedListActions: SalesforceEndpoint<'getRelatedListActions'>;
	getRelatedListRecordsContacts: SalesforceEndpoint<'getRelatedListRecordsContacts'>;
	getUiapiRelatedListPreferences: SalesforceEndpoint<'getUiapiRelatedListPreferences'>;
	getSobjectListView: SalesforceEndpoint<'getSobjectListView'>;
	updateRecord: SalesforceEndpoint<'updateRecord'>;
	updateFavorite: SalesforceEndpoint<'updateFavorite'>;
	updateRelatedListPreferences: SalesforceEndpoint<'updateRelatedListPreferences'>;
	updateListViewPreferences: SalesforceEndpoint<'updateListViewPreferences'>;

	// Files
	getFileContent: SalesforceEndpoint<'getFileContent'>;
	getFileInformation: SalesforceEndpoint<'getFileInformation'>;
	getFileShares: SalesforceEndpoint<'getFileShares'>;
	deleteFile: SalesforceEndpoint<'deleteFile'>;
	uploadFile: SalesforceEndpoint<'uploadFile'>;

	// Analytics & Reports
	getDashboard: SalesforceEndpoint<'getDashboard'>;
	listDashboards: SalesforceEndpoint<'listDashboards'>;
	listEmailTemplates: SalesforceEndpoint<'listEmailTemplates'>;
	listReports: SalesforceEndpoint<'listReports'>;
	runReport: SalesforceEndpoint<'runReport'>;
	listAnalyticsTemplates: SalesforceEndpoint<'listAnalyticsTemplates'>;
	getReportInstance: SalesforceEndpoint<'getReportInstance'>;
	getReport: SalesforceEndpoint<'getReport'>;
	queryReport: SalesforceEndpoint<'queryReport'>;
};

type SalesforceWebhook<K extends keyof SalesforceWebhookOutputs> =
	CorsairWebhook<
		SalesforceContext,
		SalesforceWebhookPayload,
		SalesforceWebhookOutputs[K]
	>;

export type SalesforceWebhooks = {
	accountCreatedOrUpdated: SalesforceWebhook<'accountCreatedOrUpdated'>;
	contactUpdated: SalesforceWebhook<'contactUpdated'>;
	newContact: SalesforceWebhook<'newContact'>;
	newLead: SalesforceWebhook<'newLead'>;
	newOrUpdatedOpportunity: SalesforceWebhook<'newOrUpdatedOpportunity'>;
	genericSObjectRecordUpdated: SalesforceWebhook<'genericSObjectRecordUpdated'>;
	taskCreatedOrCompleted: SalesforceWebhook<'taskCreatedOrCompleted'>;
};

export type SalesforceBoundWebhooks = BindWebhooks<SalesforceWebhooks>;

const salesforceEndpointsNested = {
	accounts: {
		createAccount: Accounts.createAccount,
		getAccount: Accounts.getAccount,
		listAccounts: Accounts.listAccounts,
		searchAccounts: Accounts.searchAccounts,
		updateAccount: Accounts.updateAccount,
		updateAccountObjectById: Accounts.updateAccountObjectById,
		deleteAccount: Accounts.deleteAccount,
		accountCreationWithContentTypeOption:
			Accounts.accountCreationWithContentTypeOption,
		fetchAccountByIdWithQuery: Accounts.fetchAccountByIdWithQuery,
		removeAccountByUniqueIdentifier: Accounts.removeAccountByUniqueIdentifier,
		retrieveAccountDataAndErrorResponses:
			Accounts.retrieveAccountDataAndErrorResponses,
	},
	contacts: {
		createContact: Contacts.createContact,
		getContact: Contacts.getContact,
		listContacts: Contacts.listContacts,
		deleteContact: Contacts.deleteContact,
		associateContactToAccount: Contacts.associateContactToAccount,
		updateContact: Contacts.updateContact,
		updateContactById: Contacts.updateContactById,
		searchContacts: Contacts.searchContacts,
		createNewContactWithJsonHeader: Contacts.createNewContactWithJsonHeader,
		queryContactsByName: Contacts.queryContactsByName,
		removeASpecificContactById: Contacts.removeASpecificContactById,
		retrieveContactInfoWithStandardResponses:
			Contacts.retrieveContactInfoWithStandardResponses,
		getContactById: Contacts.getContactById,
	},
	leads: {
		createLead: Leads.createLead,
		getLead: Leads.getLead,
		listLeads: Leads.listLeads,
		deleteLead: Leads.deleteLead,
		applyLeadAssignmentRules: Leads.applyLeadAssignmentRules,
		updateLead: Leads.updateLead,
		updateLeadByIdWithJsonPayload: Leads.updateLeadByIdWithJsonPayload,
		searchLeads: Leads.searchLeads,
		createLeadWithSpecifiedContentType:
			Leads.createLeadWithSpecifiedContentType,
		deleteALeadObjectByItsId: Leads.deleteALeadObjectByItsId,
		retrieveLeadById: Leads.retrieveLeadById,
		retrieveLeadDataWithVariousResponses:
			Leads.retrieveLeadDataWithVariousResponses,
	},
	opportunities: {
		createOpportunity: Opportunities.createOpportunity,
		getOpportunity: Opportunities.getOpportunity,
		listOpportunities: Opportunities.listOpportunities,
		deleteOpportunity: Opportunities.deleteOpportunity,
		addOpportunityLineItem: Opportunities.addOpportunityLineItem,
		updateOpportunity: Opportunities.updateOpportunity,
		updateOpportunityById: Opportunities.updateOpportunityById,
		searchOpportunities: Opportunities.searchOpportunities,
		cloneOpportunityWithProducts: Opportunities.cloneOpportunityWithProducts,
		listPricebookEntries: Opportunities.listPricebookEntries,
		listPricebooks: Opportunities.listPricebooks,
		createOpportunityRecord: Opportunities.createOpportunityRecord,
		removeOpportunityById: Opportunities.removeOpportunityById,
		retrieveOpportunitiesData: Opportunities.retrieveOpportunitiesData,
		retrieveOpportunityByIdWithOptionalFields:
			Opportunities.retrieveOpportunityByIdWithOptionalFields,
	},
	campaigns: {
		createCampaign: Campaigns.createCampaign,
		getCampaign: Campaigns.getCampaign,
		listCampaigns: Campaigns.listCampaigns,
		deleteCampaign: Campaigns.deleteCampaign,
		addContactToCampaign: Campaigns.addContactToCampaign,
		updateCampaign: Campaigns.updateCampaign,
		updateCampaignByIdWithJson: Campaigns.updateCampaignByIdWithJson,
		addLeadToCampaign: Campaigns.addLeadToCampaign,
		removeFromCampaign: Campaigns.removeFromCampaign,
		searchCampaigns: Campaigns.searchCampaigns,
		createCampaignRecordViaPost: Campaigns.createCampaignRecordViaPost,
		removeCampaignObjectById: Campaigns.removeCampaignObjectById,
		retrieveCampaignDataWithErrorHandling:
			Campaigns.retrieveCampaignDataWithErrorHandling,
		retrieveSpecificCampaignObjectDetails:
			Campaigns.retrieveSpecificCampaignObjectDetails,
	},
	notes: {
		createNote: Notes.createNote,
		updateNote: Notes.updateNote,
		updateSpecificNoteById: Notes.updateSpecificNoteById,
		searchNotes: Notes.searchNotes,
		getNote: Notes.getNote,
		listNotes: Notes.listNotes,
		deleteNote: Notes.deleteNote,
		createNoteRecordWithContentTypeHeader:
			Notes.createNoteRecordWithContentTypeHeader,
		removeNoteObjectById: Notes.removeNoteObjectById,
		getNoteByIdWithFields: Notes.getNoteByIdWithFields,
		retrieveNoteObjectInformation: Notes.retrieveNoteObjectInformation,
	},
	tasks: {
		createTask: Tasks.createTask,
		completeTask: Tasks.completeTask,
		logCall: Tasks.logCall,
		logEmailActivity: Tasks.logEmailActivity,
		updateTask: Tasks.updateTask,
		searchTasks: Tasks.searchTasks,
		sendEmail: Tasks.sendEmail,
		sendEmailFromTemplate: Tasks.sendEmailFromTemplate,
		sendMassEmail: Tasks.sendMassEmail,
	},
	jobs: {
		closeOrAbortJob: Jobs.closeOrAbortJob,
		deleteJobQuery: Jobs.deleteJobQuery,
		getJobFailedRecordResults: Jobs.getJobFailedRecordResults,
		getQueryJobInfo: Jobs.getQueryJobInfo,
		getQueryJobResults: Jobs.getQueryJobResults,
		getJobSuccessfulRecordResults: Jobs.getJobSuccessfulRecordResults,
		getJobUnprocessedRecordResults: Jobs.getJobUnprocessedRecordResults,
		uploadJobData: Jobs.uploadJobData,
	},
	soqlSosl: {
		runSoqlQuery: SoqlSosl.runSoqlQuery,
		queryAll: SoqlSosl.queryAll,
		search: SoqlSosl.search,
		executeSoslSearch: SoqlSosl.executeSoslSearch,
		toolingQuery: SoqlSosl.toolingQuery,
		parameterizedSearch: SoqlSosl.parameterizedSearch,
		postParameterizedSearch: SoqlSosl.postParameterizedSearch,
		getSearchLayout: SoqlSosl.getSearchLayout,
		query: SoqlSosl.query,
		executeSoqlQuery: SoqlSosl.executeSoqlQuery,
		getSearchSuggestions: SoqlSosl.getSearchSuggestions,
		searchKnowledgeArticles: SoqlSosl.searchKnowledgeArticles,
		getParameterizedSearch: SoqlSosl.getParameterizedSearch,
	},
	composite: {
		postCompositeSobjects: Composite.postCompositeSobjects,
		createSobjectTree: Composite.createSobjectTree,
		deleteSobjectCollections: Composite.deleteSobjectCollections,
		postCompositeGraph: Composite.postCompositeGraph,
		compositeGraphAction: Composite.compositeGraphAction,
		getABatchOfRecords: Composite.getABatchOfRecords,
		getCompositeResources: Composite.getCompositeResources,
		getCompositeSobjects: Composite.getCompositeSobjects,
		getSobjectCollections: Composite.getSobjectCollections,
		patchCompositeSobjects: Composite.patchCompositeSobjects,
	},
	metadata: {
		createSObjectRecord: Metadata.createSObjectRecord,
		cloneRecord: Metadata.cloneRecord,
		createCustomField: Metadata.createCustomField,
		createCustomObject: Metadata.createCustomObject,
		deleteSobject: Metadata.deleteSobject,
		deleteSobjectRows: Metadata.deleteSobjectRows,
		getSobjects: Metadata.getSobjects,
		executeSobjectQuickAction: Metadata.executeSobjectQuickAction,
		getApi: Metadata.getApi,
		getChatterResources: Metadata.getChatterResources,
		getSobjectPlatformaction: Metadata.getSobjectPlatformaction,
		headQuickActions: Metadata.headQuickActions,
		headSobjectsUserPassword: Metadata.headSobjectsUserPassword,
		getPicklistValuesByRecordType: Metadata.getPicklistValuesByRecordType,
		getAllFieldsForObject: Metadata.getAllFieldsForObject,
		getAllCustomObjects: Metadata.getAllCustomObjects,
		getSobjectsSobjectDescribeApprovallayouts:
			Metadata.getSobjectsSobjectDescribeApprovallayouts,
		getSobjectApprovalLayouts: Metadata.getSobjectApprovalLayouts,
		getChildRecords: Metadata.getChildRecords,
		getConsentAction: Metadata.getConsentAction,
		headActionsCustom: Metadata.headActionsCustom,
		listCustomInvocableActions: Metadata.listCustomInvocableActions,
		getSupportedObjectsDirectory: Metadata.getSupportedObjectsDirectory,
		getGlobalActions: Metadata.getGlobalActions,
		headSobjectsGlobalDescribeLayouts:
			Metadata.headSobjectsGlobalDescribeLayouts,
		getSObjectsDescribeLayoutsRecordTypeId:
			Metadata.getSObjectsDescribeLayoutsRecordTypeId,
		getOrgLimits: Metadata.getOrgLimits,
		headProcessRulesSObject: Metadata.headProcessRulesSObject,
		headSobjectQuickActionDefaultValues:
			Metadata.headSobjectQuickActionDefaultValues,
		getQuickActions: Metadata.getQuickActions,
		getRecordCounts: Metadata.getRecordCounts,
		getSobjectRelationship: Metadata.getSobjectRelationship,
		getSobjectQuickActionDefaultValues:
			Metadata.getSobjectQuickActionDefaultValues,
		getSObjectQuickActionDefaultValues:
			Metadata.getSObjectQuickActionDefaultValues,
		getSobjectByExternalId: Metadata.getSobjectByExternalId,
		headSobjectsQuickAction: Metadata.headSobjectsQuickAction,
		getSObjectRecord: Metadata.getSObjectRecord,
		headActionsStandard: Metadata.headActionsStandard,
		listStandardInvocableActions: Metadata.listStandardInvocableActions,
		getSupport: Metadata.getSupport,
		getSupportKnowledgeArticles: Metadata.getSupportKnowledgeArticles,
		getTheme: Metadata.getTheme,
		getSObjectsUpdated: Metadata.getSObjectsUpdated,
		getUserInfo: Metadata.getUserInfo,
		sobjectUserPassword: Metadata.sobjectUserPassword,
		massTransferOwnership: Metadata.massTransferOwnership,
		updateSobject: Metadata.updateSobject,
		sobjectRowsUpdate: Metadata.sobjectRowsUpdate,
		upsertSobjectByExternalId: Metadata.upsertSobjectByExternalId,
		setUserPassword: Metadata.setUserPassword,
	},
	uiApi: {
		createARecord: UiApi.createARecord,
		createRecordUiApi: UiApi.createRecordUiApi,
		getUiapiListInfoAccountAllAccounts:
			UiApi.getUiapiListInfoAccountAllAccounts,
		getUiapiListInfoAccountSearchResult:
			UiApi.getUiapiListInfoAccountSearchResult,
		headAppmenuSalesforce1: UiApi.headAppmenuSalesforce1,
		getCompactLayouts: UiApi.getCompactLayouts,
		getListViewActions: UiApi.getListViewActions,
		getUiapiListInfoAccountRecent: UiApi.getUiapiListInfoAccountRecent,
		getUiApiListInfoRecent: UiApi.getUiApiListInfoRecent,
		getUiapimruListInfoAccount: UiApi.getUiapimruListInfoAccount,
		getUiApiMruListRecordsAccount: UiApi.getUiApiMruListRecordsAccount,
		getUiapiActionsMruListAccount: UiApi.getUiapiActionsMruListAccount,
		getMruListViewMetadata: UiApi.getMruListViewMetadata,
		getUiApiAppsUserNavItems: UiApi.getUiApiAppsUserNavItems,
		getAllNavigationItems: UiApi.getAllNavigationItems,
		getApp: UiApi.getApp,
		getApps: UiApi.getApps,
		getListViewMetadataBatch: UiApi.getListViewMetadataBatch,
		getRelatedListPreferencesBatch: UiApi.getRelatedListPreferencesBatch,
		getLastSelectedApp: UiApi.getLastSelectedApp,
		getListViewMetadataByName: UiApi.getListViewMetadataByName,
		getListViewRecordsByName: UiApi.getListViewRecordsByName,
		getListViewRecordsById: UiApi.getListViewRecordsById,
		listViewResults: UiApi.listViewResults,
		getListViewResults: UiApi.getListViewResults,
		getObjectListViews: UiApi.getObjectListViews,
		getSobjectListViews: UiApi.getSobjectListViews,
		getUiApiActionsLookupAccount: UiApi.getUiApiActionsLookupAccount,
		getUiapiLookupsOpportunityAccountId:
			UiApi.getUiapiLookupsOpportunityAccountId,
		getLookupFieldSuggestions: UiApi.getLookupFieldSuggestions,
		getLookupSuggestionsOpportunityAccount:
			UiApi.getLookupSuggestionsOpportunityAccount,
		getLookupSuggestionsCaseContact: UiApi.getLookupSuggestionsCaseContact,
		getMruListViewRecords: UiApi.getMruListViewRecords,
		getPhotoActions: UiApi.getPhotoActions,
		getRecordUiDataAndMetadata: UiApi.getRecordUiDataAndMetadata,
		getRecordEditPageActions: UiApi.getRecordEditPageActions,
		getUiApiActionsRecordRelatedList: UiApi.getUiApiActionsRecordRelatedList,
		getRelatedListActions: UiApi.getRelatedListActions,
		getRelatedListRecordsContacts: UiApi.getRelatedListRecordsContacts,
		getUiapiRelatedListPreferences: UiApi.getUiapiRelatedListPreferences,
		getSobjectListView: UiApi.getSobjectListView,
		updateRecord: UiApi.updateRecord,
		updateFavorite: UiApi.updateFavorite,
		updateRelatedListPreferences: UiApi.updateRelatedListPreferences,
		updateListViewPreferences: UiApi.updateListViewPreferences,
	},
	files: {
		getFileContent: Files.getFileContent,
		getFileInformation: Files.getFileInformation,
		getFileShares: Files.getFileShares,
		deleteFile: Files.deleteFile,
		uploadFile: Files.uploadFile,
	},
	analyticsReports: {
		getDashboard: AnalyticsReports.getDashboard,
		listDashboards: AnalyticsReports.listDashboards,
		listEmailTemplates: AnalyticsReports.listEmailTemplates,
		listReports: AnalyticsReports.listReports,
		runReport: AnalyticsReports.runReport,
		listAnalyticsTemplates: AnalyticsReports.listAnalyticsTemplates,
		getReportInstance: AnalyticsReports.getReportInstance,
		getReport: AnalyticsReports.getReport,
		queryReport: AnalyticsReports.queryReport,
	},
} as const;

const salesforceWebhooksNested = {
	accountCreatedOrUpdated,
	contactUpdated,
	newContact,
	newLead,
	newOrUpdatedOpportunity,
	genericSObjectRecordUpdated,
	taskCreatedOrCompleted,
} as const;

const salesforceWebhookSchemas = {
	accountCreatedOrUpdated: {
		description: 'Account created or updated',
		payload: SalesforceWebhookPayloadSchema,
		response: z.object({ success: z.boolean() }),
	},
	contactUpdated: {
		description: 'Contact updated',
		payload: SalesforceWebhookPayloadSchema,
		response: z.object({ success: z.boolean() }),
	},
	newContact: {
		description: 'New contact created',
		payload: SalesforceWebhookPayloadSchema,
		response: z.object({ success: z.boolean() }),
	},
	newLead: {
		description: 'New lead created',
		payload: SalesforceWebhookPayloadSchema,
		response: z.object({ success: z.boolean() }),
	},
	newOrUpdatedOpportunity: {
		description: 'Opportunity created or updated',
		payload: SalesforceWebhookPayloadSchema,
		response: z.object({ success: z.boolean() }),
	},
	genericSObjectRecordUpdated: {
		description: 'Generic sObject record updated',
		payload: SalesforceWebhookPayloadSchema,
		response: z.object({ success: z.boolean() }),
	},
	taskCreatedOrCompleted: {
		description: 'Task created or completed',
		payload: SalesforceWebhookPayloadSchema,
		response: z.object({ success: z.boolean() }),
	},
} as const;

export const salesforceEndpointSchemas = {
	'accounts.createAccount': {
		input: SalesforceEndpointInputSchemas.createAccount,
		output: SalesforceEndpointOutputSchemas.createAccount,
	},
	'accounts.getAccount': {
		input: SalesforceEndpointInputSchemas.getAccount,
		output: SalesforceEndpointOutputSchemas.getAccount,
	},
	'accounts.listAccounts': {
		input: SalesforceEndpointInputSchemas.listAccounts,
		output: SalesforceEndpointOutputSchemas.listAccounts,
	},
	'accounts.searchAccounts': {
		input: SalesforceEndpointInputSchemas.searchAccounts,
		output: SalesforceEndpointOutputSchemas.searchAccounts,
	},
	'accounts.updateAccount': {
		input: SalesforceEndpointInputSchemas.updateAccount,
		output: SalesforceEndpointOutputSchemas.updateAccount,
	},
	'accounts.updateAccountObjectById': {
		input: SalesforceEndpointInputSchemas.updateAccountObjectById,
		output: SalesforceEndpointOutputSchemas.updateAccountObjectById,
	},
	'accounts.deleteAccount': {
		input: SalesforceEndpointInputSchemas.deleteAccount,
		output: SalesforceEndpointOutputSchemas.deleteAccount,
	},
	'accounts.accountCreationWithContentTypeOption': {
		input: SalesforceEndpointInputSchemas.accountCreationWithContentTypeOption,
		output:
			SalesforceEndpointOutputSchemas.accountCreationWithContentTypeOption,
	},
	'accounts.fetchAccountByIdWithQuery': {
		input: SalesforceEndpointInputSchemas.fetchAccountByIdWithQuery,
		output: SalesforceEndpointOutputSchemas.fetchAccountByIdWithQuery,
	},
	'accounts.removeAccountByUniqueIdentifier': {
		input: SalesforceEndpointInputSchemas.removeAccountByUniqueIdentifier,
		output: SalesforceEndpointOutputSchemas.removeAccountByUniqueIdentifier,
	},
	'accounts.retrieveAccountDataAndErrorResponses': {
		input: SalesforceEndpointInputSchemas.retrieveAccountDataAndErrorResponses,
		output:
			SalesforceEndpointOutputSchemas.retrieveAccountDataAndErrorResponses,
	},

	'contacts.createContact': {
		input: SalesforceEndpointInputSchemas.createContact,
		output: SalesforceEndpointOutputSchemas.createContact,
	},
	'contacts.getContact': {
		input: SalesforceEndpointInputSchemas.getContact,
		output: SalesforceEndpointOutputSchemas.getContact,
	},
	'contacts.listContacts': {
		input: SalesforceEndpointInputSchemas.listContacts,
		output: SalesforceEndpointOutputSchemas.listContacts,
	},
	'contacts.deleteContact': {
		input: SalesforceEndpointInputSchemas.deleteContact,
		output: SalesforceEndpointOutputSchemas.deleteContact,
	},
	'contacts.associateContactToAccount': {
		input: SalesforceEndpointInputSchemas.associateContactToAccount,
		output: SalesforceEndpointOutputSchemas.associateContactToAccount,
	},
	'contacts.updateContact': {
		input: SalesforceEndpointInputSchemas.updateContact,
		output: SalesforceEndpointOutputSchemas.updateContact,
	},
	'contacts.updateContactById': {
		input: SalesforceEndpointInputSchemas.updateContactById,
		output: SalesforceEndpointOutputSchemas.updateContactById,
	},
	'contacts.searchContacts': {
		input: SalesforceEndpointInputSchemas.searchContacts,
		output: SalesforceEndpointOutputSchemas.searchContacts,
	},
	'contacts.createNewContactWithJsonHeader': {
		input: SalesforceEndpointInputSchemas.createNewContactWithJsonHeader,
		output: SalesforceEndpointOutputSchemas.createNewContactWithJsonHeader,
	},
	'contacts.queryContactsByName': {
		input: SalesforceEndpointInputSchemas.queryContactsByName,
		output: SalesforceEndpointOutputSchemas.queryContactsByName,
	},
	'contacts.removeASpecificContactById': {
		input: SalesforceEndpointInputSchemas.removeASpecificContactById,
		output: SalesforceEndpointOutputSchemas.removeASpecificContactById,
	},
	'contacts.retrieveContactInfoWithStandardResponses': {
		input:
			SalesforceEndpointInputSchemas.retrieveContactInfoWithStandardResponses,
		output:
			SalesforceEndpointOutputSchemas.retrieveContactInfoWithStandardResponses,
	},
	'contacts.getContactById': {
		input: SalesforceEndpointInputSchemas.getContactById,
		output: SalesforceEndpointOutputSchemas.getContactById,
	},

	'leads.createLead': {
		input: SalesforceEndpointInputSchemas.createLead,
		output: SalesforceEndpointOutputSchemas.createLead,
	},
	'leads.getLead': {
		input: SalesforceEndpointInputSchemas.getLead,
		output: SalesforceEndpointOutputSchemas.getLead,
	},
	'leads.listLeads': {
		input: SalesforceEndpointInputSchemas.listLeads,
		output: SalesforceEndpointOutputSchemas.listLeads,
	},
	'leads.deleteLead': {
		input: SalesforceEndpointInputSchemas.deleteLead,
		output: SalesforceEndpointOutputSchemas.deleteLead,
	},
	'leads.applyLeadAssignmentRules': {
		input: SalesforceEndpointInputSchemas.applyLeadAssignmentRules,
		output: SalesforceEndpointOutputSchemas.applyLeadAssignmentRules,
	},
	'leads.updateLead': {
		input: SalesforceEndpointInputSchemas.updateLead,
		output: SalesforceEndpointOutputSchemas.updateLead,
	},
	'leads.updateLeadByIdWithJsonPayload': {
		input: SalesforceEndpointInputSchemas.updateLeadByIdWithJsonPayload,
		output: SalesforceEndpointOutputSchemas.updateLeadByIdWithJsonPayload,
	},
	'leads.searchLeads': {
		input: SalesforceEndpointInputSchemas.searchLeads,
		output: SalesforceEndpointOutputSchemas.searchLeads,
	},
	'leads.createLeadWithSpecifiedContentType': {
		input: SalesforceEndpointInputSchemas.createLeadWithSpecifiedContentType,
		output: SalesforceEndpointOutputSchemas.createLeadWithSpecifiedContentType,
	},
	'leads.deleteALeadObjectByItsId': {
		input: SalesforceEndpointInputSchemas.deleteALeadObjectByItsId,
		output: SalesforceEndpointOutputSchemas.deleteALeadObjectByItsId,
	},
	'leads.retrieveLeadById': {
		input: SalesforceEndpointInputSchemas.retrieveLeadById,
		output: SalesforceEndpointOutputSchemas.retrieveLeadById,
	},
	'leads.retrieveLeadDataWithVariousResponses': {
		input: SalesforceEndpointInputSchemas.retrieveLeadDataWithVariousResponses,
		output:
			SalesforceEndpointOutputSchemas.retrieveLeadDataWithVariousResponses,
	},

	'opportunities.createOpportunity': {
		input: SalesforceEndpointInputSchemas.createOpportunity,
		output: SalesforceEndpointOutputSchemas.createOpportunity,
	},
	'opportunities.getOpportunity': {
		input: SalesforceEndpointInputSchemas.getOpportunity,
		output: SalesforceEndpointOutputSchemas.getOpportunity,
	},
	'opportunities.listOpportunities': {
		input: SalesforceEndpointInputSchemas.listOpportunities,
		output: SalesforceEndpointOutputSchemas.listOpportunities,
	},
	'opportunities.deleteOpportunity': {
		input: SalesforceEndpointInputSchemas.deleteOpportunity,
		output: SalesforceEndpointOutputSchemas.deleteOpportunity,
	},
	'opportunities.addOpportunityLineItem': {
		input: SalesforceEndpointInputSchemas.addOpportunityLineItem,
		output: SalesforceEndpointOutputSchemas.addOpportunityLineItem,
	},
	'opportunities.updateOpportunity': {
		input: SalesforceEndpointInputSchemas.updateOpportunity,
		output: SalesforceEndpointOutputSchemas.updateOpportunity,
	},
	'opportunities.updateOpportunityById': {
		input: SalesforceEndpointInputSchemas.updateOpportunityById,
		output: SalesforceEndpointOutputSchemas.updateOpportunityById,
	},
	'opportunities.searchOpportunities': {
		input: SalesforceEndpointInputSchemas.searchOpportunities,
		output: SalesforceEndpointOutputSchemas.searchOpportunities,
	},
	'opportunities.cloneOpportunityWithProducts': {
		input: SalesforceEndpointInputSchemas.cloneOpportunityWithProducts,
		output: SalesforceEndpointOutputSchemas.cloneOpportunityWithProducts,
	},
	'opportunities.listPricebookEntries': {
		input: SalesforceEndpointInputSchemas.listPricebookEntries,
		output: SalesforceEndpointOutputSchemas.listPricebookEntries,
	},
	'opportunities.listPricebooks': {
		input: SalesforceEndpointInputSchemas.listPricebooks,
		output: SalesforceEndpointOutputSchemas.listPricebooks,
	},
	'opportunities.createOpportunityRecord': {
		input: SalesforceEndpointInputSchemas.createOpportunityRecord,
		output: SalesforceEndpointOutputSchemas.createOpportunityRecord,
	},
	'opportunities.removeOpportunityById': {
		input: SalesforceEndpointInputSchemas.removeOpportunityById,
		output: SalesforceEndpointOutputSchemas.removeOpportunityById,
	},
	'opportunities.retrieveOpportunitiesData': {
		input: SalesforceEndpointInputSchemas.retrieveOpportunitiesData,
		output: SalesforceEndpointOutputSchemas.retrieveOpportunitiesData,
	},
	'opportunities.retrieveOpportunityByIdWithOptionalFields': {
		input:
			SalesforceEndpointInputSchemas.retrieveOpportunityByIdWithOptionalFields,
		output:
			SalesforceEndpointOutputSchemas.retrieveOpportunityByIdWithOptionalFields,
	},

	'campaigns.createCampaign': {
		input: SalesforceEndpointInputSchemas.createCampaign,
		output: SalesforceEndpointOutputSchemas.createCampaign,
	},
	'campaigns.getCampaign': {
		input: SalesforceEndpointInputSchemas.getCampaign,
		output: SalesforceEndpointOutputSchemas.getCampaign,
	},
	'campaigns.listCampaigns': {
		input: SalesforceEndpointInputSchemas.listCampaigns,
		output: SalesforceEndpointOutputSchemas.listCampaigns,
	},
	'campaigns.deleteCampaign': {
		input: SalesforceEndpointInputSchemas.deleteCampaign,
		output: SalesforceEndpointOutputSchemas.deleteCampaign,
	},
	'campaigns.addContactToCampaign': {
		input: SalesforceEndpointInputSchemas.addContactToCampaign,
		output: SalesforceEndpointOutputSchemas.addContactToCampaign,
	},
	'campaigns.updateCampaign': {
		input: SalesforceEndpointInputSchemas.updateCampaign,
		output: SalesforceEndpointOutputSchemas.updateCampaign,
	},
	'campaigns.updateCampaignByIdWithJson': {
		input: SalesforceEndpointInputSchemas.updateCampaignByIdWithJson,
		output: SalesforceEndpointOutputSchemas.updateCampaignByIdWithJson,
	},
	'campaigns.addLeadToCampaign': {
		input: SalesforceEndpointInputSchemas.addLeadToCampaign,
		output: SalesforceEndpointOutputSchemas.addLeadToCampaign,
	},
	'campaigns.removeFromCampaign': {
		input: SalesforceEndpointInputSchemas.removeFromCampaign,
		output: SalesforceEndpointOutputSchemas.removeFromCampaign,
	},
	'campaigns.searchCampaigns': {
		input: SalesforceEndpointInputSchemas.searchCampaigns,
		output: SalesforceEndpointOutputSchemas.searchCampaigns,
	},
	'campaigns.createCampaignRecordViaPost': {
		input: SalesforceEndpointInputSchemas.createCampaignRecordViaPost,
		output: SalesforceEndpointOutputSchemas.createCampaignRecordViaPost,
	},
	'campaigns.removeCampaignObjectById': {
		input: SalesforceEndpointInputSchemas.removeCampaignObjectById,
		output: SalesforceEndpointOutputSchemas.removeCampaignObjectById,
	},
	'campaigns.retrieveCampaignDataWithErrorHandling': {
		input: SalesforceEndpointInputSchemas.retrieveCampaignDataWithErrorHandling,
		output:
			SalesforceEndpointOutputSchemas.retrieveCampaignDataWithErrorHandling,
	},
	'campaigns.retrieveSpecificCampaignObjectDetails': {
		input: SalesforceEndpointInputSchemas.retrieveSpecificCampaignObjectDetails,
		output:
			SalesforceEndpointOutputSchemas.retrieveSpecificCampaignObjectDetails,
	},

	'notes.createNote': {
		input: SalesforceEndpointInputSchemas.createNote,
		output: SalesforceEndpointOutputSchemas.createNote,
	},
	'notes.updateNote': {
		input: SalesforceEndpointInputSchemas.updateNote,
		output: SalesforceEndpointOutputSchemas.updateNote,
	},
	'notes.updateSpecificNoteById': {
		input: SalesforceEndpointInputSchemas.updateSpecificNoteById,
		output: SalesforceEndpointOutputSchemas.updateSpecificNoteById,
	},
	'notes.searchNotes': {
		input: SalesforceEndpointInputSchemas.searchNotes,
		output: SalesforceEndpointOutputSchemas.searchNotes,
	},
	'notes.getNote': {
		input: SalesforceEndpointInputSchemas.getNote,
		output: SalesforceEndpointOutputSchemas.getNote,
	},
	'notes.listNotes': {
		input: SalesforceEndpointInputSchemas.listNotes,
		output: SalesforceEndpointOutputSchemas.listNotes,
	},
	'notes.deleteNote': {
		input: SalesforceEndpointInputSchemas.deleteNote,
		output: SalesforceEndpointOutputSchemas.deleteNote,
	},
	'notes.createNoteRecordWithContentTypeHeader': {
		input: SalesforceEndpointInputSchemas.createNoteRecordWithContentTypeHeader,
		output:
			SalesforceEndpointOutputSchemas.createNoteRecordWithContentTypeHeader,
	},
	'notes.removeNoteObjectById': {
		input: SalesforceEndpointInputSchemas.removeNoteObjectById,
		output: SalesforceEndpointOutputSchemas.removeNoteObjectById,
	},
	'notes.getNoteByIdWithFields': {
		input: SalesforceEndpointInputSchemas.getNoteByIdWithFields,
		output: SalesforceEndpointOutputSchemas.getNoteByIdWithFields,
	},
	'notes.retrieveNoteObjectInformation': {
		input: SalesforceEndpointInputSchemas.retrieveNoteObjectInformation,
		output: SalesforceEndpointOutputSchemas.retrieveNoteObjectInformation,
	},

	'tasks.createTask': {
		input: SalesforceEndpointInputSchemas.createTask,
		output: SalesforceEndpointOutputSchemas.createTask,
	},
	'tasks.completeTask': {
		input: SalesforceEndpointInputSchemas.completeTask,
		output: SalesforceEndpointOutputSchemas.completeTask,
	},
	'tasks.logCall': {
		input: SalesforceEndpointInputSchemas.logCall,
		output: SalesforceEndpointOutputSchemas.logCall,
	},
	'tasks.logEmailActivity': {
		input: SalesforceEndpointInputSchemas.logEmailActivity,
		output: SalesforceEndpointOutputSchemas.logEmailActivity,
	},
	'tasks.updateTask': {
		input: SalesforceEndpointInputSchemas.updateTask,
		output: SalesforceEndpointOutputSchemas.updateTask,
	},
	'tasks.searchTasks': {
		input: SalesforceEndpointInputSchemas.searchTasks,
		output: SalesforceEndpointOutputSchemas.searchTasks,
	},
	'tasks.sendEmail': {
		input: SalesforceEndpointInputSchemas.sendEmail,
		output: SalesforceEndpointOutputSchemas.sendEmail,
	},
	'tasks.sendEmailFromTemplate': {
		input: SalesforceEndpointInputSchemas.sendEmailFromTemplate,
		output: SalesforceEndpointOutputSchemas.sendEmailFromTemplate,
	},
	'tasks.sendMassEmail': {
		input: SalesforceEndpointInputSchemas.sendMassEmail,
		output: SalesforceEndpointOutputSchemas.sendMassEmail,
	},

	'jobs.closeOrAbortJob': {
		input: SalesforceEndpointInputSchemas.closeOrAbortJob,
		output: SalesforceEndpointOutputSchemas.closeOrAbortJob,
	},
	'jobs.deleteJobQuery': {
		input: SalesforceEndpointInputSchemas.deleteJobQuery,
		output: SalesforceEndpointOutputSchemas.deleteJobQuery,
	},
	'jobs.getJobFailedRecordResults': {
		input: SalesforceEndpointInputSchemas.getJobFailedRecordResults,
		output: SalesforceEndpointOutputSchemas.getJobFailedRecordResults,
	},
	'jobs.getQueryJobInfo': {
		input: SalesforceEndpointInputSchemas.getQueryJobInfo,
		output: SalesforceEndpointOutputSchemas.getQueryJobInfo,
	},
	'jobs.getQueryJobResults': {
		input: SalesforceEndpointInputSchemas.getQueryJobResults,
		output: SalesforceEndpointOutputSchemas.getQueryJobResults,
	},
	'jobs.getJobSuccessfulRecordResults': {
		input: SalesforceEndpointInputSchemas.getJobSuccessfulRecordResults,
		output: SalesforceEndpointOutputSchemas.getJobSuccessfulRecordResults,
	},
	'jobs.getJobUnprocessedRecordResults': {
		input: SalesforceEndpointInputSchemas.getJobUnprocessedRecordResults,
		output: SalesforceEndpointOutputSchemas.getJobUnprocessedRecordResults,
	},
	'jobs.uploadJobData': {
		input: SalesforceEndpointInputSchemas.uploadJobData,
		output: SalesforceEndpointOutputSchemas.uploadJobData,
	},

	'soqlSosl.runSoqlQuery': {
		input: SalesforceEndpointInputSchemas.runSoqlQuery,
		output: SalesforceEndpointOutputSchemas.runSoqlQuery,
	},
	'soqlSosl.queryAll': {
		input: SalesforceEndpointInputSchemas.queryAll,
		output: SalesforceEndpointOutputSchemas.queryAll,
	},
	'soqlSosl.search': {
		input: SalesforceEndpointInputSchemas.search,
		output: SalesforceEndpointOutputSchemas.search,
	},
	'soqlSosl.executeSoslSearch': {
		input: SalesforceEndpointInputSchemas.executeSoslSearch,
		output: SalesforceEndpointOutputSchemas.executeSoslSearch,
	},
	'soqlSosl.toolingQuery': {
		input: SalesforceEndpointInputSchemas.toolingQuery,
		output: SalesforceEndpointOutputSchemas.toolingQuery,
	},
	'soqlSosl.parameterizedSearch': {
		input: SalesforceEndpointInputSchemas.parameterizedSearch,
		output: SalesforceEndpointOutputSchemas.parameterizedSearch,
	},
	'soqlSosl.postParameterizedSearch': {
		input: SalesforceEndpointInputSchemas.postParameterizedSearch,
		output: SalesforceEndpointOutputSchemas.postParameterizedSearch,
	},
	'soqlSosl.getSearchLayout': {
		input: SalesforceEndpointInputSchemas.getSearchLayout,
		output: SalesforceEndpointOutputSchemas.getSearchLayout,
	},
	'soqlSosl.query': {
		input: SalesforceEndpointInputSchemas.query,
		output: SalesforceEndpointOutputSchemas.query,
	},
	'soqlSosl.executeSoqlQuery': {
		input: SalesforceEndpointInputSchemas.executeSoqlQuery,
		output: SalesforceEndpointOutputSchemas.executeSoqlQuery,
	},
	'soqlSosl.getSearchSuggestions': {
		input: SalesforceEndpointInputSchemas.getSearchSuggestions,
		output: SalesforceEndpointOutputSchemas.getSearchSuggestions,
	},
	'soqlSosl.searchKnowledgeArticles': {
		input: SalesforceEndpointInputSchemas.searchKnowledgeArticles,
		output: SalesforceEndpointOutputSchemas.searchKnowledgeArticles,
	},
	'soqlSosl.getParameterizedSearch': {
		input: SalesforceEndpointInputSchemas.getParameterizedSearch,
		output: SalesforceEndpointOutputSchemas.getParameterizedSearch,
	},

	'composite.postCompositeSobjects': {
		input: SalesforceEndpointInputSchemas.postCompositeSobjects,
		output: SalesforceEndpointOutputSchemas.postCompositeSobjects,
	},
	'composite.createSobjectTree': {
		input: SalesforceEndpointInputSchemas.createSobjectTree,
		output: SalesforceEndpointOutputSchemas.createSobjectTree,
	},
	'composite.deleteSobjectCollections': {
		input: SalesforceEndpointInputSchemas.deleteSobjectCollections,
		output: SalesforceEndpointOutputSchemas.deleteSobjectCollections,
	},
	'composite.postCompositeGraph': {
		input: SalesforceEndpointInputSchemas.postCompositeGraph,
		output: SalesforceEndpointOutputSchemas.postCompositeGraph,
	},
	'composite.compositeGraphAction': {
		input: SalesforceEndpointInputSchemas.compositeGraphAction,
		output: SalesforceEndpointOutputSchemas.compositeGraphAction,
	},
	'composite.getABatchOfRecords': {
		input: SalesforceEndpointInputSchemas.getABatchOfRecords,
		output: SalesforceEndpointOutputSchemas.getABatchOfRecords,
	},
	'composite.getCompositeResources': {
		input: SalesforceEndpointInputSchemas.getCompositeResources,
		output: SalesforceEndpointOutputSchemas.getCompositeResources,
	},
	'composite.getCompositeSobjects': {
		input: SalesforceEndpointInputSchemas.getCompositeSobjects,
		output: SalesforceEndpointOutputSchemas.getCompositeSobjects,
	},
	'composite.getSobjectCollections': {
		input: SalesforceEndpointInputSchemas.getSobjectCollections,
		output: SalesforceEndpointOutputSchemas.getSobjectCollections,
	},
	'composite.patchCompositeSobjects': {
		input: SalesforceEndpointInputSchemas.patchCompositeSobjects,
		output: SalesforceEndpointOutputSchemas.patchCompositeSobjects,
	},

	'metadata.createSObjectRecord': {
		input: SalesforceEndpointInputSchemas.createSObjectRecord,
		output: SalesforceEndpointOutputSchemas.createSObjectRecord,
	},
	'metadata.cloneRecord': {
		input: SalesforceEndpointInputSchemas.cloneRecord,
		output: SalesforceEndpointOutputSchemas.cloneRecord,
	},
	'metadata.createCustomField': {
		input: SalesforceEndpointInputSchemas.createCustomField,
		output: SalesforceEndpointOutputSchemas.createCustomField,
	},
	'metadata.createCustomObject': {
		input: SalesforceEndpointInputSchemas.createCustomObject,
		output: SalesforceEndpointOutputSchemas.createCustomObject,
	},
	'metadata.deleteSobject': {
		input: SalesforceEndpointInputSchemas.deleteSobject,
		output: SalesforceEndpointOutputSchemas.deleteSobject,
	},
	'metadata.deleteSobjectRows': {
		input: SalesforceEndpointInputSchemas.deleteSobjectRows,
		output: SalesforceEndpointOutputSchemas.deleteSobjectRows,
	},
	'metadata.getSobjects': {
		input: SalesforceEndpointInputSchemas.getSobjects,
		output: SalesforceEndpointOutputSchemas.getSobjects,
	},
	'metadata.executeSobjectQuickAction': {
		input: SalesforceEndpointInputSchemas.executeSobjectQuickAction,
		output: SalesforceEndpointOutputSchemas.executeSobjectQuickAction,
	},
	'metadata.getApi': {
		input: SalesforceEndpointInputSchemas.getApi,
		output: SalesforceEndpointOutputSchemas.getApi,
	},
	'metadata.getChatterResources': {
		input: SalesforceEndpointInputSchemas.getChatterResources,
		output: SalesforceEndpointOutputSchemas.getChatterResources,
	},
	'metadata.getSobjectPlatformaction': {
		input: SalesforceEndpointInputSchemas.getSobjectPlatformaction,
		output: SalesforceEndpointOutputSchemas.getSobjectPlatformaction,
	},
	'metadata.headQuickActions': {
		input: SalesforceEndpointInputSchemas.headQuickActions,
		output: SalesforceEndpointOutputSchemas.headQuickActions,
	},
	'metadata.headSobjectsUserPassword': {
		input: SalesforceEndpointInputSchemas.headSobjectsUserPassword,
		output: SalesforceEndpointOutputSchemas.headSobjectsUserPassword,
	},
	'metadata.getPicklistValuesByRecordType': {
		input: SalesforceEndpointInputSchemas.getPicklistValuesByRecordType,
		output: SalesforceEndpointOutputSchemas.getPicklistValuesByRecordType,
	},
	'metadata.getAllFieldsForObject': {
		input: SalesforceEndpointInputSchemas.getAllFieldsForObject,
		output: SalesforceEndpointOutputSchemas.getAllFieldsForObject,
	},
	'metadata.getAllCustomObjects': {
		input: SalesforceEndpointInputSchemas.getAllCustomObjects,
		output: SalesforceEndpointOutputSchemas.getAllCustomObjects,
	},
	'metadata.getSobjectsSobjectDescribeApprovallayouts': {
		input:
			SalesforceEndpointInputSchemas.getSobjectsSobjectDescribeApprovallayouts,
		output:
			SalesforceEndpointOutputSchemas.getSobjectsSobjectDescribeApprovallayouts,
	},
	'metadata.getSobjectApprovalLayouts': {
		input: SalesforceEndpointInputSchemas.getSobjectApprovalLayouts,
		output: SalesforceEndpointOutputSchemas.getSobjectApprovalLayouts,
	},
	'metadata.getChildRecords': {
		input: SalesforceEndpointInputSchemas.getChildRecords,
		output: SalesforceEndpointOutputSchemas.getChildRecords,
	},
	'metadata.getConsentAction': {
		input: SalesforceEndpointInputSchemas.getConsentAction,
		output: SalesforceEndpointOutputSchemas.getConsentAction,
	},
	'metadata.headActionsCustom': {
		input: SalesforceEndpointInputSchemas.headActionsCustom,
		output: SalesforceEndpointOutputSchemas.headActionsCustom,
	},
	'metadata.listCustomInvocableActions': {
		input: SalesforceEndpointInputSchemas.listCustomInvocableActions,
		output: SalesforceEndpointOutputSchemas.listCustomInvocableActions,
	},
	'metadata.getSupportedObjectsDirectory': {
		input: SalesforceEndpointInputSchemas.getSupportedObjectsDirectory,
		output: SalesforceEndpointOutputSchemas.getSupportedObjectsDirectory,
	},
	'metadata.getGlobalActions': {
		input: SalesforceEndpointInputSchemas.getGlobalActions,
		output: SalesforceEndpointOutputSchemas.getGlobalActions,
	},
	'metadata.headSobjectsGlobalDescribeLayouts': {
		input: SalesforceEndpointInputSchemas.headSobjectsGlobalDescribeLayouts,
		output: SalesforceEndpointOutputSchemas.headSobjectsGlobalDescribeLayouts,
	},
	'metadata.getSObjectsDescribeLayoutsRecordTypeId': {
		input:
			SalesforceEndpointInputSchemas.getSObjectsDescribeLayoutsRecordTypeId,
		output:
			SalesforceEndpointOutputSchemas.getSObjectsDescribeLayoutsRecordTypeId,
	},
	'metadata.getOrgLimits': {
		input: SalesforceEndpointInputSchemas.getOrgLimits,
		output: SalesforceEndpointOutputSchemas.getOrgLimits,
	},
	'metadata.headProcessRulesSObject': {
		input: SalesforceEndpointInputSchemas.headProcessRulesSObject,
		output: SalesforceEndpointOutputSchemas.headProcessRulesSObject,
	},
	'metadata.headSobjectQuickActionDefaultValues': {
		input: SalesforceEndpointInputSchemas.headSobjectQuickActionDefaultValues,
		output: SalesforceEndpointOutputSchemas.headSobjectQuickActionDefaultValues,
	},
	'metadata.getQuickActions': {
		input: SalesforceEndpointInputSchemas.getQuickActions,
		output: SalesforceEndpointOutputSchemas.getQuickActions,
	},
	'metadata.getRecordCounts': {
		input: SalesforceEndpointInputSchemas.getRecordCounts,
		output: SalesforceEndpointOutputSchemas.getRecordCounts,
	},
	'metadata.getSobjectRelationship': {
		input: SalesforceEndpointInputSchemas.getSobjectRelationship,
		output: SalesforceEndpointOutputSchemas.getSobjectRelationship,
	},
	'metadata.getSobjectQuickActionDefaultValues': {
		input: SalesforceEndpointInputSchemas.getSobjectQuickActionDefaultValues,
		output: SalesforceEndpointOutputSchemas.getSobjectQuickActionDefaultValues,
	},
	'metadata.getSObjectQuickActionDefaultValues': {
		input: SalesforceEndpointInputSchemas.getSObjectQuickActionDefaultValues,
		output: SalesforceEndpointOutputSchemas.getSObjectQuickActionDefaultValues,
	},
	'metadata.getSobjectByExternalId': {
		input: SalesforceEndpointInputSchemas.getSobjectByExternalId,
		output: SalesforceEndpointOutputSchemas.getSobjectByExternalId,
	},
	'metadata.headSobjectsQuickAction': {
		input: SalesforceEndpointInputSchemas.headSobjectsQuickAction,
		output: SalesforceEndpointOutputSchemas.headSobjectsQuickAction,
	},
	'metadata.getSObjectRecord': {
		input: SalesforceEndpointInputSchemas.getSObjectRecord,
		output: SalesforceEndpointOutputSchemas.getSObjectRecord,
	},
	'metadata.headActionsStandard': {
		input: SalesforceEndpointInputSchemas.headActionsStandard,
		output: SalesforceEndpointOutputSchemas.headActionsStandard,
	},
	'metadata.listStandardInvocableActions': {
		input: SalesforceEndpointInputSchemas.listStandardInvocableActions,
		output: SalesforceEndpointOutputSchemas.listStandardInvocableActions,
	},
	'metadata.getSupport': {
		input: SalesforceEndpointInputSchemas.getSupport,
		output: SalesforceEndpointOutputSchemas.getSupport,
	},
	'metadata.getSupportKnowledgeArticles': {
		input: SalesforceEndpointInputSchemas.getSupportKnowledgeArticles,
		output: SalesforceEndpointOutputSchemas.getSupportKnowledgeArticles,
	},
	'metadata.getTheme': {
		input: SalesforceEndpointInputSchemas.getTheme,
		output: SalesforceEndpointOutputSchemas.getTheme,
	},
	'metadata.getSObjectsUpdated': {
		input: SalesforceEndpointInputSchemas.getSObjectsUpdated,
		output: SalesforceEndpointOutputSchemas.getSObjectsUpdated,
	},
	'metadata.getUserInfo': {
		input: SalesforceEndpointInputSchemas.getUserInfo,
		output: SalesforceEndpointOutputSchemas.getUserInfo,
	},
	'metadata.sobjectUserPassword': {
		input: SalesforceEndpointInputSchemas.sobjectUserPassword,
		output: SalesforceEndpointOutputSchemas.sobjectUserPassword,
	},
	'metadata.massTransferOwnership': {
		input: SalesforceEndpointInputSchemas.massTransferOwnership,
		output: SalesforceEndpointOutputSchemas.massTransferOwnership,
	},
	'metadata.updateSobject': {
		input: SalesforceEndpointInputSchemas.updateSobject,
		output: SalesforceEndpointOutputSchemas.updateSobject,
	},
	'metadata.sobjectRowsUpdate': {
		input: SalesforceEndpointInputSchemas.sobjectRowsUpdate,
		output: SalesforceEndpointOutputSchemas.sobjectRowsUpdate,
	},
	'metadata.upsertSobjectByExternalId': {
		input: SalesforceEndpointInputSchemas.upsertSobjectByExternalId,
		output: SalesforceEndpointOutputSchemas.upsertSobjectByExternalId,
	},
	'metadata.setUserPassword': {
		input: SalesforceEndpointInputSchemas.setUserPassword,
		output: SalesforceEndpointOutputSchemas.setUserPassword,
	},

	'uiApi.createARecord': {
		input: SalesforceEndpointInputSchemas.createARecord,
		output: SalesforceEndpointOutputSchemas.createARecord,
	},
	'uiApi.createRecordUiApi': {
		input: SalesforceEndpointInputSchemas.createRecordUiApi,
		output: SalesforceEndpointOutputSchemas.createRecordUiApi,
	},
	'uiApi.getUiapiListInfoAccountAllAccounts': {
		input: SalesforceEndpointInputSchemas.getUiapiListInfoAccountAllAccounts,
		output: SalesforceEndpointOutputSchemas.getUiapiListInfoAccountAllAccounts,
	},
	'uiApi.getUiapiListInfoAccountSearchResult': {
		input: SalesforceEndpointInputSchemas.getUiapiListInfoAccountSearchResult,
		output: SalesforceEndpointOutputSchemas.getUiapiListInfoAccountSearchResult,
	},
	'uiApi.headAppmenuSalesforce1': {
		input: SalesforceEndpointInputSchemas.headAppmenuSalesforce1,
		output: SalesforceEndpointOutputSchemas.headAppmenuSalesforce1,
	},
	'uiApi.getCompactLayouts': {
		input: SalesforceEndpointInputSchemas.getCompactLayouts,
		output: SalesforceEndpointOutputSchemas.getCompactLayouts,
	},
	'uiApi.getListViewActions': {
		input: SalesforceEndpointInputSchemas.getListViewActions,
		output: SalesforceEndpointOutputSchemas.getListViewActions,
	},
	'uiApi.getUiapiListInfoAccountRecent': {
		input: SalesforceEndpointInputSchemas.getUiapiListInfoAccountRecent,
		output: SalesforceEndpointOutputSchemas.getUiapiListInfoAccountRecent,
	},
	'uiApi.getUiApiListInfoRecent': {
		input: SalesforceEndpointInputSchemas.getUiApiListInfoRecent,
		output: SalesforceEndpointOutputSchemas.getUiApiListInfoRecent,
	},
	'uiApi.getUiapimruListInfoAccount': {
		input: SalesforceEndpointInputSchemas.getUiapimruListInfoAccount,
		output: SalesforceEndpointOutputSchemas.getUiapimruListInfoAccount,
	},
	'uiApi.getUiApiMruListRecordsAccount': {
		input: SalesforceEndpointInputSchemas.getUiApiMruListRecordsAccount,
		output: SalesforceEndpointOutputSchemas.getUiApiMruListRecordsAccount,
	},
	'uiApi.getUiapiActionsMruListAccount': {
		input: SalesforceEndpointInputSchemas.getUiapiActionsMruListAccount,
		output: SalesforceEndpointOutputSchemas.getUiapiActionsMruListAccount,
	},
	'uiApi.getMruListViewMetadata': {
		input: SalesforceEndpointInputSchemas.getMruListViewMetadata,
		output: SalesforceEndpointOutputSchemas.getMruListViewMetadata,
	},
	'uiApi.getUiApiAppsUserNavItems': {
		input: SalesforceEndpointInputSchemas.getUiApiAppsUserNavItems,
		output: SalesforceEndpointOutputSchemas.getUiApiAppsUserNavItems,
	},
	'uiApi.getAllNavigationItems': {
		input: SalesforceEndpointInputSchemas.getAllNavigationItems,
		output: SalesforceEndpointOutputSchemas.getAllNavigationItems,
	},
	'uiApi.getApp': {
		input: SalesforceEndpointInputSchemas.getApp,
		output: SalesforceEndpointOutputSchemas.getApp,
	},
	'uiApi.getApps': {
		input: SalesforceEndpointInputSchemas.getApps,
		output: SalesforceEndpointOutputSchemas.getApps,
	},
	'uiApi.getListViewMetadataBatch': {
		input: SalesforceEndpointInputSchemas.getListViewMetadataBatch,
		output: SalesforceEndpointOutputSchemas.getListViewMetadataBatch,
	},
	'uiApi.getRelatedListPreferencesBatch': {
		input: SalesforceEndpointInputSchemas.getRelatedListPreferencesBatch,
		output: SalesforceEndpointOutputSchemas.getRelatedListPreferencesBatch,
	},
	'uiApi.getLastSelectedApp': {
		input: SalesforceEndpointInputSchemas.getLastSelectedApp,
		output: SalesforceEndpointOutputSchemas.getLastSelectedApp,
	},
	'uiApi.getListViewMetadataByName': {
		input: SalesforceEndpointInputSchemas.getListViewMetadataByName,
		output: SalesforceEndpointOutputSchemas.getListViewMetadataByName,
	},
	'uiApi.getListViewRecordsByName': {
		input: SalesforceEndpointInputSchemas.getListViewRecordsByName,
		output: SalesforceEndpointOutputSchemas.getListViewRecordsByName,
	},
	'uiApi.getListViewRecordsById': {
		input: SalesforceEndpointInputSchemas.getListViewRecordsById,
		output: SalesforceEndpointOutputSchemas.getListViewRecordsById,
	},
	'uiApi.listViewResults': {
		input: SalesforceEndpointInputSchemas.listViewResults,
		output: SalesforceEndpointOutputSchemas.listViewResults,
	},
	'uiApi.getListViewResults': {
		input: SalesforceEndpointInputSchemas.getListViewResults,
		output: SalesforceEndpointOutputSchemas.getListViewResults,
	},
	'uiApi.getObjectListViews': {
		input: SalesforceEndpointInputSchemas.getObjectListViews,
		output: SalesforceEndpointOutputSchemas.getObjectListViews,
	},
	'uiApi.getSobjectListViews': {
		input: SalesforceEndpointInputSchemas.getSobjectListViews,
		output: SalesforceEndpointOutputSchemas.getSobjectListViews,
	},
	'uiApi.getUiApiActionsLookupAccount': {
		input: SalesforceEndpointInputSchemas.getUiApiActionsLookupAccount,
		output: SalesforceEndpointOutputSchemas.getUiApiActionsLookupAccount,
	},
	'uiApi.getUiapiLookupsOpportunityAccountId': {
		input: SalesforceEndpointInputSchemas.getUiapiLookupsOpportunityAccountId,
		output: SalesforceEndpointOutputSchemas.getUiapiLookupsOpportunityAccountId,
	},
	'uiApi.getLookupFieldSuggestions': {
		input: SalesforceEndpointInputSchemas.getLookupFieldSuggestions,
		output: SalesforceEndpointOutputSchemas.getLookupFieldSuggestions,
	},
	'uiApi.getLookupSuggestionsOpportunityAccount': {
		input:
			SalesforceEndpointInputSchemas.getLookupSuggestionsOpportunityAccount,
		output:
			SalesforceEndpointOutputSchemas.getLookupSuggestionsOpportunityAccount,
	},
	'uiApi.getLookupSuggestionsCaseContact': {
		input: SalesforceEndpointInputSchemas.getLookupSuggestionsCaseContact,
		output: SalesforceEndpointOutputSchemas.getLookupSuggestionsCaseContact,
	},
	'uiApi.getMruListViewRecords': {
		input: SalesforceEndpointInputSchemas.getMruListViewRecords,
		output: SalesforceEndpointOutputSchemas.getMruListViewRecords,
	},
	'uiApi.getPhotoActions': {
		input: SalesforceEndpointInputSchemas.getPhotoActions,
		output: SalesforceEndpointOutputSchemas.getPhotoActions,
	},
	'uiApi.getRecordUiDataAndMetadata': {
		input: SalesforceEndpointInputSchemas.getRecordUiDataAndMetadata,
		output: SalesforceEndpointOutputSchemas.getRecordUiDataAndMetadata,
	},
	'uiApi.getRecordEditPageActions': {
		input: SalesforceEndpointInputSchemas.getRecordEditPageActions,
		output: SalesforceEndpointOutputSchemas.getRecordEditPageActions,
	},
	'uiApi.getUiApiActionsRecordRelatedList': {
		input: SalesforceEndpointInputSchemas.getUiApiActionsRecordRelatedList,
		output: SalesforceEndpointOutputSchemas.getUiApiActionsRecordRelatedList,
	},
	'uiApi.getRelatedListActions': {
		input: SalesforceEndpointInputSchemas.getRelatedListActions,
		output: SalesforceEndpointOutputSchemas.getRelatedListActions,
	},
	'uiApi.getRelatedListRecordsContacts': {
		input: SalesforceEndpointInputSchemas.getRelatedListRecordsContacts,
		output: SalesforceEndpointOutputSchemas.getRelatedListRecordsContacts,
	},
	'uiApi.getUiapiRelatedListPreferences': {
		input: SalesforceEndpointInputSchemas.getUiapiRelatedListPreferences,
		output: SalesforceEndpointOutputSchemas.getUiapiRelatedListPreferences,
	},
	'uiApi.getSobjectListView': {
		input: SalesforceEndpointInputSchemas.getSobjectListView,
		output: SalesforceEndpointOutputSchemas.getSobjectListView,
	},
	'uiApi.updateRecord': {
		input: SalesforceEndpointInputSchemas.updateRecord,
		output: SalesforceEndpointOutputSchemas.updateRecord,
	},
	'uiApi.updateFavorite': {
		input: SalesforceEndpointInputSchemas.updateFavorite,
		output: SalesforceEndpointOutputSchemas.updateFavorite,
	},
	'uiApi.updateRelatedListPreferences': {
		input: SalesforceEndpointInputSchemas.updateRelatedListPreferences,
		output: SalesforceEndpointOutputSchemas.updateRelatedListPreferences,
	},
	'uiApi.updateListViewPreferences': {
		input: SalesforceEndpointInputSchemas.updateListViewPreferences,
		output: SalesforceEndpointOutputSchemas.updateListViewPreferences,
	},

	'files.getFileContent': {
		input: SalesforceEndpointInputSchemas.getFileContent,
		output: SalesforceEndpointOutputSchemas.getFileContent,
	},
	'files.getFileInformation': {
		input: SalesforceEndpointInputSchemas.getFileInformation,
		output: SalesforceEndpointOutputSchemas.getFileInformation,
	},
	'files.getFileShares': {
		input: SalesforceEndpointInputSchemas.getFileShares,
		output: SalesforceEndpointOutputSchemas.getFileShares,
	},
	'files.deleteFile': {
		input: SalesforceEndpointInputSchemas.deleteFile,
		output: SalesforceEndpointOutputSchemas.deleteFile,
	},
	'files.uploadFile': {
		input: SalesforceEndpointInputSchemas.uploadFile,
		output: SalesforceEndpointOutputSchemas.uploadFile,
	},

	'analyticsReports.getDashboard': {
		input: SalesforceEndpointInputSchemas.getDashboard,
		output: SalesforceEndpointOutputSchemas.getDashboard,
	},
	'analyticsReports.listDashboards': {
		input: SalesforceEndpointInputSchemas.listDashboards,
		output: SalesforceEndpointOutputSchemas.listDashboards,
	},
	'analyticsReports.listEmailTemplates': {
		input: SalesforceEndpointInputSchemas.listEmailTemplates,
		output: SalesforceEndpointOutputSchemas.listEmailTemplates,
	},
	'analyticsReports.listReports': {
		input: SalesforceEndpointInputSchemas.listReports,
		output: SalesforceEndpointOutputSchemas.listReports,
	},
	'analyticsReports.runReport': {
		input: SalesforceEndpointInputSchemas.runReport,
		output: SalesforceEndpointOutputSchemas.runReport,
	},
	'analyticsReports.listAnalyticsTemplates': {
		input: SalesforceEndpointInputSchemas.listAnalyticsTemplates,
		output: SalesforceEndpointOutputSchemas.listAnalyticsTemplates,
	},
	'analyticsReports.getReportInstance': {
		input: SalesforceEndpointInputSchemas.getReportInstance,
		output: SalesforceEndpointOutputSchemas.getReportInstance,
	},
	'analyticsReports.getReport': {
		input: SalesforceEndpointInputSchemas.getReport,
		output: SalesforceEndpointOutputSchemas.getReport,
	},
	'analyticsReports.queryReport': {
		input: SalesforceEndpointInputSchemas.queryReport,
		output: SalesforceEndpointOutputSchemas.queryReport,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof salesforceEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const salesforceEndpointMeta = {
	'accounts.createAccount': {
		riskLevel: 'write',
		description: 'Create account in Salesforce',
	},
	'accounts.getAccount': {
		riskLevel: 'read',
		description: 'Get account by ID',
	},
	'accounts.listAccounts': {
		riskLevel: 'read',
		description: 'List accounts',
	},
	'accounts.searchAccounts': {
		riskLevel: 'read',
		description: 'Search accounts',
	},
	'accounts.updateAccount': {
		riskLevel: 'write',
		description: 'Update account',
	},
	'accounts.updateAccountObjectById': {
		riskLevel: 'write',
		description: 'Update account by id (deprecated)',
	},
	'accounts.deleteAccount': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete account',
	},
	'accounts.accountCreationWithContentTypeOption': {
		riskLevel: 'write',
		description: 'Create account (deprecated)',
	},
	'accounts.fetchAccountByIdWithQuery': {
		riskLevel: 'read',
		description: 'Fetch account by ID with query (deprecated)',
	},
	'accounts.removeAccountByUniqueIdentifier': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove account by unique identifier (deprecated)',
	},
	'accounts.retrieveAccountDataAndErrorResponses': {
		riskLevel: 'read',
		description: 'Retrieve account data and error responses (deprecated)',
	},

	'contacts.createContact': {
		riskLevel: 'write',
		description: 'Create contact',
	},
	'contacts.getContact': {
		riskLevel: 'read',
		description: 'Get contact by ID',
	},
	'contacts.listContacts': {
		riskLevel: 'read',
		description: 'List contacts',
	},
	'contacts.deleteContact': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete contact',
	},
	'contacts.associateContactToAccount': {
		riskLevel: 'write',
		description: 'Associate contact to account',
	},
	'contacts.updateContact': {
		riskLevel: 'write',
		description: 'Update contact',
	},
	'contacts.updateContactById': {
		riskLevel: 'write',
		description: 'Update contact by id (deprecated)',
	},
	'contacts.searchContacts': {
		riskLevel: 'read',
		description: 'Search contacts',
	},
	'contacts.createNewContactWithJsonHeader': {
		riskLevel: 'write',
		description: 'Create new contact with JSON header (deprecated)',
	},
	'contacts.queryContactsByName': {
		riskLevel: 'read',
		description: 'Query contacts by name (deprecated)',
	},
	'contacts.removeASpecificContactById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove contact by ID (deprecated)',
	},
	'contacts.retrieveContactInfoWithStandardResponses': {
		riskLevel: 'read',
		description: 'Retrieve contact info (deprecated)',
	},
	'contacts.getContactById': {
		riskLevel: 'read',
		description: 'Get contact by ID',
	},

	'leads.createLead': {
		riskLevel: 'write',
		description: 'Create lead',
	},
	'leads.getLead': {
		riskLevel: 'read',
		description: 'Get lead by ID',
	},
	'leads.listLeads': {
		riskLevel: 'read',
		description: 'List leads',
	},
	'leads.deleteLead': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete lead',
	},
	'leads.applyLeadAssignmentRules': {
		riskLevel: 'write',
		description: 'Apply lead assignment rules',
	},
	'leads.updateLead': {
		riskLevel: 'write',
		description: 'Update lead',
	},
	'leads.updateLeadByIdWithJsonPayload': {
		riskLevel: 'write',
		description: 'Update lead by id (deprecated)',
	},
	'leads.searchLeads': {
		riskLevel: 'read',
		description: 'Search leads',
	},
	'leads.createLeadWithSpecifiedContentType': {
		riskLevel: 'write',
		description: 'Create lead with content type (deprecated)',
	},
	'leads.deleteALeadObjectByItsId': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete lead object by ID (deprecated)',
	},
	'leads.retrieveLeadById': {
		riskLevel: 'read',
		description: 'Retrieve lead by ID',
	},
	'leads.retrieveLeadDataWithVariousResponses': {
		riskLevel: 'read',
		description: 'Retrieve lead data (deprecated)',
	},

	'opportunities.createOpportunity': {
		riskLevel: 'write',
		description: 'Create opportunity',
	},
	'opportunities.getOpportunity': {
		riskLevel: 'read',
		description: 'Get opportunity by ID',
	},
	'opportunities.listOpportunities': {
		riskLevel: 'read',
		description: 'List opportunities',
	},
	'opportunities.deleteOpportunity': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete opportunity',
	},
	'opportunities.addOpportunityLineItem': {
		riskLevel: 'write',
		description: 'Add line item to opportunity',
	},
	'opportunities.updateOpportunity': {
		riskLevel: 'write',
		description: 'Update opportunity',
	},
	'opportunities.updateOpportunityById': {
		riskLevel: 'write',
		description: 'Update opportunity by id (deprecated)',
	},
	'opportunities.searchOpportunities': {
		riskLevel: 'read',
		description: 'Search opportunities',
	},
	'opportunities.cloneOpportunityWithProducts': {
		riskLevel: 'write',
		description: 'Clone opportunity with products',
	},
	'opportunities.listPricebookEntries': {
		riskLevel: 'read',
		description: 'List pricebook entries',
	},
	'opportunities.listPricebooks': {
		riskLevel: 'read',
		description: 'List pricebooks',
	},
	'opportunities.createOpportunityRecord': {
		riskLevel: 'write',
		description: 'Create opportunity record (deprecated)',
	},
	'opportunities.removeOpportunityById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove opportunity by ID (deprecated)',
	},
	'opportunities.retrieveOpportunitiesData': {
		riskLevel: 'read',
		description: 'Retrieve opportunities data',
	},
	'opportunities.retrieveOpportunityByIdWithOptionalFields': {
		riskLevel: 'read',
		description: 'Retrieve opportunity by ID with fields (deprecated)',
	},

	'campaigns.createCampaign': {
		riskLevel: 'write',
		description: 'Create campaign',
	},
	'campaigns.getCampaign': {
		riskLevel: 'read',
		description: 'Get campaign by ID',
	},
	'campaigns.listCampaigns': {
		riskLevel: 'read',
		description: 'List campaigns',
	},
	'campaigns.deleteCampaign': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete campaign',
	},
	'campaigns.addContactToCampaign': {
		riskLevel: 'write',
		description: 'Add contact to campaign',
	},
	'campaigns.updateCampaign': {
		riskLevel: 'write',
		description: 'Update campaign',
	},
	'campaigns.updateCampaignByIdWithJson': {
		riskLevel: 'write',
		description: 'Update campaign by id (deprecated)',
	},
	'campaigns.addLeadToCampaign': {
		riskLevel: 'write',
		description: 'Add lead to campaign',
	},
	'campaigns.removeFromCampaign': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove member from campaign',
	},
	'campaigns.searchCampaigns': {
		riskLevel: 'read',
		description: 'Search campaigns',
	},
	'campaigns.createCampaignRecordViaPost': {
		riskLevel: 'write',
		description: 'Create campaign record via POST (deprecated)',
	},
	'campaigns.removeCampaignObjectById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove campaign object by ID (deprecated)',
	},
	'campaigns.retrieveCampaignDataWithErrorHandling': {
		riskLevel: 'read',
		description: 'Retrieve campaign data (deprecated)',
	},
	'campaigns.retrieveSpecificCampaignObjectDetails': {
		riskLevel: 'read',
		description: 'Retrieve specific campaign details (deprecated)',
	},

	'notes.createNote': {
		riskLevel: 'write',
		description: 'Create note',
	},
	'notes.updateNote': {
		riskLevel: 'write',
		description: 'Update note',
	},
	'notes.updateSpecificNoteById': {
		riskLevel: 'write',
		description: 'Update note by id (deprecated)',
	},
	'notes.searchNotes': {
		riskLevel: 'read',
		description: 'Search notes',
	},
	'notes.getNote': {
		riskLevel: 'read',
		description: 'Get note by ID',
	},
	'notes.listNotes': {
		riskLevel: 'read',
		description: 'List notes',
	},
	'notes.deleteNote': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete note',
	},
	'notes.createNoteRecordWithContentTypeHeader': {
		riskLevel: 'write',
		description: 'Create note record (deprecated)',
	},
	'notes.removeNoteObjectById': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove note object by ID (deprecated)',
	},
	'notes.getNoteByIdWithFields': {
		riskLevel: 'read',
		description: 'Get note by ID with fields (deprecated)',
	},
	'notes.retrieveNoteObjectInformation': {
		riskLevel: 'read',
		description: 'Retrieve note object info (deprecated)',
	},

	'tasks.createTask': {
		riskLevel: 'write',
		description: 'Create task',
	},
	'tasks.completeTask': {
		riskLevel: 'write',
		description: 'Complete task',
	},
	'tasks.logCall': {
		riskLevel: 'write',
		description: 'Log phone call activity',
	},
	'tasks.logEmailActivity': {
		riskLevel: 'write',
		description: 'Log email activity',
	},
	'tasks.updateTask': {
		riskLevel: 'write',
		description: 'Update task',
	},
	'tasks.searchTasks': {
		riskLevel: 'read',
		description: 'Search tasks',
	},
	'tasks.sendEmail': {
		riskLevel: 'write',
		description: 'Send email',
	},
	'tasks.sendEmailFromTemplate': {
		riskLevel: 'write',
		description: 'Send email from template',
	},
	'tasks.sendMassEmail': {
		riskLevel: 'write',
		description: 'Send mass email',
	},

	'jobs.closeOrAbortJob': {
		riskLevel: 'write',
		description: 'Close or abort bulk job',
	},
	'jobs.deleteJobQuery': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete query job',
	},
	'jobs.getJobFailedRecordResults': {
		riskLevel: 'read',
		description: 'Get job failed record results',
	},
	'jobs.getQueryJobInfo': {
		riskLevel: 'read',
		description: 'Get query job info',
	},
	'jobs.getQueryJobResults': {
		riskLevel: 'read',
		description: 'Get query job results',
	},
	'jobs.getJobSuccessfulRecordResults': {
		riskLevel: 'read',
		description: 'Get job successful record results',
	},
	'jobs.getJobUnprocessedRecordResults': {
		riskLevel: 'read',
		description: 'Get job unprocessed record results',
	},
	'jobs.uploadJobData': {
		riskLevel: 'write',
		description: 'Upload CSV data to a bulk ingest job',
	},

	'soqlSosl.runSoqlQuery': {
		riskLevel: 'read',
		description: 'Run SOQL query',
	},
	'soqlSosl.queryAll': {
		riskLevel: 'read',
		description: 'Run queryAll including deleted records',
	},
	'soqlSosl.search': {
		riskLevel: 'read',
		description: 'Run SOSL search',
	},
	'soqlSosl.executeSoslSearch': {
		riskLevel: 'read',
		description: 'Execute SOSL search',
	},
	'soqlSosl.toolingQuery': {
		riskLevel: 'read',
		description: 'Run Tooling API SOQL query',
	},
	'soqlSosl.parameterizedSearch': {
		riskLevel: 'read',
		description: 'Run parameterized search',
	},
	'soqlSosl.postParameterizedSearch': {
		riskLevel: 'read',
		description: 'Post parameterized search',
	},
	'soqlSosl.getSearchLayout': {
		riskLevel: 'read',
		description: 'Get search layout',
	},
	'soqlSosl.query': {
		riskLevel: 'read',
		description: 'Execute SOQL query (deprecated)',
	},
	'soqlSosl.executeSoqlQuery': {
		riskLevel: 'read',
		description: 'Execute SOQL query (deprecated)',
	},
	'soqlSosl.getSearchSuggestions': {
		riskLevel: 'read',
		description: 'Get search suggestions',
	},
	'soqlSosl.searchKnowledgeArticles': {
		riskLevel: 'read',
		description: 'Search knowledge articles',
	},
	'soqlSosl.getParameterizedSearch': {
		riskLevel: 'read',
		description: 'Parameterized search via GET',
	},

	'composite.postCompositeSobjects': {
		riskLevel: 'write',
		description: 'Create records using sObject Collections',
	},
	'composite.createSobjectTree': {
		riskLevel: 'write',
		description: 'Create sObject tree',
	},
	'composite.deleteSobjectCollections': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete sObject collections',
	},
	'composite.postCompositeGraph': {
		riskLevel: 'write',
		description: 'Execute composite graph',
	},
	'composite.compositeGraphAction': {
		riskLevel: 'write',
		description: 'Execute composite graph (deprecated)',
	},
	'composite.getABatchOfRecords': {
		riskLevel: 'read',
		description: 'Get batch of UI API records',
	},
	'composite.getCompositeResources': {
		riskLevel: 'read',
		description: 'Get composite resources',
	},
	'composite.getCompositeSobjects': {
		riskLevel: 'read',
		description: 'Get composite sObjects',
	},
	'composite.getSobjectCollections': {
		riskLevel: 'read',
		description: 'Get sObject collections',
	},
	'composite.patchCompositeSobjects': {
		riskLevel: 'write',
		description: 'Upsert records using external ID',
	},

	'metadata.createSObjectRecord': {
		riskLevel: 'write',
		description: 'Create sObject record',
	},
	'metadata.cloneRecord': {
		riskLevel: 'write',
		description: 'Clone record',
	},
	'metadata.createCustomField': {
		riskLevel: 'write',
		description: 'Create custom field via Tooling API',
	},
	'metadata.createCustomObject': {
		riskLevel: 'write',
		description: 'Create custom object via Metadata API',
	},
	'metadata.deleteSobject': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete sObject record',
	},
	'metadata.deleteSobjectRows': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete sObject rows',
	},
	'metadata.getSobjects': {
		riskLevel: 'read',
		description: 'Describe global sObjects',
	},
	'metadata.executeSobjectQuickAction': {
		riskLevel: 'write',
		description: 'Execute sObject quick action',
	},
	'metadata.getApi': {
		riskLevel: 'read',
		description: 'Get API resources by version',
	},
	'metadata.getChatterResources': {
		riskLevel: 'read',
		description: 'Get Chatter resources',
	},
	'metadata.getSobjectPlatformaction': {
		riskLevel: 'read',
		description: 'Get PlatformAction metadata',
	},
	'metadata.headQuickActions': {
		riskLevel: 'read',
		description: 'Head Quick Actions',
	},
	'metadata.headSobjectsUserPassword': {
		riskLevel: 'read',
		description: 'Head user password status',
	},
	'metadata.getPicklistValuesByRecordType': {
		riskLevel: 'read',
		description: 'Get picklist values by record type',
	},
	'metadata.getAllFieldsForObject': {
		riskLevel: 'read',
		description: 'Get all fields for object',
	},
	'metadata.getAllCustomObjects': {
		riskLevel: 'read',
		description: 'Get all custom objects',
	},
	'metadata.getSobjectsSobjectDescribeApprovallayouts': {
		riskLevel: 'read',
		description: 'Get approval layouts for object',
	},
	'metadata.getSobjectApprovalLayouts': {
		riskLevel: 'read',
		description: 'Get approval layouts for sObject',
	},
	'metadata.getChildRecords': {
		riskLevel: 'read',
		description: 'Get child records',
	},
	'metadata.getConsentAction': {
		riskLevel: 'read',
		description: 'Get consent action preferences',
	},
	'metadata.headActionsCustom': {
		riskLevel: 'read',
		description: 'Head custom actions',
	},
	'metadata.listCustomInvocableActions': {
		riskLevel: 'read',
		description: 'List custom invocable actions',
	},
	'metadata.getSupportedObjectsDirectory': {
		riskLevel: 'read',
		description: 'Get supported objects directory',
	},
	'metadata.getGlobalActions': {
		riskLevel: 'read',
		description: 'Get global actions',
	},
	'metadata.headSobjectsGlobalDescribeLayouts': {
		riskLevel: 'read',
		description: 'Head global describe layouts',
	},
	'metadata.getSObjectsDescribeLayoutsRecordTypeId': {
		riskLevel: 'read',
		description: 'Get layouts for object with record type',
	},
	'metadata.getOrgLimits': {
		riskLevel: 'read',
		description: 'Get org limits',
	},
	'metadata.headProcessRulesSObject': {
		riskLevel: 'read',
		description: 'Head process rules for sObject',
	},
	'metadata.headSobjectQuickActionDefaultValues': {
		riskLevel: 'read',
		description: 'Head quick action default values',
	},
	'metadata.getQuickActions': {
		riskLevel: 'read',
		description: 'Get quick actions',
	},
	'metadata.getRecordCounts': {
		riskLevel: 'read',
		description: 'Get record counts',
	},
	'metadata.getSobjectRelationship': {
		riskLevel: 'read',
		description: 'Get sObject relationship',
	},
	'metadata.getSobjectQuickActionDefaultValues': {
		riskLevel: 'read',
		description: 'Get quick action default values',
	},
	'metadata.getSObjectQuickActionDefaultValues': {
		riskLevel: 'read',
		description: 'Get quick action default values by ID',
	},
	'metadata.getSobjectByExternalId': {
		riskLevel: 'read',
		description: 'Get sObject by external ID',
	},
	'metadata.headSobjectsQuickAction': {
		riskLevel: 'read',
		description: 'Head sObject quick action',
	},
	'metadata.getSObjectRecord': {
		riskLevel: 'read',
		description: 'Get sObject record by ID',
	},
	'metadata.headActionsStandard': {
		riskLevel: 'read',
		description: 'Head standard actions',
	},
	'metadata.listStandardInvocableActions': {
		riskLevel: 'read',
		description: 'List standard invocable actions',
	},
	'metadata.getSupport': {
		riskLevel: 'read',
		description: 'Get support knowledge root',
	},
	'metadata.getSupportKnowledgeArticles': {
		riskLevel: 'read',
		description: 'Get support knowledge articles',
	},
	'metadata.getTheme': {
		riskLevel: 'read',
		description: 'Get theme metadata',
	},
	'metadata.getSObjectsUpdated': {
		riskLevel: 'read',
		description: 'Get updated sObject records',
	},
	'metadata.getUserInfo': {
		riskLevel: 'read',
		description: 'Get user info',
	},
	'metadata.sobjectUserPassword': {
		riskLevel: 'read',
		description: 'Check user password expiration status',
	},
	'metadata.massTransferOwnership': {
		riskLevel: 'write',
		description: 'Mass transfer record ownership',
	},
	'metadata.updateSobject': {
		riskLevel: 'write',
		description: 'Update sObject fields',
	},
	'metadata.sobjectRowsUpdate': {
		riskLevel: 'write',
		description: 'Update sObject rows',
	},
	'metadata.upsertSobjectByExternalId': {
		riskLevel: 'write',
		description: 'Upsert sObject by external ID',
	},
	'metadata.setUserPassword': {
		riskLevel: 'write',
		description: 'Set user password',
	},

	'uiApi.createARecord': {
		riskLevel: 'write',
		description: 'Create record via UI API',
	},
	'uiApi.createRecordUiApi': {
		riskLevel: 'write',
		description: 'Create record using UI API',
	},
	'uiApi.getUiapiListInfoAccountAllAccounts': {
		riskLevel: 'read',
		description: 'Get Account AllAccounts list view metadata',
	},
	'uiApi.getUiapiListInfoAccountSearchResult': {
		riskLevel: 'read',
		description: 'Get Account SearchResult list view metadata',
	},
	'uiApi.headAppmenuSalesforce1': {
		riskLevel: 'read',
		description: 'Head AppMenu Salesforce1',
	},
	'uiApi.getCompactLayouts': {
		riskLevel: 'read',
		description: 'Get compact layouts',
	},
	'uiApi.getListViewActions': {
		riskLevel: 'read',
		description: 'Get list view actions',
	},
	'uiApi.getUiapiListInfoAccountRecent': {
		riskLevel: 'read',
		description: 'Get Account Recent list view metadata',
	},
	'uiApi.getUiApiListInfoRecent': {
		riskLevel: 'read',
		description: 'Get Recent list view metadata for object',
	},
	'uiApi.getUiapimruListInfoAccount': {
		riskLevel: 'read',
		description: 'Get MRU list info for Account (deprecated)',
	},
	'uiApi.getUiApiMruListRecordsAccount': {
		riskLevel: 'read',
		description: 'Get MRU list records for Account (deprecated)',
	},
	'uiApi.getUiapiActionsMruListAccount': {
		riskLevel: 'read',
		description: 'Get MRU list view actions',
	},
	'uiApi.getMruListViewMetadata': {
		riskLevel: 'read',
		description: 'Get MRU list view metadata',
	},
	'uiApi.getUiApiAppsUserNavItems': {
		riskLevel: 'read',
		description: 'Get user navigation items',
	},
	'uiApi.getAllNavigationItems': {
		riskLevel: 'read',
		description: 'Get all navigation items',
	},
	'uiApi.getApp': {
		riskLevel: 'read',
		description: 'Get app metadata',
	},
	'uiApi.getApps': {
		riskLevel: 'read',
		description: 'Get apps metadata',
	},
	'uiApi.getListViewMetadataBatch': {
		riskLevel: 'read',
		description: 'Get batch list view metadata',
	},
	'uiApi.getRelatedListPreferencesBatch': {
		riskLevel: 'read',
		description: 'Get batch related list user preferences',
	},
	'uiApi.getLastSelectedApp': {
		riskLevel: 'read',
		description: 'Get last selected app',
	},
	'uiApi.getListViewMetadataByName': {
		riskLevel: 'read',
		description: 'Get list view metadata by API name',
	},
	'uiApi.getListViewRecordsByName': {
		riskLevel: 'read',
		description: 'Get list view records by API name',
	},
	'uiApi.getListViewRecordsById': {
		riskLevel: 'read',
		description: 'Get list view records by ID',
	},
	'uiApi.listViewResults': {
		riskLevel: 'read',
		description: 'Get list view results',
	},
	'uiApi.getListViewResults': {
		riskLevel: 'read',
		description: 'Get list view results by sObject',
	},
	'uiApi.getObjectListViews': {
		riskLevel: 'read',
		description: 'Get list views for an object',
	},
	'uiApi.getSobjectListViews': {
		riskLevel: 'read',
		description: 'Get list views for sObject',
	},
	'uiApi.getUiApiActionsLookupAccount': {
		riskLevel: 'read',
		description: 'Get lookup field actions for Account',
	},
	'uiApi.getUiapiLookupsOpportunityAccountId': {
		riskLevel: 'read',
		description: 'Get lookup field suggestions for Opportunity AccountId',
	},
	'uiApi.getLookupFieldSuggestions': {
		riskLevel: 'read',
		description: 'Get lookup field suggestions',
	},
	'uiApi.getLookupSuggestionsOpportunityAccount': {
		riskLevel: 'read',
		description:
			'Get lookup field suggestions for Opportunity AccountId with POST',
	},
	'uiApi.getLookupSuggestionsCaseContact': {
		riskLevel: 'read',
		description: 'Get lookup field suggestions for Case ContactId with POST',
	},
	'uiApi.getMruListViewRecords': {
		riskLevel: 'read',
		description: 'Get MRU list view records',
	},
	'uiApi.getPhotoActions': {
		riskLevel: 'read',
		description: 'Get photo actions',
	},
	'uiApi.getRecordUiDataAndMetadata': {
		riskLevel: 'read',
		description: 'Get record UI data and metadata',
	},
	'uiApi.getRecordEditPageActions': {
		riskLevel: 'read',
		description: 'Get record edit page actions',
	},
	'uiApi.getUiApiActionsRecordRelatedList': {
		riskLevel: 'read',
		description: 'Get record related list actions',
	},
	'uiApi.getRelatedListActions': {
		riskLevel: 'read',
		description: 'Get related list actions',
	},
	'uiApi.getRelatedListRecordsContacts': {
		riskLevel: 'read',
		description: 'Get related list records for Contacts',
	},
	'uiApi.getUiapiRelatedListPreferences': {
		riskLevel: 'read',
		description: 'Get related list user preferences',
	},
	'uiApi.getSobjectListView': {
		riskLevel: 'read',
		description: 'Get sObject list view information',
	},
	'uiApi.updateRecord': {
		riskLevel: 'write',
		description: 'Update a record via UI API',
	},
	'uiApi.updateFavorite': {
		riskLevel: 'write',
		description: 'Update a favorite',
	},
	'uiApi.updateRelatedListPreferences': {
		riskLevel: 'write',
		description: 'Update related list preferences',
	},
	'uiApi.updateListViewPreferences': {
		riskLevel: 'write',
		description: 'Update list view preferences',
	},

	'files.getFileContent': {
		riskLevel: 'read',
		description: 'Get binary file content',
	},
	'files.getFileInformation': {
		riskLevel: 'read',
		description: 'Get file metadata information',
	},
	'files.getFileShares': {
		riskLevel: 'read',
		description: 'Get file shares information',
	},
	'files.deleteFile': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete file permanently',
	},
	'files.uploadFile': {
		riskLevel: 'write',
		description: 'Upload a file to Salesforce Files',
	},

	'analyticsReports.getDashboard': {
		riskLevel: 'read',
		description: 'Get dashboard metadata',
	},
	'analyticsReports.listDashboards': {
		riskLevel: 'read',
		description: 'List all dashboards',
	},
	'analyticsReports.listEmailTemplates': {
		riskLevel: 'read',
		description: 'List email templates',
	},
	'analyticsReports.listReports': {
		riskLevel: 'read',
		description: 'List all reports',
	},
	'analyticsReports.runReport': {
		riskLevel: 'read',
		description: 'Run report and return results',
	},
	'analyticsReports.listAnalyticsTemplates': {
		riskLevel: 'read',
		description: 'List CRM Analytics templates',
	},
	'analyticsReports.getReportInstance': {
		riskLevel: 'read',
		description: 'Get report instance results (deprecated)',
	},
	'analyticsReports.getReport': {
		riskLevel: 'read',
		description: 'Get report metadata (deprecated)',
	},
	'analyticsReports.queryReport': {
		riskLevel: 'read',
		description: 'Query report (deprecated)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof salesforceEndpointsNested
>;

export const salesforceAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id', 'instance_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSalesforcePlugin<T extends SalesforcePluginOptions> =
	CorsairPlugin<
		'salesforce',
		typeof SalesforceSchema,
		typeof salesforceEndpointsNested,
		typeof salesforceWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalSalesforcePlugin =
	BaseSalesforcePlugin<SalesforcePluginOptions>;
export type ExternalSalesforcePlugin<T extends SalesforcePluginOptions> =
	BaseSalesforcePlugin<T>;

export function salesforce<const T extends SalesforcePluginOptions>(
	incomingOptions: SalesforcePluginOptions & T = {} as SalesforcePluginOptions &
		T,
): ExternalSalesforcePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	let loginHost = options.loginUrl ?? SALESFORCE_LOGIN_HOST;
	while (loginHost.endsWith('/')) {
		loginHost = loginHost.slice(0, -1);
	}
	return {
		id: 'salesforce',
		authConfig: salesforceAuthConfig,
		schema: SalesforceSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: salesforceEndpointsNested,
		webhooks: salesforceWebhooksNested,
		endpointMeta: salesforceEndpointMeta,
		endpointSchemas: salesforceEndpointSchemas,
		oauthConfig: {
			providerName: 'Salesforce',
			authUrl: `${loginHost}/services/oauth2/authorize`,
			tokenUrl: `${loginHost}/services/oauth2/token`,
			scopes: ['api', 'refresh_token', 'id'],
		},
		webhookSchemas: salesforceWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasSig =
				'x-salesforce-signature' in headers || 'x-sfdc-signature' in headers;
			const body = request.body as Record<string, unknown> | undefined;
			const header = body?.ChangeEventHeader;
			const hasCdc =
				!!body &&
				((header !== null &&
					typeof header === 'object' &&
					!Array.isArray(header)) ||
					typeof body.sobject === 'string');
			return hasSig || hasCdc;
		},
		pluginTenantWebhookMatcher: matchSalesforceTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveSalesforceOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SalesforceKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) throw new AuthMissingError('salesforce', 'api_key');
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) throw new AuthMissingError('salesforce', 'oauth_2');
				return res;
			}

			throw new AuthMissingError('salesforce', ctx.authType ?? 'oauth_2');
		},
	} satisfies InternalSalesforcePlugin;
}

export type {
	SalesforceEndpointInputs,
	SalesforceEndpointOutputs,
} from './endpoints/types';
