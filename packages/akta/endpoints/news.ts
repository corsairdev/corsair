import { logEventFromContext } from 'corsair/core';
import type { AktaEndpoints } from '..';
import { csv, makeAktaRequest } from '../client';
import { AktaEndpointInputSchemas, AktaEndpointOutputSchemas } from './types';

export const list: AktaEndpoints['newsList'] = async (ctx, input) => {
	const parsed = AktaEndpointInputSchemas.newsList.parse(input);

	// 204 (no match) has no body.
	const raw = await makeAktaRequest<unknown>('v1/news/', ctx.key, {
		company: parsed.company,
		primary_company: parsed.primary_company,
		industry: csv(parsed.industry),
		query: parsed.query,
		title: parsed.title,
		start_date: parsed.start_date,
		end_date: parsed.end_date,
		limit: parsed.limit,
		offset: parsed.offset,
		group_articles: parsed.group_articles,
		news_score_list: parsed.news_score_list,
		countries: csv(parsed.countries),
		blacklisted: csv(parsed.blacklisted),
		type_list: csv(parsed.type_list),
		sentiment_list: csv(parsed.sentiment_list),
		entity_person_list: csv(parsed.entity_person_list),
		entity_location_list: csv(parsed.entity_location_list),
		entity_product_list: csv(parsed.entity_product_list),
		entity_event_list: csv(parsed.entity_event_list),
		naics_code_list: csv(parsed.naics_code_list),
		sic_code_list: csv(parsed.sic_code_list),
		iptc_code_list: csv(parsed.iptc_code_list),
		iab_code_list: csv(parsed.iab_code_list),
	});
	const result = AktaEndpointOutputSchemas.newsList.parse(
		raw ?? {
			data: [],
			total: 0,
			count: 0,
			limit: parsed.limit ?? 10,
			offset: parsed.offset ?? 0,
			credits_consumed: 0,
		},
	);

	if (ctx.db.newsArticles) {
		try {
			for (const article of result.data) {
				await ctx.db.newsArticles.upsertByEntityId(String(article.id), {
					id: String(article.id),
					title: article.title,
					url: article.url,
					publisher: article.publisher,
					publishedDate: article.published_date,
					sentiment: article.sentiment,
					aiSummary: article.ai_summary,
					companyUuids: (article.company_mentions ?? []).flatMap((mention) =>
						mention.uuid ? [mention.uuid] : [],
					),
				});
			}
		} catch (error) {
			console.warn('Failed to save Akta news articles to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'akta.news.list',
		{
			resultCount: result.data.length,
			total: result.total,
			offset: result.offset,
			creditsConsumed: result.credits_consumed,
		},
		'completed',
	);
	return result;
};
