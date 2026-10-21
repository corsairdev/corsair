import { logEventFromContext } from 'corsair/core';
import type { BrowserUseContext, BrowserUseEndpoints } from '..';
import { requestBrowserUse } from '../client';
import type { BrowserUseBrowser } from '../schema';
import {
	BrowsersCreateOutputSchema,
	BrowsersGetOutputSchema,
	BrowsersListOutputSchema,
	BrowsersStopOutputSchema,
} from './types';

async function saveBrowser(ctx: BrowserUseContext, browser: BrowserUseBrowser) {
	if (!ctx.db.browsers) return;
	try {
		await ctx.db.browsers.upsertByEntityId(browser.id, browser);
	} catch (error) {
		console.warn('Failed to save Browser Use browser to database:', error);
	}
}

export const browsersCreate: BrowserUseEndpoints['browsersCreate'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserUse('/browsers', ctx.key, {
		method: 'POST',
		body: input,
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
	const raw = await requestBrowserUse(
		`/browsers/${encodeURIComponent(input.id)}`,
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
	const raw = await requestBrowserUse('/browsers', ctx.key, { query: input });
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
	const raw = await requestBrowserUse(
		`/browsers/${encodeURIComponent(input.id)}`,
		ctx.key,
		{ method: 'PATCH', body: { action: 'stop' } },
	);
	const browser = BrowsersStopOutputSchema.parse(raw);
	await saveBrowser(ctx, browser);
	await logEventFromContext(ctx, 'browseruse.browsers.stop', {}, 'completed');
	return browser;
};
