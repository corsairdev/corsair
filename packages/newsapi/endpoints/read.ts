import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { asRecord, newsGet } from '../client';
import type { NewsApiContext } from '../context';
import { NewsApiArticleEntity, NewsApiSourceEntity } from '../schema/database';
import type {
	ArticleListResponse,
	EverythingInput,
	HeadlinesInput,
	LegacyInput,
	SourceListResponse,
	SourcesInput,
} from './types';
import {
	ArticleListResponseSchema,
	EverythingInputSchema,
	HeadlinesInputSchema,
	LegacyInputSchema,
	SourceListResponseSchema,
	SourcesInputSchema,
} from './types';

// unknown: a raw JSON field; this narrows it to a non-empty string.
function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: the raw response body; only a finite number is kept.
function totalOf(body: unknown): number | undefined {
	const total = asRecord(body)?.totalResults;
	return typeof total === 'number' && Number.isFinite(total)
		? total
		: undefined;
}

async function keyOf(ctx: NewsApiContext): Promise<string> {
	if (!ctx.key) throw new AuthMissingError('newsapi', 'api_key');
	return ctx.key;
}

function articlesFrom(
	// unknown: the raw response body; articles are read field by field.
	body: unknown,
	sourceId?: string,
): NewsApiArticleEntity[] {
	const row = asRecord(body);
	if (row?.status && row.status !== 'ok') {
		throw new Error('NewsAPI response status was not ok');
	}
	if (!Array.isArray(row?.articles)) {
		throw new Error('NewsAPI response had no articles array');
	}
	return row.articles.flatMap((item) => {
		const article = asRecord(item);
		const url = text(article?.url);
		if (!url) return [];
		const source = asRecord(article?.source);
		const parsed = NewsApiArticleEntity.safeParse({
			id: url,
			title: text(article?.title),
			description: text(article?.description),
			author: text(article?.author),
			urlToImage: text(article?.urlToImage),
			publishedAt: text(article?.publishedAt),
			sourceId: text(source?.id) ?? sourceId,
			sourceName: text(source?.name),
		});
		return parsed.success ? [parsed.data] : [];
	});
}

async function saveArticles(
	ctx: NewsApiContext,
	rows: NewsApiArticleEntity[],
	event: string,
): Promise<void> {
	if (ctx.db?.articles) {
		for (const row of rows) {
			try {
				await ctx.db.articles.upsertByEntityId(row.id, row);
			} catch {
				console.warn('Failed to save NewsAPI article');
			}
		}
	}
	await logEventFromContext(ctx, event, { count: rows.length }, 'completed');
}

export const everything: CorsairEndpoint<
	NewsApiContext,
	EverythingInput,
	ArticleListResponse
> = async (ctx, input) => {
	const key = await keyOf(ctx);
	const parsed = EverythingInputSchema.parse(input ?? {});
	const body = await newsGet<unknown>(key, '/v2/everything', {
		q: parsed.q,
		sources: parsed.sources,
		domains: parsed.domains,
		excludeDomains: parsed.excludeDomains,
		searchIn: parsed.searchIn,
		from: parsed.from,
		to: parsed.to,
		language: parsed.language,
		sortBy: parsed.sortBy,
		page: parsed.page === undefined ? undefined : String(parsed.page),
		pageSize:
			parsed.pageSize === undefined ? undefined : String(parsed.pageSize),
	});
	const articles = articlesFrom(body);
	await saveArticles(ctx, articles, 'newsapi.articles.everything');
	return ArticleListResponseSchema.parse({
		articles,
		totalResults: totalOf(body),
	});
};

export const headlines: CorsairEndpoint<
	NewsApiContext,
	HeadlinesInput,
	ArticleListResponse
> = async (ctx, input) => {
	const key = await keyOf(ctx);
	const parsed = HeadlinesInputSchema.parse(input ?? {});
	const body = await newsGet<unknown>(key, '/v2/top-headlines', {
		q: parsed.q,
		country: parsed.country,
		category: parsed.category,
		sources: parsed.sources,
		page: parsed.page === undefined ? undefined : String(parsed.page),
		pageSize:
			parsed.pageSize === undefined ? undefined : String(parsed.pageSize),
	});
	const articles = articlesFrom(body);
	await saveArticles(ctx, articles, 'newsapi.articles.headlines');
	return ArticleListResponseSchema.parse({
		articles,
		totalResults: totalOf(body),
	});
};

export const listSources: CorsairEndpoint<
	NewsApiContext,
	SourcesInput,
	SourceListResponse
> = async (ctx, input) => {
	const key = await keyOf(ctx);
	const parsed = SourcesInputSchema.parse(input ?? {});
	const body = await newsGet<unknown>(key, '/v2/top-headlines/sources', {
		category: parsed.category,
		language: parsed.language,
		country: parsed.country,
	});
	const row = asRecord(body);
	if (row?.status && row.status !== 'ok') {
		throw new Error('NewsAPI response status was not ok');
	}
	if (!Array.isArray(row?.sources)) {
		throw new Error('NewsAPI response had no sources array');
	}
	const sources = row.sources.flatMap((item) => {
		const source = asRecord(item);
		const id = text(source?.id);
		if (!id) return [];
		const parsedSource = NewsApiSourceEntity.safeParse({
			id,
			name: text(source?.name),
			description: text(source?.description),
			url: text(source?.url),
			category: text(source?.category),
			language: text(source?.language),
			country: text(source?.country),
		});
		return parsedSource.success ? [parsedSource.data] : [];
	});
	if (ctx.db?.sources) {
		for (const source of sources) {
			try {
				await ctx.db.sources.upsertByEntityId(source.id, source);
			} catch {
				console.warn('Failed to save NewsAPI source');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'newsapi.sources.list',
		{ count: sources.length },
		'completed',
	);
	return SourceListResponseSchema.parse({ sources });
};

export const legacyArticles: CorsairEndpoint<
	NewsApiContext,
	LegacyInput,
	ArticleListResponse
> = async (ctx, input) => {
	const key = await keyOf(ctx);
	const parsed = LegacyInputSchema.parse(input ?? {});
	const body = await newsGet<unknown>(key, '/v1/articles', {
		source: parsed.source,
		sortBy: parsed.sortBy,
	});
	// v1 sends the source id (e.g. bbc-news) once at the top level.
	const sourceId = text(asRecord(body)?.source);
	const articles = articlesFrom(body, sourceId);
	await saveArticles(ctx, articles, 'newsapi.articles.legacy');
	return ArticleListResponseSchema.parse({ articles });
};
