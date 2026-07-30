import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

export const DatabricksWebhookPayloadSchema = z
	.object({
		event_type: z.string().optional(),
		workspace_id: z.union([z.string(), z.number()]).optional(),
		data: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type DatabricksWebhookPayload = z.infer<
	typeof DatabricksWebhookPayloadSchema
>;

export type DatabricksWebhookOutputs = Record<string, never>;

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

export function createDatabricksMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.event_type === eventType;
	};
}

export function verifyDatabricksWebhookSignature(
	request: WebhookRequest<DatabricksWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'No webhook secret configured' };
	}

	const rawHeader =
		request.headers['x-databricks-signature'] || request.headers['x-signature'];
	const signature = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

	if (!signature) {
		return { valid: false, error: 'Missing webhook signature header' };
	}

	// Corsair preserves the inbound string on rawBody when body arrived as text.
	// Do not infer reconstruction via JSON.stringify(payload) — that rejects
	// valid compact payloads that stringify back to the same bytes.
	if (typeof request.rawBody !== 'string') {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const isValid = verifyHmacSignature(request.rawBody, secret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}

/** Verify using the raw inbound request before JSON parsing. */
export function verifyDatabricksWebhookSignatureFromRaw(
	request: Pick<RawWebhookRequest, 'body' | 'headers'>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'No webhook secret configured' };
	}

	const rawHeader =
		request.headers['x-databricks-signature'] || request.headers['x-signature'];
	const signature = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

	if (!signature) {
		return { valid: false, error: 'Missing webhook signature header' };
	}

	if (typeof request.body !== 'string') {
		return {
			valid: false,
			error: 'Missing original raw body for signature verification',
		};
	}

	const isValid = verifyHmacSignature(request.body, secret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}
