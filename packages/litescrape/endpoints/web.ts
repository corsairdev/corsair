import { logEventFromContext } from 'corsair/core';
import type { LitescrapeEndpoints } from '..';
import { makeLitescrapeRequest } from '../client';
import type { WebFetchResponse, WebScreenshotResponse } from './types';
import {
	LitescrapeEndpointInputSchemas,
	LitescrapeEndpointOutputSchemas,
} from './types';

// Web operations (both Alpha), documented at
// https://litescrape.com/docs/web-fetch and
// https://litescrape.com/docs/web-screenshot.

export const fetch: LitescrapeEndpoints['webFetch'] = async (ctx, input) => {
	const parsedInput = LitescrapeEndpointInputSchemas.webFetch.parse(input);

	const response = await makeLitescrapeRequest<WebFetchResponse>(
		'/api/web/fetch',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.webFetch.parse(response);

	// Never log the fetched URL or its content: both are user data. Record
	// only the size of the returned document.
	await logEventFromContext(
		ctx,
		'litescrape.web.fetch',
		{ contentLength: parsed.content?.length ?? 0 },
		'completed',
	);

	return parsed;
};

export const screenshot: LitescrapeEndpoints['webScreenshot'] = async (
	ctx,
	input,
) => {
	const parsedInput = LitescrapeEndpointInputSchemas.webScreenshot.parse(input);

	const response = await makeLitescrapeRequest<WebScreenshotResponse>(
		'/api/web/screenshot',
		ctx.key,
		{ method: 'GET', query: { ...parsedInput } },
	);

	const parsed = LitescrapeEndpointOutputSchemas.webScreenshot.parse(response);

	// Never log the captured URL or the screenshot download URL. Record only
	// whether a screenshot was produced.
	await logEventFromContext(
		ctx,
		'litescrape.web.screenshot',
		{ hasScreenshot: Boolean(parsed.screenshot_url) },
		'completed',
	);

	return parsed;
};
