import { logEventFromContext } from 'corsair/core';
import {
	makeWorldNewsApiRequest,
	publicUrlKey,
	validatePublicUrl,
} from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import { ExtractNewsOutputSchema } from './types';

export const extractNews: WorldNewsApiEndpoints['newsExtractNews'] = async (
	ctx,
	input,
) => {
	validatePublicUrl(input.url);
	const cacheKey = publicUrlKey(input.url);

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
		await ctx.db.extractedArticles.upsertByEntityId(cacheKey, {
			url: cacheKey,
			title: response.title,
			text: response.text,
			image: response.image,
			video: response.video,
			publish_date: response.publish_date,
			author: response.author,
			authors: response.authors,
			language: response.language,
			source_country: response.source_country,
			sentiment: response.sentiment,
			extractedAt: new Date(),
		});
	} catch {
		// Ignore DB cache errors
	}

	await logEventFromContext(
		ctx,
		'worldnewsapi.news.extractNews',
		{ url: cacheKey, title: response.title },
		'completed',
	);

	return response;
};
