import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const WorkdayWebhookPayloadSchema = z.object({
	type: z.string(),
	created_at: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});
export type WorkdayWebhookPayload = z.infer<typeof WorkdayWebhookPayloadSchema>;

export const WorkdayWorkerEventSchema = z.object({
	type: z.literal('worker.updated'),
	created_at: z.string(),
	data: z.object({ worker_id: z.string() }).catchall(z.unknown()),
});
export type WorkdayWorkerEvent = z.infer<typeof WorkdayWorkerEventSchema>;

export type WorkdayWebhookOutputs = {
	'worker.updated': WorkdayWorkerEvent;
};

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createWorkdayEventMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body) as Record<string, unknown>;
		return typeof parsed.type === 'string' && parsed.type === eventType;
	};
}

export function verifyWorkdayWebhookSignature(
	request: WebhookRequest<WorkdayWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) return { valid: false, error: 'No webhook secret configured' };
	return { valid: true };
}
