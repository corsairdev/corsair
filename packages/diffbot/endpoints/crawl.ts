import { logEventFromContext } from 'corsair/core';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpoints } from '../index';

export const startCrawl: DiffbotEndpoints['startCrawl'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['startCrawl']>>
	>('crawl', ctx.key, {
		method: 'POST',
		query: {
			name: input.name,
			seeds: input.seeds,
			apiUrl: input.apiUrl,
			maxHops: input.maxHops,
			maxRounds: input.maxRounds,
			maxTags: input.maxTags,
			crawlSubdomains: input.crawlSubdomains,
			notifyEmail: input.notifyEmail,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.crawl.startCrawl',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const manageCrawl: DiffbotEndpoints['manageCrawl'] = async (
	ctx,
	input,
) => {
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['manageCrawl']>>
	>('crawl', ctx.key, {
		method: 'GET',
		query: {
			name: input.name,
			pause: input.pause,
			restart: input.restart,
			delete: input.delete,
			roundProxy: input.roundProxy,
			maxRounds: input.maxRounds,
			maxHops: input.maxHops,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.crawl.manageCrawl',
		{ name: input.name },
		'completed',
	);
	return response;
};

export const getCrawlData: DiffbotEndpoints['getCrawlData'] = async (
	ctx,
	input,
) => {
	const format = input.format ?? 'json';
	const response = await makeDiffbotRequest<
		Awaited<ReturnType<DiffbotEndpoints['getCrawlData']>>
	>(
		`crawl/download/${encodeURIComponent(ctx.key)}-${encodeURIComponent(input.name)}.${format}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'diffbot.crawl.getCrawlData',
		{ name: input.name, format },
		'completed',
	);
	return response;
};
