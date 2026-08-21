import type { WebflowOperation } from '../endpoints/operation-types';

export const componentsOperations = [
	{
		key: 'getComponentProperties',
		group: 'components',
		name: 'getComponentProperties',
		method: 'GET',
		path: '/sites/{site_id}/components/{component_id}/properties',
		pathParams: ['site_id', 'component_id'],
		riskLevel: 'read',
		description: 'Get the default property values of a component definition',
	},
] as const satisfies readonly WebflowOperation[];
