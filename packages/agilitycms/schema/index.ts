import {
	AgilityCmsContentItem,
	AgilityCmsContentModel,
	AgilityCmsPage,
	AgilityCmsPageModule,
	AgilityCmsSitemapNode,
	AgilityCmsSyncItem,
	AgilityCmsSyncPage,
} from './database';

export const AgilityCmsSchema = {
	version: '1.0.0',
	entities: {
		contentItems: AgilityCmsContentItem,
		pages: AgilityCmsPage,
		contentModels: AgilityCmsContentModel,
		pageModules: AgilityCmsPageModule,
		sitemapNodes: AgilityCmsSitemapNode,
		syncItems: AgilityCmsSyncItem,
		syncPages: AgilityCmsSyncPage,
	},
} as const;
