import { z } from 'zod';

/**
 * Async job kinds that share the same start → poll-for-status lifecycle:
 * SearchScraper, SmartScraper, Markdownify, and SmartCrawler each return an
 * id immediately and the caller polls a status endpoint for the result.
 * @see https://api.scrapegraphai.com/openapi.json (confirmed live 2026-08-29)
 */
export const ScrapegraphAiJobKind = z.enum([
	'searchscraper',
	'smartscraper',
	'markdownify',
	'smartcrawler',
]);
export type ScrapegraphAiJobKind = z.infer<typeof ScrapegraphAiJobKind>;

/**
 * Last known snapshot of an async job (entity id = the provider's own
 * `request_id` / `task_id`). `snapshot` is a passthrough record rather than
 * a tagged union of the four response shapes — the four `Completed*Response`
 * schemas in the OpenAPI spec share no discriminant field, and the plain
 * `GET .../{id}` status responses aren't typed further than `object` by the
 * provider itself.
 */
export const ScrapegraphAiJob = z.object({
	id: z.string(),
	kind: ScrapegraphAiJobKind,
	status: z.string().optional(),
	websiteUrl: z.string().nullable().optional(),
	snapshot: z.record(z.string(), z.unknown()).optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});
export type ScrapegraphAiJob = z.infer<typeof ScrapegraphAiJob>;
