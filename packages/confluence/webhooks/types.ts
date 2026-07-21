import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignatureWithPrefix } from 'corsair/http';
import { z } from 'zod';

export const ConfluenceWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type ConfluenceWebhookPayload = z.infer<
	typeof ConfluenceWebhookPayloadSchema
>;

export const ExampleEventSchema = ConfluenceWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type ConfluenceWebhookOutputs = {
	example: ExampleEvent;
};

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

export function createConfluenceMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyConfluenceWebhookSignature(
	request: WebhookRequest<ConfluenceWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// Atlassian Cloud admin webhooks (Confluence + Jira) sign payloads with
	// HMAC-SHA256 using the WebSub convention, sending the signature in the
	// `x-hub-signature` header formatted as `sha256=<hex>`.
	// Ref: https://developer.atlassian.com/cloud/jira/platform/webhooks/#secure-admin-webhooks
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
	const signatureHeader = Array.isArray(headers['x-hub-signature'])
		? headers['x-hub-signature'][0]
		: (headers['x-hub-signature'] as string | undefined);

	if (!signatureHeader) {
		return { valid: false, error: 'Missing x-hub-signature header' };
	}

	const isValid = verifyHmacSignatureWithPrefix(
		rawBody,
		secret,
		signatureHeader,
		'sha256=',
	);
	return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
}
