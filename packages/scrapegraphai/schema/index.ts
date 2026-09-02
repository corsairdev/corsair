import {
	ScrapegraphAiCrawl,
	ScrapegraphAiCredits,
	ScrapegraphAiGeneratedSchema,
	ScrapegraphAiJob,
	ScrapegraphAiMarkdownify,
	ScrapegraphAiScheduledJob,
	ScrapegraphAiSearchScraper,
	ScrapegraphAiSmartScraper,
} from './database';

export const ScrapegraphAiSchema = {
	version: '1.0.0',
	entities: {
		credits: ScrapegraphAiCredits,
		smartScrapers: ScrapegraphAiSmartScraper,
		searchScrapers: ScrapegraphAiSearchScraper,
		markdownifies: ScrapegraphAiMarkdownify,
		crawls: ScrapegraphAiCrawl,
		generatedSchemas: ScrapegraphAiGeneratedSchema,
		scheduledJobs: ScrapegraphAiScheduledJob,
		jobs: ScrapegraphAiJob,
	},
} as const;

export {
	ScrapegraphAiCrawl,
	ScrapegraphAiCredits,
	ScrapegraphAiGeneratedSchema,
	ScrapegraphAiJob,
	ScrapegraphAiJobKind,
	ScrapegraphAiMarkdownify,
	ScrapegraphAiScheduledJob,
	ScrapegraphAiSearchScraper,
	ScrapegraphAiSmartScraper,
} from './database';
