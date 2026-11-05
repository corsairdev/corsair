import { credits, usageTimeline, validateApiKey } from './account';
import {
	history as agenticScraperHistory,
	getLiveSessionUrl,
} from './agentic-scraper';
import { getSuggestions, save } from './endpoint';
import { submit, submitProduct } from './feedback';
import {
	history as markdownifyHistory,
	start as markdownifyStart,
	status as markdownifyStatus,
} from './markdownify';
import { list } from './scheduled-jobs';
import { generate } from './schema-generator';
import { history as scrapeHistory } from './scrape';
import {
	history as searchScraperHistory,
	start as searchScraperStart,
	status as searchScraperStatus,
} from './search-scraper';
import { history as sitemapHistory } from './sitemap';
import {
	history as smartCrawlerHistory,
	start as smartCrawlerStart,
	status as smartCrawlerStatus,
	webhookLogs,
} from './smart-crawler';
import {
	history as smartScraperHistory,
	start as smartScraperStart,
	status as smartScraperStatus,
} from './smart-scraper';
import { toonify } from './utilities';

export const SearchScraper = {
	start: searchScraperStart,
	status: searchScraperStatus,
	history: searchScraperHistory,
};

export const SmartScraper = {
	start: smartScraperStart,
	status: smartScraperStatus,
	history: smartScraperHistory,
};

export const Markdownify = {
	start: markdownifyStart,
	status: markdownifyStatus,
	history: markdownifyHistory,
};

export const SmartCrawler = {
	start: smartCrawlerStart,
	status: smartCrawlerStatus,
	history: smartCrawlerHistory,
	webhookLogs,
};

export const AgenticScraper = {
	history: agenticScraperHistory,
	getLiveSessionUrl,
};

export const Scrape = {
	history: scrapeHistory,
};

export const Sitemap = {
	history: sitemapHistory,
};

export const SchemaGenerator = {
	generate,
};

export const Endpoint = {
	getSuggestions,
	save,
};

export const Account = {
	credits,
	validateApiKey,
	usageTimeline,
};

export const Feedback = {
	submit,
	submitProduct,
};

export const ScheduledJobs = {
	list,
};

export const Utilities = {
	toonify,
};

export * from './types';
