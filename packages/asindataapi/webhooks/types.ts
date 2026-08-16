import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const DownloadLinksSchema = z
	.object({
		pages: z.array(z.string()).optional(),
		all_pages: z.string().optional(),
	})
	.loose();

const WebhookResultSetSchema = z
	.object({
		id: z.number().or(z.string()),
		started_at: z.string().optional(),
		ended_at: z.string().optional(),
		requests_completed: z.number().optional(),
		requests_failed: z.number().optional(),
		download_links: z
			.object({
				json: DownloadLinksSchema.optional(),
				jsonlines: DownloadLinksSchema.optional(),
				csv: DownloadLinksSchema.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

// ── Webhook Payload Schema ───────────────────────────────────────────────────

export const CollectionCompletedPayloadSchema = z
	.object({
		request_info: z
			.object({
				success: z.boolean().optional(),
				type: z.literal('collection_resultset_completed').optional(),
			})
			.loose(),
		collection: z
			.object({
				id: z.string(),
				name: z.string().optional(),
			})
			.loose(),
		result_set: WebhookResultSetSchema,
	})
	.loose();

export type CollectionCompletedEvent = z.infer<
	typeof CollectionCompletedPayloadSchema
>;

export const CollectionCompletedEventSchema = CollectionCompletedPayloadSchema;

export type CollectionCompletedResponse = CollectionCompletedEvent;

// ── Webhook Outputs ──────────────────────────────────────────────────────────

export type AsinDataApiWebhookOutputs = {
	collectionCompleted: CollectionCompletedEvent;
};

// ── Event Matcher ────────────────────────────────────────────────────────────

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

export function createAsinDataApiMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;

		const requestInfo = parsedBody.request_info as
			| Record<string, unknown>
			| undefined;
		if (requestInfo?.type === eventType) return true;

		return parsedBody.type === eventType;
	};
}

// ── Signature Verification ───────────────────────────────────────────────────
// ASIN Data API webhooks do not document a signature verification header.
// Collection completion notifications are delivered as plain HTTP POST to
// the configured `notification_webhook` URL. The only way to verify them
// is by checking the payload content. If the provider adds signature
// support in the future, update this function and `pluginWebhookMatcher`.

export function verifyAsinDataApiWebhookSignature(
	_request: WebhookRequest<unknown>,
	_secret: string | undefined,
): { valid: boolean; error?: string } {
	// No documented signature header — always return valid.
	// The `pluginWebhookMatcher` will filter non-matching payloads.
	return { valid: true };
}
