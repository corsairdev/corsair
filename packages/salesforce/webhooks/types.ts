import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

export const SalesforceWebhookPayloadSchema = z
	.object({
		event: z
			.object({
				type: z.string(),
				created_at: z.string().optional(),
			})
			.optional(),
		data: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export type SalesforceWebhookPayload = z.infer<
	typeof SalesforceWebhookPayloadSchema
>;

export type SalesforceWebhookOutputs = Record<string, never>;

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

export function createSalesforceMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return (
			parsedBody !== null &&
			(parsedBody.type === eventType || parsedBody.event === eventType)
		);
	};
}

export function verifySalesforceWebhookSignature(
	request: WebhookRequest<SalesforceWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'No webhook secret configured' };
	}

	const rawHeader =
		request.headers['x-salesforce-signature'] ||
		request.headers['x-sfdc-signature'];
	const signature = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

	if (!signature) {
		return { valid: false, error: 'Missing webhook signature header' };
	}

	const rawBody =
		typeof request.rawBody === 'string'
			? request.rawBody
			: JSON.stringify(request.payload ?? {});

	const isValid = verifyHmacSignature(rawBody, secret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}
