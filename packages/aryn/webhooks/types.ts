import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const ArynTaskDonePayloadSchema = z
	.object({
		done: z.array(
			z.object({
				task_id: z.string(),
			}),
		),
	})
	.loose();

export type ArynTaskDonePayload = z.infer<typeof ArynTaskDonePayloadSchema>;

export type ArynWebhookOutputs = {
	taskDone: ArynTaskDonePayload;
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

export function createArynMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return parsedBody !== null && Array.isArray(parsedBody.done);
	};
}

export function verifyArynWebhookSignature(
	request: WebhookRequest<ArynTaskDonePayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// Aryn webhooks do not support signature validation, so always valid.
	return { valid: true };
}
