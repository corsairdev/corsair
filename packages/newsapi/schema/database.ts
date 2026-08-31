import { z } from 'zod';

/**
 * News API Source Entity Schema
 * @see https://newsapi.org/docs/endpoints/sources
 */
export const NewsApiSource = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		url: z.string().optional(),
		category: z.string().optional(),
		language: z.string().optional(),
		country: z.string().optional(),
	})
	.catchall(z.unknown());

/**
 * News API Article Entity Schema
 * Articles have no stable provider-issued ID — `url` is the natural unique key.
 * @see https://newsapi.org/docs/endpoints/everything
 */
export const NewsApiArticle = z
	.object({
		url: z.string(),
		source: z
			.object({
				id: z.string().nullable().optional(),
				name: z.string().optional(),
			})
			.optional(),
		author: z.string().nullable().optional(),
		title: z.string().optional(),
		description: z.string().nullable().optional(),
		urlToImage: z.string().nullable().optional(),
		publishedAt: z.coerce.date().nullable().optional(),
		content: z.string().nullable().optional(),
	})
	.catchall(z.unknown());

export type NewsApiSource = z.infer<typeof NewsApiSource>;
export type NewsApiArticle = z.infer<typeof NewsApiArticle>;
