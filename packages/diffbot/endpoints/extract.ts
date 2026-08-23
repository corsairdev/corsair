import { logEventFromContext } from 'corsair/core';
import type { DiffbotEndpoints } from '..';
import { makeDiffbotRequest } from '../client';
import type { DiffbotEndpointOutputs } from './types';

/**
 * Extract article content and metadata from any URL.
 * Docs: https://docs.diffbot.com/reference/extract-article
 */
export const article: DiffbotEndpoints['extractArticle'] = async (
	ctx,
	input,
) => {
	const { url, fields, timeout, paging, maxTags, naturalLanguage } = input;

	const response = await makeDiffbotRequest<
		DiffbotEndpointOutputs['extractArticle']
	>('article', ctx.key, {
		method: 'GET',
		query: {
			url,
			fields,
			timeout,
			paging,
			maxTags,
			naturalLanguage,
		},
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.article',
		{ url },
		'completed',
	);
	return response;
};

/**
 * Extract product data (price, availability, images, etc.) from any URL.
 * Docs: https://docs.diffbot.com/reference/extract-product
 */
export const product: DiffbotEndpoints['extractProduct'] = async (
	ctx,
	input,
) => {
	const { url, fields, timeout } = input;

	const response = await makeDiffbotRequest<
		DiffbotEndpointOutputs['extractProduct']
	>('product', ctx.key, {
		method: 'GET',
		query: { url, fields, timeout },
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.product',
		{ url },
		'completed',
	);
	return response;
};

/**
 * Automatically detect the page type and extract its structured data.
 * Docs: https://docs.diffbot.com/reference/extract-analyze
 */
export const analyze: DiffbotEndpoints['extractAnalyze'] = async (
	ctx,
	input,
) => {
	const { url, fields, timeout, fallback, discussion } = input;

	const response = await makeDiffbotRequest<
		DiffbotEndpointOutputs['extractAnalyze']
	>('analyze', ctx.key, {
		method: 'GET',
		query: { url, fields, timeout, fallback, discussion },
	});

	await logEventFromContext(
		ctx,
		'diffbot.extract.analyze',
		{ url },
		'completed',
	);
	return response;
};
