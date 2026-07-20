import type { NeonOperation } from '../endpoints/operation-types';

export const usersOperations = [
	{
		key: 'getCurrentUserInfo',
		group: 'users',
		name: 'getCurrentUserInfo',
		method: 'GET',
		path: '/users/me',
		riskLevel: 'read',
		description: 'Retrieve current user details',
	},
	{
		key: 'getCurrentUserOrganizations',
		group: 'users',
		name: 'getCurrentUserOrganizations',
		method: 'GET',
		path: '/users/me/organizations',
		riskLevel: 'read',
		description: 'List organizations for the current user',
	},
] as const satisfies readonly NeonOperation[];
