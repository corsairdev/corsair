import { authorizeOAuth } from './auth';
import { getFormMetadata, getForms } from './forms';
import {
	createSubmission,
	deleteSubmission,
	getSubmissionById,
	listSubmissions,
} from './submissions';
import { invalidateAccessToken } from './token';
import {
	createDatabase,
	createField,
	createTable,
	deleteDatabase,
	deleteDatabaseWebhook,
	deleteField,
	deleteTable,
	getDatabaseById,
	getDatabases,
	listDatabaseWebhooks,
	updateField,
	updateSubmission,
	updateTable,
} from './unsupported';
import { createWebhook, removeFormWebhook } from './webhooks';

export const Forms = {
	getForms,
	getFormMetadata,
};

export const Submissions = {
	list: listSubmissions,
	getById: getSubmissionById,
	create: createSubmission,
	delete: deleteSubmission,
};

export const Webhooks = {
	create: createWebhook,
	remove: removeFormWebhook,
};

export const Auth = {
	authorizeOAuth,
};

export const Token = {
	invalidateAccessToken,
};

export const Unsupported = {
	getDatabases,
	getDatabaseById,
	createDatabase,
	deleteDatabase,
	createTable,
	updateTable,
	deleteTable,
	createField,
	updateField,
	deleteField,
	updateSubmission,
	listDatabaseWebhooks,
	deleteDatabaseWebhook,
};

export * from './types';
