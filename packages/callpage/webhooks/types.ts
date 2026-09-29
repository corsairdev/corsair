import { timingSafeEqual } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const CallPageWebhookEventSchema = z
	.object({
		data: z
			.object({
				event: z.string(),
				id: z.union([z.number(), z.string()]).optional(),
				status: z.string().optional(),
				ref_id: z.union([z.number(), z.string(), z.null()]).optional(),
				to: z.string().optional(),
				widget_id: z.union([z.number(), z.string()]).optional(),
				created_at: z.string().optional(),
				scheduled_at: z.string().nullable().optional(),
			})
			.passthrough(),
	})
	.passthrough();

export type CallPageWebhookEvent = z.infer<typeof CallPageWebhookEventSchema>;

export const CallPageWebhookOutputSchema = CallPageWebhookEventSchema;

export type CallPageWebhookOutputs = {
	event: CallPageWebhookEvent;
};

export function verifyCallPageWebhookToken(
	request: WebhookRequest<unknown>,
	token?: string,
): { valid: boolean; error?: string } {
	// bind.ts skips keyBuilder when the hub already verified the delivery.
	if (request.hubVerified === true) {
		return { valid: true };
	}

	if (!token) {
		return { valid: false, error: 'Missing webhook verification token' };
	}

	const headers = request.headers;
	const authorization = Array.isArray(headers.authorization)
		? headers.authorization[0]
		: headers.authorization;

	if (!authorization) {
		return { valid: false, error: 'Missing Authorization header' };
	}

	const actual = Buffer.from(authorization);
	const expected = Buffer.from(token);
	if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
		return { valid: false, error: 'Invalid webhook verification token' };
	}

	return { valid: true };
}
