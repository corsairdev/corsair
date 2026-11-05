import { logEventFromContext } from 'corsair/core';
import type { BrowserlessEndpoints } from '..';
import type { BrowserlessLaunchQuery } from '../client';
import {
	requestBrowserlessFile,
	requestBrowserlessFunction,
	requestBrowserlessJson,
	requestBrowserlessText,
} from '../client';
import {
	BrowserlessFile,
	BrowserlessHtml,
	BrowserlessScrapeResult,
	BrowserlessUnblockResult,
} from '../schema';
import { FunctionRunOutputSchema } from './types';

function launchQuery(input: BrowserlessLaunchQuery): BrowserlessLaunchQuery {
	return {
		stealth: input.stealth,
		timeout: input.timeout,
		proxy: input.proxy,
		blockAds: input.blockAds,
	};
}

function dropLaunch<T extends BrowserlessLaunchQuery>(
	input: T,
): Omit<T, keyof BrowserlessLaunchQuery> {
	const { stealth: _s, timeout: _t, proxy: _p, blockAds: _b, ...body } = input;
	return body;
}

export const contentGet: BrowserlessEndpoints['contentGet'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserlessText('/content', ctx.key, {
		body: dropLaunch(input),
		query: launchQuery(input),
	});
	const response = BrowserlessHtml.parse(raw);
	await logEventFromContext(ctx, 'browserless.content.get', {}, 'completed');
	return response;
};

export const screenshotCreate: BrowserlessEndpoints['screenshotCreate'] =
	async (ctx, input) => {
		const raw = await requestBrowserlessFile('/screenshot', ctx.key, {
			body: dropLaunch(input),
			query: launchQuery(input),
		});
		const response = BrowserlessFile.parse(raw);
		await logEventFromContext(
			ctx,
			'browserless.screenshot.create',
			{},
			'completed',
		);
		return response;
	};

export const pdfCreate: BrowserlessEndpoints['pdfCreate'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserlessFile('/pdf', ctx.key, {
		body: dropLaunch(input),
		query: launchQuery(input),
	});
	const response = BrowserlessFile.parse(raw);
	await logEventFromContext(ctx, 'browserless.pdf.create', {}, 'completed');
	return response;
};

export const scrapeCreate: BrowserlessEndpoints['scrapeCreate'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserlessJson('/scrape', ctx.key, {
		body: dropLaunch(input),
		query: launchQuery(input),
	});
	const response = BrowserlessScrapeResult.parse(raw);
	await logEventFromContext(ctx, 'browserless.scrape.create', {}, 'completed');
	return response;
};

export const functionRun: BrowserlessEndpoints['functionRun'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserlessFunction(ctx.key, {
		code: input.code,
		context: input.context,
		query: launchQuery(input),
	});
	const response = FunctionRunOutputSchema.parse(
		raw.kind === 'json'
			? { contentType: raw.contentType, data: raw.data }
			: {
					contentType: raw.contentType,
					base64: raw.base64,
					filename: raw.filename,
				},
	);
	await logEventFromContext(ctx, 'browserless.function.run', {}, 'completed');
	return response;
};

export const unblockCreate: BrowserlessEndpoints['unblockCreate'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserlessJson('/unblock', ctx.key, {
		body: dropLaunch(input),
		query: launchQuery(input),
	});
	const response = BrowserlessUnblockResult.parse(raw);
	await logEventFromContext(ctx, 'browserless.unblock.create', {}, 'completed');
	return response;
};

export const downloadCreate: BrowserlessEndpoints['downloadCreate'] = async (
	ctx,
	input,
) => {
	const raw = await requestBrowserlessFile('/download', ctx.key, {
		code: input.context ? undefined : input.code,
		body: input.context
			? { code: input.code, context: input.context }
			: undefined,
		query: launchQuery(input),
	});
	const response = BrowserlessFile.parse(raw);
	await logEventFromContext(
		ctx,
		'browserless.download.create',
		{},
		'completed',
	);
	return response;
};
