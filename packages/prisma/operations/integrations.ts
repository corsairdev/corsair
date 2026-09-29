import type { PrismaOperation } from '../endpoints/operation-types';

export const integrationsOperations = [
	{
		key: 'listWorkspaceIntegrations',
		group: 'integrations',
		name: 'list',
		method: 'GET',
		path: '/workspaces/{workspaceId}/integrations',
		pathParams: ['workspaceId'],
		riskLevel: 'read',
		description:
			'List integrations (OAuth clients, granted scopes) for a workspace',
	},
] as const satisfies readonly PrismaOperation[];
