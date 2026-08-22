import { z } from 'zod';

export const TavilyMcpSearchResult = z.object({
	url: z.string(),
	title: z.string(),
	content: z.string(),
	score: z.number(),
	raw_content: z.string().nullable().optional(),
	favicon: z.string().nullable().optional(),
	query: z.string(),
	searchedAt: z.coerce.date().optional(),
});

export const TavilyMcpExtractResult = z.object({
	url: z.string(),
	raw_content: z.string(),
	images: z.array(z.string()).optional(),
	favicon: z.string().nullable().optional(),
	extractedAt: z.coerce.date().optional(),
});

export const TavilyMcpCrawlResult = z.object({
	url: z.string(),
	raw_content: z.string(),
	images: z.array(z.string()).optional(),
	favicon: z.string().nullable().optional(),
	baseUrl: z.string(),
	crawledAt: z.coerce.date().optional(),
});

export const TavilyMcpMapResult = z.object({
	url: z.string(),
	baseUrl: z.string(),
	mappedAt: z.coerce.date().optional(),
});

export const TavilyMcpResearchResult = z.object({
	requestId: z.string(),
	input: z.string(),
	status: z.string(),
	content: z.string().nullable().optional(),
	sources: z
		.array(
			z.object({
				title: z.string().nullable().optional(),
				url: z.string(),
				favicon: z.string().nullable().optional(),
			}),
		)
		.optional(),
	researchedAt: z.coerce.date().optional(),
});

export type TavilyMcpSearchResult = z.infer<typeof TavilyMcpSearchResult>;
export type TavilyMcpExtractResult = z.infer<typeof TavilyMcpExtractResult>;
export type TavilyMcpCrawlResult = z.infer<typeof TavilyMcpCrawlResult>;
export type TavilyMcpMapResult = z.infer<typeof TavilyMcpMapResult>;
export type TavilyMcpResearchResult = z.infer<typeof TavilyMcpResearchResult>;
