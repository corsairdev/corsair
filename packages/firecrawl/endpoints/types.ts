import { z } from 'zod';

const ScrapeRunInputSchema = z
	.object({
		url: z.string(),
	})
	.passthrough();

const MapRunInputSchema = z
	.object({
		url: z.string(),
	})
	.passthrough();

const SearchRunInputSchema = z
	.object({
		query: z.string(),
	})
	.passthrough();

const CrawlStartInputSchema = z
	.object({
		url: z.string(),
	})
	.passthrough();

const JobIdInputSchema = z.object({
	id: z.string(),
});

const AgentStartInputSchema = z
	.object({
		prompt: z.string(),
	})
	.passthrough();

const FirecrawlJsonResponseSchema = z
	.object({ success: z.boolean() })
	.passthrough();

export type FirecrawlJsonResponse = z.infer<typeof FirecrawlJsonResponseSchema>;

export const FirecrawlEndpointInputSchemas = {
	scrapeRun: ScrapeRunInputSchema,
	mapRun: MapRunInputSchema,
	searchRun: SearchRunInputSchema,
	crawlStart: CrawlStartInputSchema,
	crawlGet: JobIdInputSchema,
	crawlCancel: JobIdInputSchema,
	agentStart: AgentStartInputSchema,
	agentGet: JobIdInputSchema,
	agentCancel: JobIdInputSchema,
} as const;

export type FirecrawlEndpointInputs = {
	[K in keyof typeof FirecrawlEndpointInputSchemas]: z.infer<
		(typeof FirecrawlEndpointInputSchemas)[K]
	>;
};

export const FirecrawlEndpointOutputSchemas = {
	scrapeRun: FirecrawlJsonResponseSchema,
	mapRun: FirecrawlJsonResponseSchema,
	searchRun: FirecrawlJsonResponseSchema,
	crawlStart: FirecrawlJsonResponseSchema,
	crawlGet: FirecrawlJsonResponseSchema,
	crawlCancel: FirecrawlJsonResponseSchema,
	agentStart: FirecrawlJsonResponseSchema,
	agentGet: FirecrawlJsonResponseSchema,
	agentCancel: FirecrawlJsonResponseSchema,
} as const;

export type FirecrawlEndpointOutputs = {
	[K in keyof typeof FirecrawlEndpointOutputSchemas]: z.infer<
		(typeof FirecrawlEndpointOutputSchemas)[K]
	>;
};
