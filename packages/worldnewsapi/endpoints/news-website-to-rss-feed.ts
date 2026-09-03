import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import {
	makeWorldNewsApiRequest,
	parseRssFeedXml,
	publicUrlKey,
	validatePublicUrl,
} from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import { NewsWebsiteToRssFeedOutputSchema } from './types';

export const newsWebsiteToRssFeed: WorldNewsApiEndpoints['newsNewsWebsiteToRssFeed'] =
	async (ctx, input) => {
		validatePublicUrl(input.url);
		const cacheKey = publicUrlKey(input.url);

		const query: Record<string, string | number | boolean | undefined> = {
			url: input.url,
			'extract-news': input.extractNews,
		};

		const xml = await makeWorldNewsApiRequest(
			'feed.rss',
			ctx.key,
			{
				method: 'GET',
				query,
			},
			z.string(),
		);

		const parsed = parseRssFeedXml(xml);
		const response = NewsWebsiteToRssFeedOutputSchema.parse({
			title: parsed.title,
			link: parsed.link,
			description: parsed.description,
			pubDate: parsed.pubDate,
			lastBuildDate: parsed.lastBuildDate,
			language: parsed.language,
			items: parsed.items,
			rawXml: parsed.rawXml,
		});

		await logEventFromContext(
			ctx,
			'worldnewsapi.news.newsWebsiteToRssFeed',
			{ url: cacheKey, itemsCount: response.items.length },
			'completed',
		);

		return response;
	};
