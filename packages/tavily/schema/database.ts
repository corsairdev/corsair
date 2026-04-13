import { z } from 'zod';

export const TAVILY_RUN_ENDPOINTS = [
	'search',
	'extract',
	'crawl',
	'map',
] as const;

export const TavilyRun = z.object({
	endpoint: z.enum(TAVILY_RUN_ENDPOINTS),
	request: z.record(z.unknown()),
	response: z.record(z.unknown()),
	cachedAt: z.coerce.date().optional(),
});

export type TavilyRun = z.infer<typeof TavilyRun>;
