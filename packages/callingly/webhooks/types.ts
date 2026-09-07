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
 * Verifies Callingly webhook HMAC signatures.
 * Callingly webhook requests can deliver signatures in `x-callingly-signature`,
 * `callingly-signature`, or `x-callingly-webhook` headers.
 * Supported signature schemes:
 * - Direct HMAC-SHA256 hex/base64 digest or prefixed format (e.g. `sha256=<hash>`).
 * - Timestamped format: `t=<timestamp>,v1=<signature>` with replay protection (5 min window).
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

		// Handle timestamped headers if formatted as "t=<timestamp>,v1=<signature>"
		if (signature.includes('t=') && signature.includes('v1=')) {
			const parts = signature.split(',');
			let timestamp: string | undefined;
			let v1Sig: string | undefined;

			for (const part of parts) {
				const trimmed = part.trim();
				if (trimmed.startsWith('t=')) {
					timestamp = trimmed.slice(2);
				} else if (trimmed.startsWith('v1=')) {
					v1Sig = trimmed.slice(3);
				}
			}

			if (timestamp && v1Sig) {
				const timestampMs = Number.parseInt(timestamp, 10) * 1000;
				// Prevent replay attacks by checking timestamp tolerance (5 minutes)
				if (
					Number.isNaN(timestampMs) ||
					Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000
				) {
					return {
						valid: false,
						error: 'Webhook timestamp is outside tolerance or invalid',
					};
				}
				signature = v1Sig;
				signedPayload = `${timestamp}.${rawBody}`;
			}
		} else if (signature.startsWith('sha256=')) {
			signature = signature.slice(7);
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
