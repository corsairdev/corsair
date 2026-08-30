import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import * as crypto from 'crypto';
import { z } from 'zod';

// ── Webhook Payload Schemas ──────────────────────────────────────────────────

export const FilloutWebhookSubmissionSchema = z
	.object({
		submissionId: z.string(),
		submissionTime: z.string(),
		lastUpdatedAt: z.string().optional(),
		questions: z.array(z.record(z.string(), z.unknown())),
		calculations: z.array(z.record(z.string(), z.unknown())).optional(),
		urlParameters: z.array(z.record(z.string(), z.unknown())).optional(),
		scheduling: z.array(z.record(z.string(), z.unknown())).optional(),
		payments: z.array(z.record(z.string(), z.unknown())).optional(),
		quiz: z.record(z.string(), z.unknown()).optional(),
		login: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type FilloutWebhookSubmission = z.infer<
	typeof FilloutWebhookSubmissionSchema
>;

export const FilloutFormSubmissionEventSchema = z
	.object({
		formId: z.string(),
		submission: FilloutWebhookSubmissionSchema,
		submissionId: z.string(),
		submissionTime: z.string(),
		eventType: z.literal('form_submission').optional(),
	})
	.loose();

export type FilloutFormSubmissionEvent = z.infer<
	typeof FilloutFormSubmissionEventSchema
>;

export type FilloutWebhookOutputs = {
	formSubmission: FilloutFormSubmissionEvent;
};

export const FilloutFormSubmissionEventPayloadSchema =
	FilloutFormSubmissionEventSchema;

// ── Utilities ────────────────────────────────────────────────────────────────

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

export function createFilloutFormSubmissionMatch(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		return (
			typeof parsedBody.formId === 'string' &&
			typeof parsedBody.submissionId === 'string'
		);
	};
}

export function verifyFilloutWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-fillout-signature'])
		? headers['x-fillout-signature'][0]
		: headers['x-fillout-signature'];

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-fillout-signature header',
		};
	}

	try {
		const expectedDigest = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');

		const expectedSignature = `sha256=${expectedDigest}`;

		const isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);

		if (!isValid) {
			return { valid: false, error: 'Invalid signature' };
		}

		return { valid: true };
	} catch {
		return { valid: false, error: 'Signature verification failed' };
	}
}
