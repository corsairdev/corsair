import { logEventFromContext } from 'corsair/core';
import { makeWorldNewsApiRequest, validatePublicUrl } from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import { ExtractNewsLinksOutputSchema } from './types';

export const extractNewsLinks: WorldNewsApiEndpoints['newsExtractNewsLinks'] =
	async (ctx, input) => {
		validatePublicUrl(input.url);

		const query: Record<string, string | number | boolean | undefined> = {
			url: input.url,
			prefix: input.prefix,
			'sub-domain': input.subDomain,
		};

		const response = await makeWorldNewsApiRequest(
			'extract-news-links',
			ctx.key,
			{
				method: 'GET',
				query,
			},
			ExtractNewsLinksOutputSchema,
		);

		await logEventFromContext(
			ctx,
			'worldnewsapi.news.extractNewsLinks',
			{ url: input.url, linksCount: response.news_links?.length ?? 0 },
			'completed',
		);

		return response;
	};
