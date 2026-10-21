import { logEventFromContext } from 'corsair/core';
import type { BrowserUseEndpoints } from '..';
import { requestBrowserUse } from '../client';
import { saveBrowser } from './save';
import {
	BrowsersCreateInputSchema,
	BrowsersCreateOutputSchema,
	BrowsersGetInputSchema,
	BrowsersGetOutputSchema,
	BrowsersListInputSchema,
	BrowsersListOutputSchema,
	BrowsersStopInputSchema,
	BrowsersStopOutputSchema,
} from './types';

export const browsersCreate: BrowserUseEndpoints['browsersCreate'] = async (
	ctx,
	input,
) => {
	const body = BrowsersCreateInputSchema.parse(input);
	const raw = await requestBrowserUse('/browsers', ctx.key, {
		method: 'POST',
		body,
	});
	const browser = BrowsersCreateOutputSchema.parse(raw);
	await saveBrowser(ctx, browser);
	await logEventFromContext(ctx, 'browseruse.browsers.create', {}, 'completed');
	return browser;
};

export const browsersGet: BrowserUseEndpoints['browsersGet'] = async (
	ctx,
	input,
) => {
	const validated = BrowsersGetInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/browsers/${encodeURIComponent(validated.id)}`,
		ctx.key,
	);
	const browser = BrowsersGetOutputSchema.parse(raw);
	await saveBrowser(ctx, browser);
	await logEventFromContext(ctx, 'browseruse.browsers.get', {}, 'completed');
	return browser;
};

export const browsersList: BrowserUseEndpoints['browsersList'] = async (
	ctx,
	input,
) => {
	const query = BrowsersListInputSchema.parse(input);
	const raw = await requestBrowserUse('/browsers', ctx.key, { query });
	const page = BrowsersListOutputSchema.parse(raw);
	for (const browser of page.items) await saveBrowser(ctx, browser);
	await logEventFromContext(ctx, 'browseruse.browsers.list', {}, 'completed');
	return page;
};

/** Closing a CDP connection does not stop the browser; this does, and refunds unused time. */
export const browsersStop: BrowserUseEndpoints['browsersStop'] = async (
	ctx,
	input,
) => {
	const validated = BrowsersStopInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/browsers/${encodeURIComponent(validated.id)}`,
		ctx.key,
		{ method: 'PATCH', body: { action: 'stop' } },
	);
	const browser = BrowsersStopOutputSchema.parse(raw);
	await saveBrowser(ctx, browser);
	await logEventFromContext(ctx, 'browseruse.browsers.stop', {}, 'completed');
	return browser;
};
