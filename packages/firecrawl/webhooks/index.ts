import * as AgentWebhooks from './agent';
import * as BatchScrapeWebhooks from './batch-scrape';
import * as CrawlWebhooks from './crawl';
import * as ExtractWebhooks from './extract';

export const Crawl = {
	started: CrawlWebhooks.started,
	page: CrawlWebhooks.page,
	completed: CrawlWebhooks.completed,
};

export const BatchScrape = {
	started: BatchScrapeWebhooks.started,
	page: BatchScrapeWebhooks.page,
	completed: BatchScrapeWebhooks.completed,
};

export const Extract = {
	started: ExtractWebhooks.started,
	completed: ExtractWebhooks.completed,
	failed: ExtractWebhooks.failed,
};

export const Agent = {
	started: AgentWebhooks.started,
	action: AgentWebhooks.action,
	completed: AgentWebhooks.completed,
	failed: AgentWebhooks.failed,
	cancelled: AgentWebhooks.cancelled,
};

export * from './types';
