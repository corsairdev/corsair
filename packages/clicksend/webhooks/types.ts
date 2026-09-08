import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

export const InboundSmsEventSchema = z.object({
	message_id: z.string().min(1),
	from: z.string().min(1),
	to: z.string().min(1),
	body: z.string(),
	timestamp: z.union([z.number(), z.string()]).optional(),
	original_message_id: z.string().optional(),
});
export type InboundSmsEvent = z.infer<typeof InboundSmsEventSchema>;

export const DeliveryReceiptEventSchema = z.object({
	message_id: z.string().min(1),
	status: z.string().min(1),
	status_code: z.string().optional(),
	status_text: z.string().optional(),
	timestamp: z.union([z.number(), z.string()]).optional(),
	original_message_id: z.string().optional(),
});
export type DeliveryReceiptEvent = z.infer<typeof DeliveryReceiptEventSchema>;

export type ClickSendWebhookOutputs = {
	inboundSms: InboundSmsEvent;
	deliveryReceipt: DeliveryReceiptEvent;
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

export function createClickSendInboundMatcher(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		if (!parsed) return false;
		return 'body' in parsed && 'from' in parsed && !('status' in parsed);
	};
}

export function createClickSendReceiptMatcher(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsed = parseBody(request.body);
		if (!parsed) return false;
		return 'message_id' in parsed && 'status' in parsed;
	};
}

function safeTimingEqual(a: string, b: string): boolean {
	const bufA = Buffer.from(a, 'utf8');
	const bufB = Buffer.from(b, 'utf8');
	if (bufA.length !== bufB.length) return false;
	return timingSafeEqual(bufA, bufB);
}

export function verifyClickSendWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}
	const headers = (request.headers ?? {}) as Record<string, string | undefined>;
	const query = ((
		request as unknown as { query?: Record<string, string | undefined> }
	).query ?? {}) as Record<string, string | undefined>;

	const authHeader =
		headers['authorization'] ||
		headers['x-clicksend-token'] ||
		headers['x-webhook-secret'] ||
		query['secret'] ||
		query['token'];

	if (!authHeader) {
		return { valid: false, error: 'Missing webhook authorization header' };
	}

	let token = authHeader;
	if (authHeader.startsWith('Bearer ')) {
		token = authHeader.slice(7).trim();
	} else if (authHeader.startsWith('Basic ')) {
		try {
			token = Buffer.from(authHeader.slice(6).trim(), 'base64').toString(
				'utf8',
			);
		} catch {
			return { valid: false, error: 'Invalid Basic auth encoding' };
		}
	}

	if (safeTimingEqual(token, secret)) {
		return { valid: true };
	}

	const parts = token.split(':');
	if (parts.length > 1 && safeTimingEqual(parts[1]!, secret)) {
		return { valid: true };
	}

	return { valid: false, error: 'Invalid webhook secret' };
}
