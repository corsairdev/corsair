import { health, usage } from './account';
import { crawl, crawlBatch, extract, screenshot, sitemap } from './content';
import {
	start as deepcrawlStart,
	status as deepcrawlStatus,
} from './deepcrawl';
import {
	ask,
	feedback,
	news,
	newsBatch,
	search,
	searchBatch,
	trending,
} from './web';

export const Web = {
	search,
	searchBatch,
	news,
	newsBatch,
	ask,
	trending,
	feedback,
};

export const Content = {
	crawl,
	crawlBatch,
	screenshot,
	sitemap,
	extract,
};

export const Deepcrawl = {
	start: deepcrawlStart,
	status: deepcrawlStatus,
};

export const Account = {
	usage,
	health,
};

export * from './types';
