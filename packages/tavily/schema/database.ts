import { z } from 'zod';

export const TavilySearchResult = z.object({
	url: z.string(),
	title: z.string(),
	content: z.string(),
	score: z.number(),
	raw_content: z.string().nullable().optional(),
	favicon: z.string().nullable().optional(),
	query: z.string(),
	searchedAt: z.coerce.date().optional(),
});

export const TavilyExtractResult = z.object({
	url: z.string(),
	raw_content: z.string(),
	images: z.array(z.string()).optional(),
	favicon: z.string().nullable().optional(),
	extractedAt: z.coerce.date().optional(),
});

export const TavilyCrawlResult = z.object({
	url: z.string(),
	raw_content: z.string(),
	images: z.array(z.string()).optional(),
	favicon: z.string().nullable().optional(),
	baseUrl: z.string(),
	crawledAt: z.coerce.date().optional(),
});

export const TavilyMapResult = z.object({
	url: z.string(),
	baseUrl: z.string(),
	mappedAt: z.coerce.date().optional(),
});

export type TavilySearchResult = z.infer<typeof TavilySearchResult>;
export type TavilyExtractResult = z.infer<typeof TavilyExtractResult>;
export type TavilyCrawlResult = z.infer<typeof TavilyCrawlResult>;
export type TavilyMapResult = z.infer<typeof TavilyMapResult>;
