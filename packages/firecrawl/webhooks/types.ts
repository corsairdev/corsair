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

function firecrawlEventSchema<T extends string>(type: T) {
	return z
		.object({
			success: z.boolean(),
			type: z.literal(type),
			id: z.string(),
			data: z.array(z.unknown()),
			metadata: z.record(z.unknown()).optional(),
			error: z.string().optional(),
		})
		.passthrough();
}

export const CrawlStartedEventSchema = firecrawlEventSchema('crawl.started');
export const CrawlPageEventSchema = firecrawlEventSchema('crawl.page');
export const CrawlCompletedEventSchema =
	firecrawlEventSchema('crawl.completed');

export const BatchScrapeStartedEventSchema = firecrawlEventSchema(
	'batch_scrape.started',
);
export const BatchScrapePageEventSchema =
	firecrawlEventSchema('batch_scrape.page');
export const BatchScrapeCompletedEventSchema = firecrawlEventSchema(
	'batch_scrape.completed',
);

export const ExtractStartedEventSchema =
	firecrawlEventSchema('extract.started');
export const ExtractCompletedEventSchema =
	firecrawlEventSchema('extract.completed');
export const ExtractFailedEventSchema = firecrawlEventSchema('extract.failed');

export const AgentStartedEventSchema = firecrawlEventSchema('agent.started');
export const AgentActionEventSchema = firecrawlEventSchema('agent.action');
export const AgentCompletedEventSchema =
	firecrawlEventSchema('agent.completed');
export const AgentFailedEventSchema = firecrawlEventSchema('agent.failed');
export const AgentCancelledEventSchema =
	firecrawlEventSchema('agent.cancelled');

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
