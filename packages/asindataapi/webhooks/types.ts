import { timingSafeEqual } from 'node:crypto';
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

// ── Shared-secret verification ───────────────────────────────────────────────
// Official collection webhooks have no signature header. Authenticate by
// putting the same secret on the plugin (`webhookSecret`) and on the
// `notification_webhook` URL as `?token=` / `?webhook_secret=`, or send it
// as `X-Webhook-Secret` / `Authorization: Bearer`.

function firstString(value: string | string[] | undefined): string | undefined {
	if (Array.isArray(value)) return value[0];
	return value;
}

function presentedWebhookSecret(
	request: WebhookRequest<unknown>,
): string | undefined {
	const query = request.query ?? {};
	const fromQuery =
		firstString(query.token) ?? firstString(query.webhook_secret);
	if (fromQuery) return fromQuery;

	const fromHeader = firstString(request.headers['x-webhook-secret']);
	if (fromHeader) return fromHeader;

	const authorization =
		firstString(request.headers.authorization) ??
		firstString(request.headers.Authorization);
	if (authorization?.toLowerCase().startsWith('bearer ')) {
		return authorization.slice(7).trim();
	}
	return undefined;
}

function secretsEqual(left: string, right: string): boolean {
	const a = Buffer.from(left);
	const b = Buffer.from(right);
	return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAsinDataApiWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string | undefined,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Webhook secret is not configured' };
	}

	const presented = presentedWebhookSecret(request);
	if (!presented) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	if (!secretsEqual(presented, secret)) {
		return { valid: false, error: 'Invalid webhook secret' };
	}

	return { valid: true };
}
