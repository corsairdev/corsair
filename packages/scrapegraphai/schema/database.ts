import { z } from 'zod';

const jsonObject = z.record(z.string(), z.unknown());

/**
 * ScrapeGraphAI CreditsResponse.
 * Official: GET /v1/credits
 * https://api.scrapegraphai.com/openapi.json
 */
export const ScrapegraphAiCredits = z.object({
	remaining_credits: z.number().int(),
	total_credits_used: z.number().int(),
});
export type ScrapegraphAiCredits = z.infer<typeof ScrapegraphAiCredits>;

/**
 * ScrapeGraphAI CompletedSmartscraperResponse.
 * Official: POST /v1/smartscraper
 * https://api.scrapegraphai.com/openapi.json
 */
export const ScrapegraphAiSmartScraper = z.object({
	request_id: z.string(),
	status: z.enum(['queued', 'processing', 'completed', 'failed']),
	website_url: z.string().nullable().optional(),
	user_prompt: z.string(),
	result: z.union([jsonObject, z.string()]).nullable().optional(),
	error: z.string().optional(),
});
export type ScrapegraphAiSmartScraper = z.infer<
	typeof ScrapegraphAiSmartScraper
>;

/**
 * ScrapeGraphAI CompletedSearchScraperResponse.
 * Official: POST /v1/searchscraper
 * https://api.scrapegraphai.com/openapi.json
 */
export const ScrapegraphAiSearchScraper = z.object({
	request_id: z.string(),
	status: z.enum(['queued', 'processing', 'completed', 'failed']),
	user_prompt: z.string(),
	num_results: z.number().nullable().optional(),
	result: z.unknown().nullable().optional(),
	reference_urls: z.array(z.string()).nullable().optional(),
	markdown_content: z.string().nullable().optional(),
	error: z.string().nullable().optional(),
});
export type ScrapegraphAiSearchScraper = z.infer<
	typeof ScrapegraphAiSearchScraper
>;

/**
 * ScrapeGraphAI CompletedMarkdownifyResponse.
 * Official: POST /v1/markdownify
 * https://api.scrapegraphai.com/openapi.json
 */
export const ScrapegraphAiMarkdownify = z.object({
	request_id: z.string(),
	status: z.enum(['queued', 'processing', 'completed', 'failed']),
	website_url: z.string(),
	result: z.string().nullable().optional(),
	error: z.string().optional(),
});
export type ScrapegraphAiMarkdownify = z.infer<typeof ScrapegraphAiMarkdownify>;

/**
 * ScrapeGraphAI CrawlerRequestDB / crawl job snapshot.
 * Official: POST /v1/crawl, GET /v1/crawl/{task_id}
 * https://api.scrapegraphai.com/openapi.json
 */
export const ScrapegraphAiCrawl = z
	.object({
		task_id: z.string().optional(),
		request_id: z.string().optional(),
		status: z.string().optional(),
		url: z.string().optional(),
		error: z.string().nullable().optional(),
	})
	.loose();
export type ScrapegraphAiCrawl = z.infer<typeof ScrapegraphAiCrawl>;

/**
 * ScrapeGraphAI SchemaGenerationResponse.
 * Official: POST /v1/generate_schema
 * https://api.scrapegraphai.com/openapi.json
 */
export const ScrapegraphAiGeneratedSchema = z.object({
	request_id: z.string(),
	status: z.string(),
	user_prompt: z.string(),
	refined_prompt: z.string(),
	generated_schema: jsonObject,
	error: z.string().nullable().optional(),
});
export type ScrapegraphAiGeneratedSchema = z.infer<
	typeof ScrapegraphAiGeneratedSchema
>;

/**
 * ScrapeGraphAI ScheduledJobResponse.
 * Official: GET /v1/scheduled-jobs
 * https://api.scrapegraphai.com/openapi.json
 */
export const ScrapegraphAiScheduledJob = z.object({
	id: z.string(),
	user_id: z.string(),
	job_name: z.string(),
	service_type: z.string(),
	cron_expression: z.string(),
	job_config: jsonObject,
	is_active: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
	last_run_at: z.string().nullable().optional(),
	next_run_at: z.string().nullable().optional(),
});
export type ScrapegraphAiScheduledJob = z.infer<
	typeof ScrapegraphAiScheduledJob
>;

/**
 * Local snapshot of an async v1 job (request_id / task_id).
 * Official start/status: /v1/searchscraper, /v1/smartscraper, /v1/markdownify, /v1/crawl
 */
export const ScrapegraphAiJobKind = z.enum([
	'searchscraper',
	'smartscraper',
	'markdownify',
	'smartcrawler',
]);
export type ScrapegraphAiJobKind = z.infer<typeof ScrapegraphAiJobKind>;

export const ScrapegraphAiJob = z.object({
	id: z.string(),
	kind: ScrapegraphAiJobKind,
	status: z.string().optional(),
	websiteUrl: z.string().nullable().optional(),
	snapshot: z.record(z.string(), z.unknown()).optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});
export type ScrapegraphAiJob = z.infer<typeof ScrapegraphAiJob>;
