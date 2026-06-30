import type { SupabaseOperation } from '../operation-types';

export const organizationsOperations = [
	{
		key: 'createOrganization',
		group: 'organizations',
		name: 'createOrganization',
		method: 'POST',
		path: '/v1/organizations',
		riskLevel: 'write',
		description: 'Create an organization',
	},
	{
		key: 'getOrganization',
		group: 'organizations',
		name: 'getOrganization',
		method: 'GET',
		path: '/v1/organizations/{slug}',
		pathParams: ['slug'],
		riskLevel: 'read',
		description: 'Get organization information',
	},
	{
		key: 'listAllOrganizations',
		group: 'organizations',
		name: 'listAllOrganizations',
		method: 'GET',
		path: '/v1/organizations',
		riskLevel: 'read',
		description: 'List organizations',
	},
	{
		key: 'listOrganizationMembers',
		group: 'organizations',
		name: 'listOrganizationMembers',
		method: 'GET',
		path: '/v1/organizations/{slug}/members',
		pathParams: ['slug'],
		riskLevel: 'read',
		description: 'List organization members',
	},
] as const satisfies readonly SupabaseOperation[];
