import type { ZenRowsEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	ZenRowsEndpointInputSchemas as Inputs,
	ZenRowsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The crawl's wire body. Zenrows names every field in snake_case and nests the
 * webhook under one object; `null` is not accepted for any of them, so an unset
 * field is left out rather than sent empty.
 *
 * The metadata values stay `unknown` because Zenrows accepts any JSON there and
 * echoes it back unchanged; the input schema has already restricted it to JSON.
 */
export function crawlBody(parsed: {
	url: string;
	depth?: number;
	maxItems?: number;
	maxPages?: number;
	includePatterns?: readonly string[];
	excludePatterns?: readonly string[];
	outputFormat?: string;
	webhookUrl?: string;
	webhookEvents?: readonly string[];
	// unknown: Zenrows accepts any JSON here and echoes it back unchanged; the
	// input schema has already restricted the values to JSON.
	webhookMetadata?: Record<string, unknown>;
	// unknown: corsair/http serialises this object to JSON as-is, and each key
	// is mapped from a different input field, so a shared concrete type would
	// be a union of every field's shape rather than a real check.
}): Record<string, unknown> {
	return {
		url: parsed.url,
		depth: parsed.depth,
		max_items: parsed.maxItems,
		max_pages: parsed.maxPages,
		include_patterns: parsed.includePatterns,
		exclude_patterns: parsed.excludePatterns,
		output_format: parsed.outputFormat,
		webhook:
			parsed.webhookUrl === undefined
				? undefined
				: {
						url: parsed.webhookUrl,
						events: parsed.webhookEvents,
						metadata: parsed.webhookMetadata,
					},
	};
}

export const start: ZenRowsEndpoints['crawlStart'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'crawl.start',
			input: Inputs.crawlStart,
			output: Outputs.crawlStart,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v1/crawls',
			body: crawlBody(parsed),
			headers:
				parsed.idempotencyKey === undefined
					? undefined
					: { 'Idempotency-Key': parsed.idempotencyKey },
		}),
		{
			shape: (raw) => raw.json,
			log: (parsed, result) => ({
				crawlId: result.crawl_id,
				maxPages: parsed.maxPages,
				outputFormat: parsed.outputFormat,
				webhook: parsed.webhookUrl !== undefined,
			}),
		},
	);

export const list: ZenRowsEndpoints['crawlList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'crawl.list',
			input: Inputs.crawlList,
			output: Outputs.crawlList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v1/crawls',
			query: { cursor: parsed.cursor, limit: parsed.limit },
		}),
		{
			shape: (raw) => raw.json,
			log: (_parsed, result) => ({ count: result.crawls.length }),
		},
	);

export const get: ZenRowsEndpoints['crawlGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'crawl.get',
			input: Inputs.crawlGet,
			output: Outputs.crawlGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/crawls/${segment(parsed.crawlId)}`,
			query: { cursor: parsed.cursor, limit: parsed.limit },
		}),
		{
			shape: (raw) => raw.json,
			log: (parsed, result) => ({
				crawlId: parsed.crawlId,
				status: result.status,
				results: result.results?.length,
				hasMore:
					result.next_cursor !== null && result.next_cursor !== undefined,
			}),
		},
	);

/**
 * A kept page's body is HTML or Markdown, both served as text, and the crawl
 * id and content id are separate path segments.
 */
export const getContent: ZenRowsEndpoints['crawlGetContent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'crawl.getContent',
			input: Inputs.crawlGetContent,
			output: Outputs.crawlGetContent,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/crawls/${segment(parsed.crawlId)}/contents/${segment(parsed.contentId)}`,
			query: { download: parsed.download },
		}),
		{
			shape: (raw) => ({ body: raw.text, bodyFormat: raw.bodyFormat }),
			log: (parsed, result) => ({
				crawlId: parsed.crawlId,
				contentId: parsed.contentId,
				bytes: result.body.length,
			}),
		},
	);

export const stop: ZenRowsEndpoints['crawlStop'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'crawl.stop',
			input: Inputs.crawlStop,
			output: Outputs.crawlStop,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/v1/crawls/${segment(parsed.crawlId)}/stop`,
		}),
		{
			shape: (raw) => raw.json,
			log: (parsed, result) => ({
				crawlId: parsed.crawlId,
				status: result.status,
				stopReason: result.stop_reason ?? undefined,
			}),
		},
	);
