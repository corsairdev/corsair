import type { PrismaOperation } from '../endpoints/operation-types';

export const connectionsOperations = [
	{
		key: 'createConnection',
		group: 'connections',
		name: 'create',
		method: 'POST',
		path: '/connections',
		riskLevel: 'write',
		description:
			'Create a connection (returns a ready-to-use connection string)',
	},
	{
		key: 'listConnections',
		group: 'connections',
		name: 'list',
		method: 'GET',
		path: '/connections',
		riskLevel: 'read',
		description: 'List connections',
	},
	{
		key: 'deleteConnection',
		group: 'connections',
		name: 'delete',
		method: 'DELETE',
		path: '/connections/{connectionId}',
		pathParams: ['connectionId'],
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete/revoke a connection and access for anything using it',
	},
] as const satisfies readonly PrismaOperation[];
