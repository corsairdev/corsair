import { logEventFromContext } from 'corsair/core';
import {
	makeWorldNewsApiRequest,
	parseRssFeedXml,
	validatePublicUrl,
} from '../client';
import type { WorldNewsApiEndpoints } from '../index';
import type { WorldNewsApiEndpointOutputs } from './types';

export const newsWebsiteToRssFeed: WorldNewsApiEndpoints['newsNewsWebsiteToRssFeed'] =
	async (ctx, input) => {
		validatePublicUrl(input.url);

		const query: Record<string, string | number | boolean | undefined> = {
			url: input.url,
			'extract-news': input.extractNews,
		};

		// The feed.rss endpoint returns an XML string (or object if already parsed)
		const rawResponse = await makeWorldNewsApiRequest<
			string | WorldNewsApiEndpointOutputs['news.newsWebsiteToRssFeed']
		>('feed.rss', ctx.key, {
			method: 'GET',
			query,
		});

		let response: WorldNewsApiEndpointOutputs['news.newsWebsiteToRssFeed'];

		if (typeof rawResponse === 'string') {
			const parsed = parseRssFeedXml(rawResponse);
			response = {
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
			response = {
				title: rawResponse.title,
				link: rawResponse.link,
				description: rawResponse.description,
				pubDate: rawResponse.pubDate,
				lastBuildDate: rawResponse.lastBuildDate,
				language: rawResponse.language,
				items: rawResponse.items ?? [],
				rawXml: rawResponse.rawXml,
			};
		} else {
			response = {
				items: [],
			};
		}

		await logEventFromContext(
			ctx,
			'worldnewsapi.news.newsWebsiteToRssFeed',
			{ url: input.url, itemsCount: response.items.length },
			'completed',
		);

		return response;
	};
