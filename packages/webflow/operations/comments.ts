import type { WebflowOperation } from '../endpoints/operation-types';

export const commentsOperations = [
	{
		key: 'listCommentThreads',
		group: 'comments',
		name: 'listCommentThreads',
		method: 'GET',
		path: '/sites/{site_id}/comments',
		pathParams: ['site_id'],
		riskLevel: 'read',
		description:
			'List all comment threads for a site. New comments may take up to 5 minutes to appear',
	},
] as const satisfies readonly WebflowOperation[];
