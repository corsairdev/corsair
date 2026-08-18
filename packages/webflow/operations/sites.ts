import type { WebflowOperation } from '../endpoints/operation-types';

export const sitesOperations = [
	{
		key: 'listSites',
		group: 'sites',
		name: 'listSites',
		method: 'GET',
		path: '/sites',
		riskLevel: 'read',
		description: 'List all Webflow sites accessible to the authenticated user',
	},
	{
		key: 'getSite',
		group: 'sites',
		name: 'getSite',
		method: 'GET',
		path: '/sites/{site_id}',
		pathParams: ['site_id'],
		riskLevel: 'read',
		description: 'Get detailed information about a specific site',
	},
	{
		key: 'updateSite',
		group: 'sites',
		name: 'updateSite',
		method: 'PATCH',
		path: '/sites/{site_id}',
		pathParams: ['site_id'],
		riskLevel: 'write',
		description:
			'Update site properties such as name and parent folder (Enterprise workspaces only)',
	},
	{
		key: 'publishSite',
		group: 'sites',
		name: 'publishSite',
		method: 'POST',
		path: '/sites/{site_id}/publish',
		pathParams: ['site_id'],
		riskLevel: 'write',
		description:
			'Publish a site, making staged changes live. Rate limited to 1 successful publish per minute',
	},
	{
		key: 'getCustomDomains',
		group: 'sites',
		name: 'getCustomDomains',
		method: 'GET',
		path: '/sites/{site_id}/custom_domains',
		pathParams: ['site_id'],
		riskLevel: 'read',
		description: 'List all custom domains configured for a site',
	},
] as const satisfies readonly WebflowOperation[];
