import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { createHmac, timingSafeEqual } from 'crypto';
import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const ExaWebhookSearchResultSchema = z.object({
	id: z.string(),
	url: z.string(),
	title: z.string().nullable().optional(),
	publishedDate: z.string().nullable().optional(),
	author: z.string().nullable().optional(),
	score: z.number().optional(),
	text: z.string().optional(),
	highlights: z.array(z.string()).optional(),
	summary: z.string().optional(),
});

const ExaWebhookWebsetSchema = z.object({
	id: z.string(),
	object: z.literal('webset'),
	status: z.enum(['idle', 'running', 'paused', 'done']),
	externalId: z.string().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

// ── Webhook Payload Schemas ───────────────────────────────────────────────────

export const ExaSearchAlertPayloadSchema = z.object({
	type: z.literal('search.alert'),
	id: z.string(),
	created_at: z.string(),
	data: z.object({
		query: z.string(),
		results: z.array(ExaWebhookSearchResultSchema),
	}),
});

export const ExaContentIndexedPayloadSchema = z.object({
	type: z.literal('content.indexed'),
	id: z.string(),
	created_at: z.string(),
	data: z.object({
		url: z.string(),
		title: z.string().nullable().optional(),
		publishedDate: z.string().nullable().optional(),
		author: z.string().nullable().optional(),
	}),
});

export const ExaWebsetItemsFoundPayloadSchema = z.object({
	type: z.literal('webset.items_found'),
	id: z.string(),
	created_at: z.string(),
	data: z.object({
		webset: ExaWebhookWebsetSchema,
		items: z.array(ExaWebhookSearchResultSchema),
		itemCount: z.number().optional(),
	}),
});

export const ExaWebsetSearchCompletedPayloadSchema = z.object({
	type: z.literal('webset.search.completed'),
	id: z.string(),
	created_at: z.string(),
	data: z.object({
		webset: ExaWebhookWebsetSchema,
		totalItems: z.number().optional(),
	}),
});

// ── Event Response Schemas ────────────────────────────────────────────────────

export const SearchAlertEventSchema = z.object({
	query: z.string(),
	results: z.array(ExaWebhookSearchResultSchema),
	triggeredAt: z.string(),
});

export const ContentIndexedEventSchema = z.object({
	url: z.string(),
	title: z.string().nullable().optional(),
	publishedDate: z.string().nullable().optional(),
	author: z.string().nullable().optional(),
	indexedAt: z.string(),
});

export const WebsetItemsFoundEventSchema = z.object({
	webset: ExaWebhookWebsetSchema,
	items: z.array(ExaWebhookSearchResultSchema),
	itemCount: z.number().optional(),
	triggeredAt: z.string(),
});

export const WebsetSearchCompletedEventSchema = z.object({
	webset: ExaWebhookWebsetSchema,
	totalItems: z.number().optional(),
	completedAt: z.string(),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type SearchAlertEvent = z.infer<typeof ExaSearchAlertPayloadSchema>;
export type ContentIndexedEvent = z.infer<
	typeof ExaContentIndexedPayloadSchema
>;
export type WebsetItemsFoundEvent = z.infer<
	typeof ExaWebsetItemsFoundPayloadSchema
>;
export type WebsetSearchCompletedEvent = z.infer<
	typeof ExaWebsetSearchCompletedPayloadSchema
>;

export type ExaWebhookOutputs = {
	searchAlert: SearchAlertEvent;
	contentIndexed: ContentIndexedEvent;
	websetItemsFound: WebsetItemsFoundEvent;
	websetSearchCompleted: WebsetSearchCompletedEvent;
};

// ── Utilities ─────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

// ── Event Matcher ─────────────────────────────────────────────────────────────

export function createExaEventMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// body is unknown at match time — parse it to inspect the type field
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return parsedBody.type === eventType;
	};
}

// ── Signature Verification ────────────────────────────────────────────────────

export function verifyExaWebhookSignature(
	// WebhookRequest<unknown> is used since this function is shared across all event types
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	// Headers may be string | string[] | undefined — normalise to string
	const signature = Array.isArray(headers['x-exa-signature'])
		? headers['x-exa-signature'][0]
		: headers['x-exa-signature'];

	if (!signature) {
		return { valid: false, error: 'Missing x-exa-signature header' };
	}

	const expectedSignature = createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');

	try {
		const isValid = timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
		return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
	} catch {
		return { valid: false, error: 'Signature comparison failed' };
	}
}
