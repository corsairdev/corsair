import { logEventFromContext } from 'corsair/core';
import { requestBrowserUse } from '../client';
import type { BrowserUseSaveContext } from './save';
import { browserUseLogContext, saveBrowser } from './save';
import type { BrowserUseEndpointInputs } from './types';
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

export async function browsersCreate(
	ctx: BrowserUseSaveContext,
	input: BrowserUseEndpointInputs['browsersCreate'],
) {
	const body = BrowsersCreateInputSchema.parse(input);
	const raw = await requestBrowserUse('/browsers', ctx.key, {
		method: 'POST',
		body,
	});
	const browser = BrowsersCreateOutputSchema.parse(raw);
	await saveBrowser(ctx, browser);
	await logEventFromContext(
		browserUseLogContext(ctx),
		'browseruse.browsers.create',
		{},
		'completed',
	);
	return browser;
}

export async function browsersGet(
	ctx: BrowserUseSaveContext,
	input: BrowserUseEndpointInputs['browsersGet'],
) {
	const validated = BrowsersGetInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/browsers/${encodeURIComponent(validated.id)}`,
		ctx.key,
	);
	const browser = BrowsersGetOutputSchema.parse(raw);
	await saveBrowser(ctx, browser);
	await logEventFromContext(
		browserUseLogContext(ctx),
		'browseruse.browsers.get',
		{},
		'completed',
	);
	return browser;
}

export async function browsersList(
	ctx: BrowserUseSaveContext,
	input: BrowserUseEndpointInputs['browsersList'],
) {
	const query = BrowsersListInputSchema.parse(input);
	const raw = await requestBrowserUse('/browsers', ctx.key, { query });
	const page = BrowsersListOutputSchema.parse(raw);
	for (const browser of page.items) await saveBrowser(ctx, browser);
	await logEventFromContext(
		browserUseLogContext(ctx),
		'browseruse.browsers.list',
		{},
		'completed',
	);
	return page;
}

/** Closing a CDP connection does not stop the browser; this does, and refunds unused time. */
export async function browsersStop(
	ctx: BrowserUseSaveContext,
	input: BrowserUseEndpointInputs['browsersStop'],
) {
	const validated = BrowsersStopInputSchema.parse(input);
	const raw = await requestBrowserUse(
		`/browsers/${encodeURIComponent(validated.id)}`,
		ctx.key,
		{ method: 'PATCH', body: { action: 'stop' } },
	);
	const browser = BrowsersStopOutputSchema.parse(raw);
	await saveBrowser(ctx, browser);
	await logEventFromContext(
		browserUseLogContext(ctx),
		'browseruse.browsers.stop',
		{},
		'completed',
	);
	return browser;
}
