import { logEventFromContext } from 'corsair/core';
import type { FirecrawlEndpoints } from '..';
import { makeFirecrawlRequest } from '../client';
import type { FirecrawlEndpointOutputs } from './types';

export const start: FirecrawlEndpoints['crawlStart'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['crawlStart']
	>('v2/crawl', ctx.key, {
		method: 'POST',
		body: input as Record<string, unknown>,
	});

	await logEventFromContext(
		ctx,
		'firecrawl.crawl.start',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: FirecrawlEndpoints['crawlGet'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['crawlGet']
	>(`v2/crawl/${input.id}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'firecrawl.crawl.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const cancel: FirecrawlEndpoints['crawlCancel'] = async (ctx, input) => {
	const response = await makeFirecrawlRequest<
		FirecrawlEndpointOutputs['crawlCancel']
	>(`v2/crawl/${input.id}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'firecrawl.crawl.cancel',
		{ ...input },
		'completed',
	);
	return response;
};
