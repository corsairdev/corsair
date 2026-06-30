import type { SupabaseOperation } from '../operation-types';

export const advisorsOperations = [
	{
		key: 'getSecurityAdvisors',
		group: 'advisors',
		name: 'getSecurityAdvisors',
		method: 'GET',
		path: '/v1/projects/{ref}/advisors/security',
		pathParams: ['ref'],
		riskLevel: 'read',
		description: 'Get security advisors',
	},
	{
		key: 'getPerformanceAdvisors',
		group: 'advisors',
		name: 'getPerformanceAdvisors',
		method: 'GET',
		path: '/v1/projects/{ref}/advisors/performance',
		pathParams: ['ref'],
		riskLevel: 'read',
		description: 'Get performance advisors',
	},
] as const satisfies readonly SupabaseOperation[];
