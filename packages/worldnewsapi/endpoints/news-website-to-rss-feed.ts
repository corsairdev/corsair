import { logEventFromContext } from 'corsair/core';
import {
	makeWorldNewsApiRequest,
	parseRssFeedXml,
	validatePublicUrl,
} from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import { NewsWebsiteToRssFeedOutputSchema } from './types';

export const newsWebsiteToRssFeed: WorldNewsApiEndpoints['newsNewsWebsiteToRssFeed'] =
	async (ctx, input) => {
		validatePublicUrl(input.url);

		const query: Record<string, string | number | boolean | undefined> = {
			url: input.url,
			'extract-news': input.extractNews,
		};

		// The feed.rss endpoint returns an XML string (or raw object)
		const rawResponse = await makeWorldNewsApiRequest<
			string | Record<string, unknown>
		>('feed.rss', ctx.key, {
			method: 'GET',
			query,
		});

		let unvalidated: unknown;

		if (typeof rawResponse === 'string') {
			const parsed = parseRssFeedXml(rawResponse);
			unvalidated = {
				title: parsed.title,
				link: parsed.link,
				description: parsed.description,
				pubDate: parsed.pubDate,
				lastBuildDate: parsed.lastBuildDate,
				language: parsed.language,
				items: parsed.items,
				rawXml: parsed.rawXml,
			};
		} else if (rawResponse && typeof rawResponse === 'object') {
			unvalidated = {
				title:
					typeof rawResponse.title === 'string' ? rawResponse.title : undefined,
				link:
					typeof rawResponse.link === 'string' ? rawResponse.link : undefined,
				description:
					typeof rawResponse.description === 'string'
						? rawResponse.description
						: undefined,
				pubDate:
					typeof rawResponse.pubDate === 'string'
						? rawResponse.pubDate
						: undefined,
				lastBuildDate:
					typeof rawResponse.lastBuildDate === 'string'
						? rawResponse.lastBuildDate
						: undefined,
				language:
					typeof rawResponse.language === 'string'
						? rawResponse.language
						: undefined,
				items: Array.isArray(rawResponse.items) ? rawResponse.items : [],
				rawXml:
					typeof rawResponse.rawXml === 'string'
						? rawResponse.rawXml
						: undefined,
			};
		} else {
			unvalidated = {
				items: [],
			};
		}

		const response = NewsWebsiteToRssFeedOutputSchema.parse(unvalidated);

		await logEventFromContext(
			ctx,
			'worldnewsapi.news.newsWebsiteToRssFeed',
			{ url: input.url, itemsCount: response.items.length },
			'completed',
		);

		return response;
	};
