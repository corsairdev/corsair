import type {
	CorsairPluginContext,
	CorsairWebhook,
	CorsairWebhookMatcher,
	PickAuth,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import { z } from 'zod';
import type { FirecrawlSchema } from '../schema';
import {
	FirecrawlScrapeMetadata,
} from '../schema/database';

type FirecrawlPluginOptionsShape = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
};

export type FirecrawlWebhookContext = CorsairPluginContext<
	typeof FirecrawlSchema,
	FirecrawlPluginOptionsShape
>;

export type FirecrawlWH<TEvent> = CorsairWebhook<
	FirecrawlWebhookContext,
	TEvent,
	TEvent
>;

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas for webhook data items
// ─────────────────────────────────────────────────────────────────────────────

/** Scrape-result document delivered in crawl.page / crawl.completed / batch_scrape.* data arrays. */
const WebhookScrapeDocumentSchema = z
	.object({
		markdown: z.string().optional(),
		html: z.string().nullable().optional(),
		rawHtml: z.string().nullable().optional(),
		links: z.array(z.string()).optional(),
		screenshot: z.string().nullable().optional(),
		metadata: FirecrawlScrapeMetadata.optional(),
	})
	.passthrough();

/** Extract-result document delivered in extract.completed data arrays. */
const WebhookExtractCompletedItemSchema = z
	.object({
		success: z.boolean(),
		data: z.record(z.unknown()),
		extractId: z.string(),
		llmUsage: z.number().optional(),
		totalUrlsScraped: z.number().optional(),
		sources: z.record(z.array(z.string())).optional(),
	})
	.passthrough();

/** Agent action entry delivered in agent.action data arrays. */
const WebhookAgentActionSchema = z
	.object({
		creditsUsed: z.number().optional(),
		action: z.string().optional(),
		input: z.record(z.unknown()).optional(),
	})
	.passthrough();

const WebhookAgentCompletedItemSchema = z
	.object({
		creditsUsed: z.number().optional(),
		data: z.record(z.unknown()).optional(),
	})
	.passthrough();

const WebhookAgentFailedItemSchema = z
	.object({
		creditsUsed: z.number().optional(),
	})
	.passthrough();

const EmptyDataArraySchema = z.array(z.never());

// ─────────────────────────────────────────────────────────────────────────────
// Event schemas — one per webhook event type
// ─────────────────────────────────────────────────────────────────────────────

export const CrawlStartedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('crawl.started'),
		id: z.string(),
		data: EmptyDataArraySchema,
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const CrawlPageEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('crawl.page'),
		id: z.string(),
		data: z.array(WebhookScrapeDocumentSchema),
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const CrawlCompletedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('crawl.completed'),
		id: z.string(),
		data: EmptyDataArraySchema,
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const BatchScrapeStartedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('batch_scrape.started'),
		id: z.string(),
		data: EmptyDataArraySchema,
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const BatchScrapePageEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('batch_scrape.page'),
		id: z.string(),
		data: z.array(WebhookScrapeDocumentSchema),
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const BatchScrapeCompletedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('batch_scrape.completed'),
		id: z.string(),
		data: EmptyDataArraySchema,
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const ExtractStartedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('extract.started'),
		id: z.string(),
		data: EmptyDataArraySchema,
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const ExtractCompletedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('extract.completed'),
		id: z.string(),
		data: z.array(WebhookExtractCompletedItemSchema),
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const ExtractFailedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('extract.failed'),
		id: z.string(),
		data: EmptyDataArraySchema,
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const AgentStartedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('agent.started'),
		id: z.string(),
		data: EmptyDataArraySchema,
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const AgentActionEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('agent.action'),
		id: z.string(),
		data: z.array(WebhookAgentActionSchema),
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const AgentCompletedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('agent.completed'),
		id: z.string(),
		data: z.array(WebhookAgentCompletedItemSchema),
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const AgentFailedEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('agent.failed'),
		id: z.string(),
		data: z.array(WebhookAgentFailedItemSchema),
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

export const AgentCancelledEventSchema = z
	.object({
		success: z.boolean(),
		type: z.literal('agent.cancelled'),
		id: z.string(),
		data: z.array(WebhookAgentFailedItemSchema),
		metadata: z.record(z.unknown()).optional(),
		error: z.string().optional(),
	})
	.passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Inferred types
// ─────────────────────────────────────────────────────────────────────────────

export type CrawlStartedEvent = z.infer<typeof CrawlStartedEventSchema>;
export type CrawlPageEvent = z.infer<typeof CrawlPageEventSchema>;
export type CrawlCompletedEvent = z.infer<typeof CrawlCompletedEventSchema>;

export type BatchScrapeStartedEvent = z.infer<
	typeof BatchScrapeStartedEventSchema
>;
export type BatchScrapePageEvent = z.infer<typeof BatchScrapePageEventSchema>;
export type BatchScrapeCompletedEvent = z.infer<
	typeof BatchScrapeCompletedEventSchema
>;

export type ExtractStartedEvent = z.infer<typeof ExtractStartedEventSchema>;
export type ExtractCompletedEvent = z.infer<typeof ExtractCompletedEventSchema>;
export type ExtractFailedEvent = z.infer<typeof ExtractFailedEventSchema>;

export type AgentStartedEvent = z.infer<typeof AgentStartedEventSchema>;
export type AgentActionEvent = z.infer<typeof AgentActionEventSchema>;
export type AgentCompletedEvent = z.infer<typeof AgentCompletedEventSchema>;
export type AgentFailedEvent = z.infer<typeof AgentFailedEventSchema>;
export type AgentCancelledEvent = z.infer<typeof AgentCancelledEventSchema>;

export type FirecrawlWebhookEvent =
	| CrawlStartedEvent
	| CrawlPageEvent
	| CrawlCompletedEvent
	| BatchScrapeStartedEvent
	| BatchScrapePageEvent
	| BatchScrapeCompletedEvent
	| ExtractStartedEvent
	| ExtractCompletedEvent
	| ExtractFailedEvent
	| AgentStartedEvent
	| AgentActionEvent
	| AgentCompletedEvent
	| AgentFailedEvent
	| AgentCancelledEvent;

export type FirecrawlWebhookOutputs = {
	crawlStarted: CrawlStartedEvent;
	crawlPage: CrawlPageEvent;
	crawlCompleted: CrawlCompletedEvent;
	batchScrapeStarted: BatchScrapeStartedEvent;
	batchScrapePage: BatchScrapePageEvent;
	batchScrapeCompleted: BatchScrapeCompletedEvent;
	extractStarted: ExtractStartedEvent;
	extractCompleted: ExtractCompletedEvent;
	extractFailed: ExtractFailedEvent;
	agentStarted: AgentStartedEvent;
	agentAction: AgentActionEvent;
	agentCompleted: AgentCompletedEvent;
	agentFailed: AgentFailedEvent;
	agentCancelled: AgentCancelledEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Best-effort parse of webhook body for matching. Never throws — malformed JSON
 * or non-object bodies yield `null` so the matcher returns false instead of
 * crashing webhook routing.
 */
function parseBodySafe(body: unknown): Record<string, unknown> | null {
	if (body === null || body === undefined) {
		return null;
	}
	if (typeof body === 'object' && !Array.isArray(body)) {
		return body as Record<string, unknown>;
	}
	if (typeof body === 'string') {
		try {
			const parsed: unknown = JSON.parse(body);
			if (
				parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
			) {
				return parsed as Record<string, unknown>;
			}
			return null;
		} catch {
			return null;
		}
	}
	return null;
}

export function createFirecrawlMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBodySafe(request.body);
		if (!parsedBody) {
			return false;
		}
		return typeof parsedBody.type === 'string' && parsedBody.type === eventType;
	};
}

function headerValue(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [k, v] of Object.entries(headers)) {
		if (k.toLowerCase() === lower) {
			return Array.isArray(v) ? v[0] : v;
		}
	}
	return undefined;
}

/**
 * Verifies `X-Firecrawl-Signature: sha256=<hex>` (HMAC-SHA256 over the raw body).
 * @see https://docs.firecrawl.dev/webhooks/security
 */
export function verifyFirecrawlWebhookSignature(
	request: WebhookRequest<unknown>,
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers as Record<
		string,
		string | string[] | undefined
	>;
	const signature = headerValue(headers, 'x-firecrawl-signature');

	if (!signature) {
		return {
			valid: false,
			error: 'Missing X-Firecrawl-Signature header',
		};
	}

	const isValid = verifyHmacSignatureWithPrefix(
		rawBody,
		webhookSecret,
		signature,
		'sha256=',
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
