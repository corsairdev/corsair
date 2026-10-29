import { definePineconeEndpoint } from './factory';

const encode = encodeURIComponent;

export const createIndex = definePineconeEndpoint('createIndex', {
	method: 'POST',
	path: () => '/indexes',
	body: (input) => input,
});

export const createIndexForModel = definePineconeEndpoint(
	'createIndexForModel',
	{
		method: 'POST',
		path: () => '/indexes/create-for-model',
		body: (input) => input,
	},
);

export const listIndexes = definePineconeEndpoint('listIndexes', {
	method: 'GET',
	path: () => '/indexes',
});

export const describeIndex = definePineconeEndpoint('describeIndex', {
	method: 'GET',
	path: ({ indexName }) => `/indexes/${encode(indexName)}`,
});

export const configureIndex = definePineconeEndpoint('configureIndex', {
	method: 'PATCH',
	path: ({ indexName }) => `/indexes/${encode(indexName)}`,
	body: ({ indexName: _indexName, ...body }) => body,
});

export const deleteIndex = definePineconeEndpoint('deleteIndex', {
	method: 'DELETE',
	path: ({ indexName }) => `/indexes/${encode(indexName)}`,
});

export const createBackup = definePineconeEndpoint('createBackup', {
	method: 'POST',
	path: ({ indexName }) => `/indexes/${encode(indexName)}/backups`,
	body: ({ indexName: _indexName, ...body }) => body,
});

export const listIndexBackups = definePineconeEndpoint('listIndexBackups', {
	method: 'GET',
	path: ({ indexName }) => `/indexes/${encode(indexName)}/backups`,
	query: ({ includeDeleted, limit, paginationToken }) => ({
		include_deleted: includeDeleted,
		limit,
		paginationToken,
	}),
});

export const listCollections = definePineconeEndpoint('listCollections', {
	method: 'GET',
	path: () => '/collections',
});

export const listProjectBackups = definePineconeEndpoint('listProjectBackups', {
	method: 'GET',
	path: () => '/backups',
	query: (input) => input,
});

export const describeBackup = definePineconeEndpoint('describeBackup', {
	method: 'GET',
	path: ({ backupId }) => `/backups/${encode(backupId)}`,
});

export const deleteBackup = definePineconeEndpoint('deleteBackup', {
	method: 'DELETE',
	path: ({ backupId }) => `/backups/${encode(backupId)}`,
});

export const createIndexFromBackup = definePineconeEndpoint(
	'createIndexFromBackup',
	{
		method: 'POST',
		path: ({ backupId }) => `/backups/${encode(backupId)}/create-index`,
		body: ({ backupId: _backupId, ...body }) => body,
	},
);

export const listRestoreJobs = definePineconeEndpoint('listRestoreJobs', {
	method: 'GET',
	path: () => '/restore-jobs',
	query: (input) => input,
});

export const describeRestoreJob = definePineconeEndpoint('describeRestoreJob', {
	method: 'GET',
	path: ({ restoreJobId }) => `/restore-jobs/${encode(restoreJobId)}`,
});
