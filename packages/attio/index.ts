import type {
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	ATTIO_OAUTH_AUTH_URL,
	ATTIO_OAUTH_TOKEN_URL,
	getValidAccessToken,
} from './client';
import * as Generated from './endpoints/generated';
import {
	GeneratedEndpointInputSchemas,
	GeneratedEndpointMeta,
	GeneratedEndpointOutputSchemas,
} from './endpoints/generated';
import { errorHandlers } from './error-handlers';
import { AttioSchema } from './schema';
import { RecordWebhooks } from './webhooks';
import { resolveAttioOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAttioTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AttioWebhookOutputs,
	RecordCreatedEvent,
	RecordDeletedEvent,
	RecordUpdatedEvent,
} from './webhooks/types';
import {
	hasAttioSignatureHeader,
	RecordCreatedEventSchema,
	RecordDeletedEventSchema,
	RecordUpdatedEventSchema,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Credentials type (optional inline credentials for local/dev usage)
// ─────────────────────────────────────────────────────────────────────────────

export type AttioCredentials = {
	accessToken?: string;
	refreshToken?: string;
	clientId?: string;
	clientSecret?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Options
// ─────────────────────────────────────────────────────────────────────────────

export type AttioPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	credentials?: AttioCredentials;
	webhookSecret?: string;
	hooks?: InternalAttioPlugin['hooks'];
	webhookHooks?: InternalAttioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof attioEndpointsNested>;
};

// ─────────────────────────────────────────────────────────────────────────────
// Context Types
// ─────────────────────────────────────────────────────────────────────────────

export type AttioContext = CorsairPluginContext<
	typeof AttioSchema,
	AttioPluginOptions,
	undefined,
	typeof attioAuthConfig
>;

export type AttioKeyBuilderContext = KeyBuilderContext<
	AttioPluginOptions,
	typeof attioAuthConfig
>;

export type AttioBoundEndpoints = BindEndpoints<typeof attioEndpointsNested>;

type AttioWebhook<K extends keyof AttioWebhookOutputs, TEvent> = CorsairWebhook<
	AttioContext,
	TEvent,
	AttioWebhookOutputs[K]
>;

export type AttioWebhooks = {
	recordCreated: AttioWebhook<'recordCreated', RecordCreatedEvent>;
	recordUpdated: AttioWebhook<'recordUpdated', RecordUpdatedEvent>;
	recordDeleted: AttioWebhook<'recordDeleted', RecordDeletedEvent>;
};

export type AttioBoundWebhooks = BindWebhooks<AttioWebhooks>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint & Webhook Registration
// ─────────────────────────────────────────────────────────────────────────────

const attioEndpointsNested = {
	generated: {
		putV2ListsListEntries: Generated.putV2ListsListEntries,
		assertPerson: Generated.assertPerson,
		putV2ObjectsObjectRecords: Generated.putV2ObjectsObjectRecords,
		assertUserRecord: Generated.assertUserRecord,
		assertWorkspace: Generated.assertWorkspace,
		createAttribute: Generated.createAttribute,
		createComment: Generated.createComment,
		createCompany: Generated.createCompany,
		createDealRecord: Generated.createDealRecord,
		createEntry: Generated.createEntry,
		createList: Generated.createList,
		postV2ListsListEntries: Generated.postV2ListsListEntries,
		createNote: Generated.createNote,
		createObject: Generated.createObject,
		createPerson: Generated.createPerson,
		createRecord: Generated.createRecord,
		createSelectOption: Generated.createSelectOption,
		createStatus: Generated.createStatus,
		createTask: Generated.createTask,
		createUserRecord: Generated.createUserRecord,
		createWebhook: Generated.createWebhook,
		createWorkspaceRecord: Generated.createWorkspaceRecord,
		postV2ObjectsObjectRecords: Generated.postV2ObjectsObjectRecords,
		deleteComment: Generated.deleteComment,
		deleteCompany: Generated.deleteCompany,
		deleteDeal: Generated.deleteDeal,
		deleteEntry: Generated.deleteEntry,
		deleteNote: Generated.deleteNote,
		deletePerson: Generated.deletePerson,
		deleteRecord: Generated.deleteRecord,
		deleteRecordById: Generated.deleteRecordById,
		deleteTask: Generated.deleteTask,
		deleteUser: Generated.deleteUser,
		deleteWebhook: Generated.deleteWebhook,
		deleteWorkspaceRecord: Generated.deleteWorkspaceRecord,
		findRecord: Generated.findRecord,
		getAttribute: Generated.getAttribute,
		getComment: Generated.getComment,
		getCompany: Generated.getCompany,
		getSelf: Generated.getSelf,
		getDealRecord: Generated.getDealRecord,
		getList: Generated.getList,
		getListEntry: Generated.getListEntry,
		getNote: Generated.getNote,
		getObject: Generated.getObject,
		peopleGetPerson: Generated.peopleGetPerson,
		getRecord: Generated.getRecord,
		getRecordAttributeValues: Generated.getRecordAttributeValues,
		getV2ObjectsObjectRecordsRecordId:
			Generated.getV2ObjectsObjectRecordsRecordId,
		getTask: Generated.getTask,
		getV2WorkspaceMembers: Generated.getV2WorkspaceMembers,
		getWebhook: Generated.getWebhook,
		getWorkspaceMember: Generated.getWorkspaceMember,
		getWorkspaceRecord: Generated.getWorkspaceRecord,
		listAttributeOptions: Generated.listAttributeOptions,
		listAttributeStatuses: Generated.listAttributeStatuses,
		listAttributes: Generated.listAttributes,
		listCallRecordings: Generated.listCallRecordings,
		listCompanies: Generated.listCompanies,
		listCompanyAttributeValues: Generated.listCompanyAttributeValues,
		listCompanyRecordEntries: Generated.listCompanyRecordEntries,
		listDealEntries: Generated.listDealEntries,
		listDealRecordAttributeValues: Generated.listDealRecordAttributeValues,
		listDealRecords: Generated.listDealRecords,
		listEntries: Generated.listEntries,
		postV2ListsListEntriesQuery: Generated.postV2ListsListEntriesQuery,
		listListEntries: Generated.listListEntries,
		listListEntryAttributeValues: Generated.listListEntryAttributeValues,
		listLists: Generated.listLists,
		listMeetings: Generated.listMeetings,
		listNotes: Generated.listNotes,
		listObjects: Generated.listObjects,
		listPeopleAttributeValues: Generated.listPeopleAttributeValues,
		listPeopleRecordEntries: Generated.listPeopleRecordEntries,
		peopleListPersons: Generated.peopleListPersons,
		listRecordAttributeValues: Generated.listRecordAttributeValues,
		getRecordEntries: Generated.getRecordEntries,
		listRecordEntries: Generated.listRecordEntries,
		listRecords: Generated.listRecords,
		postV2ObjectsObjectRecordsQuery: Generated.postV2ObjectsObjectRecordsQuery,
		getV2Tasks: Generated.getV2Tasks,
		listThreads: Generated.listThreads,
		listUserRecordEntries: Generated.listUserRecordEntries,
		listUserRecords: Generated.listUserRecords,
		listWebhooks: Generated.listWebhooks,
		listWorkspaceMembers: Generated.listWorkspaceMembers,
		listWorkspaceRecordAttributeValues:
			Generated.listWorkspaceRecordAttributeValues,
		listWorkspaceRecordEntries: Generated.listWorkspaceRecordEntries,
		listWorkspaceRecords: Generated.listWorkspaceRecords,
		patchRecord: Generated.patchRecord,
		putV2ObjectsObjectRecordsRecordId:
			Generated.putV2ObjectsObjectRecordsRecordId,
		queryRecords: Generated.queryRecords,
		searchRecords: Generated.searchRecords,
		postV2ObjectsRecordsSearch: Generated.postV2ObjectsRecordsSearch,
		updateAttribute: Generated.updateAttribute,
		updateCompany: Generated.updateCompany,
		updateDealRecord: Generated.updateDealRecord,
		updateEntry: Generated.updateEntry,
		updateList: Generated.updateList,
		patchV2ListsListEntriesEntryId: Generated.patchV2ListsListEntriesEntryId,
		putV2ListsListEntriesEntryId: Generated.putV2ListsListEntriesEntryId,
		updateObject: Generated.updateObject,
		updatePerson: Generated.updatePerson,
		updateRecord: Generated.updateRecord,
		updateSelectOption: Generated.updateSelectOption,
		updateStatus: Generated.updateStatus,
		updateTask: Generated.updateTask,
		updateUserRecord: Generated.updateUserRecord,
		updateWebhook: Generated.updateWebhook,
		updateWorkspaceRecord: Generated.updateWorkspaceRecord,
	},
} as const;

const attioWebhooksNested = {
	record: {
		created: RecordWebhooks.recordCreated,
		updated: RecordWebhooks.recordUpdated,
		deleted: RecordWebhooks.recordDeleted,
	},
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const attioEndpointSchemas = {
	'generated.putV2ListsListEntries': {
		input: GeneratedEndpointInputSchemas.putV2ListsListEntries,
		output: GeneratedEndpointOutputSchemas.putV2ListsListEntries,
	},
	'generated.assertPerson': {
		input: GeneratedEndpointInputSchemas.assertPerson,
		output: GeneratedEndpointOutputSchemas.assertPerson,
	},
	'generated.putV2ObjectsObjectRecords': {
		input: GeneratedEndpointInputSchemas.putV2ObjectsObjectRecords,
		output: GeneratedEndpointOutputSchemas.putV2ObjectsObjectRecords,
	},
	'generated.assertUserRecord': {
		input: GeneratedEndpointInputSchemas.assertUserRecord,
		output: GeneratedEndpointOutputSchemas.assertUserRecord,
	},
	'generated.assertWorkspace': {
		input: GeneratedEndpointInputSchemas.assertWorkspace,
		output: GeneratedEndpointOutputSchemas.assertWorkspace,
	},
	'generated.createAttribute': {
		input: GeneratedEndpointInputSchemas.createAttribute,
		output: GeneratedEndpointOutputSchemas.createAttribute,
	},
	'generated.createComment': {
		input: GeneratedEndpointInputSchemas.createComment,
		output: GeneratedEndpointOutputSchemas.createComment,
	},
	'generated.createCompany': {
		input: GeneratedEndpointInputSchemas.createCompany,
		output: GeneratedEndpointOutputSchemas.createCompany,
	},
	'generated.createDealRecord': {
		input: GeneratedEndpointInputSchemas.createDealRecord,
		output: GeneratedEndpointOutputSchemas.createDealRecord,
	},
	'generated.createEntry': {
		input: GeneratedEndpointInputSchemas.createEntry,
		output: GeneratedEndpointOutputSchemas.createEntry,
	},
	'generated.createList': {
		input: GeneratedEndpointInputSchemas.createList,
		output: GeneratedEndpointOutputSchemas.createList,
	},
	'generated.postV2ListsListEntries': {
		input: GeneratedEndpointInputSchemas.postV2ListsListEntries,
		output: GeneratedEndpointOutputSchemas.postV2ListsListEntries,
	},
	'generated.createNote': {
		input: GeneratedEndpointInputSchemas.createNote,
		output: GeneratedEndpointOutputSchemas.createNote,
	},
	'generated.createObject': {
		input: GeneratedEndpointInputSchemas.createObject,
		output: GeneratedEndpointOutputSchemas.createObject,
	},
	'generated.createPerson': {
		input: GeneratedEndpointInputSchemas.createPerson,
		output: GeneratedEndpointOutputSchemas.createPerson,
	},
	'generated.createRecord': {
		input: GeneratedEndpointInputSchemas.createRecord,
		output: GeneratedEndpointOutputSchemas.createRecord,
	},
	'generated.createSelectOption': {
		input: GeneratedEndpointInputSchemas.createSelectOption,
		output: GeneratedEndpointOutputSchemas.createSelectOption,
	},
	'generated.createStatus': {
		input: GeneratedEndpointInputSchemas.createStatus,
		output: GeneratedEndpointOutputSchemas.createStatus,
	},
	'generated.createTask': {
		input: GeneratedEndpointInputSchemas.createTask,
		output: GeneratedEndpointOutputSchemas.createTask,
	},
	'generated.createUserRecord': {
		input: GeneratedEndpointInputSchemas.createUserRecord,
		output: GeneratedEndpointOutputSchemas.createUserRecord,
	},
	'generated.createWebhook': {
		input: GeneratedEndpointInputSchemas.createWebhook,
		output: GeneratedEndpointOutputSchemas.createWebhook,
	},
	'generated.createWorkspaceRecord': {
		input: GeneratedEndpointInputSchemas.createWorkspaceRecord,
		output: GeneratedEndpointOutputSchemas.createWorkspaceRecord,
	},
	'generated.postV2ObjectsObjectRecords': {
		input: GeneratedEndpointInputSchemas.postV2ObjectsObjectRecords,
		output: GeneratedEndpointOutputSchemas.postV2ObjectsObjectRecords,
	},
	'generated.deleteComment': {
		input: GeneratedEndpointInputSchemas.deleteComment,
		output: GeneratedEndpointOutputSchemas.deleteComment,
	},
	'generated.deleteCompany': {
		input: GeneratedEndpointInputSchemas.deleteCompany,
		output: GeneratedEndpointOutputSchemas.deleteCompany,
	},
	'generated.deleteDeal': {
		input: GeneratedEndpointInputSchemas.deleteDeal,
		output: GeneratedEndpointOutputSchemas.deleteDeal,
	},
	'generated.deleteEntry': {
		input: GeneratedEndpointInputSchemas.deleteEntry,
		output: GeneratedEndpointOutputSchemas.deleteEntry,
	},
	'generated.deleteNote': {
		input: GeneratedEndpointInputSchemas.deleteNote,
		output: GeneratedEndpointOutputSchemas.deleteNote,
	},
	'generated.deletePerson': {
		input: GeneratedEndpointInputSchemas.deletePerson,
		output: GeneratedEndpointOutputSchemas.deletePerson,
	},
	'generated.deleteRecord': {
		input: GeneratedEndpointInputSchemas.deleteRecord,
		output: GeneratedEndpointOutputSchemas.deleteRecord,
	},
	'generated.deleteRecordById': {
		input: GeneratedEndpointInputSchemas.deleteRecordById,
		output: GeneratedEndpointOutputSchemas.deleteRecordById,
	},
	'generated.deleteTask': {
		input: GeneratedEndpointInputSchemas.deleteTask,
		output: GeneratedEndpointOutputSchemas.deleteTask,
	},
	'generated.deleteUser': {
		input: GeneratedEndpointInputSchemas.deleteUser,
		output: GeneratedEndpointOutputSchemas.deleteUser,
	},
	'generated.deleteWebhook': {
		input: GeneratedEndpointInputSchemas.deleteWebhook,
		output: GeneratedEndpointOutputSchemas.deleteWebhook,
	},
	'generated.deleteWorkspaceRecord': {
		input: GeneratedEndpointInputSchemas.deleteWorkspaceRecord,
		output: GeneratedEndpointOutputSchemas.deleteWorkspaceRecord,
	},
	'generated.findRecord': {
		input: GeneratedEndpointInputSchemas.findRecord,
		output: GeneratedEndpointOutputSchemas.findRecord,
	},
	'generated.getAttribute': {
		input: GeneratedEndpointInputSchemas.getAttribute,
		output: GeneratedEndpointOutputSchemas.getAttribute,
	},
	'generated.getComment': {
		input: GeneratedEndpointInputSchemas.getComment,
		output: GeneratedEndpointOutputSchemas.getComment,
	},
	'generated.getCompany': {
		input: GeneratedEndpointInputSchemas.getCompany,
		output: GeneratedEndpointOutputSchemas.getCompany,
	},
	'generated.getSelf': {
		input: GeneratedEndpointInputSchemas.getSelf,
		output: GeneratedEndpointOutputSchemas.getSelf,
	},
	'generated.getDealRecord': {
		input: GeneratedEndpointInputSchemas.getDealRecord,
		output: GeneratedEndpointOutputSchemas.getDealRecord,
	},
	'generated.getList': {
		input: GeneratedEndpointInputSchemas.getList,
		output: GeneratedEndpointOutputSchemas.getList,
	},
	'generated.getListEntry': {
		input: GeneratedEndpointInputSchemas.getListEntry,
		output: GeneratedEndpointOutputSchemas.getListEntry,
	},
	'generated.getNote': {
		input: GeneratedEndpointInputSchemas.getNote,
		output: GeneratedEndpointOutputSchemas.getNote,
	},
	'generated.getObject': {
		input: GeneratedEndpointInputSchemas.getObject,
		output: GeneratedEndpointOutputSchemas.getObject,
	},
	'generated.peopleGetPerson': {
		input: GeneratedEndpointInputSchemas.peopleGetPerson,
		output: GeneratedEndpointOutputSchemas.peopleGetPerson,
	},
	'generated.getRecord': {
		input: GeneratedEndpointInputSchemas.getRecord,
		output: GeneratedEndpointOutputSchemas.getRecord,
	},
	'generated.getRecordAttributeValues': {
		input: GeneratedEndpointInputSchemas.getRecordAttributeValues,
		output: GeneratedEndpointOutputSchemas.getRecordAttributeValues,
	},
	'generated.getV2ObjectsObjectRecordsRecordId': {
		input: GeneratedEndpointInputSchemas.getV2ObjectsObjectRecordsRecordId,
		output: GeneratedEndpointOutputSchemas.getV2ObjectsObjectRecordsRecordId,
	},
	'generated.getTask': {
		input: GeneratedEndpointInputSchemas.getTask,
		output: GeneratedEndpointOutputSchemas.getTask,
	},
	'generated.getV2WorkspaceMembers': {
		input: GeneratedEndpointInputSchemas.getV2WorkspaceMembers,
		output: GeneratedEndpointOutputSchemas.getV2WorkspaceMembers,
	},
	'generated.getWebhook': {
		input: GeneratedEndpointInputSchemas.getWebhook,
		output: GeneratedEndpointOutputSchemas.getWebhook,
	},
	'generated.getWorkspaceMember': {
		input: GeneratedEndpointInputSchemas.getWorkspaceMember,
		output: GeneratedEndpointOutputSchemas.getWorkspaceMember,
	},
	'generated.getWorkspaceRecord': {
		input: GeneratedEndpointInputSchemas.getWorkspaceRecord,
		output: GeneratedEndpointOutputSchemas.getWorkspaceRecord,
	},
	'generated.listAttributeOptions': {
		input: GeneratedEndpointInputSchemas.listAttributeOptions,
		output: GeneratedEndpointOutputSchemas.listAttributeOptions,
	},
	'generated.listAttributeStatuses': {
		input: GeneratedEndpointInputSchemas.listAttributeStatuses,
		output: GeneratedEndpointOutputSchemas.listAttributeStatuses,
	},
	'generated.listAttributes': {
		input: GeneratedEndpointInputSchemas.listAttributes,
		output: GeneratedEndpointOutputSchemas.listAttributes,
	},
	'generated.listCallRecordings': {
		input: GeneratedEndpointInputSchemas.listCallRecordings,
		output: GeneratedEndpointOutputSchemas.listCallRecordings,
	},
	'generated.listCompanies': {
		input: GeneratedEndpointInputSchemas.listCompanies,
		output: GeneratedEndpointOutputSchemas.listCompanies,
	},
	'generated.listCompanyAttributeValues': {
		input: GeneratedEndpointInputSchemas.listCompanyAttributeValues,
		output: GeneratedEndpointOutputSchemas.listCompanyAttributeValues,
	},
	'generated.listCompanyRecordEntries': {
		input: GeneratedEndpointInputSchemas.listCompanyRecordEntries,
		output: GeneratedEndpointOutputSchemas.listCompanyRecordEntries,
	},
	'generated.listDealEntries': {
		input: GeneratedEndpointInputSchemas.listDealEntries,
		output: GeneratedEndpointOutputSchemas.listDealEntries,
	},
	'generated.listDealRecordAttributeValues': {
		input: GeneratedEndpointInputSchemas.listDealRecordAttributeValues,
		output: GeneratedEndpointOutputSchemas.listDealRecordAttributeValues,
	},
	'generated.listDealRecords': {
		input: GeneratedEndpointInputSchemas.listDealRecords,
		output: GeneratedEndpointOutputSchemas.listDealRecords,
	},
	'generated.listEntries': {
		input: GeneratedEndpointInputSchemas.listEntries,
		output: GeneratedEndpointOutputSchemas.listEntries,
	},
	'generated.postV2ListsListEntriesQuery': {
		input: GeneratedEndpointInputSchemas.postV2ListsListEntriesQuery,
		output: GeneratedEndpointOutputSchemas.postV2ListsListEntriesQuery,
	},
	'generated.listListEntries': {
		input: GeneratedEndpointInputSchemas.listListEntries,
		output: GeneratedEndpointOutputSchemas.listListEntries,
	},
	'generated.listListEntryAttributeValues': {
		input: GeneratedEndpointInputSchemas.listListEntryAttributeValues,
		output: GeneratedEndpointOutputSchemas.listListEntryAttributeValues,
	},
	'generated.listLists': {
		input: GeneratedEndpointInputSchemas.listLists,
		output: GeneratedEndpointOutputSchemas.listLists,
	},
	'generated.listMeetings': {
		input: GeneratedEndpointInputSchemas.listMeetings,
		output: GeneratedEndpointOutputSchemas.listMeetings,
	},
	'generated.listNotes': {
		input: GeneratedEndpointInputSchemas.listNotes,
		output: GeneratedEndpointOutputSchemas.listNotes,
	},
	'generated.listObjects': {
		input: GeneratedEndpointInputSchemas.listObjects,
		output: GeneratedEndpointOutputSchemas.listObjects,
	},
	'generated.listPeopleAttributeValues': {
		input: GeneratedEndpointInputSchemas.listPeopleAttributeValues,
		output: GeneratedEndpointOutputSchemas.listPeopleAttributeValues,
	},
	'generated.listPeopleRecordEntries': {
		input: GeneratedEndpointInputSchemas.listPeopleRecordEntries,
		output: GeneratedEndpointOutputSchemas.listPeopleRecordEntries,
	},
	'generated.peopleListPersons': {
		input: GeneratedEndpointInputSchemas.peopleListPersons,
		output: GeneratedEndpointOutputSchemas.peopleListPersons,
	},
	'generated.listRecordAttributeValues': {
		input: GeneratedEndpointInputSchemas.listRecordAttributeValues,
		output: GeneratedEndpointOutputSchemas.listRecordAttributeValues,
	},
	'generated.getRecordEntries': {
		input: GeneratedEndpointInputSchemas.getRecordEntries,
		output: GeneratedEndpointOutputSchemas.getRecordEntries,
	},
	'generated.listRecordEntries': {
		input: GeneratedEndpointInputSchemas.listRecordEntries,
		output: GeneratedEndpointOutputSchemas.listRecordEntries,
	},
	'generated.listRecords': {
		input: GeneratedEndpointInputSchemas.listRecords,
		output: GeneratedEndpointOutputSchemas.listRecords,
	},
	'generated.postV2ObjectsObjectRecordsQuery': {
		input: GeneratedEndpointInputSchemas.postV2ObjectsObjectRecordsQuery,
		output: GeneratedEndpointOutputSchemas.postV2ObjectsObjectRecordsQuery,
	},
	'generated.getV2Tasks': {
		input: GeneratedEndpointInputSchemas.getV2Tasks,
		output: GeneratedEndpointOutputSchemas.getV2Tasks,
	},
	'generated.listThreads': {
		input: GeneratedEndpointInputSchemas.listThreads,
		output: GeneratedEndpointOutputSchemas.listThreads,
	},
	'generated.listUserRecordEntries': {
		input: GeneratedEndpointInputSchemas.listUserRecordEntries,
		output: GeneratedEndpointOutputSchemas.listUserRecordEntries,
	},
	'generated.listUserRecords': {
		input: GeneratedEndpointInputSchemas.listUserRecords,
		output: GeneratedEndpointOutputSchemas.listUserRecords,
	},
	'generated.listWebhooks': {
		input: GeneratedEndpointInputSchemas.listWebhooks,
		output: GeneratedEndpointOutputSchemas.listWebhooks,
	},
	'generated.listWorkspaceMembers': {
		input: GeneratedEndpointInputSchemas.listWorkspaceMembers,
		output: GeneratedEndpointOutputSchemas.listWorkspaceMembers,
	},
	'generated.listWorkspaceRecordAttributeValues': {
		input: GeneratedEndpointInputSchemas.listWorkspaceRecordAttributeValues,
		output: GeneratedEndpointOutputSchemas.listWorkspaceRecordAttributeValues,
	},
	'generated.listWorkspaceRecordEntries': {
		input: GeneratedEndpointInputSchemas.listWorkspaceRecordEntries,
		output: GeneratedEndpointOutputSchemas.listWorkspaceRecordEntries,
	},
	'generated.listWorkspaceRecords': {
		input: GeneratedEndpointInputSchemas.listWorkspaceRecords,
		output: GeneratedEndpointOutputSchemas.listWorkspaceRecords,
	},
	'generated.patchRecord': {
		input: GeneratedEndpointInputSchemas.patchRecord,
		output: GeneratedEndpointOutputSchemas.patchRecord,
	},
	'generated.putV2ObjectsObjectRecordsRecordId': {
		input: GeneratedEndpointInputSchemas.putV2ObjectsObjectRecordsRecordId,
		output: GeneratedEndpointOutputSchemas.putV2ObjectsObjectRecordsRecordId,
	},
	'generated.queryRecords': {
		input: GeneratedEndpointInputSchemas.queryRecords,
		output: GeneratedEndpointOutputSchemas.queryRecords,
	},
	'generated.searchRecords': {
		input: GeneratedEndpointInputSchemas.searchRecords,
		output: GeneratedEndpointOutputSchemas.searchRecords,
	},
	'generated.postV2ObjectsRecordsSearch': {
		input: GeneratedEndpointInputSchemas.postV2ObjectsRecordsSearch,
		output: GeneratedEndpointOutputSchemas.postV2ObjectsRecordsSearch,
	},
	'generated.updateAttribute': {
		input: GeneratedEndpointInputSchemas.updateAttribute,
		output: GeneratedEndpointOutputSchemas.updateAttribute,
	},
	'generated.updateCompany': {
		input: GeneratedEndpointInputSchemas.updateCompany,
		output: GeneratedEndpointOutputSchemas.updateCompany,
	},
	'generated.updateDealRecord': {
		input: GeneratedEndpointInputSchemas.updateDealRecord,
		output: GeneratedEndpointOutputSchemas.updateDealRecord,
	},
	'generated.updateEntry': {
		input: GeneratedEndpointInputSchemas.updateEntry,
		output: GeneratedEndpointOutputSchemas.updateEntry,
	},
	'generated.updateList': {
		input: GeneratedEndpointInputSchemas.updateList,
		output: GeneratedEndpointOutputSchemas.updateList,
	},
	'generated.patchV2ListsListEntriesEntryId': {
		input: GeneratedEndpointInputSchemas.patchV2ListsListEntriesEntryId,
		output: GeneratedEndpointOutputSchemas.patchV2ListsListEntriesEntryId,
	},
	'generated.putV2ListsListEntriesEntryId': {
		input: GeneratedEndpointInputSchemas.putV2ListsListEntriesEntryId,
		output: GeneratedEndpointOutputSchemas.putV2ListsListEntriesEntryId,
	},
	'generated.updateObject': {
		input: GeneratedEndpointInputSchemas.updateObject,
		output: GeneratedEndpointOutputSchemas.updateObject,
	},
	'generated.updatePerson': {
		input: GeneratedEndpointInputSchemas.updatePerson,
		output: GeneratedEndpointOutputSchemas.updatePerson,
	},
	'generated.updateRecord': {
		input: GeneratedEndpointInputSchemas.updateRecord,
		output: GeneratedEndpointOutputSchemas.updateRecord,
	},
	'generated.updateSelectOption': {
		input: GeneratedEndpointInputSchemas.updateSelectOption,
		output: GeneratedEndpointOutputSchemas.updateSelectOption,
	},
	'generated.updateStatus': {
		input: GeneratedEndpointInputSchemas.updateStatus,
		output: GeneratedEndpointOutputSchemas.updateStatus,
	},
	'generated.updateTask': {
		input: GeneratedEndpointInputSchemas.updateTask,
		output: GeneratedEndpointOutputSchemas.updateTask,
	},
	'generated.updateUserRecord': {
		input: GeneratedEndpointInputSchemas.updateUserRecord,
		output: GeneratedEndpointOutputSchemas.updateUserRecord,
	},
	'generated.updateWebhook': {
		input: GeneratedEndpointInputSchemas.updateWebhook,
		output: GeneratedEndpointOutputSchemas.updateWebhook,
	},
	'generated.updateWorkspaceRecord': {
		input: GeneratedEndpointInputSchemas.updateWorkspaceRecord,
		output: GeneratedEndpointOutputSchemas.updateWorkspaceRecord,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof attioEndpointsNested>;

const attioWebhookSchemas = {
	'record.created': {
		description: 'Triggered when a record is created',
		payload: RecordCreatedEventSchema,
		response: RecordCreatedEventSchema,
	},
	'record.updated': {
		description: 'Triggered when a record is updated',
		payload: RecordUpdatedEventSchema,
		response: RecordUpdatedEventSchema,
	},
	'record.deleted': {
		description: 'Triggered when a record is deleted',
		payload: RecordDeletedEventSchema,
		response: RecordDeletedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof attioWebhooksNested>;

// ─────────────────────────────────────────────────────────────────────────────
// Auth Config
// ─────────────────────────────────────────────────────────────────────────────

const defaultAuthType = 'oauth_2' as const;

const attioEndpointMeta = {
	'generated.putV2ListsListEntries':
		GeneratedEndpointMeta.putV2ListsListEntries,
	'generated.assertPerson': GeneratedEndpointMeta.assertPerson,
	'generated.putV2ObjectsObjectRecords':
		GeneratedEndpointMeta.putV2ObjectsObjectRecords,
	'generated.assertUserRecord': GeneratedEndpointMeta.assertUserRecord,
	'generated.assertWorkspace': GeneratedEndpointMeta.assertWorkspace,
	'generated.createAttribute': GeneratedEndpointMeta.createAttribute,
	'generated.createComment': GeneratedEndpointMeta.createComment,
	'generated.createCompany': GeneratedEndpointMeta.createCompany,
	'generated.createDealRecord': GeneratedEndpointMeta.createDealRecord,
	'generated.createEntry': GeneratedEndpointMeta.createEntry,
	'generated.createList': GeneratedEndpointMeta.createList,
	'generated.postV2ListsListEntries':
		GeneratedEndpointMeta.postV2ListsListEntries,
	'generated.createNote': GeneratedEndpointMeta.createNote,
	'generated.createObject': GeneratedEndpointMeta.createObject,
	'generated.createPerson': GeneratedEndpointMeta.createPerson,
	'generated.createRecord': GeneratedEndpointMeta.createRecord,
	'generated.createSelectOption': GeneratedEndpointMeta.createSelectOption,
	'generated.createStatus': GeneratedEndpointMeta.createStatus,
	'generated.createTask': GeneratedEndpointMeta.createTask,
	'generated.createUserRecord': GeneratedEndpointMeta.createUserRecord,
	'generated.createWebhook': GeneratedEndpointMeta.createWebhook,
	'generated.createWorkspaceRecord':
		GeneratedEndpointMeta.createWorkspaceRecord,
	'generated.postV2ObjectsObjectRecords':
		GeneratedEndpointMeta.postV2ObjectsObjectRecords,
	'generated.deleteComment': GeneratedEndpointMeta.deleteComment,
	'generated.deleteCompany': GeneratedEndpointMeta.deleteCompany,
	'generated.deleteDeal': GeneratedEndpointMeta.deleteDeal,
	'generated.deleteEntry': GeneratedEndpointMeta.deleteEntry,
	'generated.deleteNote': GeneratedEndpointMeta.deleteNote,
	'generated.deletePerson': GeneratedEndpointMeta.deletePerson,
	'generated.deleteRecord': GeneratedEndpointMeta.deleteRecord,
	'generated.deleteRecordById': GeneratedEndpointMeta.deleteRecordById,
	'generated.deleteTask': GeneratedEndpointMeta.deleteTask,
	'generated.deleteUser': GeneratedEndpointMeta.deleteUser,
	'generated.deleteWebhook': GeneratedEndpointMeta.deleteWebhook,
	'generated.deleteWorkspaceRecord':
		GeneratedEndpointMeta.deleteWorkspaceRecord,
	'generated.findRecord': GeneratedEndpointMeta.findRecord,
	'generated.getAttribute': GeneratedEndpointMeta.getAttribute,
	'generated.getComment': GeneratedEndpointMeta.getComment,
	'generated.getCompany': GeneratedEndpointMeta.getCompany,
	'generated.getSelf': GeneratedEndpointMeta.getSelf,
	'generated.getDealRecord': GeneratedEndpointMeta.getDealRecord,
	'generated.getList': GeneratedEndpointMeta.getList,
	'generated.getListEntry': GeneratedEndpointMeta.getListEntry,
	'generated.getNote': GeneratedEndpointMeta.getNote,
	'generated.getObject': GeneratedEndpointMeta.getObject,
	'generated.peopleGetPerson': GeneratedEndpointMeta.peopleGetPerson,
	'generated.getRecord': GeneratedEndpointMeta.getRecord,
	'generated.getRecordAttributeValues':
		GeneratedEndpointMeta.getRecordAttributeValues,
	'generated.getV2ObjectsObjectRecordsRecordId':
		GeneratedEndpointMeta.getV2ObjectsObjectRecordsRecordId,
	'generated.getTask': GeneratedEndpointMeta.getTask,
	'generated.getV2WorkspaceMembers':
		GeneratedEndpointMeta.getV2WorkspaceMembers,
	'generated.getWebhook': GeneratedEndpointMeta.getWebhook,
	'generated.getWorkspaceMember': GeneratedEndpointMeta.getWorkspaceMember,
	'generated.getWorkspaceRecord': GeneratedEndpointMeta.getWorkspaceRecord,
	'generated.listAttributeOptions': GeneratedEndpointMeta.listAttributeOptions,
	'generated.listAttributeStatuses':
		GeneratedEndpointMeta.listAttributeStatuses,
	'generated.listAttributes': GeneratedEndpointMeta.listAttributes,
	'generated.listCallRecordings': GeneratedEndpointMeta.listCallRecordings,
	'generated.listCompanies': GeneratedEndpointMeta.listCompanies,
	'generated.listCompanyAttributeValues':
		GeneratedEndpointMeta.listCompanyAttributeValues,
	'generated.listCompanyRecordEntries':
		GeneratedEndpointMeta.listCompanyRecordEntries,
	'generated.listDealEntries': GeneratedEndpointMeta.listDealEntries,
	'generated.listDealRecordAttributeValues':
		GeneratedEndpointMeta.listDealRecordAttributeValues,
	'generated.listDealRecords': GeneratedEndpointMeta.listDealRecords,
	'generated.listEntries': GeneratedEndpointMeta.listEntries,
	'generated.postV2ListsListEntriesQuery':
		GeneratedEndpointMeta.postV2ListsListEntriesQuery,
	'generated.listListEntries': GeneratedEndpointMeta.listListEntries,
	'generated.listListEntryAttributeValues':
		GeneratedEndpointMeta.listListEntryAttributeValues,
	'generated.listLists': GeneratedEndpointMeta.listLists,
	'generated.listMeetings': GeneratedEndpointMeta.listMeetings,
	'generated.listNotes': GeneratedEndpointMeta.listNotes,
	'generated.listObjects': GeneratedEndpointMeta.listObjects,
	'generated.listPeopleAttributeValues':
		GeneratedEndpointMeta.listPeopleAttributeValues,
	'generated.listPeopleRecordEntries':
		GeneratedEndpointMeta.listPeopleRecordEntries,
	'generated.peopleListPersons': GeneratedEndpointMeta.peopleListPersons,
	'generated.listRecordAttributeValues':
		GeneratedEndpointMeta.listRecordAttributeValues,
	'generated.getRecordEntries': GeneratedEndpointMeta.getRecordEntries,
	'generated.listRecordEntries': GeneratedEndpointMeta.listRecordEntries,
	'generated.listRecords': GeneratedEndpointMeta.listRecords,
	'generated.postV2ObjectsObjectRecordsQuery':
		GeneratedEndpointMeta.postV2ObjectsObjectRecordsQuery,
	'generated.getV2Tasks': GeneratedEndpointMeta.getV2Tasks,
	'generated.listThreads': GeneratedEndpointMeta.listThreads,
	'generated.listUserRecordEntries':
		GeneratedEndpointMeta.listUserRecordEntries,
	'generated.listUserRecords': GeneratedEndpointMeta.listUserRecords,
	'generated.listWebhooks': GeneratedEndpointMeta.listWebhooks,
	'generated.listWorkspaceMembers': GeneratedEndpointMeta.listWorkspaceMembers,
	'generated.listWorkspaceRecordAttributeValues':
		GeneratedEndpointMeta.listWorkspaceRecordAttributeValues,
	'generated.listWorkspaceRecordEntries':
		GeneratedEndpointMeta.listWorkspaceRecordEntries,
	'generated.listWorkspaceRecords': GeneratedEndpointMeta.listWorkspaceRecords,
	'generated.patchRecord': GeneratedEndpointMeta.patchRecord,
	'generated.putV2ObjectsObjectRecordsRecordId':
		GeneratedEndpointMeta.putV2ObjectsObjectRecordsRecordId,
	'generated.queryRecords': GeneratedEndpointMeta.queryRecords,
	'generated.searchRecords': GeneratedEndpointMeta.searchRecords,
	'generated.postV2ObjectsRecordsSearch':
		GeneratedEndpointMeta.postV2ObjectsRecordsSearch,
	'generated.updateAttribute': GeneratedEndpointMeta.updateAttribute,
	'generated.updateCompany': GeneratedEndpointMeta.updateCompany,
	'generated.updateDealRecord': GeneratedEndpointMeta.updateDealRecord,
	'generated.updateEntry': GeneratedEndpointMeta.updateEntry,
	'generated.updateList': GeneratedEndpointMeta.updateList,
	'generated.patchV2ListsListEntriesEntryId':
		GeneratedEndpointMeta.patchV2ListsListEntriesEntryId,
	'generated.putV2ListsListEntriesEntryId':
		GeneratedEndpointMeta.putV2ListsListEntriesEntryId,
	'generated.updateObject': GeneratedEndpointMeta.updateObject,
	'generated.updatePerson': GeneratedEndpointMeta.updatePerson,
	'generated.updateRecord': GeneratedEndpointMeta.updateRecord,
	'generated.updateSelectOption': GeneratedEndpointMeta.updateSelectOption,
	'generated.updateStatus': GeneratedEndpointMeta.updateStatus,
	'generated.updateTask': GeneratedEndpointMeta.updateTask,
	'generated.updateUserRecord': GeneratedEndpointMeta.updateUserRecord,
	'generated.updateWebhook': GeneratedEndpointMeta.updateWebhook,
	'generated.updateWorkspaceRecord':
		GeneratedEndpointMeta.updateWorkspaceRecord,
} as const satisfies RequiredPluginEndpointMeta<typeof attioEndpointsNested>;

export const attioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Types
// ─────────────────────────────────────────────────────────────────────────────

export type BaseAttioPlugin<T extends AttioPluginOptions> = CorsairPlugin<
	'attio',
	typeof AttioSchema,
	typeof attioEndpointsNested,
	typeof attioWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof attioAuthConfig
>;

export type InternalAttioPlugin = BaseAttioPlugin<AttioPluginOptions>;

export type ExternalAttioPlugin<T extends AttioPluginOptions> =
	BaseAttioPlugin<T>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Factory
// ─────────────────────────────────────────────────────────────────────────────

export function attio<const T extends AttioPluginOptions>(
	incomingOptions: AttioPluginOptions & T = {} as AttioPluginOptions & T,
): ExternalAttioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'attio',
		authConfig: attioAuthConfig,
		schema: AttioSchema,
		options: options,

		// ── OAuth Config ──────────────────────────────────────────────────
		// Attio uses standard OAuth 2.0 with authorization code grant.
		// Auth URL: https://app.attio.com/authorize
		// Token URL: https://app.attio.com/oauth/token
		oauthConfig: {
			providerName: 'Attio',
			authUrl: ATTIO_OAUTH_AUTH_URL,
			tokenUrl: ATTIO_OAUTH_TOKEN_URL,
			scopes: [
				'record_permission:read-write',
				'object_configuration:read-write',
				'user_management:read',
				'list_entry:read-write',
				'list_configuration:read-write',
				'comment:read-write',
				'task:read-write',
				'note:read-write',
				'webhook:read-write',
			],
			authParams: { prompt: 'consent' },
			tokenAuthMethod: 'body',
		},

		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: attioEndpointsNested,
		webhooks: attioWebhooksNested,
		endpointMeta: attioEndpointMeta,
		endpointSchemas: attioEndpointSchemas,
		webhookSchemas: attioWebhookSchemas,
		pluginWebhookMatcher: (request) => hasAttioSignatureHeader(request.headers),
		pluginTenantWebhookMatcher: matchAttioTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAttioOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		// ── Key Builder ───────────────────────────────────────────────────
		// Resolves the API key/token based on auth type and source.
		keyBuilder: async (ctx: AttioKeyBuilderContext, source) => {
			// ── Webhook Signature ─────────────────────────────────────────
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			// ── Static key shortcut ───────────────────────────────────────
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// ── API Key auth ──────────────────────────────────────────────
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('attio', 'api_key');
				}
				return res;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const creds = options.credentials;
				const storedAccessToken = await ctx.keys.get_access_token();
				const accessToken = storedAccessToken ?? creds?.accessToken ?? null;
				try {
					const result = await getValidAccessToken({ accessToken });
					return result.accessToken;
				} catch {
					throw new AuthMissingError('attio', 'oauth_2');
				}
			}

			throw new AuthMissingError('attio', ctx.authType);
		},
	} satisfies InternalAttioPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AttioWebhookOutputs,
	RecordCreatedEvent,
	RecordDeletedEvent,
	RecordUpdatedEvent,
} from './webhooks/types';
