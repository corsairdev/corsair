import { verifyHmacSignature } from 'corsair/http';
import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';

export interface ApifyWebhookPayload {
	userId: string;
	createdAt: string;
	eventType: ApifyWebhookEventType | (string & {});
	eventData: Record<string, unknown>;
	resource: Record<string, unknown>;
}

export type ApifyWebhookEventType =
	| 'ACTOR.BUILD.ABORTED'
	| 'ACTOR.BUILD.CREATED'
	| 'ACTOR.BUILD.FAILED'
	| 'ACTOR.BUILD.SUCCEEDED'
	| 'ACTOR.BUILD.TIMED_OUT'
	| 'ACTOR.RUN.ABORTED'
	| 'ACTOR.RUN.CREATED'
	| 'ACTOR.RUN.FAILED'
	| 'ACTOR.RUN.RESURRECTED'
	| 'ACTOR.RUN.SUCCEEDED'
	| 'ACTOR.RUN.TIMED_OUT'
	| 'TEST';

export type ApifyWebhookOutputs = {
	webhook: ApifyWebhookPayload;
};

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		return JSON.parse(body) as Record<string, unknown>;
	}
	return (body ?? {}) as Record<string, unknown>;
}

export function createApifyMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return (
			typeof parsedBody.eventType === 'string' && parsedBody.eventType === eventType
		);
	};
}

export function verifyApifyWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
	// Apify does not provide a built-in signature header; recommended security is
	// to include a secret token in the URL or send a custom header via
	// `headersTemplate`. We support two common patterns:
	// - `Authorization: Bearer <secret>`
	// - `x-apify-webhook-secret: <secret>`
	//
	// Additionally, if you choose to send an HMAC signature header yourself
	// (e.g. `x-apify-webhook-signature`), we can verify it against the raw body.

	if (!secret) {
		return { valid: true };
	}

	const headers = request.headers;
	const authorization = Array.isArray(headers.authorization)
		? headers.authorization[0]
		: headers.authorization;
	const headerSecret = Array.isArray(headers['x-apify-webhook-secret'])
		? headers['x-apify-webhook-secret'][0]
		: headers['x-apify-webhook-secret'];

	if (authorization === `Bearer ${secret}` || headerSecret === secret) {
		return { valid: true };
	}

	const hmacSignature = Array.isArray(headers['x-apify-webhook-signature'])
		? headers['x-apify-webhook-signature'][0]
		: headers['x-apify-webhook-signature'];

	if (hmacSignature) {
		if (!request.rawBody) {
			return {
				valid: false,
				error: 'Missing raw body for HMAC signature verification',
			};
		}

		const ok = verifyHmacSignature(request.rawBody, secret, hmacSignature);
		return ok ? { valid: true } : { valid: false, error: 'Invalid signature' };
	}

	return {
		valid: false,
		error:
			'Missing webhook authentication (expected Authorization: Bearer <secret>, x-apify-webhook-secret, or x-apify-webhook-signature)',
	};
}
