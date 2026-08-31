import { logEventFromContext } from 'corsair/core';
import { makeWorldNewsApiRequest, validatePublicUrl } from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import { ExtractNewsOutputSchema } from './types';

export const extractNews: WorldNewsApiEndpoints['newsExtractNews'] = async (
	ctx,
	input,
) => {
	// Validate URL against SSRF before making outbound request
	validatePublicUrl(input.url);

	const query: Record<string, string | number | boolean | undefined> = {
		url: input.url,
		analyze: input.analyze,
	};

	const response = await makeWorldNewsApiRequest(
		'extract-news',
		ctx.key,
		{
			method: 'GET',
			query,
		},
		ExtractNewsOutputSchema,
	);

	try {
		await ctx.db.extractedArticles.upsertByEntityId(input.url, {
			url: input.url,
			title: response.title,
			text: response.text,
			publish_date: response.publish_date,
			author: response.author,
			authors: response.authors,
			language: response.language,
			source_country: response.source_country,
			sentiment: response.sentiment,
			extractedAt: new Date(),
		});
	} catch (error) {
		// Ignore DB cache errors
	}

	await logEventFromContext(
		ctx,
		'worldnewsapi.news.extractNews',
		{ url: input.url, title: response.title },
		'completed',
	);

	return response;
};
