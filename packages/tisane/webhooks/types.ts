import { createHmac, timingSafeEqual } from 'crypto';
import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const TisaneWebhookPayloadSchema = z.object({
	event: z.string(),
	analysis_id: z.string().optional(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()).optional(),
});

export type TisaneWebhookPayload = z.infer<typeof TisaneWebhookPayloadSchema>;

export const AnalysisCompletedEventSchema = TisaneWebhookPayloadSchema.extend({
	event: z.literal('analysis.completed'),
	data: z.object({
		analysis_id: z.string().optional(),
		status: z.string().optional(),
		summary: z.record(z.string(), z.unknown()).optional(),
	}).passthrough(),
});

export type AnalysisCompletedEvent = z.infer<typeof AnalysisCompletedEventSchema>;

export type TisaneWebhookOutputs = {
	analysisCompleted: AnalysisCompletedEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
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

export function createTisaneMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && (parsedBody.event === eventType || parsedBody.type === eventType);
	};
}

export function verifyTisaneWebhookSignature(
	request: WebhookRequest<TisaneWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Webhook secret not configured' };
	}

	const rawHeader = request.headers['x-tisane-signature'] || request.headers['x-signature'];
	const signature = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

	if (!signature) {
		return { valid: false, error: 'Missing x-tisane-signature header' };
	}

	const bodyString = typeof request.rawBody === 'string' && request.rawBody
		? request.rawBody
		: JSON.stringify(request.payload);
	const expectedSignature = createHmac('sha256', secret).update(bodyString).digest('hex');

	const sigBuffer = Buffer.from(signature);
	const expectedBuffer = Buffer.from(expectedSignature);

	if (sigBuffer.length !== expectedBuffer.length || !timingSafeEqual(sigBuffer, expectedBuffer)) {
		return { valid: false, error: 'Invalid webhook signature' };
	}

	return { valid: true };
}
