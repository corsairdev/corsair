import { createHmac, timingSafeEqual } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { z } from 'zod';

export const CallCompletedWebhookEventSchema = z
	.object({
		event: z.string().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		call_id: z.union([z.string(), z.number()]).optional(),
		lead_id: z.union([z.string(), z.number()]).optional(),
		team_id: z.union([z.string(), z.number()]).optional(),
		user_id: z.union([z.string(), z.number()]).optional(),
		phone_number: z.string().optional(),
		status: z.string().optional(),
		duration: z.number().optional(),
		recording_url: z.string().optional(),
		outcome: z.string().optional(),
		timestamp: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();

export const LeadCreatedWebhookEventSchema = z
	.object({
		event: z.string().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		lead_id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		fname: z.string().optional(),
		lname: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		phone_number: z.string().optional(),
		email: z.string().optional(),
		team_id: z.union([z.string(), z.number()]).optional(),
		timestamp: z.string().optional(),
		account_id: z.string().optional(),
	})
	.passthrough();

export type CallCompletedWebhookEvent = z.infer<
	typeof CallCompletedWebhookEventSchema
>;
export type LeadCreatedWebhookEvent = z.infer<
	typeof LeadCreatedWebhookEventSchema
>;

export type CallinglyWebhookOutputs = {
	callCompleted: CallCompletedWebhookEvent;
	leadCreated: LeadCreatedWebhookEvent;
};

export const CallinglyWebhookEventSchemas = {
	callCompleted: CallCompletedWebhookEventSchema,
	leadCreated: LeadCreatedWebhookEventSchema,
} as const;

/**
 * Verifies Callingly webhook HMAC signatures with 5-minute replay attack prevention.
 * Callingly webhook requests deliver signatures in `x-callingly-signature`,
 * `callingly-signature`, or `x-callingly-webhook` headers.
 * Supported signature schemes:
 * - Timestamped format: `t=<timestamp>,v1=<signature>` with replay protection (5 min window).
 * - Direct HMAC-SHA256 hex/base64 digest with timestamp in `x-callingly-timestamp` header or payload `timestamp`/`created_at`.
 */
export function verifyCallinglyWebhookSignature(
	// Explicit WebhookRequest<unknown> type: signature verification operates on raw headers and body bytes,
	// so the typed payload shape is intentionally unconstrained.
	request: WebhookRequest<unknown>,
	signingKey: string,
): { valid: boolean; error?: string } {
	try {
		if (!signingKey) {
			return { valid: false, error: 'Missing webhook signing key or secret' };
		}

		const rawBody = request.rawBody;
		if (typeof rawBody !== 'string') {
			return {
				valid: false,
				error: 'Missing or non-string raw body for webhook verification',
			};
		}

		const headers = request.headers;
		// Header lookup checks standard Callingly signature headers (case-insensitive)
		const rawHeader =
			headers['x-callingly-signature'] ??
			headers['callingly-signature'] ??
			headers['x-callingly-webhook'];

		const signatureHeader = Array.isArray(rawHeader)
			? rawHeader[0]
			: typeof rawHeader === 'string'
				? rawHeader
				: undefined;

		if (!signatureHeader) {
			return {
				valid: false,
				error: 'Missing Callingly webhook signature header',
			};
		}

		let signature = signatureHeader.trim();
		let signedPayload = rawBody;
		let timestampMs: number | undefined;

		// 1. Check for timestamped signature header: "t=<timestamp>,v1=<signature>"
		if (signature.includes('t=') && signature.includes('v1=')) {
			const parts = signature.split(',');
			let timestampStr: string | undefined;
			let v1Sig: string | undefined;

			for (const part of parts) {
				const trimmed = part.trim();
				if (trimmed.startsWith('t=')) {
					timestampStr = trimmed.slice(2);
				} else if (trimmed.startsWith('v1=')) {
					v1Sig = trimmed.slice(3);
				}
			}

			if (timestampStr && v1Sig) {
				const parsedSec = Number.parseInt(timestampStr, 10);
				timestampMs = Number.isNaN(parsedSec) ? undefined : parsedSec * 1000;
				signature = v1Sig;
				signedPayload = `${timestampStr}.${rawBody}`;
			}
		} else {
			// Direct signature: strip optional sha256= prefix
			if (signature.startsWith('sha256=')) {
				signature = signature.slice(7);
			}

			// For direct signatures, derive timestamp from signed payload body first
			// to prevent replay attacks using fresh header timestamps with captured bodies.
			let payloadTimestamp: unknown;
			try {
				const parsed = JSON.parse(rawBody) as Record<string, unknown>;
				if (parsed && typeof parsed === 'object') {
					payloadTimestamp =
						parsed.timestamp ?? parsed.created_at ?? parsed.event_time;
				}
			} catch {
				// Raw body is not JSON
			}

			if (payloadTimestamp) {
				const num = Number(payloadTimestamp);
				if (!Number.isNaN(num)) {
					timestampMs = num < 1e11 ? num * 1000 : num;
				} else {
					timestampMs = Date.parse(String(payloadTimestamp));
				}
			}
			// Unsigned timestamp headers are ignored so a captured body+signature
			// cannot be replayed with a fresh x-callingly-timestamp.
		}

		// Enforce replay prevention window across ALL signature schemes
		if (timestampMs === undefined || Number.isNaN(timestampMs)) {
			return {
				valid: false,
				error:
					'Missing or unparseable webhook timestamp for replay attack prevention',
			};
		}

		const now = Date.now();
		const TOLERANCE_MS = 5 * 60 * 1000; // 5 minutes
		if (Math.abs(now - timestampMs) > TOLERANCE_MS) {
			return {
				valid: false,
				error:
					'Webhook timestamp is outside 5-minute tolerance (replay attack prevention)',
			};
		}

		const expectedHex = createHmac('sha256', signingKey)
			.update(signedPayload)
			.digest('hex');
		const expectedBase64 = createHmac('sha256', signingKey)
			.update(signedPayload)
			.digest('base64');

		// Compare via timingSafeEqual for both hex and base64 encodings
		const sigHexBuf = Buffer.from(signature, 'hex');
		const expHexBuf = Buffer.from(expectedHex, 'hex');
		if (
			sigHexBuf.length === expHexBuf.length &&
			sigHexBuf.length > 0 &&
			timingSafeEqual(sigHexBuf, expHexBuf)
		) {
			return { valid: true };
		}

		const sigB64Buf = Buffer.from(signature, 'utf8');
		const expB64Buf = Buffer.from(expectedBase64, 'utf8');
		if (
			sigB64Buf.length === expB64Buf.length &&
			sigB64Buf.length > 0 &&
			timingSafeEqual(sigB64Buf, expB64Buf)
		) {
			return { valid: true };
		}

		return { valid: false, error: 'Invalid webhook signature' };
	} catch (error) {
		console.error('Callingly signature verification error:', error);
		return { valid: false, error: 'Signature verification processing error' };
	}
}
