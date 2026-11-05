import type { ContextDevEndpoints } from '..';
import { call } from './call';

export const scrape: ContextDevEndpoints['webScrape'] = (ctx, input) =>
	call(ctx, 'webScrape', 'web.scrape', 'POST', 'web/scrape', input);

export const urls: ContextDevEndpoints['webUrls'] = (ctx, input) =>
	call(ctx, 'webUrls', 'web.urls', 'GET', 'web/urls', input);

export const crawl: ContextDevEndpoints['webCrawl'] = (ctx, input) =>
	call(ctx, 'webCrawl', 'web.crawl', 'POST', 'web/crawl', input);

export const extract: ContextDevEndpoints['webExtract'] = (ctx, input) =>
	call(ctx, 'webExtract', 'web.extract', 'POST', 'web/extract', input);

export const search: ContextDevEndpoints['webSearch'] = (ctx, input) =>
	call(ctx, 'webSearch', 'web.search', 'POST', 'web/search', input);

export const answers: ContextDevEndpoints['webAnswers'] = (ctx, input) =>
	call(ctx, 'webAnswers', 'web.answers', 'POST', 'web/answers', input);
