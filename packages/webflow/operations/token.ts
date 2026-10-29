import type { WebflowOperation } from '../endpoints/operation-types';

export const tokenOperations = [
	{
		key: 'getTokenAuthorizedBy',
		group: 'token',
		name: 'getTokenAuthorizedBy',
		method: 'GET',
		path: '/token/authorized_by',
		riskLevel: 'read',
		description:
			'Get information about the user who authorized the access token',
	},
] as const satisfies readonly WebflowOperation[];
