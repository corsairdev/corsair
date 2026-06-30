import type { SupabaseOperation } from '../endpoints/operation-types';

export const restOperations = [
	{
		key: 'getProjectPostgrestConfig',
		group: 'rest',
		name: 'getProjectPostgrestConfig',
		method: 'GET',
		path: '/v1/projects/{ref}/postgrest',
		pathParams: ['ref'],
		riskLevel: 'read',
		description: 'Get project PostgREST config',
	},
	{
		key: 'updateProjectPostgrestConfig',
		group: 'rest',
		name: 'updateProjectPostgrestConfig',
		method: 'PATCH',
		path: '/v1/projects/{ref}/postgrest',
		pathParams: ['ref'],
		riskLevel: 'write',
		description: 'Update project PostgREST config',
	},
] as const satisfies readonly SupabaseOperation[];
