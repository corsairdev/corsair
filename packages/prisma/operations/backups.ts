import type { PrismaOperation } from '../endpoints/operation-types';

export const backupsOperations = [
	{
		key: 'listBackups',
		group: 'backups',
		name: 'list',
		method: 'GET',
		path: '/databases/{databaseId}/backups',
		pathParams: ['databaseId'],
		riskLevel: 'read',
		description: 'List backups for a database',
	},
	{
		key: 'restoreBackup',
		group: 'backups',
		name: 'restore',
		method: 'POST',
		path: '/databases/{targetDatabaseId}/restore',
		pathParams: ['targetDatabaseId'],
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Restore a backup onto the target database (async, overwrites current data)',
	},
] as const satisfies readonly PrismaOperation[];
