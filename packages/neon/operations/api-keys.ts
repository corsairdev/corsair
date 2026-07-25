import type { NeonOperation } from '../endpoints/operation-types';

export const apiKeysOperations = [
	{
		key: 'listApiKeys',
		group: 'apiKeys',
		name: 'listApiKeys',
		method: 'GET',
		path: '/api_keys',
		riskLevel: 'read',
		description: 'List API keys',
	},
	{
		key: 'createApiKey',
		group: 'apiKeys',
		name: 'createApiKey',
		method: 'POST',
		path: '/api_keys',
		riskLevel: 'write',
		description: 'Create API key',
	},
	{
		key: 'revokeApiKey',
		group: 'apiKeys',
		name: 'revokeApiKey',
		method: 'DELETE',
		path: '/api_keys/{key_id}',
		pathParams: ['key_id'],
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Revoke API key',
	},
] as const satisfies readonly NeonOperation[];
