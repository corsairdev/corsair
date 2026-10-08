import { authorizeOAuth } from './auth';
import {
	createDatabase,
	deleteDatabase,
	getDatabaseById,
	getDatabases,
} from './databases';
import { createField, deleteField, updateField } from './fields';
import { getFormMetadata, getForms } from './forms';
import {
	createRecord,
	deleteRecord,
	getRecordById,
	listRecords,
	updateRecord,
} from './records';
import {
	createSubmission,
	deleteSubmission,
	getSubmissionById,
	listSubmissions,
} from './submissions';
import { createTable, deleteTable, updateTable } from './tables';
import { invalidateAccessToken } from './token';
import {
	createDatabaseWebhook,
	createFormWebhook,
	deleteDatabaseWebhook,
	listDatabaseWebhooks,
	removeFormWebhook,
} from './webhooks';

export const Forms = {
	getForms,
	getFormMetadata,
};

export const Databases = {
	get: getDatabases,
	getById: getDatabaseById,
	create: createDatabase,
	delete: deleteDatabase,
};

export const Tables = {
	create: createTable,
	update: updateTable,
	delete: deleteTable,
};

export const Fields = {
	create: createField,
	update: updateField,
	delete: deleteField,
};

export const Submissions = {
	list: listSubmissions,
	getById: getSubmissionById,
	create: createSubmission,
	delete: deleteSubmission,
};

export const Records = {
	list: listRecords,
	getById: getRecordById,
	create: createRecord,
	update: updateRecord,
	delete: deleteRecord,
};

export const Webhooks = {
	createForm: createFormWebhook,
	removeForm: removeFormWebhook,
	createDatabase: createDatabaseWebhook,
	listDatabase: listDatabaseWebhooks,
	deleteDatabase: deleteDatabaseWebhook,
};

export const Auth = {
	authorizeOAuth,
};

export const Token = {
	invalidateAccessToken,
};

export * from './types';
