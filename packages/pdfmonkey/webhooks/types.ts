import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { createHmac } from 'crypto';
import { z } from 'zod';

export const PDFMonkeyWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string(),
	data: z.record(z.string(), z.unknown()),
});

export type PDFMonkeyWebhookPayload = z.infer<
	typeof PDFMonkeyWebhookPayloadSchema
>;

export const ExampleEventSchema = PDFMonkeyWebhookPayloadSchema.extend({
	type: z.literal('example'),
	data: z
		.object({
			id: z.string(),
		})
		.loose(),
});

export type ExampleEvent = z.infer<typeof ExampleEventSchema>;

export type PDFMonkeyWebhookOutputs = {
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

export function createPDFMonkeyMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && parsedBody.type === eventType;
	};
}

export function verifyPDFMonkeyWebhookSignature(
	request: WebhookRequest<PDFMonkeyWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	const svixId = request.headers['svix-id'];
	const svixTimestamp = request.headers['svix-timestamp'];
	const svixSignature = request.headers['svix-signature'];

	if (!svixId || !svixTimestamp || !svixSignature) {
		return { valid: false, error: 'Missing Svix webhook headers' };
	}

	const payload = parseBody(request);
	const message = `${svixTimestamp}.${svixId}`;

	const hmac = createHmac('sha256', secret);
	hmac.update(message);
	const digest = hmac.digest('hex');

	const signatures = Array.isArray(svixSignature)
		? svixSignature
		: svixSignature.split(',');
	const isValid = signatures.some((signature) => {
		const signatureParts = String(signature).split('=');
		const key = signatureParts[0];
		const value = signatureParts.slice(1).join('=').trim();
		return key === 't' ? value === digest : false;
	});

	if (!isValid) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}
