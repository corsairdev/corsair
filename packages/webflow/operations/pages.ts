import type { WebflowOperation } from '../endpoints/operation-types';

export const pagesOperations = [
	{
		key: 'listPages',
		group: 'pages',
		name: 'listPages',
		method: 'GET',
		path: '/sites/{site_id}/pages',
		pathParams: ['site_id'],
		riskLevel: 'read',
		description: 'List all static and CMS-driven pages for a site',
	},
	{
		key: 'getPage',
		group: 'pages',
		name: 'getPage',
		method: 'GET',
		path: '/pages/{page_id}',
		pathParams: ['page_id'],
		riskLevel: 'read',
		description:
			'Get page metadata including title, slug, SEO and Open Graph settings',
	},
	{
		key: 'getPageDom',
		group: 'pages',
		name: 'getPageDom',
		method: 'GET',
		path: '/pages/{page_id}/dom',
		pathParams: ['page_id'],
		riskLevel: 'read',
		description:
			'Get page content nodes for a static page, including text, image, form, search-button, and component-instance nodes. This is not the complete DOM',
	},
	{
		key: 'updatePageMetadata',
		group: 'pages',
		name: 'updatePageMetadata',
		method: 'PUT',
		path: '/pages/{page_id}',
		pathParams: ['page_id'],
		riskLevel: 'write',
		description:
			'Update page-level metadata including SEO and Open Graph fields',
	},
] as const satisfies readonly WebflowOperation[];
