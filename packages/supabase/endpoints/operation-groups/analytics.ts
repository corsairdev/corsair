import type { SupabaseOperation } from '../operation-types';

export const analyticsOperations = [
	{
		key: 'getProjectLogs',
		group: 'analytics',
		name: 'getProjectLogs',
		method: 'GET',
		path: '/v1/projects/{ref}/analytics/endpoints/logs.all',
		pathParams: ['ref'],
		riskLevel: 'read',
		description: 'Get project logs',
	},
] as const satisfies readonly SupabaseOperation[];
