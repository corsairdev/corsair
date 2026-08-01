import { z } from 'zod';

export const YoucomContents = z.object({
	html: z.string().optional(),
	markdown: z.string().optional(),
});

export const YoucomSearchResult = z.object({
	url: z.string(),
	title: z.string(),
	description: z.string().optional(),
	snippets: z.array(z.string()).optional(),
	thumbnail_url: z.string().optional(),
	page_age: z.string().optional(),
	contents: YoucomContents.optional(),
	favicon_url: z.string().optional(),
	resultType: z.enum(['web', 'news']),
	query: z.string(),
	searchedAt: z.coerce.date().optional(),
});

export type YoucomSearchResult = z.infer<typeof YoucomSearchResult>;
