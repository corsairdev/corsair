import type { PrismaOperation } from '../endpoints/operation-types';

export const workspacesOperations = [
	{
		key: 'listWorkspaces',
		group: 'workspaces',
		name: 'list',
		method: 'GET',
		path: '/workspaces',
		riskLevel: 'read',
		description: 'List workspaces the token can access',
	},
] as const satisfies readonly PrismaOperation[];
