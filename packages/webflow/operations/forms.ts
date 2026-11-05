import type { WebflowOperation } from '../endpoints/operation-types';

export const formsOperations = [
	{
		key: 'listFormSubmissions',
		group: 'forms',
		name: 'listFormSubmissions',
		method: 'GET',
		path: '/sites/{site_id}/form_submissions',
		pathParams: ['site_id'],
		riskLevel: 'read',
		description:
			'List form submissions for a site with pagination and optional filtering by form element id',
	},
] as const satisfies readonly WebflowOperation[];
