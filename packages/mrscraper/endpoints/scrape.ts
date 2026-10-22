import { logEventFromContext } from 'corsair/core';
import type { MrscraperEndpoints } from '..';
import { MRSCRAPER_API_BASE, makeMrscraperRequest } from '../client';
import type { MrscraperEndpointOutputs } from './types';
import {
	MrscraperEndpointInputSchemas,
	MrscraperEndpointOutputSchemas,
} from './types';

// Every operation below lives on the Scraper API base and requires the key both
// as the `x-api-token` header and a `token` query param.

// GET /?html=true — returns raw HTML as text/html, so the response is a string.
export const fetchPage: MrscraperEndpoints['scrapeFetch'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapeFetch.parse(input);
	const {
		url,
		html,
		super: isSuper,
		browserRendering,
		waitUntil,
		timeout,
		blockResources,
		waitForSelector,
		returnCookie,
		geoCode,
		proxyCountry,
	} = parsed;

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapeFetch']
	>('/', ctx.key, {
		method: 'GET',
		base: MRSCRAPER_API_BASE,
		includeTokenQuery: true,
		headers: { Accept: 'text/html' },
		query: {
			url,
			// `html=true` selects the HTML mode and is documented as required.
			html: html ?? true,
			super: isSuper,
			browserRendering,
			waitUntil,
			timeout,
			blockResources,
			waitForSelector,
			returnCookie,
			geoCode,
			proxyCountry,
		},
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapeFetch.parse(response);

	await logEventFromContext(ctx, 'mrscraper.scrape.fetch', {}, 'completed');

	return parsedResponse;
};

// POST /?markdown=true
export const markdown: MrscraperEndpoints['scrapeMarkdown'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapeMarkdown.parse(input);
	const {
		url,
		tokenCap,
		maxRetries,
		super: isSuper,
		browserRendering,
		waitUntil,
		timeout,
		screenshot,
		geoCode,
		proxyCountry,
		blockResources,
		waitForSelector,
		action,
		proxy,
		returnCookie,
		saveResult,
	} = parsed;

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapeMarkdown']
	>('/', ctx.key, {
		method: 'POST',
		base: MRSCRAPER_API_BASE,
		includeTokenQuery: true,
		body: { url, tokenCap, maxRetries },
		query: {
			// `markdown=true` selects the Markdown mode and is required.
			markdown: true,
			super: isSuper,
			browserRendering,
			waitUntil,
			timeout,
			screenshot,
			geoCode,
			proxyCountry,
			blockResources,
			waitForSelector,
			action,
			proxy,
			returnCookie,
			saveResult,
		},
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapeMarkdown.parse(response);

	await logEventFromContext(ctx, 'mrscraper.scrape.markdown', {}, 'completed');

	return parsedResponse;
};

// POST / — JSON extraction via the general agent.
export const json: MrscraperEndpoints['scrapeJson'] = async (ctx, input) => {
	const parsed = MrscraperEndpointInputSchemas.scrapeJson.parse(input);
	const {
		url,
		prompt,
		agent,
		tokenCap,
		maxRetries,
		html,
		browserRendering,
		waitUntil,
		timeout,
		screenshot,
		super: isSuper,
		geoCode,
		proxyCountry,
		saveResult,
	} = parsed;

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapeJson']
	>('/', ctx.key, {
		method: 'POST',
		base: MRSCRAPER_API_BASE,
		includeTokenQuery: true,
		body: {
			url,
			prompt,
			agent: agent ?? 'general',
			tokenCap,
			maxRetries,
		},
		query: {
			html,
			browserRendering,
			waitUntil,
			timeout,
			screenshot,
			super: isSuper,
			geoCode,
			proxyCountry,
			saveResult,
		},
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapeJson.parse(response);

	await logEventFromContext(ctx, 'mrscraper.scrape.json', {}, 'completed');

	return parsedResponse;
};

// POST /?screenshot=full
export const screenshot: MrscraperEndpoints['scrapeScreenshot'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapeScreenshot.parse(input);
	const {
		url,
		screenshot: screenshotMode,
		record,
		browserRendering,
		waitUntil,
		timeout,
		html,
		markdown: wantMarkdown,
		super: isSuper,
		geoCode,
		proxyCountry,
		saveResult,
		blockResources,
		waitForSelector,
		action,
		proxy,
		returnCookie,
		tokenCap,
		maxRetries,
	} = parsed;

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapeScreenshot']
	>('/', ctx.key, {
		method: 'POST',
		base: MRSCRAPER_API_BASE,
		includeTokenQuery: true,
		body: { url, tokenCap, maxRetries },
		query: {
			// `screenshot` selects the mode and is documented as required.
			screenshot: screenshotMode ?? 'full',
			record,
			browserRendering,
			waitUntil,
			timeout,
			html,
			markdown: wantMarkdown,
			super: isSuper,
			geoCode,
			proxyCountry,
			saveResult,
			blockResources,
			waitForSelector,
			action,
			proxy,
			returnCookie,
		},
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapeScreenshot.parse(response);

	await logEventFromContext(
		ctx,
		'mrscraper.scrape.screenshot',
		{},
		'completed',
	);

	return parsedResponse;
};

// POST / — paginated listing extraction via the listing agent.
export const listing: MrscraperEndpoints['scrapeListing'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapeListing.parse(input);
	const {
		url,
		prompt,
		agent,
		maxPages,
		super: isSuper,
		browserRendering,
		waitUntil,
		timeout,
		screenshot: screenshotMode,
		geoCode,
		proxyCountry,
		saveResult,
		tokenCap,
		maxRetries,
	} = parsed;

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapeListing']
	>('/', ctx.key, {
		method: 'POST',
		base: MRSCRAPER_API_BASE,
		includeTokenQuery: true,
		body: {
			url,
			prompt,
			agent: agent ?? 'listing',
			maxPages,
			tokenCap,
			maxRetries,
		},
		query: {
			// `super=true` is documented as required for listing extraction.
			super: isSuper ?? true,
			browserRendering,
			waitUntil,
			timeout,
			screenshot: screenshotMode,
			geoCode,
			proxyCountry,
			saveResult,
		},
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapeListing.parse(response);

	await logEventFromContext(ctx, 'mrscraper.scrape.listing', {}, 'completed');

	return parsedResponse;
};

// POST / — sitemap discovery via the map agent.
export const sitemap: MrscraperEndpoints['scrapeSitemap'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapeSitemap.parse(input);
	const {
		url,
		agent,
		maxDepth,
		maxPages,
		limit,
		includePatterns,
		excludePatterns,
		browserRendering,
		waitUntil,
		timeout,
		screenshot: screenshotMode,
		super: isSuper,
		geoCode,
		proxyCountry,
		saveResult,
		tokenCap,
		maxRetries,
	} = parsed;

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapeSitemap']
	>('/', ctx.key, {
		method: 'POST',
		base: MRSCRAPER_API_BASE,
		includeTokenQuery: true,
		body: {
			url,
			agent: agent ?? 'map',
			maxDepth,
			maxPages,
			limit,
			includePatterns,
			excludePatterns,
			tokenCap,
			maxRetries,
		},
		query: {
			browserRendering,
			waitUntil,
			timeout,
			screenshot: screenshotMode,
			super: isSuper,
			geoCode,
			proxyCountry,
			saveResult,
		},
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapeSitemap.parse(response);

	await logEventFromContext(ctx, 'mrscraper.scrape.sitemap', {}, 'completed');

	return parsedResponse;
};
