import type { NeonOperation } from '../endpoints/operation-types';

export const consumptionOperations = [
	{
		key: 'getConsumptionHistoryPerProject',
		group: 'consumption',
		name: 'getConsumptionHistoryPerProject',
		method: 'GET',
		path: '/consumption_history/projects',
		riskLevel: 'read',
		description: 'Retrieve project consumption metrics (legacy plans)',
	},
	{
		key: 'getConsumptionHistoryPerAccount',
		group: 'consumption',
		name: 'getConsumptionHistoryPerAccount',
		method: 'GET',
		path: '/consumption_history/account',
		riskLevel: 'read',
		description: 'Retrieve account consumption metrics (legacy, deprecated)',
	},
] as const satisfies readonly NeonOperation[];
