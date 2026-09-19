import { timingSafeEqual } from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

// ── Inbound SMS Webhook ───────────────────────────────────────────────────────

export const InboundSmsEventSchema = z.object({
	message_id: z.string().min(1).describe('ClickSend message identifier'),
	from: z.string().min(1).describe('Sender phone number'),
	to: z.string().min(1).describe('Recipient phone number'),
	body: z.string().describe('SMS message body'),
	username: z
		.string()
		.min(1)
		.optional()
		.describe('ClickSend account username for tenant routing'),
	user_id: z
		.union([z.number(), z.string()])
		.optional()
		.describe('ClickSend account user ID for tenant routing'),
	timestamp: z
		.union([z.number(), z.string()])
		.optional()
		.describe('Unix epoch seconds or ISO timestamp'),
	original_message_id: z
		.string()
		.optional()
		.describe('Original outbound message ID for replies'),
});
export type InboundSmsEvent = z.infer<typeof InboundSmsEventSchema>;

// ── Delivery Receipt Webhook ──────────────────────────────────────────────────

export const DeliveryReceiptEventSchema = z.object({
	message_id: z.string().min(1).describe('ClickSend message identifier'),
	status: z
		.string()
		.min(1)
		.describe('Delivery status (e.g. Delivered, Failed)'),
	username: z
		.string()
		.min(1)
		.optional()
		.describe('ClickSend account username for tenant routing'),
	user_id: z
		.union([z.number(), z.string()])
		.optional()
		.describe('ClickSend account user ID for tenant routing'),
	status_code: z.string().optional().describe('Provider status code'),
	status_text: z.string().optional().describe('Human-readable status detail'),
	timestamp: z
		.union([z.number(), z.string()])
		.optional()
		.describe('Unix epoch seconds or ISO timestamp'),
	original_message_id: z
		.string()
		.optional()
		.describe('Original outbound message ID'),
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
		return (
			'message_id' in parsed &&
			'body' in parsed &&
			'from' in parsed &&
			'to' in parsed &&
			!('status' in parsed)
		);
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

/**
 * Verifies a ClickSend webhook request against the configured secret.
 *
 * Accepts credentials from `authorization` (Bearer or Basic), `x-clicksend-token`,
 * `x-webhook-secret`, or `secret` / `token` query parameters. Rejects requests when
 * no secret is configured unless the hub has already verified the webhook.
 */
export function verifyClickSendWebhookSignature(
	request: WebhookRequest<unknown>,
	secret?: string,
): { valid: boolean; error?: string } {
	if (request.hubVerified === true) {
		return { valid: true };
	}

	if (!secret) {
		return {
			valid: false,
			error: 'Missing webhook secret configuration',
		};
	}

	const firstValue = (
		value: string | string[] | undefined,
	): string | undefined => {
		if (Array.isArray(value)) {
			return value.find(
				(entry) => typeof entry === 'string' && entry.length > 0,
			);
		}
		return typeof value === 'string' && value.length > 0 ? value : undefined;
	};

	const headers = (request.headers ?? {}) as Record<
		string,
		string | string[] | undefined
	>;
	const query = ((
		request as unknown as {
			query?: Record<string, string | string[] | undefined>;
		}
	).query ?? {}) as Record<string, string | string[] | undefined>;

	const authHeader =
		firstValue(headers.authorization) ||
		firstValue(headers['x-clicksend-token']) ||
		firstValue(headers['x-webhook-secret']) ||
		firstValue(query.secret) ||
		firstValue(query.token);

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

	const colonIndex = token.indexOf(':');
	if (
		colonIndex !== -1 &&
		safeTimingEqual(token.slice(colonIndex + 1), secret)
	) {
		return { valid: true };
	}

	return { valid: false, error: 'Invalid webhook secret' };
}
