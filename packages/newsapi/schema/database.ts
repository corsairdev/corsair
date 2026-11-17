import { z } from 'zod';

/** Article. https://newsapi.org/docs/endpoints/everything */
export const NewsApiArticleEntity = z.object({
	id: z.string().min(1),
	title: z.string().optional(),
	description: z.string().optional(),
	author: z.string().optional(),
	urlToImage: z.string().optional(),
	publishedAt: z.string().optional(),
	sourceId: z.string().optional(),
	sourceName: z.string().optional(),
});

/** Source. https://newsapi.org/docs/endpoints/sources */
export const NewsApiSourceEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	description: z.string().optional(),
	url: z.string().optional(),
	category: z.string().optional(),
	language: z.string().optional(),
	country: z.string().optional(),
});

export type NewsApiArticleEntity = z.infer<typeof NewsApiArticleEntity>;
export type NewsApiSourceEntity = z.infer<typeof NewsApiSourceEntity>;
