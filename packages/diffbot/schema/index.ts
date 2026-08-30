import {
	DiffbotAccount,
	DiffbotArticle,
	DiffbotBulkJob,
	DiffbotCrawlJob,
	DiffbotCustomApi,
	DiffbotDiscussion,
	DiffbotEvent,
	DiffbotImage,
	DiffbotJob,
	DiffbotList,
	DiffbotOrganization,
	DiffbotPerson,
	DiffbotProduct,
	DiffbotVideo,
} from './database';

export const DiffbotSchema = {
	version: '1.0.0',
	entities: {
		articles: DiffbotArticle,
		products: DiffbotProduct,
		discussions: DiffbotDiscussion,
		images: DiffbotImage,
		videos: DiffbotVideo,
		events: DiffbotEvent,
		jobs: DiffbotJob,
		lists: DiffbotList,
		organizations: DiffbotOrganization,
		people: DiffbotPerson,
		crawlJobs: DiffbotCrawlJob,
		bulkJobs: DiffbotBulkJob,
		customApis: DiffbotCustomApi,
		accounts: DiffbotAccount,
	},
} as const;

export * from './database';
