import type { NeonOperation } from '../endpoints/operation-types';

export const regionsOperations = [
	{
		key: 'getActiveRegions',
		group: 'regions',
		name: 'getActiveRegions',
		method: 'GET',
		path: '/regions',
		riskLevel: 'read',
		description: 'List supported regions',
	},
] as const satisfies readonly NeonOperation[];
